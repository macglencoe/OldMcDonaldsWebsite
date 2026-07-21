import test from 'node:test';
import assert from 'node:assert/strict';
import { validateVendorApplication } from './vendorApplication.mjs';

const valid = {
  businessName: 'Apple Butter Co.', contactName: 'Jamie Vendor', email: 'JAMIE@example.com',
  phone: '(304) 555-0199', websiteUrl: 'https://example.com/vendor',
  electricityRequirement: 'supplied', isFoodVendor: true,
  healthCertificationAcknowledged: true, certificationStatus: 'later',
  availabilityNotes: 'Unavailable Sunday morning.',
};

test('normalizes a valid food-vendor application', () => {
  const result = validateVendorApplication(valid);
  assert.equal(result.value.email, 'jamie@example.com');
  assert.equal(result.value.phoneNormalized, '3045550199');
  assert.equal(result.value.websiteUrl, 'https://example.com/vendor');
  assert.equal(result.value.certificationStatus, 'later');
});

test('clears certification fields for non-food vendors', () => {
  const result = validateVendorApplication({ ...valid, isFoodVendor: false, healthCertificationAcknowledged: false, certificationStatus: '' });
  assert.equal(result.value.healthCertificationAcknowledged, null);
  assert.equal(result.value.certificationStatus, null);
});

test('requires certification details from food vendors', () => {
  assert.match(validateVendorApplication({ ...valid, healthCertificationAcknowledged: false }).error, /acknowledge/);
  assert.match(validateVendorApplication({ ...valid, certificationStatus: '' }).error, /certification status/);
});

test('rejects invalid contact and website values', () => {
  assert.match(validateVendorApplication({ ...valid, email: 'bad' }).error, /email/);
  assert.match(validateVendorApplication({ ...valid, websiteUrl: 'javascript:alert(1)' }).error, /URL/);
});
