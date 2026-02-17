import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Server-enforced recipients (do not trust client-provided lists)
const RECIPIENTS = {
  contact: [
    'team@oldmcdonaldspumpkinpatch.com',
  ],
  maze: [
    'oldmcdonaldsglencoefarm@gmail.com',
    'mcpaul1694@gmail.com',
  ],
};

const SUBJECTS = {
  contact: 'Contact Form Submission',
  maze: 'Maze Game Entry',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeReplyTo = (raw) => {
  if (raw === undefined || raw === null) {
    return { value: undefined };
  }

  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed) {
      return { error: 'replyTo cannot be empty' };
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      return { error: 'Invalid replyTo email address' };
    }
    return { value: trimmed };
  }

  if (Array.isArray(raw)) {
    const normalized = raw
      .map((entry) => (typeof entry === 'string' ? entry.trim() : ''))
      .filter(Boolean);

    if (!normalized.length) {
      return { error: 'replyTo list cannot be empty' };
    }

    const invalid = normalized.find((email) => !EMAIL_REGEX.test(email));
    if (invalid) {
      return { error: `Invalid replyTo email address: ${invalid}` };
    }

    return { value: normalized };
  }

  return { error: 'replyTo must be a string or array of strings' };
};

export async function POST(req) {
    //return NextResponse.json({ error: "Not Implemented Yet" }, { status: 501 });

    if (!process.env.RESEND_API_KEY) {
        return NextResponse.json({ error: "Missing RESEND_API_KEY" }, { status: 500 });
    }

    const body = await req.json();
    const { kind, text, html, replyTo } = body || {};

    if (!kind || !text || !html) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!['contact', 'maze'].includes(kind)) {
        return NextResponse.json({ error: "Invalid kind" }, { status: 400 });
    }

    try {
        const toList = RECIPIENTS[kind];
        const subject = SUBJECTS[kind];

        const { value: normalizedReplyTo, error: replyToError } = normalizeReplyTo(replyTo);
        if (replyToError) {
            return NextResponse.json({ error: replyToError }, { status: 400 });
        }

        const emailPayload = {
            from: "Old McDonald's Pumpkin Patch <no-reply@oldmcdonaldspumpkinpatchwv.com>",
            to: toList,
            subject,
            text,
            html,
        };

        if (normalizedReplyTo) {
            emailPayload.replyTo = normalizedReplyTo;
        }

        const { data, error } = await resend.emails.send(emailPayload);

        if (error) {
            const msg = String(error.message || error || 'Unknown error');
            const isLimit = /(rate|quota|limit|daily)/i.test(msg);
            console.error('Resend error:', msg);
            return NextResponse.json(
              { error: `Failed to send email: ${msg}`, code: isLimit ? 'LIMIT_EXCEEDED' : 'EMAIL_FAILED' },
              { status: isLimit ? 429 : 500 }
            );
        }

        return NextResponse.json({ success: true, id: data?.id || null });
    } catch (error) {
        const msg = String(error?.message || error || 'Unknown error');
        const isLimit = /(rate|quota|limit|daily)/i.test(msg);
        console.error('Resend exception:', msg);
        return NextResponse.json(
          { error: `Failed to send email: ${msg}`, code: isLimit ? 'LIMIT_EXCEEDED' : 'EMAIL_FAILED' },
          { status: isLimit ? 429 : 500 }
        );
    }
}
