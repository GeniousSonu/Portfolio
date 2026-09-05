import 'server-only';
import { getServiceSupabase } from '@/lib/supabaseServer';

const SESSION_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

/**
 * Persists a Telegram message ID mapping to a visitor session ID using upsert
 * to avoid duplicate key conflicts.
 * Tracks every message in both directions (visitor forwarded messages & Sonu replies).
 *
 * @param {number|string} telegramMessageId
 * @param {string} sessionId
 */
export async function saveTelegramMessage(telegramMessageId, sessionId) {
  const supabase = getServiceSupabase();
  const numericId = Number(telegramMessageId);

  const { error } = await supabase
    .from('live_chat_sessions')
    .upsert(
      {
        telegram_message_id: numericId,
        session_id: sessionId,
        created_at: new Date().toISOString(),
      },
      { onConflict: 'telegram_message_id' }
    );

  if (error) {
    console.error(
      '[LiveChat] Database error saving telegram message mapping:',
      `Code: ${error.code} | Message: ${error.message}`
    );
    if (error.code === 'PGRST205') {
      throw new Error(
        "Database table 'live_chat_sessions' has not been created yet. Please execute supabase/migrations/20260905_live_chat_sessions.sql in your Supabase SQL Editor."
      );
    }
    throw new Error(`Database error saving live chat session mapping: ${error.message}`);
  }

  // Periodic cleanup of expired sessions (> 6 hours)
  cleanupOldSessions().catch((err) => {
    console.warn('[LiveChat] Background session cleanup notice:', err.message);
  });
}

/**
 * Looks up the visitor session_id corresponding to a Telegram message_id.
 *
 * @param {number|string} telegramMessageId
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
 * Retrieves all Telegram message IDs associated with a session ID.
 *
 * @param {string} sessionId
 * @returns {Promise<number[]>}
 */
export async function getAllSessionMessageIds(sessionId) {
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from('live_chat_sessions')
    .select('telegram_message_id')
    .eq('session_id', sessionId);

  if (error) {
    console.error('[LiveChat] Error fetching all session message IDs:', error);
    return [];
  }

  return (data || []).map((row) => Number(row.telegram_message_id)).filter(Boolean);
}

/**
 * Deletes all session records for a given session ID from Supabase.
 *
 * @param {string} sessionId
 */
export async function deleteSessionRecords(sessionId) {
  const supabase = getServiceSupabase();
  const { error } = await supabase
    .from('live_chat_sessions')
    .delete()
    .eq('session_id', sessionId);

  if (error) {
    console.error('[LiveChat] Error deleting session records:', error);
    throw new Error(`Failed to delete session records: ${error.message}`);
  }
}

/**
 * Deletes a list of messages from Telegram chat using deleteMessage API.
 * Telegram permits bots to delete messages in private chats within 48 hours.
 *
 * @param {number[]} messageIds
 * @param {string|number} chatId
 * @param {string} botToken
 */
export async function deleteTelegramMessages(messageIds, chatId, botToken) {
  if (!Array.isArray(messageIds) || messageIds.length === 0 || !chatId || !botToken) return;

  const results = await Promise.allSettled(
    messageIds.map(async (msgId) => {
      const res = await fetch(`https://api.telegram.org/bot${botToken}/deleteMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          message_id: msgId,
        }),
      });
      return res.json();
    })
  );

  return results;
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
