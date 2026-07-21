import test from 'node:test';
import assert from 'node:assert/strict';
import { createVendorCsv, parseCertification, parseElectricity, parseFood } from './vendorApplicationsView.mjs';

test('validates vendor application filters', () => {
  assert.equal(parseFood('yes'), true); assert.equal(parseFood('no'), false); assert.equal(parseFood('maybe'), null);
  assert.equal(parseElectricity('supplied'), 'supplied'); assert.equal(parseElectricity('bad'), null);
  assert.equal(parseCertification('later'), 'later'); assert.equal(parseCertification('bad'), null);
});

test('exports approved vendor fields and protects spreadsheets', () => {
  const csv = createVendorCsv([{ id: '1', created_at: '2026-07-20T12:00:00Z', business_name: '=DANGER',
    contact_name: 'Jamie', email: 'j@example.com', phone: '304-555-0199', website_url: null,
    electricity_requirement: 'supplied', is_food_vendor: true, certification_status: 'later',
    availability_notes: 'Sunday', policy_version: 1 }]);
  assert.match(csv, /'\=DANGER/); assert.match(csv, /Will provide later/); assert.doesNotMatch(csv, /ip_hash/);
});
