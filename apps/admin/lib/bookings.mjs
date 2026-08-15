import 'server-only';

import { getDatabase } from '@oldmc/db';

import {
  validateCampfireBooking,
  validateGazeboBooking,
  validateGazeboConversion,
  validateGazeboSeasonConfig,
} from './bookingValidation.mjs';

export class BookingError extends Error {
  constructor(code, message, status = 400) {
    super(message);
    this.name = 'BookingError';
    this.code = code;
    this.status = status;
  }
}

export async function getGazeboBookings(filters = {}, { sql = getDatabase() } = {}) {
  const {
    from = null, to = null, status = 'active', search = null,
    phoneDigits = null, bookingId = null, requestId = null, slot = 'all', gazebo = 'all',
  } = filters;
  return sql.query(
    `SELECT id::text, booking_date::text, gazebo_code, time_slot,
       to_char(start_time_snapshot, 'HH24:MI') AS start_time,
       to_char(end_time_snapshot, 'HH24:MI') AS end_time,
       status, customer_name, customer_email, customer_phone,
       customer_phone_normalized, party_size, reservation_request_id::text,
       internal_notes, created_at, updated_at
     FROM gazebo_bookings
     WHERE ($1::date IS NULL OR booking_date >= $1)
       AND ($2::date IS NULL OR booking_date <= $2)
       AND (
         $3::text = 'all'
         OR ($3 = 'active' AND status IN ('tentative', 'confirmed'))
         OR status = $3
       )
       AND (
         $4::text IS NULL
         OR customer_name ILIKE '%' || $4 || '%'
         OR customer_email ILIKE '%' || $4 || '%'
         OR ($5::text IS NOT NULL AND customer_phone_normalized LIKE '%' || $5 || '%')
         OR ($6::bigint IS NOT NULL AND id = $6)
         OR ($7::bigint IS NOT NULL AND reservation_request_id = $7)
       )
       AND ($8::text = 'all' OR time_slot = $8)
       AND ($9::text = 'all' OR gazebo_code = $9)
     ORDER BY booking_date, start_time_snapshot, id`,
    [from, to, status, search, phoneDigits, bookingId, requestId, slot, gazebo],
  );
}

export async function getGazeboBooking(id, { sql = getDatabase() } = {}) {
  return getBookingById('gazebo_bookings', id, sql, `
    id::text, booking_date::text, gazebo_code, time_slot,
    to_char(start_time_snapshot, 'HH24:MI') AS start_time,
    to_char(end_time_snapshot, 'HH24:MI') AS end_time,
    status, customer_name, customer_email, customer_phone,
    customer_phone_normalized, party_size, reservation_request_id::text,
    internal_notes, created_at, updated_at
  `);
}

export async function getCampfireBookings(filters = {}, { sql = getDatabase() } = {}) {
  const {
    from = null, to = null, status = 'active', search = null,
    phoneDigits = null, bookingId = null,
  } = filters;
  return sql.query(
    `SELECT id::text, booking_date::text, status, customer_name, customer_email,
       customer_phone, customer_phone_normalized, party_size, internal_notes,
       created_at, updated_at
     FROM campfire_bookings
     WHERE ($1::date IS NULL OR booking_date >= $1)
       AND ($2::date IS NULL OR booking_date <= $2)
       AND (
         $3::text = 'all'
         OR ($3 = 'active' AND status IN ('tentative', 'confirmed'))
         OR status = $3
       )
       AND (
         $4::text IS NULL
         OR customer_name ILIKE '%' || $4 || '%'
         OR customer_email ILIKE '%' || $4 || '%'
         OR ($5::text IS NOT NULL AND customer_phone_normalized LIKE '%' || $5 || '%')
         OR ($6::bigint IS NOT NULL AND id = $6)
       )
     ORDER BY booking_date, id`,
    [from, to, status, search, phoneDigits, bookingId],
  );
}

export async function getCampfireBooking(id, { sql = getDatabase() } = {}) {
  return getBookingById('campfire_bookings', id, sql, `
    id::text, booking_date::text, status, customer_name, customer_email,
    customer_phone, customer_phone_normalized, party_size, internal_notes,
    created_at, updated_at
  `);
}

