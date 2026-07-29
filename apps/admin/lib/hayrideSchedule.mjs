export const HAYRIDE_TIME_ZONE = "America/New_York";

export const HAYRIDE_WAGONS = [
  { id: "wagon-green", color: "green", capacity: 15, label: "Green Wagon" },
  { id: "wagon-blue", color: "blue", capacity: 20, label: "Blue Wagon" },
  { id: "wagon-red", color: "red", capacity: 25, label: "Red Wagon" },
  { id: "wagon-white", color: "white", capacity: 15, label: "White Wagon" },
];

export const HAYRIDE_WAGON_LOOKUP = Object.fromEntries(
  HAYRIDE_WAGONS.map((wagon) => [wagon.id, wagon]),
);

export const SLOT_TEMPLATES = {
  friday: [
    "13:30", "14:00", "14:30", "15:00", "15:30", "16:00",
    "16:30", "17:00", "17:30", "18:00", "18:30", "19:00",
    "19:30", "20:00", "20:30", "21:00", "21:30", "22:00",
  ],
  saturday: [
    "11:30", "12:00", "12:30", "13:00", "13:30", "14:00",
    "14:30", "15:00", "15:30", "16:00", "16:30", "17:00",
    "17:30", "18:00", "18:30", "19:00", "19:30", "20:00",
    "20:30", "21:00", "21:30", "22:00",
  ],
  sunday: [
    "12:30", "13:00", "13:30", "14:00", "14:30", "15:00",
    "15:30", "16:00", "16:30", "17:00", "17:30",
  ],
  monday: [
    "13:30", "14:00", "14:30", "15:00", "15:30", "16:00",
    "16:30", "17:00", "17:30",
  ],
};

export function isValidHayrideDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}

export function todayInHayrideTimeZone(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: HAYRIDE_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function getWagonDefaults(wagonId) {
  return HAYRIDE_WAGON_LOOKUP[wagonId] ?? {
    id: wagonId,
    color: null,
    capacity: 0,
    label: wagonId,
  };
}

export function formatSlotLabel(start) {
  const match = typeof start === "string"
    ? start.match(/^\d{4}-\d{2}-\d{2}T(\d{2}):(\d{2}):00$/)
    : null;
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = match[2];
  const hour = hours % 12 || 12;
  return `${hour}:${minutes} ${hours >= 12 ? "PM" : "AM"}`;
}

export function getSlotsForDate(dateISO) {
  if (!isValidHayrideDate(dateISO)) return [];

  const [year, month, day] = dateISO.split("-").map(Number);
  const weekday = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day))).toLowerCase();

  return (SLOT_TEMPLATES[weekday] ?? []).map((time) => ({
    start: `${dateISO}T${time}:00`,
    label: formatSlotLabel(`${dateISO}T${time}:00`),
  }));
}

export function clampFilled(value, capacity) {
  const numericValue = Number(value);
  const numericCapacity = Number(capacity);
  const safeValue = Number.isFinite(numericValue) ? Math.max(0, Math.round(numericValue)) : 0;
  const safeCapacity = Number.isFinite(numericCapacity) ? Math.max(0, Math.round(numericCapacity)) : 0;
  return safeCapacity > 0 ? Math.min(safeValue, safeCapacity) : safeValue;
}

function normalizeWagon(row) {
  const wagonId = row.wagonId ?? row.wagon_id ?? row.id;
  const defaults = getWagonDefaults(wagonId);
  const capacityValue = Number(row.capacity);
  const capacity = Number.isFinite(capacityValue) ? capacityValue : defaults.capacity;
  const filled = clampFilled(row.filled, capacity);
  const versionValue = Number(row.version);

  return {
    id: wagonId,
    label: row.label ?? defaults.label,
    color: row.color ?? defaults.color,
    capacity,
    filled,
    fill: filled,
    version: Number.isSafeInteger(versionValue) && versionValue > 0 ? versionValue : 1,
    notes: row.notes ?? null,
  };
}

function mergeWagons(rows = []) {
  const existing = new Map(rows.map((row) => {
    const wagon = normalizeWagon(row);
    return [wagon.id, wagon];
  }));

  const merged = HAYRIDE_WAGONS.map((defaults) => existing.get(defaults.id) ?? {
    ...defaults,
    filled: 0,
    fill: 0,
    version: 1,
    notes: null,
  });

  existing.forEach((wagon, id) => {
    if (!HAYRIDE_WAGON_LOOKUP[id]) merged.push(wagon);
  });

  return merged;
}

export function mergeHayrideSchedule(dateISO, slotRows = [], wagonRows = []) {
  const wagonsBySlot = new Map();
  wagonRows.forEach((wagon) => {
    const slotId = wagon.slotId ?? wagon.slot_id;
    const rows = wagonsBySlot.get(String(slotId)) ?? [];
    rows.push(wagon);
    wagonsBySlot.set(String(slotId), rows);
  });

  const persisted = new Map(slotRows.map((slot) => [
    slot.start,
    {
      start: slot.start,
      label: slot.label ?? formatSlotLabel(slot.start),
      wagons: mergeWagons(wagonsBySlot.get(String(slot.id)) ?? []),
    },
  ]));

  const slots = getSlotsForDate(dateISO).map((template) => {
    const existing = persisted.get(template.start);
    persisted.delete(template.start);
    return existing ?? { ...template, wagons: mergeWagons() };
  });

  persisted.forEach((slot) => slots.push(slot));
  return slots.sort((left, right) => left.start.localeCompare(right.start));
}
