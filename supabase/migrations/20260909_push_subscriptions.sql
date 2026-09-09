-- ─────────────────────────────────────────────────────────────
-- Supabase Migration: Web Push Subscriptions (Live Chat)
-- Generated: 2026-09-09
-- Architecture: session_id -> PushSubscription JSONB mapping
-- Security: RLS enabled, service_role only (no public access)
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  subscription JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Explicitly revoke access from public roles; grant full access to service_role only
REVOKE ALL ON public.push_subscriptions FROM anon, authenticated;
GRANT ALL ON public.push_subscriptions TO service_role;

-- Fast index for looking up active push subscriptions by live chat session ID
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_session_id ON public.push_subscriptions (session_id);

-- Index for lifecycle cleanup of stale subscriptions
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_created_at ON public.push_subscriptions (created_at);

-- Prevent duplicate subscriptions for the exact same endpoint in a session
CREATE UNIQUE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint_session
  ON public.push_subscriptions (session_id, (subscription->>'endpoint'));

-- Optional: Automated 30-day retention prune if pg_cron is enabled
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.schedule(
      'prune-stale-push-subscriptions',
      '0 3 * * *', -- Daily at 03:00 UTC
      $CRON$DELETE FROM public.push_subscriptions WHERE created_at < now() - interval '30 days'$CRON$
    );
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    NULL; -- Silently ignore if pg_cron is not configured
END $$;
