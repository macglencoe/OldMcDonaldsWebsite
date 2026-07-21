import { escapeCsvCell } from './mazeEntriesView.mjs';

export const SLOT_LABELS = Object.freeze({ early: '1:00 PM – 3:00 PM', late: '4:00 PM – 6:00 PM', either: 'Either works' });
export function parseSlot(value) { return Object.hasOwn(SLOT_LABELS, value) ? value : null; }
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
  for (const e of entries) rows.push([e.id, new Date(e.created_at).toISOString(), e.email, e.name, e.phone, formatDateOnly(e.preferred_date), SLOT_LABELS[e.preferred_time_slot], e.fallback_dates, (e.price_cents_snapshot/100).toFixed(2), e.policy_version, e.additional_comments]);
  return rows.map(row => row.map(escapeCsvCell).join(',')).join('\r\n');
}
