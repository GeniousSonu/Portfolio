-- ─────────────────────────────────────────────────────────────
-- Supabase Migration: Shared Space Entries & Realtime Authorization
-- Generated: 2026-09-05
-- Security: Strict RLS (service-role only on DB tables; private channel RLS for Realtime)
-- ─────────────────────────────────────────────────────────────

-- 1. Create shared_space_entries Table
CREATE TABLE IF NOT EXISTS public.shared_space_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.shared_space_entries ENABLE ROW LEVEL SECURITY;

-- Explicitly revoke access from public roles; grant only to service_role
REVOKE ALL ON public.shared_space_entries FROM anon, authenticated;
GRANT ALL ON public.shared_space_entries TO service_role;

-- Index for ordering by latest entries and 24-hour cleanup
CREATE INDEX IF NOT EXISTS idx_shared_space_created_at ON public.shared_space_entries (created_at DESC);


-- 2. Create chatbot_rate_limits Table (if not exists)
CREATE TABLE IF NOT EXISTS public.chatbot_rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 1,
  reset_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.chatbot_rate_limits ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.chatbot_rate_limits FROM anon, authenticated;
GRANT ALL ON public.chatbot_rate_limits TO service_role;

CREATE INDEX IF NOT EXISTS idx_chatbot_rate_limits_reset_at ON public.chatbot_rate_limits (reset_at);


-- 3. Supabase Realtime Authorization (Private Channel Lockdown)
-- Restricts publishing (INSERT) on 'shared-space' topic to service_role only.
-- Allows anon and authenticated clients to listen/receive (SELECT) only.

DO $$
BEGIN
  -- Drop existing policies if needed to recreate cleanly
  DROP POLICY IF EXISTS "allow_listen_shared_space" ON realtime.messages;
  DROP POLICY IF EXISTS "service_role_broadcast_shared_space" ON realtime.messages;

  -- Allow public / anon clients to LISTEN (receive broadcasts) on 'shared-space'
  CREATE POLICY "allow_listen_shared_space"
  ON realtime.messages
  FOR SELECT
  TO anon, authenticated
  USING ( realtime.topic() = 'shared-space' );

  -- Strictly allow only service_role to PUBLISH / BROADCAST to 'shared-space'
  CREATE POLICY "service_role_broadcast_shared_space"
  ON realtime.messages
  FOR INSERT
  TO service_role
  WITH CHECK ( realtime.topic() = 'shared-space' );
END $$;
