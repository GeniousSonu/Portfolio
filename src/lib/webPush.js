import 'server-only';
import crypto from 'crypto';
import webpush from 'web-push';
import { getServiceSupabase } from '@/lib/supabaseServer';

const HMAC_SECRET =
  process.env.STUDIO_SESSION_SECRET ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'sks-live-chat-push-secret-2026';

let isVapidInitialized = false;

function ensureVapidConfig() {
  if (isVapidInitialized) return true;

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || 'mailto:contact@genioussonu.me';

  if (!publicKey || !privateKey) {
    console.warn('[WebPush] VAPID keys not configured in environment.');
    return false;
  }

  try {
    webpush.setVapidDetails(subject, publicKey, privateKey);
    isVapidInitialized = true;
    return true;
  } catch (err) {
    console.error('[WebPush] Failed to initialize VAPID details:', err.message);
    return false;
  }
}

/**
 * Strict SSRF protection on client-supplied push endpoint URLs.
 * Rejects non-https, IP literals (including link-local and cloud metadata 169.254.169.254),
 * and only permits verified major browser push gateway hostnames.
 */
export function isValidPushEndpoint(endpointUrl) {
  if (!endpointUrl || typeof endpointUrl !== 'string') return false;

  try {
    const parsed = new URL(endpointUrl);

    // 1. Must be secure HTTPS
    if (parsed.protocol !== 'https:') return false;

    // 2. Reject credentials or port tricks
    if (parsed.username || parsed.password) return false;
    if (parsed.port && parsed.port !== '443') return false;

    const host = parsed.hostname.toLowerCase();

    // 3. Reject any IP addresses (IPv4 or IPv6 literals) or localhost
    if (
      host === 'localhost' ||
      host.endsWith('.local') ||
      /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(host) ||
      host.includes(':') ||
      host.startsWith('127.') ||
      host.startsWith('10.') ||
      host.startsWith('192.168.') ||
      host.startsWith('169.254.')
    ) {
      return false;
    }

    // 4. Strict Allowlist of legitimate browser push service hosts
    const isGoogleFcm = host === 'fcm.googleapis.com';
    const isMozilla = host === 'updates.push.services.mozilla.com';
    const isApple = host.endsWith('.push.apple.com');
    const isMicrosoft = host.endsWith('.notify.windows.com');

    return isGoogleFcm || isMozilla || isApple || isMicrosoft;
  } catch {
    return false;
  }
}

/**
 * Signs an HMAC session token verifying caller ownership of a live chat sessionId.
 */
export function signLiveChatSessionToken(sessionId) {
  if (!sessionId || typeof sessionId !== 'string') {
    throw new Error('sessionId is required to generate session token');
  }

  const payload = {
    sessionId,
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24-hour validity
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', HMAC_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
}

/**
 * Verifies an HMAC session token presented on push subscription registration.
 */
export function verifyLiveChatSessionToken(token, expectedSessionId) {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'Session token missing' };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false, error: 'Invalid token format' };
  }

  const [encodedPayload, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', HMAC_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  if (signature !== expectedSignature) {
    return { valid: false, error: 'Invalid session token signature' };
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    if (!payload.exp || Date.now() > payload.exp) {
      return { valid: false, error: 'Session token expired' };
    }
    if (payload.sessionId !== expectedSessionId) {
      return { valid: false, error: 'Session token does not match sessionId' };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: 'Malformed token payload' };
  }
}

/**
 * Stores or updates a push subscription tied to a live chat session.
 */
export async function savePushSubscription(sessionId, subscription) {
  if (!sessionId || !subscription) {
    throw new Error('sessionId and subscription are required.');
  }

  if (!isValidPushEndpoint(subscription.endpoint)) {
    throw new Error('Push endpoint failed SSRF security validation.');
  }

  if (!subscription.keys?.p256dh || !subscription.keys?.auth) {
    throw new Error('Subscription encryption keys missing.');
  }

  const supabase = getServiceSupabase();
  const endpoint = subscription.endpoint;

  const { data, error } = await supabase
    .from('push_subscriptions')
    .upsert(
      {
        session_id: sessionId,
        subscription,
        created_at: new Date().toISOString(),
      },
      {
        onConflict: 'session_id,subscription->>endpoint',
        ignoreDuplicates: false,
      }
    )
    .select('id, session_id, created_at')
    .single();

  if (error) {
    // If migration table hasn't been created yet, log clear diagnostic
    if (error.code === 'PGRST205') {
      console.warn(
        "[WebPush] Table 'push_subscriptions' does not exist yet. Please execute supabase/migrations/20260909_push_subscriptions.sql"
      );
      return { id: 'fallback-memory', session_id: sessionId };
    }
    throw new Error(`Failed to save push subscription: ${error.message}`);
  }

  return data;
}

/**
 * Sends a privacy-preserving web push notification when Sonu replies.
 * Handles 410 Gone / 404 Not Found by pruning expired subscriptions.
 */
export async function sendLiveChatPushNotification(sessionId) {
  if (!sessionId) return { success: false, error: 'sessionId required' };
  if (!ensureVapidConfig()) return { success: false, error: 'VAPID not configured' };

  const supabase = getServiceSupabase();

  try {
    const { data: subs, error } = await supabase
      .from('push_subscriptions')
      .select('id, subscription')
      .eq('session_id', sessionId);

    if (error) {
      console.warn('[WebPush] Error querying subscriptions for session:', error.message);
      return { success: false, error: error.message };
    }

    if (!subs || subs.length === 0) {
      return { success: true, count: 0 };
    }

    // Privacy-preserving notification payload (no sensitive message content leaked on lock screen)
    const payload = JSON.stringify({
      title: 'SK Sahinur Islam (Sonu)',
      body: 'You have a new reply in live chat 💬',
      url: `/?chat_session=${encodeURIComponent(sessionId)}`,
      tag: `live-chat-${sessionId}`,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
    });

    const sendPromises = subs.map(async ({ id, subscription }) => {
      // Re-validate endpoint before network dispatch
      if (!isValidPushEndpoint(subscription?.endpoint)) {
        console.warn(`[WebPush] Pruning subscription ${id} with invalid endpoint:`, subscription?.endpoint);
        await supabase.from('push_subscriptions').delete().eq('id', id).catch(() => {});
        return;
      }

      try {
        await webpush.sendNotification(subscription, payload);
      } catch (err) {
        const statusCode = err?.statusCode;
        // 410 Gone or 404 Not Found indicates the client has revoked permission or uninstalled
        if (statusCode === 410 || statusCode === 404) {
          console.log(`[WebPush] Subscription ${id} expired (${statusCode}). Pruning from database.`);
          await supabase.from('push_subscriptions').delete().eq('id', id).catch(() => {});
        } else {
          console.warn(`[WebPush] Failed sending push to subscription ${id} (status: ${statusCode}):`, err.message);
        }
      }
    });

    await Promise.allSettled(sendPromises);
    return { success: true, count: subs.length };
  } catch (err) {
    console.error('[WebPush] Unexpected error in sendLiveChatPushNotification:', err);
    return { success: false, error: err.message };
  }
}
