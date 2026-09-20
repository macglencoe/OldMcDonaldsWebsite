const defaults = {
  season: {
    name: "2026 Fall Season",
    year: 2026,
    opensAt: "2026-09-26T11:00:00-04:00",
    closesAt: "2026-10-31T18:00:00-04:00",
    timeZone: "America/New_York",
    weekendCount: 6,
  },
  nightMaze: {
    firstDate: "2026-10-16",
    opensAt: "19:30",
    closesAt: "22:30",
    lastAdmissionAt: "22:00",
  },
  policies: {
    freeAdmissionMaxAge: 3,
  },
  business: {
    name: "Old McDonald's Pumpkin Patch",
    legalName: "Old McDonalds Pumpkin Patch LLC",
    phone: "+13048392330",
    phoneDisplay: "(304) 839-2330",
    email: "team@oldmcdonaldspumpkinpatch.com",
    streetAddress: "1597 Arden Nollville Rd",
    addressLocality: "Inwood",
    addressRegion: "WV",
    postalCode: "25428",
    addressCountry: "US",
    latitude: 39.38273,
    longitude: -78.04342,
  },
  social: {
    facebookUrl: "https://www.facebook.com/oldmcdonaldspumpkinpatchandcornmaze",
    instagramUrl: "https://www.instagram.com/oldmcdonaldspumpkin/",
    tiktokUrl: "https://www.tiktok.com/@glencoefarmwv",
    reviewsUrl: "https://www.google.com/search?q=Old+McDonalds+Pumpkin+Patch+%26+Corn+Maze+Reviews",
  },
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function mergeKnown(defaultValue, candidate) {
  if (Array.isArray(defaultValue)) {
    return Array.isArray(candidate) ? clone(candidate) : clone(defaultValue);
  }

  if (defaultValue && typeof defaultValue === "object") {
    const source = candidate && typeof candidate === "object" && !Array.isArray(candidate)
      ? candidate
      : {};
    return Object.fromEntries(
      Object.entries(defaultValue).map(([key, value]) => [key, mergeKnown(value, source[key])]),
    );
  }

  if (typeof candidate === typeof defaultValue) {
    if (typeof candidate !== "string" || candidate.trim()) return candidate;
  }

  return defaultValue;
}

export const DEFAULT_SITE_SETTINGS = Object.freeze(clone(defaults));

export function normalizeSiteSettings(value) {
  return mergeKnown(defaults, value);
}

export function formatBusinessAddress(settings, { oneLine = false } = {}) {
  const business = normalizeSiteSettings(settings).business;
  const locality = `${business.addressLocality}, ${business.addressRegion} ${business.postalCode}`;
  return oneLine ? `${business.streetAddress}, ${locality}` : `${business.streetAddress}\n${locality}`;
}

export function createDirectionsUrl(settings) {
  const address = formatBusinessAddress(settings, { oneLine: true });
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}

export function formatTime24(time) {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time ?? "")) return time ?? "";
  const [hour, minute] = time.split(":").map(Number);
  const period = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:${String(minute).padStart(2, "0")} ${period}`;
}

export function formatMonthDay(date, timeZone = defaults.season.timeZone) {
  // Date-only values have no timezone. Parse them at noon UTC so formatting in
  // North American timezones cannot shift them to the previous calendar day.
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(date ?? "")
    ? new Date(`${date}T12:00:00Z`)
    : new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", { timeZone, month: "long", day: "numeric" });
}
