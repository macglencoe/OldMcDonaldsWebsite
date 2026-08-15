import assert from 'node:assert/strict'; import test from 'node:test';
import {
  createReservationCsv,
  getActiveBooking,
  getRequestSlotLabel,
  isRequestOpen,
  parseRequestId,
  parseRequestReviewFilter,
  parseRequestReviewStatus,
  parseSlot,
  validateRequestReviewUpdate,
} from './reservationRequestsView.mjs';
test('validates reservation slots',()=>{ assert.equal(parseSlot('early'),'early'); assert.equal(parseSlot('bad'),null); });
test('validates direct request filters', () => {
  assert.equal(parseRequestId('381'), 381);
  assert.equal(parseRequestId('0'), null);
  assert.equal(parseRequestId('nope'), null);
});
test('validates reservation review filters and statuses', () => {
  assert.equal(parseRequestReviewFilter(undefined), 'open');
  assert.equal(parseRequestReviewFilter('resolved'), 'resolved');
  assert.equal(parseRequestReviewFilter('unexpected'), 'open');
  assert.equal(parseRequestReviewStatus('spam'), 'spam');
  assert.equal(parseRequestReviewStatus('open'), null);
  assert.equal(isRequestOpen('new'), true);
  assert.equal(isRequestOpen('resolved'), false);
});
test('validates reservation review updates', () => {
  assert.deepEqual(validateRequestReviewUpdate({ id: '42', status: 'resolved', note: ' Campfire booked ' }), {
    id: 42, status: 'resolved', note: 'Campfire booked',
  });
  assert.match(validateRequestReviewUpdate({ id: 0, status: 'spam', note: '' }).error, /valid reservation/);
  assert.match(validateRequestReviewUpdate({ id: 1, status: 'open', note: '' }).error, /valid status/);
});
test('finds tentative or confirmed bookings but ignores cancelled history', () => {
  const cancelled = { id: '1', status: 'cancelled' };
  const confirmed = { id: '2', status: 'confirmed' };
  assert.equal(getActiveBooking([cancelled, confirmed]), confirmed);
  assert.equal(getActiveBooking([cancelled]), null);
});
test('uses the customer-visible slot snapshot when available', () => {
  assert.equal(getRequestSlotLabel({
    preferred_time_slot: 'early',
    gazebo_slot_config: {
      earlyStartTime: '12:30',
      earlyEndTime: '14:30',
    },
  }), '12:30 PM – 2:30 PM');
  assert.equal(getRequestSlotLabel({ preferred_time_slot: 'late' }), '4:00 PM – 6:00 PM');
});
test('exports approved fields without internal metadata',()=>{ const csv=createReservationCsv([{id:'1',created_at:'2026-07-18T00:00:00Z',email:'a@b.com',name:'Jane',phone:'304-555-0100',preferred_date:'2026-09-18',preferred_time_slot:'early',fallback_dates:null,price_cents_snapshot:7500,policy_version:1,additional_comments:null}]); assert.match(csv,/75\.00/); assert.ok(!/ip_hash|user_agent|meta_json/.test(csv)); });
