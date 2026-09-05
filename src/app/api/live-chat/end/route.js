import { NextResponse } from 'next/server';
import {
  getAllSessionMessageIds,
  deleteTelegramMessages,
  deleteSessionRecords,
  broadcastToSession,
} from '@/lib/liveChatSessions';

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid JSON request payload.' }, { status: 400 });
    }

    const { sessionId } = body;
    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json({ error: 'Valid sessionId is required.' }, { status: 400 });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // 1. Fetch all Telegram message IDs sent in both directions for this session
    const messageIds = await getAllSessionMessageIds(sessionId);

    // 2. Delete all tracked messages from Telegram chat
    if (botToken && chatId && messageIds.length > 0) {
      await deleteTelegramMessages(messageIds, chatId, botToken);
    }

    // 3. Delete session records from Supabase
    await deleteSessionRecords(sessionId);

    // 4. Broadcast session_ended event into the session's Realtime channel
    await broadcastToSession(sessionId, 'session_ended', {
      id: `end-${Date.now()}`,
      sessionId,
      endedAt: new Date().toISOString(),
      initiatedBy: 'visitor',
    });

    return NextResponse.json({
      ok: true,
      deletedCount: messageIds.length,
      sessionId,
    });
  } catch (err) {
    console.error('[LiveChatEnd] Error ending chat session:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to end live chat session.' },
      { status: 500 }
    );
  }
}
