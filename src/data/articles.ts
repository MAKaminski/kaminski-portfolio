export interface Article {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO
  readMinutes: number;
  /** Optional ongoing series this post belongs to, e.g. "Shipping Log". */
  series?: string;
  /** 1-indexed position within the series. */
  seriesPart?: number;
  /** Author-controlled HTML body (rendered via dangerouslySetInnerHTML). */
  body: string;
}

export const articles: Article[] = [
  {
    slug: 'shipping-log-3-the-robot-that-journaled-in-triplicate',
    title: 'Shipping Log #3: Cleaning Up After a Diary That Got a Little Too Enthusiastic',
    description:
      'Shipping Log #3: turns out the devlog automation from Part 2 wrote about the same day three separate times without checking its own homework. Here is the cleanup, and the fix.',
    date: '2026-07-22',
    readMinutes: 4,
    series: 'Shipping Log',
    seriesPart: 3,
    body: `
<p>When we left off in <a href="/writing/shipping-log-2-a-diary-that-repeated-itself">Part 2</a>, I'd just
given this site a devlog and immediately watched it write the same first entry twice in one afternoon.
Today's episode is the sequel nobody wanted: it turns out that wasn't a one-time glitch, it was a habit.</p>

<h2>The audit</h2>
<p>Checking today's git log for material turned up nothing new — no commits since the SEO/AEO overhaul
that shipped on the 20th. Totally normal; not every day ships a feature. But digging into <em>why</em> the
devlog task kept finding "nothing new" so interesting, I found three separate open draft pull requests,
each proposing its own version of a "Shipping Log" / "Build Log" series, each recapping the identical SEO
overhaul, each blind to the other two. Three engineers' worth of near-identical scaffolding — a
<code>series</code> field here, a <code>seriesPart</code> there, an entire standalone page in one of
them — and not one of them checked whether the work had already been done.</p>

<h2>Why this happens</h2>
<p>It's the most boring bug in distributed systems, just wearing a content-writing costume: a job that
fires on a schedule assumed "I ran" meant "I should produce something," instead of first asking "does this
already exist?" Same failure mode as a retry that doesn't check for an existing transaction, or a
migration that doesn't check if the column's already there. The fix is never clever — it's just adding
the check nobody remembered to add.</p>

<h2>The cleanup</h2>
<p>So today's actual work was less "write a fun devlog" and more "reconcile three copies of the same
idea into one continuous story." That meant:</p>
<ul>
<li>Picking the cleanest schema (a simple <code>series</code> / <code>seriesPart</code> field) and
discarding the competing implementations.</li>
<li>Backfilling the missing chapters — Part 1 for the real work that started this whole story, Part 2 for
the day the diary was born (and immediately tripped over itself) — so the series reads in order instead
of starting mid-sentence.</li>
<li>Closing the redundant draft pull requests as superseded, so there's exactly one place this story
lives going forward.</li>
</ul>

<h2>The actual fix</h2>
<p>Before this task opens another pull request, it now has one job first: check whether an open,
unmerged "Shipping Log" PR already exists, and add to it instead of starting a new one. Boring, obvious,
and exactly the kind of guardrail that's invisible right up until the day it saves you from explaining
to your own reader why chapter one happened three times.</p>
`,
  },
  {
    slug: 'shipping-log-2-a-diary-that-repeated-itself',
    title: "Shipping Log #2: I Gave My Portfolio a Diary, and It Immediately Repeated Itself",
    description:
      "Shipping Log #2: the day after the big SEO overhaul, I built a devlog feature to write about it — and, without realizing it, built it again a few hours later.",
    date: '2026-07-21',
    readMinutes: 4,
    series: 'Shipping Log',
    seriesPart: 2,
    body: `
<p>Part 1 of this series covered the actual substance: an SEO/AEO overhaul that took this site from a D+
to something a search engine might actually respect. Today's entry is smaller and, in hindsight, funnier —
it's the day this site got a devlog feature, so it could write about days like that one.</p>

<h2>The idea</h2>
<p>Simple enough: add an optional <code>series</code> and <code>seriesPart</code> field to the
<code>Article</code> type, render a small badge on the Writing list and article header when a post
belongs to one, and start publishing short, honest recaps of whatever actually happened in this codebase
— including the boring days. Call it "Shipping Log." A handful of lines in a TypeScript interface, a
purple pill of a badge, done in an afternoon.</p>

<h2>The twist I didn't notice yet</h2>
<p>What I didn't clock at the time is that this exact idea — same series name, same badge concept, same
target files — had <em>already</em> been built once earlier that same day, in a separate branch, by the
same scheduled task, recapping the same SEO overhaul. Two implementations of one idea, running in
parallel, each with no visibility into the other. At the time it looked like a clean, self-contained
feature shipped end to end. It was actually round two of something that hadn't been checked in yet.</p>

<h2>Why this is worth writing down</h2>
<p>It's a small, harmless version of a mistake that gets very expensive at larger scale: build the thing
before checking if it already exists, or already got built by someone (or something) else working off the
same trigger. No harm done here — draft pull requests don't hurt anyone sitting unmerged — but it's the
same root cause that turns into duplicate database migrations, double-charged customers, or two teams
shipping the same integration in the same sprint.</p>

<p>I didn't catch this one myself, actually — it took a very reasonable "wait, did you just repost the
same article?" from the person actually reading this site to notice the pattern. Which is its own lesson:
automation can be diligent and still be wrong in a way only a human skimming the output will catch. More
on the cleanup in <a href="/writing/shipping-log-3-the-robot-that-journaled-in-triplicate">Part 3</a>.</p>
`,
  },
  {
    slug: 'shipping-log-1-my-portfolio-scored-a-d-plus',
    title: 'Shipping Log #1: My Portfolio Scored a D+, So I Rebuilt Its Whole Personality Before Lunch',
    description:
      'Shipping Log #1: the real work that kicked off this series — an SEO/AEO overhaul that took this site from an undifferentiated D+ to a focused, technically sound profile, in one sitting.',
    date: '2026-07-20',
    readMinutes: 5,
    series: 'Shipping Log',
    seriesPart: 1,
    body: `
<p>Every ongoing series needs an origin story, and this one starts with a report card nobody wants:
graded holistically against a nine-dimension rubric, this site scored a <strong>47 out of 100</strong>.
A D+. On a domain with a search-authority score of essentially zero. Time to do something about it.</p>

<h2>The diagnosis</h2>
<p>The content itself wasn't bad — it just wasn't differentiated, and the technical foundation
underneath it was quietly working against it. No structured data for search engines or AI crawlers to
latch onto, a robots.txt that predated the existence of AI crawlers, a homepage with fourteen competing
sections asking a recruiter to make fourteen decisions before deciding to stay, and a domain story split
across more than one canonical home.</p>

<h2>The fix, in one sitting</h2>
<p>The plumbing came first: per-route SEO metadata through a reusable <code>Seo</code> component, a stack
of JSON-LD schemas (<code>ProfilePage</code>, <code>Person</code>, <code>FAQPage</code>,
<code>BreadcrumbList</code>) so both search engines and AI assistants have something concrete to parse, an
<code>llms.txt</code> file as a plain-language elevator pitch for AI crawlers, and an updated robots.txt
that actually acknowledges the crawlers of this decade exist.</p>
<p>Then the less glamorous half: converting the image folder to WebP, splitting routes so the bundle
stops shipping code nobody asked for, consolidating everything onto one canonical domain with proper
redirects, and cutting the homepage from fourteen sections down to six. "Recruiter-first," it turns out,
mostly means giving a recruiter fewer places to get bored and close the tab.</p>

<h2>The repositioning</h2>
<p>Underneath the technical work was a sharper positioning decision: instead of trying to be
everything to everyone, the site now leads with one specific, under-saturated niche — a leader fluent in
both PE-grade finance and hands-on engineering. That's the actual story the SEO work exists to help
people find.</p>

<h2>The lesson</h2>
<p>The unglamorous 80% of a "content" overhaul is plumbing — redirects, schema, image formats, crawl
directives — and it's exactly the part that's easy to skip and expensive to skip. Nobody visits a
portfolio and marvels at a <code>BreadcrumbList</code> schema, but nobody thinks about an airplane engine
either, until it doesn't work. This series exists to keep a running account of days like this one — and,
as it turns out, the occasional day that wasn't quite like this one at all. More in
<a href="/writing/shipping-log-2-a-diary-that-repeated-itself">Part 2</a>.</p>
`,
  },
  {
    slug: 'fractional-cfo-vs-cto-early-fintech',
    title: 'Fractional CFO vs. Fractional CTO: Which Does Your Early Fintech Need First?',
    description:
      'A practical guide for fintech founders deciding between fractional CFO and CTO help — the signals that tell you which seat is actually on fire, and how to sequence the two.',
    date: '2026-07-20',
    readMinutes: 6,
    body: `
<p>Almost every early fintech founder I talk to asks a version of the same question: do I need a
finance leader or a technical leader next? For most companies the honest answer is "both, eventually"
— but you rarely have the budget or the org for both at once. So the real question is sequencing.</p>

<h2>Start with the seat that's actually on fire</h2>
<p>Ignore titles for a minute and look at where the risk is compounding. A fractional <strong>CFO</strong>
earns their keep first when you're raising, when a lender or sponsor is about to diligence you, when
your unit economics are murky, or when revenue recognition and compliance (ASC 606, SOC 2, PCI, state
lending rules) are becoming board-level questions. A fractional <strong>CTO</strong> earns their keep
first when architecture decisions are being made that you'll live with for years, when velocity has
stalled, when security/reliability incidents are appearing, or when you're hiring engineers faster than
anyone is steering them.</p>

<h2>Fintech blurs the line more than most industries</h2>
<p>Here's the wrinkle unique to fintech: the finance and the engineering are the same system. Your
ledger <em>is</em> your product. A "finance" decision about how you recognize interest income or reserve
for credit losses is also a data-model decision your engineers have to implement correctly. That's why
in fintech the worst outcome is a CFO and a CTO who can't speak each other's language — you get a
beautiful model that the platform can't produce, or a fast platform that can't survive an audit.</p>

<h2>A simple sequencing framework</h2>
<ul>
<li><strong>Pre-product / pre-revenue:</strong> usually technical first. Get the architecture and the
data model right; a fractional CFO can wait until there are real numbers to manage.</li>
<li><strong>Raising or lending imminent:</strong> finance first. You need clean models, a defensible
cap table, and diligence-ready books before money is on the line.</li>
<li><strong>Scaling with real revenue:</strong> whichever function is the current bottleneck — but bias
toward the one that reduces existential risk (compliance, security, runway) over the one that adds
convenience.</li>
</ul>

<h2>The case for one operator who does both, part-time</h2>
<p>For companies at the $0–100MM revenue stage, the cleanest answer is often a single fractional operator
who is bilingual — someone who can build the financial model a sponsor expects <em>and</em> read the code
that produces the numbers. It removes the translation layer, it's cheaper than two hires, and it forces
finance and engineering to stay coherent. That's the intersection I work in.</p>

<p>If you're weighing this decision for your company, I'm happy to be a sounding board —
<a href="https://calendly.com/kaminski1337/15min">grab 15 minutes</a>.</p>
`,
  },
  {
    slug: 'quality-of-earnings-for-fintech-founders',
    title: 'Quality of Earnings, Explained for Fintech Founders',
    description:
      'What a Quality of Earnings (QoE) analysis actually looks at, why fintech QoE is different, and how founders can be ready before a buyer or lender runs one.',
    date: '2026-07-18',
    readMinutes: 7,
    body: `
<p>If you're heading toward a raise, a sale, or a credit facility, someone is going to run a Quality of
Earnings analysis on your business. Founders often hear "QoE" and picture a normal audit. It isn't. An
audit asks "are these numbers correct?" A QoE asks a sharper question: <strong>"how much of this
profit is real, repeatable, and transferable?"</strong></p>

<h2>What a QoE actually digs into</h2>
<ul>
<li><strong>Revenue quality:</strong> Is it recurring or one-time? Concentrated in a few customers?
Recognized correctly under ASC 606? For a lender, is the interest income durable or juiced by a vintage
that hasn't seasoned yet?</li>
<li><strong>EBITDA adjustments:</strong> Which "add-backs" are legitimate (truly one-time) and which are
a founder trying to flatter the number? This is where most of the negotiation happens.</li>
<li><strong>Working capital:</strong> What's the normal level needed to run the business, so the buyer
isn't surprised post-close?</li>
<li><strong>Run-rate vs. reported:</strong> What does the business earn <em>going forward</em>, not what
it happened to report last year?</li>
</ul>

<h2>Why fintech QoE is its own animal</h2>
<p>In fintech, the "earnings" question collides with credit and accounting judgment. Loss reserves
(ASC 326 / CECL), the treatment of loan origination fees, how you account for a servicing asset, and the
seasoning of a loan book all move EBITDA materially — and they're all judgment calls a diligence team
will stress-test. A vintage of loans that looks profitable at month three can look very different at
month eighteen. If your data model can't slice performance by vintage, cohort, and product, you'll be
answering these questions manually under time pressure, and that erodes buyer confidence fast.</p>

<h2>How to be QoE-ready before anyone asks</h2>
<ul>
<li>Keep a clean, monthly-close discipline with a documented revenue-recognition policy.</li>
<li>Maintain a defensible reserve methodology you can walk through, not just a plug.</li>
<li>Instrument your platform so cohort/vintage performance is a query, not a fire drill.</li>
<li>Pre-build your own "adjusted EBITDA" bridge — know your add-backs and be able to defend each one.</li>
<li>Reconcile your product/ledger data to your financials <em>continuously</em>, not at year-end.</li>
</ul>

<p>The founders who sail through QoE are the ones whose finance and engineering were built together, so
the numbers a diligence team asks for already exist in the system. If you want a pre-diligence read on
where your story is strong and where it's thin, <a href="https://calendly.com/kaminski1337/15min">let's
talk</a>.</p>
`,
  },
  {
    slug: 'why-your-fintech-cfo-should-read-the-codebase',
    title: "Why Your Fintech's CFO Should Be Able to Read the Codebase",
    description:
      "In fintech the ledger is the product. A finance leader who can read the code that produces the numbers removes the most expensive translation layer in the company.",
    date: '2026-07-15',
    readMinutes: 5,
    body: `
<p>In most industries, finance and engineering can operate as separate worlds connected by a monthly
data export. In fintech, that separation is a liability — because the thing engineering builds and the
thing finance reports on are <em>the same object</em>. Your ledger is your product.</p>

<h2>The translation tax</h2>
<p>When a CFO can't read the system, every finance question becomes a ticket. "Why did net interest
income drop 4%?" becomes a week of back-and-forth: finance describes what they see, engineering guesses
at the cause, an analyst runs a one-off query, and the answer arrives after the moment to act has
passed. Multiply that across a fast-moving fintech and the translation tax is enormous — not just in
time, but in decisions made blind.</p>

<h2>What changes when the CFO is technical</h2>
<ul>
<li><strong>Faster, better answers:</strong> the person accountable for the P&amp;L can trace a number to
its source in the data model instead of waiting on someone else.</li>
<li><strong>Correct-by-construction accounting:</strong> revenue recognition, fee amortization, and loss
reserves get implemented right the first time because finance is in the design conversation, not
downstream of it.</li>
<li><strong>Credible diligence:</strong> when a buyer or regulator asks how a number is produced, the
answer is precise, not hand-wavy.</li>
<li><strong>Cheaper org:</strong> you need fewer heroic analysts stitching finance and product together
by hand.</li>
</ul>

<h2>This isn't about the CFO writing production code</h2>
<p>It's about fluency. A finance leader doesn't need to ship features — they need to read a schema,
follow a query, understand how the platform books an event, and hold a real conversation with engineers
about trade-offs. That fluency is rare, and in fintech it's worth a premium, because it collapses the
most expensive gap in the company.</p>

<p>I built my career at exactly this intersection — PE-grade finance and hands-on engineering. If that's
the gap in your team, <a href="https://calendly.com/kaminski1337/15min">let's talk</a>.</p>
`,
  },
];

export const getArticle = (slug: string): Article | undefined =>
  articles.find((a) => a.slug === slug);
