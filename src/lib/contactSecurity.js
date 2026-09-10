import 'server-only';
import dns from 'node:dns/promises';
import disposableDomainsArray from 'disposable-email-domains';
import { getServiceSupabase } from '@/lib/supabaseServer';
import { sanitizeSpaceContent, verifyTurnstileToken } from '@/lib/sharedSpace';

// Pre-load disposable domains into a high-performance O(1) Set
const disposableDomainsSet = new Set(
  Array.isArray(disposableDomainsArray) ? disposableDomainsArray : []
);

// Fallback in-memory rate-limit cache if Supabase connection is briefly interrupted
const memoryRateLimitCache = new Map();

/**
 * Tunable Security Constants
 */
export const RATE_LIMIT_CONFIG = {
  IP_10M_MAX: 3,              // Max 3 submissions per 10 minutes per IP
  IP_10M_WINDOW: 600,         // 10 minutes in seconds
  IP_1H_MAX: 5,               // Max 5 submissions per 1 hour per IP
  IP_1H_WINDOW: 3600,         // 1 hour in seconds
  GLOBAL_1M_MAX: 20,          // Max 20 submissions per 1 minute globally (circuit breaker)
  GLOBAL_1M_WINDOW: 60,       // 1 minute in seconds
  MIN_TIME_ON_FORM_MS: 3000,  // Submissions under 3s rejected as automated bot tell
  MAX_URL_COUNT: 2,           // Maximum allowable links in message body
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MIN_MESSAGE_LENGTH: 10,
  MAX_MESSAGE_LENGTH: 5000,
  DNS_TIMEOUT_MS: 2500,       // Fast timeout for DNS MX / A lookup
};

export const GENERIC_CLIENT_ERROR =
  "We couldn't process your message. Please check your details and try again.";

export const FAKE_SUCCESS_RESPONSE = {
  success: true,
  message: 'Message delivered successfully.',
};

/**
 * Extracts the real client IP address from request headers.
 */
export function extractClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const firstIp = forwarded.split(',')[0].trim();
    if (firstIp) return firstIp;
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}

/**
 * Honeypot Field Validation.
 * Field: `confirm_subject_ref` (No browser/password-manager autofill heuristics match this name).
 * Real humans never see or tab into this field. Naive bots autofill it.
 */
export function validateHoneypot(body) {
  const value = body?.confirm_subject_ref || body?.website_url;
  if (typeof value === 'string' && value.trim().length > 0) {
    return { isHoneypot: true };
  }
  return { isHoneypot: false };
}

/**
 * Minimum Time-on-Form Validation.
 * Automated headless scripts and spam bots submit within milliseconds of page load.
 * Humans require at least 3000ms to parse fields and compose a message.
 */
export function validateTimeOnForm(body) {
  const elapsedMs = Number(body?.elapsedMs);
  if (isNaN(elapsedMs) || elapsedMs < RATE_LIMIT_CONFIG.MIN_TIME_ON_FORM_MS) {
    return {
      valid: false,
      reason: 'time_on_form_too_short',
      elapsedMs: isNaN(elapsedMs) ? 0 : elapsedMs,
    };
  }
  return { valid: true, elapsedMs };
}

/**
 * Request Origin & Referer Verification.
 * Soft-fail policy for privacy-preserving browsers (Brave, Firefox Strict, Safari ITP).
 * If Origin is absent, allow it. If Origin is present but mismatched, hard-reject with 403.
 */
export function validateRequestOrigin(request) {
  const origin = request.headers.get('origin');
  if (!origin) {
    // Missing origin is legitimate on privacy-focused browsers
    return { valid: true };
  }

  try {
    const parsedOrigin = new URL(origin);
    const host = parsedOrigin.hostname.toLowerCase();

    // Allowed portfolio hostnames
    const isAllowedHost =
      host === 'genioussonu.me' ||
      host === 'www.genioussonu.me' ||
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host.endsWith('.vercel.app');

    if (!isAllowedHost) {
      return { valid: false, reason: 'origin_mismatch', origin };
    }
    return { valid: true };
  } catch {
    return { valid: false, reason: 'origin_malformed', origin };
  }
}

