import { getDatabase } from '@oldmc/db';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

import {
  escapeHtml,
  getClientIp,
  hashIp,
  normalizeUserAgent,
  validateMazeEntry,
} from '@/lib/mazeEntry.mjs';

export const runtime = 'nodejs';

const MAX_REQUEST_BYTES = 10_000;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_HOURS = 1;
const MAZE_RECIPIENTS = [
  'oldmcdonaldsglencoefarm@gmail.com',
  'mcpaul1694@gmail.com',
];

async function notifyStaff({ name, phone, year }) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured.');
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: "Old McDonald's Pumpkin Patch <no-reply@oldmcdonaldspumpkinpatchwv.com>",
    to: MAZE_RECIPIENTS,
    subject: `Maze Game Entry — ${year}`,
    text: `Name: ${name}\nPhone Number: ${phone}\nYear: ${year}`,
    html: `<p>Name: ${escapeHtml(name)}</p><p>Phone Number: ${escapeHtml(phone)}</p><p>Year: ${year}</p>`,
  });

  if (error) {
    throw new Error(String(error.message || error));
  }
}

export async function POST(request) {
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ error: 'Request is too large.' }, { status: 413 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const { value, error } = validateMazeEntry(body);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const ipHashSecret = process.env.IP_HASH_SECRET;
  if (!ipHashSecret) {
    console.error('Maze entry configuration error: IP_HASH_SECRET is missing.');
    return NextResponse.json({ error: 'Submission service is unavailable.' }, { status: 503 });
  }

  let ipHash;
  try {
    ipHash = hashIp(getClientIp(request.headers), ipHashSecret);
  } catch (configurationError) {
    console.error('Maze entry configuration error:', configurationError.message);
    return NextResponse.json({ error: 'Submission service is unavailable.' }, { status: 503 });
  }

  const year = new Date().getUTCFullYear();
  const userAgent = normalizeUserAgent(request.headers);

  try {
    const sql = getDatabase();
    const rows = await sql.query(
      `
        WITH rate_limit_lock AS MATERIALIZED (
          SELECT pg_advisory_xact_lock(hashtextextended($1, 0))
        ), recent_entries AS MATERIALIZED (
          SELECT count(*)::int AS entry_count
          FROM maze_entries, rate_limit_lock
          WHERE ip_hash = $1
            AND created_at >= CURRENT_TIMESTAMP - ($2 * INTERVAL '1 hour')
        )
        INSERT INTO maze_entries (name, phone, year, ip_hash, user_agent, meta_json)
        SELECT $3, $4, $5, $1, $6, $7::jsonb
        FROM recent_entries
        WHERE entry_count < $8
        RETURNING id, created_at
      `,
      [
        ipHash,
        RATE_LIMIT_WINDOW_HOURS,
        value.name,
        value.phone,
        year,
        userAgent,
        JSON.stringify({ source: 'maze-game' }),
        RATE_LIMIT_MAX,
      ],
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.', code: 'RATE_LIMITED' },
        { status: 429, headers: { 'Retry-After': String(RATE_LIMIT_WINDOW_HOURS * 60 * 60) } },
      );
    }

    let notificationSent = true;
    try {
      await notifyStaff({ ...value, year });
    } catch (notificationError) {
      notificationSent = false;
      console.error('Maze entry was saved, but its notification failed:', notificationError.message);
    }

    return NextResponse.json(
      {
        success: true,
        entryId: rows[0].id,
        submittedAt: rows[0].created_at,
        notificationSent,
      },
      { status: 201 },
    );
  } catch (databaseError) {
    console.error('Maze entry database operation failed:', databaseError.message);
    return NextResponse.json(
      { error: 'The entry could not be saved. Please try again.', code: 'DATABASE_ERROR' },
      { status: 503 },
    );
  }
}
