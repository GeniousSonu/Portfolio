import 'server-only';
import crypto from 'crypto';
import { getServiceSupabase } from '@/lib/supabaseServer';

const MAX_CONTENT_LENGTH = 5000;
const SESSION_TOKEN_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours
const HMAC_SECRET =
  process.env.STUDIO_SESSION_SECRET ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'sks-space-scratchpad-secure-key-2026';

// In-memory rate limiting fallback cache in case DB table is being created
const memoryRateLimitCache = new Map();

/**
 * Server-side anti-abuse & Unicode sanitization.
 * Enforces plain-text safety, collapses stacked Zalgo spam without corrupting
 * legitimate international scripts (Bengali, Hindi, French, Arabic),
 * strips null bytes, directional overrides, and collapses character floods.
 */
export function sanitizeSpaceContent(rawText) {
  if (typeof rawText !== 'string') {
    throw new Error('Content must be a string.');
  }

  // Allow completely empty text (e.g. cleared scratchpad)
  if (rawText.length === 0) {
    return '';
  }

  let text = rawText;

  // 1. Strip null bytes and non-printable control characters (preserving \n, \r, \t)
  text = text.replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F-\u009F]/g, '');

  // 2. Targeted Zalgo stack suppression:
  // Legitimate languages (like Bengali, Hindi, French, Arabic) use 1 or 2 combining marks per character.
  // Zalgo attacks stack 4 to 30+ combining marks. We collapse 3+ stacked marks down to 2,
  // neutralizing Zalgo visual explosions while keeping international languages 100% intact.
  text = text.replace(/(\p{M}){3,}/gu, '$1$1');

  // 3. Strip directional override characters (LTR/RTL spoofing)
  text = text.replace(/[\u202A-\u202E\u2066-\u2069\u200E\u200F\u061C]/g, '');

  // 4. Collapse excessive identical character flood (> 50 identical characters -> 10)
  text = text.replace(/(.)\1{49,}/gu, '$1$1$1$1$1$1$1$1$1$1');

  // 5. Length enforcement
  if (text.length > MAX_CONTENT_LENGTH) {
    throw new Error(`Content exceeds maximum allowed limit of ${MAX_CONTENT_LENGTH} characters.`);
  }

  return text;
}

/**
 * Signs a cryptographic session token after Turnstile verification.
 * Does NOT bind to IP address, preventing cellular carrier IP rotation (CGNAT/Wi-Fi handoffs)
 * from causing false 403 lockouts on mobile phones.
 */
export function signSpaceSessionToken() {
  const payload = {
    sessionId: crypto.randomUUID(),
    exp: Date.now() + SESSION_TOKEN_TTL_MS,
    iat: Date.now(),
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', HMAC_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
}

/**
 * Validates a session token presented on save/clear calls.
 * Returns { valid, expired, sessionId }.
 */
export function verifySpaceSessionToken(token) {
  if (!token || typeof token !== 'string') {
    return { valid: false, expired: false, error: 'Session token missing' };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false, expired: false, error: 'Invalid token format' };
  }

  const [encodedPayload, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', HMAC_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  if (signature !== expectedSignature) {
    return { valid: false, expired: false, error: 'Invalid token signature' };
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    if (!payload.exp || Date.now() > payload.exp) {
      return { valid: false, expired: true, error: 'Session token expired' };
    }

    return { valid: true, expired: false, sessionId: payload.sessionId };
  } catch (e) {
    return { valid: false, expired: false, error: 'Malformed token payload' };
  }
}

/**
 * Verifies Cloudflare Turnstile token server-side.
 */
