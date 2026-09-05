import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseServer';
import { saveTelegramMessage, broadcastToSession } from '@/lib/liveChatSessions';

const MAX_MESSAGE_LENGTH = 500;
const IP_WINDOW_SECONDS = 120; // 2-minute sliding window
const IP_MAX_REQUESTS = 10;     // Max 10 messages per 2 minutes

function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Rate limit checker for live-chat send endpoint.
 */
async function checkLiveChatRateLimit(key, maxRequests, windowSeconds) {
  const now = Date.now();
  try {
    const supabase = getServiceSupabase();

    const { data: record, error: fetchError } = await supabase
      .from('chatbot_rate_limits')
      .select('count, reset_at')
      .eq('key', key)
      .single();

    if (!fetchError && record) {
      const resetTime = new Date(record.reset_at).getTime();
      if (now >= resetTime) {
        const newReset = new Date(now + windowSeconds * 1000).toISOString();
        await supabase
          .from('chatbot_rate_limits')
          .update({ count: 1, reset_at: newReset, updated_at: new Date().toISOString() })
          .eq('key', key);
        return { allowed: true, remaining: maxRequests - 1 };
      } else if (record.count < maxRequests) {
        await supabase
          .from('chatbot_rate_limits')
          .update({ count: record.count + 1, updated_at: new Date().toISOString() })
          .eq('key', key);
        return { allowed: true, remaining: maxRequests - record.count - 1 };
      } else {
        return { allowed: false, remaining: 0 };
      }
    } else if (fetchError && fetchError.code === 'PGRST116') {
      const newReset = new Date(now + windowSeconds * 1000).toISOString();
      await supabase
        .from('chatbot_rate_limits')
        .insert({ key, count: 1, reset_at: newReset, updated_at: new Date().toISOString() });
      return { allowed: true, remaining: maxRequests - 1 };
    }
  } catch (err) {
    console.warn('[LiveChatRateLimit] Rate limit check bypass notice:', err.message);
  }

  return { allowed: true, remaining: maxRequests };
}

export async function POST(req) {
  try {
    // 1. IP extraction & rate limiting
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : realIp || '127.0.0.1';
    const rateLimitKey = `live_chat:${clientIp}`;

    const { allowed } = await checkLiveChatRateLimit(rateLimitKey, IP_MAX_REQUESTS, IP_WINDOW_SECONDS);
    if (!allowed) {
      return NextResponse.json(
        { error: 'You are sending messages too quickly. Please wait a moment before sending another message to Sonu!' },
        { status: 429 }
      );
    }

    // 2. Validate payload
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid JSON request payload.' }, { status: 400 });
    }

    const { sessionId, message, visitorName, name } = body;

    if (!sessionId || typeof sessionId !== 'string' || sessionId.length > 128) {
      return NextResponse.json({ error: 'Valid sessionId is required.' }, { status: 400 });
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Message cannot be empty.' }, { status: 400 });
    }

    const cleanMessage = message.trim();
    if (cleanMessage.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message exceeds maximum allowed length of ${MAX_MESSAGE_LENGTH} characters.` },
        { status: 400 }
      );
    }

    const rawName = visitorName || name || 'Visitor';
    const displayName = rawName.trim().slice(0, 40) || 'Visitor';

    // 3. Telegram credentials
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error('[LiveChat] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in environment.');
      return NextResponse.json(
        { error: 'Live chat relay service is temporarily misconfigured.' },
        { status: 500 }
      );
    }

    // 4. Extract Vercel Geolocation headers (free, server-side, no user permission prompt)
    const rawCity = req.headers.get('x-vercel-ip-city');
    const country = req.headers.get('x-vercel-ip-country');
    let city = '';
    if (rawCity) {
      try {
        city = decodeURIComponent(rawCity).trim();
      } catch (e) {
        city = rawCity.trim();
      }
    }

    let locationStr = '';
    if (city && country) {
      locationStr = `${city}, ${country}`;
    } else if (city) {
      locationStr = city;
    } else if (country) {
      locationStr = country;
    }

    // 5. Format Telegram HTML message
    const istTime = new Date().toLocaleTimeString('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    let telegramHtml = `💬 <b>New message from ${escapeHtml(displayName)}</b>\n`;
    if (locationStr) {
      telegramHtml += `📍 ${escapeHtml(locationStr)}\n`;
    }
    telegramHtml += `🕐 ${istTime} IST\n\n<i>${escapeHtml(cleanMessage)}</i>`;

    // 6. Build Telegram payload with Quick Reply & End Chat buttons
    const telegramPayload = {
      chat_id: chatId,
      text: telegramHtml,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '👋 Thanks!',
              callback_data: `qr:thanks:${sessionId}`,
            },
            {
              text: '⏳ Give me 5m',
              callback_data: `qr:busy:${sessionId}`,
            },
            {
              text: '📧 Email me',
              callback_data: `qr:email:${sessionId}`,
            },
          ],
          [
            {
              text: '🔴 End Chat',
              callback_data: `end_chat:${sessionId}`,
            },
          ],
        ],
      },
    };

    // 7. Forward to Telegram Bot API
    const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(telegramPayload),
    });

    const tgData = await tgRes.json().catch(() => ({}));
    if (!tgRes.ok || !tgData.ok) {
      console.error('[LiveChat] Telegram API error forwarding message:', {
        status: tgRes.status,
        description: tgData?.description,
        errorCode: tgData?.error_code,
        chatId,
      });
      return NextResponse.json(
        {
          error: tgData?.description
            ? `Telegram relay error: ${tgData.description}`
            : 'Failed to deliver message to Telegram relay.',
        },
        { status: 502 }
      );
    }

    const telegramMessageId = tgData.result?.message_id;
    if (!telegramMessageId) {
      console.error('[LiveChat] Telegram response missing message_id:', tgData);
      return NextResponse.json(
        { error: 'Invalid response from Telegram relay.' },
        { status: 502 }
      );
    }

    // 8. Persist telegram_message_id -> session_id mapping in Supabase
    await saveTelegramMessage(telegramMessageId, sessionId);

    // 9. Broadcast visitor message to Supabase Realtime channel
    await broadcastToSession(sessionId, 'visitor_message', {
      id: `v-${Date.now()}`,
      sender: 'visitor',
      text: cleanMessage,
      visitorName: displayName,
      location: locationStr || null,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      telegramMessageId,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[LiveChat] Unexpected error in /api/live-chat/send:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error processing live chat message.' },
      { status: 500 }
    );
  }
}
