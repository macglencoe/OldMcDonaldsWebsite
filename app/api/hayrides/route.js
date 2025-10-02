import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { db } from "@/lib/db/client";
import { hayrideSlots, hayrideWagons } from "@/lib/db/schema";
import { and, asc, eq, inArray } from "drizzle-orm";
import { getSlotsForDate } from "@/lib/slots";
import { getWagonDefaults, HAYRIDE_WAGONS, HAYRIDE_WAGON_LOOKUP } from "@/lib/wagons";

const CACHE_CONTROL = "no-store, max-age=0";
const TIME_ZONE = "America/Chicago";

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function isValidDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value ?? "");
}

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

function clampFilledValue(value, capacity) {
  const safeCapacity = Number.isFinite(capacity) ? Math.max(0, capacity) : 0;
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue) || numericValue < 0) {
    return 0;
  }
  if (safeCapacity <= 0) {
    return Math.round(numericValue);
  }
  return Math.min(safeCapacity, Math.round(numericValue));
}

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

function createEtag(payload) {
  const hash = crypto.createHash("sha256").update(payload).digest("hex");
  return `W/"${hash}"`;
}

function normalizeWagonRow(row) {
  const defaults = getWagonDefaults(row.wagonId);
  const capacity = Number.isFinite(row.capacity) ? row.capacity : defaults.capacity ?? 0;
  const filled = clampFilledValue(row.filled ?? 0, capacity);
  return {
    id: row.wagonId,
    color: row.color ?? defaults.color ?? null,
    capacity,
    filled,
    fill: filled,
    version: row.version ?? 1,
  };
}

function mergeSlotsWithRoster(dateISO, slotRows, wagonRows) {
  const wagonsBySlotId = new Map();
  wagonRows.forEach((row) => {
    const normalized = normalizeWagonRow(row);
    if (!wagonsBySlotId.has(row.slotId)) {
      wagonsBySlotId.set(row.slotId, []);
    }
    wagonsBySlotId.get(row.slotId).push(normalized);
  });

  const slotsByStart = new Map();
  slotRows.forEach((slot) => {
    const normalizedWagons = wagonsBySlotId.get(slot.id) ?? [];
    slotsByStart.set(slot.start, {
      start: slot.start,
      label: slot.label ?? formatSlotLabel(slot.start),
      wagons: normalizedWagons,
    });
  });

  const template = getSlotsForDate(dateISO);
  const result = template.map((templateSlot) => {
    const existing = slotsByStart.get(templateSlot.start);
    const source = existing ?? {
      start: templateSlot.start,
      label: templateSlot.label,
      wagons: [],
    };

    const existingMap = new Map(source.wagons.map((wagon) => [wagon.id, wagon]));

    const merged = HAYRIDE_WAGONS.map((rosterWagon) => {
      const entry = existingMap.get(rosterWagon.id);
      if (entry) {
        return {
          ...entry,
          capacity: entry.capacity ?? rosterWagon.capacity ?? 0,
          color: entry.color ?? rosterWagon.color ?? null,
        };
      }
      return {
        id: rosterWagon.id,
        color: rosterWagon.color ?? null,
        capacity: rosterWagon.capacity ?? 0,
        filled: 0,
        fill: 0,
        version: 1,
      };
    });

    source.wagons.forEach((wagon) => {
      if (!HAYRIDE_WAGON_LOOKUP[wagon.id]) {
        merged.push(wagon);
      }
    });

    return {
      start: source.start,
      label: source.label ?? formatSlotLabel(source.start),
      wagons: merged,
    };
  });

  slotsByStart.forEach((slot, start) => {
    if (!template.some((templateSlot) => templateSlot.start === start)) {
      const existingMap = new Map(slot.wagons.map((wagon) => [wagon.id, wagon]));
      const merged = HAYRIDE_WAGONS.map((rosterWagon) => {
        const entry = existingMap.get(rosterWagon.id);
        if (entry) {
          return {
            ...entry,
            capacity: entry.capacity ?? rosterWagon.capacity ?? 0,
            color: entry.color ?? rosterWagon.color ?? null,
          };
        }
        return {
          id: rosterWagon.id,
          color: rosterWagon.color ?? null,
          capacity: rosterWagon.capacity ?? 0,
          filled: 0,
          fill: 0,
          version: 1,
        };
      });
      slot.wagons.forEach((wagon) => {
        if (!HAYRIDE_WAGON_LOOKUP[wagon.id]) {
          merged.push(wagon);
        }
      });
      result.push({
        start,
        label: slot.label ?? formatSlotLabel(start),
        wagons: merged,
      });
    }
  });

  return result.sort((a, b) => new Date(a.start ?? 0) - new Date(b.start ?? 0));
}

async function fetchScheduleForDate(dateISO) {
  const slots = await db
    .select()
    .from(hayrideSlots)
    .where(eq(hayrideSlots.date, dateISO))
    .orderBy(asc(hayrideSlots.start));

  const slotIds = slots.map((slot) => slot.id);
  const wagons = slotIds.length
    ? await db
        .select()
        .from(hayrideWagons)
        .where(inArray(hayrideWagons.slotId, slotIds))
    : [];

  return { slots, wagons };
}

