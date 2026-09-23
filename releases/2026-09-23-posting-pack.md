# Release pack — 2026-09-23

Everything below is ready to hand to the posting run. Each post has a hook, blank lines between paragraphs, and a link back to the site. Attach the named image from `public/images/papers/` (1200×630) or the PDF where it says so. No hashtag walls; two at most.

Suggested order and cadence (one per weekday slot, Signal pillar unless marked):

| # | Day | Asset | Attach |
|---|---|---|---|
| 1 | 2026-09-23 | Papers section launch | `og-sites-that-differ-by-data-not-code.png` |
| 2 | 2026-09-24 | Essay: The Banner Is Not a Lock | none (text) |
| 3 | 2026-09-25 | Paper 01: Sites That Differ by Data, Not Code | PDF |
| 4 | 2026-09-26 | Essay: Guard Jobs Are Free | none (text) |
| 5 | 2026-09-29 | Paper 02: One Database, Many Connectors | `fig-identity.png` |
| 6 | 2026-09-30 | Essay: The Statute Rewrote the Product | none (text) |
| 7 | 2026-10-01 | Paper 03: The Demand Instrument | `fig-bars.png` |
| 8 | 2026-10-02 | Operator math: the 62 KB query string | `fig-query-string.png` |

Every number below is in the linked artifact. If the posting gate cannot find one in the fact ledger, the artifact is the source; register it there first.

---

## 1. Papers section launch

I published three white papers today, as PDFs, with the arithmetic shown.

One is about a generator that builds a trade-business website from a single intake file and verifies it live in 46.5 seconds. One is about the operating system behind a six-person maintenance company: one database, twelve serverless functions, and an agent that works its own queue. One is about the instrument behind a nine-idea demand test, and the three ways that kind of test gets misread.

The essays on my site have always been the short version. These are the long version: the method, the measurements, and the parts that went wrong.

Every number in them is sourced to a repository, a live URL, or a measurement you can rerun. Where a number is an estimate, the paper says so in the same sentence.

https://www.michael-kaminski.io/papers

Which one should I have written first?

---

## 2. Essay: The Banner Is Not a Lock

A shadow session in my LinkedIn engine wrote a ledger row it had been told not to write. The instruction was the first line of its prompt, in capitals.

It wrote the row anyway.

I don't know why, and I've stopped treating why as the useful question. The useful question is what stopped it. The answer was nothing. The commands the session called didn't know they were in shadow. Only the prompt did.

The fix was not a better banner. The runner now sets a mode in the environment and the engine reads it. In shadow, every command that records a publish or a send exits 3 and writes nothing. A passing gate exits 3. The session starts without the tools that fill forms or attach files.

A prompt is an instruction. An exit code is a lock.

This is the third time I've written this finding in a different costume. Approval gates on irreversible actions. Statistical gates that couldn't detect their own effect. Now a mode that lived only in the prompt. Same pattern each time: I write the rule where I write, and I feel it's enforced because I can see it.

If you run agents on a schedule: list every action that must not happen in a given mode, and for each one name the line of code that refuses it. If the answer is "the prompt," you don't have a lock.

https://www.michael-kaminski.io/writing/the-banner-is-not-a-lock

---

## 3. Paper 01: Sites That Differ by Data, Not Code

46.5 seconds from a GitHub template to a verified live website. Measured, not estimated.

Database 2.2 s. Bot-check widget 0.3 s. Build 1.3 s. Repository from template 17.6 s. Deploy 11.2 s. Verify 13.8 s.

That's the deploy half of a five-minute contract for trade-business websites: one intake file in, a built, deployed and verified lead-gen site out. The content half, writing roughly 10,000 words for a new business, is the part that doesn't fit yet, and the paper says so.

Three things the first live deploys got wrong that the local build couldn't see:

Every internal link took a 307, because directory-style output made the platform redirect and the canonical pointed at a redirecting URL.

Pages returned 404 briefly while the home page was up, because assets reach the edge seconds apart.

The lead endpoint accepted unverified leads for the width of one deploy step, because the secret was set after the code shipped.

Each is now a gate. The first launched site was destroyed the same day for being 21% of a competitor's content depth, and the fix went into the kit instead of the site.

The rule that doesn't bend: the generator never fabricates trust content. Reviews and licence numbers require client-supplied provenance, in the schema, not in a style guide. Sites launch honest but thinner until the client supplies the real thing.

PDF, 8 pages: https://www.michael-kaminski.io/docs/papers/sites-that-differ-by-data-not-code.pdf

---

## 4. Essay: Guard Jobs Are Free

A feature of five stories costs sixteen model runs in my delivery pipeline. A request that fails the Definition of Ready costs zero.

The check that fails it is a bash script that runs before any model is invoked.

Four agents, each owning one gate. Product asks whether this is a real, sliced, testable feature; it can't write code. Dev turns one story into one PR with tests; it can't start from an unrefined issue. QA asks whether the tests prove the criteria; it can't fix the code. Acceptance asks whether the requester would call this done, and looks at the rendered screens to answer; it can't merge.

There's no database, queue or service. GitHub issues are the state and labels are the only control flow. Every transition is a visible event on the issue timeline, which is why it's cheap to run and easy to debug.

