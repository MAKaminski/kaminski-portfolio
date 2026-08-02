# 📊 Comprehensive Analytics Setup Guide

## 🦔 PostHog

PostHog is the primary product-analytics tool for the site.

### ⚠️ Required setup — one environment variable

Set **`REACT_APP_POSTHOG_KEY`** in the Vercel project settings (Settings →
Environment Variables) to the PostHog *Project API key* (`phc_…`, found under
Project settings in PostHog), then **redeploy**.

Without it PostHog is skipped entirely and the site records nothing — the
browser console logs a warning saying so. Create React App inlines
`REACT_APP_*` variables at **build** time, so adding the variable only takes
effect on the next deploy.

### Why posthog.com used to show nothing

The site had never shipped the PostHog SDK. Only Google Analytics (gated behind
`REACT_APP_GA_MEASUREMENT_ID`, which isn't set) and Vercel Analytics were
wired up, and the site's conversion events imported `track` directly from
`@vercel/analytics`, so they only ever reached Vercel. There was no ingestion
problem to debug — nothing was sending.

### What's captured now

| Source | Events |
| --- | --- |
| Automatic (`posthog-js`) | `$pageview` on every route change, `$pageleave`, `$autocapture` clicks/inputs, `$rageclick`, `$dead_click`, `$web_vitals`, `$exception` |
| `src/utils/track.ts` | `Calendar Link Clicked`, `Resume Downloaded`, `Contact Form Submission`, `Contact Email Clicked`, `Role Page Visited` — mirrored to Vercel Analytics *and* PostHog |
| `src/hooks/useAnalytics.ts` | `scroll_depth`, `time_on_page`, plus the `trackEvent`/`trackUserInteraction` helpers |

SPA navigation is handled by `defaults: '2026-05-30'`, which sets
`capture_pageview: 'history_change'`. Without it PostHog would only record the
single pageview from the initial document load and every in-app navigation
(`/writing`, `/cfo`, `/products`, …) would be invisible.

### Adding a new tracked event

Import `track` from `src/utils/track.ts` — never from `@vercel/analytics`
directly, or the event will skip PostHog:

```typescript
import { track } from '../utils/track';

track('Newsletter Signup', { source: 'Footer' });
```

### Optional: reverse proxy

Ad blockers block requests to `us.i.posthog.com`, typically costing 10–30% of
events. `vercel.json` already contains same-origin rewrites under `/mk-relay`.
To route events through them, set in Vercel:

```
REACT_APP_POSTHOG_HOST=/mk-relay
```

Then redeploy and confirm events still arrive before relying on it. Note this
bills PostHog traffic as Vercel Fast Data Transfer.

### Verifying it works

1. `npm start` — `debug` is on in development, so every capture is logged to the
   browser console.
2. Check **Activity** in PostHog for live events.
3. Localhost events are ingested but excluded from dashboards by the project's
   "filter out internal and test users" setting.

### Troubleshooting

- **Still nothing after deploy** — check the browser console for the
  "`REACT_APP_POSTHOG_KEY` is not set" warning. `REACT_APP_*` variables are
  inlined at build time, so adding one in Vercel requires a redeploy.
- **Events in Activity but not on dashboards** — check the test-account filter
  and the date range.

## 🎯 What You'll Get (Google Analytics)

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