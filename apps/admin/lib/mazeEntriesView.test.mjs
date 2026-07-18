import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildMazeEntriesUrl,
  createMazeEntriesCsv,
  parsePage,
  parseYear,
} from './mazeEntriesView.mjs';

test('normalizes pagination and year filters', () => {
  assert.equal(parsePage('3'), 3);
  assert.equal(parsePage('-1'), 1);
  assert.equal(parsePage('nope'), 1);
  assert.equal(parseYear('2026'), 2026);
  assert.equal(parseYear('26'), null);
  assert.equal(parseYear(''), null);
});

test('builds stable filter and pagination URLs', () => {
  assert.equal(buildMazeEntriesUrl(), '/maze-entries');
  assert.equal(buildMazeEntriesUrl({ page: 2, year: 2026 }), '/maze-entries?year=2026&page=2');
});

test('creates escaped CSV and neutralizes spreadsheet formulas', () => {
  const csv = createMazeEntriesCsv([
    {
      id: '3',
      created_at: '2026-07-18T18:44:28.419Z',
      name: 'Doe, "Jane"',
      phone: '+1-555-0100',
      year: 2026,
    },
  ]);

  assert.match(csv, /"Doe, ""Jane"""/);
  assert.match(csv, /"'\+1-555-0100"/);
  assert.ok(csv.endsWith('"2026"'));
});
