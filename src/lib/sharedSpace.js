import 'server-only';
import { getServiceSupabase } from '@/lib/supabaseServer';

const MAX_CONTENT_LENGTH = 2000;
const MAX_UNBROKEN_TOKEN_LENGTH = 250;
const ENTRY_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// In-memory rate limiting fallback cache in case DB table is being created
const memoryRateLimitCache = new Map();

/**
 * Strips HTML tags safely for Telegram/notification text preview.
 */
function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Server-side anti-abuse & Unicode sanitization.
 * Enforces plain-text safety, strips Zalgo spam, directional overrides, control chars,
 * and collapses excessive identical character flood.
 */
export function sanitizeSpaceContent(rawText) {
  if (typeof rawText !== 'string') {
    throw new Error('Content must be a string.');
  }

  let text = rawText.trim();
  if (!text) {
    throw new Error('Content cannot be empty.');
  }

  // 1. Strip null bytes and non-printable control characters (except newline, carriage return, and tab)
  text = text.replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F-\u009F]/g, '');

  // 2. Strip Unicode combining diacritical marks (Zalgo text spam)
  text = text.replace(/\p{M}/gu, '');

  // 3. Strip directional override characters (LTR/RTL spoofing / bidi manipulation)
  text = text.replace(/[\u202A-\u202E\u2066-\u2069\u200E\u200F\u061C]/g, '');

  // 4. Collapse excessive identical character flood (> 50 identical characters -> 10)
  text = text.replace(/(.)\1{49,}/gu, '$1$1$1$1$1$1$1$1$1$1');

  text = text.trim();

  // 5. Length enforcement
  if (text.length === 0) {
    throw new Error('Content cannot be empty after sanitization.');
  }

  if (text.length > MAX_CONTENT_LENGTH) {
    throw new Error(`Content exceeds maximum allowed limit of ${MAX_CONTENT_LENGTH} characters.`);
  }

  // 6. Check unbroken token length to prevent UI horizontal blowout
  const tokens = text.split(/\s+/);
  for (const token of tokens) {
    if (token.length > MAX_UNBROKEN_TOKEN_LENGTH) {
      throw new Error(
        `Content contains an unbroken sequence longer than ${MAX_UNBROKEN_TOKEN_LENGTH} characters. Please add whitespace or line breaks.`
      );
    }
  }

  return text;
}

/**
 * Verifies Cloudflare Turnstile token server-side.
 * Includes graceful development fallback when test keys are used.
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
    if ((firstError === 'invalid-input-secret' || firstError === 'missing-input-response') && isTestingKey) {
      console.warn('[SharedSpace Turnstile] Test secret bypass in development/testing mode.');
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
 * Falls back to memory cache if table is not yet created.
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
 * Background cleanup for expired space entries (> 24 hours).
 */
export async function cleanupExpiredEntries() {
  try {
    const supabase = getServiceSupabase();
    const cutoff = new Date(Date.now() - ENTRY_TTL_MS).toISOString();
    await supabase.from('shared_space_entries').delete().lt('created_at', cutoff);
  } catch (e) {
    // Non-blocking background notice
  }
}

/**
 * Background cleanup for expired rate limits (> 1 hour past reset).
 */
export async function cleanupExpiredRateLimits() {
  try {
    const supabase = getServiceSupabase();
    const cutoff = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    await supabase.from('chatbot_rate_limits').delete().lt('reset_at', cutoff);
  } catch (e) {
    // Non-blocking background notice
  }
}

/**
 * Retrieves the latest entries, capped at 100.
 */
export async function getSpaceEntries(limit = 100) {
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from('shared_space_entries')
    .select('id, content, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    if (error.code === 'PGRST205') {
      throw new Error(
        "Database table 'shared_space_entries' has not been created yet. Please execute supabase/migrations/20260905_shared_space_entries.sql in your Supabase SQL Editor."
      );
    }
    throw new Error(`Failed to load space entries: ${error.message}`);
  }

  return data || [];
}

/**
 * Inserts a new entry using privileged service role client.
 */
