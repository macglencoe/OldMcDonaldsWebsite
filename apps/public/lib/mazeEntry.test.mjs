import assert from 'node:assert/strict';
import test from 'node:test';

import {
  escapeHtml,
  getClientIp,
  hashIp,
  normalizeUserAgent,
  validateMazeEntry,
} from './mazeEntry.mjs';

test('validates and normalizes a maze entry', () => {
  assert.deepEqual(validateMazeEntry({ name: '  Jane   Doe ', phone: ' 555-0100 ' }), {
    value: { name: 'Jane Doe', phone: '555-0100' },
  });
});

test('rejects missing and oversized fields', () => {
  assert.equal(validateMazeEntry({ name: '', phone: '555' }).error, 'Name is required.');
  assert.match(validateMazeEntry({ name: 'A', phone: '1' }).error, /between 3 and 40/);
  assert.match(validateMazeEntry({ name: 'A'.repeat(121), phone: '555' }).error, /120/);
});

test('selects the first forwarded IP address', () => {
  const headers = new Headers({ 'x-forwarded-for': '203.0.113.4, 10.0.0.1' });
  assert.equal(getClientIp(headers), '203.0.113.4');
});

test('creates a stable HMAC without revealing the IP', () => {
  const secret = 'a-development-secret-that-is-long-enough';
  const first = hashIp('203.0.113.4', secret);
  const second = hashIp('203.0.113.4', secret);

  assert.equal(first, second);
  assert.match(first, /^[0-9a-f]{64}$/);
  assert.ok(!first.includes('203.0.113.4'));
  assert.throws(() => hashIp('203.0.113.4', 'too-short'), /at least 32/);
});

test('limits stored user-agent length and escapes notification HTML', () => {
  assert.equal(normalizeUserAgent(new Headers({ 'user-agent': 'A'.repeat(600) }))?.length, 512);
  assert.equal(escapeHtml('<Jane & Co>'), '&lt;Jane &amp; Co&gt;');
});
