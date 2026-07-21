import 'server-only';
import { getDatabase } from '@oldmc/db';

export const VENDOR_PAGE_SIZE = 25;
function filters({ food, electricity, certification }) {
  return {
    where: `WHERE ($1::boolean IS NULL OR is_food_vendor = $1)
      AND ($2::text IS NULL OR electricity_requirement = $2)
      AND ($3::text IS NULL OR certification_status = $3)`,
    params: [food, electricity, certification],
  };
}

export async function getVendorApplications({ page, food, electricity, certification }) {
  const sql = getDatabase();
  const { where, params } = filters({ food, electricity, certification });
  const [count] = await sql.query(`SELECT count(*)::int AS count FROM vendor_applications ${where}`, params);
  const totalEntries = count?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalEntries / VENDOR_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const entries = await sql.query(
    `SELECT id::text, business_name, contact_name, email, phone, phone_normalized, website_url,
      electricity_requirement, is_food_vendor, certification_status, availability_notes,
      policy_version, created_at
     FROM vendor_applications ${where} ORDER BY created_at DESC, id DESC LIMIT $4 OFFSET $5`,
    [...params, VENDOR_PAGE_SIZE, (currentPage - 1) * VENDOR_PAGE_SIZE],
  );
  return { entries, totalEntries, totalPages, currentPage };
}

export function exportVendorApplications(options) {
  const { where, params } = filters(options);
  return getDatabase().query(
    `SELECT id::text, created_at, business_name, contact_name, email, phone, website_url,
      electricity_requirement, is_food_vendor, certification_status, availability_notes, policy_version
     FROM vendor_applications ${where} ORDER BY created_at DESC, id DESC`, params,
  );
}