export async function verifyTurnstileToken(token, clientIp) {
  const secretKey =
    process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA';
  const isTestingKey = secretKey === '1x0000000000000000000000000000000AA';

  // In local development or when using official testing keys, allow smooth bypass if token is omitted
  if (!token) {
    if (isTestingKey || process.env.NODE_ENV !== 'production') {
      return { success: true };
    }
    return { success: false, error: 'Please complete the bot security challenge.' };
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);
    if (clientIp) {
      formData.append('remoteip', clientIp);
    }

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });

    const data = await res.json();
    if (data.success) {
      return { success: true };
    }

    const firstError = data['error-codes'] && data['error-codes'][0];

    // If Cloudflare flags secret key as invalid and user is using testing key, pass gracefully
    if (
      (firstError === 'invalid-input-secret' || firstError === 'missing-input-response') &&
      isTestingKey
    ) {
      return { success: true };
    }

    const friendlyErrorMap = {
      'missing-input-response': 'Please complete the bot verification challenge.',
      'invalid-input-response': 'Verification expired or invalid. Please try again.',
      'timeout-or-duplicate': 'Verification challenge timed out. Please try again.',
    };

    return {
      success: false,
      error: friendlyErrorMap[firstError] || 'Security check failed. Please refresh and try again.',
    };
  } catch (err) {
    console.error('[SharedSpace Turnstile] Verification error:', err.message);
    if (isTestingKey || process.env.NODE_ENV !== 'production') {
      return { success: true };
    }
    return { success: false, error: 'Verification service temporarily unreachable.' };
  }
}

/**
 * Serverless rate limit checker using public.chatbot_rate_limits table.
 */
export async function checkSpaceRateLimit(key, maxRequests, windowSeconds) {
  const now = Date.now();
  const supabase = getServiceSupabase();

  try {
    const { data: record, error: fetchError } = await supabase
      .from('chatbot_rate_limits')
      .select('count, reset_at')
      .eq('key', key)
      .single();

    if (!fetchError && record) {
      const resetTime = new Date(record.reset_at).getTime();
      if (now >= resetTime) {
        const newReset = new Date(now + windowSeconds * 1000).toISOString();
        await supabase
          .from('chatbot_rate_limits')
          .update({ count: 1, reset_at: newReset, updated_at: new Date().toISOString() })
          .eq('key', key);
        return { allowed: true, remaining: maxRequests - 1 };
      } else if (record.count < maxRequests) {
        await supabase
          .from('chatbot_rate_limits')
          .update({ count: record.count + 1, updated_at: new Date().toISOString() })
          .eq('key', key);
        return { allowed: true, remaining: maxRequests - record.count - 1 };
      } else {
        return { allowed: false, remaining: 0 };
      }
    } else if (fetchError && fetchError.code === 'PGRST116') {
      const newReset = new Date(now + windowSeconds * 1000).toISOString();
      await supabase
        .from('chatbot_rate_limits')
        .insert({ key, count: 1, reset_at: newReset, updated_at: new Date().toISOString() });
      return { allowed: true, remaining: maxRequests - 1 };
    }
  } catch (err) {
    // Graceful in-memory fallback
    const mem = memoryRateLimitCache.get(key);
    if (!mem || now >= mem.resetAt) {
      memoryRateLimitCache.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
      return { allowed: true, remaining: maxRequests - 1 };
    }
    if (mem.count < maxRequests) {
      mem.count += 1;
      return { allowed: true, remaining: maxRequests - mem.count };
    }
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: maxRequests };
}

/**
 * Retrieves the single shared document from Supabase.
 * Fails with a clear error if the table hasn't been migrated yet.
 */
export async function getSpaceDocument() {
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from('shared_space_document')
    .select('id, content, updated_at')
    .eq('id', 'default')
    .maybeSingle();

  if (error) {
    if (error.code === 'PGRST205') {
      throw new Error(
        "Database table 'shared_space_document' has not been created yet. Please execute supabase/migrations/20260909_shared_space_document.sql in your Supabase SQL Editor."
      );
    }
    throw new Error(`Failed to load shared document: ${error.message}`);
  }

  if (!data) {
    // Seed default document row
    const nowIso = new Date().toISOString();
    const { data: created, error: insertError } = await supabase
      .from('shared_space_document')
      .upsert({ id: 'default', content: '', updated_at: nowIso })
      .select('id, content, updated_at')
      .single();

    if (insertError) {
      throw new Error(`Failed to initialize shared space document: ${insertError.message}`);
    }
    return created;
  }

  return data;
}

/**
 * Updates the shared space document content.
 */
