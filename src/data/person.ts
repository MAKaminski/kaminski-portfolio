/**
 * The canonical Person entity for this site.
 *
 * Why this exists: the head terms in this niche ("fractional CFO Atlanta" and
 * friends) are held by agencies and directories with far more domain authority
 * than one person's portfolio — 1CFO, McCracken Alliance, Treetop, CFO Recruit
 * and similar own that SERP. Competing there head-on is not winnable.
 *
 * What *is* winnable is entity clarity. Answer engines pick who to cite based
 * on how unambiguously they can identify a person and what they're an
 * authority on, not on domain rating. So the strategy is a single, precise,
 * well-linked Person entity whose `knowsAbout` is specific enough to be a
 * citation handle, plus FAQ content answering the questions this site's actual
 * buyers ask.
 */
import { skillCategories, specializedAreas } from './skills';

export const SITE_URL = 'https://www.michael-kaminski.io';

/**
 * Topics to be cited for. Deliberately specific — "Finance" is too broad to
 * earn a citation; "ASC 326 (Credit Losses / CECL)" is a handle.
 *
 * Built from the same data the /skills page renders, so the claim and the
 * evidence can never drift apart.
 */
export const knowsAbout: string[] = Array.from(
  new Set([
    // The positioning itself, stated as topics.
    'Fintech finance and engineering leadership',
    'Fractional CFO services',
    'Fractional CTO services',
    'Payments and lending systems',
    'PE-sponsor reporting',
    'Quality of earnings analysis',
    // Domain depth — the most distinctive part of the profile.
    ...specializedAreas.flatMap((area) => [area.title, ...area.items]),
    // Category-level technical breadth.
    ...skillCategories.map((c) => c.title),
    // Named technologies that are genuinely differentiating in this niche.
    ...skillCategories
      .filter((c) =>
        [
          'Fintech & Payments Infrastructure',
          'ERP & Financial Systems',
          'AI, LLMs & Agents',
          'Data & Analytics Engineering',
        ].includes(c.title)
      )
      .flatMap((c) => c.skills),
  ])
);

/**
 * Serves Atlanta *and* the US remotely — the site previously read as
 * Atlanta-only, which quietly excluded every remote search.
 */
const areaServed = [
  { '@type': 'City', name: 'Atlanta', addressRegion: 'GA', addressCountry: 'US' },
  { '@type': 'Country', name: 'United States' },
];

export const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE_URL}/#person`,
  name: 'Michael Kaminski',
  url: SITE_URL,
  image: `${SITE_URL}/og-image.jpg`,
  jobTitle: ['Fractional CFO', 'Fractional CTO', 'Fintech Product & Engineering Leader'],
  description:
    'Atlanta-based fintech leader fluent in both PE-grade finance and hands-on software engineering. 20+ years across payments, lending and PE-backed operating roles. Available fractionally or full-time, in Atlanta or remote across the US.',
  email: 'mailto:mkaminski1337@gmail.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Atlanta',
    addressRegion: 'GA',
    addressCountry: 'US',
  },
  homeLocation: { '@type': 'Place', name: 'Atlanta, Georgia, United States' },
  knowsAbout,
  hasOccupation: [
    {
      '@type': 'Occupation',
      name: 'Chief Financial Officer',
      occupationalCategory: '11-3031.00', // O*NET: Financial Managers
      occupationLocation: areaServed,
    },
    {
      '@type': 'Occupation',
      name: 'Chief Technology Officer',
      occupationalCategory: '11-3021.00', // O*NET: Computer and Information Systems Managers
      occupationLocation: areaServed,
    },
  ],
  alumniOf: [
    { '@type': 'CollegeOrUniversity', name: 'Georgia State University' },
    { '@type': 'CollegeOrUniversity', name: 'DeVry University' },
  ],
  sameAs: [
    'https://www.linkedin.com/in/michaelxaxkaminski',
    'https://github.com/MAKaminski',
  ],
};

/**
 * FAQ content aimed at the four groups who actually hire this profile:
 * recruiters, executives hiring peers, PE firms staffing portfolio companies,
 * and founders. Phrased as the questions they type, and answered only with
 * claims already made elsewhere on the site.
 */
export const hiringFaqs: { question: string; answer: string }[] = [
  {
    question: 'Can one person really cover both CFO and CTO?',
    answer:
      'For companies between roughly $0 and $100MM in revenue, yes — and in fintech it is often better, because the ledger is the product. Michael Kaminski has held both finance roles (Home Depot treasury, HD Supply strategic finance, KPMG advisory) and engineering/product roles (GreenSky, Momnt, Fyxed), and still ships production code. At larger scale the roles should split; the value of the combination is in the stage where finance and engineering decisions are the same decision.',
  },
  {
    question: 'Is he available remotely, or Atlanta only?',
    answer:
      'Both. He is based in Atlanta, Georgia and works on-site or hybrid there, and works remotely with companies anywhere in the United States.',
  },
  {
    question: 'What does a PE firm get from a finance-plus-engineering operator?',
    answer:
      'One person who can produce the reporting the sponsor expects — normalized EBITDA, quality of earnings, working capital, board packages — and then change the systems that produce those numbers. That removes the usual gap between a finance team asking for data and an engineering team scheduling it, which is where most portfolio-company reporting timelines are lost.',
  },
  {
    question: 'What kinds of companies is this profile the best fit for?',
    answer:
      'Fintech, payments, lending, digital banking and vertical SaaS companies between $0 and $100MM in revenue — particularly PE-backed or venture-backed businesses preparing for diligence, a raise, or a reporting overhaul, and founders who need senior finance and technical leadership without two full-time executive hires.',
  },
  {
    question: 'Is he open to full-time executive roles, or only fractional work?',
    answer:
      'Both. He takes fractional CFO/CTO engagements and is open to full-time executive roles — CFO, CTO, CPO or VP — at companies in that revenue range.',
  },
  {
    question: 'What transaction experience does he bring?',
    answer:
      'Over $10.8B in transactions across IPO readiness (S-1), acquisitions and M&A advisory, divestitures, share repurchase programs, asset-based lending and non-mortgage asset-backed securitization (144A), plus equity and debt capital markets work.',
  },
];

export const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: hiringFaqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
};

/**
 * Homepage FAQ. Previously lived as static JSON-LD in public/index.html —
 * but that shell is served for every route, so /skills, /writing and every
 * other page were each claiming these homepage answers as their own FAQ.
 * Scoped to "/" now.
 */
export const homeFaqs: { question: string; answer: string }[] = [
  {
    question:
      'Who is Michael Kaminski?',
    answer:
      'Michael Kaminski is an Atlanta-based fintech leader who is bilingual in finance and engineering — he pairs PE-grade financial expertise (FP&A, treasury, quality of earnings, M&A) with hands-on software engineering and product leadership. His career spans GreenSky, Home Depot, HD Supply, KPMG, and multiple fintech startups.',
  },
  {
    question:
      'What makes Michael Kaminski\'s background unusual for a fintech leader?',
    answer:
      'Very few fintech leaders can operate credibly on both sides of the table. Michael can build the financial models a private-equity board expects and write and architect the software that ships the product — an uncommon finance-plus-engineering combination in the Atlanta fintech market.',
  },
  {
    question:
      'Is Michael Kaminski available for fractional CFO or CTO work?',
    answer:
      'Yes. Michael advises founders and PE-backed fintech, payments, and SaaS companies as a fractional CFO/CTO and product-and-engineering leader, and is open to full-time executive roles. He is based in Atlanta, GA and works on-site, hybrid, or remote.',
  },
];

export const homeFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: homeFaqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
};
