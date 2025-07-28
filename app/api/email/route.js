import { NextResponse } from 'next/server';
import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(req) {
    //return NextResponse.json({ error: "Not Implemented Yet" }, { status: 501 });

    if (process.env.SENDGRID_API_KEY === undefined) {
        return NextResponse.json({ error: "Missing SendGrid API key" }, { status: 500 });
    }

    const body = await req.json();
    const { to, subject, text, html } = body;

    if (!to || !subject || !text || !html) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
        await sendgrid.send({
            to,
            from: { email: "no-reply@oldmcdonaldspumpkinpatchwv.com", name: "Old McDonald's Pumpkin Patch" },
            subject,
            text,
            html,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("SendGrid error:", error);
        return NextResponse.json({ error: "Failed to send email: "+error }, { status: 500 });
    }
}
