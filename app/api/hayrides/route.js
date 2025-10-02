import hayrideData from "@/data/hayrides.example.json";
import { getWagonDefaults, HAYRIDE_WAGON_LOOKUP, HAYRIDE_WAGONS } from "@/lib/wagons";
import { NextResponse } from "next/server";
import crypto from "node:crypto";

const MAX_RETRIES = 5;

/**
 * ISO timestamp used when seeding new day states.
 * @type {string}
 */
const INITIAL_LAST_UPDATED = hayrideData?.generatedAt ?? new Date().toISOString();

const scheduleState = createScheduleState(hayrideData);

/**
 * Cache policy for CDN and browsers.
 * @type {string}
 */
const CACHE_CONTROL = "no-store, max-age=0";

/** Marks this route as always dynamic so query params are respected. */
export const dynamic = "force-dynamic";
/** Ensure the route runs in the Node.js runtime to access crypto hashing. */
export const runtime = "nodejs";

/**
 * Public wagon fields whitelisted for API responses.
 * @type {Array<"id" | "color" | "capacity" | "filled" | "fill">}
 */
const ALLOWED_WAGON_FIELDS = ["id", "color", "capacity", "filled", "fill", "version"];

/**
 * Lightweight error wrapper that carries an HTTP status code.
 */
class HttpError extends Error {
  /**
   * @param {number} status HTTP status code to return to the client.
   * @param {string} message Human readable description of the error.
   */
  constructor(status, message) {
    super(message);
    this.name = "HttpError";
    /** @type {number} */
    this.status = status;
  }
}

/**
 * Creates the mutable schedule state keyed by date.
 * @param {*} source Seed schedule payload.
 * @returns {{ timezone: string | null, defaultDate: string | null, days: Map<string, { slots: any[], lastUpdated: string }> }}
 */
function createScheduleState(source) {
  const timezone = source?.timezone ?? null;
  const today = new Date().toISOString().slice(0, 10);

  return {
    timezone,
    defaultDate: today,
    days: new Map(),
  };
}

/**
 * Ensures a day state exists in memory.
 * @param {string | null | undefined} dateISO Target date in YYYY-MM-DD format.
 * @param {boolean} createIfMissing Whether to create an empty entry when absent.
 * @returns {{slots: any[], lastUpdated: string} | null}
 */
function ensureDayState(dateISO, createIfMissing = true) {
  const fallback = scheduleState.defaultDate;
  const key = typeof dateISO === "string" && dateISO
    ? dateISO
    : fallback ?? new Date().toISOString().slice(0, 10);
  if (!key) {
    return null;
  }
  if (!scheduleState.defaultDate) {
    scheduleState.defaultDate = key;
  }
  if (!scheduleState.days.has(key) && createIfMissing) {
    scheduleState.days.set(key, {
      slots: [],
      lastUpdated: new Date().toISOString(),
    });
  }
  return scheduleState.days.get(key) ?? null;
}

/**
 * Clamps a filled value within the allowed bounds.
 * @param {number} value Proposed filled value.
 * @param {number} capacity Capacity constraint.
 * @returns {number}
 */
function clampFilledValue(value, capacity) {
  const safeCapacity = Number.isFinite(capacity) ? Math.max(0, capacity) : 0;
  const numericValue = Number.isFinite(value) ? value : 0;
  if (numericValue < 0) {
    return 0;
  }
  if (safeCapacity <= 0) {
    return Math.max(0, numericValue);
  }
  return Math.min(safeCapacity, numericValue);
}

/**
 * Normalizes a wagon object to the subset of fields the client should see.
 * @param {Record<string, unknown>} [wagon={}] Source wagon data.
 * @returns {Record<string, unknown>} Sanitized wagon payload.
 */
