import assert from 'node:assert/strict';
import test from 'node:test';
import { validateCampfireReservationRequest } from './campfireReservationRequest.mjs';

const valid = { name: 'Jamie Doe', email: 'Jamie@example.com', phone: '(304) 555-0199', preferredDate: '2026-10-16', partySize: '18', fallbackDates: '', additionalComments: '', priceAcknowledged: true };

test('normalizes a valid campfire reservation request', () => {
  assert.deepEqual(validateCampfireReservationRequest(valid, { today: '2026-09-30' }).value, {
    name: 'Jamie Doe', email: 'jamie@example.com', phone: '(304) 555-0199', phoneNormalized: '3045550199',
    preferredDate: '2026-10-16', partySize: 18, fallbackDates: null, additionalComments: null,
  });
});

test('requires a future date and price acknowledgment', () => {
  assert.match(validateCampfireReservationRequest({ ...valid, preferredDate: '2026-09-30' }, { today: '2026-09-30' }).error, /future/);
  assert.match(validateCampfireReservationRequest({ ...valid, priceAcknowledged: false }, { today: '2026-09-30' }).error, /price/);
});
