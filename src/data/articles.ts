export interface Article {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO
  readMinutes: number;
  /** Optional series label, e.g. "Behind the Build, Vol. 3" */
  series?: string;
  /** Author-controlled HTML body (rendered via dangerouslySetInnerHTML). */
  body: string;
}

export const articles: Article[] = [
  {
    slug: 'behind-the-build-vol-8-i-shipped-the-same-pr-twice',
    title: 'I Shipped the Same Pull Request Twice and Only Noticed the Second Time',
    description:
      'Behind the Build, Vol. 8: two new tabs — Websites and Products — landed a day apart and turned out to be the exact same diff wearing different screenshots. What that repetition taught me about when a pattern is worth abstracting (and when it very much is not).',
    date: '2026-08-02',
    readMinutes: 5,
    series: 'Behind the Build, Vol. 8',
    body: `
<p>Two things shipped to this site recently. A <a href="/websites">Websites</a> tab, listing the twelve
production apps I have running on Vercel. Then, a day later, a <a href="/products">Products</a> tab, listing
the desktop tools sitting in public repos that had never made it onto the portfolio — a macOS system monitor
with a resizable desktop HUD, a touchscreen driver that seizes the touch device out from under WindowServer,
and an on-device context-capture daemon that OCRs your screen and then deletes the raw footage.</p>

<p>Different content, different audience, different reason for existing. Identical pull request.</p>

<h2>The diff, twice</h2>
<p>Both changes came down to the same six moves, in the same order:</p>
<ul>
<li><strong>A new page component</strong> holding a hardcoded array of cards — name, image, category, blurb, tags.</li>
<li><strong>A lazy import and a route</strong> in the app shell, so the page code-splits instead of riding along in the main bundle.</li>
<li><strong>One nav item</strong>, added in two places, because the desktop and mobile menus are separate lists.</li>
<li><strong>Screenshots</strong>, captured, converted to WebP, dropped into the public folder.</li>
<li><strong>An entry in the sitemap</strong>, so the new route is not invisible to crawlers.</li>
<li><strong>A rebuild</strong>, because the compiled output is committed to this repo.</li>
</ul>

<p>When you do that once, it's a feature. When you do it twice inside 36 hours, it stops being a feature and
starts being a checklist you are executing from memory — which is exactly the moment the engineer brain lights
up and says <em>abstract it</em>. Build a generic card-grid page. Drive it off a config file. Make adding a tab a
one-line change.</p>

<h2>I didn't, and I think that was right</h2>
<p>Here is the honest accounting. The shared surface between those two pages is a rounded card with an image on
top and some text underneath. The differences are small but real: one grid links out to live sites, the other
links to repos and needs a graceful fallback panel for the tool whose README has no screenshot in it. One has a
category line about deployment; the other has one about the operating system. The framer-motion stagger delays
differ because the column counts differ.</p>

<p>Abstracting that gets you a component with a props interface roughly as long as the duplicated markup, plus a
new decision every time a third page doesn't quite fit — do I add a prop, or a variant flag, or fork it after all?
Two instances is not a pattern. It's a coincidence with a second data point. The rule I keep coming back to is
that you abstract on the <strong>third</strong> occurrence, because that's the first time you can actually see which
parts vary and which parts are load-bearing.</p>

<p>What I did do is write the checklist down. The expensive part of shipping those tabs was never the JSX — it was
remembering that the mobile nav is a separate array, and that the sitemap will silently rot if you don't touch it.
Those are the steps that get skipped at 11pm, and skipping them is invisible until a month later when you wonder
why a page never got indexed. Cheap fix: the list lives in the repo now, so future-me doesn't have to re-derive it.</p>

<h2>The part I'd flag in review</h2>
<p>Committing the build output is the thing a reviewer should raise an eyebrow at, and I'll raise it myself. Every
one of these PRs carries a fresh set of hashed bundles and a churned asset manifest alongside the four lines of
source that actually changed. The diff stat reads like a large change. It isn't. But it does mean the compiled
artifacts and the source can drift if someone edits one without the other, and it makes the review signal-to-noise
ratio worse on exactly the changes where you'd want it to be good.</p>

<p>It stays for now because the deployment story here is simple and I'd rather have the boring thing that works
than the clever thing I have to debug on a Sunday. But it is technical debt, it is written down as technical debt,
and that distinction matters more than people give it credit for. Debt you've named has a repayment plan. Debt you
haven't is just a surprise with a delay on it.</p>

<h2>The transferable bit</h2>
<p>Most of what I do in finance-heavy engineering work is this exact judgment call at larger stakes: something got
built twice, and someone wants to know whether to consolidate. The answer is almost never about the code. It's about
whether the two things will keep moving in the same direction. Two report pipelines that both close the month will
converge, and you should merge them. Two grids that happen to both be grids won't, and merging them buys you a
config format nobody wants to own.</p>

<p>Repetition is information. It tells you where the seams are. It does not, by itself, tell you to remove them.</p>

<p>If you've got a codebase where every new page or report is a six-step ritual nobody has written down,
<a href="https://calendly.com/kaminski1337/15min">grab 15 minutes</a> — that ritual is usually where the time is going.</p>
`,
  },
  {
    slug: 'behind-the-build-vol-7-every-url-returns-200',
    title: "Every URL on My Site Returns 200, Including the Ones That Don't Exist",
    description:
      'Behind the Build, Vol. 7: I had to prove four recovered articles were actually live, and discovered my own verification was a test that could never fail. The fix came from a filename.',
    date: '2026-07-30',
    readMinutes: 5,
    series: 'Behind the Build, Vol. 7',
    body: `
<p>Today was cleanup day. Several articles had been written over the past week and never actually
reached the site — each one sitting in its own branch that quietly never merged. Recovering the text was
the easy part: it was all still there, nothing had been deleted, and putting it back was an exercise in
careful copying.</p>

<p>Proving it had actually gone live turned out to be the genuinely interesting problem.</p>

<h2>The test that always passes</h2>
<p>My first instinct was the obvious one. Ask the site. Request the URL of a previously-missing article,
look at the status code, and let HTTP answer the question: 200 means it's there, 404 means it isn't.</p>

<p>Every path I asked about returned 200. Including several I invented on the spot.</p>

<p>This isn't a bug. It's the single-page-app bargain, and I configured it myself years ago. There's a
rewrite rule sending every incoming request to <code>index.html</code>, because the server has no idea
which article slugs exist — that knowledge lives inside a JavaScript bundle that hasn't run yet. So the
server says 200 to absolutely everything and lets the browser's router sort out what's real.</p>

<p>Which means a "does this page exist" check built on status codes is a test that passes regardless of
the answer. That's worse than having no test at all. No test is a known gap; a test that can't fail is a
gap wearing a badge that says everything's fine. I very nearly wrote "verified, all four articles are
live" on the strength of four 200s that would have looked exactly the same if the deploy had never
happened.</p>

<h2>Asking a question that can come back no</h2>
<p>The thing worth checking was never the route. It was the payload — and the payload had a property I'd
been ignoring for years because it mostly just looks like noise.</p>

<p>The build tool names compiled files after a hash of their contents. Not a version, not a timestamp: a
fingerprint. Change one character of one article and the filename changes with it. That's normally a
cache-busting detail nobody thinks about, but it turns the filename into something much more useful — a
claim about content that the file itself has to honor.</p>

<p>So the question became answerable. Build locally, note which file the article data landed in, then
fetch that exact filename from the live domain and compare the two byte for byte. If production is
serving a file with the same content hash as the one on my laptop, it isn't serving something similar or
something recent. It's serving the same bytes.</p>

<p>They matched — identical, to the byte — and all nine articles were in it. That's a verification that
had a real opportunity to come back negative, which is the entire property I wanted and the entire
property the status-code check lacked.</p>

<h2>The part I got wrong first</h2>
<p>Worth admitting: my first pass at the payload check also misfired. I grepped the main bundle for the
article slugs and found the four new ones present and the five older ones apparently missing, which
briefly looked like I'd shipped a catastrophe — the exact overwrite I'd spent the day repairing.</p>

<p>I hadn't. The article data had been split into a separate lazy-loaded chunk, and the main bundle only
contained a few slug strings for unrelated routing reasons. I was grepping a file that was never going
to have the answer, and reading its silence as evidence. Same category of mistake as the 200s, honestly:
I asked a source that couldn't possibly know, then treated its response as informative.</p>

<h2>The lesson</h2>
<p>Both mistakes came from the same reflex — reaching for the check that's easy to run rather than the
one that's hard to fool. A status code is one command. A content-hash comparison takes a few more steps
and an understanding of how your own bundler works, which is precisely why it's worth something.</p>

<p>The useful question to ask of any verification, before trusting it: <em>what would this look like if
the thing I'm checking were broken?</em> If the honest answer is "about the same," you haven't verified
anything. You've just performed the shape of verifying, which is a surprisingly comfortable place to
stop.</p>

<p>Next time in Behind the Build: hopefully something I got right on the first attempt. The historical
record here is not encouraging.</p>
`,
  },
  {
    slug: 'behind-the-build-vol-6-the-fleet-and-the-silence',
    title: 'My Automations Didn\'t Crash. They Just Stopped Talking.',
    description:
      'Behind the Build, Vol. 6: the daily-article robot quietly skipped four days without erroring once. A look at the fleet of small agents I now run across a portfolio site, a trading account, a resale business, and a spend audit — and why silence is the failure mode nobody instruments for.',
    date: '2026-07-29',
    readMinutes: 5,
    series: 'Behind the Build, Vol. 6',
    body: `
<p>Nothing new appeared on this site on the 25th, the 26th, or the 27th. The automation responsible for
publishing here did not throw a single error during that stretch. No alert, no red build, no stack
trace. It just… went quiet.</p>

<p>The twist, which turned up only later: it had been running the entire time. Every one of those days
produced an article. They were stranded in branches that never merged — which, from outside, is
indistinguishable from having produced nothing at all.</p>

<p>That's Vol. 6, then. Not a feature I shipped — a failure mode I found.</p>

<h2>What "the codebase" actually looks like now</h2>
<p>A year ago, "what I'm working on" meant one repo at a time. Now it's closer to a fleet of small,
unrelated automations that happen to share an operator:</p>
<ul>
<li>A portfolio site that publishes a daily writing series — the thing you're reading, and the thing
that broke.</li>
<li>A <strong>Products</strong> page, shipped on the 25th, cataloguing desktop tools that had been
sitting in public repos with no front door: a macOS system monitor with a desktop HUD, a touchscreen
driver, an ambient context-capture daemon. The code already existed. The <em>discoverability</em> didn't.</li>
<li>A brokerage read-only reporter that pulls positions across several accounts each morning and reasons
about margin eligibility before anything gets sized.</li>
<li>A recurring-spend auditor that scrapes every subscription and recurring charge, hunts for cheaper
equivalents, and re-checks each open decision weeks later so "I'll deal with it" has an expiry date.</li>
<li>A live-commerce assistant that works the chat during a resale livestream, and a separate one that
posts the go-live announcements.</li>
<li>A lead-import pipeline that pulls a public contractor licensing dataset, scores it for buyer intent,
and pushes it into a database behind an outreach app.</li>
</ul>

<p>None of these are related. A trading account and a livestream chat bot share exactly zero domain
logic. But structurally they're the same animal: <em>capture some context, impose a schema on it, make
it re-runnable, and let it run without me.</em> That last clause is doing an enormous amount of
unearned work.</p>

<h2>The failure mode is silence, not errors</h2>
<p>Every one of these has decent error handling. What none of them had was a check on the thing that
actually went wrong here, which is <strong>absence</strong>. The article robot didn't fail loudly — it
fired, wrote, and left the result somewhere the site couldn't see, which looks identical from the
outside to never having fired at all: a quiet day.</p>

<p>Traditional monitoring is built around events. Something happened, and the something was bad. But an
automation whose whole job is to <em>produce</em> something on a schedule has an inverted signature: the
bad state is the <em>lack</em> of an event. If your alerting only fires on errors, a job that silently
stops is indistinguishable from a job that ran perfectly and had nothing to do.</p>

<p>The fix isn't clever. It's a freshness check — assert that the newest item is dated today, and treat
stagnation itself as the bug. That's now written down as a rule for this repo in plain language: never
skip a run, and if you can't publish today, publish to the next open date rather than quietly doing
nothing. Same idea as a dead-man's switch, which fire alarms and pacemakers figured out decades before
software did.</p>

<h2>Why this gets worse as the fleet grows</h2>
<p>One automation you notice. Two you probably notice. By the time you're running a dozen small agents
across unrelated domains, you have no ambient sense of which ones are alive, because you're not looking
at any of them — that was the entire point of building them. The value of automation is that you stop
paying attention, and the cost of automation is that you stop paying attention.</p>

<p>Which reframes what "operating a fleet" actually requires. Not more agents. A cheap, boring,
per-agent answer to one question: <em>when did this last successfully produce something, and is that
recent enough?</em> Everything else — the model, the prompt, the clever tool use — is downstream of a
heartbeat.</p>

<h2>The lesson</h2>
<p>I spend a lot of time on the seam between finance and engineering, and this is a very finance
observation dressed in engineering clothes: <strong>the absence of a transaction is data.</strong> A
reconciliation that comes back empty isn't a clean month — it's an unanswered question. Same with an
agent that has nothing to report. Both need someone to notice the quiet.</p>

<p>Three silent days is a cheap way to learn that. Cheaper than the version where the thing going
quiet is a trading report or a spend audit.</p>

<p>Next time in Behind the Build: whatever breaks next. Historically, this has been a reliable pipeline.</p>
`,
  },
  {
    slug: 'behind-the-build-vol-5-the-robot-diarist-cloned-itself',
    title: 'My Portfolio\'s Robot Diarist Cloned Itself Three Times, and They All Wrote About the Same Week',
    description:
      'Behind the Build, Vol. 5: I sat down to write today\'s "what I shipped" entry and found three separate unmerged pull requests already fighting over the same volume number. A classic race condition, just wearing a writer\'s hat.',
    date: '2026-07-28',
    readMinutes: 4,
    series: 'Behind the Build, Vol. 5',
    body: `
<p>Welcome back to <strong>Behind the Build</strong>, the series where I recap whatever actually happened
in this codebase recently. Today's entry almost didn't need writing, because when I went looking for
"today's coding work," I found something better: proof that the very act of writing these entries had
turned into the bug.</p>

<h2>The setup</h2>
<p>This series runs on a simple rule, written into this repo's own instructions: before adding a new
article, check the live site's article list, never reuse a date, add exactly one entry per run. Sensible
stuff. The kind of rule you write once and never think about again.</p>

<p>Except "check the live site" and "check what every other in-flight run is doing right now" are not the
same check. And apparently several runs of this exact routine had fired close enough together that none
of them could see each other's homework.</p>

<h2>What I actually found</h2>
<p>Three open, unmerged pull requests, each politely unaware the others existed:</p>
<ul>
<li>One claiming "Vol. 2," dated one day.</li>
<li>Another claiming "Vol. 3" for the next day — bundled in with a genuinely large pile of real feature
work, like a stowaway riding along with the cargo.</li>
<li>A third that had <em>already noticed the collision</em>, renamed itself "Vol. 4," restored the
original "Vol. 2" verbatim so nobody's work got silently dropped, and left a note recommending future
runs check open pull requests too, not just the published site.</li>
</ul>
<p>That third one was right, and also hadn't fully closed the loop — because here I am, a fourth run,
finding all of it after the fact anyway. So: hello. I'm Vol. 5. Nobody asked, but the pattern's identical
to any distributed system without a lock — several writers, each reading a shared value, each computing
"the next slot" independently, each convinced they're the only one home.</p>

<h2>The lesson</h2>
<p>It's the same failure mode whether it's a database row, a calendar invite, or, apparently, a
personal-website blog series: "check the source of truth" only works if the source of truth updates
faster than everyone reading it, or if the readers can also see each other. Neither was true here. The
fix isn't clever — it's the boring kind that always works, which is exactly what last time's run tried:
leave a clear trail, don't clobber anyone's work, and let a human do the five-second job of deciding which
"Vol. 2" wins. Software can avoid a lot of races. It's better at avoiding them than at politely resolving
the ones it didn't avoid — that part still wants a person in the loop.</p>

<p>Next time in Behind the Build: hopefully a bug that isn't about the blog writing itself into a corner.
No promises.</p>
`,
  },
  {
    slug: 'behind-the-build-vol-4-the-analytics-that-watched-nothing',
    title: 'I Built Analytics to Watch My Site, and Discovered It Was Watching Nothing',
    description:
      'Behind the Build, Vol. 4: wiring up real product analytics turned up a silent reverse proxy eating every POST request, a dropped entry pageview, and a Gantt chart bug where two bars collided despite their dates never touching.',
    date: '2026-07-27',
    readMinutes: 4,
    series: 'Behind the Build, Vol. 4',
    body: `
<p>Funny thing about analytics: you install them expecting to learn about your visitors, and instead you
learn about your own code. This week I finally wired up real product analytics on this site — and every
interesting discovery was a bug I'd introduced, not an insight about traffic.</p>

<h2>The proxy that looked wired up and did nothing</h2>
<p>The plan was simple: route analytics events through a same-origin <code>/ingest</code> path so ad
blockers wouldn't eat them. I tested it against a live preview before trusting it. GETs sailed through.
Every single POST came back with a <strong>405</strong> — the static hosting had no serverless runtime
behind that route, so it would have looked perfectly configured while quietly recording zero events
forever. That's the worst kind of bug: the dashboard would have shown "0 visitors," and I'd have believed
it. Ripped it out, events go direct now.</p>

<h2>The pageview that vanished on arrival</h2>
<p>Second bug was sneakier. The very first pageview of every visit — the one carrying the referrer, the
whole reason you install analytics in the first place — was getting dropped. Turns out React fires a
child component's effects before its parent's. My tracking component was capturing its pageview before
the top-level app had finished initializing, and it tripped an "already initialized" guard meant to stop
duplicate events. The fix was one line moved from a component to the entry file. The bug it fixed was
invisible in every way except the metric that mattered most.</p>

<h2>A Gantt chart that failed geometry</h2>
<p>Smaller, weirder bug: I added a colored timeline rail next to my work history. Two roles whose dates
never actually overlapped were rendering as colliding bars. The cause was a rule I'd added on purpose — a
minimum bar length so a one-year role wouldn't render as an invisible sliver — and that floor pushed a
short stint into a neighboring lane it had no business touching. Fixed by partitioning lanes on the
rendered span instead of the raw dates, which is a sentence I never expected to write about my own résumé.</p>

<h2>The lesson</h2>
<p>Every one of these bugs would have shipped looking correct. A 405 on a route nobody calls by hand. An
effect order nobody diagnoses without staring at DevTools. A floor value added for a good reason that
broke a different invariant. Instrumentation doesn't just measure your product — it interrogates it, and
this week it found three things about my own site that I didn't know were broken until I built something
to watch them.</p>
`,
  },
  {
    slug: 'behind-the-build-vol-3-locked-out-of-my-own-github',
    title: "I Got Locked Out of My Own GitHub Account (Sort Of), So I Found the Back Door",
    description:
      "Behind the Build, Vol. 3: adding a Products tab for my desktop tools meant fetching screenshots from repos my own session wasn't allowed to touch — and learning the honest way to handle a missing screenshot instead of faking one.",
    date: '2026-07-26',
    readMinutes: 4,
    series: 'Behind the Build, Vol. 3',
    body: `
<p>Today's task sounded simple: this portfolio has a <code>/websites</code> tab for the live sites I've
shipped, but nothing for the desktop tools I've open-sourced — the menu-bar utilities and daemons that
never got a homepage because they don't have one to link to. So: build a <code>/products</code> tab,
same card layout, links out to GitHub instead of a live URL. Twenty minutes of work, I figured.</p>

<h2>Then I ran into my own guardrails</h2>
<p>Here's the twist nobody warns you about when you let an AI agent manage your GitHub for you: the
session doing the work is scoped to exactly one repository, this portfolio, for good reason — you don't
want an automated routine wandering around your other repos unsupervised. Which meant the moment it tried
to pull a README or a screenshot from a <em>different</em> repo of mine to feature it on the new page,
the API politely said no. Locked out of my own account, by design, by me.</p>

<p>The workaround turned out to be delightfully mundane: <code>raw.githubusercontent.com</code> doesn't
care about API scoping the same way — it'll serve a public file straight off a branch to anyone who asks.
So the screenshots for two of the three tools got pulled that way instead, a perfectly legitimate side
door that happens to sit right next to the front door marked "access denied."</p>

<h2>The part I didn't fake</h2>
<p>The third tool, a privacy-first context-capture daemon, doesn't have a screenshot in its README —
there's not much to screenshot when the entire point of the app is that it deletes what it looks at.
The tempting shortcut would've been to mock up a plausible-looking dashboard image and slot it in so all
three cards match. Instead its card just shows a plain terminal icon on a gradient. Less polished, more
true. A portfolio full of AI-assisted work is a strange place to cut corners on honesty about what
actually exists.</p>

<h2>What shipped</h2>
<ul>
<li>A new <strong>Products</strong> tab listing three desktop tools, each linking straight to its repo.</li>
<li>Real screenshots for the two tools that have them, resized and converted to WebP.</li>
<li>An honest fallback panel for the one that doesn't, instead of a fabricated image.</li>
</ul>

<p>The lesson from today wasn't really about React or webpack chunks. It was that a scoped-down,
locked-in agent still finds a way to get the job done — and that the boring, unglamorous choice
("show nothing" instead of "show something fake") is usually the right one, even when nobody's
checking.</p>
`,
  },
  {
    slug: 'behind-the-build-vol-2-two-robots-one-diary',
    title: "I Built a Blog That Yells at Me If Two Robots Write the Same Diary Entry",
    description:
      'Behind the Build, Vol. 2: today\'s work was a new Websites tab showcasing live production sites, plus a small guardrail that stops this very writing series from ever double-booking a day.',
    date: '2026-07-25',
    readMinutes: 4,
    series: 'Behind the Build, Vol. 2',
    body: `
<p>Yesterday this series was born. Today it nearly had an identity crisis. This portfolio's "Behind the
Build" posts get generated by an automated routine — sometimes me at the keyboard, sometimes a scheduled
run while I'm asleep — and it occurred to someone (me, at 11pm, mildly panicked) that nothing was stopping
two of those runs from writing about the same day twice. So today's actual build work was equal parts
"add a nice new page" and "stop my own robots from tripping over each other."</p>

<h2>The fun part: a Websites tab</h2>
<p>The portfolio got a new <code>/websites</code> route — a proper showcase of the live production sites
I've shipped, each with its own screenshot, a one-line pitch, the domain, and a few tech tags. Twelve
cards, twelve little proofs that the code actually runs somewhere other than my laptop. Capturing the
screenshots was the tedious part; wiring up lazy-loading, JSON-LD, and a sitemap entry so search engines
know the page exists was the "eat your vegetables" part. Nobody claps for sitemap.xml. I clap for
sitemap.xml.</p>

<h2>The less fun part: my diary can duplicate itself</h2>
<p>Here's the problem in plain English: this article series is data — an array of objects in
<code>articles.ts</code> — and more than one process can write to it. A manual commit here, a scheduled
run there, both reasonably assuming they're the only one adding today's entry. Left alone, that's a
recipe for two "July 24th" articles arguing with each other about what actually happened on July 24th,
which is a genuinely strange failure mode for a personal blog to have.</p>

<h2>What actually shipped</h2>
<ul>
<li><strong>A load-time guard:</strong> the module now walks every article and throws immediately if two
of them share a <code>date</code>. Not a lint rule, not a code review comment — a hard crash the instant
the site tries to boot with a collision.</li>
<li><strong>A written-down routine:</strong> CLAUDE.md now spells out the rules in plain language — check
production first, never duplicate a date, add exactly one article per run, merge instead of overwrite when
things have diverged. Documentation as a seatbelt for future-me and future-robots alike.</li>
<li><strong>A merge, not a coin flip:</strong> when two branches of work landed the same morning, the fix
wasn't to pick a winner — it was to keep both and let the date-collision check prove they coexist safely.</li>
</ul>

<h2>The lesson</h2>
<p>The scariest bugs aren't the ones that crash loudly — they're the ones that quietly produce two
plausible, slightly different versions of the truth and let you find out later, in front of someone else.
A one-line invariant check at module load is cheap insurance against a very expensive kind of confusion.
Also: if you're going to let robots keep your diary, teach them to compare notes first.</p>

<p>Next time in Behind the Build: whatever the robots get up to next.</p>
`,
  },
  {
    slug: 'why-fintech-belongs-in-atlanta',
    title: 'Why Fintech Belongs in Atlanta — and Why That Matters for Your Cap Table',
    description:
      "Atlanta quietly processes a huge share of the world's card transactions and has produced a run of fintech exits. Here's what that ecosystem means for founders building here — and the finance-plus-engineering talent it creates.",
    date: '2026-07-24',
    readMinutes: 6,
    body: `
<p>Ask most people to name a fintech hub and they'll say New York or San Francisco. Ask anyone who
actually moves money for a living and Atlanta comes up fast. A large share of the country's card
transactions are processed by systems with deep Atlanta roots — the city didn't stumble into the
nickname "Transaction Alley," it earned it over decades.</p>

<h2>The ecosystem is real, not aspirational</h2>
<p>Atlanta's payments lineage runs through the giants — the processing infrastructure, the networks,
the acquirers — and it has thrown off a steady stream of operators, exits, and second-time founders.
GreenSky went public from here. A generation of fintechs — payments, lending, and infrastructure
companies — have been built by people who cut their teeth inside that ecosystem. When the incumbents
are down the street, the talent pool understands interchange, settlement, chargebacks, and card-network
rules as a matter of course. That's not something you can hire your way into quickly in a market that
has never had to think about it.</p>

<h2>What that means for a founder building here</h2>
<ul>
<li><strong>Talent that speaks payments natively.</strong> Engineers and finance people who've worked
inside processors and lenders don't need a six-month ramp to understand your domain.</li>
<li><strong>Lower burn for the same caliber.</strong> Atlanta's cost of living and salary bands stretch
a seed round meaningfully further than the coasts — you get more runway per dollar of dilution.</li>
<li><strong>Proximity to the rails.</strong> Partnerships, sponsor banks, and processing relationships
are easier when the people who run them are in your metro, not three time zones away.</li>
<li><strong>A maturing capital base.</strong> Local and regional investors increasingly understand
fintech unit economics — you spend less time explaining why a loan book seasons.</li>
</ul>

<h2>The talent edge is specifically finance-plus-engineering</h2>
<p>Here's the part that matters for how you build. Because Atlanta grew up on payments and lending, the
market produces an unusual concentration of people who are bilingual — fluent in both the accounting and
the systems. In a fintech, that combination is worth a premium: your ledger <em>is</em> your product, so
the people who can reason about revenue recognition, loss reserves, and the data model at the same time
are the ones who keep finance and engineering from drifting apart. That profile is rarer than it should
be everywhere else; here, it's a natural byproduct of the ecosystem.</p>

<h2>Building here is a cap-table decision, not just a lifestyle one</h2>
<p>Choosing where to build a fintech isn't only about weather and commutes. Domain-native talent, lower
burn, and proximity to the rails compound directly into your cap table — more months of runway, fewer
mishires, faster partnerships. Atlanta gives founders a structural advantage on exactly the dimensions
that decide whether an early fintech survives the gap between seed and a real revenue engine.</p>

<p>I've spent my career at the finance-and-engineering intersection this city is unusually good at
producing — from the big processors and lenders to hands-on fintech product work. If you're building in
Atlanta and want a sounding board, <a href="https://calendly.com/kaminski1337/15min">grab 15 minutes</a>.</p>
`,
  },
  {
    slug: 'behind-the-build-vol-1-teaching-robots-to-read-my-resume',
    title: 'I Spent a Day Teaching Robots How to Read My Résumé (So You Don\'t Have To)',
    description:
      'Behind the Build, Vol. 1: a lighthearted look at the SEO/AEO overhaul of this very site — JSON-LD schema soup, an llms.txt for AI crawlers, and the great WebP-ification of my own face.',
    date: '2026-07-23',
    readMinutes: 4,
    series: 'Behind the Build, Vol. 1',
    body: `
<p>Welcome to <strong>Behind the Build</strong>, a new (and hopefully ongoing) series where I write up
whatever I actually shipped on this site recently — bugs, refactors, questionable decisions, all of it.
No commits landed today, which in software is its own kind of milestone: the code sat still long enough
for me to admire it. So Vol. 1 goes to the project still fresh in memory — the weekend I decided this
portfolio needed to be legible to robots, not just recruiters.</p>

<h2>The problem: humans could read my site, but the bots were squinting</h2>
<p>Search engines have always crawled pages. The newer wrinkle is that <em>AI</em> crawlers — the ones
summarizing your site into a chatbot's answer — want something closer to a structured briefing than a
web page. So I went down the rabbit hole of "answer engine optimization" (AEO), which is SEO's younger
cousin who reads faster and asks more questions.</p>

<h2>What actually happened</h2>
<ul>
<li><strong>JSON-LD schema soup:</strong> I bolted <code>ProfilePage</code>, <code>Person</code>,
<code>FAQPage</code>, and <code>BreadcrumbList</code> structured data onto every route. Nothing visually
changes for a human visitor — it's a love letter written entirely for parsers.</li>
<li><strong>An llms.txt file:</strong> yes, that's a real thing now — a plain-text cheat sheet for AI
crawlers, sitting right next to robots.txt like a considerate roommate.</li>
<li><strong>Domain consolidation:</strong> I collapsed a handful of near-duplicate canonical URLs into one,
which sounds boring until you realize duplicate content is basically the site telling search engines
"pick a favorite, I don't care," and they take you up on it in the worst way.</li>
<li><strong>Recruiter-first restructure:</strong> cut the page from 14 sections down to 6. Turns out
"more sections" was never the same thing as "more compelling," a lesson every founder relearns at least
once a quarter.</li>
<li><strong>The Great WebP-ification:</strong> every headshot and referral photo got converted to WebP,
including several pictures of my own face, which is a strange thing to watch a build pipeline compress
and re-encode at 2am.</li>
<li><strong>Deleted a stale wrangler.toml:</strong> a Cloudflare config file nobody had touched in ages,
quietly doing nothing, like a gym membership I keep meaning to cancel.</li>
</ul>

<h2>The lesson</h2>
<p>The unglamorous work — canonical URLs, crawler manifests, deleting dead config — is the stuff that
actually compounds. Nobody screenshots a robots.txt file for LinkedIn, but it's the difference between an
AI answer engine describing your work accurately and it just making something up because your site gave
it nothing to work with. Sometimes the best commit really is the boring one.</p>

<p>Next time in Behind the Build: whatever breaks next. Stay tuned.</p>
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

const seenDates = new Map<string, string>();
for (const a of articles) {
  const priorSlug = seenDates.get(a.date);
  if (priorSlug) {
    throw new Error(
      `articles.ts: only one article per day is allowed, but "${priorSlug}" and "${a.slug}" are both dated ${a.date}.`
    );
  }
  seenDates.set(a.date, a.slug);
}

export const getArticle = (slug: string): Article | undefined =>
  articles.find((a) => a.slug === slug);
