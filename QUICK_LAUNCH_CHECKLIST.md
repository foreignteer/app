# ✅ Quick Launch Checklist - Get Live in 1 Hour!

Use this checklist to deploy Foreignteer for friend testing TODAY.

---

## 🎯 Goal
Get Foreignteer live with:
- Working email notifications via Gmail
- Error tracking via Sentry
- Deployed on Vercel with custom domain
- Ready for 3-5 friends to test

---

## 📋 Pre-Launch Checklist

### 1. Gmail Setup (5 minutes)
- [ ] Enable 2FA on foreignteer@gmail.com
- [ ] Generate App Password at https://myaccount.google.com/apppasswords
- [ ] Copy 16-character password (remove spaces)

### 2. Configure Firebase Functions (5 minutes)
```bash
cd /Users/diana/Documents/Foreignteer/foreignteer-app/functions
firebase functions:config:set email.user="foreignteer@gmail.com"
firebase functions:config:set email.password="YOUR_APP_PASSWORD_HERE"
```
- [ ] Config set successfully
- [ ] Deploy functions: `firebase deploy --only functions`

### 3. Sentry Setup (10 minutes)
- [ ] Create account at https://sentry.io/signup/
- [ ] Create project: "Foreignteer" (Platform: Next.js)
- [ ] Copy DSN (https://...@sentry.io/...)
- [ ] Copy Organization Slug
- [ ] Generate Auth Token (Settings > Auth Tokens)

### 4. Environment Variables (10 minutes)
Create `.env.local` with:
- [ ] All Firebase configuration
- [ ] Firebase Admin SDK credentials
- [ ] Sentry DSN, org, project, auth token

### 5. Push to GitHub (5 minutes)
```bash
cd /Users/diana/Documents/Foreignteer/foreignteer-app
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 6. Deploy to Vercel (15 minutes)
- [ ] Connect GitHub repo to Vercel
- [ ] Add ALL environment variables
- [ ] Deploy
- [ ] Test the deployment URL

### 7. Connect Custom Domain (10 minutes)
- [ ] Add domain in Vercel
- [ ] Update DNS records at domain registrar
- [ ] Wait for DNS propagation (~10 mins)

### 8. Create Test Data (15 minutes)
- [ ] Create 1 NGO account
- [ ] Create 3-5 sample experiences with photos
- [ ] Add variety (different locations, dates, types)

### 9. Final Testing (10 minutes)
- [ ] Sign up as user (check email received)
- [ ] Book an experience (check email received)
- [ ] Subscribe to newsletter (check email received)
- [ ] Check Sentry dashboard (no errors)
- [ ] Test on mobile

### 10. Prepare for Friends (5 minutes)
- [ ] Create Google Form for feedback
- [ ] Customize `FRIEND_TESTING_GUIDE.md` with your URL
- [ ] Send testing invites to 3-5 friends

---

## 🚨 Critical Things to Check Before Going Live

### Must Work:
- ✅ **User signup** - Friends can create accounts
- ✅ **Email delivery** - Confirmation emails arrive
- ✅ **Booking flow** - Can apply for experiences
- ✅ **Mobile responsive** - Works on phones
- ✅ **No console errors** - Clean browser console

### Can Be Imperfect:
- ⚠️ **Content** - Sample experiences are fine
- ⚠️ **Design tweaks** - Minor styling issues OK
- ⚠️ **Missing features** - Payment can wait
- ⚠️ **Performance** - OK if slightly slow

---

## 📧 Email Test Checklist

After deploying, verify emails work:

### Test 1: New User Signup
1. Create account with your personal email
2. **Expected**: Welcome email arrives within 1 minute
3. **Check spam folder** if not in inbox

### Test 2: Newsletter Signup
1. Subscribe with different email
2. **Expected**: Confirmation email
3. **Check**: Email has unsubscribe link

### Test 3: Booking (Instant Confirmation)
1. Book an experience with instant confirmation
2. **Expected**: Booking confirmation email
3. **Check**: Email has experience details

### Test 4: Booking (Manual Approval)
1. Book experience requiring approval
2. **Expected**: "Application received" email
3. **Later**: Approve in NGO dashboard
4. **Expected**: "Application approved" email

### If Emails Don't Work:
```bash
# Check Firebase logs
firebase functions:log

# Look for errors or "Email sent successfully"
# If config missing, re-set and redeploy
firebase functions:config:set email.user="foreignteer@gmail.com"
firebase functions:config:set email.password="YOUR_PASSWORD"
firebase deploy --only functions
```

---

## 🐛 Error Monitoring

### Sentry Dashboard Checks:
- Go to https://sentry.io
- Should see "0 issues" initially
- Create a test error to verify it appears
- Set up alerts for new issues

### What to Monitor During Testing:
1. **Real-time errors** in Sentry
2. **Firebase logs** for backend issues
3. **Vercel deployment logs** for build issues
4. **Gmail sent folder** to confirm emails going out

---

## 👥 Friend Testing Protocol

### Who to Invite:
- 3-5 people you trust
- Mix of tech-savvy and non-tech
- Different devices (Mac, PC, iPhone, Android)
- Willing to give honest feedback

### What to Send Them:
```
Subject: Help Test My New Volunteering Platform! 🌍

Hi [Name],

I'm launching Foreignteer, a platform connecting volunteers with
meaningful experiences worldwide. Can you help test it?

⏰ Time needed: 30-60 minutes
🎁 In return: Early access + exclusive discount codes

🔗 Test site: [YOUR_URL]
📋 Instructions: [Link to FRIEND_TESTING_GUIDE.md]
📝 Feedback form: [Google Form link]
📅 Deadline: [3 days from now]

Any questions, just reply! Thanks for helping out! 🙏

Best,
[Your name]
```

### During Testing Week:
- **Day 1-2**: Friends test, submit feedback
- **Day 3-4**: Review feedback, fix critical bugs
- **Day 5**: Retest key fixes
- **Day 6**: Plan next steps based on feedback

---

## 🎯 Success Criteria

Your launch is successful if:

- [ ] **3+ friends complete testing** and submit feedback
- [ ] **No critical bugs** that prevent core features
- [ ] **Emails work reliably** (90%+ delivery rate)
- [ ] **Positive overall feedback** (7+/10 average)
- [ ] **Sentry catches errors** when they occur
- [ ] **Mobile experience is usable** (even if not perfect)

---

## 📊 Metrics to Track

### During Testing Week:
- Number of signups
- Number of bookings
- Email delivery rate
- Number of errors in Sentry
- Average page load time
- Mobile vs desktop usage

### In Vercel Analytics:
- Total page views
- Unique visitors
- Most visited pages
- Bounce rate

### In Firebase:
- New users count
- Experiences created
- Bookings submitted
- Newsletter signups

---

## 🚀 Launch Day Timeline

### Morning (Setup - 1 hour):
- [ ] 9:00 AM - Configure Gmail App Password
- [ ] 9:05 AM - Set Firebase Functions config
- [ ] 9:10 AM - Deploy Firebase Functions
- [ ] 9:15 AM - Set up Sentry
- [ ] 9:25 AM - Create .env.local
- [ ] 9:35 AM - Push to GitHub
- [ ] 9:40 AM - Deploy to Vercel
- [ ] 9:55 AM - Add environment variables
- [ ] 10:00 AM - Test deployment

### Afternoon (Content & Testing - 1 hour):
- [ ] 2:00 PM - Create NGO account
- [ ] 2:10 PM - Create 5 sample experiences
- [ ] 2:25 PM - Test all flows
- [ ] 2:35 PM - Create feedback form
- [ ] 2:45 PM - Customize testing guide
- [ ] 2:55 PM - Send invites to friends

### Evening (Monitor):
- Check Sentry for errors
- Check Firebase for activity
- Respond to friend questions

---

## 🆘 Quick Troubleshooting

### "Emails not sending"
```bash
firebase functions:log
# Look for errors
firebase functions:config:get
# Verify email config exists
```

### "Build failing on Vercel"
- Check all environment variables are set
- Verify FIREBASE_ADMIN_PRIVATE_KEY has quotes and \n
- Check build logs for specific errors

### "Sentry not showing errors"
- Verify NEXT_PUBLIC_SENTRY_DSN is set
- Check it starts with https://
- Redeploy on Vercel

### "Domain not connecting"
- Wait 10-30 minutes
- Check DNS with dnschecker.org
- Verify DNS records match Vercel requirements

---

## 📞 Support Resources

### Documentation:
- **Deployment Guide**: `DEPLOYMENT_GUIDE.md` (detailed step-by-step)
- **Testing Guide**: `FRIEND_TESTING_GUIDE.md` (send to friends)
- **This Checklist**: `QUICK_LAUNCH_CHECKLIST.md` (you are here!)

### If You Get Stuck:
- Vercel Docs: https://vercel.com/docs
- Firebase Docs: https://firebase.google.com/docs
- Sentry Docs: https://docs.sentry.io
- Next.js Docs: https://nextjs.org/docs

---

## ✨ You're Ready!

Everything is set up. Follow this checklist and you'll be live in about 1-2 hours.

**Remember**:
- This is a TEST launch for friends
- Bugs are expected and welcomed
- Feedback is the goal, not perfection
- You can fix things as you go

**Go for it!** 🚀

---

**Date to Launch**: _____________
**Friends to Invite**: _____________ (3-5 people)
**Feedback Deadline**: _____________ (3 days after launch)
**Status**: ⬜ Not started / ⬜ In progress / ⬜ LIVE! 🎉
