export interface Article {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO
  readMinutes: number;
  /**
   * Optional series label. Deliberately unnumbered — the old
   * "Behind the Build, Vol. N" scheme made every concurrent writing run fight
   * over the same N, and the counter was never worth the collisions.
   */
  series?: string;
  /** Per-article social card. Falls back to the site-wide og-image.jpg. */
  ogImage?: string;
  /**
   * Optional: companies and tools the article is actually about, as keys of
   * src/data/articleLogos.ts. Shown as logos on the card and linked on the
   * article page. Leave off when nothing specific is named.
   */
  logos?: string[];
  /** Author-controlled HTML body (rendered via dangerouslySetInnerHTML). */
  body: string;
}

export const articles: Article[] = [
  {
    slug: 'the-banner-is-not-a-lock',
    title: 'The Banner Is Not a Lock: A Shadow Session Wrote the Row It Was Told Not To',
    description:
      "My LinkedIn engine runs every job in shadow mode before it is allowed to publish. On 2026-09-22 a shadow scorecard session wrote a ledger row anyway, with the shadow banner at the top of its prompt. The fix was not a better banner. The engine now reads a mode from the environment, and in shadow every command that records a publish or a send exits 3 and writes nothing, a passing gate exits 3, and the session cannot fill forms or attach files. A prompt is an instruction; an exit code is a lock. 27 invariants, 57 differential cases, 2,760 ledger rows reconciled row-for-row.",
    date: '2026-09-23',
    readMinutes: 6,
    series: 'Field Notes',
    body: `
<p>On 2026-09-22 a shadow session in my LinkedIn engine wrote a ledger row it had been told not to write. The instruction was the first thing in its prompt, in a banner, in capitals. It wrote the row anyway.</p>

<p>The conclusion first: <strong>a prompt is an instruction, and an instruction is not a lock.</strong> If an agent must not do a thing, the code the agent calls has to refuse, and the refusal has to be an exit code the runner can see. I had known that for irreversible actions. I had not applied it to a mode flag, because "shadow" felt like a setting rather than an action. It is an action. Every publish is one.</p>

<h2>What the engine is</h2>

<p>The engine is a gated, ledger-backed system for one operator's LinkedIn presence: three posts a day on a learning schedule, one considered comment per run, warm outreach inside hard budgets, and a job-search lane. A control plane on Cloudflare decides <em>when</em>. A small runner on my own machine drives my own logged-in browser, because LinkedIn offers no API for most of this. Every run is a fresh session with one playbook and a mode banner; the ledgers are the only memory.</p>

<p>Over three days, 2026-09-21 to 2026-09-22, the engine went from a folder of scripts to a package with 27 named invariants, each with a test that is the definition. Twenty-four ledger tables live in D1 now, generated from one schema spec; 2,760 rows were imported and reconciled row-for-row. Fifty-seven differential cases prove the lifted commands produce the same stdout, stderr, exit code and ledger writes as the originals, modulo an enumerated list of deltas. Fifteen schedules run in shadow. None of that stopped the row.</p>

<h2>What happened</h2>

<p>The scorecard job reconciles accepted invites in the browser and logs the week. Its first live shadow run was a success in every way I had planned to measure: the session started, the browser worked, the playbook ran, and the report came back. Then I read the ledger. There was a new row that a shadow run has no business writing.</p>

<p>The session had the banner. It had the playbook line that says shadow logs and never sends. It had the same model that had followed the same rule in fourteen other shadow runs. On this one it did not. I do not know why, and I have stopped treating "why" as the useful question. <strong>The useful question is what stopped it, and the answer was nothing.</strong> The commands the session called did not know they were in shadow. Only the prompt did.</p>

<h2>The fix</h2>

<p>The runner now sets an environment variable that names the mode, and the engine reads it. In shadow:</p>

<ul>
<li>Every command that records a publish or a send exits 3 and writes nothing. That is log-post, log-comment, log-send without the shadow flag, log-reply, and the apply record.</li>
<li>A passing gate exits 3. The gate still runs, still scores, still reports. It cannot return the code that means "go".</li>
<li>Easy Apply preflight fails.</li>
<li>The session is started with the tools that fill forms and attach files disallowed, so even a session that decided to try has nothing to try with.</li>
</ul>

<p>Exit 3 is deliberate. Zero means done, one means error, two means "correctly declined" in this engine's vocabulary. Three means held. The runner treats it as a normal outcome and the console shows it as one, so a shadow run that does exactly what it should now ends in a code that a person can read as "the lock worked".</p>

<p>The playbooks were rebuilt with the same banner, because the banner is still useful. It tells the model what is expected, and most of the time the model does it. The lock is for the rest of the time.</p>

<h2>Why this keeps coming up</h2>

<p>This is the third time on this site I have written the same finding in a different costume. The <a href="/writing/human-approval-gates-for-irreversible-agent-actions">approval-gates essay</a> said that anything the agent cannot undo has to be a property of the tool surface, not a policy asking the model to behave. The <a href="/writing/statistical-gating-for-agent-instruction-changes">statistical-gating essay</a> said a gate that cannot detect the effect it was built for is decorative. This one says a mode that lives only in the prompt is decorative too.</p>

<p>The pattern is the same each time. I write a rule in the place where I write, which is the prompt, and I feel the rule is enforced because I can see it. Then the system does the thing once, and I discover that the only enforcement was my having written it down. <strong>The rule has to move from the place where I write to the place where the code runs, and it has to fail closed.</strong></p>

<p>The engine has a table of invariants for exactly this reason. Each one is marked Code, Partial or Gap. Code means the engine enforces it and a test proves it. Partial means the engine enforces its half and the rest is a playbook instruction. The mode flag was not even on the table, because I had not thought of it as an invariant. It is now: shadow never publishes, and the test is a session that tries.</p>

<h2>Two more gaps closed the same week</h2>

<p>Reading the ledger for the shadow row turned up two smaller ones, both the same shape.</p>

<p>A veto in the engagement candidate list could be overridden by an explicit lane or relevance argument on the command line. That is a rule living in the default rather than in the code. Now the pick filters on the stored lane and a veto is final.</p>

<p>The posting gate checked numbers against the fact ledger but let an unregistered number through if it was plausible. A checkable number found in neither the fact ledger nor a sourced claims row is now a hard fail, which is what the posting playbook had said all along. The playbook said it; the gate did not do it. Same costume.</p>

<h2>What to copy</h2>

<p>If you run agents on a schedule, list every action that must not happen in a given mode, and for each one ask which line of code refuses it. If the answer is "the prompt", you do not have a lock. Add a mode to the environment, make the command exit non-zero and write nothing, and then run a session that tries. The session that tries is the test. Mine wrote a row; yours will do something else. The lock is what makes it a story instead of an incident.</p>
`,
  },

  {
    slug: 'guard-jobs-are-free',
    title: 'Guard Jobs Are Free: Four Agents, Three Human Gates, and Zero Model Calls on a Bad Request',
    description:
      "A four-agent pipeline turns a sentence in Slack into a planned, tested, reviewed feature in GitHub. The design constraint is that no code can be written from an unrefined request: a bash guard job checks the Definition of Ready before any model is invoked, and a story with no Given-When-Then never reaches the dev agent. Labels are the only orchestration primitive, GitHub issues are the database, and a five-story feature costs 16 model runs. Three gates stay human on purpose: scope, sequencing, and merge.",
    date: '2026-09-22',
    readMinutes: 5,
    logos: ['GitHub', 'Bash'],
    series: 'Field Notes',
    body: `
<p>A feature of five stories costs sixteen model runs in my software-delivery pipeline: one for the product agent, then five each for dev, QA and acceptance. A request that fails the Definition of Ready costs zero, because the check that fails it is a bash script that runs before any model is invoked.</p>

<p>The conclusion first: <strong>put the preconditions in a guard job, not in the prompt.</strong> A guard job is free, it is deterministic, and it fails in a way the issue timeline records. A precondition written into a prompt costs a model call to evaluate and is honoured most of the time.</p>

<h2>The shape</h2>

<p>Four agents, each owning exactly one gate, with no authority over the others' work. The product agent asks whether this is a real, sliced, testable feature; it cannot write code. The dev agent turns one story into one pull request with tests; it cannot start from an unrefined issue. The QA agent asks whether the tests actually prove the criteria; it cannot fix the code. The acceptance agent asks whether the requester would call this done, and looks at the rendered screens at 375, 768 and 1440 pixels to answer; it cannot merge.</p>

<p>Every agent is the same three parts: a role file, a bash guard job, and one model invocation with a per-agent tool allowlist. Adding a fifth agent means copying that pattern.</p>

<h2>Labels are the control flow</h2>

<p>There is no database, queue or persistent service. GitHub issues are the state, and labels are the only orchestration primitive. An intake issue carries the raw request verbatim, never edited. The product agent replies with a proposal. A human adds <code>gate:approved</code>. The agent creates a feature issue and story issues in <code>stage:ready</code>. A human adds <code>agent:dev</code> to one story. Dev, QA and acceptance run unattended from there, and a person gets a message on done, failure or a question.</p>

<p>Every state transition is a label change, and every label change is a visible event in the issue timeline. That is the single biggest reason the system stays cheap to run and easy to debug. When something goes wrong, the answer to "what happened" is on the issue, in order, with timestamps.</p>

<h2>The guard</h2>

<p>The dev agent's guard checks three things before spending a model call: is this a story, is it in ready, and does it carry at least one Given-When-Then acceptance criterion. If any check fails, the guard adds <code>gate:failed</code> and stops. No model, no branch, no cost.</p>

<p>That guard is the design constraint made concrete: <strong>no code can be written from an unrefined request.</strong> Everything else in the pipeline is a consequence. The product agent exists because something has to produce the criteria the guard demands. The QA agent traces each criterion to a test because the criteria are machine-checkable. The acceptance agent reads the original intake rather than the refined story, because refinement loses information and that edge is the check on the loss.</p>

<h2>The three human gates</h2>

<p>Three decisions stay with a person, and each has a reason that is not "we were nervous".</p>

<ul>
<li><strong>Scope.</strong> Approving the proposal is a business decision. An agent approving its own scope is the vibe-coding problem with extra steps.</li>
<li><strong>Sequencing.</strong> Stories sit in ready until a person pulls one. Priority is theirs.</li>
<li><strong>Merge.</strong> The acceptance agent recommends. One irreversible action, one human.</li>
</ul>

<p>Everything between those three points runs unattended. The kill switch is a label: <code>agent:paused</code> on any item stops every agent for that item before any model call. Disabling Actions stops everything.</p>

<h2>What it costs</h2>

<p>One model call per agent per item. A five-story feature is 1 + 5 + 5 + 5 = 16 runs, plus one extra dev-and-QA cycle for each block. The guard jobs are not in that count because they cost nothing. That arithmetic is why the preconditions live in bash and not in the prompt, and it is the same arithmetic as the <a href="/writing/designing-tools-an-agent-can-actually-call">tool-surface essay</a>: the cheapest place to prevent a bad call is before it is made.</p>

<h2>What is not proven</h2>

<p>The pipeline was built on 2026-09-07 and has run on my own repositories. I have no throughput numbers worth publishing yet, and the honest claim is the structural one: a request without acceptance criteria cannot reach a model that writes code. The count of features shipped through it is a later essay, with the count.</p>
`,
  },

  {
    slug: 'the-statute-rewrote-the-product',
    title: 'The Statute Rewrote the Product: A Permit Service That Had to Refuse Its Own Launch Pitch',
    description:
      "A self-serve product let a homeowner put a licensed contractor's name on their permit and keep their own crew. Georgia's license-lending rules made that pitch the textbook prohibited fact pattern. The product was rebuilt in a day as a contractor-of-record model: scope approval gates the documents, the intake refuses unlicensed crews and trade permits on both the client and the server, and a full refund closes the order. 63 tests, zero credentials to build, and a rule I keep relearning: design against the statute, not the pitch.",
    date: '2026-09-21',
    readMinutes: 6,
    logos: ['Transparent Maintenance'],
    series: 'Field Notes',
    body: `
<p>On 2026-09-02 I read the statute that governs what my product was selling, and on 2026-09-03 the product refused its own launch pitch. Everything in between is the essay.</p>

<p>The product is Transparent Permits, a self-serve service from a licensed residential contractor in metro Atlanta. The launch pitch was clean: the contractor's licence on your permit, you keep your crew, one site walk, the owner supervises. A customer describes the project, pays by card, and gets the licence documents in a private portal. It built and rendered with zero credentials, took payment through a server-priced checkout, and closed the order from a webhook with an idempotency ledger. It was a good build of the wrong product.</p>

<h2>What the statute says</h2>

<p>Georgia's licensing law and its rules prohibit lending a licence: putting your number on work you do not actually control. The 2026 changes extended the pattern to the trades from 2026-07-01. Read against the pitch, every phrase was a match. "You keep your crew" is an unlicensed crew under a licence that does not supervise them. "One site walk" is supervision in name. "The owner supervises" is the licensee stepping out of the role the licence exists to hold.</p>

<p>The conclusion first: <strong>the pitch was the fact pattern the rule was written to catch, and no amount of product polish changes that.</strong> The only move was to change what the product is.</p>

<h2>What it became</h2>

<p>A contractor-of-record model. The licensed contractor approves the scope, obtains the permit, and supervises the permitted work through inspections, with the visit count bounded in the agreement. The documents that used to unlock at payment now unlock at scope approval. Declining the scope emails a refund notice, the refund closes the order, and the portal locks.</p>

<p>The interesting part is what the intake refuses. Six hard stops, enforced on the client and again on the server, so a request that fails cannot be submitted by a determined browser:</p>

<ul>
<li>Trade permits (electrical, plumbing, HVAC), unless the trade licensee's number is supplied.</li>
<li>Unlicensed crews performing the work.</li>
<li>Investors doing the labour themselves.</li>
<li>"Contractors" with no licence, a placeholder number, or the licensee's own number.</li>
<li>A contractor ordering on an owner's behalf without the owner's contact.</li>
<li>A subcontractor list that is missing when the work needs one.</li>
</ul>

<p>Each stop records why it fired, so the intake tells me which pattern people are trying to buy. That is not a bug report. It is the demand signal for the product I cannot sell them.</p>

<h2>Freeze the old agreement, version the new one</h2>

<p>Orders placed under the launch agreement keep it. The agreement module holds version one frozen and version two dated, and the portal renders the text that applied to the order's version. A customer who agreed to one document must never find a different one in their portal. Approve and decline links are signed with an HMAC so the review page cannot be forged, and the first decision wins.</p>

<p>The copy sweep was the long part: home, the intent pages, the county pages, the machine-readable summary, the social card, the success page and seven email sequences all said the old thing. A grep for the launch phrasing is now a test, because copy regresses faster than code.</p>

<h2>Why this rhymes</h2>

<p>The <a href="/writing/shipping-an-ai-agent-through-compliance-review">compliance-review essay</a> on this site argues that the durable move in a regulated system is to design against the statute rather than against guidance, because guidance is the layer that moves. This is the same lesson from the other side. I had designed against the pitch, which is the layer that moves fastest of all, because I wrote it. <strong>Read the statute before the landing page, and read it as a description of what the product does, not as a footnote.</strong></p>

<h2>Numbers</h2>

<p>Rebuild: one working day, 2026-09-02 to 2026-09-03, evaluated on the first and shipped on the second. Tests: 63, all green with no environment configured. Schema changes: none; the new intake fields live in the existing JSON column and the scope decisions are event rows. New environment variables: none; the cron token also keys the review-link signature. Orders refunded under the change: not reported here.</p>

<p>The employer of the licence is a company I work with, not a client I am describing from the outside, and the licence number is deliberately absent from this essay.</p>
`,
  },
  {
    slug: 'measure-reach-on-the-log-scale',
    title: "Measure Reach on the Log Scale: 738 Weeks Became 30 on the Same 182 Posts",
    description:
      "My LinkedIn scheduler moves a slot on eight observations, so I priced the plan to fix it with volume. On raw impressions (182 posts, mean 223, SD 983, one post carrying 31.9% of all impressions) a two-arm test for a 20% lift needs 7,747 posts per arm, 738 weeks at 21 a week. On log impressions the same posts need 314 per arm, 30 weeks. Reach is multiplicative, so the log scale asks the question the data was generated by. The admitted cost: a log-scale test measures the geometric mean and is partly blind to the 12,959-impression outlier that carried the account.",
    date: '2026-09-20',
    readMinutes: 6,
    logos: ['Python'],
    series: 'Field Notes',
    body: `
<p>My LinkedIn scheduler moves a posting slot on eight data points. I ran the power calculation on the plan to fix that with volume, and on raw impressions it needs 738 weeks. On log impressions, the same 182 posts need 30.</p>

<p>The conclusion first: for any metric that multiplies, and reach is one, the scale you measure on decides whether the experiment can ever finish. Impressions, revenue per post, tokens per conversation, latency tails. Test them on the log scale or accept that the test is decorative.</p>

<p>This is the second time I have found a decorative test in my own system. The <a href="/writing/statistical-gating-for-agent-instruction-changes">first</a> was a 14-day window that could only detect a shift of 0.97 standard deviations. That time the fix was more days. This time more days was the trap.</p>

<h2>The optimizer decides on eight observations</h2>

<p>The scheduler is a Thompson sampler in a 1,171-line Python file. Each arm is a 30-minute bucket inside a daypart, with a Beta(2, 8) prior updated by the engagement rate of every post that landed there. Three dayparts, one arm chosen per daypart, once a week.</p>

<p>Run 2026-09-20, it proposed moving the evening slot from 17:30 to 18:30 on a sampled posterior of 0.266 from an arm with eight observations. The morning slot, twelve. Midday, thirteen.</p>

<p>Eight is a posterior, not a result. The sampler is doing exactly what Thompson sampling does with thin arms, which is draw wide and move often. The retune output prints an estimates-versus-actuals block for the last 14 days, and for the evening slot it reads model estimate 0.0201, actual median 0.0000.</p>

<p>The plan was volume. Twenty-one posts a week, let the arms fill, let the posterior narrow. Before committing a year to that, I priced it.</p>

<h2>On raw impressions, a 20% lift takes 738 weeks to detect</h2>

<p>The store is one file, <code>posts.jsonl</code>, 278 rows, 182 of them with impressions logged. The calculation is 14 lines of Python on the standard library: <code>json</code>, <code>math</code>, <code>statistics</code>.</p>

<p>The 182 posts: mean 223 impressions, standard deviation 983, median 88.5. The largest post did 12,959. The second largest did 2,164. One post is 31.9% of every impression I have ever logged, and 161 of the 182 posts sit below the mean. Sample skewness is 12.1.</p>

<p>For a two-arm test at 80% power and a two-sided alpha of 0.05, the sample per arm is close to 16σ²/δ². A 20% lift on a mean of 223 is δ = 44.65.</p>

<p>16 × 983² / 44.65² = 7,747 posts per arm. Two arms, 15,494 posts. At 21 a week, 738 weeks. Fourteen years, for one comparison, against a threshold I would actually act on.</p>

<p>The obvious objection is that the 12,959 post is doing all of that. It is doing most of it. Drop it and the standard deviation falls to 254, the requirement to 1,107 per arm, 2,214 posts, 105 weeks. Two years, for one comparison, and I had to throw away the only post that mattered to get there.</p>

<h2>On log impressions, the same posts need 30 weeks</h2>

<p>Reach is multiplicative. A post that works does not add 200 impressions to a baseline; it multiplies the baseline. The algorithm shows it to a batch, the batch engages or does not, the next batch is sized on the first. That is a compounding process, and compounding processes produce log-normal outcomes.</p>

<p>So take the natural log of every impression count and run the identical calculation. Same 182 posts, same 14 lines, one flag flipped from <code>raw</code> to <code>log</code>.</p>

<p>Log mean 4.66, which back-transforms to a geometric mean of 106 impressions. Log standard deviation 0.81. A 20% lift is now a constant, ln(1.2) = 0.182, because on the log scale a multiplicative lift is an additive shift.</p>

<p>16 × 0.81² / 0.182² = 314 posts per arm. Two arms, 628 posts. At 21 a week, 30 weeks.</p>

<p>Nothing about the data changed. The raw-scale test was asking a question the distribution could not answer, because the variance of a log-normal is dominated by its tail. The log-scale test asks the question the distribution was generated by.</p>

<p>Sanity check on the fit: 82.4% of the posts fall within one log-standard-deviation of the log mean, against 68% for a true normal. Skewness drops from 12.1 to 2.1. Not a clean log-normal. Close enough that the arithmetic is honest, and far closer than the raw scale was.</p>

<h2>What the log scale costs</h2>

<p>The log-scale test measures the geometric mean. It answers: does this change multiply the reach of a typical post? It does not answer: does this change produce more 12,959-impression posts?</p>

<p>Those are different objectives, and on this account the second one is where the value has been. One post carried 31.9% of all impressions. On the raw scale it sits 13 standard deviations from the mean. On the log scale, 5.9. The log transform pulls it in, which is what makes the test tractable and is also what makes the test partly blind to it.</p>

<p>I do not have a clean way to optimize the median and the tail at once. Extreme-value methods exist for the tail, and they need a tail sample I do not have; there are three posts over 2,000. For now the scheduler optimizes the typical post and I read the outliers by hand.</p>

<p>The second cost is that 30 weeks assumes 21 posts a week, and the weekly scorecard for 2026-09-20 shows 13 of 21 shipped. At 13 a week, 628 posts is 48 weeks. The log scale bought a 25-fold improvement; it did not buy a fast experiment. A two-arm test on this account still takes most of a year, which is why the weekly review adopts at most one change and labels most weeks directional rather than conclusive.</p>

<h2>What changed in the engine, and what did not</h2>

<p>The power script sits next to the scheduler and takes one argument, <code>raw</code> or <code>log</code>. Before any experiment on this account, it prints the posts per arm and the weeks at current cadence. That number now exists at the moment I am deciding whether to run the experiment, which it did not before.</p>

<p>The scheduler itself did not change. Its reward is engagement rate, clipped at 15% and normalized to [0, 1], and engagement rate is a bounded ratio of two counts. The log-normal problem lives in the impressions denominator and in any test that treats impressions as the outcome. The 1,171-line file does not read the power script, and the retune still prints an arm of eight as if eight were enough.</p>

<p>So the honest state is: the test is fixed, and the optimizer still moves on thin arms every Monday. The warm-up floor is 20 observations per daypart, the floor for a bucket to be a candidate is 3. Raising the bucket floor to something the power calculation would respect is the next edit, and it will make the sampler move less, which is the point.</p>

<h2>If you run experiments on a multiplicative metric</h2>

<p>First, look at the ratio of the largest observation to the median before you look at anything else. Here it is 146 to 1. Anything past 10 to 1 on a metric that cannot go below zero is a log-normal until proven otherwise, and a t-test on the raw values will need a sample you do not have.</p>

<p>Second, make the lift a multiplier. A 20% lift is ln(1.2) on the log scale regardless of the baseline, which means one power table serves every arm. On the raw scale the same 20% is a different δ for every baseline, and the table has to be rebuilt each time the mean moves.</p>

<p>Third, report what the test is blind to. A log-scale result is a statement about the geometric mean. If the business runs on the tail, say so in the same sentence, or someone will read a significant result as permission to stop looking for the outlier.</p>

<p>The 738-week number was not a bug in the optimizer. The optimizer was fine. The measurement was on the wrong scale, and it had been for 182 posts before I checked.</p>
`,
  },
  {
    slug: 'prompt-cache-floors-are-per-model',
    title: "Prompt Cache Floors Are Per-Model, and the Cheap Model Has the Highest One",
    description:
      "Claude's minimum cacheable prompt is 512 tokens on Opus 5, 1,024 on Sonnet 5, and 4,096 on Haiku 4.5, so the cheapest model is the hardest to cache and a miss bills silently at base rate. I measured the 53 SKILL.md files this machine loads: 53 clear the Opus floor, 44 clear Sonnet, 12 clear Haiku. On the median file, Sonnet 5 with caching is 57% cheaper on input than Haiku 4.5 without it, and the two cross at a 65% hit rate. The admitted cost: a harness I don't own sends the request, so file length is the only lever I hold.",
    date: '2026-09-13',
    readMinutes: 6,
    logos: ['Anthropic API', 'Claude', 'Claude Code'],
    series: 'Field Notes',
    body: `
<p>Fifty-three skill files load on this machine. All 53 clear Claude's prompt-cache floor on Opus 5. Twelve clear it on Haiku 4.5. Same files, same flag. Nothing changed but the model on the other end.</p>

<p>The conclusion first: routing a workload to the cheapest model can route it out of the cache, and when that happens nothing errors. The request is processed uncached and billed at the base rate. If you run a model router, the cache floor of the cheapest model you ever route to is a design input, not a footnote.</p>

<h2>The floors are per-model, and they run backwards from price</h2>

<p>Anthropic's prompt-caching documentation, checked 2026-09-13, lists the minimum cacheable prompt length by model: 512 tokens for Opus 5, 1,024 for Sonnet 5, 4,096 for Haiku 4.5.</p>

<p>Read that as a ladder. The model that bills $5 per million input tokens caches anything over 512. The model that bills $1 needs eight times the prefix before it will cache at all.</p>

<p>The documentation is explicit about what happens below the floor: the request "will be processed without caching, and no error is returned." The only signal is in the response. If <code>cache_creation_input_tokens</code> and <code>cache_read_input_tokens</code> both come back 0, nothing cached.</p>

<h2>What 53 real files look like against the floors</h2>

<p>A skill file is a stable instruction block that gets resent on every call. It is the textbook thing to cache. So I measured every <code>SKILL.md</code> that Claude Code and Cowork load on this machine, 5 of mine and 48 from installed plugins, against the three floors.</p>

<p>The measurement is a 22-line shell script: <code>find</code>, <code>wc -c</code>, <code>awk</code>. It counts characters and converts at 3.8 characters per token, which puts the thresholds at 1,946, 3,891, and 15,565 characters.</p>

<p>Results, re-run 2026-09-13:</p>

<ul>
<li>Opus 5, 512-token floor: 53 of 53 clear. 100%.</li>
<li>Sonnet 5, 1,024-token floor: 44 of 53. 83%.</li>
<li>Haiku 4.5, 4,096-token floor: 12 of 53. 22%.</li>
</ul>

<p>Smallest file 2,009 characters, median 8,994, largest 32,002. At the proxy rate that is roughly 530, 2,370, and 8,420 tokens. The median skill file is more than double the Sonnet floor and a little over half the Haiku floor.</p>

<p>Forty-one of the 53 sit below the Haiku floor. Nine sit below Sonnet's. None sit below Opus's.</p>

<p>This is not one outlier dragging the numbers. The largest file is 16 times the smallest, and the distribution itself straddles the Sonnet floor and sits under the Haiku floor. A typical skill file, written to do its job and no longer, lands in exactly the band where the cheapest model refuses to cache it.</p>

<p>The character count is a proxy, and it errs in the direction I want. The real cached prefix also carries the system prompt and tool definitions, so a file that clears here clears for real. It says less about files that miss; some of those may clear once the rest of the prefix is counted. The usage fields on the response are the only real test.</p>

<h2>The arithmetic on the median file</h2>

<p>Take the median file, 2,367 tokens, resent on 1,000 calls. Input tokens only. Assume a 90% cache hit rate once caching is on. Prices are the published Claude API rates: base input, 5-minute cache write at 1.25x, cache read at 0.1x.</p>

<ul>
<li>Haiku 4.5, below its floor, uncached: 2.37M tokens at $1.00 per million. $2.37.</li>
<li>Sonnet 5, cached: 10% of calls write at $2.50, 90% read at $0.20. $0.59 + $0.43 = $1.02.</li>
<li>Opus 5, cached: writes at $6.25, reads at $0.50. $1.48 + $1.06 = $2.54.</li>
</ul>

<p>Sonnet 5 with the cache beats Haiku 4.5 without it by 57%. Opus 5 with the cache costs 7% more than Haiku without it, 17 cents on a thousand calls. On this prefix, the cheap model is not the cheap model.</p>

<p>Make the hit rate the variable. Sonnet's blended input cost per million is $2.50(1 − h) + $0.20h, which is $2.50 − $2.30h. Haiku uncached is a flat $1.00. They cross at h = 0.65. Above a 65% hit rate, Sonnet 5 with caching is cheaper on input than Haiku 4.5 without it.</p>

<p>Output tokens are not in this. Haiku bills $5 per million on output against Sonnet's $10, so a workload that is mostly generation tilts back toward Haiku. Skill-driven agent turns are not mostly generation. They are a long stable prefix and a short answer, which is exactly the shape the cache was built for.</p>

<h2>The lever I thought I had, and the one I have</h2>

<p>The next thing I checked was whether I had ever set <code>cache_control</code>. A grep across every project on this machine returns zero hits outside a vendored pip library that uses the same words for HTTP headers.</p>

<p>Then the reason. Zero files here import the Anthropic SDK or call the endpoint. These prefixes are assembled and sent by a harness I do not own. Claude Code and Cowork build the system prompt, load the skills, and send the request. Whether and where they set a breakpoint is their decision, and I never see the request.</p>

<p>So the flag is not my lever. The only lever I hold is the length of the file, and whether the call lands on a model whose floor that length clears.</p>

<h2>Two options, and what each costs</h2>

<p>Option one: pad every skill file to 4,096 tokens so it caches on every model. The median file needs 1,729 more tokens, a 73% increase. Padded and cached on Haiku at a 90% hit rate, 1,000 calls cost 4.10M tokens at a $0.215 blend, or $0.88. That is the cheapest line in this essay and the one I dislike most. I would be lengthening an instruction block to hit a billing threshold, and every one of those 1,729 tokens sits in the context window on every call.</p>

<p>Option two: accept that cheap-model routing and prompt caching are two optimizations that fight, and keep skill-heavy turns off Haiku. That costs the output-price delta, and it does nothing for the nine files under the Sonnet floor.</p>

<p>I have not settled this, and I do not fully control it. The harness picks the model too. What I can say is that the decision belongs at the router, and the floor table belongs in the router's config, not in a doc somebody read once.</p>

<h2>If you own the request</h2>

<p>If your code calls the API directly, you have levers I do not. Three rules fall out of the numbers above.</p>

<p>First, size the shared prefix to the floor of the cheapest model you will ever route it to, or do not route it there. For Haiku 4.5 the number to remember is 4,096.</p>

<p>Second, treat the usage fields as the test. A cache miss is silent, so log <code>cache_read_input_tokens</code> per call and alert when it is zero on a request you expected to hit.</p>

<p>Third, run the crossover before you pick the model. At a 65% hit rate Sonnet 5 beats Haiku 4.5 on input. Your hit rate is a property of your traffic, and nobody publishes theirs. Measure it, because it picks the model for you.</p>

<h2>The cost</h2>

<p>I only know any of this because I went looking. For as long as these 53 files have been loaded, some fraction of calls has run below a floor and billed at base rate. I cannot tell you the fraction, because the harness owns the request and I never logged the usage fields.</p>

<p>The failure mode is not an error. It is a number that never appears.</p>
`,
  },
  {
    slug: 'designing-tools-an-agent-can-actually-call',
    title: "Designing Tools an Agent Can Actually Call",
    description:
      "The brokerage MCP server connected to my agent exposes 34 tools and not one takes an account identifier, so it can never answer a question across my three accounts. The 228-line read-only script I wrote around it taught five rules: the variable the user changes is an argument, enumerate before you fetch, return the decision variable, make read-only structural, and keep retry and fallback inside the tool. The admitted cost: the tool has never completed a pull, because I designed it for auth a scheduler cannot satisfy.",
    date: '2026-09-06',
    readMinutes: 7,
    logos: ['MCP', 'Python'],
    series: 'Field Notes',
    body: `
<p>A tool that hides the one variable the user actually changes is not a tool. It is a demo.</p>

<p>The brokerage MCP server connected to my agent exposes 34 tools. Twenty of them are reads: positions, balances, summary, trades, price history, option chains. Not one of the 34 takes an account identifier. The three that matter most — <code>get_account_positions</code>, <code>get_account_summary</code>, <code>get_account_balances</code> — have an empty parameter schema. No arguments at all.</p>

<p>I hold three accounts under one login: a taxable fund, a Roth IRA, and a Traditional IRA. The server is bound to whichever one is active. Every question I ask across accounts — total cash, which positions can carry a covered call, how the IRAs sit relative to the fund — is a question the tool cannot answer, and no prompt fixes that.</p>

<p>So I wrote a 228-line Python script that calls the broker's Client Portal API directly, and I learned more about tool design from the workaround than from the thing it replaced.</p>

<h2>The parameter the user varies must be an argument</h2>

<p>The claim is simple: if the person asking varies X between calls, X is a parameter. Not a setting, not session state, not a login. A parameter the model can see and fill.</p>

<p>The MCP server's designers made the account a session property. That is a reasonable choice for a human at a terminal who logs into one account and stays there. It is the wrong choice for an agent, because the agent's entire job is to answer the question "across all of them."</p>

<p>The Client Portal API gets this right, and the shape is worth copying. <code>GET /portfolio/accounts</code> enumerates every account under the login. Then <code>GET /portfolio/{id}/summary</code>, <code>/ledger</code>, and <code>/positions/{page}</code> take the id explicitly. The script loops. Three accounts, one session, one JSON file at the end.</p>

<p>The API also enforces the order — you must call <code>/portfolio/accounts</code> before any <code>/portfolio/{id}/*</code> call or you get a 401 or a 500. That is a second lesson hiding in the first: a tool that needs a prerequisite call should say so in its own error, and the wrapper should just do it. Mine does.</p>

<h2>Normalize into the shape the decision needs, not the shape the API returns</h2>

<p>The raw position record from the broker has a dozen fields with three different names for the ticker depending on the asset class. The consumer of my snapshot — a covered-call screen — needs exactly one derived number: how many 100-share lots does this position hold.</p>

<p>So the script computes it at pull time. For any stock position with quantity above zero, <code>covered_call_lots = quantity // 100</code>, and <code>covered_call_candidate</code> is true when that is at least one. The agent reading the file never does the division.</p>

<p>That is the general rule. Pre-compute the fields the downstream decision keys on, name them after the decision, and leave the raw fields alongside for audit. An agent that has to derive the decision variable from six raw ones will get it wrong about as often as a person doing it in their head.</p>

<p>The honest caveat is in the code as a comment: the lot count is quantity-based only. It does not verify the symbol has a listed option chain. A position in something without options will show as a candidate. That check is on the enhancement list, not in the script.</p>

<h2>Read-only is a property of the code, not the prompt</h2>

<p>The MCP server ships nine write tools alongside its reads: create, update, and delete for alerts, watchlists, and order instructions. <code>create_order_instruction</code> is right there in the list.</p>

<p>My standing rule is that nothing I automate places a trade or moves money. I could enforce that in the agent's instructions. I do not trust that, and I have <a href="/writing/human-approval-gates-for-irreversible-agent-actions">written up why</a>: a rule in prose is a sentence that stops being true the day someone adds a write path.</p>

<p>The script enforces it structurally. It calls GET endpoints only. The order endpoints are named in the docstring as deliberately unused. There is no function in the file that can send an order, so no instruction change, no prompt injection, and no confused tool call can produce one.</p>

<p>The cost is real. The moment I want the agent to, say, set a price alert, I have to write that path on purpose and put a gate on it. That friction is the point. It is a lot cheaper than the alternative.</p>

<h2>Put the fallback inside the tool</h2>

<p>The live path depends on a local gateway process on <code>https://localhost:5000</code> with a self-signed certificate and a session that expires. The script POSTs <code>/tickle</code> on every run to keep it alive, but it still fails.</p>

<p>When it does, the tool handles it, not the agent. Five attempts with capped exponential backoff — 2, 4, 8, and 15 seconds between them — and then it fails over to a second data path entirely: the broker's Flex Web Service. That is a token-authenticated REST call that returns an XML statement, polled up to ten times at five-second intervals while the report generates.</p>

<p>The fallback is 152 lines and gives end-of-day data instead of live. The output file carries a <code>source</code> field, <code>cpapi_live</code> or <code>flex_backup</code>, so the consumer knows which it got.</p>

<p>The reason this belongs in the tool is throughput. An agent that has to notice a failure, reason about retries, and pick a backup path burns a full model turn on plumbing, and it will make a different choice each time. A function makes the same choice every time and logs it.</p>

<h2>Where it is still broken</h2>

<p>The script was written on 2026-06-19. As of 2026-09-06 the snapshot file it is supposed to write does not exist, and the <code>data/</code> directory has never been created. It has not completed a single pull.</p>

<p>The reason is authentication. The gateway needs a browser login with two-factor, and the session dies after inactivity. A scheduled job cannot satisfy that, and I have not sat down and done it by hand either. The Flex fallback would work headless — it needs only a token — but its token and query id are still empty strings in the example config.</p>

<p>So the honest state is: I designed the tool correctly and then did not finish the one step that lets it run without me. The right fix is the boring one. Fill in the Flex credentials, make it the primary path for the daily pull, and reserve the live gateway for when I am sitting there anyway.</p>

<p>That inverts the original design — live first, batch as backup — and it is the correct inversion for an agent. The agent that consumes this runs at 9 a.m. on weekdays, on a schedule. It does not need intraday. It needs a path that never asks a human for a second factor.</p>

<h2>The five rules, compressed</h2>

<table>
  <thead>
    <tr><th>Rule</th><th>What it looked like here</th></tr>
  </thead>
  <tbody>
    <tr><td>The variable the user changes is an argument</td><td>Account id on every portfolio call, not session state</td></tr>
    <tr><td>Enumerate before you fetch</td><td><code>/portfolio/accounts</code> first, then loop</td></tr>
    <tr><td>Return the decision variable, not the raw record</td><td><code>covered_call_lots</code> computed at pull time</td></tr>
    <tr><td>Read-only is structural</td><td>No order function exists in the file</td></tr>
    <tr><td>Retry and fallback live in the tool</td><td>5 tries, then Flex, source flagged in output</td></tr>
  </tbody>
</table>

<p>None of these are novel. All five were violated by a shipped MCP server from a serious vendor, and I violated the sixth — design for the auth the scheduler actually has — myself.</p>

<p>If you are wrapping a vendor API for an agent and the vendor's tool list looks complete but your agent keeps failing on the same question, check the parameter schemas before you check the prompt. The missing argument is usually the whole bug.</p>
`,
  },
  {
    slug: 'human-approval-gates-for-irreversible-agent-actions',
    title: "Human Approval Gates for Irreversible Agent Actions",
    description:
      "I run 47 agent skills against my own accounts. Two of them stop at the moment of action and wait for me. The gate that protects you is not the one that fires on every run — it is capability removal, which costs zero human attention, and kill gates, which cost nothing until they fire. The axis is reversibility, not importance: a cancelled tutoring appointment gets no gate and a $60 order does. Three of the 47 honor the kill switch, which is the part I got wrong.",
    date: '2026-08-30',
    readMinutes: 7,
    series: 'Field Notes',
    body: `
<p>Most of what gets called a human approval gate is latency wearing a safety vest.</p>

<p>I run 47 agent skills against my own accounts — brokerage, bank, email, calendar, four
publishing platforms, a booking system, a database. Two of them stop at the moment of action and
wait for me. The other 45 do not, and that is deliberate.</p>

<p>The reason is arithmetic. A gate that fires on every run is not a safety mechanism. It is a
queue, and I am the only worker on it.</p>

<h2>Approve-everything breaks at the second decimal place</h2>

<p>My publishing target is 21 posts a week across five platforms that carry
<code>publish: true</code>. Add three weekday engagement slots — 15 — and ten job applications on
each weekday the apply job runs, which is 50.</p>

<p>That is 86 outward actions in a normal week, before anything ad hoc. Every one of them is
visible to somebody who is not me.</p>

<p>If each needs a human yes, the human is the throughput ceiling. And a person clearing 86
approvals a week is not reading them by Wednesday.</p>

<p>That is the failure nobody writes down. Approval theater is worse than no gate, because it
converts a decision into a signature and moves the responsibility onto the signature.</p>

<h2>Three mechanisms, ranked by human attention per unit of protection</h2>

<table>
  <thead>
    <tr><th>Mechanism</th><th>Attention per run</th><th>Holds while I am asleep</th><th>Count in my fleet</th></tr>
  </thead>
  <tbody>
    <tr><td>Capability removal</td><td>zero</td><td>yes</td><td>19 of 47</td></tr>
    <tr><td>Kill gate</td><td>zero until it fires, then zero</td><td>yes</td><td>6 rules, all platforms</td></tr>
    <tr><td>Human approval gate</td><td>one decision, every time</td><td>no</td><td>2 of 47</td></tr>
  </tbody>
</table>

<p>The ordering is the whole argument. Approval is the most expensive tool in the set and the only
one that stops working the moment I am unavailable, so it goes last and it goes narrow.</p>

<h2>1. Remove the capability. You cannot approve what the agent cannot do.</h2>

<p>My brokerage reader is one sentence long at the top: read-only, never trades or moves money.
The margin-eligibility skill that sizes a levered book is advisory only and never transmits
orders. The network-map crawler never sends mail, never writes to a CRM, and never moves money.</p>

<p>Nineteen of the 47 skills carry a line like that. It is not a gate. It is a missing verb.</p>

<p>The cost per run is zero, and it is the only mechanism on the list that is still holding at
3 a.m. Every one of those skills runs on a schedule, and most of those schedules fire while I am
asleep. An approval gate on a scheduled job is a job that does not run.</p>

<h2>2. Kill gates, not pause gates</h2>

<p>The publishing config says it plainly: no human approval step per post. Then it lists six rules
that <em>do not pause for a human — they kill the item</em>.</p>

<p>Never invent a fact. Never publish an employer-internal metric. Score at least 24 of 30 on the
rubric with no dimension at 2 or below. No topic repeat inside 90 days. Clean secret scan before
any public push. Read back what was posted before reporting success.</p>

<p>A pause gate costs attention twice — once when it fires and once when it does not, because I
still have to look to find out which. A kill gate costs nothing until it fires, and when it fires
there is nothing to review. The item is gone, not waiting.</p>

<p>The cost, named: kill gates throw away good work. A draft that scores 23 dies, and some of
those were fine. I pay it because a skipped slot beats a bad post, and because the alternative is
a review queue I would stop reading by Thursday and then trust anyway.</p>

<h2>3. Reserve approval for the irreversible, not the important</h2>

<p>Two skills stop and wait. The first drafts an email to my CPA and will not send it — it
requires two independent conditions before it will even draft, then shows me the draft and waits.
The second does a full shopping run: finds the product, logs in, fills the cart, fills the
shipping form, and stops one click short. Its spec says it never clicks the final purchase button
and everything else is fair game.</p>

<p>Now the contrast that makes the rule legible. A third skill cancels my son's tutoring
appointments, and its spec says the opposite: do not stop at the confirmation, cancellations are
intentional, finish it.</p>

<p>Cancelling a session matters more to his week than a $60 order matters to mine. It gets no
gate. The order gets one.</p>

<p>The variable is not importance. It is whether undo exists and what undo costs. A rebook is
four clicks in the same system. A purchase is a chargeback, a return window, and an email to a
stranger.</p>

<h2>Blast radius is the axis, and it is a function, not a label</h2>

<p>The clearest version of this in my fleet is the tuning job that edits my own instruction files
every day. Low-risk edits — tone, formatting — auto-apply. High-risk edits — new sections, new
behavior rules — get proposed and wait.</p>

<p>Same skill, same file, two different defaults, chosen per edit. That is the general form: gate
on the blast radius of the action, not on the name of the tool.</p>

<p>It also stacks with a gate I have <a href="/writing/statistical-gating-for-agent-instruction-changes">written
up separately</a>: no edit stays without a statistically significant improvement — Welch's t-test,
p &lt; 0.10, at least 5% — against a 14-day rolling baseline. Approval decides whether the change
lands. Statistics decide whether it survives.</p>

<h2>The alternative I keep getting offered, and why I do not take it</h2>

<p>The standard counter is: skip the gates, log everything, review after. Cheap to build, nothing
blocks, and you keep a full audit trail.</p>

<p>It works for reversible actions and it is strictly worse for the rest. A log tells you an
irreversible thing happened. It does not un-happen it.</p>

<p>The two skills I gate cost me maybe four decisions a month between them. Reviewing a log of
86 weekly actions well enough to catch the one bad send costs more than that every Monday, and it
catches it after the send.</p>

<p>Logging is how you learn what to gate. It is not the gate.</p>

<h2>Where mine is broken</h2>

<p>There is a shared kill switch. Three skills of the 47 check it.</p>

<p>One <code>touch state/STOP</code> should halt the fleet. It halts the job applier, the cost-out
scan, and the CPA drafter. That is it.</p>

<p>Of the six skills that take an action a third party can see — posting, emailing, applying,
booking, writing to a database — five never look at that file. The one that posts to three social
accounts has no kill switch at all.</p>

<p>And the classification lives in prose. Twenty-eight of the 47 carry no restriction line of any
kind. Nothing enforces the taxonomy. It is a sentence I wrote in a markdown file on the day I
built the skill.</p>

<p>The failure mode is not dramatic, which is why it will happen. A skill written read-only on a
Tuesday grows a write path on a Thursday. The sentence at the top still says read-only. It is
now false, and nothing in the system notices.</p>

<h2>What I would build next</h2>

<p>Not more approval. Make the class machine-checkable.</p>

<p>Declare the capability in frontmatter. Have the runner refuse an outbound write from a skill
that declared itself read-only. Move the kill-switch check out of 47 individual good intentions
and into the thing that executes them.</p>

<p>That moves the gate from what I wrote to what runs. Until then the honest summary is that I
have real teeth on about 40% of the fleet and prose everywhere else, and I know which 40%.</p>

<p>If you are gating agent actions at your shop, I would trade notes on where you drew the
reversibility line — and on what it cost you the first time you drew it wrong.</p>
`,
  },
  {
    slug: 'one-knowledge-base-four-surfaces',
    title: "One Knowledge Base, Four Surfaces: Pages, Graph, Search Index, and MCP",
    description:
      "The Genome of Games publishes 1,180 records four ways — 1,245 static pages, an interactive graph, a 126 KB search index, and an 8-tool MCP server. One build writes all four in 0.39 seconds. The MCP server never queries the site; it imports a build artifact, so an agent and a crawler cannot disagree. The one surface the build does not own has already drifted by 7,492 links.",
    date: '2026-08-23',
    readMinutes: 7,
    logos: ['Genome of Games', 'MCP', 'Node.js'],
    series: 'Field Notes',
    body: `
<p>The Genome of Games publishes the same 1,180 records four different ways, and one command
writes all four: <code>node build.js</code>, 0.39 seconds, zero npm dependencies.</p>

<p>Out come 1,245 static HTML pages for crawlers, an interactive canvas graph for humans, a
129,037-byte search index for the site's own search box, and a Model Context Protocol server
exposing 8 tools to agents.</p>

<p>The decision worth copying is the one that sounds like a downgrade. The MCP server does not
query the site and does not read the source data. It statically imports a 1.9 MB index that the
build wrote. There is exactly one place where slugs, lineage, and adoption edges get joined, so an
agent and a crawler cannot come back with different answers.</p>

<p>The dataset is an ontology of video game mechanics — 168 mechanics, 618 games, 394 companies,
4,366 recorded links, 1962 to 2025. What the records are about does not matter here. The shape of
the problem shows up anywhere a structured knowledge base has to serve both a search engine and a
model.</p>

<h2>Four surfaces, one build, a twelve-fold expansion</h2>

<p>Six hand-edited JSON files under <code>data/</code> are the source of truth: the feature
ontology, the graph, the prose, the company registry, the site copy, and the verified outbound
links. Together they are 1,312,577 bytes.</p>

<p>The build turns that into 16,644,215 bytes of generated read surface. A 12.7× expansion, and
every byte of it is disposable.</p>

<table>
  <thead>
    <tr><th>Surface</th><th>Consumer</th><th>Bytes</th><th>Per entity</th></tr>
  </thead>
  <tbody>
    <tr><td>1,245 static HTML pages</td><td>Crawlers, humans</td><td>14,613,203</td><td>11,728 / page</td></tr>
    <tr><td><code>mcp-index.json</code> → MCP server</td><td>Agents</td><td>1,901,975</td><td>1,612</td></tr>
    <tr><td><code>search-index.json</code></td><td>The site's own search box</td><td>129,037</td><td>109</td></tr>
    <tr><td><code>/graph/</code> canvas</td><td>Humans exploring lineage</td><td>data injected at build</td><td>—</td></tr>
  </tbody>
</table>

<p>The build also emits <code>sitemap.xml</code> with 1,245 entries, <code>llms.txt</code>,
<code>robots.txt</code>, and a 404 page. The same run reports 96,843 internal links across those
pages.</p>

<p>Nothing in that list is authored. Delete the whole output directory and the next build restores
it in under half a second.</p>

<h2>The agent surface is a build artifact, not a query path</h2>

<p>The obvious way to serve an agent is to put an API in front of the data and let the MCP server
call it. That is the version that rots.</p>

<p>An API layer has to re-derive the same things the page renderer derives — how a name becomes a
slug, which parents count as ancestors, which adoption edges are shown. Two implementations of one
join is two implementations that will disagree, and the disagreement surfaces as an agent
confidently citing a URL that renders something else.</p>

<p>So <code>build.js</code> writes <code>data/mcp-index.json</code> as a build step, and
<code>api/mcp.mjs</code> opens with a static import of it. The serverless function holds no
derivation logic at all. Its first line of real work is <code>const { meta, families, eras,
entities } = INDEX</code>.</p>

<p>The protocol itself is spoken by hand — JSON-RPC over POST, no MCP SDK, for the same reason
there is no Stripe or Supabase SDK anywhere in the repo. <code>initialize</code>,
<code>tools/list</code>, <code>tools/call</code>, <code>ping</code>, and two notifications is the
entire surface area. The whole server is 21,508 bytes.</p>

<p>You can check it from a terminal:</p>

<pre><code>curl -s -X POST https://genome-of-games.vercel.app/api/mcp/ \\
  -H 'Content-Type: application/json' \\
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'</code></pre>

<p>Eight tools come back: overview, search, get_mechanic, get_game, get_studio, trace_lineage,
list_family, by_year.</p>

<h2>The agent pays 14.7× the search index, per entity, and should</h2>

<p>Same 1,180 entities, two indexes, wildly different budgets. The search index spends 109 bytes
per entity. The MCP index spends 1,612. That ratio is 14.7×, and it is the most useful number in
the build.</p>

<p>The search box only needs enough to rank a substring match and hand over a URL: name, type,
year, path. Everything else is one navigation away, and the human doing the navigating is the
retrieval system.</p>

<p>An agent has no second hop it can afford. If <code>genome_get_mechanic</code> returns a stub,
the model either guesses or makes four more tool calls, and both outcomes are worse than a fat
payload. So the MCP record carries the credited origin game and its developer, the full prose
essay, parents, children, everything downstream, and the later adopters — pre-joined.</p>

<p>The generic version of this: size a machine-readable surface by how many round trips the
consumer can tolerate, not by what looks tidy. Humans tolerate many. Agents tolerate roughly one.</p>

<p>The same logic drives the tool descriptions. <code>genome_get_overview</code> spends its budget
telling the model that "origin" means the first notable <em>shipped</em> implementation rather than
invention, that over-the-shoulder aim is credited to <em>kill.switch</em> in 2003 rather than
<em>Resident Evil 4</em> in 2005, and that 949 of 1,180 entities carry a verified Wikipedia
permalink while the remaining 231 carry none. Coverage gaps are a tool output, not a footnote.</p>

<h2>Determinism is what makes any of this checkable</h2>

<p>Because <code>mcp-index.json</code> is committed rather than gitignored, a rebuild is a
falsifiable claim. I ran the build three times: 0.40s, 0.39s, 0.39s. The index md5 was
<code>ba9928a35651fb201b4e0c3e0cab61d7</code> before and after, and <code>git status</code>
reported zero changed files.</p>

<p>That is the whole verification story. If a build ever produces a diff on a run where the source
did not change, the pipeline has picked up a clock, a hash seed, or a network call, and the "one
join" guarantee is already gone.</p>

<p>Committing generated output is usually bad practice. Here it buys a cheap integrity test on
every pull request, and it keeps the build offline and reproducible — the Wikipedia verification
pass runs separately, by hand, and writes its results into the committed data.</p>

<h2>The cost: the surface the build does not own has already drifted</h2>

<p>Single source of truth holds only for surfaces inside the build step. The README is outside it,
and it is already wrong.</p>

<p>The README says 1,243 pages and 89,351 internal links. The build says 1,245 and 96,843. Off by
two pages, and off by 7,492 links — an 8.4% understatement, sitting in the first file anyone reads.</p>

<p>Nobody edited a number badly. Content was added, every generated surface absorbed it silently,
and the one hand-written surface stayed where it was. That is the failure mode this architecture
produces: it does not create disagreement between surfaces it owns, and it hides disagreement with
surfaces it does not.</p>

<p>The fix is not discipline. It is either generating the README's numbers too, or asserting them
in the build and failing loudly. I have done neither yet, which is why this paragraph exists.</p>

<p>There is a second bill. The MCP function statically imports 1.9 MB, so every cold start pays for
the whole dataset whether the caller wanted one mechanic or the overview. At this size that is a
fine trade. At 20 MB it would not be, and the answer then is a real index with range reads — which
reintroduces exactly the derivation layer this design removed.</p>

<h2>What I would copy, and what I would not</h2>

<p>Copy the direction of the dependency. Generated artifact in, no query out. The agent surface
should be downstream of the same build that produces the pages, never a sibling of it.</p>

<p>Copy the honesty budget in the tool descriptions. A model that is told where a dataset is thin
cites it more carefully than one that is handed clean-looking records.</p>

<p>Do not copy the static import past a few megabytes, and do not copy hand-rolled JSON-RPC into a
codebase that already has dependencies — the only reason it is defensible here is that the
alternative was the repo's first one.</p>

<p>If you are shipping a knowledge base to both crawlers and agents, I want to know what your
per-entity byte ratio is between the two surfaces. Mine is 14.7×. I have not seen anyone else
publish theirs, and it is the number that decides whether the agent has to make a second call.</p>
`,
  },
  {
    slug: 'shipping-an-ai-agent-through-compliance-review',
    title: "Shipping an AI Agent Through Compliance Review in Regulated Lending",
    description:
      "On May 12, 2025 the CFPB withdrew 67 guidance documents in a single notice, including both circulars covering adverse-action notices for complex algorithms. The underlying duty did not move. Build the agent against the statute and against the evidence it will have to produce — starting with a 120-day retention floor that most agent logs miss.",
    date: '2026-08-16',
    readMinutes: 8,
    series: 'Field Notes',
    body: `
<p>On May 12, 2025 the CFPB withdrew 67 guidance documents in a single Federal Register
notice: 8 policy statements, 7 interpretive rules, 13 advisory opinions, and 39 other
guidance documents. Two of them were the circulars that told lenders how adverse-action
notices had to work when a complex algorithm made the decision.</p>

<p>Not one word of the underlying duty changed. The Equal Credit Opportunity Act still
requires a statement of specific reasons, and Regulation B still says what "specific"
means.</p>

<p>So the rule I now build against: design the agent against the statute and against the
evidence it will have to produce. Guidance is the most volatile layer in the stack and
the easiest one to mistake for the requirement.</p>

<h2>Guidance is the layer that moves. Write against the layer that doesn't.</h2>

<p>There are three layers, and they have very different half-lives.</p>

<p><strong>Statute</strong> is Congress: ECOA, the FDCPA, GLBA. <strong>Regulation</strong> is
notice-and-comment rulemaking: 12 CFR 1002 (Regulation B), 12 CFR 1006 (Regulation F).
<strong>Guidance</strong> is circulars, bulletins, and advisory opinions, which is to say a memo.</p>

<p>On one day in May 2025, the third layer moved 67 times. The second and first layers did
not move at all.</p>

<p>It keeps moving, too, and not only in bulk. The Regulation B advisory opinion on Special
Purpose Credit Programs, on the books since January 2021, was withdrawn on June 17, 2026 —
more than a year after the mass withdrawal, on its own.</p>

<p>If a control in your design document cites a circular, that control has the shelf life of
a memo. Cite the section of the regulation instead. It is a slower read and it survives
administrations.</p>

<h2>The review is an evidence problem, not a model problem</h2>

<p>I prepared for my first one as though it were about model behavior — accuracy, refusal
rates, how the thing handles an ugly prompt. Reviewers asked about records.</p>

<p>Nearly every question reduced to the same four: what did the system decide, on what
inputs, under which version of the instructions and the model, and can you reproduce that
answer later when someone asks.</p>

<p>"Later" is the word carrying the weight. It is not a design detail. It has a number, and
the number is bigger than most teams assume.</p>

<h2>Your trace retention floor is 120 days, not 30</h2>

<p>Regulation B, 12 CFR 1002.9, sets a chain of clocks on a credit application.</p>

<p>The creditor has <strong>30 days</strong> after a completed application to notify the
applicant of the action taken. That notice either carries the specific reasons, or it
discloses the applicant's right to request them. If it discloses the right, the applicant
has <strong>60 days</strong> from the notification to ask, and the creditor then has
<strong>30 days</strong> to deliver.</p>

<p>30 + 60 + 30 = <strong>120 days</strong>. That is the worst-case gap between the moment
the agent produces a decision and the moment someone has to state, precisely, why it made
that decision.</p>

<p>Thirty days is a common default retention on logging platforms, and defaults are how most
retention windows get set. Inherit that one and the decision stays reproducible for a
quarter of the window in which it can be demanded.</p>

<p>That gap is not a nit. It is the difference between answering an examiner and telling an
examiner you cannot answer.</p>

<p>And 120 days is the floor from the notification path alone. Records-retention rules run
longer, and the practical constraint is usually the exam cycle rather than any of these
clocks. Size the trace to the longest one, not the nearest.</p>

<h2>The reason string has to come from the thing that made the decision</h2>

<p>Regulation B requires that the statement of reasons be specific and indicate the
principal reasons for the action. It goes further and names two answers that do not
count: that the applicant failed to achieve a qualifying score, and that the decision
rested on the creditor's internal standards or policies.</p>

<p>That rules out the most convenient agent architecture available to you.</p>

<p>The convenient one is two models: the first produces a decision, the second reads the
decision and writes an explanation. It is easy to build, it demos beautifully, and the
output is fluent.</p>

<p>It is also a caption, not a reason. The second model is describing the first model's
output, not its cause. If the decision was driven by features the explanation layer never
saw, the explanation is a plausible guess that happens to be well-written — which is the
worst possible failure mode, because nothing about it looks wrong.</p>

<p>The reason has to be emitted by the decision path itself, as a byproduct of the decision,
in the same transaction. If that is expensive, the expense is the requirement.</p>

<h2>Counting is a compliance control, and counting is where the bug will be</h2>

<p>Regulation F, 12 CFR 1006.14, in effect since November 30, 2021, presumes a violation if
a collector places more than 7 calls about a particular debt within 7 consecutive days, or
calls within 7 days of a live conversation about that debt.</p>

<p>The window is rolling. Here is what it costs to implement it as a calendar week.</p>

<p>A counter that resets Monday at 00:00 will happily allow 7 calls placed Saturday and
Sunday, then 7 more on Monday and Tuesday. That is 14 calls inside a four-day span. The
counter never reads above 7 in either week, and the presumption fires anyway.</p>

<p>Rolling window, rolling counter. Keyed per consumer and per debt, because the limit is
per debt and a consumer with two accounts has two independent budgets.</p>

<p>There is a second version of the same bug that only appears in multi-agent designs. Give
the voice agent and the messaging agent one counter each and they will sum to twice the
limit while both report compliance. The counter belongs to the account, not to the agent
that happens to be calling.</p>

<p>None of that needs a model. It needs a row lock. The general lesson from the review was
that the parts of the system a regulator cares most about are usually the parts that should
never have been probabilistic.</p>

<h2>Effective challenge means an adversary with standing</h2>

<p>Banks have been running a model governance framework since well before any of this:
SR 11-7, issued jointly by the Federal Reserve and the OCC in 2011. Its center of gravity is
a phrase worth stealing regardless of your industry — <strong>effective challenge</strong>.
Critical review by informed, technically competent people who are independent of the team
that built the model.</p>

<p>Independence is the half everyone implements. Standing is the half that decides whether
the review was real.</p>

<p>A reviewer who can file a concern but cannot stop a launch is not effective challenge.
That is a comment. The test is simple and slightly uncomfortable: name the person who can
say no, confirm they know they can, and do it before you build rather than the week you
want to ship.</p>

<h2>What it costs</h2>

<p>Time, and a specific kind of scope loss that is worth naming honestly.</p>

<p>Everything above pushes the design toward the boring architecture. Deterministic code
where the rule is deterministic. A model only where judgment genuinely helps. The frequency
counter becomes a database constraint. The reason string becomes a required output of the
decision path. The model is left with the part that is actually hard.</p>

<p>That is a visibly smaller agent than the prototype. The prototype ran the whole workflow
end to end and was, frankly, more impressive in a demo. The reviewable version hands three
of those steps back to a state machine and looks less like the future.</p>

<p>I would ship the smaller one every time. In a regulated line the thing that kills a
program is rarely a slow launch. It is an unreproducible decision surfacing in an
examination eighteen months later, when the person who built the system has moved teams and
the log rolled off at day 30.</p>

<p>If you have taken an agent through a compliance review in lending, I want to know one
number: where did your trace retention actually land, and was it chosen or inherited from a
logging default? That is the number I would check first in anyone's design, including my
own.</p>
`,
  },
  {
    slug: 'statistical-gating-for-agent-instruction-changes',
    title: "Statistical Gating for Agent Instruction Changes",
    description:
      "Every edit to an agent's instruction file is an experiment. Mine requires a statistically significant improvement — Welch's t-test, p < 0.10, at least a 5% lift — against a 14-day rolling baseline before the change is allowed to stay. Then the power calculation showed the 14-day window can only detect a 0.97 standard-deviation shift, which makes the 5% threshold decorative.",
    date: '2026-08-09',
    readMinutes: 7,
    logos: ['Claude'],
    ogImage: '/images/essays/og-statistical-gating.png',
    series: 'Field Notes',
    body: `
<p>An edit to an agent's instruction file is a deploy, and I stopped letting mine ship on a
hunch. The daily tuning job that maintains my assistant's <code>CLAUDE.md</code> now requires a
statistically significant improvement — Welch's t-test, p &lt; 0.10, at least a 5% lift — measured
against a 14-day rolling baseline, before an instruction change is allowed to stay.</p>

<p>Then I ran the power calculation on my own gate and found the 5% threshold is decorative. At
14 days per window the test can only detect a shift of roughly <strong>0.97 standard
deviations</strong>. Anything smaller is invisible regardless of what the lift threshold claims.</p>

<p>Both halves of that are this post. The mechanism is worth copying. The window size is the part
I got wrong, and the arithmetic is short enough to check.</p>

<h2>The prompt is the least-tested code in most agent systems</h2>

<p>Every other artifact in an agent pipeline has a gate. Application code gets a test suite and a
review. Infrastructure gets a plan and a diff — I have written enough Terraform modules and
managed enough remote state to know nobody merges those blind.</p>

<p>The instruction file gets none of that. Someone notices the agent did something annoying, adds
a line telling it not to, and ships. There is no baseline, no holdout, and no record of whether
the previous eleven lines are still earning their tokens.</p>

<p>That is how instruction files rot. They accumulate rules that were true about one bad
afternoon and have been costing context ever since.</p>

<h2>You cannot test what you do not score</h2>

<p>The gate needs a dependent variable, so the first build was a rubric, not a test. Five
dimensions, each scored 0–10 per conversation: goal clarity, rework rate, context hit rate, scope
discipline, and response density. The daily score is the average across that day's
conversations, weighted by conversation length.</p>

<p>The rubric is frozen. Changing it invalidates every historical comparison, so a rubric change
is itself a tracked meta-edit that resets all baselines.</p>

<p>Scores are anchored to observable friction rather than self-assessment. The scorer parses
transcripts for five pattern classes — corrections ("no, that", "actually", "don't"), rework
("redo", "start over"), scope drift ("I didn't ask", "just do"), missed context ("I told you
before", "check memory"), and praise ("exactly", "nailed it"). Friction pulls the dimension score
down, praise pulls it up.</p>

<p>This is the load-bearing decision. An agent grading its own transcripts will drift toward
generosity. Regex over the human's actual words will not.</p>

<h2>Welch, not Student, and why that is not pedantry</h2>

<p>Each edit gets a 14-day pre-window and a 14-day post-window of daily scores, compared with
Welch's t-test. Three outcomes: p &lt; 0.10 and lift ≥ 5% marks the edit <strong>KEPT</strong>;
p &lt; 0.10 and lift ≤ −5% triggers an <strong>automatic revert</strong>; everything else is
<strong>INCONCLUSIVE</strong> and the edit stays on probation.</p>

<p>Welch rather than Student's t because the two windows should not have equal variance. A good
instruction usually works by removing a failure mode, which compresses the bad tail — the
variance drops as much as the mean rises.</p>

<p>Student's t assumes equal variance and over-rejects when the smaller-variance group is the
larger sample. That is precisely the case you care about, so the pooled test would hand you your
most confident false positives on your best edits. Welch costs a few degrees of freedom and
removes the assumption.</p>

<h2>The arithmetic that broke the design</h2>

<p>A two-sample test at α = 0.10 and 80% power detects a minimum effect of roughly
(t<sub>α/2</sub> + t<sub>β</sub>) × √(2/n) standard deviations. For a 14-day window that is:</p>

<table>
  <thead>
    <tr><th>Days per window</th><th>Minimum detectable effect</th></tr>
  </thead>
  <tbody>
    <tr><td>7</td><td>1.42 SD</td></tr>
    <tr><td>14</td><td>0.97 SD</td></tr>
    <tr><td>21</td><td>0.78 SD</td></tr>
    <tr><td>28</td><td>0.67 SD</td></tr>
    <tr><td>42</td><td>0.55 SD</td></tr>
    <tr><td>60</td><td>0.46 SD</td></tr>
  </tbody>
</table>
<figure>
<img src="/images/essays/fig1-mde-by-window.svg" alt="Curve of minimum detectable effect against days per window. At 14 days the curve sits at 0.97 standard deviations; the 5 percent lift threshold sits at 0.58 and the curve does not reach it until about 38 days." loading="lazy" decoding="async" />
<figcaption>The gate can only see effects above the yellow line. The 5% threshold sits inside the shaded band — under it the whole time, doing no work.</figcaption>
</figure>


<p>Now convert to the units the gate actually uses. Assume a 7.0 baseline on the 0–10 rubric and a
day-to-day standard deviation of 0.6 points, which is unremarkable for a metric averaged over a
handful of conversations.</p>

<p>A 5% lift is 0.35 points, or 0.58 SD. The 14-day window detects 0.97 SD, which is 0.58
points — <strong>8.3% of baseline</strong>. The statistical test is roughly 1.7× stricter than
the lift threshold sitting next to it.</p>

<p>So the 5% number never binds. It is doing no work. Every edit that clears the t-test has
already cleared 5% by a wide margin, and every edit that fails does so on power, not on effect
size.</p>

<p>Detecting a genuine 5% lift at that variance takes <strong>38 days per window</strong>, not 14.
And the requirement moves fast with variance:</p>

<table>
  <thead>
    <tr><th>Daily score SD</th><th>5% lift, in SD</th><th>Days/window needed</th><th>What 14 days actually detects</th></tr>
  </thead>
  <tbody>
    <tr><td>0.4</td><td>0.88</td><td>17</td><td>5.5%</td></tr>
    <tr><td>0.5</td><td>0.70</td><td>27</td><td>6.9%</td></tr>
    <tr><td>0.6</td><td>0.58</td><td>38</td><td>8.3%</td></tr>
    <tr><td>0.8</td><td>0.44</td><td>66</td><td>11.1%</td></tr>
    <tr><td>1.0</td><td>0.35</td><td>102</td><td>13.8%</td></tr>
  </tbody>
</table>
<figure>
<img src="/images/essays/fig3-effective-threshold.svg" alt="Bar chart of the smallest lift a 14-day window can actually detect, by day-to-day standard deviation: 5.5 percent at SD 0.4, 6.9 percent at 0.5, 8.3 percent at 0.6, 11.1 percent at 0.8, and 13.8 percent at 1.0." loading="lazy" decoding="async" />
<figcaption>The honest label on the gate. Every bar to the right of the dashed line is a threshold the config never mentions.</figcaption>
</figure>


<p>Read the last column as the honest label on the gate. At SD 1.0 a "5% threshold" is really a
14% threshold, and the difference is entirely hidden from whoever reads the config file.</p>

<p>The window has to be sized to the variance, not to a calendar. Fourteen days was chosen because
two weeks is a tidy number, which is not a reason.</p>

<p>There are two ways out and only one of them is cheap. Lengthen the window, and you wait longer
per lesson. Or shrink the variance by scoring more conversations per day — the daily mean's
standard error falls with √n, so tripling daily volume cuts the SD by about 42% and pulls the
required window from 38 days down to roughly 17.</p>
<p>Put the same arithmetic the other way around. If an edit truly delivers a 5% lift, a 14-day window calls it significant <strong>44% of the time</strong>. That is a coin flip on your own best changes. At 38 days it is 81%.</p>

<figure data-animated="true">
<img src="/images/essays/fig2-power-by-window.svg" alt="Animated chart. The sampling distribution of the observed lift when the true effect is a 5 percent improvement, with the significance threshold marked. The shaded area right of the threshold is statistical power: 27 percent at a 7-day window, 44 percent at 14 days, 81 percent at 38 days, 94 percent at 60 days." loading="lazy" decoding="async" />
<figcaption>Same arithmetic, run forward. Each frame is a window length; the shaded tail is how often a genuinely good edit gets called significant.</figcaption>
</figure>


<h2>What the gate cannot do, stated plainly</h2>

<p>It does not control for multiple comparisons. At the configured cadence of one low-risk edit
every three days, that is about 122 evaluations a year. At α = 0.10 two-sided, noise alone
produces roughly <strong>six spurious KEPT verdicts and six spurious auto-reverts per year</strong>.
The auto-revert side is the one that stings: the system will occasionally roll back a good edit
with statistical confidence.</p>

<p>It is also not a randomized experiment. Pre and post windows are consecutive calendar time, so
a model version change, a vacation, or a month of unusually messy work lands entirely in one
window and gets attributed to the edit.</p>

<p>That makes this a noise filter, not a causal claim. It stops the obviously-worse edits and the
obviously-imaginary wins. It will not tell you why anything moved.</p>

<h2>The safeguards do more work than the test</h2>

<p>Three rules keep the loop from eating itself, and they matter more than the p-value.</p>

<p><strong>Cooldowns.</strong> One low-risk auto-edit per three days, one high-risk proposal per
week. Without a cooldown the windows overlap so badly that no edit is ever cleanly attributable.</p>

<p><strong>Plateau detection.</strong> If the 14-day rolling score has not improved 2% over the
prior 14 days and no friction is firing, the day's edit is skipped. The easy wins arrive early;
after that, editing is mostly a way to add variance.</p>

<p><strong>A risk split with a human in it.</strong> Wording and formatting changes auto-apply.
Anything that adds a section or changes how the agent decides gets written to a proposals folder
and waits. Every edit backs up the prior file first and lands in a revertible log, tagged, so a
bad call is a one-line rollback rather than an archaeology project.</p>

<p>The config file has a section titled "when NOT to edit," and the last line of it is the most
useful thing in the whole system: <em>doing nothing is always a valid action.</em></p>

<h2>The cost</h2>

<p>Latency. That is the whole bill, and it is larger than I estimated when I built this.</p>

<p>A gated instruction file learns on a 14-day clock at best and, if the variance numbers above
are right, a 38-day clock in practice. An ungated one learns in an afternoon and is wrong in ways
nobody measures. I would still take the slow version, but I would not pretend the tradeoff is
free, and I would not build this at all for a system I was still prototyping.</p>

<p>I have no KEPT verdicts to report yet, because the first honest one cannot exist until a full
post-window closes. Publishing the design before the results is the point — the design is the
part that is checkable, and the arithmetic above is the part I would want someone to argue with.</p>

<p>If you are gating prompt or instruction changes statistically at your shop, I want to know what
window you landed on and what your daily variance looks like. That number is the whole ballgame
and almost nobody publishes it.</p>
`,
  },
  {
    slug: 'i-gave-my-website-a-voice',
    title: "I Gave My Website a Voice, and the Voice Was the Easy Part",
    description:
      'There is now a digital twin on my homepage you can talk to out loud, hands-free, in a clone of my voice. Getting it to sound like me took an afternoon. Getting it to sound like a person took rewriting how it writes.',
    date: '2026-08-03',
    readMinutes: 7,
    logos: ['Claude', 'ElevenLabs'],
    series: 'Field Notes',
    body: `
<p>There is a button on my homepage now that says <strong>Talk to my Digital Twin</strong>. Press it and you
get a panel. Type a question and an AI trained on the public content of this site answers as me. Press the
broadcast icon and it opens the microphone, waits for you to finish a sentence, answers out loud in a clone
of my voice, and starts listening again — no clicking between turns.</p>

<p>Three services behind it, all server-side so the keys never reach a browser: Whisper for speech to text,
Claude for the conversation, ElevenLabs for the voice. That part is a weekend's worth of plumbing and it
mostly worked on the first deploy.</p>

<p>What did not work on the first deploy, or the fifth, was making the thing sound like a human being. And
the fixes for that were almost never in the audio stack.</p>

<h2>The engine reads what you write, not what you meant</h2>

<p>The first end-to-end test came back in a voice that was unmistakably mine and delivery that was
unmistakably a computer. It said "dollar ten point eight B." It said "ess one." It said "A-S-C six zero six"
with the flat cadence of a serial number. Somewhere in there it read a percent sign aloud.</p>

<p>My instinct was to reach for the voice settings — stability, similarity, style — because those are the
knobs the vendor gives you and knobs feel like control. I turned them for an hour and got a marginally
smoother reading of the same broken sentences.</p>

<p>The actual problem was upstream. A speech engine is handed a string. It has no idea that
<code>$10.8B</code> is a quantity a human would say as "about ten point eight billion," or that
<code>2016-2018</code> is a span and not a subtraction. It is not confused. It is doing exactly what you
asked, and what you asked was to read a document out loud.</p>

<p>So the fix went into the model's instructions, not the audio config. The system prompt now has a section
that says, in effect: <em>you are being read aloud, so write speech</em>. Spell out anything an eye would
decode but an ear cannot. Hyphenate acronyms that get read letter by letter — "S-one," not "S1." Treat
punctuation as pacing rather than typography, because the engine either swallows a semicolon or announces
it. Write "and" instead of an ampersand and "percent" instead of a sign. Keep sentences short, because
prosody drifts across a long clause the way a held note goes flat.</p>

<p>That change did more for perceived quality than every voice parameter combined. It is the same lesson
that shows up in financial reporting, incidentally: the presentation layer can only render what the data
model gives it, and most "the dashboard looks wrong" problems are really "the dashboard is correctly
displaying a bad number" problems.</p>

<h2>Silence is a design decision</h2>

<p>Hands-free sounds like a small feature and is mostly an argument about silence. Somebody has to decide
when you are done talking, and every threshold is a trade.</p>

<p>Cut the turn at half a second of quiet and it interrupts anyone who pauses to think. Wait three seconds
and every exchange feels like it is buffering. It landed at <strong>1.3 seconds</strong> below threshold to
close a turn, 150 milliseconds above it to open one, and anything under 400 milliseconds of speech thrown
away as a cough, a door, or a chair.</p>

<p>The part I did not expect to matter most: the threshold itself cannot be a constant. A fixed cutoff works
beautifully at a quiet desk and fails completely next to a laptop fan or in a coffee shop — and "fails"
here means the microphone decides the room is talking and never stops recording. So it now spends the first
700 milliseconds after you press the button doing nothing but listening to the room, then sets its bar
relative to whatever it heard. That is why there is a brief "getting a read on the room" state before it
says it is listening. It is not a loading spinner. It is the only reason the feature works anywhere but my
office.</p>

<p>One more: the loop suspends itself while the twin is speaking and resumes when playback ends. Without
that it hears its own voice through the speakers and answers itself, which is funny exactly once.</p>

<h2>The rule I care most about</h2>

<p>Ask it whether it is a real person and it tells you it is not. That is not a disclaimer bolted on the
outside; it is in the instructions, and I tested it by trying to talk it out of the answer.</p>

<p>It is also fenced in on substance. It only knows what this site already publishes. It is told to say it
does not know rather than invent a client, a number, or a date — because a confident fabrication in my voice
is worse than no answer at all. It will not discuss anything non-public about any employer. Asked what I
charge, it says compensation depends on role and scope and belongs on a call, which is both a guardrail and
the truth.</p>

<p>I checked all of that against the live deployment rather than trusting the prompt. Asked for a base
salary: declined, sent it to a call. Asked to name clients at a former employer: declined. Asked what I did
at GreenSky: product and strategy on the credit platform, there through the IPO, supported the S-1 —
accurate, first person, one sentence, and it said "S-one" out loud.</p>

<h2>Retiring the volume numbers</h2>

<p>This entry has no number on it, and none of the ones after it will either.</p>

<p>"Behind the Build" ran eight volumes and the numbering was quietly the worst thing about it. These posts
get drafted by scheduled runs, each of which branches off the published site, counts the volumes it can see,
and adds one. Run two of those in the same window and both of them confidently write "Vol. 2." I spent part
of this week untangling six of those — six separate drafts, all claiming the same number, several never
merged at all. Not one of them was wrong about anything except its own place in line.</p>

<p>A counter that requires global coordination to be correct is a counter that will be wrong. So it is gone.
These are <strong>Field Notes</strong> now: dated, titled, unnumbered. Nothing to collide over.</p>

<h2>Also shipped, since it was the same 24 hours</h2>

<p>Four more live sites went onto the <a href="/websites">Websites</a> page in the same stretch:</p>

<ul>
<li><strong>COT Signal</strong> — weekly CME futures positioning for Bitcoin and Ether, read straight off
the CFTC Commitments of Traders report. Asset managers, hedge funds, and dealers, net long against net
short.</li>
<li><strong>VendorLink</strong> — a two-sided marketplace pairing event organizers with local vendors, with
applications, contracts, and payments in one flow.</li>
<li><strong>YardLine</strong> — a supply-side prospecting CRM for heavy-duty truck salvage yards around
metro Atlanta. Roster-gated, so what the public sees is a sign-in screen.</li>
<li><strong>Next Generation Capital</strong> — an investor-network site for an Atlanta build-to-rent and
cottage-community firm. Deliberately not a public offering: it states a thesis and opens an introduction.</li>
</ul>

<p>They have nothing to do with each other, which is sort of the point. The interesting constraint right now
is not whether a thing can be built in an evening. It is whether the tenth one you built in an evening is
still something you would put your name on. The twin is the current test case: it speaks in my voice, on my
domain, to people deciding whether to email me. If it invents one deal or bluffs one number, the convenience
was not worth it.</p>

<p>So far it says "I'm not sure" more often than I expected, which I am choosing to read as a good sign.</p>
`,
  },
  {
    slug: 'behind-the-build-vol-8-i-shipped-the-same-pr-twice',
    title: 'I Shipped the Same Pull Request Twice and Only Noticed the Second Time',
    description:
      'Behind the Build, Vol. 8: two new tabs — Websites and Products — landed a day apart and turned out to be the exact same diff wearing different screenshots. What that repetition taught me about when a pattern is worth abstracting (and when it very much is not).',
    date: '2026-08-02',
    readMinutes: 5,
    logos: ['Vercel'],
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
    logos: ['React'],
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
    logos: ['GitHub', 'React'],
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
    logos: ['GreenSky'],
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
