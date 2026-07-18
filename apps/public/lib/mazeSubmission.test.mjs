import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildMazeSubmission,
  shouldEnableMazeFallback,
} from './mazeSubmission.mjs';

test('routes database-enabled submissions to the first-party endpoint', () => {
  assert.deepEqual(
    buildMazeSubmission({ name: 'Jane', phone: '555-0100', usingDatabase: true }),
    {
      endpoint: '/api/forms/maze-entry',
      payload: { name: 'Jane', phone: '555-0100' },
    },
  );
});

test('keeps database-disabled submissions on the legacy email endpoint', () => {
  const request = buildMazeSubmission({
    name: 'Jane',
    phone: '555-0100',
    usingDatabase: false,
  });

  assert.equal(request.endpoint, '/api/email');
  assert.equal(request.payload.kind, 'maze');
});

test('falls back for database outages and service limits, not validation errors', () => {
  assert.equal(shouldEnableMazeFallback({ usingDatabase: true, status: 503 }), true);
  assert.equal(shouldEnableMazeFallback({ usingDatabase: true, status: 429 }), true);
  assert.equal(shouldEnableMazeFallback({ usingDatabase: true, status: 400 }), false);
  assert.equal(shouldEnableMazeFallback({ usingDatabase: false, status: 500 }), false);
});
