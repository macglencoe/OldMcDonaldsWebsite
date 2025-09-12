---
id: 300
title: "New Webmail Provider & Fallbacks"
date: "2025-09-12"
author: "Liam"
description: "Since our previous webmail provider failed, I've migrated to a new one."
---


In order to amend the issue with _SendGrid_'s plan, I've switched it out for another provider: _Resend_


_Resend_ has the following limits on the Free plan:

| Feature | Limit |
| --- | --- |
| Emails per month | 3,000 |
| Emails per day | 100 |

When either of these limits are surpassed, the API will start returning `429` responses, which means "Too Many Requests" or "You Hit Your Quota". 

When the previous provider (_SendGrid_) failed, users were left with nothing but an error code. In order to prevent that from happening, the site will automatically switch out the form with a backup when an error is received.

When a `429` response is received, the client will:
- block the form from being displayed
- instead, show a link to Google Forms
- display a banner explaining the issue:
   ![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/cx9ij4dtxb1s874dmkom.png)

