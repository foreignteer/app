# 🚀 Deployment Guide - Quick Launch for Friend Testing

This guide will help you deploy Foreignteer to production for friend testing in ~1 hour.

---

## Prerequisites Checklist

- [ ] Gmail account: foreignteer@gmail.com (you have this!)
- [ ] Domain name (you mentioned you have this)
- [ ] Firebase project set up
- [ ] GitHub account (for Vercel deployment)
- [ ] Sentry account (for error tracking)

---

## Part 1: Gmail App Password Setup (5 minutes)

### Step 1: Enable 2-Factor Authentication on Gmail

1. Go to https://myaccount.google.com/security
2. Sign in to foreignteer@gmail.com
3. Under "How you sign in to Google", click "2-Step Verification"
4. Follow prompts to enable 2FA (use phone number or authenticator app)

### Step 2: Generate App Password

1. Go to https://myaccount.google.com/apppasswords
2. In "Select app" dropdown, choose "Mail"
3. In "Select device" dropdown, choose "Other (Custom name)"
4. Enter: "Foreignteer Functions"
5. Click "Generate"
6. **IMPORTANT**: Copy the 16-character password (e.g., "abcd efgh ijkl mnop")
7. Save this password - you'll need it in Step 3

---

## Part 2: Firebase Functions Email Configuration (5 minutes)

### Option A: Using Firebase CLI (Recommended)

```bash
cd /Users/diana/Documents/Foreignteer/foreignteer-app/functions

# Set email configuration
firebase functions:config:set email.user="foreignteer@gmail.com"
firebase functions:config:set email.password="YOUR_APP_PASSWORD_HERE"

# Verify configuration
firebase functions:config:get
```

Replace `YOUR_APP_PASSWORD_HERE` with the 16-character password from Step 2 (remove spaces).

### Option B: Using Firebase Console

1. Go to Firebase Console > Functions > Configuration
2. Add environment variables:
   - Key: `email.user`, Value: `foreignteer@gmail.com`
   - Key: `email.password`, Value: `YOUR_APP_PASSWORD_HERE`

---

## Part 3: Deploy Firebase Functions (10 minutes)

```bash
cd /Users/diana/Documents/Foreignteer/foreignteer-app

# Deploy functions
firebase deploy --only functions

# Expected output:
# ✔ functions: Finished running predeploy script.
# ✔ functions[onBookingCreate(us-central1)]: Successful create operation.
# ✔ functions[onBookingStatusChange(us-central1)]: Successful create operation.
```

### Test Email Functionality (Optional)

Create a test booking to verify emails are sent. Check Firebase Functions logs:

```bash
firebase functions:log
```

You should see: "✅ Email sent successfully"

---

## Part 4: Sentry Setup (10 minutes)

### Step 1: Create Sentry Account

1. Go to https://sentry.io/signup/
2. Sign up with your email
3. Create a new project:
   - Platform: Next.js
   - Project name: Foreignteer
   - Alert frequency: "Alert me on every new issue"

### Step 2: Get Sentry DSN

After creating the project:
1. You'll see your DSN (looks like: `https://abc123@o123456.ingest.sentry.io/123456`)
2. Copy this DSN - you'll need it for environment variables

### Step 3: Get Organization Slug and Project Name

1. From Sentry dashboard, click Settings (gear icon)
2. Under "Organization Settings", copy your **Organization Slug** (e.g., "diana-s-team")
3. Under "Projects", copy your **Project Name** (should be "foreignteer")

---

## Part 5: Environment Variables Setup (5 minutes)

Create `.env.local` file in the root directory:

```bash
cd /Users/diana/Documents/Foreignteer/foreignteer-app
```

Create file `.env.local` with the following content:

```env
# Firebase Configuration (from your Firebase project settings)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (from service account JSON)
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@your_project.iam.gserviceaccount.com

# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=https://abc123@o123456.ingest.sentry.io/123456
SENTRY_ORG=your-organization-slug
SENTRY_PROJECT=foreignteer
SENTRY_AUTH_TOKEN=your_auth_token

# Environment
NODE_ENV=production
```

### Get Firebase Configuration:

1. Go to Firebase Console > Project Settings
2. Under "Your apps", find your web app
3. Click "Config" to see all values
4. Copy values to `.env.local`

### Get Firebase Admin SDK:

1. Go to Firebase Console > Project Settings > Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Copy values from JSON to `.env.local`:
   - `project_id` → `FIREBASE_ADMIN_PROJECT_ID`
   - `private_key` → `FIREBASE_ADMIN_PRIVATE_KEY` (keep the quotes and \n characters!)
   - `client_email` → `FIREBASE_ADMIN_CLIENT_EMAIL`

### Get Sentry Auth Token:

1. Go to Sentry > Settings > Account > Auth Tokens
2. Click "Create New Token"
3. Name: "Foreignteer Deploy"
4. Scopes: Check "project:releases"
5. Copy the token to `.env.local`

---

## Part 6: Deploy to Vercel (15 minutes)

### Step 1: Push to GitHub

```bash
cd /Users/diana/Documents/Foreignteer/foreignteer-app

# Initialize git (if not already done)
git init
git add .
git commit -m "Ready for deployment"

# Create GitHub repository
# Go to github.com and create new repository: "foreignteer-app"

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/foreignteer-app.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com/signup
2. Sign up with GitHub
3. Click "New Project"
4. Import `foreignteer-app` repository
5. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (default)

### Step 3: Add Environment Variables in Vercel

1. In Vercel project settings, go to "Environment Variables"
2. Add ALL variables from your `.env.local` file
3. For each variable:
   - Name: Variable name (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`)
   - Value: Variable value
   - Environment: Check all three (Production, Preview, Development)

