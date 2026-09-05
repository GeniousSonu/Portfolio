import { NextResponse } from 'next/server';
import {
  getSessionByTelegramMessageId,
  saveTelegramMessage,
  broadcastToSession,
  getAllSessionMessageIds,
  deleteTelegramMessages,
  deleteSessionRecords,
} from '@/lib/liveChatSessions';

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

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const expectedChatId = String(process.env.TELEGRAM_CHAT_ID || '');

    // ── Handle Inline Button Taps (callback_query) ──
    if (body.callback_query) {
      const cb = body.callback_query;
      const cbData = String(cb.data || '');
      const cbChatId = String(cb.message?.chat?.id || '');
      const cbFromId = String(cb.from?.id || '');
      const targetChatId = cbChatId || cbFromId || expectedChatId;

      // Verify origin chat / sender
      const isAuthorized =
        !expectedChatId ||
        cbChatId === expectedChatId ||
        cbFromId === expectedChatId;

      if (!isAuthorized) {
        console.warn(`[LiveChatWebhook] Unauthorized callback from chatId=${cbChatId}, fromId=${cbFromId}`);
        return NextResponse.json({ ok: true });
      }

      // Handle Quick Reply button taps ("qr:<type>:<sessionId>")
      if (cbData.startsWith('qr:')) {
        const parts = cbData.split(':');
        const qrType = parts[1];
        const sessionId = parts.slice(2).join(':');

        const cannedMap = {
          thanks: '👋 Thanks for reaching out! How can I help you today?',
          busy: '⏳ Give me just a few minutes, I am reviewing your message and will reply shortly!',
          email: '📧 Feel free to connect over email at sahinur.dev@gmail.com, or leave your email here!',
        };

        const replyText = cannedMap[qrType] || '👋 Thanks for reaching out!';

        // 1. Acknowledge callback immediately so button doesn't show loading spinner
        if (botToken && cb.id) {
          await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              callback_query_id: cb.id,
              text: '✅ Quick reply sent to visitor!',
              show_alert: false,
            }),
          }).catch((e) => console.warn('[LiveChatWebhook] answerCallbackQuery notice:', e.message));
        }

        if (sessionId) {
          // 2. Broadcast Sonu's canned reply over Supabase Realtime channel
          await broadcastToSession(sessionId, 'sonu_reply', {
            id: `qr-${Date.now()}`,
            sender: 'sonu',
            text: replyText,
            timestamp: new Date().toISOString(),
          });

          // 3. Send confirmation in Telegram chat so Sonu has a clean record
          if (botToken && targetChatId) {
            const cleanNotice = String(replyText).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const sentMsgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: targetChatId,
                text: `✅ <b>Quick reply sent:</b>\n<i>"${cleanNotice}"</i>`,
                parse_mode: 'HTML',
              }),
            });
            const sentMsgData = await sentMsgRes.json().catch(() => ({}));
            if (sentMsgData?.result?.message_id) {
              await saveTelegramMessage(sentMsgData.result.message_id, sessionId).catch(() => {});
            }
          }
        }

        return NextResponse.json({ ok: true, action: 'quick_reply_sent' });
      }

      // Handle "🔴 End Chat" button tap
      if (cbData.startsWith('end_chat:')) {
        const sessionId = cbData.replace('end_chat:', '').trim();

        // 1. Acknowledge button tap immediately so loading spinner stops
        if (botToken && cb.id) {
          await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              callback_query_id: cb.id,
              text: '🔴 Chat session ended. Cleaning up messages...',
              show_alert: false,
            }),
          }).catch((e) => console.warn('[LiveChatWebhook] answerCallbackQuery notice:', e.message));
        }

        if (sessionId) {
          // 2. Fetch all tracked Telegram messages for this session
          const messageIds = await getAllSessionMessageIds(sessionId);
          if (cb.message?.message_id && !messageIds.includes(cb.message.message_id)) {
            messageIds.push(cb.message.message_id);
          }

          // 3. Delete tracked messages from Telegram
          if (botToken && targetChatId && messageIds.length > 0) {
            await deleteTelegramMessages(messageIds, targetChatId, botToken);
          }

          // 4. Delete session records from Supabase
          await deleteSessionRecords(sessionId);

          // 5. Broadcast session_ended to visitor's Realtime channel
          await broadcastToSession(sessionId, 'session_ended', {
            id: `end-${Date.now()}`,
            sessionId,
            endedAt: new Date().toISOString(),
            initiatedBy: 'sonu',
          });
        }

        return NextResponse.json({ ok: true, action: 'chat_ended' });
      }

      return NextResponse.json({ ok: true });
    }

    // ── Handle Incoming Messages & Replies ──
    const message = body.message || body.edited_message;
    if (!message) {
      return NextResponse.json({ ok: true });
    }

    // 3. Verify chat origin (only accept messages from Sonu's configured chat ID)
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

    // 6. Map Sonu's new reply message ID to the same session for conversation tracking and cleanup
    if (message.message_id) {
      try {
        await saveTelegramMessage(message.message_id, sessionId);
      } catch (mapErr) {
        console.warn('[LiveChatWebhook] Notice on saving Sonu reply ID:', mapErr.message);
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
    return NextResponse.json({ ok: false, error: err.message });
  }
}
