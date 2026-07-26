import { escapeCsvCell } from './mazeEntriesView.mjs';

export const SLOT_LABELS = Object.freeze({ early: '1:00 PM – 3:00 PM', late: '4:00 PM – 6:00 PM', either: 'Either works' });
export function parseSlot(value) { return Object.hasOwn(SLOT_LABELS, value) ? value : null; }
export function parseRequestId(value) {
  const normalized = typeof value === 'string' && /^\d+$/.test(value.trim()) ? Number(value.trim()) : value;
  return Number.isSafeInteger(normalized) && normalized > 0 ? normalized : null;
}
export function getActiveBooking(bookings = []) {
  return bookings.find(booking => booking.status === 'tentative' || booking.status === 'confirmed') ?? null;
}
function formatTime(value) {
  const match = String(value ?? '').match(/^(\d{2}):(\d{2})/);
  if (!match) return '';
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' })
    .format(new Date(2000, 0, 1, Number(match[1]), Number(match[2])));
}
export function getRequestSlotLabel(request) {
  const snapshot = request?.gazebo_slot_config;
  if (!snapshot || request.preferred_time_slot === 'either') {
    return SLOT_LABELS[request.preferred_time_slot];
  }
  if (request.preferred_time_slot === 'early') {
    return `${formatTime(snapshot.earlyStartTime)} – ${formatTime(snapshot.earlyEndTime)}`;
  }
  if (request.preferred_time_slot === 'late') {
    return `${formatTime(snapshot.lateStartTime)} – ${formatTime(snapshot.lateEndTime)}`;
  }
  return SLOT_LABELS[request.preferred_time_slot];
}
export function formatDateOnly(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const stringValue = String(value ?? '');
  if (/^\d{4}-\d{2}-\d{2}/.test(stringValue)) return stringValue.slice(0, 10);
  const parsed = new Date(stringValue);
  if (Number.isNaN(parsed.getTime())) throw new Error('Invalid reservation date.');
  return parsed.toISOString().slice(0, 10);
}
export function createReservationCsv(entries) {
  const rows = [['Request ID','Submitted At','Email','Name','Phone','Preferred Date','Preferred Time','Fallback Dates','Price','Policy Version','Comments']];
  for (const e of entries) rows.push([e.id, new Date(e.created_at).toISOString(), e.email, e.name, e.phone, formatDateOnly(e.preferred_date), getRequestSlotLabel(e), e.fallback_dates, (e.price_cents_snapshot/100).toFixed(2), e.policy_version, e.additional_comments]);
  return rows.map(row => row.map(escapeCsvCell).join(',')).join('\r\n');
}
