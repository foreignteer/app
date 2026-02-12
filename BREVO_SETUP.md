# Brevo Email Integration - Setup Complete ✓

## What's Been Implemented

### 1. Environment Configuration ✓
- Added `BREVO_API_KEY` to `.env.local`
- Your API key is securely stored locally

### 2. Brevo SDK Installation ✓
- Installed `@getbrevo/brevo` package
- Configured transactional emails API
- Configured contacts API for newsletter management

### 3. Email Service ✓
Created comprehensive email service at `/src/lib/services/emailService.ts` with templates for:

- **Welcome Emails**: Sent to new users after registration
- **Booking Confirmation Emails**: Sent when users book experiences
- **NGO Approval Emails**: Sent when NGO registrations are approved
- **Password Reset Emails**: For password recovery (template ready, can be integrated)

### 4. API Routes Created ✓

- `/api/send-email/welcome` - Send welcome emails to new users
- `/api/send-email/booking-confirmation` - Send booking confirmations
- `/api/send-email/ngo-approval` - Send NGO approval notifications
- `/api/newsletter` - Updated to sync with Brevo contact lists

### 5. User Registration Updated ✓
- Modified `/src/app/register/page.tsx` to automatically send welcome emails after successful registration

### 6. Newsletter Integration ✓
- Updated newsletter API to sync subscribers with Brevo
- Automatically adds/updates contacts in Brevo lists
- Handles subscribe, resubscribe, and unsubscribe operations

---

## Required Brevo Configuration

You need to configure the following in your Brevo account:

### 1. Create Contact Lists

Log into your Brevo dashboard and create these lists:

1. **Newsletter List** (ID will be 2 in code)
   - Name: "Newsletter Subscribers"
   - Description: "Active newsletter subscribers"

2. **Unsubscribed List** (ID will be 3 in code)
   - Name: "Unsubscribed"
   - Description: "Users who unsubscribed from newsletter"

**Important**: After creating these lists, you'll need to update the list IDs in the code:
- Edit `/src/app/api/newsletter/route.ts`
- Replace list IDs on lines with `listIds = [2]` and `unlinkListIds = [3]` with your actual Brevo list IDs

### 2. Verify Sender Domains

Make sure these sender emails are verified in Brevo:

- `info@foreignteer.com` (default sender for most emails)
- `volunteer@foreignteer.com` (for user support emails)
- `partner@foreignteer.com` (for NGO-related emails)

### 3. Configure Email Templates (Optional)

While we're using HTML emails from code, you can optionally create templates in Brevo for easier editing:

1. Go to **Campaigns** → **Templates**
2. Create templates matching our designs
3. Update email service to use template IDs instead of HTML content

---

## Deployment Steps

### 1. Add API Key to Vercel

You need to add the Brevo API key to your Vercel environment variables:

```bash
# Go to your Vercel project dashboard
# Settings → Environment Variables
# Add new variable:

Name: BREVO_API_KEY
Value: [Your Brevo API key - get it from Brevo dashboard → Account → SMTP & API → API Keys]
Environment: Production, Preview, Development
```

Or use Vercel CLI:
```bash
cd /Users/diana/Documents/Foreignteer/foreignteer-app
vercel env add BREVO_API_KEY
# Paste your API key when prompted
# Select: Production, Preview, Development
```

### 2. Redeploy Your Application

After adding the environment variable:

```bash
vercel --prod
```

Or push to your connected GitHub repository to trigger automatic deployment.

---

## Testing the Integration

### Test Welcome Emails
1. Register a new user account at `https://foreignteer.com/register`
2. Check the user's email inbox for the welcome email
3. Verify the email appears in Brevo → **Statistics** → **Emails**

### Test Newsletter Subscription
1. Subscribe to newsletter from the website footer
2. Check Brevo → **Contacts** to see the new subscriber
3. Verify they're added to the "Newsletter Subscribers" list

