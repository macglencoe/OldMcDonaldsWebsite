import { createHmac } from 'node:crypto';

const MAX_NAME_LENGTH = 120;
const MAX_PHONE_LENGTH = 40;
const MAX_USER_AGENT_LENGTH = 512;

function normalizeSingleLine(value) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
}

export function validateMazeEntry(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'A JSON object is required.' };
  }

  const name = normalizeSingleLine(body.name);
  const phone = normalizeSingleLine(body.phone);

  if (!name) {
    return { error: 'Name is required.' };
  }

  if (name.length > MAX_NAME_LENGTH) {
    return { error: `Name must be ${MAX_NAME_LENGTH} characters or fewer.` };
  }

  if (!phone) {
    return { error: 'Phone number is required.' };
  }

  if (phone.length < 3 || phone.length > MAX_PHONE_LENGTH) {
    return { error: `Phone number must be between 3 and ${MAX_PHONE_LENGTH} characters.` };
  }

  return { value: { name, phone } };
}

export function getClientIp(headers) {
  const forwarded =
    headers.get('x-vercel-forwarded-for') ||
    headers.get('x-forwarded-for') ||
    headers.get('x-real-ip') ||
    '';

  const firstAddress = forwarded.split(',')[0]?.trim();
  return firstAddress || 'unknown';
}

export function hashIp(ip, secret) {
  if (!secret || secret.length < 32) {
    throw new Error('IP_HASH_SECRET must be at least 32 characters long.');
  }

  return createHmac('sha256', secret).update(ip).digest('hex');
}

export function normalizeUserAgent(headers) {
  const userAgent = headers.get('user-agent')?.trim();
  return userAgent ? userAgent.slice(0, MAX_USER_AGENT_LENGTH) : null;
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
