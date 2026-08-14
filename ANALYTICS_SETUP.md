# 📊 Comprehensive Analytics Setup Guide

## PostHog — how it's wired (read this first)

PostHog is the primary product-analytics destination. The SDK is initialized in
`src/utils/posthog.ts` from `src/index.tsx`, before React renders, so the
session's first `$pageview` isn't lost to a race with mounting.

**`REACT_APP_POSTHOG_KEY` is required.** Set it in the Vercel project settings.
Without a usable value PostHog is skipped and the site records nothing — loudly,
via `console.error`, rather than in silence.

### Why the dashboard was empty

Two independent faults, both real. Fixing either alone would have left it empty:

1. **No SDK.** `posthog-js` was never a dependency and nothing called `init()`.
   The site only ever sent Vercel Analytics, so there was no ingestion problem to
   debug — nothing was being sent.
2. **A malformed environment variable.** `REACT_APP_POSTHOG_KEY` was set in
   Vercel to the literal string `REACT_APP_POSTHOG_KEY = phc_…` — the whole
   line from these instructions had been pasted into the value box. Adding the
   SDK on its own would have authenticated against a key that doesn't exist and
   dropped every event, with the dashboard looking exactly as empty as before.

`normalizeKey()` in `src/utils/posthog.ts` strips quotes and a leading `NAME =`
prefix, and requires the result to match `phc_…` before trusting it. **That
means the value currently in Vercel resolves correctly with no dashboard change**
— though setting it to the bare key is still worth doing, so the next reader
isn't misled.

The key is deliberately **not** committed. PostHog project keys are write-only
and public by design — the value ships to every visitor inside the JS bundle
regardless of where it comes from — but this repo runs GitGuardian, and a
hardcoded `phc_…` trips it on every pull request. Keeping the key in the
environment is the cheaper trade, given that the failure mode it reintroduces
(a missing variable) is now noisy and the one that actually bit this site (a
malformed variable) is handled.

### What gets captured

| Source | Events |
| --- | --- |
| `posthog-js` autocapture | clicks, inputs, `$pageview`, `$pageleave`, exceptions |
| `src/utils/track.ts` | `Book a Call`, `Resume Downloaded`, `Contact Form Submission` — fanned out to Vercel Analytics *and* PostHog |
| `src/hooks/useAnalytics.ts` | `scroll_depth`, `time_on_page`, `file_download`, `external_link_click` |

SPA route changes work because the SDK is initialized with
`defaults: '2026-05-30'`, which sets `capture_pageview: 'history_change'`.
Without it PostHog records only the initial document load and every in-app
navigation (`/writing`, `/cfo`, `/products`, …) is invisible.

`useAnalytics` had existed for a long time but was never mounted by anything, so
none of its behavioural tracking ran. `src/components/AnalyticsTracker.tsx`
mounts it inside the Router.

### Optional: the ad-blocker relay

`vercel.json` rewrites `/mk-relay/*` to PostHog's ingestion and asset hosts.
Setting `REACT_APP_POSTHOG_HOST=/mk-relay` routes events through this site's own
origin, which content blockers don't recognise — typically recovering 10–30% of
otherwise-dropped events. It is **off by default**: the direct host is the
known-good path, and a subtly wrong rewrite would break analytics entirely rather
than partially. The relay rewrites are ordered ahead of the SPA catch-all in
`vercel.json`, which is load-bearing — Vercel takes the first matching rewrite.

### Verifying after deploy

PostHog's "filter out internal and test users" setting is on for this project,
so localhost traffic stays out of the dashboards. Check
**Activity** (not Web Analytics) for the first events — Web Analytics rolls up on
a delay. In the browser console on the live site, `$pageview` requests should
appear as POSTs to `us.i.posthog.com`.

## 🎯 What You'll Get

With this enhanced analytics setup, you'll be able to track:

### **Visitor Information**
- ✅ **Who**: Geographic location, device type, browser info
- ✅ **Where**: Traffic sources (LinkedIn, Google, direct, etc.)
- ✅ **When**: Time spent on pages, session duration
- ✅ **How**: User journey, page flow, engagement patterns

### **User Behavior**
- ✅ **Button Clicks**: Resume downloads, calendar bookings, contact clicks
- ✅ **Page Interactions**: Scroll depth, time on page, section views
- ✅ **Form Interactions**: Contact form submissions, field interactions
- ✅ **External Links**: LinkedIn clicks, GitHub visits, email opens

### **Business Intelligence**
- ✅ **Conversion Tracking**: Resume downloads, calendar bookings
- ✅ **Content Performance**: Which sections are most engaging
- ✅ **Traffic Quality**: Bounce rate, session duration, return visitors
- ✅ **Geographic Insights**: Where your opportunities are coming from

## 🚀 Setup Instructions

### **Step 1: Create Google Analytics 4 Property**

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Start measuring"
3. Create a new property for your portfolio
4. Get your **Measurement ID** (starts with "G-")

