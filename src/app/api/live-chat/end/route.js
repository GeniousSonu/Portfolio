import { NextResponse } from 'next/server';
import {
  getAllSessionMessageIds,
  deleteTelegramMessages,
  deleteSessionRecords,
  broadcastToSession,
} from '@/lib/liveChatSessions';
import { verifyLiveChatSessionToken } from '@/lib/webPush';

const SESSION_ID_REGEX =
  /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|sess_[0-9]{10,16}_[a-z0-9]{6,16})$/i;

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid JSON request payload.' }, { status: 400 });
    }

    const { sessionId, sessionToken: bodyToken } = body;
    if (!sessionId || typeof sessionId !== 'string' || !SESSION_ID_REGEX.test(sessionId)) {
      return NextResponse.json({ error: 'Valid sessionId is required.' }, { status: 400 });
    }

    // Authenticate caller session token
    const authHeader = req.headers.get('authorization') || '';
    const headerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
    const customHeaderToken = req.headers.get('x-livechat-session-token');
    const token = bodyToken || headerToken || customHeaderToken;

    if (!token) {
      return NextResponse.json(
        { error: 'Session token required to end chat session.' },
        { status: 401 }
      );
    }

    const verification = verifyLiveChatSessionToken(token, sessionId);
    if (!verification.valid) {
      return NextResponse.json(
        { error: verification.error || 'Invalid or expired session token.' },
        { status: 401 }
      );
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
    return NextResponse.json({ error: 'Failed to end live chat session.' }, { status: 500 });
  }
}
