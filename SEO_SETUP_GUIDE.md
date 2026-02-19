# Foreignteer SEO Setup Guide

## 🚀 Quick Win: Get Indexed on Google in 24-48 Hours

Your site is **SEO-ready** with sitemap, robots.txt, and meta tags already configured. Follow these steps to get indexed on Google immediately:

---

## Step 1: Google Search Console Setup (CRITICAL - Do This First!)

### A. Verify Ownership

1. **Go to Google Search Console**: https://search.google.com/search-console

2. **Add Property**:
   - Click "+ Add Property"
   - Choose "URL prefix"
   - Enter: `https://foreignteer.com` (without www)

3. **Verify via HTML file** (Recommended):
   - Google will provide a verification file (e.g., `google1234567890abcdef.html`)
   - Download the file
   - Place it in `/public/` folder of your Next.js project
   - Deploy to production
   - Click "Verify" in Search Console

   **Alternative: Verify via DNS** (if you manage DNS):
   - Add TXT record to your domain DNS settings
   - Wait for DNS propagation (up to 48 hours)
   - Click "Verify"

### B. Submit Sitemap

Once verified:
1. In Google Search Console, go to **"Sitemaps"** (left sidebar)
2. Enter sitemap URL: `https://foreignteer.com/sitemap.xml`
3. Click **"Submit"**

**✅ Result**: Google will start crawling your site within 24-48 hours.

---

## Step 2: Request Indexing for Key Pages

For immediate indexing of critical pages:

1. Go to **"URL Inspection"** in Search Console
2. Enter URLs one by one:
   - `https://foreignteer.com`
   - `https://foreignteer.com/about`
   - `https://foreignteer.com/experiences`
   - `https://foreignteer.com/blog`
   - `https://foreignteer.com/partner`
   - `https://foreignteer.com/how-it-works`

3. Click **"Request Indexing"** for each URL
4. Google will prioritize indexing these pages (usually within 24 hours)

**⚡ Pro Tip**: Do this for your top 10 most important pages first.

---

## Step 3: Create Google Business Profile (Optional but Recommended)

If you have a physical office or coworking space in Hong Kong:

1. **Go to**: https://business.google.com
2. **Create Profile** for Foreignteer
3. Add:
   - Business name: Foreignteer
   - Category: Non-profit organization / Volunteer organization
   - Location: Hong Kong (if applicable)
   - Website: https://foreignteer.com
   - Description: Micro-volunteering platform connecting travelers with meaningful local causes

**Benefits**: Appear in Google Maps, Local Search, and Knowledge Graph.

---

## Step 4: Build Initial Backlinks (First Week)

Get indexed faster with these quick backlinks:

### Free Directory Submissions:
1. **Bing Webmaster Tools**: https://www.bing.com/webmasters
   - Add site and submit sitemap (same as Google)

2. **Volunteer-Focused Directories**:
   - VolunteerMatch: https://www.volunteermatch.org
   - Idealist: https://www.idealist.org
   - GlobalGiving: https://www.globalgiving.org

3. **Business Directories**:
   - Yelp (if you have a physical location)
   - Yellow Pages
   - Clutch (for service businesses)

### Social Media Profiles (Index Immediately):
- Complete your **Facebook** page with website link
- Complete your **Instagram** bio with website link
- Complete your **LinkedIn** company page
- Create **Pinterest** boards about volunteering (add website)

**Why This Helps**: Google trusts sites that have social signals and external references.

---

## Step 5: Content Strategy (Week 1-4)

To rank for "foreignteer" and related terms:

### Publish Quality Content:
1. **Blog Posts** (2-3 per week):
   - "How Foreignteer Makes Volunteering Accessible"
   - "Top 10 Micro-Volunteering Opportunities in [City]"
   - "Success Stories: Impact Through Foreignteer"

2. **Add Alt Text to Images**:
   - Use descriptive alt text with keywords
   - Example: `alt="Volunteer teaching English in Barcelona through Foreignteer"`

3. **Internal Linking**:
   - Link blog posts to /experiences page
   - Link from homepage to all main pages
   - Create "Related Experiences" sections

---

## Step 6: Technical SEO Checklist