**IMPORTANT**: For `FIREBASE_ADMIN_PRIVATE_KEY`, make sure to keep the quotes and `\n` characters exactly as they are!

### Step 4: Deploy

1. Click "Deploy"
2. Wait for deployment to complete (~5 minutes)
3. You'll get a URL like: `https://foreignteer-app.vercel.app`

---

## Part 7: Connect Custom Domain (10 minutes)

### In Vercel:

1. Go to Project Settings > Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `foreignteer.com`)
4. Vercel will provide DNS records

### In Your Domain Registrar:

1. Go to your domain's DNS settings
2. Add the DNS records provided by Vercel:
   - Type: A Record
   - Name: @ (or leave blank)
   - Value: 76.76.21.21 (Vercel's IP)

   OR

   - Type: CNAME
   - Name: www
   - Value: cname.vercel-dns.com

3. Save DNS changes (can take up to 48 hours, usually ~10 minutes)

---

## Part 8: Test the Deployment (10 minutes)

### Test Checklist:

Visit your deployed site and test:

- [ ] Homepage loads correctly
- [ ] Can sign up as a user
- [ ] Can browse experiences
- [ ] Can create an NGO account
- [ ] Newsletter signup works
- [ ] Blog posts load
- [ ] FAQ page loads
- [ ] Contact form submits

### Test Email Notifications:

1. Create a user account with your personal email
2. Sign up for newsletter
3. Check your email - you should receive confirmation email
4. Check Sentry dashboard - should show no errors

### Monitor Errors:

1. Go to Sentry dashboard: https://sentry.io/organizations/YOUR_ORG/issues/
2. Check for any errors
3. All errors will be logged here during friend testing

---

## Part 9: Create Test Data (15 minutes)

### Create Sample NGO Account:

1. Go to `/register/ngo` on your deployed site
2. Create NGO account:
   - Name: "Wildlife Conservation Nepal"
   - Email: Use a different email (can be your +alias email)
   - Complete registration

### Create Sample Experiences (create 3-5):

Example 1:
- Title: "Sea Turtle Conservation in Thailand"
- Location: Phuket, Thailand
- Dates: Next month
- Capacity: 10
- Summary: "Help protect endangered sea turtles on beautiful beaches"
- Add photo from Unsplash

Example 2:
- Title: "Teaching English in Rural India"
- Location: Goa, India
- Dates: 2 months from now
- Capacity: 5
- Summary: "Empower children through education in a village school"

Example 3:
- Title: "Wildlife Photography Workshop Kenya"
- Location: Nairobi, Kenya
- Dates: 3 months from now
- Capacity: 8
- Summary: "Document wildlife conservation efforts through photography"

---

## Part 10: Prepare for Friend Testing (5 minutes)

### Share with Friends:

Send them:
1. **URL**: Your custom domain or Vercel URL
2. **Testing Instructions**: See `FRIEND_TESTING_GUIDE.md`
3. **Feedback Form**: Google Form for collecting feedback (create one)

### Monitor During Testing:

- **Sentry Dashboard**: https://sentry.io (check for errors in real-time)
- **Vercel Analytics**: Vercel dashboard > Analytics (see page views)
- **Firebase Console**: Check Firestore for new users/bookings
- **Gmail**: Check for sent emails

---

## Troubleshooting

### Emails Not Sending:

```bash
# Check Firebase Functions logs
firebase functions:log

# Look for:
# ⚠️ Email configuration missing
# OR
# ✅ Email sent successfully
```

If you see "Email configuration missing":
```bash
firebase functions:config:get
# Should show email.user and email.password
```

Re-set if missing:
```bash
firebase functions:config:set email.user="foreignteer@gmail.com"
firebase functions:config:set email.password="YOUR_APP_PASSWORD"
firebase deploy --only functions
```

### Sentry Not Catching Errors:

Check `.env.local` has:
```env
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
```

Redeploy on Vercel with environment variables set.

### Build Fails on Vercel:

- Check Vercel deployment logs
- Most common: Missing environment variables
- Solution: Add all variables from `.env.local` to Vercel

### Domain Not Connecting:

- Wait 10-30 minutes for DNS propagation
- Check DNS settings match Vercel requirements
- Use `https://dnschecker.org` to verify DNS propagation

---

## Quick Reference Commands

```bash
# Deploy Firebase Functions
firebase deploy --only functions

# View function logs
firebase functions:log

# Check Firebase config
firebase functions:config:get

# Set Firebase config
firebase functions:config:set email.user="foreignteer@gmail.com"

# Build Next.js locally
npm run build

# Run production build locally
npm run start
```

---

## Success! 🎉

Your site is now live and ready for friend testing!

**Next Steps:**
1. Share URL with 3-5 friends
2. Give them testing instructions (see `FRIEND_TESTING_GUIDE.md`)
3. Monitor Sentry for errors
4. Collect feedback via Google Form
5. Fix critical bugs before wider launch

**Support:**
If you encounter any issues during deployment, check:
- Vercel deployment logs
- Firebase Functions logs
- Sentry error dashboard
- Browser console (F12)

---

**Deployment Date**: [Add date when you deploy]
**URL**: [Add your production URL]
**Status**: ✅ Ready for testing
