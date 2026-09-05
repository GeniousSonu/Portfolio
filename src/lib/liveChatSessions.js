import 'server-only';
import { getServiceSupabase } from '@/lib/supabaseServer';

const SESSION_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

/**
 * Persists a forwarded Telegram message mapping to a visitor session ID.
 * Each forwarded message creates a new row so replying to ANY message in the thread
 * reliably maps back to the visitor session.
 *
 * @param {number|string} telegramMessageId - Telegram message_id returned by sendMessage
 * @param {string} sessionId - Client-generated high-entropy session ID
 */
export async function saveTelegramMessage(telegramMessageId, sessionId) {
  const supabase = getServiceSupabase();
  const numericId = Number(telegramMessageId);

  const { error } = await supabase
    .from('live_chat_sessions')
    .insert({
      telegram_message_id: numericId,
      session_id: sessionId,
      created_at: new Date().toISOString(),
    });

  if (error) {
    console.error(
      '[LiveChat] Database error saving telegram message mapping:',
      `Code: ${error.code} | Message: ${error.message} | Hint: Did you run supabase/migrations/20260905_live_chat_sessions.sql?`
    );
    if (error.code === 'PGRST205') {
      throw new Error(
        "Database table 'live_chat_sessions' has not been created yet. Please execute supabase/migrations/20260905_live_chat_sessions.sql in your Supabase SQL Editor."
      );
    }
    throw new Error(`Database error saving live chat session mapping: ${error.message}`);
  }

  // Periodic lazy cleanup of expired sessions (> 6 hours)
  cleanupOldSessions().catch((err) => {
    console.warn('[LiveChat] Background session cleanup notice:', err.message);
  });
}

/**
 * Looks up the visitor session_id corresponding to a Telegram message_id.
 *
 * @param {number|string} telegramMessageId - reply_to_message.message_id from webhook
 * @returns {Promise<{ sessionId: string, isExpired: boolean } | null>}
 */
export async function getSessionByTelegramMessageId(telegramMessageId) {
  const supabase = getServiceSupabase();
  const numericId = Number(telegramMessageId);

  const { data, error } = await supabase
    .from('live_chat_sessions')
    .select('session_id, created_at')
    .eq('telegram_message_id', numericId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Row not found (message wasn't part of any tracked session)
      return null;
    }
    console.error(
      '[LiveChat] Database error looking up session by telegram message_id:',
      `Code: ${error.code} | Message: ${error.message}`
    );
    throw new Error(`Database error querying live chat session: ${error.message}`);
  }

  if (!data) return null;

  const ageMs = Date.now() - new Date(data.created_at).getTime();
  const isExpired = ageMs > SESSION_TTL_MS;

  return {
    sessionId: data.session_id,
    isExpired,
  };
}

/**
 * Broadcasts an event to the visitor's scoped Realtime channel.
 *
 * @param {string} sessionId
 * @param {string} event
 * @param {object} payload
 */
export async function broadcastToSession(sessionId, event, payload) {
  const supabase = getServiceSupabase();
  const channelName = `live-chat:${sessionId}`;
  const channel = supabase.channel(channelName, {
    config: { broadcast: { ack: true } },
  });

  return new Promise((resolve) => {
    const timeout = setTimeout(async () => {
      try {
        await supabase.removeChannel(channel);
      } catch (e) {}
      resolve({ ok: false, error: 'Broadcast timed out waiting for channel subscription' });
    }, 4500);

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        try {
          const resp = await channel.send({
            type: 'broadcast',
            event,
            payload,
          });
          clearTimeout(timeout);
          await supabase.removeChannel(channel);
          resolve({ ok: true, resp });
        } catch (err) {
          clearTimeout(timeout);
          try {
            await supabase.removeChannel(channel);
          } catch (e) {}
          resolve({ ok: false, error: err.message });
        }
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        clearTimeout(timeout);
        try {
          await supabase.removeChannel(channel);
        } catch (e) {}
        resolve({ ok: false, error: `Subscription status: ${status}` });
      }
    });
  });
}

/**
 * Deletes session records older than 6 hours to prevent stale data accumulation.
 */
export async function cleanupOldSessions() {
  const supabase = getServiceSupabase();
  const cutoff = new Date(Date.now() - SESSION_TTL_MS).toISOString();

  await supabase
    .from('live_chat_sessions')
    .delete()
    .lt('created_at', cutoff);
}
