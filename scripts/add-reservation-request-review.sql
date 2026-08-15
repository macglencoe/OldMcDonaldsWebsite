-- Adds a lightweight review workflow to existing reservation requests.

BEGIN;

ALTER TABLE reservation_requests
  ADD COLUMN IF NOT EXISTS review_status TEXT NOT NULL DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS internal_note TEXT,
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'reservation_requests_review_status_check'
      AND conrelid = 'reservation_requests'::regclass
  ) THEN
    ALTER TABLE reservation_requests
      ADD CONSTRAINT reservation_requests_review_status_check
      CHECK (review_status IN ('new', 'reviewing', 'resolved', 'irrelevant', 'spam'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'reservation_requests_internal_note_check'
      AND conrelid = 'reservation_requests'::regclass
  ) THEN
    ALTER TABLE reservation_requests
      ADD CONSTRAINT reservation_requests_internal_note_check
      CHECK (internal_note IS NULL OR char_length(internal_note) <= 1000);
  END IF;
END $$;

UPDATE reservation_requests r
SET review_status = 'resolved', reviewed_at = COALESCE(reviewed_at, CURRENT_TIMESTAMP)
WHERE review_status IN ('new', 'reviewing')
  AND EXISTS (
    SELECT 1 FROM gazebo_bookings b
    WHERE b.reservation_request_id = r.id
      AND b.status IN ('tentative', 'confirmed')
  );

CREATE INDEX IF NOT EXISTS reservation_requests_review_status_created_at_idx
  ON reservation_requests (review_status, created_at DESC);

COMMIT;
