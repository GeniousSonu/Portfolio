import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('server-only', () => ({}));

import {
  validateHoneypot,
  validateTimeOnForm,
  validateRequestOrigin,
  validateContentQuality,
  verifyTurnstileSecurity,
  validateEmailIntegrity,
  RATE_LIMIT_CONFIG,
} from '@/lib/contactSecurity';

describe('Contact Security Protocol', () => {
  describe('validateHoneypot', () => {
    it('passes when honeypot fields are empty or undefined', () => {
      expect(validateHoneypot({})).toEqual({ isHoneypot: false });
      expect(validateHoneypot({ confirm_subject_ref: '' })).toEqual({ isHoneypot: false });
      expect(validateHoneypot({ website_url: '' })).toEqual({ isHoneypot: false });
    });

    it('traps bots that fill the honeypot field', () => {
      expect(validateHoneypot({ confirm_subject_ref: 'bot input' })).toEqual({ isHoneypot: true });
      expect(validateHoneypot({ website_url: 'https://spam.com' })).toEqual({ isHoneypot: true });
    });
  });

  describe('validateTimeOnForm', () => {
    it('rejects submissions made under 3000ms', () => {
      const result = validateTimeOnForm({ elapsedMs: 1200 });
      expect(result.valid).toBe(false);
      expect(result.reason).toBe('time_on_form_too_short');
    });

    it('accepts legitimate human submissions over 3000ms', () => {
      const result = validateTimeOnForm({ elapsedMs: 4500 });
      expect(result.valid).toBe(true);
      expect(result.elapsedMs).toBe(4500);
    });
  });

  describe('validateRequestOrigin', () => {
    it('allows requests from valid portfolio domains', () => {
      const createMockReq = (origin) => ({
        headers: new Headers(origin ? { origin } : {}),
      });

      expect(validateRequestOrigin(createMockReq('https://genioussonu.me')).valid).toBe(true);
      expect(validateRequestOrigin(createMockReq('https://www.genioussonu.me')).valid).toBe(true);
      expect(validateRequestOrigin(createMockReq('http://localhost:3000')).valid).toBe(true);
      expect(validateRequestOrigin(createMockReq('https://my-preview.vercel.app')).valid).toBe(
        true
      );
    });

    it('soft-fails gracefully when origin is missing (privacy browsers)', () => {
      const req = { headers: new Headers() };
      expect(validateRequestOrigin(req).valid).toBe(true);
    });

    it('rejects cross-origin requests from foreign domains', () => {
      const req = { headers: new Headers({ origin: 'https://malicious-site.com' }) };
      const res = validateRequestOrigin(req);
      expect(res.valid).toBe(false);
      expect(res.reason).toBe('origin_mismatch');
    });
  });

  describe('validateContentQuality', () => {
    it('accepts legitimate inquiry content', () => {
      const res = validateContentQuality(
        'Sahinur Islam',
        'I would love to collaborate on a Next.js project.'
      );
      expect(res.valid).toBe(true);
      expect(res.name).toBe('Sahinur Islam');
    });

    it('rejects names that are too short or too long', () => {
      expect(validateContentQuality('A', 'Legitimate message text').reason).toBe('name_too_short');
      expect(validateContentQuality('John '.repeat(25), 'Legitimate message text').reason).toBe(
        'name_too_long'
      );
    });

    it('rejects messages that are too short or excessive in URLs', () => {
      expect(validateContentQuality('Sahinur', 'Hi').reason).toBe('message_too_short');
      expect(
        validateContentQuality(
          'Sahinur',
          'Check out https://a.com and https://b.com and https://c.com for spam.'
        ).reason
      ).toBe('excessive_urls');
    });

    it('rejects repeated character flooding spam', () => {
      expect(validateContentQuality('Sahinur', 'Helloooooooooo world!').reason).toBe(
        'repeated_character_spam'
      );
    });
  });

  describe('validateEmailIntegrity', () => {
    it('rejects invalid email formats', async () => {
      expect((await validateEmailIntegrity('not-an-email')).valid).toBe(false);
      expect((await validateEmailIntegrity('@missinguser.com')).valid).toBe(false);
    });

    it('rejects known disposable email addresses', async () => {
      const res = await validateEmailIntegrity('spammer@mailinator.com');
      expect(res.valid).toBe(false);
      expect(res.reason).toBe('disposable_email_domain');
    });

    it('accepts established domains with valid MX records', async () => {
      const res = await validateEmailIntegrity('test@gmail.com');
      expect(res.valid).toBe(true);
    });
  });

  describe('verifyTurnstileSecurity', () => {
    const originalEnv = { ...process.env };

    afterEach(() => {
      process.env = { ...originalEnv };
    });

    it('passes through when secret key is unconfigured or testing key', async () => {
      process.env.TURNSTILE_SECRET_KEY = '';
      const res = await verifyTurnstileSecurity(null, '127.0.0.1');
      expect(res.success).toBe(true);
      expect(res.bypassed).toBe(true);
    });

    it('allows degraded fallback when ad-blocker omits token', async () => {
      process.env.TURNSTILE_SECRET_KEY = '0x4AAAAAAF3nYQMGDyApMlLmDDwRLz7KtIY';
      const res = await verifyTurnstileSecurity(null, '127.0.0.1');
      expect(res.success).toBe(true);
      expect(res.degraded).toBe(true);
    });
  });
});
