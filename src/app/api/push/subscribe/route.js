import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseServer';
import {
  isValidPushEndpoint,
  verifyLiveChatSessionToken,
  savePushSubscription,
} from '@/lib/webPush';

const SUBSCRIBE_RATE_LIMIT = 5;      // Max 5 push registrations per 10 minutes per IP
const SUBSCRIBE_RATE_WINDOW = 600;   // 10 minutes (600 seconds)

function getClientIp(req) {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  return forwarded ? forwarded.split(',')[0].trim() : realIp || '127.0.0.1';
}

async function checkSubscribeRateLimit(clientIp) {
  const key = `push:sub:${clientIp}`;
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
        const newReset = new Date(now + SUBSCRIBE_RATE_WINDOW * 1000).toISOString();
        await supabase
          .from('chatbot_rate_limits')
          .update({ count: 1, reset_at: newReset, updated_at: new Date().toISOString() })
          .eq('key', key);
        return { allowed: true };
      } else if (record.count < SUBSCRIBE_RATE_LIMIT) {
        await supabase
          .from('chatbot_rate_limits')
          .update({ count: record.count + 1, updated_at: new Date().toISOString() })
          .eq('key', key);
        return { allowed: true };
      } else {
        return { allowed: false };
      }
    } else if (fetchError && fetchError.code === 'PGRST116') {
      const newReset = new Date(now + SUBSCRIBE_RATE_WINDOW * 1000).toISOString();
      await supabase
        .from('chatbot_rate_limits')
        .insert({ key, count: 1, reset_at: newReset, updated_at: new Date().toISOString() });
      return { allowed: true };
    }
  } catch (err) {
    console.warn('[PushSubscribeRateLimit] Notice:', err.message);
  }

  return { allowed: true };
}

export async function POST(req) {
  try {
    const clientIp = getClientIp(req);

    // 1. IP Rate Limiting to prevent database table flooding
    const rateStatus = await checkSubscribeRateLimit(clientIp);
    if (!rateStatus.allowed) {
      return NextResponse.json(
        { error: 'Too many subscription requests. Please try again later.' },
        { status: 429 }
      );
    }

    // 2. Validate request body
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { sessionId, sessionToken, subscription } = body;

    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json({ error: 'Valid sessionId is required' }, { status: 400 });
    }

    // 3. Cryptographic Session Ownership Check
    // Verifies the caller actually initiated and owns this chat session
    const tokenCheck = verifyLiveChatSessionToken(sessionToken, sessionId);
    if (!tokenCheck.valid) {
      return NextResponse.json(
        { error: `Unauthorized session ownership: ${tokenCheck.error}` },
        { status: 403 }
      );
    }

    // 4. Validate subscription object shape
    if (
      !subscription ||
      typeof subscription !== 'object' ||
      !subscription.endpoint ||
      typeof subscription.endpoint !== 'string'
    ) {
      return NextResponse.json({ error: 'Valid subscription object required' }, { status: 400 });
    }

    // 5. SSRF Endpoint Validation against approved push service domains
    if (!isValidPushEndpoint(subscription.endpoint)) {
      console.warn('[PushSubscribe] Rejected suspicious push endpoint:', subscription.endpoint);
      return NextResponse.json(
        { error: 'Invalid or unauthorized push service endpoint (SSRF protection).' },
        { status: 400 }
      );
    }

    // 6. Persist to Supabase
    await savePushSubscription(sessionId, subscription);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[PushSubscribe] Error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error processing push subscription' },
      { status: 500 }
    );
  }
}
