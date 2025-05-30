import { NextResponse } from 'next/server';
import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(req) {
    return NextResponse.json({ error: "Not Implemented Yet" }, { status: 501 });

    const body = await req.json();
    const { to, subject, text, html } = body;

    if (!to || !subject || !text || !html) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
        await sendgrid.send({
            to,
            from: process.env.SENDGRID_FROM_EMAIL,
            subject,
            text,
            html,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("SendGrid error:", error);
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }
}