async function getBookingById(table, id, sql, columns) {
  const normalizedId = normalizeBookingId(id);
  const rows = await sql.query(`SELECT ${columns} FROM ${table} WHERE id = $1`, [normalizedId]);
  if (!rows.length) throw new BookingError('BOOKING_NOT_FOUND', 'Booking not found.', 404);
  return rows[0];
}

export async function getGazeboSeasons({ sql = getDatabase() } = {}) {
  return sql.query(
    `SELECT id::text, season_name, start_date::text, end_date::text,
       to_char(early_start_time, 'HH24:MI') AS early_start_time,
       to_char(early_end_time, 'HH24:MI') AS early_end_time,
       to_char(late_start_time, 'HH24:MI') AS late_start_time,
       to_char(late_end_time, 'HH24:MI') AS late_end_time,
       created_at, updated_at
     FROM gazebo_season_config
     ORDER BY start_date DESC`,
  );
}

export async function getGazeboSeason(id, { sql = getDatabase() } = {}) {
  const normalizedId = normalizeBookingId(id);
  const rows = await sql.query(
    `SELECT id::text, season_name, start_date::text, end_date::text,
       to_char(early_start_time, 'HH24:MI') AS early_start_time,
       to_char(early_end_time, 'HH24:MI') AS early_end_time,
       to_char(late_start_time, 'HH24:MI') AS late_start_time,
       to_char(late_end_time, 'HH24:MI') AS late_end_time,
       created_at, updated_at
     FROM gazebo_season_config
     WHERE id = $1`,
    [normalizedId],
  );
  if (!rows.length) throw new BookingError('SEASON_NOT_FOUND', 'Gazebo season not found.', 404);
  return rows[0];
}

export async function getReservationRequestForBooking(id, { sql = getDatabase() } = {}) {
  const normalizedId = typeof id === 'string' && /^\d+$/.test(id.trim()) ? Number(id.trim()) : id;
  if (!Number.isSafeInteger(normalizedId) || normalizedId < 1) {
    throw new BookingError('INVALID_REQUEST_ID', 'Choose a valid reservation request.');
  }
  const rows = await sql.query(
    `SELECT r.id::text, r.email, r.name, r.phone, r.phone_normalized,
       r.preferred_date::text, r.preferred_time_slot, r.fallback_dates,
       r.price_cents_snapshot, r.additional_comments, r.created_at,
       r.meta_json->'gazeboSlotConfig' AS gazebo_slot_config,
       COALESCE(
         json_agg(
           json_build_object(
             'id', b.id::text,
             'booking_date', b.booking_date::text,
             'gazebo_code', b.gazebo_code,
             'time_slot', b.time_slot,
             'status', b.status
           ) ORDER BY b.created_at
         ) FILTER (WHERE b.id IS NOT NULL),
         '[]'::json
       ) AS bookings
     FROM reservation_requests r
     LEFT JOIN gazebo_bookings b ON b.reservation_request_id = r.id
     WHERE r.id = $1
     GROUP BY r.id`,
    [normalizedId],
  );
  if (!rows.length) throw new BookingError('REQUEST_NOT_FOUND', 'Reservation request not found.', 404);
  return rows[0];
}

function validated(result) {
  if (result.error) throw new BookingError('INVALID_BOOKING', result.error);
  return result.value;
}

function activeBookingValue(result) {
  const value = validated(result);
  if (value.status === 'cancelled') {
    throw new BookingError(
      'INVALID_BOOKING_STATUS',
      'Use the cancellation action to cancel a booking.',
    );
  }
  return value;
}

function translateDatabaseError(error) {
  if (error instanceof BookingError) return error;
  if (error?.constraint === 'gazebo_bookings_active_slot_unique_idx') {
    return new BookingError(
      'SLOT_UNAVAILABLE',
      'The selected gazebo and time slot are already held by another booking.',
      409,
    );
  }
  if (error?.constraint === 'gazebo_bookings_active_request_unique_idx') {
    return new BookingError(
      'REQUEST_ALREADY_BOOKED',
      'This reservation request already has an active booking.',
      409,
    );
  }
  if (error?.constraint === 'gazebo_season_config_dates_do_not_overlap') {
    return new BookingError(
      'SEASON_OVERLAP',
      'Gazebo season date ranges cannot overlap.',
      409,
    );
  }
  return error;
}

