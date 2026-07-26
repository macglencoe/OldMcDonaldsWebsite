import assert from 'node:assert/strict';
import test from 'node:test';

import {
  gazeboSlotLabels,
  isDateOnly,
  labelsFromSnapshot,
  snapshotGazeboSlotConfig,
} from './gazeboSlotConfig.mjs';

test('formats configured gazebo times for customers', () => {
  assert.deepEqual(gazeboSlotLabels({
    early_start_time: '12:30',
    early_end_time: '14:30',
    late_start_time: '15:00',
    late_end_time: '17:00',
  }), {
    early: '12:30 PM – 2:30 PM',
    late: '3:00 PM – 5:00 PM',
    either: 'Either works',
  });
});

test('round-trips the customer-visible season snapshot', () => {
  const snapshot = snapshotGazeboSlotConfig({
    id: '4',
    season_name: '2026 Fall',
    early_start_time: '13:00',
    early_end_time: '15:00',
    late_start_time: '16:00',
    late_end_time: '18:00',
  });
  assert.equal(labelsFromSnapshot(snapshot).late, '4:00 PM – 6:00 PM');
  assert.equal(snapshot.seasonId, '4');
});

test('validates date-only lookup values', () => {
  assert.equal(isDateOnly('2026-10-10'), true);
  assert.equal(isDateOnly('2026-02-30'), false);
  assert.equal(isDateOnly('October 10'), false);
});
