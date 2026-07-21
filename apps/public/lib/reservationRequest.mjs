const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_SLOTS = new Set(['early', 'late', 'either']);
const VALID_WEEKDAYS = new Set([0, 5, 6]); // Sunday, Friday, Saturday

function singleLine(value) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
}

function optionalText(value, maxLength, label) {
  if (value === undefined || value === null || value === '') return { value: null };
  if (typeof value !== 'string') return { error: `${label} must be text.` };
  const normalized = value.trim();
  if (normalized.length > maxLength) return { error: `${label} is too long.` };
  return { value: normalized || null };
}

export function getEasternDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function validateReservationRequest(body, { today = getEasternDate() } = {}) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { error: 'A JSON object is required.' };

  const email = singleLine(body.email).toLowerCase();
  const name = singleLine(body.name);
  const phone = singleLine(body.phone);
  const preferredDate = typeof body.preferredDate === 'string' ? body.preferredDate.trim() : '';
  const preferredTimeSlot = typeof body.preferredTimeSlot === 'string' ? body.preferredTimeSlot : '';

  if (!EMAIL_REGEX.test(email) || email.length > 254) return { error: 'Enter a valid email address.' };
  if (!name || name.length > 120) return { error: 'Enter a name of 120 characters or fewer.' };
  if (!phone || phone.length > 40 || !/^[+()\d.\s-]+$/.test(phone)) return { error: 'Enter a valid phone number.' };
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) return { error: 'Enter a phone number with 10 to 15 digits.' };
  const phoneNormalized = phone.startsWith('+') ? `+${digits}` : digits;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) return { error: 'Choose a preferred date.' };
  const date = new Date(`${preferredDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== preferredDate) return { error: 'Choose a valid preferred date.' };
  if (preferredDate <= today) return { error: 'Preferred date must be in the future.' };
  if (!VALID_WEEKDAYS.has(date.getUTCDay())) return { error: 'Preferred date must be a Friday, Saturday, or Sunday.' };
  if (!VALID_SLOTS.has(preferredTimeSlot)) return { error: 'Choose a valid preferred time slot.' };

  if (body.priceAcknowledged !== true || body.weatherRefundAcknowledged !== true || body.earlyArrivalAcknowledged !== true) {
    return { error: 'All rental policies must be acknowledged.' };
  }

  const fallback = optionalText(body.fallbackDates, 1000, 'Fallback dates');
  if (fallback.error) return fallback;
  const comments = optionalText(body.additionalComments, 2000, 'Additional comments');
  if (comments.error) return comments;

  return { value: {
    email, name, phone, phoneNormalized, preferredDate, preferredTimeSlot,
    fallbackDates: fallback.value, additionalComments: comments.value,
  } };
}

export const RESERVATION_SLOT_LABELS = Object.freeze({
  early: '1:00 PM – 3:00 PM', late: '4:00 PM – 6:00 PM', either: 'Either works',
});
