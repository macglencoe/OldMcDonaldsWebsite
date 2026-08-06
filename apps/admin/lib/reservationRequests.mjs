import 'server-only';
import { getDatabase } from '@oldmc/db';

export const RESERVATION_PAGE_SIZE = 25;

export async function getReservationRequests({ page, year, slot, requestId = null }) {
  const sql = getDatabase();
  const params = [year ?? null, slot ?? null, requestId];
  const where = `WHERE ($1::int IS NULL OR EXTRACT(YEAR FROM r.preferred_date) = $1)
    AND ($2::text IS NULL OR r.preferred_time_slot = $2)
    AND ($3::bigint IS NULL OR r.id = $3)`;
  const [[count], years] = await Promise.all([
    sql.query(`SELECT count(*)::int AS count FROM reservation_requests r ${where}`, params),
    sql.query(`SELECT DISTINCT EXTRACT(YEAR FROM preferred_date)::int AS year FROM reservation_requests ORDER BY year DESC`),
  ]);
  const totalEntries = count?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalEntries / RESERVATION_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const entries = await sql.query(
    `SELECT r.id::text, r.email, r.name, r.phone, r.phone_normalized,
       r.preferred_date, r.preferred_time_slot, r.fallback_dates,
       r.price_cents_snapshot, r.policy_version, r.additional_comments, r.created_at,
       r.meta_json->'gazeboSlotConfig' AS gazebo_slot_config,
       COALESCE(
         json_agg(
           json_build_object(
             'id', b.id::text,
             'booking_date', b.booking_date::text,
             'gazebo_code', b.gazebo_code,
             'time_slot', b.time_slot,
             'status', b.status,
             'created_at', b.created_at
           ) ORDER BY b.created_at
         ) FILTER (WHERE b.id IS NOT NULL),
         '[]'::json
       ) AS bookings
     FROM reservation_requests r
     LEFT JOIN gazebo_bookings b ON b.reservation_request_id = r.id
     ${where}
     GROUP BY r.id
     ORDER BY r.created_at DESC, r.id DESC
     LIMIT $4 OFFSET $5`,
    [...params, RESERVATION_PAGE_SIZE, (currentPage - 1) * RESERVATION_PAGE_SIZE],
  );
  return { entries, years: years.map(r => r.year), totalEntries, totalPages, currentPage };
}

export function exportReservationRequests({ year, slot }) {
  return getDatabase().query(
    `SELECT id::text, created_at, email, name, phone, preferred_date, preferred_time_slot,
      fallback_dates, price_cents_snapshot, policy_version, additional_comments,
      meta_json->'gazeboSlotConfig' AS gazebo_slot_config
     FROM reservation_requests
     WHERE ($1::int IS NULL OR EXTRACT(YEAR FROM preferred_date) = $1) AND ($2::text IS NULL OR preferred_time_slot = $2)
     ORDER BY created_at DESC, id DESC`, [year ?? null, slot ?? null],
  );
}
