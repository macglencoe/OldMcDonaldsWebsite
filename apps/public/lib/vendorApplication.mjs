const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const ELECTRICITY_LABELS = Object.freeze({
  supplied: 'I need electricity supplied',
  own_or_none: "I'll use my own generator or don't need electricity",
  unknown: "I don't know yet",
});
export const CERTIFICATION_LABELS = Object.freeze({
  ready: 'I have a digital copy ready',
  later: 'I will provide my certification later',
});

function singleLine(value) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
}

function optionalText(value, max, label) {
  if (value === undefined || value === null || value === '') return { value: null };
  if (typeof value !== 'string') return { error: `${label} must be text.` };
  const normalized = value.trim();
  if (normalized.length > max) return { error: `${label} must be ${max} characters or fewer.` };
  return { value: normalized || null };
}

export function validateVendorApplication(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { error: 'A JSON object is required.' };
  const businessName = singleLine(body.businessName);
  const contactName = singleLine(body.contactName);
  const email = singleLine(body.email).toLowerCase();
  const phone = singleLine(body.phone);
  if (!businessName || businessName.length > 160) return { error: 'Enter a business name of 160 characters or fewer.' };
  if (!contactName || contactName.length > 120) return { error: 'Enter a contact name of 120 characters or fewer.' };
  if (!EMAIL_REGEX.test(email) || email.length > 254) return { error: 'Enter a valid email address.' };
  if (!phone || phone.length > 40 || !/^[+()\d.\s-]+$/.test(phone)) return { error: 'Enter a valid phone number.' };
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) return { error: 'Enter a phone number with 10 to 15 digits.' };
  const phoneNormalized = phone.startsWith('+') ? `+${digits}` : digits;

  let websiteUrl = null;
  if (body.websiteUrl) {
    if (typeof body.websiteUrl !== 'string' || body.websiteUrl.length > 500) return { error: 'Enter a website URL of 500 characters or fewer.' };
    try {
      const parsed = new URL(body.websiteUrl.trim());
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error();
      websiteUrl = parsed.toString();
    } catch { return { error: 'Enter a valid website or social media URL.' }; }
  }
  if (!Object.hasOwn(ELECTRICITY_LABELS, body.electricityRequirement)) return { error: 'Choose an electricity option.' };
  if (typeof body.isFoodVendor !== 'boolean') return { error: 'Tell us whether you serve food.' };
  let certificationStatus = null;
  let healthCertificationAcknowledged = null;
  if (body.isFoodVendor) {
    if (body.healthCertificationAcknowledged !== true) return { error: 'Food vendors must acknowledge the health-department requirement.' };
    if (!Object.hasOwn(CERTIFICATION_LABELS, body.certificationStatus)) return { error: 'Choose a certification status.' };
    healthCertificationAcknowledged = true;
    certificationStatus = body.certificationStatus;
  }
  const availability = optionalText(body.availabilityNotes, 2000, 'Availability notes');
  if (availability.error) return availability;
  return { value: {
    businessName, contactName, email, phone, phoneNormalized, websiteUrl,
    electricityRequirement: body.electricityRequirement, isFoodVendor: body.isFoodVendor,
    healthCertificationAcknowledged, certificationStatus, availabilityNotes: availability.value,
  } };
}
