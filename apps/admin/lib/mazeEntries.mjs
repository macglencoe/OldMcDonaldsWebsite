import 'server-only';

import { getDatabase } from '@oldmc/db';

export const MAZE_ENTRIES_PAGE_SIZE = 25;

export async function getMazeEntries({ page, year }) {
  const sql = getDatabase();
  const yearParam = year ?? null;

  const [countRows, yearRows] = await Promise.all([
    sql.query(
      `SELECT count(*)::int AS count
       FROM maze_entries
       WHERE ($1::smallint IS NULL OR year = $1)`,
      [yearParam],
    ),
    sql.query(
      `SELECT DISTINCT year
       FROM maze_entries
       ORDER BY year DESC`,
    ),
  ]);

  const totalEntries = countRows[0]?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalEntries / MAZE_ENTRIES_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const offset = (currentPage - 1) * MAZE_ENTRIES_PAGE_SIZE;

  const entries = await sql.query(
    `SELECT id::text, name, phone, year, created_at
     FROM maze_entries
     WHERE ($1::smallint IS NULL OR year = $1)
     ORDER BY created_at DESC, id DESC
     LIMIT $2 OFFSET $3`,
    [yearParam, MAZE_ENTRIES_PAGE_SIZE, offset],
  );

  return {
    entries,
    years: yearRows.map((row) => row.year),
    currentPage,
    totalEntries,
    totalPages,
  };
}

export async function getMazeEntriesForExport({ year }) {
  return getDatabase().query(
    `SELECT id::text, created_at, name, phone, year
     FROM maze_entries
     WHERE ($1::smallint IS NULL OR year = $1)
     ORDER BY created_at DESC, id DESC`,
    [year ?? null],
  );
}
