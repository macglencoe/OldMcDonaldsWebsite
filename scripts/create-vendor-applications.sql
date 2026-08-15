-- Vendor applications. An application is not an approval to vend.

BEGIN;

CREATE TABLE IF NOT EXISTS vendor_applications (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  business_name TEXT NOT NULL CHECK (char_length(business_name) BETWEEN 1 AND 160),
  contact_name TEXT NOT NULL CHECK (char_length(contact_name) BETWEEN 1 AND 120),
  email TEXT NOT NULL CHECK (char_length(email) BETWEEN 3 AND 254),
  phone TEXT NOT NULL CHECK (char_length(phone) BETWEEN 3 AND 40),
  phone_normalized TEXT NOT NULL CHECK (char_length(phone_normalized) BETWEEN 10 AND 16),
  website_url TEXT CHECK (website_url IS NULL OR char_length(website_url) <= 500),
  electricity_requirement TEXT NOT NULL CHECK (electricity_requirement IN ('supplied', 'own_or_none', 'unknown')),
  is_food_vendor BOOLEAN NOT NULL,
  health_certification_acknowledged BOOLEAN,
  certification_status TEXT CHECK (certification_status IS NULL OR certification_status IN ('ready', 'later')),
  availability_notes TEXT CHECK (availability_notes IS NULL OR char_length(availability_notes) <= 2000),
  policy_version SMALLINT NOT NULL DEFAULT 1 CHECK (policy_version > 0),
  review_status TEXT NOT NULL DEFAULT 'new'
    CHECK (review_status IN ('new', 'reviewing', 'contacted', 'accepted', 'declined', 'spam')),
  internal_note TEXT CHECK (internal_note IS NULL OR char_length(internal_note) <= 1000),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ip_hash CHAR(64) NOT NULL CHECK (ip_hash ~ '^[0-9a-f]{64}$'),
  user_agent TEXT,
  meta_json JSONB NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(meta_json) = 'object'),
  CHECK (
    (is_food_vendor AND health_certification_acknowledged IS TRUE AND certification_status IS NOT NULL)
    OR
    (NOT is_food_vendor AND health_certification_acknowledged IS NULL AND certification_status IS NULL)
  )
);

CREATE INDEX IF NOT EXISTS vendor_applications_created_at_idx
  ON vendor_applications (created_at DESC);

CREATE INDEX IF NOT EXISTS vendor_applications_food_certification_idx
  ON vendor_applications (is_food_vendor, certification_status, created_at DESC);

CREATE INDEX IF NOT EXISTS vendor_applications_electricity_idx
  ON vendor_applications (electricity_requirement, created_at DESC);

CREATE INDEX IF NOT EXISTS vendor_applications_ip_hash_created_at_idx
  ON vendor_applications (ip_hash, created_at DESC);

CREATE INDEX IF NOT EXISTS vendor_applications_review_status_created_at_idx
  ON vendor_applications (review_status, created_at DESC);

COMMIT;
