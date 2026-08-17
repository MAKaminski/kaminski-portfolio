export interface Clip {
  slug: string;
  /** Short, plain title. Doubles as the VideoObject `name`. */
  title: string;
  /** One-line hook shown under the title and used as the VideoObject `description`. */
  description: string;
  /** Path under /videos. */
  src: string;
  poster: string;
  durationSec: number;
  /** ISO date the clip was published to the site. */
  uploadDate: string;
  /** Aspect ratio, w:h. All current clips are vertical. */
  width: number;
  height: number;
  /** Slug in articles.ts this clip teases, when one exists. */
  relatedArticleSlug?: string;
  /** Spoken line(s), verbatim. Rendered on the page — crawlers and LLMs read this, not the audio. */
  transcript: string;
  /** Why the clip exists: the finding it compresses. 2-3 short paragraphs of HTML. */
  context: string;
}

export const clips: Clip[] = [
  {
    slug: 'statistical-gating-coin-flip',
    title: 'The gate that stops nothing',
    description:
      "A statistical gate on an agent's instruction file, and the power calculation that shows the 5% threshold written next to it never binds. At this variance a 14-day window catches a true 5% lift 44% of the time — a coin flip on your own best edits.",
    src: '/videos/statistical-gating-coin-flip.mp4',
    poster: '/videos/statistical-gating-coin-flip-poster.jpg',
    durationSec: 10,
    uploadDate: '2026-08-17',
    width: 720,
    height: 1280,
    relatedArticleSlug: 'statistical-gating-for-agent-instruction-changes',
    transcript:
      "I gated my agent's instructions behind a statistical test. Then I ran the math on my own gate. It's a coin flip.",
    context: `
<p>The gate is Welch's t-test on the agent's instruction file: p &lt; 0.10, a 5% minimum
lift, 14-day windows. It looked like a control until the power calculation was run on the
gate itself.</p>
<p>At the observed variance a 14-day window can only detect an 8.3% effect. The 5%
threshold sitting next to it in the config is inside the blind spot the whole time — it
never binds, and it never did any work. Run it forward and an edit that truly delivers 5%
clears the gate 44% of the time.</p>
<p>The barrier in the clip is closed the entire time and everything drifts straight
through it. That is the finding as a single image.</p>`,
  },
  {
    slug: 'levels-that-move-when-nothing-trades',
    title: 'Zero trades, and the level still moved',
    description:
      'A dealer-gamma pipeline walked the QQQ gamma flip 3.9 points and dropped the put wall ten dollars across eight consecutive writes with spot pinned at 717.12. Nothing traded. An overwritten file has no history to argue with — one append-only CSV is what caught it.',
    src: '/videos/levels-that-move-when-nothing-trades.mp4',
    poster: '/videos/levels-that-move-when-nothing-trades-poster.jpg',
    durationSec: 10,
    uploadDate: '2026-08-17',
    width: 720,
    height: 1280,
    transcript:
      'QQQ hadn’t traded a share. Walked the gamma flip 3.9 points. Overwrite each run and the file has no history to argue with — so I appended.',
    context: `
<p>The pipeline recomputes call wall, put wall, and gamma flip off the live option chain
every fifteen minutes, 33 runs a day across seven underlyings, and writes a thinkScript
study the chart reloads. The first version only did that one write: compute, overwrite,
reload.</p>
<p>It looked correct for weeks, because an overwritten file has no history to argue with.
The fix was not a fix — it was one more write, a per-symbol append-only CSV next to the
study. Eight consecutive rows later: spot constant at 717.12, flip 718.3 → 719.5 → 720.0
→ 722.2, put wall 710 → 700, net GEX 598 → 626 → 611. Market closed. The chain re-fit and
the levels walked on their own.</p>
<p>That matters because the study fires an alert on price crossing the flip. When the flip
is a re-estimate and price is static, the alert is firing on its own arithmetic — and for
weeks the only artifact was a file that overwrote its own evidence, so none of it was
reconstructable after the fact.</p>`,
  },
];

export const getClip = (slug: string): Clip | undefined =>
  clips.find((c) => c.slug === slug);

export const getClipForArticle = (articleSlug: string): Clip | undefined =>
  clips.find((c) => c.relatedArticleSlug === articleSlug);
