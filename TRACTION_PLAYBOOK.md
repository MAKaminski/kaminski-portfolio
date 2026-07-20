# Traction Playbook — michael-kaminski.io

The site is technically strong, but at Domain Rating 0 rankings come from **measurement +
off-page authority + a publishing cadence**, not more on-page tweaks. This is the do-it list.
Positioning to keep consistent everywhere: **"Fintech Finance & Engineering Leader — Atlanta.
Fluent in both PE-grade finance and hands-on software engineering."**

Canonical URL: `https://www.michael-kaminski.io` · Email: `mkaminski1337@gmail.com` ·
LinkedIn: `linkedin.com/in/michaelxaxkaminski` · GitHub: `github.com/MAKaminski` ·
Calendly: `calendly.com/kaminski1337/15min`

---

## 1. Measurement (do this first — 30 min, unlocks everything)
1. **Google Search Console** — add property for `https://www.michael-kaminski.io`. Verify via DNS TXT
   (preferred) or paste the `google-site-verification` meta into `public/index.html` (placeholder
   comment is already there). Then **Sitemaps → submit `sitemap.xml`** and **URL Inspection → Request
   indexing** for the homepage + each role page.
2. **Bing Webmaster Tools** — same; you can import from GSC in one click. (Bing feeds ChatGPT search.)
3. **GA4** — create a property, copy the `G-XXXXXXXXXX` Measurement ID, and set it in Vercel:
   Project → Settings → Environment Variables → `REACT_APP_GA_MEASUREMENT_ID` = your ID → redeploy.
   (The code already reads this and only fires when it's set.)

## 2. Domain consolidation (already coded)
`vercel.json` now 301-redirects `michaelkaminski.com`, `www.michaelkaminski.com`, and the apex
`michael-kaminski.io` → `https://www.michael-kaminski.io`. In Vercel → Domains, make sure
`www.michael-kaminski.io` is the **Primary** domain and the others are attached (so the redirects fire
and link authority consolidates to one host). **Disconnect the stale Cloudflare Workers build** while
you're in dashboards (Workers & Pages → kaminski-portfolio → Settings → Builds → Disconnect).

## 3. High-authority profiles (backlinks + LLM entity resolution) — same bio everywhere
Create/update and link back to the site on each. Consistency of name/title/city/photo is what makes
Google and LLMs treat these as one entity:
- [ ] **LinkedIn** — headline + About (below), add site to Contact info + a **Featured** link/card.
- [ ] **GitHub profile README** (github.com/MAKaminski) — short bio + site link.
- [ ] **Crunchbase** person profile.
- [ ] **Wellfound / AngelList** (angel + operator).
- [ ] **About.me** and **Polywork**.
- [ ] Fractional-exec marketplaces: **Go Fractional, Continuum, Chief (if eligible), Toptal, Fractionals United, GrowthMentor**.
- [ ] **Clutch / UpCity** (advisory listing).
- [ ] **Atlanta local**: Atlanta Tech Village member directory, Hypepotamus, Startup Atlanta, ATDC network, Atlanta FinTech meetup / Fintech Atlanta.

## 4. Paste-ready copy

**LinkedIn headline (pick one):**
- `Fintech Finance & Engineering Leader | Fractional CFO/CTO | Atlanta | Fluent in the boardroom and the codebase`
- `I build the financial model the board expects and the software that ships the product | Fintech CFO/CTO — Atlanta`

**LinkedIn / bio (short — directories):**
> Michael Kaminski is an Atlanta-based fintech leader fluent in both PE-grade finance and hands-on
> software engineering — a rare combination. Over 20+ years across GreenSky, Home Depot, HD Supply,
> KPMG and fintech startups, he's built the financial models private-equity boards expect and shipped
> the software that runs the product. Available for fractional CFO/CTO and product/engineering
> leadership. michael-kaminski.io

**Bio (one-liner — Twitter/GitHub):**
> Fintech CFO/CTO in Atlanta. Finance + engineering, bilingual. Fractional & advisory. michael-kaminski.io

**LinkedIn "Featured" blurb:**
> My portfolio → the finance × engineering intersection, quantified: $10.8B+ in transactions,
> GreenSky/Home Depot/HD Supply, and the fintech products behind them. michael-kaminski.io

## 5. Publishing cadence (the #1 traffic driver)
Post on LinkedIn **2–3×/week**; repurpose the best ones as site articles (see `/writing` follow-up) with
a canonical link back. Content pillars that match the niche and earn long-tail search + links:
- "Fractional CFO vs CTO for an early fintech — which do you actually need first?"
- "Quality of Earnings, explained for fintech founders raising a round."
- "Why your fintech's CFO should be able to read the codebase."
- "What a $4B share-repurchase taught me about treasury discipline at a startup."
- "ASC 606 / 326 gotchas that bite fintech lenders."
- Atlanta-fintech angle: "The Atlanta fintech operator's stack."

## 6. Outreach / DM templates

**Founder / PE portfolio (fractional):**
> Hi {name} — I lead at the finance × engineering intersection for fintechs: I can stand up the
> FP&A/board reporting a sponsor expects *and* work directly with your engineers on the product. If
> {company} is between a full-time CFO/CTO hire, a fractional arrangement might fit. 15 min?
> calendly.com/kaminski1337/15min

**Recruiter / exec search:**
> Hi {name} — Atlanta-based fintech CFO/CTO, 20+ yrs (GreenSky, Home Depot, HD Supply, KPMG),
> equally comfortable in board reporting and in the codebase. Open to the right full-time exec role.
> Portfolio + resume: michael-kaminski.io

**Podcast / guest post pitch (earns a backlink):**
> Hi {name} — I'm a fintech operator who's bilingual in PE-grade finance and engineering. Happy to
> come on / write about {topic: fractional leadership, QoE for founders, fintech treasury}. Recent
> writing: michael-kaminski.io/writing

## 7. Measure & iterate (weekly, 15 min)
- GSC → Performance: which queries get impressions? Pointing at which pages? Add/expand content for
  the ones ranking 8–20 (the "almost there" wins).
- GA4 → which pages convert to Calendly/resume clicks. Double down on those.
- Re-request indexing after each new article; re-share on LinkedIn.

---
*Everything in §1–§3 and §7 is ops on external platforms (only you can do them). §2 and the site
changes are already in the repo. §4–§6 is copy you can paste as-is.*
