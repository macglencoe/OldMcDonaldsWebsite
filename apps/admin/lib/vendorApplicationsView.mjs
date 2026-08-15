import { escapeCsvCell } from './mazeEntriesView.mjs';

export const ELECTRICITY_LABELS = Object.freeze({
  supplied: 'Needs electricity supplied', own_or_none: 'Own generator or none', unknown: 'Unknown',
});
export const CERTIFICATION_LABELS = Object.freeze({ ready: 'Digital copy ready', later: 'Will provide later' });
export const REVIEW_STATUS_LABELS = Object.freeze({
  new: 'New', reviewing: 'Reviewing', contacted: 'Contacted', accepted: 'Accepted', declined: 'Declined', spam: 'Spam',
});
export function parseElectricity(value) { return Object.hasOwn(ELECTRICITY_LABELS, value) ? value : null; }
export function parseCertification(value) { return Object.hasOwn(CERTIFICATION_LABELS, value) ? value : null; }
export function parseFood(value) { return value === 'yes' ? true : value === 'no' ? false : null; }
export function parseReviewStatus(value) { return Object.hasOwn(REVIEW_STATUS_LABELS, value) ? value : null; }
export function parseVendorSearch(value) {
  const search = typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
  return search ? search.slice(0, 100) : null;
}
export function validateReviewUpdate(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { error: 'Invalid request.' };
  const status = parseReviewStatus(value.status);
  if (!status) return { error: 'Choose a valid status.' };
  if (!Array.isArray(value.ids) || !value.ids.length || value.ids.length > 100) return { error: 'Select between 1 and 100 applications.' };
  const ids = [...new Set(value.ids.map(id => String(id)))];
  if (ids.some(id => !/^[1-9]\d*$/.test(id))) return { error: 'Invalid application selection.' };
  const hasNote = Object.hasOwn(value, 'note');
  if (hasNote && ids.length !== 1) return { error: 'Notes can only be updated for one application at a time.' };
  if (hasNote && typeof value.note !== 'string') return { error: 'The internal note must be text.' };
  const note = hasNote ? value.note.trim() : null;
  if (note && note.length > 1000) return { error: 'The internal note must be 1,000 characters or fewer.' };
  return { ids, status, hasNote, note: note || null };
}
export function createVendorCsv(entries) {
  const rows = [['Application ID','Submitted At','Business','Contact','Email','Phone','Website/Social','Electricity','Food Vendor','Certification','Availability','Policy Version']];
  for (const entry of entries) rows.push([
    entry.id, new Date(entry.created_at).toISOString(), entry.business_name, entry.contact_name,
    entry.email, entry.phone, entry.website_url, ELECTRICITY_LABELS[entry.electricity_requirement],
    entry.is_food_vendor ? 'Yes' : 'No', entry.certification_status ? CERTIFICATION_LABELS[entry.certification_status] : 'Not applicable',
    entry.availability_notes, entry.policy_version,
  ]);
  return rows.map(row => row.map(escapeCsvCell).join(',')).join('\r\n');
}
