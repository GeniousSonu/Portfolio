-- ─────────────────────────────────────────────────────────────
-- Supabase Migration: Live Chat Sessions (Telegram Relay)
-- Generated: 2026-09-05
-- Architecture: 1-to-many relationship (multiple Telegram message IDs -> single visitor session_id)
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.live_chat_sessions (
  telegram_message_id BIGINT PRIMARY KEY,
  session_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.live_chat_sessions ENABLE ROW LEVEL SECURITY;

-- Explicitly revoke access from public roles; grant full access to service_role
REVOKE ALL ON public.live_chat_sessions FROM anon, authenticated;
GRANT ALL ON public.live_chat_sessions TO service_role;

-- Fast index for looking up session_id from any Telegram reply
CREATE INDEX IF NOT EXISTS idx_live_chat_sessions_session_id ON public.live_chat_sessions (session_id);

-- Fast index for cleanup queries or expiry verification
CREATE INDEX IF NOT EXISTS idx_live_chat_sessions_created_at ON public.live_chat_sessions (created_at);
