import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createVendorCsv,
  parseCertification,
  parseElectricity,
  parseFood,
  parseReviewStatus,
  parseVendorSearch,
  validateReviewUpdate,
} from './vendorApplicationsView.mjs';

test('validates vendor application filters', () => {
  assert.equal(parseFood('yes'), true); assert.equal(parseFood('no'), false); assert.equal(parseFood('maybe'), null);
  assert.equal(parseElectricity('supplied'), 'supplied'); assert.equal(parseElectricity('bad'), null);
  assert.equal(parseCertification('later'), 'later'); assert.equal(parseCertification('bad'), null);
});

test('normalizes vendor review filters', () => {
  assert.equal(parseReviewStatus('reviewing'), 'reviewing');
  assert.equal(parseReviewStatus('deleted'), null);
  assert.equal(parseVendorSearch('  Apple   Cider  '), 'Apple Cider');
  assert.equal(parseVendorSearch('   '), null);
});

test('validates single and bulk review updates', () => {
  assert.deepEqual(validateReviewUpdate({ ids: [12, '13', 12], status: 'spam' }), {
    ids: ['12', '13'], status: 'spam', hasNote: false, note: null,
  });
  assert.deepEqual(validateReviewUpdate({ ids: ['12'], status: 'contacted', note: ' Called Tuesday ' }), {
    ids: ['12'], status: 'contacted', hasNote: true, note: 'Called Tuesday',
  });
  assert.match(validateReviewUpdate({ ids: [], status: 'spam' }).error, /Select/);
  assert.match(validateReviewUpdate({ ids: ['1', '2'], status: 'spam', note: '' }).error, /one application/);
  assert.match(validateReviewUpdate({ ids: ['nope'], status: 'new' }).error, /Invalid/);
});

test('exports approved vendor fields and protects spreadsheets', () => {
  const csv = createVendorCsv([{ id: '1', created_at: '2026-07-20T12:00:00Z', business_name: '=DANGER',
    contact_name: 'Jamie', email: 'j@example.com', phone: '304-555-0199', website_url: null,
    electricity_requirement: 'supplied', is_food_vendor: true, certification_status: 'later',
    availability_notes: 'Sunday', policy_version: 1 }]);
  assert.match(csv, /'\=DANGER/); assert.match(csv, /Will provide later/); assert.doesNotMatch(csv, /ip_hash/);
});
