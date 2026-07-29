import "server-only";

import { getDatabase } from "@oldmc/db";

import {
  HAYRIDE_TIME_ZONE,
  clampFilled,
  formatSlotLabel,
  getWagonDefaults,
  isValidHayrideDate,
  mergeHayrideSchedule,
  todayInHayrideTimeZone,
} from "./hayrideSchedule.mjs";

export class HayrideError extends Error {
  constructor(code, message, status = 400) {
    super(message);
    this.name = "HayrideError";
    this.code = code;
    this.status = status;
  }
}

export function normalizeScheduleDate(value) {
  if (value === null || value === undefined || value === "") {
    return todayInHayrideTimeZone();
  }
  if (!isValidHayrideDate(value)) {
    throw new HayrideError("INVALID_DATE", "Use a valid schedule date in YYYY-MM-DD format.");
  }
  return value;
}

export async function getHayrideSchedule(date, { sql = getDatabase() } = {}) {
  const scheduleDate = normalizeScheduleDate(date);
  const slots = await sql.query(
     `SELECT id, date::text, start, label, created_at
     FROM hayride_slots
     WHERE date::text = $1
     ORDER BY start`,
    [scheduleDate],
  );
  const wagons = slots.length
    ? await sql.query(
      `SELECT w.id, w.slot_id, w.wagon_id, w.color, w.capacity, w.filled,
         w.version, w.notes
       FROM hayride_wagons w
       JOIN hayride_slots s ON s.id = w.slot_id
       WHERE s.date::text = $1
       ORDER BY w.id`,
      [scheduleDate],
    )
    : [];

  const now = new Date().toISOString();
  return {
    data: {
      date: scheduleDate,
      timezone: HAYRIDE_TIME_ZONE,
      lastUpdated: now,
      slots: mergeHayrideSchedule(scheduleDate, slots, wagons),
    },
    meta: {
      fetchedAt: now,
      filters: { date: scheduleDate },
    },
  };
}

function requireInteger(value, field, { min = Number.MIN_SAFE_INTEGER } = {}) {
  const numeric = Number(value);
  if (!Number.isSafeInteger(numeric) || numeric < min) {
    throw new HayrideError("INVALID_UPDATE", `'${field}' must be an integer${min > Number.MIN_SAFE_INTEGER ? ` of at least ${min}` : ""}.`);
  }
  return numeric;
}

function normalizeUpdate(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new HayrideError("INVALID_BODY", "Body must be a JSON object.");
  }

  const wagonId = typeof input.wagonId === "string" ? input.wagonId.trim() : "";
  if (!wagonId || wagonId.length > 100) {
    throw new HayrideError("INVALID_WAGON", "'wagonId' is required and must be at most 100 characters.");
  }

  const slotStart = typeof input.slotStart === "string" ? input.slotStart : "";
  const slotMatch = slotStart.match(/^(\d{4}-\d{2}-\d{2})T(?:[01]\d|2[0-3]):(?:00|30):00$/);
  if (!slotMatch || !isValidHayrideDate(slotMatch[1])) {
    throw new HayrideError("INVALID_SLOT", "'slotStart' must be a valid local timestamp on a half-hour boundary.");
  }

  const date = normalizeScheduleDate(input.date || slotMatch[1]);
  if (date !== slotMatch[1]) {
    throw new HayrideError("DATE_MISMATCH", "'date' must match the date in 'slotStart'.");
  }

  const hasDelta = input.delta !== undefined && input.delta !== null;
  const hasSetFilled = input.setFilled !== undefined && input.setFilled !== null;
  if (hasDelta === hasSetFilled) {
    throw new HayrideError("INVALID_UPDATE", "Provide exactly one of 'delta' or 'setFilled'.");
  }

  return {
    wagonId,
    slotStart,
    date,
    delta: hasDelta ? requireInteger(input.delta, "delta") : null,
    setFilled: hasSetFilled ? requireInteger(input.setFilled, "setFilled", { min: 0 }) : null,
    expectedVersion: input.expectedVersion === undefined || input.expectedVersion === null
      ? null
      : requireInteger(input.expectedVersion, "expectedVersion", { min: 1 }),
    slotLabel: typeof input.slotLabel === "string" && input.slotLabel.trim()
      ? input.slotLabel.trim().slice(0, 100)
      : formatSlotLabel(slotStart),
  };
}

function normalizeUpdatedWagon(row) {
  const defaults = getWagonDefaults(row.wagon_id);
  const capacity = Number(row.capacity);
  const filled = clampFilled(row.filled, capacity);
  return {
    id: row.wagon_id,
    label: defaults.label,
    color: row.color ?? defaults.color,
    capacity,
    filled,
    fill: filled,
    version: Number(row.version),
    notes: row.notes ?? null,
  };
}

export async function updateHayrideWagon(input, { sql = getDatabase() } = {}) {
  const value = normalizeUpdate(input);
  const defaults = getWagonDefaults(value.wagonId);

  const [slot] = await sql.query(
    `INSERT INTO hayride_slots (date, start, label)
     VALUES ($1, $2, $3)
     ON CONFLICT (date, start) DO UPDATE
       SET label = COALESCE(hayride_slots.label, EXCLUDED.label)
     RETURNING id`,
    [value.date, value.slotStart, value.slotLabel],
  );

  let [wagon] = await sql.query(
    `INSERT INTO hayride_wagons (
       slot_id, wagon_id, color, capacity, filled, version
     ) VALUES ($1, $2, $3, $4, 0, 1)
     ON CONFLICT (slot_id, wagon_id) DO UPDATE
       SET wagon_id = EXCLUDED.wagon_id
     RETURNING id, wagon_id, color, capacity, filled, version, notes`,
    [slot.id, value.wagonId, defaults.color, defaults.capacity],
  );

  const currentVersion = Number(wagon.version);
  const expectedVersion = value.expectedVersion ?? currentVersion;
  if (expectedVersion !== currentVersion) {
    throw new HayrideError(
      "VERSION_CONFLICT",
      "This wagon was updated elsewhere. Refresh the schedule and try again.",
      409,
    );
  }

  const nextFilled = value.setFilled === null
    ? clampFilled(Number(wagon.filled) + value.delta, Number(wagon.capacity))
    : clampFilled(value.setFilled, Number(wagon.capacity));
  let updated = false;
  if (nextFilled !== Number(wagon.filled)) {
    const rows = await sql.query(
      `UPDATE hayride_wagons
       SET filled = $2, version = version + 1
       WHERE id = $1 AND version = $3
       RETURNING id, wagon_id, color, capacity, filled, version, notes`,
      [wagon.id, nextFilled, currentVersion],
    );
    if (!rows.length) {
      throw new HayrideError(
        "VERSION_CONFLICT",
        "This wagon was updated elsewhere. Refresh the schedule and try again.",
        409,
      );
    }
    [wagon] = rows;
    updated = true;
  }

  return {
    data: {
      date: value.date,
      timezone: HAYRIDE_TIME_ZONE,
      slotStart: value.slotStart,
      wagon: normalizeUpdatedWagon(wagon),
    },
    meta: {
      updated,
      lastUpdated: new Date().toISOString(),
    },
  };
}
