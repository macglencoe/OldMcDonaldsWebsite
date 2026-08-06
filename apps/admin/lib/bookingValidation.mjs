const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const BOOKING_STATUSES = Object.freeze({
  tentative: 'Tentative',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
});

export const GAZEBO_SLOTS = Object.freeze({
  early: 'Early',
  late: 'Late',
});

export const GAZEBOS = Object.freeze({
  A: 'Gazebo A',
  B: 'Gazebo B',
});

function singleLine(value) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
}

function optionalText(value, maxLength, label) {
  if (value === undefined || value === null || value === '') return { value: null };
  if (typeof value !== 'string') return { error: `${label} must be text.` };
  const normalized = value.trim();
  if (normalized.length > maxLength) return { error: `${label} must be ${maxLength} characters or fewer.` };
  return { value: normalized || null };
}

export function normalizeDate(value, label = 'Booking date') {
  const normalized = typeof value === 'string' ? value.trim() : '';
  if (!DATE_REGEX.test(normalized)) return { error: `${label} must use YYYY-MM-DD format.` };
  const parsed = new Date(`${normalized}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== normalized) {
    return { error: `${label} must be a valid date.` };
  }
  return { value: normalized };
}

function normalizeTime(value, label) {
  const normalized = typeof value === 'string' ? value.trim() : '';
  if (!TIME_REGEX.test(normalized)) return { error: `${label} must use HH:MM format.` };
  return { value: normalized };
}

function normalizeStatus(value) {
  if (!Object.hasOwn(BOOKING_STATUSES, value)) return { error: 'Choose a valid booking status.' };
  return { value };
}

function normalizePartySize(value) {
  if (value === undefined || value === null || value === '') return { value: null };
  const normalized = typeof value === 'string' && /^\d+$/.test(value.trim())
    ? Number(value.trim())
    : value;
  if (!Number.isSafeInteger(normalized) || normalized < 1 || normalized > 10000) {
    return { error: 'Party size must be a whole number between 1 and 10000.' };
  }
  return { value: normalized };
}

function normalizeCustomer(body) {
  const customerName = singleLine(body.customerName);
  const customerEmail = singleLine(body.customerEmail).toLowerCase();
  const customerPhone = singleLine(body.customerPhone);

  if (!customerName || customerName.length > 120) {
    return { error: 'Enter a customer name of 120 characters or fewer.' };
  }
  if (!EMAIL_REGEX.test(customerEmail) || customerEmail.length > 254) {
    return { error: 'Enter a valid customer email address.' };
  }
  if (!customerPhone || customerPhone.length > 40 || !/^[+()\d.\s-]+$/.test(customerPhone)) {
    return { error: 'Enter a valid customer phone number.' };
  }
  const digits = customerPhone.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) {
    return { error: 'Enter a customer phone number with 10 to 15 digits.' };
  }
  const customerPhoneNormalized = customerPhone.startsWith('+') ? `+${digits}` : digits;
  return { value: { customerName, customerEmail, customerPhone, customerPhoneNormalized } };
}

function normalizeSharedBookingFields(body, { includeCustomer }) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'A JSON object is required.' };
  }

  const bookingDate = normalizeDate(body.bookingDate);
  if (bookingDate.error) return bookingDate;
  const status = normalizeStatus(body.status);
  if (status.error) return status;
  const partySize = normalizePartySize(body.partySize);
  if (partySize.error) return partySize;
  const internalNotes = optionalText(body.internalNotes, 2000, 'Internal notes');
  if (internalNotes.error) return internalNotes;
  const customer = includeCustomer ? normalizeCustomer(body) : { value: {} };
  if (customer.error) return customer;

  return {
    value: {
      bookingDate: bookingDate.value,
      status: status.value,
      partySize: partySize.value,
      internalNotes: internalNotes.value,
      ...customer.value,
    },
  };
}

export function validateGazeboBooking(body) {
  const shared = normalizeSharedBookingFields(body, { includeCustomer: true });
  if (shared.error) return shared;
  if (!Object.hasOwn(GAZEBOS, body.gazeboCode)) return { error: 'Choose Gazebo A or Gazebo B.' };
  if (!Object.hasOwn(GAZEBO_SLOTS, body.timeSlot)) return { error: 'Choose an early or late gazebo slot.' };
  return { value: { ...shared.value, gazeboCode: body.gazeboCode, timeSlot: body.timeSlot } };
}

export function validateGazeboConversion(body) {
  const shared = normalizeSharedBookingFields(body, { includeCustomer: false });
  if (shared.error) return shared;
  if (!Object.hasOwn(GAZEBOS, body.gazeboCode)) return { error: 'Choose Gazebo A or Gazebo B.' };
  if (!Object.hasOwn(GAZEBO_SLOTS, body.timeSlot)) return { error: 'Choose an early or late gazebo slot.' };

  const rawRequestId = typeof body.reservationRequestId === 'string'
    ? body.reservationRequestId.trim()
    : body.reservationRequestId;
  const reservationRequestId = typeof rawRequestId === 'string' && /^\d+$/.test(rawRequestId)
    ? Number(rawRequestId)
    : rawRequestId;
  if (!Number.isSafeInteger(reservationRequestId) || reservationRequestId < 1) {
    return { error: 'Choose a valid reservation request.' };
  }

  return {
    value: {
      ...shared.value,
      gazeboCode: body.gazeboCode,
      timeSlot: body.timeSlot,
      reservationRequestId,
    },
  };
}

export function validateCampfireBooking(body) {
  return normalizeSharedBookingFields(body, { includeCustomer: true });
}

export function validateGazeboSeasonConfig(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'A JSON object is required.' };
  }
  const seasonName = singleLine(body.seasonName);
  if (!seasonName || seasonName.length > 120) {
    return { error: 'Enter a season name of 120 characters or fewer.' };
  }
  const startDate = normalizeDate(body.startDate, 'Season start date');
  if (startDate.error) return startDate;
  const endDate = normalizeDate(body.endDate, 'Season end date');
  if (endDate.error) return endDate;
  if (startDate.value > endDate.value) return { error: 'Season end date cannot be before its start date.' };

  const fields = [
    ['earlyStartTime', 'Early start time'],
    ['earlyEndTime', 'Early end time'],
    ['lateStartTime', 'Late start time'],
    ['lateEndTime', 'Late end time'],
  ];
  const times = {};
  for (const [key, label] of fields) {
    const result = normalizeTime(body[key], label);
    if (result.error) return result;
    times[key] = result.value;
  }
  if (times.earlyStartTime >= times.earlyEndTime) return { error: 'Early slot must end after it starts.' };
  if (times.lateStartTime >= times.lateEndTime) return { error: 'Late slot must end after it starts.' };
  if (times.earlyEndTime > times.lateStartTime) return { error: 'Gazebo slots cannot overlap.' };

  return { value: { seasonName, startDate: startDate.value, endDate: endDate.value, ...times } };
}