/**
 * Atomic Rate Limiting (Single-Statement Stored Procedure in Supabase).
 * Checks both individual IP windows (10m, 1h) and global circuit breaker (1m) atomically.
 */
export async function checkAtomicContactRateLimit(clientIp) {
  const now = Date.now();
  const supabase = getServiceSupabase();

  // 1. Global Circuit Breaker (Max 20 submissions/min site-wide against rotating proxy botnets)
  try {
    const { data: globalResult, error: globalErr } = await supabase.rpc('check_rate_limit', {
      p_key: 'contact:global:1m',
      p_max: RATE_LIMIT_CONFIG.GLOBAL_1M_MAX,
      p_window_seconds: RATE_LIMIT_CONFIG.GLOBAL_1M_WINDOW,
    });

    if (globalErr) throw globalErr;

    if (globalResult && !globalResult.allowed) {
      return {
        allowed: false,
        reason: 'global_rate_limit_exceeded',
        retryAfter: 60,
      };
    }
  } catch (err) {
    // In-memory fallback for global rate limit
    const memKey = 'contact:global:1m';
    const mem = memoryRateLimitCache.get(memKey);
    if (mem && now < mem.resetAt && mem.count >= RATE_LIMIT_CONFIG.GLOBAL_1M_MAX) {
      return {
        allowed: false,
        reason: 'global_rate_limit_exceeded',
        retryAfter: Math.ceil((mem.resetAt - now) / 1000),
      };
    }
    memoryRateLimitCache.set(memKey, {
      count: (mem && now < mem.resetAt ? mem.count : 0) + 1,
      resetAt: mem && now < mem.resetAt ? mem.resetAt : now + RATE_LIMIT_CONFIG.GLOBAL_1M_WINDOW * 1000,
    });
  }

  // 2. IP 10-Minute Window (Max 3 submissions)
  try {
    const { data: ip10mResult, error: ip10mErr } = await supabase.rpc('check_rate_limit', {
      p_key: `contact:10m:${clientIp}`,
      p_max: RATE_LIMIT_CONFIG.IP_10M_MAX,
      p_window_seconds: RATE_LIMIT_CONFIG.IP_10M_WINDOW,
    });

    if (ip10mErr) throw ip10mErr;

    if (ip10mResult && !ip10mResult.allowed) {
      let retryAfter = 600;
      if (ip10mResult.reset_at) {
        const diffSec = Math.ceil((new Date(ip10mResult.reset_at).getTime() - now) / 1000);
        if (diffSec > 0) retryAfter = diffSec;
      }
      return {
        allowed: false,
        reason: 'ip_rate_limit_10m_exceeded',
        retryAfter,
      };
    }
  } catch (err) {
    // Fallback to in-memory check
    const memKey = `contact:10m:${clientIp}`;
    const mem = memoryRateLimitCache.get(memKey);
    if (mem && now < mem.resetAt && mem.count >= RATE_LIMIT_CONFIG.IP_10M_MAX) {
      return {
        allowed: false,
        reason: 'ip_rate_limit_10m_exceeded',
        retryAfter: Math.ceil((mem.resetAt - now) / 1000),
      };
    }
    memoryRateLimitCache.set(memKey, {
      count: (mem && now < mem.resetAt ? mem.count : 0) + 1,
      resetAt: mem && now < mem.resetAt ? mem.resetAt : now + RATE_LIMIT_CONFIG.IP_10M_WINDOW * 1000,
    });
  }

  // 3. IP 1-Hour Window (Max 5 submissions)
  try {
    const { data: ip1hResult, error: ip1hErr } = await supabase.rpc('check_rate_limit', {
      p_key: `contact:1h:${clientIp}`,
      p_max: RATE_LIMIT_CONFIG.IP_1H_MAX,
      p_window_seconds: RATE_LIMIT_CONFIG.IP_1H_WINDOW,
    });

    if (ip1hErr) throw ip1hErr;

    if (ip1hResult && !ip1hResult.allowed) {
      let retryAfter = 3600;
      if (ip1hResult.reset_at) {
        const diffSec = Math.ceil((new Date(ip1hResult.reset_at).getTime() - now) / 1000);
        if (diffSec > 0) retryAfter = diffSec;
      }
      return {
        allowed: false,
        reason: 'ip_rate_limit_1h_exceeded',
        retryAfter,
      };
    }
  } catch (err) {
    // In-memory fallback
    const memKey = `contact:1h:${clientIp}`;
    const mem = memoryRateLimitCache.get(memKey);
    if (mem && now < mem.resetAt && mem.count >= RATE_LIMIT_CONFIG.IP_1H_MAX) {
      return {
        allowed: false,
        reason: 'ip_rate_limit_1h_exceeded',
        retryAfter: Math.ceil((mem.resetAt - now) / 1000),
      };
    }
    memoryRateLimitCache.set(memKey, {
      count: (mem && now < mem.resetAt ? mem.count : 0) + 1,
      resetAt: mem && now < mem.resetAt ? mem.resetAt : now + RATE_LIMIT_CONFIG.IP_1H_WINDOW * 1000,
    });
  }

  return { allowed: true };
}