export async function createSpaceEntry(content) {
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from('shared_space_entries')
    .insert({ content })
    .select('id, content, created_at')
    .single();

  if (error) {
    if (error.code === 'PGRST205') {
      throw new Error(
        "Database table 'shared_space_entries' has not been created yet. Please execute supabase/migrations/20260905_shared_space_entries.sql in your Supabase SQL Editor."
      );
    }
    throw new Error(`Failed to save space entry: ${error.message}`);
  }

  return data;
}

/**
 * Deletes an individual entry by ID.
 */
export async function deleteSpaceEntry(id) {
  const supabase = getServiceSupabase();
  const { error } = await supabase.from('shared_space_entries').delete().eq('id', id);

  if (error) {
    throw new Error(`Failed to delete entry: ${error.message}`);
  }
}

/**
 * Fetches an individual entry by ID (for moderation/reporting).
 */
export async function getSpaceEntryById(id) {
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from('shared_space_entries')
    .select('id, content, created_at')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }
  return data;
}

/**
 * Wipes all entries from the shared space table.
 */
export async function clearAllSpaceEntries() {
  const supabase = getServiceSupabase();
  // In Supabase/PostgREST, delete without WHERE is rejected unless explicit neq or gt is used
  const { error } = await supabase
    .from('shared_space_entries')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (error) {
    throw new Error(`Failed to clear space: ${error.message}`);
  }
}

/**
 * Broadcasts an event to the private Realtime channel 'shared-space'.
 * Configured with private: true for infrastructure-level authorization.
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

/**
 * Forwards every newly pasted entry to Sonu's Telegram for moderation,
 * equipped with an instant inline "🗑 Delete Entry" button.
 */
export async function notifyTelegramNewSpaceEntry(entry, clientIp = 'Unknown') {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId || !entry) return;

  const istTime = new Date(entry.created_at || Date.now()).toLocaleTimeString('en-US', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const previewSnippet =
    entry.content.length > 400
      ? entry.content.slice(0, 400) + '... [truncated]'
      : entry.content;

  const htmlMessage =
    `📋 <b>New Shared Space Paste</b>\n` +
    `<b>ID:</b> <code>${entry.id}</code>\n` +
    `<b>Time:</b> ${istTime} IST\n` +
    `<b>IP:</b> <code>${clientIp}</code>\n\n` +
    `<b>Content:</b>\n<pre>${escapeHtml(previewSnippet)}</pre>\n\n` +
    `<i>Tap below to instantly remove this paste from the live site:</i>`;

  const inlineKeyboard = {
    inline_keyboard: [
      [
        {
          text: '🗑 Delete Entry',
          callback_data: `space_del:${entry.id}`,
        },
      ],
    ],
  };

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: htmlMessage,
        parse_mode: 'HTML',
        reply_markup: inlineKeyboard,
      }),
    });
  } catch (e) {
    console.warn('[SharedSpace Telegram] Notification error:', e.message);
  }
}

/**
 * Forwards visitor reports to Sonu's Telegram with instant deletion action.
 */
export async function notifyTelegramReportedEntry(entry, clientIp = 'Unknown', reason = 'Inappropriate content') {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId || !entry) return;

  const istTime = new Date().toLocaleTimeString('en-US', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const previewSnippet =
    entry.content.length > 300
      ? entry.content.slice(0, 300) + '... [truncated]'
      : entry.content;

  const htmlMessage =
    `🚨 <b>Shared Space Entry Reported by Visitor!</b>\n` +
    `<b>Entry ID:</b> <code>${entry.id}</code>\n` +
    `<b>Reason:</b> ${escapeHtml(reason)}\n` +
    `<b>Time:</b> ${istTime} IST\n` +
    `<b>Reporter IP:</b> <code>${clientIp}</code>\n\n` +
    `<b>Reported Content:</b>\n<pre>${escapeHtml(previewSnippet)}</pre>\n\n` +
    `<i>Tap below to permanently delete this entry immediately:</i>`;

  const inlineKeyboard = {
    inline_keyboard: [
      [
        {
          text: '🗑 Delete Reported Entry Immediately',
          callback_data: `space_del:${entry.id}`,
        },
      ],
    ],
  };

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: htmlMessage,
        parse_mode: 'HTML',
        reply_markup: inlineKeyboard,
      }),
    });
  } catch (e) {
    console.warn('[SharedSpace Telegram] Report alert error:', e.message);
  }
}
