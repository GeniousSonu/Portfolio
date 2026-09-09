import { NextResponse } from 'next/server';
import {
  verifyTurnstileToken,
  signSpaceSessionToken,
  checkSpaceRateLimit,
} from '@/lib/sharedSpace';

const VERIFY_RATE_LIMIT = 10;        // Max 10 verification requests
const VERIFY_RATE_WINDOW = 10 * 60;  // per 10 minutes

function getClientIp(req) {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  return forwarded ? forwarded.split(',')[0].trim() : realIp || '127.0.0.1';
}

/**
 * POST /api/space/verify
 * Validates Cloudflare Turnstile token and issues a signed session token.
 * Rate-limited per IP to prevent verification hammering.
 */
export async function POST(req) {
  try {
    const clientIp = getClientIp(req);

    // 1. IP rate limiting on verify endpoint
    const rateLimitKey = `space:verify:${clientIp}`;
    const rateStatus = await checkSpaceRateLimit(rateLimitKey, VERIFY_RATE_LIMIT, VERIFY_RATE_WINDOW);
    if (!rateStatus.allowed) {
      return NextResponse.json(
        { error: 'Too many verification attempts. Please wait a few minutes.' },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { turnstileToken } = body;

    // 2. Validate Turnstile token with Cloudflare
    const check = await verifyTurnstileToken(turnstileToken, clientIp);
    if (!check.success) {
      return NextResponse.json(
        { error: check.error || 'Human verification failed. Please try again.' },
        { status: 403 }
      );
    }

    // 3. Issue cryptographic session token (valid for 2 hours, no IP lock)
    const sessionToken = signSpaceSessionToken();

    return NextResponse.json({
      success: true,
      sessionToken,
    });
  } catch (err) {
    console.error('[API Space Verify] Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
