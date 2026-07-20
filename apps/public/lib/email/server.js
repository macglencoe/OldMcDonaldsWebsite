import 'server-only';

import { Resend } from 'resend';

import { escapeHtml } from '@/lib/mazeEntry.mjs';

const FROM_ADDRESS = "Old McDonald's Pumpkin Patch <no-reply@oldmcdonaldspumpkinpatchwv.com>";

const RECIPIENTS = Object.freeze({
  contact: ['team@oldmcdonaldspumpkinpatch.com'],
  reservations: ['team@oldmcdonaldspumpkinpatch.com'],
  maze: [
    'oldmcdonaldsglencoefarm@gmail.com',
    'mcpaul1694@gmail.com',
  ],
});

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class EmailServiceError extends Error {
  constructor(message, { code = 'EMAIL_FAILED', status = 500 } = {}) {
    super(message);
    this.name = 'EmailServiceError';
    this.code = code;
    this.status = status;
  }
}

export function normalizeReplyTo(raw) {
  if (raw === undefined || raw === null) {
    return undefined;
  }

  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed) {
      throw new EmailServiceError('replyTo cannot be empty', {
        code: 'INVALID_REPLY_TO',
        status: 400,
      });
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      throw new EmailServiceError('Invalid replyTo email address', {
        code: 'INVALID_REPLY_TO',
        status: 400,
      });
    }
    return trimmed;
  }

  if (Array.isArray(raw)) {
    const normalized = raw
      .map((entry) => (typeof entry === 'string' ? entry.trim() : ''))
      .filter(Boolean);

    if (!normalized.length) {
      throw new EmailServiceError('replyTo list cannot be empty', {
        code: 'INVALID_REPLY_TO',
        status: 400,
      });
    }

    const invalid = normalized.find((email) => !EMAIL_REGEX.test(email));
    if (invalid) {
      throw new EmailServiceError(`Invalid replyTo email address: ${invalid}`, {
        code: 'INVALID_REPLY_TO',
        status: 400,
      });
    }

    return normalized;
  }

  throw new EmailServiceError('replyTo must be a string or array of strings', {
    code: 'INVALID_REPLY_TO',
    status: 400,
  });
}

function getResend() {
  if (!process.env.RESEND_API_KEY) {
    throw new EmailServiceError('RESEND_API_KEY is not configured.', {
      code: 'EMAIL_NOT_CONFIGURED',
      status: 500,
    });
  }

  return new Resend(process.env.RESEND_API_KEY);
}

async function deliver({ to, subject, text, html, replyTo }) {
  try {
    const payload = {
      from: FROM_ADDRESS,
      to,
      subject,
      text,
      html,
    };

    if (replyTo) {
      payload.replyTo = replyTo;
    }

    const { data, error } = await getResend().emails.send(payload);
    if (error) {
      throw error;
    }

    return { id: data?.id || null };
  } catch (error) {
    if (error instanceof EmailServiceError) {
      throw error;
    }

    const message = String(error?.message || error || 'Unknown email error');
    const isLimit = /(rate|quota|limit|daily)/i.test(message);
    throw new EmailServiceError(message, {
      code: isLimit ? 'LIMIT_EXCEEDED' : 'EMAIL_FAILED',
      status: isLimit ? 429 : 500,
    });
  }
}

export async function sendContactNotification({ text, html, replyTo }) {
  return deliver({
    to: RECIPIENTS.contact,
    subject: 'Contact Form Submission',
    text,
    html,
    replyTo: normalizeReplyTo(replyTo),
  });
}

export async function sendMazeEntryNotification({ name, phone, year }) {
  return deliver({
    to: RECIPIENTS.maze,
    subject: `Maze Game Entry — ${year}`,
    text: `Name: ${name}\nPhone Number: ${phone}\nYear: ${year}`,
    html: `<p>Name: ${escapeHtml(name)}</p><p>Phone Number: ${escapeHtml(phone)}</p><p>Year: ${year}</p>`,
  });
}

function reservationDetailsText(request) {
  const price = `$${(request.priceCents / 100).toFixed(2)}`;
  return [
    `Request ID: ${request.id}`,
    `Name: ${request.name}`,
    `Email: ${request.email}`,
    `Phone: ${request.phone}`,
    `Preferred date: ${request.preferredDate}`,
    `Preferred time: ${request.preferredTimeLabel}`,
    `Fallback dates: ${request.fallbackDates || 'None provided'}`,
    `Price acknowledged: ${price}`,
    `Additional comments: ${request.additionalComments || 'None provided'}`,
  ].join('\n');
}

export async function sendReservationStaffNotification(request) {
  const text = reservationDetailsText(request);
  return deliver({
    to: RECIPIENTS.reservations,
    subject: `Gazebo reservation request #${request.id} — ${request.preferredDate}`,
    text,
    html: `<h2>Gazebo reservation request #${request.id}</h2><p><strong>This is a request, not a confirmed booking.</strong></p><pre style="font-family: sans-serif; white-space: pre-wrap">${escapeHtml(text)}</pre>`,
    replyTo: request.email,
  });
}

export async function sendReservationCustomerReceipt(request) {
  const price = `$${(request.priceCents / 100).toFixed(2)}`;
  const text = [
    `Hi ${request.name},`,
    '',
    `We received your gazebo reservation request #${request.id}.`,
    `Preferred date: ${request.preferredDate}`,
    `Preferred time: ${request.preferredTimeLabel}`,
    `Rental price acknowledged: ${price}`, '',
    'This message is a receipt, not a booking confirmation. Staff will contact you about availability and payment details.',
  ].join('\n');
  return deliver({
    to: [request.email],
    subject: `We received your gazebo reservation request #${request.id}`,
    text,
    html: `<p>Hi ${escapeHtml(request.name)},</p><p>We received your gazebo reservation request <strong>#${request.id}</strong>.</p><ul><li>Preferred date: ${escapeHtml(request.preferredDate)}</li><li>Preferred time: ${escapeHtml(request.preferredTimeLabel)}</li><li>Rental price acknowledged: ${price}</li></ul><p><strong>This is a receipt, not a booking confirmation.</strong> Staff will contact you about availability and payment details.</p>`,
    replyTo: RECIPIENTS.reservations,
  });
}

// Temporary compatibility for the pre-database maze client. Remove this and
// its /api/email branch after use_db_forms has completed its rollout.
export async function sendLegacyMazeNotification({ text, html }) {
  return deliver({
    to: RECIPIENTS.maze,
    subject: 'Maze Game Entry',
    text,
    html,
  });
}