function normalizeWagon(wagon = {}) {
  const normalized = ALLOWED_WAGON_FIELDS.reduce((acc, key) => {
    if (wagon[key] !== undefined) {
      acc[key] = wagon[key];
    }
    return acc;
  }, {});
  const defaults = getWagonDefaults(wagon?.id);
  if (normalized.capacity === undefined && defaults.capacity !== undefined) {
    normalized.capacity = defaults.capacity;
  }
  if (normalized.color === undefined && defaults.color !== undefined) {
    normalized.color = defaults.color;
  }
  const capacity = normalized.capacity ?? defaults.capacity ?? 0;
  const filledValue = normalized.filled ?? normalized.fill ?? 0;
  const clampedFilled = clampFilledValue(filledValue, capacity);
  normalized.filled = clampedFilled;
  normalized.fill = clampFilledValue(normalized.fill ?? clampedFilled, capacity);
  const version = Number(normalized.version);
  normalized.version = Number.isFinite(version) && version > 0 ? Math.round(version) : 1;
  return normalized;
}

/**
 * Coerces raw slot data into a predictable shape for the response.
 * @param {Array<Record<string, unknown>>} [slots=[]] Raw slot entries.
 * @returns {Array<{start: string | null, label: string | null, wagons: Array<Record<string, unknown>>}>}
 */
function normalizeSlots(slots = []) {
  return slots
    .filter(Boolean)
    .map((slot) => ({
      start: slot?.start ?? null,
      label: slot?.label ?? null,
      wagons: Array.isArray(slot?.wagons)
        ? slot.wagons.map(normalizeWagon)
        : [],
    }));
}

/**
 * Validates `YYYY-MM-DD` strings.
 * @param {string | null} value Candidate date string.
 * @returns {boolean}
 */
function isValidDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value ?? "");
}

/**
 * Ensures an ISO timestamp parses and lands on a :00 or :30 minute mark.
 * @param {string | null} value Candidate ISO string.
 * @returns {boolean}
 */
function isValidIso(value) {
  if (typeof value !== "string" || !value.trim()) {
    return false;
  }
  const ms = Number(new Date(value));
  if (Number.isNaN(ms)) {
    return false;
  }
  const date = new Date(value);
  const minutes = date.getUTCMinutes();
  return minutes === 0 || minutes === 30;
}

/**
 * Builds filter arguments from incoming query parameters.
 * @param {URLSearchParams} searchParams Query string collection.
 * @returns {{date?: string, start?: string, wagonId?: string}}
 */
function buildFilters(searchParams) {
  const filters = {};

  if (searchParams.has("date")) {
    const date = searchParams.get("date");
    if (!isValidDate(date)) {
      throw new HttpError(400, "Invalid 'date' parameter. Expected YYYY-MM-DD.");
    }
    filters.date = date;
  }

  if (searchParams.has("start")) {
    const start = searchParams.get("start");
    if (!isValidIso(start)) {
      throw new HttpError(
        400,
        "Invalid 'start' parameter. Expected ISO date with :00 or :30 minutes."
      );
    }
    filters.start = start;
  }

  if (searchParams.has("wagonId")) {
    const wagonId = searchParams.get("wagonId");
    if (!wagonId) {
      throw new HttpError(400, "'wagonId' cannot be empty.");
    }
    filters.wagonId = wagonId;
  }

  return filters;
}

/**
 * Applies filters to the normalized slot list.
 * @param {Array<{start: string | null, label: string | null, wagons: Array<Record<string, unknown>>}>} baseSlots Baseline slot list.
 * @param {{date?: string, start?: string, wagonId?: string}} filters Active filters.
 * @returns {Array<{start: string | null, label: string | null, wagons: Array<Record<string, unknown>>}>}
 */
function applyFilters(baseSlots, filters) {
  let slots = baseSlots;

  if (filters.start) {
    const startMs = Number(new Date(filters.start));
    slots = slots.filter((slot) => Number(new Date(slot.start)) === startMs);
  }

  if (filters.wagonId) {
    slots = slots
      .map((slot) => ({
        ...slot,
        wagons: slot.wagons.filter((wagon) => wagon.id === filters.wagonId),
      }))
      .filter((slot) => slot.wagons.length > 0);
  }

  return slots;
}