✅ **Already Done** (Your site has these!):
- [x] Sitemap.xml (https://foreignteer.com/sitemap.xml)
- [x] Robots.txt (https://foreignteer.com/robots.txt)
- [x] Meta descriptions on all pages
- [x] Open Graph tags
- [x] Twitter Card tags
- [x] Structured Data (Organization schema)
- [x] Mobile responsive
- [x] HTTPS enabled
- [x] Fast page load (Next.js optimization)

✅ **To Do**:
- [ ] Submit to Google Search Console
- [ ] Submit to Bing Webmaster Tools
- [ ] Add Google Analytics verification
- [ ] Create XML sitemap index (if needed for >50,000 URLs)
- [ ] Set up Google Analytics 4 goals for conversions

---

## Step 7: Monitor Progress

### Week 1:
- Check Google Search Console for crawl errors
- Verify sitemap was successfully processed
- Monitor index coverage (should show pages being indexed)

### Week 2-4:
- Search Google for: `site:foreignteer.com`
  - Should show all indexed pages
- Search for brand name: `Foreignteer`
  - Should appear in results
- Check Search Console "Performance" tab for impressions/clicks

### Month 2-3:
- Monitor rankings for keywords:
  - "Foreignteer"
  - "micro-volunteering"
  - "volunteer abroad short-term"
  - "volunteering experiences [city name]"

---

## Why You're Not Showing Up Yet

Common reasons for new sites:

1. **Not Submitted to Google**: Without Search Console submission, it can take weeks/months
2. **New Domain**: Brand new domains take 2-4 weeks to index
3. **No Backlinks**: Google may not have discovered your site yet
4. **Low Authority**: New sites need time to build trust

**Solution**: Follow Steps 1-4 above immediately!

---

## Expected Timeline

| Action | Timeline | Result |
|--------|----------|--------|
| Submit to Search Console | Day 1 | Verification complete |
| Submit Sitemap | Day 1 | Crawling begins |
| Request Indexing | Day 1 | Priority queue |
| **First pages indexed** | **24-48 hours** | Show in `site:foreignteer.com` |
| Brand name ranking | 1-2 weeks | Rank #1 for "Foreignteer" |
| Generic keywords | 2-3 months | Start ranking for volunteering terms |
| Established authority | 6-12 months | Competitive rankings |

---

## Quick Verification Commands

After setup, test these in Google:

```
site:foreignteer.com
```
**Expected**: Lists all indexed pages

```
"Foreignteer"
```
**Expected**: Your homepage appears #1

```
"micro-volunteering platform"
```
**Expected**: May appear on page 1-3 after a few months

---

## Files to Create (For Verification)

### 1. Google Search Console Verification File
Create: `/public/google[verification-code].html`
Content: (Google provides this)

### 2. Bing Webmaster Verification File
Create: `/public/BingSiteAuth.xml`
Content: (Bing provides this)

---

## Monitoring Tools (Free)

1. **Google Search Console**: Track indexing, rankings, traffic
2. **Google Analytics**: Track user behavior
3. **Bing Webmaster Tools**: Secondary search engine
4. **Ubersuggest** (free tier): Keyword research
5. **AnswerThePublic**: Find content ideas

---

## Need Help?

### If pages aren't indexing after 1 week:
1. Check Google Search Console "Coverage" report for errors
2. Verify robots.txt isn't blocking Google
3. Check for duplicate content issues
4. Ensure all pages are linked from homepage/sitemap

### If brand name doesn't rank:
1. Add more content mentioning "Foreignteer"
2. Get social media profiles indexed
3. Create profiles on volunteer directories
4. Ask NGO partners to link to your site

---

## Priority Actions (Do Today!)

1. ✅ **Submit site to Google Search Console** (30 minutes)
2. ✅ **Submit sitemap** (5 minutes)
3. ✅ **Request indexing for homepage** (2 minutes)
4. ✅ **Create/optimize social media profiles** (1 hour)
5. ✅ **Submit to Bing Webmaster Tools** (15 minutes)

**Total Time**: ~2 hours to get the ball rolling!

---

## Success Metrics

After 1 month, you should see:
- ✅ 20-50 pages indexed
- ✅ Brand name ranking #1
- ✅ 50-100 impressions/day in Search Console
- ✅ 5-10 organic clicks/day

After 3 months:
- ✅ 100-200 pages indexed (blog + experiences)
- ✅ Ranking for 20-30 keywords
- ✅ 500-1000 impressions/day
- ✅ 50-100 organic clicks/day

---

## Important Notes

⚠️ **Don't**: Buy backlinks, use black-hat SEO, or spam
✅ **Do**: Create quality content, build real relationships, engage authentically

Google rewards sites that provide genuine value to users. Your platform already does this - now just help Google discover it!

**Questions?** Check Google's official guide: https://developers.google.com/search/docs/beginner/seo-starter-guide
