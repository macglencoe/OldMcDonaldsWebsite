import { getEasternDate } from './reservationRequest.mjs';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const singleLine = value => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';

function optionalText(value, maxLength, label) {
  if (value === undefined || value === null || value === '') return { value: null };
  if (typeof value !== 'string') return { error: `${label} must be text.` };
  const normalized = value.trim();
  if (normalized.length > maxLength) return { error: `${label} is too long.` };
  return { value: normalized || null };
}

export function validateCampfireReservationRequest(body, { today = getEasternDate() } = {}) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { error: 'A JSON object is required.' };
  const email = singleLine(body.email).toLowerCase();
  const name = singleLine(body.name);
  const phone = singleLine(body.phone);
  const preferredDate = typeof body.preferredDate === 'string' ? body.preferredDate.trim() : '';
  if (!EMAIL_REGEX.test(email) || email.length > 254) return { error: 'Enter a valid email address.' };
  if (!name || name.length > 120) return { error: 'Enter a name of 120 characters or fewer.' };
  if (!phone || phone.length > 40 || !/^[+()\d.\s-]+$/.test(phone)) return { error: 'Enter a valid phone number.' };
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) return { error: 'Enter a phone number with 10 to 15 digits.' };
  const phoneNormalized = phone.startsWith('+') ? `+${digits}` : digits;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) return { error: 'Choose a preferred date.' };
  const date = new Date(`${preferredDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== preferredDate || preferredDate <= today) {
    return { error: 'Preferred date must be a valid future date.' };
  }
  const partySize = body.partySize === '' || body.partySize == null ? null : Number(body.partySize);
  if (partySize !== null && (!Number.isSafeInteger(partySize) || partySize < 1 || partySize > 10000)) return { error: 'Party size must be between 1 and 10,000.' };
  if (body.priceAcknowledged !== true) return { error: 'The campfire rental price must be acknowledged.' };
  const fallback = optionalText(body.fallbackDates, 1000, 'Fallback dates');
  if (fallback.error) return fallback;
  const comments = optionalText(body.additionalComments, 2000, 'Additional comments');
  if (comments.error) return comments;
  return { value: { email, name, phone, phoneNormalized, preferredDate, partySize, fallbackDates: fallback.value, additionalComments: comments.value } };
}
