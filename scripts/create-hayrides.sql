-- Run against the same database configured by OLDMC_DATABASE_URL or DATABASE_URL.

CREATE TABLE IF NOT EXISTS hayride_slots (
  id BIGSERIAL PRIMARY KEY,
  date DATE NOT NULL,
  start TEXT NOT NULL,
  label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT hayride_slots_date_start_unique UNIQUE (date, start),
  CONSTRAINT hayride_slots_start_format_check
    CHECK (start ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}T([01][0-9]|2[0-3]):(00|30):00$')
);

CREATE TABLE IF NOT EXISTS hayride_wagons (
  id BIGSERIAL PRIMARY KEY,
  slot_id BIGINT NOT NULL REFERENCES hayride_slots(id) ON DELETE CASCADE,
  wagon_id TEXT NOT NULL,
  color TEXT,
  capacity INTEGER NOT NULL CHECK (capacity >= 0),
  filled INTEGER NOT NULL DEFAULT 0 CHECK (filled >= 0 AND filled <= capacity),
  version INTEGER NOT NULL DEFAULT 1 CHECK (version > 0),
  notes TEXT,
  CONSTRAINT hayride_wagons_slot_wagon_unique UNIQUE (slot_id, wagon_id)
);

CREATE INDEX IF NOT EXISTS hayride_slots_date_idx
  ON hayride_slots (date, start);
