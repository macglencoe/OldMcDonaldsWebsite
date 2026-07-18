import { NextResponse } from 'next/server';

import {
  EmailServiceError,
  sendContactNotification,
  sendLegacyMazeNotification,
} from '@/lib/email/server';

export const runtime = 'nodejs';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const { kind, text, html, replyTo } = body || {};

  if (!kind || !text || !html) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  if (!['contact', 'maze'].includes(kind)) {
    return NextResponse.json({ error: 'Invalid kind' }, { status: 400 });
  }

  try {
    // Maze is a temporary compatibility path for the current client. New maze
    // submissions use /api/forms/maze-entry and never pass email HTML directly.
    const result = kind === 'contact'
      ? await sendContactNotification({ text, html, replyTo })
      : await sendLegacyMazeNotification({ text, html });

    return NextResponse.json({ success: true, id: result.id });
  } catch (error) {
    const serviceError = error instanceof EmailServiceError
      ? error
      : new EmailServiceError('Unknown email error');

    console.error('Email delivery failed:', serviceError.message);
    return NextResponse.json(
      { error: `Failed to send email: ${serviceError.message}`, code: serviceError.code },
      { status: serviceError.status },
    );
  }
}
