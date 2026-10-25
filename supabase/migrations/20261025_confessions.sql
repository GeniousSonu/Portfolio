-- ==============================================================================
-- Migration: 20261025_confessions.sql
-- Description: Creates the confessions table with AES-256-GCM encrypted payload,
--              status tracking, and strict Row Level Security (RLS) restricted
--              to service_role only.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS confessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  body TEXT NOT NULL,
  is_encrypted BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'archived')),
  ip_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for querying by creation time and status
CREATE INDEX IF NOT EXISTS idx_confessions_created_at ON confessions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_confessions_status ON confessions (status);

-- Enable Row Level Security (RLS)
ALTER TABLE confessions ENABLE ROW LEVEL SECURITY;

-- Deny all public anon/authenticated access by default
-- Only service_role (backend server with service role key) can insert or select
DROP POLICY IF EXISTS "Service role full access on confessions" ON confessions;
CREATE POLICY "Service role full access on confessions"
  ON confessions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
