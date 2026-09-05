import { NextResponse } from 'next/server';
import { getSessionByTelegramMessageId, saveTelegramMessage, broadcastToSession } from '@/lib/liveChatSessions';

export async function POST(req) {
  try {
    // 1. Verify Telegram Webhook Secret Token
    const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
    const incomingSecret = req.headers.get('x-telegram-bot-api-secret-token');

    if (!webhookSecret || incomingSecret !== webhookSecret) {
      console.warn('[LiveChatWebhook] Unauthorized webhook access attempt rejected.');
      return NextResponse.json(
        { error: 'Unauthorized: invalid webhook secret' },
        { status: 401 }
      );
    }

    // 2. Parse Telegram Update
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ ok: true });
    }

    const message = body.message || body.edited_message;
    if (!message) {
      // Ignore non-message updates (inline queries, callback queries, etc.)
      return NextResponse.json({ ok: true });
    }

    // 3. Verify chat origin (only accept messages from Sonu's configured chat ID)
    const expectedChatId = String(process.env.TELEGRAM_CHAT_ID || '');
    const incomingChatId = String(message.chat?.id || '');

    if (expectedChatId && incomingChatId !== expectedChatId) {
      console.warn(
        `[LiveChatWebhook] Message ignored from unauthorized chat_id: ${incomingChatId}`
      );
      return NextResponse.json({ ok: true });
    }

    // 4. Verify message is a reply to a forwarded message with text
    const replyToMessageId = message.reply_to_message?.message_id;
    const replyText = message.text;

    if (!replyToMessageId || !replyText || !replyText.trim()) {
      // Silently ignore messages that are not replies
      return NextResponse.json({ ok: true });
    }

    // 5. Look up session ID by telegram message ID in Supabase
    const sessionMatch = await getSessionByTelegramMessageId(replyToMessageId);

    if (!sessionMatch) {
      console.log(
        `[LiveChatWebhook] Reply to message #${replyToMessageId} has no active session mapping. Ignoring.`
      );
      return NextResponse.json({ ok: true });
    }

    if (sessionMatch.isExpired) {
      console.log(
        `[LiveChatWebhook] Reply to message #${replyToMessageId} belongs to expired session ${sessionMatch.sessionId}. Ignoring.`
      );
      return NextResponse.json({ ok: true });
    }

    const { sessionId } = sessionMatch;

    // 6. Map Sonu's new reply message ID to the same session for conversation threading
    if (message.message_id) {
      try {
        await saveTelegramMessage(message.message_id, sessionId);
      } catch (mapErr) {
        console.warn('[LiveChatWebhook] Failed to map Sonu reply message ID:', mapErr.message);
      }
    }

    // 7. Broadcast Sonu's live reply over Supabase Realtime channel
    const broadcastResult = await broadcastToSession(sessionId, 'sonu_reply', {
      id: `reply-${message.message_id}`,
      sender: 'sonu',
      text: replyText.trim(),
      timestamp: new Date().toISOString(),
    });

    if (!broadcastResult.ok) {
      console.warn(
        `[LiveChatWebhook] Realtime broadcast warning for session ${sessionId}:`,
        broadcastResult.error
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[LiveChatWebhook] Unexpected webhook handler error:', err);
    // Always return 200 to Telegram so Telegram does not aggressively retry failed webhooks
    return NextResponse.json({ ok: false, error: err.message });
  }
}