export async function updateSpaceDocument(content) {
  const supabase = getServiceSupabase();
  const nowIso = new Date().toISOString();

  const { data, error } = await supabase
    .from('shared_space_document')
    .upsert({ id: 'default', content, updated_at: nowIso })
    .select('id, content, updated_at')
    .single();

  if (error) {
    if (error.code === 'PGRST205') {
      throw new Error(
        "Database table 'shared_space_document' has not been created yet. Please execute supabase/migrations/20260909_shared_space_document.sql in your Supabase SQL Editor."
      );
    }
    throw new Error(`Failed to save document: ${error.message}`);
  }

  return data;
}

/**
 * Clears the shared space document to empty string.
 */
export async function clearSpaceDocument() {
  return updateSpaceDocument('');
}

/**
 * Backwards-compatibility alias for Telegram webhook callbacks or legacy references.
 */
export async function deleteSpaceEntry(entryId) {
  return clearSpaceDocument();
}

/**
 * Broadcasts an event to the private Realtime channel 'shared-space'.
 * Enforces infrastructure-level authorization via private: true.
 */
export async function broadcastToSpace(event, payload) {
  const supabase = getServiceSupabase();
  const channel = supabase.channel('shared-space', {
    config: {
      private: true,
      broadcast: { ack: true },
    },
  });

  return new Promise((resolve) => {
    const timeout = setTimeout(async () => {
      try {
        await supabase.removeChannel(channel);
      } catch (e) {}
      resolve({ ok: false, error: 'Broadcast timed out waiting for channel' });
    }, 4500);

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        try {
          const resp = await channel.send({
            type: 'broadcast',
            event,
            payload,
          });
          clearTimeout(timeout);
          await supabase.removeChannel(channel);
          resolve({ ok: true, resp });
        } catch (err) {
          clearTimeout(timeout);
          try {
            await supabase.removeChannel(channel);
          } catch (e) {}
          resolve({ ok: false, error: err.message });
        }
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        clearTimeout(timeout);
        try {
          await supabase.removeChannel(channel);
        } catch (e) {}
        resolve({ ok: false, error: `Channel status: ${status}` });
      }
    });
  });
}

/* ─── Instant Sync Rooms (Multi-Device Space) ─── */

const ROOM_ID_CHARSET = 'abcdefghjkmnpqrstuvwxyz23456789'; // URL-safe lowercase alphanumeric (no ambiguous 0,o,1,l)
const ROOM_TTL_HOURS = 48;

export function generateRoomId() {
  let result = '';
  const bytes = crypto.randomBytes(8);
  for (let i = 0; i < 8; i++) {
    result += ROOM_ID_CHARSET[bytes[i] % ROOM_ID_CHARSET.length];
  }
  return result;
}

/**
 * Creates a dedicated multi-device Instant Sync Room with collision retry and opportunistic cleanup.
 */
