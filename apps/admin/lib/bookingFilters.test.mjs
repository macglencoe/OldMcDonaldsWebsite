import assert from 'node:assert/strict';
import test from 'node:test';

import {
  bookingFilterParams,
  groupGazeboBookingsBySeason,
  parseBookingFilters,
  safeBookingReturnPath,
} from './bookingFilters.mjs';

test('parses gazebo search, status, slot, and date filters', () => {
  assert.deepEqual(parseBookingFilters({
    search: ' GZ-42 ',
    status: 'confirmed',
    gazebo: 'B',
    slot: 'late',
    from: '2026-09-01',
    to: '2026-11-30',
  }, 'gazebo'), {
    search: 'GZ-42',
    status: 'confirmed',
    slot: 'late',
    gazebo: 'B',
    from: '2026-09-01',
    to: '2026-11-30',
    bookingId: 42,
    requestId: null,
    phoneDigits: null,
  });
});

test('recognizes request IDs and normalized phone fragments', () => {
  assert.equal(parseBookingFilters({ search: '#381' }, 'gazebo').requestId, 381);
  assert.equal(parseBookingFilters({ search: '(304) 555' }, 'campfires').phoneDigits, '304555');
});

test('uses safe defaults for invalid filters', () => {
  const filters = parseBookingFilters({
    status: 'deleted',
    slot: 'either',
    from: '2026-02-30',
  }, 'gazebo');
  assert.equal(filters.status, 'active');
  assert.equal(filters.slot, 'all');
  assert.equal(filters.gazebo, 'all');
  assert.equal(filters.from, null);
});

test('builds compact, stable filter URLs', () => {
  const filters = parseBookingFilters({
    search: 'Smith',
    status: 'all',
    gazebo: 'A',
    slot: 'early',
  }, 'gazebo');
  assert.equal(bookingFilterParams(filters, { page: 2 }).toString(), 'search=Smith&status=all&slot=early&gazebo=A&page=2');
});

test('only accepts return paths within the matching booking section', () => {
  assert.equal(
    safeBookingReturnPath('/bookings/gazebo?status=cancelled', 'gazebo'),
    '/bookings/gazebo?status=cancelled',
  );
  assert.equal(safeBookingReturnPath('https://example.com', 'gazebo'), '/bookings/gazebo');
  assert.equal(safeBookingReturnPath('/bookings/campfires', 'gazebo'), '/bookings/gazebo');
});

test('groups gazebo bookings into their configured seasons', () => {
  const seasons = [
    { id: '1', start_date: '2026-09-01', end_date: '2026-11-30' },
    { id: '2', start_date: '2027-09-01', end_date: '2027-11-30' },
  ];
  const groups = groupGazeboBookingsBySeason([
    { id: '10', booking_date: '2026-10-10' },
    { id: '11', booking_date: '2027-10-10' },
    { id: '12', booking_date: '2028-10-10' },
  ], seasons);
  assert.deepEqual(groups.map(group => ({
    key: group.key,
    bookingIds: group.bookings.map(booking => booking.id),
  })), [
    { key: '1', bookingIds: ['10'] },
    { key: '2', bookingIds: ['11'] },
    { key: 'unconfigured', bookingIds: ['12'] },
  ]);
});
