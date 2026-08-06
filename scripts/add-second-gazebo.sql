-- Add Gazebo B while preserving every existing booking as a Gazebo A booking.
-- Run this migration before deploying the application changes.

BEGIN;

ALTER TABLE gazebo_bookings
  ADD COLUMN IF NOT EXISTS gazebo_code TEXT DEFAULT 'A';

UPDATE gazebo_bookings
SET gazebo_code = 'A'
WHERE gazebo_code IS NULL;

ALTER TABLE gazebo_bookings
  ALTER COLUMN gazebo_code SET DEFAULT 'A',
  ALTER COLUMN gazebo_code SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'gazebo_bookings_gazebo_code_check'
      AND conrelid = 'gazebo_bookings'::regclass
  ) THEN
    ALTER TABLE gazebo_bookings
      ADD CONSTRAINT gazebo_bookings_gazebo_code_check
      CHECK (gazebo_code IN ('A', 'B'));
  END IF;
END $$;

DROP INDEX IF EXISTS gazebo_bookings_active_slot_unique_idx;
CREATE UNIQUE INDEX gazebo_bookings_active_slot_unique_idx
  ON gazebo_bookings (booking_date, time_slot, gazebo_code)
  WHERE status IN ('tentative', 'confirmed');

DROP INDEX IF EXISTS gazebo_bookings_date_idx;
CREATE INDEX gazebo_bookings_date_idx
  ON gazebo_bookings (booking_date, time_slot, gazebo_code);

COMMIT;
