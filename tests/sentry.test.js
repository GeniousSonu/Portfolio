import { describe, it, expect } from 'vitest';
import {
  scrubText,
  truncateString,
  scrubHeaders,
  isBotEvent,
  isExtensionError,
  scrubSentryEvent,
} from '../src/lib/sentryScrubber.js';

describe('Sentry Scrubber Privacy Firewall (Vitest Suite)', () => {
  it('redacts email addresses in messages', () => {
    const raw = 'Contact lead dev at engineer@partner.org immediately';
    expect(scrubText(raw)).not.toContain('engineer@partner.org');
    expect(scrubText(raw)).toContain('[REDACTED_EMAIL]');
  });

  it('redacts IPv4 and IPv6 addresses', () => {
    const raw = 'Origin IP 203.0.113.42 and router 192.168.0.1';
    expect(scrubText(raw)).not.toContain('203.0.113.42');
    expect(scrubText(raw)).not.toContain('192.168.0.1');
    expect(scrubText(raw)).toContain('[REDACTED_IP]');
  });

  it('strips query parameters from URLs', () => {
    const url = 'https://genioussonu.me/api/auth?code=super_secret_code_123&user=sonu';
    expect(scrubText(url)).not.toContain('super_secret_code_123');
    expect(scrubText(url)).toContain('[QUERY_REDACTED]');
  });

  it('drops crawler bot events', () => {
    const bot = {
      request: {
        headers: { 'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' },
      },
      message: 'Chunk failed',
    };
    expect(isBotEvent(bot)).toBe(true);
    expect(scrubSentryEvent(bot)).toBeNull();
  });

  it('drops third-party extension errors', () => {
    const ext = {
      exception: {
        values: [
          {
            value: 'chrome-extension error',
            stacktrace: {
              frames: [{ filename: 'chrome-extension://xyz/content.js' }],
            },
          },
        ],
      },
    };
    expect(isExtensionError(ext)).toBe(true);
    expect(scrubSentryEvent(ext)).toBeNull();
  });
});
