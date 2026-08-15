import 'server-only';
import { getDatabase } from '@oldmc/db';

export const VENDOR_PAGE_SIZE = 25;
function filters({ food, electricity, certification, status = null, search = null }) {
  return {
    where: `WHERE ($1::boolean IS NULL OR is_food_vendor = $1)
      AND ($2::text IS NULL OR electricity_requirement = $2)
      AND ($3::text IS NULL OR certification_status = $3)
      AND ($4::text IS NULL OR review_status = $4)
      AND ($5::text IS NULL OR business_name ILIKE '%' || $5 || '%'
        OR contact_name ILIKE '%' || $5 || '%'
        OR email ILIKE '%' || $5 || '%'
        OR phone ILIKE '%' || $5 || '%')`,
    params: [food, electricity, certification, status, search],
  };
}

export async function getVendorApplications({ page, food, electricity, certification, status, search }) {
  const sql = getDatabase();
  const { where, params } = filters({ food, electricity, certification, status, search });
  const [count] = await sql.query(`SELECT count(*)::int AS count FROM vendor_applications ${where}`, params);
  const totalEntries = count?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalEntries / VENDOR_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const entries = await sql.query(
    `SELECT id::text, business_name, contact_name, email, phone, phone_normalized, website_url,
      electricity_requirement, is_food_vendor, certification_status, availability_notes,
      policy_version, review_status, internal_note, reviewed_at, created_at
     FROM vendor_applications ${where} ORDER BY created_at DESC, id DESC LIMIT $6 OFFSET $7`,
    [...params, VENDOR_PAGE_SIZE, (currentPage - 1) * VENDOR_PAGE_SIZE],
  );
  return { entries, totalEntries, totalPages, currentPage };
}

export async function updateVendorApplicationReviews({ ids, status, hasNote, note }) {
  const sql = getDatabase();
  if (hasNote) {
    return sql.query(
      `UPDATE vendor_applications
       SET review_status = $1, internal_note = $2, reviewed_at = CURRENT_TIMESTAMP
       WHERE id = ANY($3::bigint[]) RETURNING id::text`,
      [status, note, ids],
    );
  }
  return sql.query(
    `UPDATE vendor_applications
     SET review_status = $1, reviewed_at = CURRENT_TIMESTAMP
     WHERE id = ANY($2::bigint[]) RETURNING id::text`,
    [status, ids],
  );
}

export function exportVendorApplications(options) {
  const { where, params } = filters(options);
  return getDatabase().query(
    `SELECT id::text, created_at, business_name, contact_name, email, phone, website_url,
      electricity_requirement, is_food_vendor, certification_status, availability_notes, policy_version
     FROM vendor_applications ${where} ORDER BY created_at DESC, id DESC`, params,
  );
}
