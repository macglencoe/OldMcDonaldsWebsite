const STATUS_FILTERS = new Set(['active', 'tentative', 'confirmed', 'cancelled', 'all']);
const SLOT_FILTERS = new Set(['early', 'late', 'all']);
const GAZEBO_FILTERS = new Set(['A', 'B', 'all']);
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function validDate(value) {
  if (typeof value !== 'string' || !DATE_REGEX.test(value)) return null;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
    ? value
    : null;
}

export function parseBookingFilters(params = {}, type) {
  const rawSearch = typeof params.search === 'string' ? params.search.trim() : '';
  const search = rawSearch.slice(0, 120) || null;
  const status = STATUS_FILTERS.has(params.status) ? params.status : 'active';
  const slot = type === 'gazebo' && SLOT_FILTERS.has(params.slot) ? params.slot : 'all';
  const gazebo = type === 'gazebo' && GAZEBO_FILTERS.has(params.gazebo) ? params.gazebo : 'all';
  const from = validDate(params.from);
  const to = validDate(params.to);
  const prefix = type === 'gazebo' ? 'GZ' : 'CF';
  const bookingMatch = search?.match(new RegExp(`^${prefix}-(\\d+)$`, 'i'));
  const requestMatch = type === 'gazebo' ? search?.match(/^#(\d+)$/) : null;
  const phoneDigits = search?.replace(/\D/g, '') ?? '';

  return {
    search,
    status,
    slot,
    gazebo,
    from,
    to,
    bookingId: bookingMatch ? Number(bookingMatch[1]) : null,
    requestId: requestMatch ? Number(requestMatch[1]) : null,
    phoneDigits: phoneDigits.length >= 3 ? phoneDigits : null,
  };
}

export function bookingFilterParams(filters, { page } = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.status !== 'active') params.set('status', filters.status);
  if (filters.slot && filters.slot !== 'all') params.set('slot', filters.slot);
  if (filters.gazebo && filters.gazebo !== 'all') params.set('gazebo', filters.gazebo);
  if (filters.from) params.set('from', filters.from);
  if (filters.to) params.set('to', filters.to);
  if (page && page > 1) params.set('page', page);
  return params;
}

export function safeBookingReturnPath(value, type) {
  const base = `/bookings/${type}`;
  return typeof value === 'string' && (value === base || value.startsWith(`${base}?`))
    ? value
    : base;
}

export function groupGazeboBookingsBySeason(bookings, seasons) {
  const groups = [];
  for (const booking of bookings) {
    const season = seasons.find(
      (candidate) =>
        booking.booking_date >= candidate.start_date &&
        booking.booking_date <= candidate.end_date,
    );
    const key = season?.id ?? 'unconfigured';
    let group = groups.find((candidate) => candidate.key === key);
    if (!group) {
      group = { key, season: season ?? null, bookings: [] };
      groups.push(group);
    }
    group.bookings.push(booking);
  }
  return groups;
}