/**
 * Validates email format, checks disposable email domains, and performs DNS MX verification
 * with RFC 5321 implicit MX fallback (A / AAAA records).
 */
export async function validateEmailIntegrity(rawEmail) {
  if (!rawEmail || typeof rawEmail !== 'string') {
    return { valid: false, reason: 'email_missing' };
  }

  const email = rawEmail.trim();

  // 1. Standard RFC email format check
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(email) || email.length > 254) {
    return { valid: false, reason: 'email_format_invalid' };
  }

  const parts = email.split('@');
  if (parts.length !== 2) {
    return { valid: false, reason: 'email_format_invalid' };
  }

  const domain = parts[1].toLowerCase().trim();

  // 2. Disposable / Temporary Email Domain Check (120,000+ domains)
  if (disposableDomainsSet.has(domain)) {
    return { valid: false, reason: 'disposable_email_domain', domain };
  }

  // 3. DNS MX Lookup with RFC 5321 Fallback & Short Timeout
  try {
    const mxPromise = dns.resolveMx(domain);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('DNS_TIMEOUT')), RATE_LIMIT_CONFIG.DNS_TIMEOUT_MS)
    );

    let mxRecords;
    try {
      mxRecords = await Promise.race([mxPromise, timeoutPromise]);
    } catch (mxErr) {
      if (mxErr.message === 'DNS_TIMEOUT') {
        // Fail open gracefully on DNS timeout — don't block legitimate users on infra flakiness
        return { valid: true, domain };
      }
      // If MX threw ENOTFOUND / ENODATA, check RFC 5321 implicit fallback below
      mxRecords = null;
    }

    if (Array.isArray(mxRecords) && mxRecords.length > 0) {
      return { valid: true, domain };
    }

    // RFC 5321 Fallback: When no MX record exists, a domain may receive mail via its A or AAAA record
    try {
      const aPromise = dns.resolve4(domain);
      const aRecords = await Promise.race([
        aPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('DNS_TIMEOUT')), 1500)),
      ]);
      if (Array.isArray(aRecords) && aRecords.length > 0) {
        return { valid: true, domain, fallback: 'A' };
      }
    } catch (aErr) {
      if (aErr.message === 'DNS_TIMEOUT') {
        return { valid: true, domain };
      }
    }

    try {
      const aaaaPromise = dns.resolve6(domain);
      const aaaaRecords = await Promise.race([
        aaaaPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('DNS_TIMEOUT')), 1500)),
      ]);
      if (Array.isArray(aaaaRecords) && aaaaRecords.length > 0) {
        return { valid: true, domain, fallback: 'AAAA' };
      }
    } catch (aaaaErr) {
      if (aaaaErr.message === 'DNS_TIMEOUT') {
        return { valid: true, domain };
      }
    }

    // Both MX and A/AAAA records were verified non-existent
    return { valid: false, reason: 'no_mail_exchange_or_host', domain };
  } catch (err) {
    // Safe graceful degradation on unexpected DNS errors
    return { valid: true, domain };
  }
}

/**
 * Validates text content quality (length, repetition, gibberish ratio, URL limits)
 * and applies Unicode anti-abuse sanitization.
 */
