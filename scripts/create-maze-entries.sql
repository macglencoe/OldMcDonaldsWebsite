-- Maze-game submissions are the first first-party form stored in Neon.
-- Run this script against the intended database before enabling use_db_forms.

BEGIN;

CREATE TABLE IF NOT EXISTS maze_entries (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  phone TEXT NOT NULL CHECK (char_length(phone) BETWEEN 1 AND 40),
  year SMALLINT NOT NULL CHECK (year BETWEEN 2000 AND 2100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ip_hash CHAR(64) NOT NULL CHECK (ip_hash ~ '^[0-9a-f]{64}$'),
  user_agent TEXT,
  meta_json JSONB NOT NULL DEFAULT '{}'::jsonb
    CHECK (jsonb_typeof(meta_json) = 'object')
);

CREATE INDEX IF NOT EXISTS maze_entries_created_at_idx
  ON maze_entries (created_at DESC);

CREATE INDEX IF NOT EXISTS maze_entries_year_created_at_idx
  ON maze_entries (year, created_at DESC);

-- This supports the upcoming per-IP rate-limit check. Only the HMAC hash is
-- retained; the visitor's raw IP address is never stored in this table.
CREATE INDEX IF NOT EXISTS maze_entries_ip_hash_created_at_idx
  ON maze_entries (ip_hash, created_at DESC);

COMMIT;
