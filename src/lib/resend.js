import { Resend } from 'resend';
import fs from 'node:fs';
import path from 'node:path';

let _resendInstance = null;

/**
 * Retrieves the RESEND_API_KEY from process.env or falls back to reading .env.local dynamically.
 * This prevents runtime failures when a developer adds/updates credentials without restarting `next dev`.
 */
export function getResendApiKey() {
  if (process.env.RESEND_API_KEY) {
    return process.env.RESEND_API_KEY;
  }

  // Hot-reload fallback: dynamically inspect .env.local if dev server wasn't rebooted
  try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(/^\s*RESEND_API_KEY\s*=\s*(.+?)\s*$/m);
      if (match && match[1]) {
        const val = match[1].trim().replace(/^["']|["']$/g, '');
        process.env.RESEND_API_KEY = val;
        return val;
      }
    }
  } catch {}

  return null;
}

/**
 * Lazy-initialized Resend client.
 * Avoids crashing at build time when RESEND_API_KEY is unavailable
 * (e.g. during Vercel page data collection).
 * The client is only instantiated on first use inside a request handler.
 */
export function getResend() {
  const key = getResendApiKey();
  if (!key) {
    throw new Error(
      'Missing RESEND_API_KEY environment variable. ' +
      'Add it to your Vercel Environment Variables dashboard or .env.local.'
    );
  }

  if (!_resendInstance) {
    _resendInstance = new Resend(key);
  }
  return _resendInstance;
}

/**
 * @deprecated Use getResend() instead for lazy initialization.
 * Kept for backwards compatibility — resolves to a proxy that
 * delegates to the lazily-created instance.
 */
export const resend = new Proxy({}, {
  get(_, prop) {
    return getResend()[prop];
  },
});
