// PRERENDER CONTRACT — scripts/prerender.js slices this file between
//   `export const projects: Project[] =`  and  `export const getProject`
// and evaluates the slice as plain JavaScript. Inside the array literal:
//   no imports, no identifiers from other modules, no `as const`,
//   no enums / satisfies / type assertions, no template literals that
//   interpolate anything — plain string, number, boolean, array and
//   object literals only.
// Helpers and anything clever go BELOW the `export const getProject` sentinel.

export interface ProjectOutcome {
  /** The claim, carrying its unit. "1,245 static pages from 1,180 records" */
  metric: string;
  /** One sentence of context, so the number is never free-floating. */
  detail: string;
  /**
   * REQUIRED. Where a reader verifies the number: a /writing slug, a /clips
   * slug, a repository, a live URL, or a statutory cite.
   *
   * This field is the whole point of the type. An outcome with nowhere to
   * check it is the kind of claim this site was previously full of
   * ("300%+ ROI", "98%+ satisfaction") and it does not ship again.
   */
  source: string;
  /** Human label for the source link. */
  sourceLabel: string;
}

export interface ProjectArtifact {
  /** 'essay' | 'clip' | 'repo' | 'live' | 'doc' */
  kind: string;
  label: string;
  href: string;
}

export interface Project {
  slug: string;
  title: string;
  /** One sentence, <=160 chars. Doubles as the meta description. */
  summary: string;
  /** ISO date the work shipped. Sorts the index; feeds datePublished. */
  date: string;
  /** 'flagship' | 'case-study' */
  tier: string;
  /** "Regulated consumer lending", "Market structure", "Knowledge graphs" */
  domain: string;
  /** First person, specific verbs. This is the field a reader scans for
   *  "what did HE actually do", as distinct from what the team did. */
  role: string;
  /** HTML. The situation, and why it was hard. */
  problem: string;
  /** The hard limits the solution had to live inside. */
  constraints: string[];
  /** Concrete artifacts that now exist. */
  whatShipped: string[];
  outcome: ProjectOutcome[];
  /** Set when the shareable outcome is still pending. Renders as an explicit
   *  "not yet shareable" note instead of an invented number. */
  outcomePending?: string;
  artifacts: ProjectArtifact[];
  stack: string[];
  image?: string;
  imageAlt?: string;
  /** Author-controlled long-form HTML. Same contract as Article.body. */
  body: string;
}