Three decisions stay human on purpose. Scope, because an agent approving its own scope is vibe coding with extra steps. Sequencing, because priority is yours. Merge, because one irreversible action gets one human.

The cheapest place to prevent a bad model call is before it's made. Put the preconditions in a guard job, not in the prompt.

https://www.michael-kaminski.io/writing/guard-jobs-are-free

---

## 5. Paper 02: One Database, Many Connectors

Zero of 585 completed jobs over twelve months carried a lead source. So the attribution model matches on something else.

72% of customers in the field-service mirror have a phone number. 13% have an email. Ad lead forms carry both. Leads match on the last ten digits of the phone first, then email.

That's one decision from a paper about the operating system behind a six-person maintenance company. The whole thing runs on one Postgres database, a static web page and twelve serverless functions, with a rule that shaped everything: no tool ever talks to another tool. They talk to the database.

The other finding I'd copy anywhere: an agent with a task queue was parking nine of ten tasks as blocked because the last step lived in a settings page it couldn't reach. Blocked on the agent's queue means nobody sees them. The rule changed. Hand the task to the person who holds that system, with the click path in the notes.

An agent that parks work it can't finish is a black hole. The queue looks busy and nothing moves.

PDF, 7 pages: https://www.michael-kaminski.io/docs/papers/one-database-many-connectors.pdf

---

## 6. Essay: The Statute Rewrote the Product

On 2026-09-02 I read the statute that governs what my product was selling. On 2026-09-03 the product refused its own launch pitch.

The pitch was clean. A licensed contractor's name on your permit, you keep your crew, one site walk, the owner supervises. The build was good: zero credentials to render, server-priced checkout, an idempotency ledger on the webhook.

Read against Georgia's licence-lending rules, every phrase of the pitch was the fact pattern the rule was written to catch.

It became a contractor-of-record model. The contractor approves the scope, obtains the permit and supervises through inspections. The documents that used to unlock at payment now unlock at scope approval. Declining refunds in full and locks the portal.

The intake now has six hard stops, enforced on the client and again on the server: trade permits without a trade licensee, unlicensed crews, investors doing the labour, placeholder licence numbers, orders on an owner's behalf without the owner's contact, missing subcontractor lists.

Each stop records why it fired. That's not a bug report. It's the demand signal for the product I can't sell.

Rebuild: one working day. Tests: 63, all green. Schema changes: none.

Read the statute before the landing page, and read it as a description of what the product does.

https://www.michael-kaminski.io/writing/the-statute-rewrote-the-product

---

## 7. Paper 03: The Demand Instrument

Nine business ideas. Nine landing pages from one template. Each with a pass/fail bar set before any traffic arrived.

A booked call needs 6 of 400 views. A one-dollar refundable deposit needs 6 of 600. A qualified email needs 32 to 48 of 800. The cheaper the proof, the higher the rate it has to clear.

The instrument is the product, not any of the nine. One hosting project per launch; analytics, database, payments and scheduling are one account each, joined by a single slug. Running ten ideas costs roughly what running one does, and every launch stays comparable in one view.

Three misreads the read model refuses:

An email is not demand. Only the costly action counts toward the bar.

A rate without a sample is noise. One conversion on eight views is 12.5% and means nothing. Every idea reads "not enough data" until it has the views its bar was defined against.

Zero views is not 0%. An unmeasured idea shows a dash. Conflating those makes a page that simply had no traffic look like a failure.

The paper covers the instrument. The read-out belongs to whichever idea cleared its bar.

PDF, 6 pages: https://www.michael-kaminski.io/docs/papers/the-demand-instrument.pdf

---

## 8. Operator math: the 62 KB query string

2,493 accounts on a pipeline board. 24 characters per id. One filter that listed every id. Roughly 62 KB of query string, and the database gateway answered 400.

The cost wasn't the feature that built the filter. It was an optional Call button. The lookup threw, the request failed, and the whole pipeline tab rendered "Bad Request." A tab that worked before the feature existed went down because of a decoration on it.

Two fixes, and the second is the one to copy.

First, read the mirror in pages of 1,000 with no id filter and match in memory. Two small queries, neither of which grows with the pipeline.

Second, the phone lookup can no longer take the board down. It returns an empty map on any error and logs. A phone number decides whether one optional button is drawn. It's not what the tab is for.

An optional feature must not be able to fail the page it decorates. Return empty, log, and test that path.

Full write-up in the paper: https://www.michael-kaminski.io/docs/papers/one-database-many-connectors.pdf

---

## Notes for the posting run

- Suppressions: none of these posts mention the regulated-lender employer, and none pairs agent-hour figures with it. The Transparent Maintenance material names the company (it is public) but no staff, clients, revenue, grades or licence numbers.
- The papers' numbers are all dated 2026-09-21 or earlier and cited to a repository or a live URL in the PDF. If the fact ledger needs a source row per number, the PDF path is the source.
- Card images are 1200×630 PNG under `public/images/papers/`. The figure PNGs are 1440-wide and read fine on mobile.
- dev.to: the three essays can be republished with `canonical_url` pointing at `/writing/<slug>`, same as the last five.
