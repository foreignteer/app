# Foreignteer Cloud Functions

This directory contains Firebase Cloud Functions for the Foreignteer platform, handling automated email notifications and background tasks.

## Overview

### Current Functions

1. **onBookingCreate** - Triggered when a new booking is created
   - Sends confirmation email for instant-confirmation experiences
   - Sends "application received" email to volunteers for manual-approval experiences
   - Notifies NGOs of new applications requiring review

2. **onBookingStatusChange** - Triggered when a booking status changes
   - Sends approval email when NGO approves a pending application
   - Sends rejection email when NGO rejects an application

## Setup

### Prerequisites

- Node.js 18 or higher
- Firebase CLI (`npm install -g firebase-tools`)
- Firebase project with Blaze (pay-as-you-go) plan

### Installation

1. Navigate to the functions directory:
   ```bash
   cd functions
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Email Configuration

Before deploying, you need to configure email credentials using Firebase Functions config:

```bash
# Set email service credentials
firebase functions:config:set email.user="noreply@foreignteer.com"
firebase functions:config:set email.password="your-app-specific-password"
firebase functions:config:set email.service="gmail"
```

**Important Notes:**
- For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833), not your regular password
- For production, consider using a dedicated email service like SendGrid or AWS SES
- The `email.service` can be any service supported by Nodemailer (gmail, outlook, etc.)

### Development Mode

For local development and testing, the functions will run in "test mode" if no email configuration is set. In test mode:
- Emails are not actually sent
- Email content is logged to the console for verification
- All functions execute normally otherwise

To view current config:
```bash
firebase functions:config:get
```

## Development

### Build

Compile TypeScript to JavaScript:
```bash
npm run build
```

### Local Testing

Run functions locally using the Firebase Emulator:
```bash
# From the project root
firebase emulators:start

# Or just functions emulator
firebase emulators:start --only functions
```

### Linting

Check code quality:
```bash
npm run lint
```

## Deployment

### Deploy All Functions

```bash
# From the project root
firebase deploy --only functions
```

### Deploy Specific Function

```bash
firebase deploy --only functions:onBookingCreate
firebase deploy --only functions:onBookingStatusChange
```

### View Logs

```bash
# Stream logs in real-time
firebase functions:log --only onBookingCreate

# View recent logs
firebase functions:log
```

## Email Templates

Email templates are defined in [`src/email/templates.ts`](src/email/templates.ts) and use inline CSS for maximum email client compatibility.

Available templates:
- `bookingPendingToUser` - Application received (pending approval)
- `bookingConfirmedToUser` - Instant booking confirmation
- `bookingApprovedToUser` - Application approved by NGO
- `bookingRejectedToUser` - Application rejected by NGO
- `newApplicationToNGO` - New application notification to NGO

### Customizing Templates

1. Edit the template functions in `src/email/templates.ts`
2. Rebuild: `npm run build`
3. Redeploy: `firebase deploy --only functions`

**Best Practices:**
- Use inline CSS (email clients don't support `<style>` tags well)
- Test emails across different clients (Gmail, Outlook, Apple Mail)
- Keep designs simple and mobile-responsive
- Include plain text alternatives for accessibility

## Testing

### Manual Testing

1. Deploy functions to Firebase
2. Create a booking in your app
3. Check Firebase Functions logs: `firebase functions:log`
4. Verify email delivery

### Test Mode

When email configuration is not set, functions run in test mode:
```bash
# Clear email config to enable test mode
firebase functions:config:unset email
```

Test mode logs will show:
```
📧 Test Email: {
  from: 'test@foreignteer.com',
  to: 'user@example.com',
  subject: 'Booking Confirmed - Experience Name',
  html: '<html>...'
}
```

## Monitoring

### View Function Execution

```bash
# Real-time logs
firebase functions:log --only onBookingCreate

# Filter by severity
firebase functions:log --severity ERROR
```

### Firebase Console

Monitor functions in the [Firebase Console](https://console.firebase.google.com/):
- Functions > Dashboard - View execution metrics
- Functions > Logs - View detailed logs
- Functions > Health - Monitor errors and performance

## Troubleshooting

### Common Issues

**"Email configuration not set"**
- Solution: Set email config using `firebase functions:config:set`
- Or: Use test mode for development

**"Missing related data for booking notification"**
- Cause: User, experience, or NGO document doesn't exist
- Solution: Ensure all referenced documents exist before creating bookings

**"Error sending email"**
- Cause: Invalid credentials or service configuration
- Solution: Verify email config and app password
- Check: `firebase functions:config:get`

**Build errors**
- Solution: Run `npm install` to ensure all dependencies are installed
- Check TypeScript version compatibility

### Getting Help

- Check [Firebase Functions documentation](https://firebase.google.com/docs/functions)
- View [Nodemailer documentation](https://nodemailer.com/)
- Check function logs: `firebase functions:log`

## Production Considerations

### Email Service

For production, consider using a dedicated email service:
- **SendGrid** - Reliable, good free tier
- **AWS SES** - Cost-effective for high volume
- **Mailgun** - Developer-friendly API
- **Postmark** - Excellent deliverability

### Cost Management

Cloud Functions pricing:
- 2 million invocations/month free
- $0.40 per million invocations after that
- Additional charges for compute time and network egress

Monitor usage in the [Firebase Console](https://console.firebase.google.com/) > Functions > Usage

### Performance

- Functions have a cold start penalty (~1-2 seconds)
- Keep function logic lean
- Use `admin.firestore()` efficiently (minimize reads)
- Consider batching operations where possible

## Security

### Environment Variables

Never commit sensitive data:
- Use Firebase Functions config for secrets
- Never hardcode API keys or passwords
- Add `.gitignore` for environment files

### Data Access

Functions run with admin privileges:
- Validate all input data
- Be careful with destructive operations
- Log important actions for audit trails

## Future Enhancements

Potential additions:
- Reminder emails before experiences
- Follow-up emails after experiences
- Weekly digest emails for NGOs
- Volunteer achievement notifications
- Experience capacity alerts
- Scheduled reports and analytics

## Support

For questions or issues:
1. Check this README
2. View Firebase Functions logs
3. Check the main project documentation
4. Contact the development team
