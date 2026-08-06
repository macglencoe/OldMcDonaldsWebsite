import assert from 'node:assert/strict';
import test from 'node:test';

import {
  validateCampfireBooking,
  validateGazeboBooking,
  validateGazeboConversion,
  validateGazeboSeasonConfig,
} from './bookingValidation.mjs';

const customer = {
  customerName: '  Jane   Smith ',
  customerEmail: ' JANE@EXAMPLE.COM ',
  customerPhone: '(304) 555-0123',
};

test('normalizes a manual gazebo booking', () => {
  const result = validateGazeboBooking({
    ...customer,
    bookingDate: '2026-10-10',
    gazeboCode: 'B',
    timeSlot: 'early',
    status: 'confirmed',
    partySize: '18',
    internalNotes: '  Needs accessible seating.  ',
  });

  assert.deepEqual(result.value, {
    bookingDate: '2026-10-10',
    status: 'confirmed',
    partySize: 18,
    internalNotes: 'Needs accessible seating.',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    customerPhone: '(304) 555-0123',
    customerPhoneNormalized: '3045550123',
    gazeboCode: 'B',
    timeSlot: 'early',
  });
});

test('gazebo bookings require a concrete slot', () => {
  const result = validateGazeboBooking({
    ...customer,
    bookingDate: '2026-10-10',
    gazeboCode: 'A',
    timeSlot: 'either',
    status: 'tentative',
  });
  assert.equal(result.error, 'Choose an early or late gazebo slot.');
});

test('gazebo bookings require a concrete gazebo assignment', () => {
  const result = validateGazeboBooking({
    ...customer,
    bookingDate: '2026-10-10',
    gazeboCode: 'C',
    timeSlot: 'early',
    status: 'tentative',
  });
  assert.equal(result.error, 'Choose Gazebo A or Gazebo B.');
});

test('validates conversion input without accepting customer copies', () => {
  const result = validateGazeboConversion({
    reservationRequestId: '381',
    bookingDate: '2026-10-11',
    gazeboCode: 'A',
    timeSlot: 'late',
    status: 'confirmed',
    partySize: '',
    customerName: 'Ignored Browser Value',
  });

  assert.deepEqual(result.value, {
    bookingDate: '2026-10-11',
    status: 'confirmed',
    partySize: null,
    internalNotes: null,
    gazeboCode: 'A',
    timeSlot: 'late',
    reservationRequestId: 381,
  });
});

test('allows multiple structurally valid campfire bookings on the same date', () => {
  const first = validateCampfireBooking({
    ...customer,
    bookingDate: '2026-10-10',
    status: 'confirmed',
  });
  const second = validateCampfireBooking({
    ...customer,
    customerEmail: 'other@example.com',
    bookingDate: '2026-10-10',
    status: 'tentative',
  });

  assert.ok(first.value);
  assert.ok(second.value);
});

test('rejects impossible dates and invalid contact details', () => {
  assert.match(validateCampfireBooking({
    ...customer,
    bookingDate: '2026-02-30',
    status: 'confirmed',
  }).error, /valid date/);

  assert.match(validateCampfireBooking({
    ...customer,
    customerPhone: '555',
    bookingDate: '2026-10-10',
    status: 'confirmed',
  }).error, /10 to 15 digits/);
});

test('validates non-overlapping gazebo slot configuration', () => {
  const valid = validateGazeboSeasonConfig({
    seasonName: '2026 Fall Season',
    startDate: '2026-09-19',
    endDate: '2026-11-01',
    earlyStartTime: '13:00',
    earlyEndTime: '15:00',
    lateStartTime: '16:00',
    lateEndTime: '18:00',
  });
  assert.equal(valid.value.seasonName, '2026 Fall Season');

  const overlappingSlots = validateGazeboSeasonConfig({
    seasonName: '2026 Fall Season',
    startDate: '2026-09-19',
    endDate: '2026-11-01',
    earlyStartTime: '13:00',
    earlyEndTime: '16:30',
    lateStartTime: '16:00',
    lateEndTime: '18:00',
  });
  assert.equal(overlappingSlots.error, 'Gazebo slots cannot overlap.');
});
