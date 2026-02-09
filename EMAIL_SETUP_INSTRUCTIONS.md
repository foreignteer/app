# Email Service Setup Instructions

## Current Status
✅ Favicon updated with original colored logo
⏳ Email service integration pending domain approval

---

## When Your Email Service is Ready

Once your domain is approved and you have your email service credentials, follow these steps:

### Step 1: Update emailService.ts

Edit: `/Users/diana/Documents/Foreignteer/foreignteer-app/functions/src/email/emailService.ts`

The file is currently set up as a template. You'll need to:

1. Install your email service package (e.g., `npm install [your-service-sdk]`)
2. Replace the placeholder code with your service's implementation
3. Add required environment variables

### Common Email Service Providers

#### Option A: Resend
```bash
cd functions
npm install resend
```

```typescript
import { Resend } from 'resend';

function getEmailClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY not set');
  return new Resend(apiKey);
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  const resend = getEmailClient();

  const result = await resend.emails.send({
    from: 'Foreignteer <noreply@foreignteer.com>',
    to: options.to,
    subject: options.subject,
    html: options.html,
  });

  console.log('✅ Email sent:', result.data?.id);
}
```

Set environment variable:
```bash
firebase functions:secrets:set RESEND_API_KEY
```

#### Option B: SendGrid
```bash
cd functions
npm install @sendgrid/mail
```

```typescript
import sgMail from '@sendgrid/mail';

function getEmailClient() {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) throw new Error('SENDGRID_API_KEY not set');
  sgMail.setApiKey(apiKey);
  return sgMail;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  const client = getEmailClient();

  const result = await client.send({
    from: 'Foreignteer <noreply@foreignteer.com>',
    to: options.to,
    subject: options.subject,
    html: options.html,
  });

  console.log('✅ Email sent:', result[0].statusCode);
}
```

Set environment variable:
```bash
firebase functions:secrets:set SENDGRID_API_KEY
```

#### Option C: Postmark
```bash
cd functions
npm install postmark
```

```typescript
import * as postmark from 'postmark';

function getEmailClient() {
  const apiKey = process.env.POSTMARK_SERVER_TOKEN;
  if (!apiKey) throw new Error('POSTMARK_SERVER_TOKEN not set');
  return new postmark.ServerClient(apiKey);
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  const client = getEmailClient();

  const result = await client.sendEmail({
    From: 'noreply@foreignteer.com',
    To: options.to,
    Subject: options.subject,
    HtmlBody: options.html,
  });

  console.log('✅ Email sent:', result.MessageID);
}
```

Set environment variable:
```bash
firebase functions:secrets:set POSTMARK_SERVER_TOKEN
```

---

### Step 2: Rebuild and Deploy

```bash
cd /Users/diana/Documents/Foreignteer/foreignteer-app/functions

# Build to check for errors
npm run build

# Deploy to Firebase
cd ..
firebase deploy --only functions
```

---

### Step 3: Test Email Notifications

1. Create a test booking with instant confirmation
2. Check Firebase Functions logs:
   ```bash
   firebase functions:log --only onBookingCreate
   ```
3. Verify email was sent successfully
4. Check volunteer's inbox for confirmation email

---

## Email Templates

All email templates are ready in:
`/Users/diana/Documents/Foreignteer/foreignteer-app/functions/src/email/templates.ts`

Templates include:
- ✅ Instant confirmation
- ✅ Application received (pending approval)
- ✅ Application approved by NGO
- ✅ Application rejected with reason
- ✅ New application notification to NGO
- ✅ Admin vetting emails

No changes needed to templates - they work with any email service!

---

## Troubleshooting

### Emails not sending?

**Check 1**: Verify environment variable is set
```bash
firebase functions:config:get
```

**Check 2**: Check function logs
```bash
firebase functions:log --only onBookingCreate,onBookingStatusChange
```

**Check 3**: Verify domain in email service dashboard

---

## Need Help?

When you're ready to integrate your email service:
1. Share the service name (e.g., "SendGrid", "Mailgun", etc.)
2. I'll provide specific integration code
3. We'll test and deploy together

**Current Status**: Functions will log emails but not send them until configured.

---

**Last Updated**: February 9, 2026
