import { NextResponse } from 'next/server';
import { verifyLiveChatSessionToken } from '@/lib/webPush';

const SESSION_ID_REGEX =
  /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|sess_[0-9]{10,16}_[a-z0-9]{6,16})$/i;

// In-memory rate limiting map for typing events: ip -> { count, resetAt }
const typingRateLimits = new Map();

function checkTypingRateLimit(ip, limit = 30, windowMs = 60000) {
  const now = Date.now();
  const entry = typingRateLimits.get(ip);
  if (!entry || now > entry.resetAt) {
    typingRateLimits.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) {
    return false;
  }
  entry.count += 1;
  return true;
}

export async function POST(req) {
  try {
    const forwarded = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const ip = forwarded ? forwarded.split(',')[0].trim() : realIp || '127.0.0.1';

    if (!checkTypingRateLimit(ip)) {
      return NextResponse.json({ error: 'Typing rate limit exceeded.' }, { status: 429 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const { sessionId, sessionToken: bodyToken } = body;
    if (!sessionId || typeof sessionId !== 'string' || !SESSION_ID_REGEX.test(sessionId)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const authHeader = req.headers.get('authorization') || '';
    const headerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
    const token = bodyToken || headerToken || req.headers.get('x-livechat-session-token');

    // If token provided, verify it.
    if (token) {
      const verification = verifyLiveChatSessionToken(token, sessionId);
      if (!verification.valid) {
        return NextResponse.json({ ok: false, error: 'Invalid session token' }, { status: 401 });
      }
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    // Forward typing indicator to Telegram chat
    await fetch(`https://api.telegram.org/bot${botToken}/sendChatAction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        action: 'typing',
      }),
    }).catch(() => null);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