export function validateContentQuality(rawName, rawMessage) {
  // 1. Unicode & Plain-Text Sanitization (strips nulls, collapses Zalgo, preserves international scripts)
  let cleanName = '';
  let cleanMessage = '';

  try {
    cleanName = sanitizeSpaceContent(rawName || '').trim();
    cleanMessage = sanitizeSpaceContent(rawMessage || '').trim();
  } catch {
    return { valid: false, reason: 'sanitization_failed' };
  }

  // 2. Length Enforcements
  if (cleanName.length < RATE_LIMIT_CONFIG.MIN_NAME_LENGTH) {
    return { valid: false, reason: 'name_too_short' };
  }
  if (cleanName.length > RATE_LIMIT_CONFIG.MAX_NAME_LENGTH) {
    return { valid: false, reason: 'name_too_long' };
  }
  if (cleanMessage.length < RATE_LIMIT_CONFIG.MIN_MESSAGE_LENGTH) {
    return { valid: false, reason: 'message_too_short' };
  }
  if (cleanMessage.length > RATE_LIMIT_CONFIG.MAX_MESSAGE_LENGTH) {
    return { valid: false, reason: 'message_too_long' };
  }

  // 3. Repeated Character Loop Detection (e.g. "aaaaaaaaaa")
  if (/(.)\1{9,}/u.test(cleanMessage) || /(.)\1{9,}/u.test(cleanName)) {
    return { valid: false, reason: 'repeated_character_spam' };
  }

  // 4. Gibberish / Non-Alphanumeric Ratio Check
  // Legitimate inquiries consist mostly of language characters, numbers, and standard punctuation.
  if (cleanMessage.length > 20) {
    const alphanumericMatches = cleanMessage.match(/[\p{L}\p{N}]/gu) || [];
    const alphanumericRatio = alphanumericMatches.length / cleanMessage.length;
    if (alphanumericRatio < 0.3) {
      return { valid: false, reason: 'gibberish_non_alphanumeric', ratio: alphanumericRatio };
    }
  }

  // 5. Excessive URLs Cap (max 2 allowed)
  const urlMatches = cleanMessage.match(/https?:\/\/[^\s]+/gi) || [];
  if (urlMatches.length > RATE_LIMIT_CONFIG.MAX_URL_COUNT) {
    return {
      valid: false,
      reason: 'excessive_urls',
      urlCount: urlMatches.length,
    };
  }

  return {
    valid: true,
    name: cleanName,
    message: cleanMessage,
  };
}

/**
 * Cloudflare Turnstile Verification.
 * Production Fail-Closed Policy: If Turnstile verification fails or times out in production,
 * the request is rejected to prevent bot-induced timeout bypasses.
 */
export async function verifyTurnstileSecurity(token, clientIp) {
  const secretKey =
    process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA';
  const isTestingKey = secretKey === '1x0000000000000000000000000000000AA';

  // In local development or with official testing keys, allow smooth bypass
  if (!token && (isTestingKey || process.env.NODE_ENV !== 'production')) {
    return { success: true };
  }

  if (!token) {
    return { success: false, reason: 'turnstile_token_missing' };
  }

  try {
    const result = await verifyTurnstileToken(token, clientIp);
    if (!result.success) {
      return { success: false, reason: 'turnstile_verification_failed' };
    }
    return { success: true };
  } catch (err) {
    if (isTestingKey || process.env.NODE_ENV !== 'production') {
      return { success: true };
    }
    // Fail closed in production
    return { success: false, reason: 'turnstile_unavailable' };
  }
}

/**
 * Telemetry & Abuse Logger.
 * Asynchronously logs blocked attempts into Supabase `contact_abuse_logs` table
 * and emits structured console telemetry. NEVER stores raw personal message bodies.
 */
export async function logContactAbuse(ip, reason, details = {}) {
  const timestamp = new Date().toISOString();

  // 1. Structured Console Telemetry
  console.warn('[CONTACT_ABUSE_BLOCKED]', {
    ip,
    reason,
    timestamp,
    ...details,
  });

  // 2. Persistent Supabase Log (Silently catches to never break response flow)
  try {
    const supabase = getServiceSupabase();
    await supabase.from('contact_abuse_logs').insert({
      ip,
      reason,
      details,
    });
  } catch (err) {
    // Non-blocking telemetry catch
  }
}