async function diagnoseMissingGazeboSource(sql, { bookingDate, reservationRequestId }) {
  if (reservationRequestId !== undefined) {
    const requests = await sql.query(
      'SELECT id FROM reservation_requests WHERE id = $1',
      [reservationRequestId],
    );
    if (!requests.length) {
      throw new BookingError('REQUEST_NOT_FOUND', 'Reservation request not found.', 404);
    }
  }
  const seasons = await sql.query(
    `SELECT id FROM gazebo_season_config
     WHERE $1::date BETWEEN start_date AND end_date
     LIMIT 1`,
    [bookingDate],
  );
  if (!seasons.length) {
    throw new BookingError(
      'NO_SEASON_CONFIGURATION',
      'No gazebo slot configuration covers the selected date.',
      422,
    );
  }
  throw new Error('Gazebo booking could not be created.');
}

export async function createGazeboSeasonConfig(input, { sql = getDatabase() } = {}) {
  const value = validated(validateGazeboSeasonConfig(input));
  try {
    const rows = await sql.query(
      `INSERT INTO gazebo_season_config (
         season_name, start_date, end_date, early_start_time, early_end_time,
         late_start_time, late_end_time
       ) VALUES ($1, $2::date, $3::date, $4::time, $5::time, $6::time, $7::time)
       RETURNING id::text, season_name, start_date, end_date, early_start_time,
         early_end_time, late_start_time, late_end_time, created_at, updated_at`,
      [
        value.seasonName, value.startDate, value.endDate, value.earlyStartTime,
        value.earlyEndTime, value.lateStartTime, value.lateEndTime,
      ],
    );
    return rows[0];
  } catch (error) {
    throw translateDatabaseError(error);
  }
}

export async function updateGazeboSeasonConfig(id, input, { sql = getDatabase() } = {}) {
  const normalizedId = normalizeBookingId(id);
  const value = validated(validateGazeboSeasonConfig(input));
  try {
    const rows = await sql.query(
      `UPDATE gazebo_season_config c
       SET season_name = $2,
         start_date = $3::date,
         end_date = $4::date,
         early_start_time = $5::time,
         early_end_time = $6::time,
         late_start_time = $7::time,
         late_end_time = $8::time,
         updated_at = CURRENT_TIMESTAMP
       WHERE c.id = $1
         AND NOT EXISTS (
           SELECT 1
           FROM gazebo_bookings b
           WHERE b.booking_date BETWEEN c.start_date AND c.end_date
             AND b.booking_date NOT BETWEEN $3::date AND $4::date
         )
       RETURNING c.id::text, c.season_name, c.start_date::text, c.end_date::text,
         to_char(c.early_start_time, 'HH24:MI') AS early_start_time,
         to_char(c.early_end_time, 'HH24:MI') AS early_end_time,
         to_char(c.late_start_time, 'HH24:MI') AS late_start_time,
         to_char(c.late_end_time, 'HH24:MI') AS late_end_time,
         c.created_at, c.updated_at`,
      [
        normalizedId, value.seasonName, value.startDate, value.endDate,
        value.earlyStartTime, value.earlyEndTime, value.lateStartTime,
        value.lateEndTime,
      ],
    );
    if (!rows.length) {
      const existing = await sql.query(
        'SELECT id FROM gazebo_season_config WHERE id = $1',
        [normalizedId],
      );
      if (!existing.length) {
        throw new BookingError('SEASON_NOT_FOUND', 'Gazebo season not found.', 404);
      }
      throw new BookingError(
        'SEASON_DATES_CONTAIN_BOOKINGS',
        'The season dates cannot exclude bookings already associated with this season.',
        409,
      );
    }
    return rows[0];
  } catch (error) {
    throw translateDatabaseError(error);
  }
}

