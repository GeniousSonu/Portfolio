import { Resend } from 'resend';

let _resendInstance = null;

/**
 * Lazy-initialized Resend client.
 * Avoids crashing at build time when RESEND_API_KEY is unavailable
 * (e.g. during Vercel page data collection).
 * The client is only instantiated on first use inside a request handler.
 */
export function getResend() {
  if (_resendInstance) return _resendInstance;

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error(
      'Missing RESEND_API_KEY environment variable. ' +
      'Add it to your Vercel Environment Variables dashboard.'
    );
  }

  _resendInstance = new Resend(key);
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
