import { NextResponse } from 'next/server';
import {
  getSpaceEntries,
  createSpaceEntry,
  clearAllSpaceEntries,
  sanitizeSpaceContent,
  verifyTurnstileToken,
  checkSpaceRateLimit,
  cleanupExpiredEntries,
  cleanupExpiredRateLimits,
  broadcastToSpace,
  notifyTelegramNewSpaceEntry,
} from '@/lib/sharedSpace';

const POST_RATE_LIMIT = 10;          // Max 10 posts
const POST_RATE_WINDOW = 10 * 60;    // per 10 minutes
const DELETE_RATE_LIMIT = 2;         // Max 2 clears
const DELETE_RATE_WINDOW = 10 * 60;  // per 10 minutes

function getClientIp(req) {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  return forwarded ? forwarded.split(',')[0].trim() : realIp || '127.0.0.1';
}

/**
 * GET /api/space
 * Returns current entries (most recent first, capped at 100).
 * Runs background 24-hour cleanup and rate-limit pruning.
 */
export async function GET() {
  try {
    // Non-blocking background pruning
    cleanupExpiredEntries().catch(() => {});
    cleanupExpiredRateLimits().catch(() => {});

    const entries = await getSpaceEntries(100);
    return NextResponse.json({ success: true, entries });
  } catch (err) {
    console.error('[API Space GET] Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/space
 * Accepts { content, turnstileToken }
 * Validates Turnstile, rate limits per-IP, sanitizes text, inserts, broadcasts, notifies Telegram.
 */
export async function POST(req) {
  try {
    const clientIp = getClientIp(req);
    const body = await req.json().catch(() => ({}));
    const { content, turnstileToken } = body;

    // 1. Validate Bot Challenge (Cloudflare Turnstile)
    const turnstileCheck = await verifyTurnstileToken(turnstileToken, clientIp);
    if (!turnstileCheck.success) {
      return NextResponse.json(
        { error: turnstileCheck.error || 'Bot verification failed. Please try again.' },
        { status: 403 }
      );
    }

    // 2. Enforce IP Rate Limiting (10 posts per 10 minutes)
    const rateLimitKey = `space:post:${clientIp}`;
    const rateStatus = await checkSpaceRateLimit(rateLimitKey, POST_RATE_LIMIT, POST_RATE_WINDOW);
    if (!rateStatus.allowed) {
      return NextResponse.json(
        { error: 'Rate limit reached. Maximum 10 pastes per 10 minutes are permitted.' },
        { status: 429 }
      );
    }

    // 3. Strict Server-Side Unicode / Anti-Abuse Sanitization
    let cleanText;
    try {
      cleanText = sanitizeSpaceContent(content);
    } catch (valErr) {
      return NextResponse.json({ error: valErr.message }, { status: 400 });
    }

    // 4. Save to Database using Privileged Service Role
    const newEntry = await createSpaceEntry(cleanText);

    // 5. Broadcast to connected visitors via Private Realtime Channel
    broadcastToSpace('new-entry', { entry: newEntry }).catch((e) => {
      console.warn('[API Space POST] Broadcast warning:', e.message);
    });

    // 6. Notify Sonu's Telegram for moderation (with inline 1-tap delete button)
    notifyTelegramNewSpaceEntry(newEntry, clientIp).catch((e) => {
      console.warn('[API Space POST] Telegram notice error:', e.message);
    });

    return NextResponse.json({ success: true, entry: newEntry });
  } catch (err) {
    console.error('[API Space POST] Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/space
 * Clears all entries from the shared space board.
 * Stricter rate limit (2 clears per 10 mins).
 * Broadcasts space_cleared to all connected visitors.
 */
export async function DELETE(req) {
  try {
    const clientIp = getClientIp(req);

    // 1. Strict IP Rate Limiting for Destructive Action
    const rateLimitKey = `space:delete:${clientIp}`;
    const rateStatus = await checkSpaceRateLimit(rateLimitKey, DELETE_RATE_LIMIT, DELETE_RATE_WINDOW);
    if (!rateStatus.allowed) {
      return NextResponse.json(
        { error: 'Rate limit reached. The board can only be cleared twice per 10 minutes per visitor.' },
        { status: 429 }
      );
    }

    // 2. Wipe Table
    await clearAllSpaceEntries();

    // 3. Broadcast to all clients
    broadcastToSpace('space_cleared', { timestamp: new Date().toISOString() }).catch((e) => {
      console.warn('[API Space DELETE] Broadcast error:', e.message);
    });

    return NextResponse.json({ success: true, message: 'Shared space cleared.' });
  } catch (err) {
    console.error('[API Space DELETE] Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
