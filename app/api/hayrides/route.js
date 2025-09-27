import hayrideData from "@/data/hayrides.example.json";
import { NextResponse } from "next/server";
import crypto from "node:crypto";

/**
 * ISO-8601 timestamp describing the last data refresh.
 * @type {string}
 */
const LAST_UPDATED = hayrideData?.generatedAt ?? new Date().toISOString();

/**
 * Cache policy for CDN and browsers.
 * @type {string}
 */
const CACHE_CONTROL = "public, max-age=0, s-maxage=300, stale-while-revalidate=600";

/** Marks this route as always dynamic so query params are respected. */
export const dynamic = "force-dynamic";
/** Ensure the route runs in the Node.js runtime to access crypto hashing. */
export const runtime = "nodejs";

/**
 * Public wagon fields whitelisted for API responses.
 * @type {Array<"id" | "color" | "capacity" | "filled" | "fill">}
 */
const ALLOWED_WAGON_FIELDS = ["id", "color", "capacity", "filled", "fill"];

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
 * Normalizes a wagon object to the subset of fields the client should see.
 * @param {Record<string, unknown>} [wagon={}] Source wagon data.
 * @returns {Record<string, unknown>} Sanitized wagon payload.
 */
function normalizeWagon(wagon = {}) {
  return ALLOWED_WAGON_FIELDS.reduce((acc, key) => {
    if (wagon[key] !== undefined) {
      acc[key] = wagon[key];
    }
    return acc;
  }, {});
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

  if (filters.date && hayrideData?.date && filters.date !== hayrideData.date) {
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
 * GET handler for the hayride schedule endpoint.
 * @param {Request} request Next.js request object.
 * @returns {Promise<NextResponse>}
 */
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const filters = buildFilters(url.searchParams);

    const normalizedSlots = normalizeSlots(hayrideData?.slots ?? []);
    const filteredSlots = applyFilters(normalizedSlots, filters);

    const responseBody = {
      status: "ok",
      data: {
        date: hayrideData?.date ?? null,
        timezone: hayrideData?.timezone ?? null,
        lastUpdated: LAST_UPDATED,
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