### Test Booking Confirmation (when implemented)
```typescript
// Example usage in your booking flow:
await fetch('/api/send-email/booking-confirmation', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    name: 'John Doe',
    bookingDetails: {
      experienceTitle: 'Beach Cleanup',
      ngoName: 'Ocean Conservation',
      date: '15 February 2025',
      location: 'Bali, Indonesia',
      price: '£15.00',
    },
  }),
});
```

### Test NGO Approval (when admin approves NGO)
```typescript
// Example usage in your admin approval flow:
await fetch('/api/send-email/ngo-approval', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'ngo@example.com',
    ngoName: 'Ocean Conservation',
    contactName: 'Jane Smith',
  }),
});
```

---

## Email Templates Overview

All email templates follow Foreignteer's brand design:

- **Color Scheme**: Teal (#21B3B1) headers, Sand Peach (#FAF5EC) content backgrounds
- **Responsive**: Works on desktop and mobile devices
- **Professional**: Clean, modern design with proper spacing
- **Branded**: Includes Foreignteer logo and footer
- **Accessible**: Plain text fallbacks for all HTML emails

---

## Monitoring Email Deliverability

### Check Email Statistics in Brevo
1. Go to **Statistics** → **Email**
2. Monitor:
   - Delivery rate (should be >95%)
   - Open rate
   - Click rate
   - Bounce rate (should be <5%)
   - Spam reports

### Best Practices
- Keep your sender reputation high by maintaining low bounce/spam rates
- Regularly clean your contact lists
- Monitor unsubscribe rates
- Use engaging subject lines
- Test emails before sending campaigns

---

## Next Steps (Optional Enhancements)

### 1. Email Automation Workflows
Create automated email sequences in Brevo:
- Welcome series for new users
- Abandoned booking reminders
- Re-engagement campaigns for inactive users
- Post-volunteering follow-ups

### 2. Email Campaign Management
Use Brevo's campaign builder for:
- Monthly newsletters
- Feature announcements
- Seasonal volunteering opportunities
- Impact reports

### 3. SMS Integration (if needed)
Brevo also supports SMS. You can:
- Send booking confirmations via SMS
- Send last-minute volunteer reminders
- Send emergency updates to volunteers

### 4. Advanced Analytics
Set up:
- Google Analytics integration
- Custom event tracking
- A/B testing for email campaigns
- Conversion tracking

---

## Troubleshooting

### Emails Not Sending
1. Check Brevo API key is correct in environment variables
2. Verify sender domains are authenticated in Brevo
3. Check Brevo dashboard for error logs
4. Review application logs for API errors

### Emails Going to Spam
1. Ensure SPF, DKIM, and DMARC records are properly configured
2. Warm up your sender reputation gradually
3. Avoid spam trigger words in subject lines
4. Use proper email authentication

### Newsletter Not Syncing
1. Verify list IDs in code match your Brevo lists
2. Check API permissions in Brevo
3. Review error logs in `/api/newsletter`

---

## Support Resources

- **Brevo Documentation**: https://developers.brevo.com/
- **Brevo Support**: https://help.brevo.com/
- **Email Deliverability Guide**: https://www.brevo.com/blog/email-deliverability/

---

## Summary

✅ **Complete**:
- Brevo SDK installed and configured
- Email service with 4 professional templates created
- API routes for sending emails
- Welcome emails integrated into registration
- Newsletter syncing with Brevo contact lists

⏳ **Required Actions**:
1. Create contact lists in Brevo dashboard (Newsletter, Unsubscribed)
2. Update list IDs in code to match your Brevo lists
3. Add BREVO_API_KEY to Vercel environment variables
4. Redeploy application to Vercel
5. Test email sending functionality

📧 **Ready to Use**:
- Welcome emails (automatic on registration)
- Booking confirmations (integrate into booking flow)
- NGO approvals (integrate into admin approval flow)
- Newsletter subscriptions (automatic from website footer)

---

**Questions or issues?** Check the troubleshooting section above or review the Brevo dashboard for detailed logs and analytics.
