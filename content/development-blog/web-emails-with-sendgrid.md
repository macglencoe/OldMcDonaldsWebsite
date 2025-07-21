# Web emails with Sendgrid

Although Old McDonald's site is intended to be *mostly* an informational website, there are two big requirements that depend on user submission: **Contact Forms** and **Raffle Entries**

While we could use a full Customer Relationship Management (CRM) system, this would be unnecessarily complex and costly for our needs. Instead, the simplest and most cost-effective solution to facilitate user communication is good old **email**.

[*Sendgrid*](https://sendgrid.com/en-us) is a well-known cloud-based email delivery platform that will allow us to send emails from our website without the need for our own email server.

## Why Sendgrid?

| Feature | Why this matters | Cost |
|---------|------------------|------|
| 100 emails per day | It's unlikely that we'll get over 100 submissions each day between the contact form and maze game raffle entries. | $0 |
| Delivery Optimization | This ensures that our emails don't end up in the spam folder | $0 |
| Reliable API | We won't have to worry about outages | $0 |

| Total cost |
|-------|
| **Free** |

## Sender Identity

In order to use Sendgrid, we first have to create a *Sender Identity*. Put simply, this is the email address that our emails will appear to be sent from. 

We have the option of using **Domain Verification** which allows us to use our domain as the email address without actually setting up an email hosting provider. For example, we can make our emails look like this:

<table>
	<thead>
    	<tr>
        	<th colspan=2>Contact Form Submission</th>
        </tr>
    </thead>
    <tbody>
    	<tr>
        	<td>From:</td>
            <td>Old McDonald's Pumpkin Patch (no-reply@oldmcdonaldspumpkinpatchwv.com)</td>
        </tr>
        <tr>
        	<td>To:</td>
            <td>Me (me@example.com)</td>
        </tr>
        <tr>
        	<td colspan=2>
            	Name: John Doe<br/>
                <br/>
                Email: johndoe@example.com<br/>
                <br/>
                Hi, I'm submitting this contact form to let you know that bla bla bla bla
            </td>
        </tr>
    </tbody>
</table>

## Implementation

First, we'll create an API route in our [**Next.js**](https://nextjs.org) site at `/api/email`

Sendgrid offers a very handy `npm` package which we will be using instead of directly sending requests to their API. So first, we'll import `sendgrid`, and give it our API key from the environment:

```js
import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
```

Since this Next.js site uses the [App Router](https://nextjs.org/docs/app), we can define handlers as exports using HTTP method functions, like so:

```js
/**
 * POST handler: Send an email.
 */
export async function POST(req) {
  // ... //
}
```

Then, inside this handler, we will extract the `body` from the API request, and ensure that it contains all of the necessary fields:

```js
const body = await req.json();
const { to, subject, text, html } = body

if (!to || !subject || !text || !html)  {
    return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
    );
}
```

After we've made sure we have everything we need for the email, we'll kick off `sendgrid.send()` in a `try` block.

This is where we can set the custom sender identity for this email as described in the previous section

```js
try {
    await sendgrid.send({
        to,
        from: { 
            email: "no-reply@oldmcdonaldspumpkinpatchwv.com",
            name: "Old McDonald's Pumpkin Patch"
        },
        subject,
        text,
        html,
    });
 
    return NextResponse.json({ success: true });
} // ... //
```

Finally, we'll add a `catch` block to properly log and pass errors to the response

```js
try {
    // ... //
} catch (error) {
    console.error("Sendgrid error:", error);
    return NextResponse.json(
        { error: "Failed to send email: " + error },
        { status: 500 }
    );
}
```

### Usage

Now, the endpoint `POST` `/api/email` can be used to send emails, like so:

```js
// /components/contactForm.js

const response = await fetch ('/api/email', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        to: ['oldmcdonaldsglencoefarm@gmail.com', /* other emails ... */ ],
        subject: 'Contact Form Submission',
        text: `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`,
        html: `<p>Name: ${formData.name}</p><p>Email: ${formData.email}</p><p>${formData.message}</p>`,
    })
});

// ... //
```