import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Server-enforced recipients (do not trust client-provided lists)
const RECIPIENTS = {
  contact: [
    'mcpaul1694@gmail.com',
    'sgmcdonald2@gmail.com',
    'oldmcdonaldsglencoefarm@gmail.com',
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

export async function POST(req) {
    //return NextResponse.json({ error: "Not Implemented Yet" }, { status: 501 });

    if (!process.env.RESEND_API_KEY) {
        return NextResponse.json({ error: "Missing RESEND_API_KEY" }, { status: 500 });
    }

    const body = await req.json();
    const { kind, text, html } = body || {};

    if (!kind || !text || !html) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!['contact', 'maze'].includes(kind)) {
        return NextResponse.json({ error: "Invalid kind" }, { status: 400 });
    }

    try {
        const toList = RECIPIENTS[kind];
        const subject = SUBJECTS[kind];

        const { data, error } = await resend.emails.send({
            from: "Old McDonald's Pumpkin Patch <no-reply@oldmcdonaldspumpkinpatchwv.com>",
            to: toList,
            subject,
            text,
            html,
        });

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
