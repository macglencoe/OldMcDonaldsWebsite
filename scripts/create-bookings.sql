-- Staff-managed gazebo and campfire bookings.
-- Reservation requests remain the immutable record of what a customer submitted.

BEGIN;

CREATE TABLE IF NOT EXISTS gazebo_season_config (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  season_name TEXT NOT NULL CHECK (char_length(season_name) BETWEEN 1 AND 120),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  early_start_time TIME NOT NULL,
  early_end_time TIME NOT NULL,
  late_start_time TIME NOT NULL,
  late_end_time TIME NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (start_date <= end_date),
  CHECK (early_start_time < early_end_time),
  CHECK (late_start_time < late_end_time),
  CHECK (early_end_time <= late_start_time),
  CONSTRAINT gazebo_season_config_dates_do_not_overlap
    EXCLUDE USING gist (daterange(start_date, end_date, '[]') WITH &&)
);

CREATE TABLE IF NOT EXISTS gazebo_bookings (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  booking_date DATE NOT NULL,
  gazebo_code TEXT NOT NULL DEFAULT 'A' CHECK (gazebo_code IN ('A', 'B')),
  time_slot TEXT NOT NULL CHECK (time_slot IN ('early', 'late')),
  start_time_snapshot TIME NOT NULL,
  end_time_snapshot TIME NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('tentative', 'confirmed', 'cancelled')),
  customer_name TEXT NOT NULL CHECK (char_length(customer_name) BETWEEN 1 AND 120),
  customer_email TEXT NOT NULL CHECK (char_length(customer_email) BETWEEN 3 AND 254),
  customer_phone TEXT NOT NULL CHECK (char_length(customer_phone) BETWEEN 3 AND 40),
  customer_phone_normalized TEXT NOT NULL
    CHECK (char_length(customer_phone_normalized) BETWEEN 10 AND 16),
  party_size INTEGER CHECK (party_size IS NULL OR party_size BETWEEN 1 AND 10000),
  reservation_request_id BIGINT REFERENCES reservation_requests(id) ON DELETE RESTRICT,
  internal_notes TEXT CHECK (
    internal_notes IS NULL OR char_length(internal_notes) <= 2000
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (start_time_snapshot < end_time_snapshot)
);

-- Tentative and confirmed bookings both hold inventory. Cancelled records remain
-- available as history and do not prevent a replacement booking.
CREATE UNIQUE INDEX IF NOT EXISTS gazebo_bookings_active_slot_unique_idx
  ON gazebo_bookings (booking_date, time_slot, gazebo_code)
  WHERE status IN ('tentative', 'confirmed');

-- One request may have several cancelled historical bookings, but only one active
-- booking at a time.
CREATE UNIQUE INDEX IF NOT EXISTS gazebo_bookings_active_request_unique_idx
  ON gazebo_bookings (reservation_request_id)
  WHERE reservation_request_id IS NOT NULL
    AND status IN ('tentative', 'confirmed');

CREATE INDEX IF NOT EXISTS gazebo_bookings_date_idx
  ON gazebo_bookings (booking_date, time_slot, gazebo_code);

CREATE INDEX IF NOT EXISTS gazebo_bookings_status_date_idx
  ON gazebo_bookings (status, booking_date);

CREATE INDEX IF NOT EXISTS gazebo_bookings_request_idx
  ON gazebo_bookings (reservation_request_id)
  WHERE reservation_request_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS campfire_bookings (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  booking_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('tentative', 'confirmed', 'cancelled')),
  customer_name TEXT NOT NULL CHECK (char_length(customer_name) BETWEEN 1 AND 120),
  customer_email TEXT NOT NULL CHECK (char_length(customer_email) BETWEEN 3 AND 254),
  customer_phone TEXT NOT NULL CHECK (char_length(customer_phone) BETWEEN 3 AND 40),
  customer_phone_normalized TEXT NOT NULL
    CHECK (char_length(customer_phone_normalized) BETWEEN 10 AND 16),
  party_size INTEGER CHECK (party_size IS NULL OR party_size BETWEEN 1 AND 10000),
  internal_notes TEXT CHECK (
    internal_notes IS NULL OR char_length(internal_notes) <= 2000
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS campfire_bookings_date_idx
  ON campfire_bookings (booking_date);

CREATE INDEX IF NOT EXISTS campfire_bookings_status_date_idx
  ON campfire_bookings (status, booking_date);

COMMIT;
