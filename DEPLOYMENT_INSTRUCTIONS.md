# Foreignteer - Deployment Instructions

## ✅ Completed Tasks

### 1. Email Service Updated to Resend ✓
- Replaced nodemailer with Resend
- Updated `functions/src/email/emailService.ts`
- Dependencies updated in `functions/package.json`

### 2. Favicon Updated to Black & White Logo ✓
- Created grayscale version of Foreignteer logo
- Generated `favicon.ico` at `src/app/favicon.ico`
- Created multiple PNG icon sizes:
  - `public/icon-16.png` (16x16)
  - `public/icon-32.png` (32x32)
  - `public/icon-192.png` (192x192)
- Next.js will automatically use these files

---

## 📋 Next Steps

### Step 1: Get Resend API Key

1. Go to [Resend](https://resend.com) and sign up/log in
2. Navigate to **API Keys** in your dashboard
3. Click **Create API Key**
4. Give it a name (e.g., "Foreignteer Production")
5. Copy the API key (starts with `re_`)
6. **IMPORTANT**: Verify your domain or use Resend's sandbox mode for testing

#### Verify Your Domain (Recommended for Production)
To send from `noreply@foreignteer.com`:
1. Go to **Domains** in Resend dashboard
2. Add `foreignteer.com`
3. Add the required DNS records to your domain provider
4. Wait for verification (usually < 1 hour)

---

### Step 2: Configure Firebase Functions Environment

You need to set the Resend API key in Firebase Functions:

#### Option A: Using Firebase CLI (Recommended)

```bash
# Navigate to your project
cd /Users/diana/Documents/Foreignteer/foreignteer-app

# Set the Resend API key
firebase functions:secrets:set RESEND_API_KEY

# When prompted, paste your Resend API key
```

#### Option B: Using Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **foreignteer-ea9b6**
3. Go to **Functions** → **Configuration**
4. Click **Add variable**
5. Name: `RESEND_API_KEY`
6. Value: Your Resend API key (starts with `re_`)
7. Click **Save**

#### For Local Testing (Optional)

Create/update `.env` in the functions directory:

```bash
# /Users/diana/Documents/Foreignteer/foreignteer-app/functions/.env
RESEND_API_KEY=re_your_api_key_here
ADMIN_EMAIL=your-admin-email@foreignteer.com
```

---

### Step 3: Deploy Firebase Functions

```bash
# Navigate to project root
cd /Users/diana/Documents/Foreignteer/foreignteer-app

# Login to Firebase (if not already logged in)
firebase login

# Deploy functions
firebase deploy --only functions

# Or deploy everything (functions, firestore rules, hosting if configured)
firebase deploy
```

#### Expected Output:
```
✔ functions: Finished running predeploy script.
i functions: ensuring required API cloudfunctions.googleapis.com is enabled...
i functions: ensuring required API cloudbuild.googleapis.com is enabled...
✔ functions: required API cloudfunctions.googleapis.com is enabled
✔ functions: required API cloudbuild.googleapis.com is enabled
i functions: preparing codebase default for deployment
i functions: uploading functions archive...
✔ functions: uploaded codebase successfully
i functions: deploying functions
✔ functions[onBookingCreate(us-central1)]: Successful update operation.
✔ functions[onBookingStatusChange(us-central1)]: Successful update operation.

✔ Deploy complete!
```

---

### Step 4: Verify Email Notifications Work

#### Test Instant Confirmation:
1. Create an experience with "Instant Confirmation" enabled
2. Book the experience as a volunteer
3. Check volunteer's email for confirmation

#### Test Manual Approval:
1. Create an experience with "NGO Approval Required"
2. Book the experience as a volunteer
3. Check emails:
   - Volunteer receives "Application Received"
   - NGO receives "New Volunteer Application"
4. NGO approves the booking
5. Check volunteer's email for approval confirmation

#### Check Function Logs:
```bash
# View real-time logs
firebase functions:log --only onBookingCreate,onBookingStatusChange

# View recent logs
firebase functions:log
```

Look for:
- ✅ Success messages: "Email sent successfully via Resend"
- ❌ Errors: Check for API key issues or Resend domain verification

---

### Step 5: Update Resend Email Domain (Production)

Update the "from" address in `functions/src/email/emailService.ts` if needed:

**Current**:
```typescript
from: 'Foreignteer <noreply@foreignteer.com>'
```

**If using sandbox** (for testing before domain verification):
```typescript
from: 'Foreignteer <onboarding@resend.dev>'
```

After changing, redeploy:
```bash
cd /Users/diana/Documents/Foreignteer/foreignteer-app
npm run build
firebase deploy --only functions
```

---

## 🎯 Email Templates Available

All email templates are in `functions/src/email/templates.ts`:

1. **bookingConfirmedToUser** - Instant confirmation
2. **bookingPendingToUser** - Application received (requires approval)
3. **bookingApprovedToUser** - NGO approved application
4. **bookingRejectedToUser** - Application rejected
5. **newApplicationToNGO** - New application for NGO to review
6. **bookingPendingAdminToUser** - Admin vetting required
7. **newApplicationToAdmin** - Admin needs to review
8. **bookingAdminApprovedToUser** - Admin approved, passed to NGO

---

## 🔍 Troubleshooting

### Problem: Emails not sending

**Check 1**: Verify Resend API key is set
```bash
firebase functions:config:get
```

**Check 2**: Check function logs for errors
```bash
firebase functions:log --only onBookingCreate
```

**Check 3**: Verify Resend domain
- Go to Resend dashboard
- Check domain verification status
- Use `onboarding@resend.dev` for testing if domain not verified

### Problem: Function deployment fails

**Solution 1**: Check you're logged in
```bash
firebase login
firebase projects:list
```

**Solution 2**: Ensure billing is enabled
- Functions require Blaze plan (pay-as-you-go)
- Go to Firebase Console → Settings → Usage and Billing

**Solution 3**: Check IAM permissions
- Service account needs Cloud Functions permissions
- Go to Cloud Console → IAM & Admin

### Problem: "RESEND_API_KEY not set" in logs

**Solution**: Set the secret using Firebase CLI
```bash
firebase functions:secrets:set RESEND_API_KEY
```

---

## 📝 Testing Checklist

- [ ] Resend API key obtained
- [ ] Domain verified in Resend (or using sandbox)
- [ ] API key configured in Firebase Functions
- [ ] Functions deployed successfully
- [ ] Instant confirmation email works
- [ ] Pending approval email works (to volunteer)
- [ ] New application email works (to NGO)
- [ ] Approval email works
- [ ] Rejection email works (with reason)
- [ ] Favicon appears correctly in browser
- [ ] Icons load on mobile devices

---

## 🚀 Quick Deploy Commands

```bash
# Full deployment workflow
cd /Users/diana/Documents/Foreignteer/foreignteer-app

# 1. Build and test locally (optional)
cd functions
npm run build
npm run serve  # Test with emulators

# 2. Deploy to production
cd ..
firebase deploy --only functions

# 3. Watch logs
firebase functions:log --follow
```

---

## 📧 Need Help?

- **Resend Docs**: https://resend.com/docs
- **Firebase Functions Docs**: https://firebase.google.com/docs/functions
- **Resend Support**: https://resend.com/support

---

**Last Updated**: February 9, 2026
**Status**: Ready to deploy ✅
