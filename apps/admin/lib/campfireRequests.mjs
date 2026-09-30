import 'server-only';
import { getDatabase } from '@oldmc/db';
import { escapeCsvCell } from './mazeEntriesView.mjs';

export const CAMPFIRE_REQUEST_PAGE_SIZE = 25;

export async function getCampfireRequests({ page, year, requestId = null, reviewFilter = 'open' }) {
  const sql = getDatabase();
  const params = [year ?? null, requestId, reviewFilter];
  const where = `WHERE ($1::int IS NULL OR EXTRACT(YEAR FROM r.preferred_date) = $1)
    AND ($2::bigint IS NULL OR r.id = $2)
    AND ($2::bigint IS NOT NULL OR $3::text = 'all'
      OR ($3::text = 'open' AND r.review_status IN ('new', 'reviewing')) OR r.review_status = $3)`;
  const [[count], years] = await Promise.all([
    sql.query(`SELECT count(*)::int AS count FROM campfire_reservation_requests r ${where}`, params),
    sql.query('SELECT DISTINCT EXTRACT(YEAR FROM preferred_date)::int AS year FROM campfire_reservation_requests ORDER BY year DESC'),
  ]);
  const totalEntries = count?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalEntries / CAMPFIRE_REQUEST_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const entries = await sql.query(
    `SELECT r.id::text, r.email, r.name, r.phone, r.phone_normalized, r.preferred_date,
       r.fallback_dates, r.party_size, r.price_cents_snapshot, r.policy_version,
       r.additional_comments, r.created_at, r.review_status, r.internal_note, r.reviewed_at,
       COALESCE(json_agg(json_build_object('id', b.id::text, 'booking_date', b.booking_date::text,
         'status', b.status, 'created_at', b.created_at) ORDER BY b.created_at)
         FILTER (WHERE b.id IS NOT NULL), '[]'::json) AS bookings
     FROM campfire_reservation_requests r
     LEFT JOIN campfire_bookings b ON b.reservation_request_id = r.id
     ${where} GROUP BY r.id ORDER BY r.created_at DESC, r.id DESC LIMIT $4 OFFSET $5`,
    [...params, CAMPFIRE_REQUEST_PAGE_SIZE, (currentPage - 1) * CAMPFIRE_REQUEST_PAGE_SIZE],
  );
  return { entries, years: years.map(row => row.year), totalEntries, totalPages, currentPage };
}

export function updateCampfireRequestReview({ id, status, note }) {
  return getDatabase().query(`UPDATE campfire_reservation_requests SET review_status=$2, internal_note=$3,
    reviewed_at=CURRENT_TIMESTAMP WHERE id=$1 RETURNING id::text, review_status, internal_note, reviewed_at`, [id, status, note]);
}

export function exportCampfireRequests({ year }) {
  return getDatabase().query(`SELECT id::text,created_at,email,name,phone,preferred_date,
    fallback_dates,party_size,price_cents_snapshot,policy_version,additional_comments
    FROM campfire_reservation_requests WHERE ($1::int IS NULL OR EXTRACT(YEAR FROM preferred_date)=$1)
    ORDER BY created_at DESC,id DESC`, [year ?? null]);
}

export function createCampfireRequestCsv(entries) {
  const rows = [['Request ID','Submitted At','Email','Name','Phone','Preferred Night','Other Dates','Party Size','Price','Policy Version','Comments']];
  for (const entry of entries) rows.push([`CF-${entry.id}`,new Date(entry.created_at).toISOString(),entry.email,entry.name,entry.phone,
    String(entry.preferred_date).slice(0,10),entry.fallback_dates,entry.party_size,(entry.price_cents_snapshot/100).toFixed(2),entry.policy_version,entry.additional_comments]);
  return rows.map(row => row.map(escapeCsvCell).join(',')).join('\r\n');
}
