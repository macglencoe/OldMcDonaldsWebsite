import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
    //return NextResponse.json({ error: "Not Implemented Yet" }, { status: 501 });

    if (!process.env.RESEND_API_KEY) {
        return NextResponse.json({ error: "Missing RESEND_API_KEY" }, { status: 500 });
    }

    const body = await req.json();
    const { to, subject, text, html } = body;

    if (!to || !subject || !text || !html) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
        const toList = Array.isArray(to) ? to : [to];

        const { data, error } = await resend.emails.send({
            from: "Old McDonald's Pumpkin Patch <no-reply@oldmcdonaldspumpkinpatchwv.com>",
            to: toList,
            subject,
            text,
            html,
        });

        if (error) {
            console.error('Resend error:', error);
            return NextResponse.json({ error: `Failed to send email: ${error.message || error}` }, { status: 500 });
        }

        return NextResponse.json({ success: true, id: data?.id || null });
    } catch (error) {
        console.error('Resend exception:', error);
        return NextResponse.json({ error: `Failed to send email: ${error?.message || error}` }, { status: 500 });
    }
}