async function findOrCreateSlot(dateISO, startISO, label) {
  const [inserted] = await db
    .insert(hayrideSlots)
    .values({
      date: dateISO,
      start: startISO,
      label: label ?? formatSlotLabel(startISO),
    })
    .onConflictDoNothing({ target: [hayrideSlots.date, hayrideSlots.start] })
    .returning();

  if (inserted) {
    return inserted;
  }

  const [existing] = await db
    .select()
    .from(hayrideSlots)
    .where(and(eq(hayrideSlots.date, dateISO), eq(hayrideSlots.start, startISO)))
    .limit(1);

  if (!existing) {
    throw new HttpError(500, "Failed to load slot after upsert.");
  }

  return existing;
}

async function findOrCreateWagon(slotId, wagonId) {
  const defaults = getWagonDefaults(wagonId);

  const [inserted] = await db
    .insert(hayrideWagons)
    .values({
      slotId,
      wagonId,
      color: defaults.color ?? null,
      capacity: defaults.capacity ?? 0,
      filled: 0,
      version: 1,
    })
    .onConflictDoNothing({ target: [hayrideWagons.slotId, hayrideWagons.wagonId] })
    .returning();

  if (inserted) {
    return inserted;
  }

  const [existing] = await db
    .select()
    .from(hayrideWagons)
    .where(and(eq(hayrideWagons.slotId, slotId), eq(hayrideWagons.wagonId, wagonId)))
    .limit(1);

  if (!existing) {
    throw new HttpError(500, "Failed to load wagon after upsert.");
  }

  return existing;
}

function computeNextFilled(wagon, input) {
  const capacity = Number.isFinite(wagon.capacity) ? wagon.capacity : 0;

  if (input.setFilled !== undefined && input.setFilled !== null) {
    return clampFilledValue(input.setFilled, capacity);
  }

  if (input.delta !== undefined && input.delta !== null) {
    const proposed = (wagon.filled ?? 0) + input.delta;
    return clampFilledValue(proposed, capacity);
  }

  throw new HttpError(400, "Provide either 'delta' or 'setFilled'.");
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const requestedDate = url.searchParams.get("date");
    const dateISO = isValidDate(requestedDate) ? requestedDate : todayISO();

    const { slots, wagons } = await fetchScheduleForDate(dateISO);
    const mergedSlots = mergeSlotsWithRoster(dateISO, slots, wagons);

    const responseBody = {
      status: "ok",
      data: {
        date: dateISO,
        timezone: TIME_ZONE,
        lastUpdated: new Date().toISOString(),
        slots: mergedSlots,
      },
      meta: {
        fetchedAt: new Date().toISOString(),
        filters: {
          date: dateISO,
        },
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

    const dateParam = typeof payload.date === "string" ? payload.date : null;
    const dateISO = isValidDate(dateParam) ? dateParam : slotStart.slice(0, 10);
    if (!dateISO) {
      throw new HttpError(400, "Unable to resolve schedule date.");
    }

    const delta = payload.delta !== undefined ? Number(payload.delta) : undefined;
    const setFilled = payload.setFilled !== undefined ? Number(payload.setFilled) : undefined;
    const expectedVersionRaw = payload.expectedVersion !== undefined
      ? Number(payload.expectedVersion)
      : undefined;
    const slotLabel = typeof payload.slotLabel === "string" ? payload.slotLabel : undefined;

    if ((delta === undefined || Number.isNaN(delta)) && (setFilled === undefined || Number.isNaN(setFilled))) {
      throw new HttpError(400, "Provide either 'delta' or 'setFilled'.");
    }

    const slot = await findOrCreateSlot(dateISO, slotStart, slotLabel);
    let wagon = await findOrCreateWagon(slot.id, wagonId);

    const currentVersion = wagon.version ?? 1;
    const expectedVersion = expectedVersionRaw ?? currentVersion;

    if (expectedVersion !== currentVersion) {
      throw new HttpError(409, `Version mismatch. Expected ${expectedVersion}, received ${currentVersion}.`);
    }

    const nextFilled = computeNextFilled(wagon, { delta, setFilled });
    if (nextFilled === wagon.filled) {
      return NextResponse.json({
        status: "ok",
        data: {
          date: dateISO,
          timezone: TIME_ZONE,
          slotStart,
          wagon: normalizeWagonRow(wagon),
        },
        meta: {
          attempts: 1,
          updated: false,
          lastUpdated: new Date().toISOString(),
        },
      });
    }

    const [updated] = await db
      .update(hayrideWagons)
      .set({
        filled: nextFilled,
        version: currentVersion + 1,
      })
      .where(and(eq(hayrideWagons.id, wagon.id), eq(hayrideWagons.version, currentVersion)))
      .returning();

    if (!updated) {
      throw new HttpError(409, "Concurrent update detected. Please retry.");
    }

    wagon = updated;

    const responseBody = {
      status: "ok",
      data: {
        date: dateISO,
        timezone: TIME_ZONE,
        slotStart,
        wagon: normalizeWagonRow(wagon),
      },
      meta: {
        attempts: 1,
        updated: true,
        lastUpdated: new Date().toISOString(),
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