/**
 * Generates a weak ETag header for the provided payload.
 * @param {string} payload Serialized JSON response body.
 * @returns {string}
 */
function createEtag(payload) {
  const hash = crypto.createHash("sha256").update(payload).digest("hex");
  return `W/"${hash}"`;
}

/**
 * Locates a slot and wagon pair in the mutable schedule state.
 * @param {string | null | undefined} slotStart Slot ISO timestamp.
 * @param {string} wagonId Wagon identifier.
 * @returns {{slot: any, wagon: any, slotIndex: number, wagonIndex: number}}
 */
function findSlotAndWagon(dayState, slotStart, wagonId) {
  const slots = Array.isArray(dayState?.slots) ? dayState.slots : [];
  const normalizedStart = typeof slotStart === "string" && slotStart.length ? slotStart : null;

  let slotMatch = null;
  let slotIndex = -1;

  if (normalizedStart) {
    slotIndex = slots.findIndex((slot) => slot?.start === normalizedStart);
    if (slotIndex !== -1) {
      slotMatch = slots[slotIndex];
    }
  }

  if (!slotMatch && wagonId) {
    slotIndex = slots.findIndex((slot) => Array.isArray(slot?.wagons) && slot.wagons.some((wagon) => wagon?.id === wagonId));
    if (slotIndex !== -1) {
      slotMatch = slots[slotIndex];
    }
  }

  if (!slotMatch && slots.length && !normalizedStart) {
    slotIndex = 0;
    slotMatch = slots[0];
  }

  const wagons = Array.isArray(slotMatch?.wagons) ? slotMatch.wagons : [];
  const wagonIndex = wagons.findIndex((wagon) => wagon?.id === wagonId);

  return {
    slot: slotMatch ?? null,
    wagon: wagonIndex !== -1 ? wagons[wagonIndex] : null,
    slotIndex,
    wagonIndex,
  };
}

/**
 * Generates a human-friendly label for a slot.
 * @param {string | null} startISO ISO timestamp.
 * @returns {string | null}
 */
