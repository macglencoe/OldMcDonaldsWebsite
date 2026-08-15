-- Gazebo reservation requests. A request is not a confirmed booking.

BEGIN;

CREATE TABLE IF NOT EXISTS reservation_requests (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT NOT NULL CHECK (char_length(email) BETWEEN 3 AND 254),
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  phone TEXT NOT NULL CHECK (char_length(phone) BETWEEN 3 AND 40),
  phone_normalized TEXT NOT NULL CHECK (char_length(phone_normalized) BETWEEN 10 AND 16),
  preferred_date DATE NOT NULL,
  preferred_time_slot TEXT NOT NULL CHECK (preferred_time_slot IN ('early', 'late', 'either')),
  fallback_dates TEXT CHECK (fallback_dates IS NULL OR char_length(fallback_dates) <= 1000),
  price_acknowledged BOOLEAN NOT NULL CHECK (price_acknowledged),
  weather_refund_acknowledged BOOLEAN NOT NULL CHECK (weather_refund_acknowledged),
  early_arrival_acknowledged BOOLEAN NOT NULL CHECK (early_arrival_acknowledged),
  price_cents_snapshot INTEGER NOT NULL CHECK (price_cents_snapshot > 0),
  policy_version SMALLINT NOT NULL DEFAULT 1 CHECK (policy_version > 0),
  additional_comments TEXT CHECK (additional_comments IS NULL OR char_length(additional_comments) <= 2000),
  review_status TEXT NOT NULL DEFAULT 'new'
    CHECK (review_status IN ('new', 'reviewing', 'resolved', 'irrelevant', 'spam')),
  internal_note TEXT CHECK (internal_note IS NULL OR char_length(internal_note) <= 1000),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ip_hash CHAR(64) NOT NULL CHECK (ip_hash ~ '^[0-9a-f]{64}$'),
  user_agent TEXT,
  meta_json JSONB NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(meta_json) = 'object')
);

CREATE INDEX IF NOT EXISTS reservation_requests_created_at_idx
  ON reservation_requests (created_at DESC);

CREATE INDEX IF NOT EXISTS reservation_requests_preferred_date_idx
  ON reservation_requests (preferred_date, preferred_time_slot);

CREATE INDEX IF NOT EXISTS reservation_requests_ip_hash_created_at_idx
  ON reservation_requests (ip_hash, created_at DESC);

CREATE INDEX IF NOT EXISTS reservation_requests_review_status_created_at_idx
  ON reservation_requests (review_status, created_at DESC);

COMMIT;