export async function createGazeboBooking(input, { sql = getDatabase() } = {}) {
  const value = activeBookingValue(validateGazeboBooking(input));
  try {
    const rows = await sql.query(
      `INSERT INTO gazebo_bookings (
         booking_date, gazebo_code, time_slot, start_time_snapshot, end_time_snapshot, status,
         customer_name, customer_email, customer_phone, customer_phone_normalized,
         party_size, internal_notes
       )
       SELECT $1::date, $2, $3,
         CASE $3 WHEN 'early' THEN early_start_time ELSE late_start_time END,
         CASE $3 WHEN 'early' THEN early_end_time ELSE late_end_time END,
         $4, $5, $6, $7, $8, $9, $10
       FROM gazebo_season_config
       WHERE $1::date BETWEEN start_date AND end_date
       RETURNING id::text, booking_date, gazebo_code, time_slot, start_time_snapshot,
         end_time_snapshot, status, customer_name, customer_email, customer_phone,
         customer_phone_normalized, party_size, reservation_request_id,
         internal_notes, created_at, updated_at`,
      [
        value.bookingDate, value.gazeboCode, value.timeSlot, value.status, value.customerName,
        value.customerEmail, value.customerPhone, value.customerPhoneNormalized,
        value.partySize, value.internalNotes,
      ],
    );
    if (!rows.length) await diagnoseMissingGazeboSource(sql, value);
    return rows[0];
  } catch (error) {
    throw translateDatabaseError(error);
  }
}

export async function convertReservationRequest(input, { sql = getDatabase() } = {}) {
  const value = activeBookingValue(validateGazeboConversion(input));
  try {
    const rows = await sql.query(
      `WITH created_booking AS (
       INSERT INTO gazebo_bookings (
         booking_date, gazebo_code, time_slot, start_time_snapshot, end_time_snapshot, status,
         customer_name, customer_email, customer_phone, customer_phone_normalized,
         party_size, reservation_request_id, internal_notes
       )
       SELECT $2::date, $3, $4,
         CASE $4 WHEN 'early' THEN c.early_start_time ELSE c.late_start_time END,
         CASE $4 WHEN 'early' THEN c.early_end_time ELSE c.late_end_time END,
         $5, r.name, r.email, r.phone, r.phone_normalized, $6, r.id, $7
       FROM reservation_requests r
       JOIN gazebo_season_config c
         ON $2::date BETWEEN c.start_date AND c.end_date
       WHERE r.id = $1
       RETURNING id::text, booking_date, gazebo_code, time_slot, start_time_snapshot,
         end_time_snapshot, status, customer_name, customer_email, customer_phone,
         customer_phone_normalized, party_size, reservation_request_id::text,
         internal_notes, created_at, updated_at
       ), resolved_request AS (
         UPDATE reservation_requests r
         SET review_status = 'resolved', reviewed_at = CURRENT_TIMESTAMP
         WHERE r.id = $1 AND EXISTS (SELECT 1 FROM created_booking)
         RETURNING r.id
       )
       SELECT created_booking.*
       FROM created_booking
       JOIN resolved_request ON true`,
      [
        value.reservationRequestId, value.bookingDate, value.gazeboCode, value.timeSlot, value.status,
        value.partySize, value.internalNotes,
      ],
    );
    if (!rows.length) await diagnoseMissingGazeboSource(sql, value);
    return rows[0];
  } catch (error) {
    throw translateDatabaseError(error);
  }
}

export async function createCampfireBooking(input, { sql = getDatabase() } = {}) {
  const value = activeBookingValue(validateCampfireBooking(input));
  const rows = await sql.query(
    `INSERT INTO campfire_bookings (
       booking_date, status, customer_name, customer_email, customer_phone,
       customer_phone_normalized, party_size, internal_notes
     ) VALUES ($1::date, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id::text, booking_date, status, customer_name, customer_email,
       customer_phone, customer_phone_normalized, party_size, internal_notes,
       created_at, updated_at`,
    [
      value.bookingDate, value.status, value.customerName, value.customerEmail,
      value.customerPhone, value.customerPhoneNormalized, value.partySize,
      value.internalNotes,
    ],
  );
  return rows[0];
}

