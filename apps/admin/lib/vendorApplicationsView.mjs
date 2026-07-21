import { escapeCsvCell } from './mazeEntriesView.mjs';

export const ELECTRICITY_LABELS = Object.freeze({
  supplied: 'Needs electricity supplied', own_or_none: 'Own generator or none', unknown: 'Unknown',
});
export const CERTIFICATION_LABELS = Object.freeze({ ready: 'Digital copy ready', later: 'Will provide later' });
export function parseElectricity(value) { return Object.hasOwn(ELECTRICITY_LABELS, value) ? value : null; }
export function parseCertification(value) { return Object.hasOwn(CERTIFICATION_LABELS, value) ? value : null; }
export function parseFood(value) { return value === 'yes' ? true : value === 'no' ? false : null; }
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