export const projects: Project[] = [
  {
    slug: 'compliance-reviewed-agent',
    title: 'A Compliance-Reviewed AI Agent in Regulated Lending',
    summary:
      'Took an AI agent capability from prototype through security, legal, and compliance review into production at a regulated consumer lender.',
    date: '2026-08-16',
    tier: 'flagship',
    domain: 'Regulated consumer lending',
    role:
      'I owned the agent capability end to end: the architecture, the tool surface the model was allowed to call, the evidence design that got it through legal and compliance review, and the approval gates on irreversible actions. Engineering built alongside me; the review strategy, the retention decision, and the control design were mine.',
    problem: `
<p>An AI agent that touches a consumer-lending decision is not a model problem. It is an
evidence problem. The organisation can be entirely satisfied that the agent works and
still be unable to ship it, because nobody can produce the artifact a regulator would ask
for eighteen months later.</p>
<p>The moving target made it worse. On May 12, 2025 the CFPB withdrew 67 guidance
documents in a single Federal Register notice &mdash; 8 policy statements, 7 interpretive
rules, 13 advisory opinions, and 39 others. Two of them were the circulars telling lenders
how adverse-action notices had to work when a complex algorithm made the decision. Not one
word of the underlying duty changed: ECOA still requires a statement of specific reasons,
and Regulation B still defines what "specific" means.</p>`,
    constraints: [
      'Guidance is the most volatile layer in the stack and the easiest to mistake for the requirement — the design had to hold when guidance was withdrawn underneath it.',
      'Every agent decision needs a reason string traceable to the component that actually made the decision, not a plausible reconstruction generated after the fact.',
      'Trace retention had to survive the full adverse-action dispute window, not the 30-day default most agent logging ships with.',
      'Irreversible actions could not be model-discretionary.',
      'Review had to satisfy three separate functions — security, legal, and compliance — each with its own definition of sufficient evidence.',
    ],
    whatShipped: [
      'An agent capability running in production inside a regulated consumer lender.',
      'A tool surface designed so the model can only take actions the control design permits, with human approval gates on everything irreversible.',
      'A trace and retention design built to a 120-day floor derived from the statutory dispute window rather than from logging defaults.',
      'An eval harness that treats every instruction-file edit as a deploy requiring evidence.',
      'The written record that carried the capability through security, legal, and compliance review.',
    ],
    outcome: [
      {
        metric: '120-day trace retention floor',
        detail:
          'Derived from the adverse-action dispute window rather than from a logging default. Most agent logging ships at 30 days, which expires before the evidence is ever requested.',
        source: '/writing/shipping-an-ai-agent-through-compliance-review',
        sourceLabel: 'Read the full write-up',
      },
      {
        metric: '67 guidance documents withdrawn, zero design changes required',
        detail:
          'Building against the statute rather than against guidance meant the May 2025 CFPB withdrawal — which removed both circulars covering algorithmic adverse-action notices — did not invalidate the control design.',
        source: '/writing/shipping-an-ai-agent-through-compliance-review',
        sourceLabel: 'Read the full write-up',
      },
      {
        metric: 'An approval path where there had not been one',
        detail:
          'The capability now has a documented route through security, legal and compliance review that a later one can follow. Before this, no agent capability at the company had been through all three.',
        source: '/writing/shipping-an-ai-agent-through-compliance-review',
        sourceLabel: 'How the review was framed',
      },
      {
        metric: 'Reasons emitted by the deciding component, not reconstructed',
        detail:
          'A reason string generated after the fact by a model that did not make the decision is a plausible narrative, not a statement of specific reasons. The tool surface carries the reason out of the component that actually decided.',
        source: '/writing/shipping-an-ai-agent-through-compliance-review',
        sourceLabel: 'Why the reason string has to come from the decision',
      },
      {
        metric: 'Irreversible actions moved behind a human gate',
        detail:
          'Anything the agent cannot undo is not model-discretionary. That is a design property of the tool surface rather than a policy asking the model to behave.',
        source: '/writing/shipping-an-ai-agent-through-compliance-review',
        sourceLabel: 'Read the full write-up',
      },
    ],
    // TODO(michael): the adoption and impact numbers are the one thing this page
    // cannot source from anything already published. To close it, supply:
    //   1. what the agent actually does, in one sentence that clears disclosure
    //   2. when it went live, and over what period it has been running
    //   3. rollout scope — internal users, teams, or volume, if shareable
    //   4. any measured result (review time, handle time, error rate, deflection)
    //   5. which review groups signed off, by function rather than by name
    // Until then this renders as an explicit gap, not an invented number.
    outcomePending:
      'Deployment figures — rollout scope, volume and measured operational results — will be added here as they clear publication review. Everything above is publishable now.',
    artifacts: [
      {
        kind: 'essay',
        label: 'Shipping an AI Agent Through Compliance Review in Regulated Lending',
        href: '/writing/shipping-an-ai-agent-through-compliance-review',
      },
      {
        kind: 'essay',
        label: 'Statistical Gating for Agent Instruction Changes',
        href: '/writing/statistical-gating-for-agent-instruction-changes',
      },
      {
        kind: 'doc',
        label: 'ECOA / Regulation B — statement of specific reasons',
        href: 'https://www.consumerfinance.gov/rules-policy/regulations/1002/9/',
      },
    ],
    stack: ['Python', 'TypeScript', 'Model Context Protocol', 'PostgreSQL', 'Eval harness'],
    image: '/images/essays/fig1-retention-floor.png',
    imageAlt:
      'Chart of the trace retention floor: a 30-day default log expiring well before the 120-day adverse-action dispute window closes.',
    body: `
<h2>By the numbers</h2>
<p>Retention floor: 120 days. Logging default it replaces: 30 days. Guidance documents
withdrawn on 12 May 2025: 67 — 8 policy statements, 7 interpretive rules, 13 advisory
opinions and 39 others. Circulars covering algorithmic adverse-action notices in that
withdrawal: 2. Design changes required as a result: 0. Review functions that had to sign
off: 3 — security, legal and compliance.</p>

<h2>Guidance is the layer that moves. Write against the layer that doesn't.</h2>
<p>The single most useful rule from this work: design the agent against the statute and
against the evidence it will have to produce. Guidance is the most volatile layer in the
stack and the easiest one to mistake for the requirement.</p>

<h2>The review is an evidence problem, not a model problem</h2>
<p>Security, legal, and compliance were not asking whether the model was good. They were
asking what artifact exists, where it lives, how long it survives, and who can produce it
under request. Reframing the work around that question is what moved it.</p>

<h2>The reason string has to come from the thing that made the decision</h2>
<p>A reason generated after the fact by a model that did not make the decision is not a
statement of specific reasons. It is a plausible narrative. The tool surface had to carry
the reason out of the deciding component itself.</p>

<h2>Counting is a compliance control</h2>
<p>Wherever a control depends on a count, the count is where the bug will be. That is not
a maxim &mdash; it is the failure I went looking for and found.</p>
<figure>
<img src="/images/essays/fig2-counter-bug.png" width="920" height="520" loading="lazy"
     alt="The counter bug: a control whose threshold depends on a count, and the off-by-one that let events past it.">
<figcaption>The counting defect, drawn out. A control that depends on a count inherits every
bug in that count &mdash; and the count is rarely the thing anyone reviews.</figcaption>
</figure>

<p><em>The organisation is described here as "a regulated consumer lender" throughout.
The design decisions are mine to discuss; the deployment specifics are not.</em></p>`,
  },

  {
    slug: 'genome-of-games',
    title: 'The Genome of Games — One Knowledge Base, Four Surfaces',
    summary:
      'A build that publishes 1,180 records four ways — static pages, an interactive graph, a search index, and an MCP server — in 0.39 seconds with zero dependencies.',
    date: '2026-08-23',
    tier: 'case-study',
    domain: 'Knowledge graphs · agent-facing infrastructure',
    role:
      'I designed and built the whole pipeline: the source ontology, the build, all four output surfaces, and the MCP tool design. The decision worth copying — having the MCP server import a build artifact rather than query the site — is the one I would defend hardest.',
    problem: `
<p>A structured knowledge base that has to serve both a search engine and a model usually
ends up serving them from different code paths, and the two drift. The crawler sees one
answer, the agent gets another, and nobody notices until someone compares them
side by side.</p>
<p>The Genome of Games is an ontology of video game mechanics — 168 mechanics, 618 games,
394 companies, 4,366 recorded links, spanning 1962 to 2025. What the records describe does
not matter. The shape of the problem shows up anywhere one knowledge base has to answer to
more than one kind of consumer.</p>`,
    constraints: [
      'An agent and a crawler must never be able to return different answers for the same record.',
      'The build had to stay dependency-free and fast enough to run on every commit.',
      'Agents cannot afford a second hop — a tool response that returns a stub is a failed call, not a partial one.',
    ],
    whatShipped: [
      '1,245 static HTML pages for crawlers and humans.',
      'An interactive canvas graph of the full ontology.',
      'A 129,037-byte search index powering the site’s own search.',
      'An 8-tool Model Context Protocol server that statically imports the build artifact rather than querying the site.',
    ],
    outcome: [
      {
        metric: '1,180 records → four surfaces in 0.39 seconds',
        detail:
          'One command, zero npm dependencies, writing all four outputs from six hand-edited JSON files.',
        source: '/writing/one-knowledge-base-four-surfaces',
        sourceLabel: 'Read the full write-up',
      },
      {
        metric: '12.7× read-surface expansion',
        detail:
          '1,312,577 bytes of source becomes 16,644,215 bytes of generated read surface — and every byte of it is disposable.',
        source: '/writing/one-knowledge-base-four-surfaces',
        sourceLabel: 'Read the full write-up',
      },
      {
        metric: '7,492 links of drift on the one surface the build does not own',
        detail:
          'The measured cost of the failure mode the architecture was designed to prevent, observed on the single surface left outside it.',
        source: '/writing/one-knowledge-base-four-surfaces',
        sourceLabel: 'Read the full write-up',
      },
    ],
    artifacts: [
      {
        kind: 'live',
        label: 'genome-of-games.vercel.app',
        href: 'https://genome-of-games.vercel.app',
      },
      { kind: 'repo', label: 'Source on GitHub', href: 'https://github.com/MAKaminski/genome-of-games' },
      {
        kind: 'essay',
        label: 'One Knowledge Base, Four Surfaces',
        href: '/writing/one-knowledge-base-four-surfaces',
      },
    ],
    stack: ['Node.js', 'Model Context Protocol', 'Static site generation', 'Canvas'],
    image: '/images/projects/genome-four-surfaces.svg',
    imageAlt:
      'One build writes four surfaces: six hand-edited JSON files become 1,245 static pages for crawlers, an interactive graph for humans, a 129,037-byte search index, and an 8-tool MCP server for agents — in 0.39 seconds with zero dependencies.',
    body: `
<h2>By the numbers</h2>
<p>Build time: 0.39 seconds. npm dependencies: 0. Source records: 1,180. Source files: 6
hand-edited JSON, 1,312,577 bytes. Generated read surface: 16,644,215 bytes, a 12.7×
expansion. Static HTML pages: 1,245. Search index: 129,037 bytes. MCP tools: 8. Ontology:
168 mechanics, 618 games, 394 companies, 4,366 recorded links, 1962 to 2025. Drift on the
one surface the build does not own: 7,492 links.</p>

<h2>The decision that sounds like a downgrade</h2>
<p>The MCP server does not query the site and does not read the source data. It statically
imports a 1.9 MB index that the build wrote. There is exactly one place where slugs,
lineage, and adoption edges get joined, so an agent and a crawler cannot come back with
different answers.</p>

<h2>Tool design for a consumer with no second hop</h2>
<p>A human who gets a stub clicks through. An agent that gets a stub has burned a call. So
each tool returns the whole useful object, and the tool descriptions spend their token
budget on when to call the tool rather than on what the tool contains.</p>`,
  },

  {
    slug: 'dealer-gamma-pipeline',
    title: 'A Dealer-Gamma Pipeline That Moved on Zero Trades',
    summary:
      'A dealer-gamma pipeline that recomputes option-chain levels every fifteen minutes — and the append-only write that caught it moving levels on a closed market.',
    date: '2026-08-17',
    tier: 'case-study',
    domain: 'Market structure · data pipelines',
    role:
      'I built the pipeline and the study it writes, and I found the defect. The fix was not a code change so much as an instrumentation decision: the system was already wrong, and the only reason it became visible is that I stopped letting it overwrite its own evidence.',
    problem: `
<p>The pipeline recomputes call wall, put wall, and gamma flip off the live option chain
and writes a thinkScript study the chart reloads. The first version did exactly one write:
compute, overwrite, reload.</p>
<p>It looked correct for weeks. An overwritten file has no history to argue with. The
study fires an alert when price crosses the gamma flip — so if the flip is silently
re-estimating while price stands still, the alert is firing on its own arithmetic, and
none of it is reconstructable after the fact.</p>`,
    constraints: [
      'The levels feed an alert, so a silent re-estimate is indistinguishable from a real crossing.',
      'The original design destroyed the only evidence that could have shown the problem.',
      'Any fix had to run inside the existing fifteen-minute cadence without adding a dependency.',
    ],
    whatShipped: [
      'A dealer-gamma pipeline running 33 times a day across seven underlyings at a fifteen-minute cadence.',
      'A generated thinkScript study the chart reloads in place.',
      'A per-symbol append-only CSV written alongside the study — the change that made the defect visible.',
    ],
    outcome: [
      {
        metric: 'Gamma flip walked 718.3 → 722.2 with spot pinned at 717.12',
        detail:
          'Eight consecutive writes on a closed market: put wall 710 → 700, net GEX 598 → 626 → 611, and not a single share traded. The chain re-fit and the levels moved on their own.',
        source: '/clips#levels-that-move-when-nothing-trades',
        sourceLabel: 'Watch the clip and read the transcript',
      },
      {
        metric: '33 runs per day across 7 underlyings',
        detail:
          'The cadence that made the drift frequent enough to catch once there was an append-only record to catch it in.',
        source: '/clips#levels-that-move-when-nothing-trades',
        sourceLabel: 'Watch the clip and read the transcript',
      },
    ],
    artifacts: [
      {
        kind: 'clip',
        label: 'Zero trades, and the level still moved',
        href: '/clips#levels-that-move-when-nothing-trades',
      },
    ],
    stack: ['Python', 'thinkScript', 'Option-chain data', 'CSV'],
    image: '/videos/levels-that-move-when-nothing-trades-poster.jpg',
    imageAlt:
      'Poster frame from the field clip: the QQQ gamma flip walking upward across consecutive writes while spot price stays fixed.',
    body: `
<h2>By the numbers</h2>
<p>Runs per day: 33. Underlyings: 7. Cadence: every 15 minutes. Consecutive writes over
which the levels moved: 8. Spot price across all 8: 717.12, unchanged. Gamma flip: 718.3 →
719.5 → 720.0 → 722.2, a 3.9-point walk. Put wall: 710 → 700. Net GEX: 598 → 626 → 611.
Shares traded in that window: 0.</p>

<h2>The fix was one more write</h2>
<p>Not a rewrite &mdash; an addition. A per-symbol append-only CSV next to the study. The
computation did not change at all. What changed is that the system could no longer destroy
the record of what it had done, and eight rows later the defect was obvious.</p>

<h2>Why this generalises</h2>
<p>Any process that overwrites its own output is a process whose failures are
unreconstructable by construction. That is worth more than the specific finding: the bug
had been running for weeks in a system I looked at daily.</p>`,
  },
];

export const getProject = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug);

/**
 * Flagship first, then newest. Ordering by date alone buried the
 * compliance-reviewed agent — the single strongest hiring signal on the
 * site — three cards down.
 */
export const projectsByDate = (): Project[] =>
  projects
    .slice()
    .sort(
      (a, b) =>
        Number(b.tier === 'flagship') - Number(a.tier === 'flagship') ||
        b.date.localeCompare(a.date)
    );