export async function updateGazeboBooking(id, input, { sql = getDatabase() } = {}) {
  const normalizedId = normalizeBookingId(id);
  const value = activeBookingValue(validateGazeboBooking(input));
  try {
    const rows = await sql.query(
      `UPDATE gazebo_bookings b
       SET booking_date = $2::date,
         gazebo_code = $3,
         time_slot = $4,
         start_time_snapshot = CASE $4 WHEN 'early' THEN c.early_start_time ELSE c.late_start_time END,
         end_time_snapshot = CASE $4 WHEN 'early' THEN c.early_end_time ELSE c.late_end_time END,
         status = $5,
         customer_name = $6,
         customer_email = $7,
         customer_phone = $8,
         customer_phone_normalized = $9,
         party_size = $10,
         internal_notes = $11,
         updated_at = CURRENT_TIMESTAMP
       FROM gazebo_season_config c
       WHERE b.id = $1
         AND b.status <> 'cancelled'
         AND $2::date BETWEEN c.start_date AND c.end_date
       RETURNING b.id::text, b.booking_date::text, b.gazebo_code, b.time_slot,
         to_char(b.start_time_snapshot, 'HH24:MI') AS start_time,
         to_char(b.end_time_snapshot, 'HH24:MI') AS end_time,
         b.status, b.customer_name, b.customer_email, b.customer_phone,
         b.customer_phone_normalized, b.party_size, b.reservation_request_id::text,
         b.internal_notes, b.created_at, b.updated_at`,
      [
        normalizedId, value.bookingDate, value.gazeboCode, value.timeSlot, value.status,
        value.customerName, value.customerEmail, value.customerPhone,
        value.customerPhoneNormalized, value.partySize, value.internalNotes,
      ],
    );
    if (!rows.length) await diagnoseFailedUpdate('gazebo_bookings', normalizedId, sql, value.bookingDate);
    return rows[0];
  } catch (error) {
    throw translateDatabaseError(error);
  }
}

export async function updateCampfireBooking(id, input, { sql = getDatabase() } = {}) {
  const normalizedId = normalizeBookingId(id);
  const value = activeBookingValue(validateCampfireBooking(input));
  const rows = await sql.query(
    `UPDATE campfire_bookings
     SET booking_date = $2::date, status = $3, customer_name = $4,
       customer_email = $5, customer_phone = $6,
       customer_phone_normalized = $7, party_size = $8, internal_notes = $9,
       updated_at = CURRENT_TIMESTAMP
     WHERE id = $1 AND status <> 'cancelled'
     RETURNING id::text, booking_date::text, status, customer_name, customer_email,
       customer_phone, customer_phone_normalized, party_size, internal_notes,
       created_at, updated_at`,
    [
      normalizedId, value.bookingDate, value.status, value.customerName,
      value.customerEmail, value.customerPhone, value.customerPhoneNormalized,
      value.partySize, value.internalNotes,
    ],
  );
  if (!rows.length) await diagnoseFailedUpdate('campfire_bookings', normalizedId, sql);
  return rows[0];
}

async function diagnoseFailedUpdate(table, id, sql, bookingDate) {
  const existing = await sql.query(`SELECT status FROM ${table} WHERE id = $1`, [id]);
  if (!existing.length) throw new BookingError('BOOKING_NOT_FOUND', 'Booking not found.', 404);
  if (existing[0].status === 'cancelled') {
    throw new BookingError(
      'CANCELLED_BOOKING_IMMUTABLE',
      'Cancelled bookings are historical records and cannot be edited.',
      409,
    );
  }
  if (bookingDate) {
    throw new BookingError(
      'NO_SEASON_CONFIGURATION',
      'No gazebo slot configuration covers the selected date.',
      422,
    );
  }
  throw new Error('Booking could not be updated.');
}

export async function cancelGazeboBooking(id, { sql = getDatabase() } = {}) {
  return cancelBooking('gazebo_bookings', id, sql);
}

export async function cancelCampfireBooking(id, { sql = getDatabase() } = {}) {
  return cancelBooking('campfire_bookings', id, sql);
}

async function cancelBooking(table, id, sql) {
  const normalizedId = normalizeBookingId(id);
  // `table` is selected only by the two private wrappers above, never by user input.
  const rows = await sql.query(
    `UPDATE ${table}
     SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
     WHERE id = $1 AND status <> 'cancelled'
     RETURNING id::text, status, updated_at`,
    [normalizedId],
  );
  if (!rows.length) {
    const existing = await sql.query(`SELECT status FROM ${table} WHERE id = $1`, [normalizedId]);
    if (!existing.length) throw new BookingError('BOOKING_NOT_FOUND', 'Booking not found.', 404);
    throw new BookingError('BOOKING_ALREADY_CANCELLED', 'Booking is already cancelled.', 409);
  }
  return rows[0];
}

function normalizeBookingId(id) {
  const normalizedId = typeof id === 'string' && /^\d+$/.test(id.trim()) ? Number(id.trim()) : id;
  if (!Number.isSafeInteger(normalizedId) || normalizedId < 1) {
    throw new BookingError('INVALID_BOOKING_ID', 'Choose a valid booking.');
  }
  return normalizedId;
}
