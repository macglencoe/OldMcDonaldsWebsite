import assert from 'node:assert/strict';
import test from 'node:test';
import { validateReservationRequest } from './reservationRequest.mjs';

const valid = {
  email: 'Guest@example.com', name: ' Jane Doe ', phone: '(304) 555-0100',
  preferredDate: '2026-09-18', preferredTimeSlot: 'early', fallbackDates: '',
  priceAcknowledged: true, weatherRefundAcknowledged: true, earlyArrivalAcknowledged: true,
  additionalComments: '',
};

test('normalizes a valid Friday reservation request', () => {
  const result = validateReservationRequest(valid, { today: '2026-07-18' });
  assert.equal(result.value.email, 'guest@example.com');
  assert.equal(result.value.phoneNormalized, '3045550100');
  assert.equal(result.value.fallbackDates, null);
});

test('rejects past dates and non-weekend dates', () => {
  assert.match(validateReservationRequest({ ...valid, preferredDate: '2026-07-17' }, { today: '2026-07-18' }).error, /future/);
  assert.match(validateReservationRequest({ ...valid, preferredDate: '2026-09-17' }, { today: '2026-07-18' }).error, /Friday/);
});

test('requires every policy acknowledgment', () => {
  assert.match(validateReservationRequest({ ...valid, priceAcknowledged: false }, { today: '2026-07-18' }).error, /policies/);
});