### **Step 2: Update Configuration**

Replace the placeholder in `src/App.tsx`:

```typescript
// Replace 'G-XXXXXXXXXX' with your actual Google Analytics Measurement ID
initGA('G-XXXXXXXXXX');
```

### **Step 3: Deploy and Test**

1. Deploy your site to Vercel
2. Visit your site and interact with it
3. Check Google Analytics Real-Time reports
4. Access your analytics dashboard at `/analytics`

## 📈 What You Can Track

### **Automatic Tracking**
- Page views and navigation
- Geographic location
- Device and browser information
- Traffic sources
- Session duration
- Scroll depth (25%, 50%, 75%, 100%)
- Time on page

### **Custom Events**
- Resume downloads
- Calendar link clicks
- Contact form interactions
- Role page visits (CFO, CPO, etc.)
- External link clicks
- Section visibility

### **Enhanced User Data**
- Referrer information
- User agent details
- Screen resolution
- Language preferences
- Timezone data

## 🔍 How to View Your Data

### **Option 1: Google Analytics Dashboard**
1. Go to [Google Analytics](https://analytics.google.com/)
2. Navigate to your property
3. Check these reports:
   - **Real-Time**: Live visitor activity
   - **Audience**: Who your visitors are
   - **Acquisition**: Where traffic comes from
   - **Behavior**: What visitors do on your site
   - **Events**: Custom interactions you've set up

### **Option 2: Custom Analytics Dashboard**
1. Visit `yourdomain.com/analytics`
2. View comprehensive data in a custom interface
3. Filter by time ranges (1d, 7d, 30d, 90d)

### **Option 3: Google Analytics API (Advanced)**
For real-time data integration, you can connect the Google Analytics API to your dashboard.

## 🎯 Key Metrics to Monitor

### **Traffic Quality**
- **Bounce Rate**: Should be < 50% for good engagement
- **Session Duration**: > 2 minutes indicates interest
- **Pages per Session**: > 2 pages shows exploration

### **Conversion Tracking**
- **Resume Downloads**: Direct interest in hiring
- **Calendar Bookings**: Serious inquiries
- **Contact Form Submissions**: Active engagement

### **Content Performance**
- **Most Visited Pages**: Which roles are most popular
- **Scroll Depth**: How engaged visitors are
- **Time on Page**: Content effectiveness

### **Traffic Sources**
- **LinkedIn**: Professional network effectiveness
- **Direct**: Brand recognition
- **Google**: SEO performance
- **GitHub**: Technical community interest

## 🔧 Advanced Features

### **Enhanced Tracking Functions**

```typescript
// Track specific user interactions
trackButtonClick('Resume Download', 'Hero Section', { 
  userType: 'recruiter',
  source: 'LinkedIn' 
});

// Track form interactions
trackFormInteraction('Contact Form', 'submission', {
  hasEmail: true,
  hasMessage: true
});

// Track file downloads
trackFileDownload('Resume.pdf', 'PDF', 'Hero Section');

// Track external links
trackLinkClick('https://linkedin.com/in/michaelxaxkaminski', 'LinkedIn Profile', 'Header');
```

### **Privacy Compliance**
- All tracking is anonymized
- No personal information is collected
- GDPR-compliant implementation
- Users can opt-out via browser settings

## 📊 Sample Data You'll See

### **Visitor Demographics**
- Geographic distribution (US, UK, Canada, etc.)
- Device types (Desktop 68%, Mobile 28%, Tablet 4%)
- Browser preferences (Chrome, Safari, Firefox)

### **Traffic Sources**
- Direct traffic (45%)
- LinkedIn (19%)
- Google search (15%)
- GitHub (10%)
- Other sources (11%)

### **User Behavior**
- Average session duration: 3 minutes
- Most popular page: Homepage (37%)
- Highest engagement: CFO page (67% scroll depth)
- Most downloaded: Resume (45 downloads)

### **Conversion Data**
- Resume download rate: 5.1%
- Calendar booking rate: 2.6%
- Contact form completion: 3.8%

## 🚨 Troubleshooting

### **No Data Appearing**
1. Check Measurement ID is correct
2. Verify site is deployed and live
3. Wait 24-48 hours for data to populate
4. Check browser console for errors

### **Events Not Tracking**
1. Ensure tracking functions are called
2. Check Google Analytics Real-Time reports
3. Verify no ad blockers are interfering
4. Test in incognito mode

### **Dashboard Not Loading**
1. Check `/analytics` route is accessible
2. Verify all dependencies are installed
3. Check browser console for errors
4. Ensure proper build and deployment

## 📞 Support

If you need help with:
- Google Analytics setup
- Custom event tracking
- Data interpretation
- Dashboard customization

Contact me at mkaminski1337@gmail.com

---

**Next Steps:**
1. Set up Google Analytics 4 property
2. Update Measurement ID in code
3. Deploy and test tracking
4. Monitor data for insights
5. Optimize based on findings 