export async function createSpaceRoom() {
  const supabase = getServiceSupabase();

  // Opportunistic cleanup of expired rooms (bounded best-effort)
  supabase
    .from('shared_space_rooms')
    .delete()
    .lt('expires_at', new Date().toISOString())
    .then(() => {})
    .catch(() => {});

  let attempts = 0;
  while (attempts < 3) {
    attempts++;
    const roomId = generateRoomId();
    const nowIso = new Date().toISOString();
    const expiresAt = new Date(Date.now() + ROOM_TTL_HOURS * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('shared_space_rooms')
      .insert({
        room_id: roomId,
        content: '',
        created_at: nowIso,
        updated_at: nowIso,
        expires_at: expiresAt,
      })
      .select('room_id, created_at, updated_at, expires_at')
      .single();

    if (!error && data) {
      return { roomId: data.room_id, expiresAt: data.expires_at };
    }

    if (error && error.code === '23505') {
      // Primary key collision: retry with fresh random ID
      console.warn(`[SharedSpace] Room ID collision on "${roomId}", retrying (${attempts}/3)...`);
      continue;
    }

    if (error && error.code === 'PGRST205') {
      throw new Error(
        "Database table 'shared_space_rooms' has not been created yet. Please execute supabase/migrations/20260909_shared_space_rooms.sql in your Supabase SQL Editor."
      );
    }

    throw new Error(`Failed to create sync room: ${error.message}`);
  }

  throw new Error('Failed to generate a unique room ID after multiple attempts. Please try again.');
}

/**
 * Fetches an active Instant Sync Room.
 * Checks for expiration and returns { expired: true } or { notFound: true }.
 */
export async function getSpaceRoom(roomId) {
  if (!roomId || typeof roomId !== 'string') {
    return { notFound: true };
  }

  const supabase = getServiceSupabase();
  const cleanId = roomId.trim().toLowerCase();

  const { data, error } = await supabase
    .from('shared_space_rooms')
    .select('room_id, content, updated_at, expires_at')
    .eq('room_id', cleanId)
    .maybeSingle();

  if (error) {
    if (error.code === 'PGRST205') {
      throw new Error(
        "Database table 'shared_space_rooms' has not been created yet. Please execute supabase/migrations/20260909_shared_space_rooms.sql in your Supabase SQL Editor."
      );
    }
    throw new Error(`Failed to load room: ${error.message}`);
  }

  if (!data) {
    return { notFound: true };
  }

  if (new Date(data.expires_at).getTime() < Date.now()) {
    // Opportunistically remove expired room
    supabase.from('shared_space_rooms').delete().eq('room_id', cleanId).then(() => {}).catch(() => {});
    return { expired: true, roomId: cleanId };
  }

  return {
    roomId: data.room_id,
    content: data.content || '',
    updatedAt: data.updated_at,
    expiresAt: data.expires_at,
  };
}

/**
 * Updates content in an active Instant Sync Room and extends its 48h TTL.
 */
export async function updateSpaceRoom(roomId, content) {
  if (!roomId || typeof roomId !== 'string') {
    throw new Error('Valid roomId is required.');
  }

  const supabase = getServiceSupabase();
  const cleanId = roomId.trim().toLowerCase();
  const now = Date.now();
  const nowIso = new Date(now).toISOString();
  const extendedExpiry = new Date(now + ROOM_TTL_HOURS * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('shared_space_rooms')
    .update({
      content: content || '',
      updated_at: nowIso,
      expires_at: extendedExpiry,
    })
    .eq('room_id', cleanId)
    .gt('expires_at', nowIso) // Only update if not already expired
    .select('room_id, content, updated_at, expires_at')
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return { expired: true, roomId: cleanId };
    }
    throw new Error(`Failed to update room: ${error.message}`);
  }

  return data;
}

/**
 * Clears room scratchpad.
 */
export async function clearSpaceRoom(roomId) {
  return updateSpaceRoom(roomId, '');
}

/**
 * Broadcasts an event to an Instant Sync Room's Realtime channel: space-room:${roomId}.
 */
export async function broadcastToRoom(roomId, event, payload) {
  if (!roomId) return { ok: false, error: 'roomId required' };

  const supabase = getServiceSupabase();
  const cleanId = roomId.trim().toLowerCase();
  const channelName = `space-room:${cleanId}`;

  const channel = supabase.channel(channelName, {
    config: {
      broadcast: { ack: true },
    },
  });

  return new Promise((resolve) => {
    const timeout = setTimeout(async () => {
      try {
        await supabase.removeChannel(channel);
      } catch (e) {}
      resolve({ ok: false, error: 'Broadcast timed out waiting for room channel' });
    }, 4500);

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        try {
          const resp = await channel.send({
            type: 'broadcast',
            event,
            payload,
          });
          clearTimeout(timeout);
          await supabase.removeChannel(channel);
          resolve({ ok: true, resp });
        } catch (err) {
          clearTimeout(timeout);
          try {
            await supabase.removeChannel(channel);
          } catch (e) {}
          resolve({ ok: false, error: err.message });
        }
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        clearTimeout(timeout);
        try {
          await supabase.removeChannel(channel);
        } catch (e) {}
        resolve({ ok: false, error: `Room channel status: ${status}` });
      }
    });
  });
}

