-- Adds a lightweight, reversible review workflow to existing vendor applications.

BEGIN;

ALTER TABLE vendor_applications
  ADD COLUMN IF NOT EXISTS review_status TEXT NOT NULL DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS internal_note TEXT,
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'vendor_applications_review_status_check'
      AND conrelid = 'vendor_applications'::regclass
  ) THEN
    ALTER TABLE vendor_applications
      ADD CONSTRAINT vendor_applications_review_status_check
      CHECK (review_status IN ('new', 'reviewing', 'contacted', 'accepted', 'declined', 'spam'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'vendor_applications_internal_note_check'
      AND conrelid = 'vendor_applications'::regclass
  ) THEN
    ALTER TABLE vendor_applications
      ADD CONSTRAINT vendor_applications_internal_note_check
      CHECK (internal_note IS NULL OR char_length(internal_note) <= 1000);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS vendor_applications_review_status_created_at_idx
  ON vendor_applications (review_status, created_at DESC);

COMMIT;