function formatSlotLabel(startISO) {
  if (!startISO) {
    return null;
  }
  const date = new Date(startISO);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

/**
 * Ensures a slot exists inside the provided day state.
 * @param {{slots: any[]}} dayState Day state container.
 * @param {string | null} slotStart ISO timestamp for the slot.
 * @param {string | null} slotLabel Optional label override.
 * @returns {any}
 */
function ensureSlot(dayState, slotStart, slotLabel) {
  if (!slotStart) {
    throw new HttpError(400, "'slotStart' is required to create a new slot.");
  }

  if (!Array.isArray(dayState.slots)) {
    dayState.slots = [];
  }

  let slot = dayState.slots.find((entry) => entry?.start === slotStart);
  if (!slot) {
    slot = {
      start: slotStart,
      label: slotLabel ?? formatSlotLabel(slotStart),
      wagons: [],
    };
    dayState.slots.push(slot);
    dayState.slots.sort((a, b) => new Date(a?.start ?? 0) - new Date(b?.start ?? 0));
  }

  if (!Array.isArray(slot.wagons)) {
    slot.wagons = [];
  }

  return slot;
}

/**
 * Determines the next filled count given request payload.
 * @param {{filled: number, capacity: number}} wagon Wagon reference.
 * @param {{delta?: number, setFilled?: number}} input Adjustment details.
 * @returns {number}
 */
function calculateNextFilled(wagon, input) {
  if (typeof input?.setFilled === "number" && Number.isFinite(input.setFilled)) {
    return clampFilledValue(input.setFilled, wagon.capacity);
  }

  if (typeof input?.delta === "number" && Number.isFinite(input.delta)) {
    const proposed = wagon.filled + input.delta;
    return clampFilledValue(proposed, wagon.capacity);
  }

  throw new HttpError(400, "Request must include a numeric 'delta' or 'setFilled'.");
}

/**
 * Applies an adjustment using optimistic retries.
 * @param {{slotStart?: string | null, wagonId: string, delta?: number, setFilled?: number, expectedVersion?: number | null, autoRetry?: boolean, maxRetries?: number}} payload Adjustment payload.
 * @returns {{slot: any, wagon: any, attempts: number, updated: boolean}}
 */
function adjustWagonWithRetry(payload) {
  let { expectedVersion } = payload;
  const autoRetry = payload.autoRetry !== false;
  const maxAttemptsRaw = Number(payload.maxRetries);
  const maxAttempts = Number.isFinite(maxAttemptsRaw) && maxAttemptsRaw > 0
    ? Math.min(10, Math.max(1, Math.floor(maxAttemptsRaw)))
    : MAX_RETRIES;
  const dateKey = typeof payload.date === "string" && payload.date
    ? payload.date
    : typeof payload.slotStart === "string" && payload.slotStart.length
      ? payload.slotStart.slice(0, 10)
      : null;
  const dayState = ensureDayState(dateKey, true);

  if (!dayState) {
    throw new HttpError(400, "Unable to resolve schedule day for the update.");
  }

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const lookup = findSlotAndWagon(dayState, payload.slotStart, payload.wagonId);
    let slot = lookup.slot;
    let wagon = lookup.wagon;

    if (!slot) {
      slot = ensureSlot(dayState, payload.slotStart ?? null, payload.slotLabel ?? null);
    }

    if (!Array.isArray(slot.wagons)) {
      slot.wagons = [];
    }

    if (!wagon) {
      const defaults = getWagonDefaults(payload.wagonId);
      if (!defaults) {
        throw new HttpError(404, "Unknown wagon identifier.");
      }

      const capacity = Number.isFinite(defaults.capacity) ? defaults.capacity : 0;
      const baseWagon = {
        id: payload.wagonId,
        color: defaults.color ?? null,
        capacity,
        filled: 0,
        fill: 0,
        version: 1,
      };

      slot.wagons.push(baseWagon);
      const orderMap = new Map(HAYRIDE_WAGONS.map((item, index) => [item.id, index]));
      slot.wagons.sort((a, b) => {
        const orderA = orderMap.has(a.id) ? orderMap.get(a.id) : Number.MAX_SAFE_INTEGER;
        const orderB = orderMap.has(b.id) ? orderMap.get(b.id) : Number.MAX_SAFE_INTEGER;
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        return String(a.id ?? "").localeCompare(String(b.id ?? ""));
      });
      wagon = baseWagon;
    }

    const currentVersion = wagon.version ?? 1;

    if (expectedVersion != null && expectedVersion !== currentVersion) {
      if (!autoRetry) {
        throw new HttpError(
          409,
          `Version mismatch. Expected ${expectedVersion}, received ${currentVersion}.`
        );
      }
      expectedVersion = currentVersion;
      continue;
    }

    const nextFilled = calculateNextFilled(wagon, payload);

    if (nextFilled === wagon.filled) {
      return {
        slot,
        wagon,
        attempts: attempt,
        updated: false,
      };
    }

    wagon.filled = nextFilled;
    if (wagon.fill !== undefined) {
      wagon.fill = nextFilled;
    }
    wagon.version = currentVersion + 1;
    dayState.lastUpdated = new Date().toISOString();

    return {
      slot,
      wagon,
      attempts: attempt,
      updated: true,
      date: dateKey ?? scheduleState.defaultDate ?? null,
    };
  }

  throw new HttpError(409, "Failed to apply adjustment after multiple attempts.");
}

