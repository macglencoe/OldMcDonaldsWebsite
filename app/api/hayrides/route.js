import hayrideData from "@/data/hayrides.example.json";
import { NextResponse } from "next/server";
import crypto from "node:crypto";

const MAX_RETRIES = 5;

const scheduleState = initializeScheduleState(hayrideData);

/**
 * ISO-8601 timestamp describing the last data refresh.
 * @type {string}
 */
let lastUpdated = hayrideData?.generatedAt ?? new Date().toISOString();

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
 * Builds an internal mutable schedule representation from the seed data.
 * @param {any} source Raw schedule document.
 * @returns {{date: string | null, timezone: string | null, slots: Array<{start: string | null, label: string | null, wagons: Array<{id: string, color: string | null, capacity: number, filled: number, fill?: number, version: number}>}>}}}
 */
function initializeScheduleState(source) {
  const slots = Array.isArray(source?.slots) ? source.slots : [];

  return {
    date: source?.date ?? null,
    timezone: source?.timezone ?? null,
    slots: slots.map((slot, slotIndex) => {
      const wagons = Array.isArray(slot?.wagons) ? slot.wagons : [];

      return {
        start: slot?.start ?? null,
        label: slot?.label ?? null,
        wagons: wagons.map((wagon, wagonIndex) => {
          const id = typeof wagon?.id === "string" && wagon.id
            ? wagon.id
            : `wagon-${slotIndex}-${wagonIndex}`;

          const filled = Number.isFinite(Number(wagon?.filled))
            ? Number(wagon?.filled)
            : Number.isFinite(Number(wagon?.fill))
              ? Number(wagon?.fill)
              : 0;

          const capacity = Number.isFinite(Number(wagon?.capacity))
            ? Math.max(0, Number(wagon.capacity))
            : 0;

          return {
            id,
            color: wagon?.color ?? null,
            capacity,
            filled: clampFilledValue(filled, capacity),
            fill: wagon?.fill,
            version: 1,
          };
        }),
      };
    }),
  };
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
  if (normalized.fill === undefined && typeof normalized.filled === "number") {
    normalized.fill = normalized.filled;
  }
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

  if (filters.date && scheduleState?.date && filters.date !== scheduleState.date) {
    // No slots for the requested date in the sample data.
    return [];
  }

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
function findSlotAndWagon(slotStart, wagonId) {
  const slots = scheduleState?.slots ?? [];
  const normalizedStart = typeof slotStart === "string" && slotStart.length ? slotStart : null;

  for (let i = 0; i < slots.length; i += 1) {
    const slot = slots[i];
    if (normalizedStart && slot?.start !== normalizedStart) {
      continue;
    }

    const wagons = Array.isArray(slot?.wagons) ? slot.wagons : [];
    const wagonIndex = wagons.findIndex((wagon) => wagon?.id === wagonId);

    if (wagonIndex !== -1) {
      return {
        slot,
        wagon: wagons[wagonIndex],
        slotIndex: i,
        wagonIndex,
      };
    }

    if (normalizedStart) {
      break;
    }
  }

  return {
    slot: null,
    wagon: null,
    slotIndex: -1,
    wagonIndex: -1,
  };
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

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const { slot, wagon } = findSlotAndWagon(payload.slotStart, payload.wagonId);

    if (!slot || !wagon) {
      throw new HttpError(404, "Wagon not found for the provided identifiers.");
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
    lastUpdated = new Date().toISOString();

    return {
      slot,
      wagon,
      attempts: attempt,
      updated: true,
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

    const normalizedSlots = normalizeSlots(scheduleState?.slots ?? []);
    const filteredSlots = applyFilters(normalizedSlots, filters);

    const responseBody = {
      status: "ok",
      data: {
        date: scheduleState?.date ?? null,
        timezone: scheduleState?.timezone ?? null,
        lastUpdated,
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
    if (slotStart && !isValidIso(slotStart)) {
      throw new HttpError(400, "'slotStart' must be a valid ISO string ending in :00 or :30.");
    }

    const delta = payload.delta !== undefined ? Number(payload.delta) : undefined;
    const setFilled = payload.setFilled !== undefined ? Number(payload.setFilled) : undefined;
    const expectedVersion = payload.expectedVersion !== undefined
      ? Number(payload.expectedVersion)
      : undefined;

    if (delta === undefined && setFilled === undefined) {
      throw new HttpError(400, "Provide either 'delta' or 'setFilled'.");
    }

    if ((delta !== undefined && !Number.isFinite(delta))
      || (setFilled !== undefined && !Number.isFinite(setFilled))) {
      throw new HttpError(400, "'delta' and 'setFilled' must be finite numbers.");
    }

    const result = adjustWagonWithRetry({
      slotStart,
      wagonId,
      delta,
      setFilled,
      expectedVersion,
      autoRetry: payload.autoRetry !== false,
      maxRetries: payload.maxRetries,
    });

    const responseBody = {
      status: "ok",
      data: {
        date: scheduleState?.date ?? null,
        timezone: scheduleState?.timezone ?? null,
        slotStart: result.slot?.start ?? null,
        wagon: normalizeWagon(result.wagon),
      },
      meta: {
        attempts: result.attempts,
        updated: result.updated,
        lastUpdated,
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
