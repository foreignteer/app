# Firebase Functions - Quick Deployment Guide

## What Was Created

Firebase Cloud Functions have been set up to handle automated email notifications for bookings:

### Files Created

```
functions/
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── .gitignore               # Ignore build artifacts
├── README.md                # Full documentation
├── DEPLOYMENT_GUIDE.md      # This file
└── src/
    ├── index.ts             # Main exports
    ├── email/
    │   ├── emailService.ts  # Email sending service
    │   └── templates.ts     # HTML email templates
    └── triggers/
        ├── onBookingCreate.ts        # New booking notifications
        └── onBookingStatusChange.ts  # Approval/rejection notifications
```

### Configuration Updated

- `firebase.json` - Added functions configuration with Node.js 18 runtime

## Quick Start (5 minutes)

### Step 1: Install Dependencies

```bash
cd /Users/diana/Documents/Foreignteer/foreignteer-app/functions
npm install
```

### Step 2: Set Up Email Configuration

You need to configure email credentials. For Gmail:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account > Security > 2-Step Verification > App passwords
   - Create a new app password for "Mail"
   - Copy the 16-character password

3. **Configure Firebase**:
```bash
cd /Users/diana/Documents/Foreignteer/foreignteer-app

firebase functions:config:set email.user="noreply@foreignteer.com"
firebase functions:config:set email.password="your-16-char-app-password"
firebase functions:config:set email.service="gmail"
```

### Step 3: Build the Functions

```bash
cd functions
npm run build
```

### Step 4: Deploy to Firebase

```bash
cd ..
firebase deploy --only functions
```

Expected output:
```
✔  functions[onBookingCreate(us-central1)] Successful create operation.
✔  functions[onBookingStatusChange(us-central1)] Successful update operation.
```

## Testing

### Test 1: Instant Confirmation Experience

1. Create an experience with **Instant Confirmation = ON**
2. Book the experience as a volunteer
3. Check your email - you should receive a "Booking Confirmed" email
4. The NGO should NOT receive a notification (no approval needed)

### Test 2: Manual Approval Experience

1. Create an experience with **Instant Confirmation = OFF** (default)
2. Book the experience as a volunteer
3. Check volunteer's email - should receive "Application Received" email
4. Check NGO's email - should receive "New Volunteer Application" email
5. As NGO, approve the application in the dashboard
6. Check volunteer's email - should receive "Application Approved" email

### Test 3: Application Rejection

1. Book a manual-approval experience
2. As NGO, reject the application (optionally with a reason)
3. Check volunteer's email - should receive "Application Update" email with rejection reason

## Viewing Logs

### Real-time Logs

```bash
firebase functions:log
```

### Filter by Function

```bash
firebase functions:log --only onBookingCreate
firebase functions:log --only onBookingStatusChange
```

### View in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to Functions > Logs

## Development Mode (Test Without Sending Emails)

For local testing without sending actual emails:

1. **Don't set email config** (or unset it):
```bash
firebase functions:config:unset email
```

2. Functions will run in "test mode":
   - Emails are logged to console instead of sent
   - You can see the email content in the logs
   - Perfect for testing email templates

3. Check logs to see test emails:
```bash
firebase functions:log
```

You'll see output like:
```
📧 Test Email: {
  from: 'test@foreignteer.com',
  to: 'user@example.com',
  subject: 'Booking Confirmed - Beach Cleanup',
  html: '<html>...'
}
```

## Troubleshooting

### Issue: "Email configuration not set"

**Solution**: Set the email config:
```bash
firebase functions:config:set email.user="your-email@gmail.com"
firebase functions:config:set email.password="your-app-password"
firebase functions:config:set email.service="gmail"
```

### Issue: "Authentication failed"

**Solution**: Verify you're using an App Password, not your regular Gmail password
- Go to Google Account > Security > App passwords
- Generate a new 16-character app password
- Use that password in the config

### Issue: "Missing related data"

**Cause**: User, experience, or NGO document missing from Firestore

**Solution**: Ensure all documents exist before creating bookings

### Issue: Build errors

**Solution**:
```bash
cd functions
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Production Email Services (Recommended)

For production, consider using a dedicated email service instead of Gmail:

### SendGrid (Recommended)

1. Sign up at [SendGrid](https://sendgrid.com/)
2. Create an API key
3. Install SendGrid package:
```bash
cd functions
npm install @sendgrid/mail
```
4. Update `emailService.ts` to use SendGrid API

### AWS SES

1. Sign up for AWS SES
2. Verify your domain
3. Use SMTP credentials with Nodemailer (already configured)

### Mailgun

1. Sign up at [Mailgun](https://www.mailgun.com/)
2. Get SMTP credentials
3. Update Firebase config with Mailgun SMTP settings

## Cost Estimate

Firebase Functions pricing:
- **Free tier**: 2 million invocations/month
- **After free tier**: $0.40 per million invocations
- **Compute time**: $0.0000025 per GB-second
- **Network egress**: $0.12 per GB

Estimated cost for Foreignteer:
- ~100 bookings/day = ~3,000/month
- Each booking triggers 1-2 functions
- **Total**: Well within free tier (~6,000 invocations/month)

## Next Steps

1. **Deploy the functions** (steps above)
2. **Test email notifications** with real bookings
3. **Monitor logs** for the first few days
4. **Customize email templates** if needed
5. **Set up email service** for production (SendGrid, etc.)
6. **Configure email domain** (optional, for better deliverability)

## Email Template Customization

To customize email templates:

1. Edit `functions/src/email/templates.ts`
2. Rebuild: `npm run build`
3. Redeploy: `firebase deploy --only functions`

**Tips**:
- Use inline CSS (most email clients don't support `<style>` tags)
- Test across different email clients (Gmail, Outlook, Apple Mail)
- Keep mobile-friendly (many users read emails on phones)
- Use Foreignteer brand colours: #21B3B1, #F6C98D, #C9F0EF

## Support

Full documentation: [`functions/README.md`](README.md)

For issues:
1. Check Firebase Functions logs: `firebase functions:log`
2. Review the README for detailed troubleshooting
3. Check Firebase Console > Functions > Health
