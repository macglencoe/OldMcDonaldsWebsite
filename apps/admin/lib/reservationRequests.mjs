import 'server-only';
import { getDatabase } from '@oldmc/db';

export const RESERVATION_PAGE_SIZE = 25;

export async function getReservationRequests({ page, year, slot }) {
  const sql = getDatabase();
  const params = [year ?? null, slot ?? null];
  const where = `WHERE ($1::int IS NULL OR EXTRACT(YEAR FROM preferred_date) = $1) AND ($2::text IS NULL OR preferred_time_slot = $2)`;
  const [[count], years] = await Promise.all([
    sql.query(`SELECT count(*)::int AS count FROM reservation_requests ${where}`, params),
    sql.query(`SELECT DISTINCT EXTRACT(YEAR FROM preferred_date)::int AS year FROM reservation_requests ORDER BY year DESC`),
  ]);
  const totalEntries = count?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalEntries / RESERVATION_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const entries = await sql.query(
    `SELECT id::text, email, name, phone, phone_normalized, preferred_date, preferred_time_slot,
      fallback_dates, price_cents_snapshot, policy_version, additional_comments, created_at
     FROM reservation_requests ${where} ORDER BY created_at DESC, id DESC LIMIT $3 OFFSET $4`,
    [...params, RESERVATION_PAGE_SIZE, (currentPage - 1) * RESERVATION_PAGE_SIZE],
  );
  return { entries, years: years.map(r => r.year), totalEntries, totalPages, currentPage };
}

export function exportReservationRequests({ year, slot }) {
  return getDatabase().query(
    `SELECT id::text, created_at, email, name, phone, preferred_date, preferred_time_slot,
      fallback_dates, price_cents_snapshot, policy_version, additional_comments
     FROM reservation_requests
     WHERE ($1::int IS NULL OR EXTRACT(YEAR FROM preferred_date) = $1) AND ($2::text IS NULL OR preferred_time_slot = $2)
     ORDER BY created_at DESC, id DESC`, [year ?? null, slot ?? null],
  );
}