/**
 * GET handler for the hayride schedule endpoint.
 * @param {Request} request Next.js request object.
 * @returns {Promise<NextResponse>}
 */
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const filters = buildFilters(url.searchParams);
    const targetDate = filters.date ?? scheduleState.defaultDate ?? new Date().toISOString().slice(0, 10);
    const dayState = ensureDayState(targetDate, true);
    const normalizedSlots = normalizeSlots(dayState?.slots ?? []);
    const filteredSlots = applyFilters(normalizedSlots, filters);

    const responseBody = {
      status: "ok",
      data: {
        date: targetDate,
        timezone: scheduleState?.timezone ?? null,
        lastUpdated: dayState?.lastUpdated ?? INITIAL_LAST_UPDATED,
        slots: filteredSlots,
      },
      meta: {
        fetchedAt: new Date().toISOString(),
        filters,
      },
    };

    const payload = JSON.stringify(responseBody);
    const etag = createEtag(payload);

    if (request.headers.get("if-none-match") === etag) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          "Cache-Control": CACHE_CONTROL,
          ETag: etag,
        },
      });
    }

    return new NextResponse(payload, {
      status: 200,
      headers: {
        "Cache-Control": CACHE_CONTROL,
        "Content-Type": "application/json",
        ETag: etag,
      },
    });
  } catch (error) {
    console.error("[GET /api/hayrides]", error);

    const status = error instanceof HttpError ? error.status : 500;
    const body = {
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error",
    };

    return NextResponse.json(body, { status });
  }
}

/**
 * POST handler that applies seat adjustments with optimistic retries.
 * @param {Request} request Incoming request.
 * @returns {Promise<NextResponse>}
 */
export async function POST(request) {
  try {
    const payload = await request.json();

    if (!payload || typeof payload !== "object") {
      throw new HttpError(400, "Body must be a JSON object.");
    }

    const wagonId = typeof payload.wagonId === "string" ? payload.wagonId.trim() : "";
    if (!wagonId) {
      throw new HttpError(400, "'wagonId' is required.");
    }

    const slotStart = payload.slotStart ?? null;
    if (!slotStart) {
      throw new HttpError(400, "'slotStart' is required.");
    }
    if (!isValidIso(slotStart)) {
      throw new HttpError(400, "'slotStart' must be a valid ISO string ending in :00 or :30.");
    }

    const delta = payload.delta !== undefined ? Number(payload.delta) : undefined;
    const setFilled = payload.setFilled !== undefined ? Number(payload.setFilled) : undefined;
    const expectedVersion = payload.expectedVersion !== undefined
      ? Number(payload.expectedVersion)
      : undefined;
    const slotLabel = typeof payload.slotLabel === "string" ? payload.slotLabel : undefined;
    const dateParam = typeof payload.date === "string" ? payload.date : undefined;
    const normalizedDate = dateParam && isValidDate(dateParam)
      ? dateParam
      : slotStart
        ? slotStart.slice(0, 10)
        : undefined;

    if (delta === undefined && setFilled === undefined) {
      throw new HttpError(400, "Provide either 'delta' or 'setFilled'.");
    }

    if ((delta !== undefined && !Number.isFinite(delta))
      || (setFilled !== undefined && !Number.isFinite(setFilled))) {
      throw new HttpError(400, "'delta' and 'setFilled' must be finite numbers.");
    }

    const result = adjustWagonWithRetry({
      date: normalizedDate,
      slotStart,
      wagonId,
      delta,
      setFilled,
      expectedVersion,
      autoRetry: payload.autoRetry !== false,
      maxRetries: payload.maxRetries,
      slotLabel,
    });

    const resultDate = result.date ?? normalizedDate ?? scheduleState.defaultDate ?? null;
    const dayState = ensureDayState(resultDate, false);

    const responseBody = {
      status: "ok",
      data: {
        date: resultDate,
        timezone: scheduleState?.timezone ?? null,
        slotStart: result.slot?.start ?? null,
        wagon: normalizeWagon(result.wagon),
      },
      meta: {
        attempts: result.attempts,
        updated: result.updated,
        lastUpdated: dayState?.lastUpdated ?? new Date().toISOString(),
      },
    };

    return NextResponse.json(responseBody, { status: 200 });
  } catch (error) {
    console.error("[POST /api/hayrides]", error);

    const status = error instanceof HttpError ? error.status : 500;
    const body = {
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error",
    };

    return NextResponse.json(body, { status });
  }
}
