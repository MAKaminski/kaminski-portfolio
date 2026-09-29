# LinkedIn post — When Caching Meets Routing (white paper 04)

**Attach:** `when-caching-meets-routing.mp4` (this folder). 1080×1350 (4:5), H.264 High, 30 fps, 47 s, 2.0 MB, silent by design. Every point is on screen because LinkedIn autoplays muted.

**Thumbnail:** `frame-4.png` (the baseline result bars). `frame-1.png` (title card) is the fallback.

**Pillar:** Signal. **Link:** the PDF, in the post body, as asked.

Rebuild the video with `python3 scripts/make-paper-video.py`. It reads `research/when-caching-meets-routing/results.json`, the same file the paper's numbers come from.

---

## Post

Routing easy turns to a cheaper model is reported to cut LLM cost 35 to 98%.

In a multi-turn voice agent with prompt caching, my model says 9.2%.

The published numbers are real. They come from single-turn benchmarks priced at list rates. A voice agent is neither: every turn re-sends the system prompt and the whole transcript, and prompt caching bills that re-sent prefix at 5 to 10% of the input price.

Caching alone cut the cost of an all-Opus 5.5 conversation 78.8%, from $0.3865 to $0.0819. That's the baseline a router has to beat, not list price.

The catch: caches are per model. When the conversation hops from Haiku back to Opus, Opus re-writes every token it didn't see, at 1.25x the input price. The paper calls it cache fragmentation.

At baseline (12 turns, a 6,000-token cached prompt, 20% hard turns):

Opus 5.5 → Haiku 4.5, routed per turn: 51.3% saved at list prices, 9.2% with caching.

Opus 5.5 → Sonnet 5.5, routed per turn: 33.8% saved at list prices, a 15.5% cost increase with caching. Sonnet reads its cache at the same $0.20 per million tokens as Opus, so the re-writes cost more than the cheaper output saves.

Across 600 Monte Carlo scenarios, the list-price math overstates savings by a median of 40.2 points. Routing loses money in 16.2% of them.

What I'd do instead: cache first, compare effective prices rather than list prices, and route at the granularity of the cache. A whole conversation on Haiku 4.5 costs 70.0% less than one on Opus 5.5. Switching turn by turn gives most of that back.

It's a simulation with stated assumptions, not a measurement from a deployment, and no employer data went into it. The model ships with the paper, so you can swap in your own traces.

Paper, 6 pages: https://www.michael-kaminski.io/docs/papers/when-caching-meets-routing.pdf

If you route between models in production, do you route per turn or per conversation?

#LLM #VoiceAI

---

## Video alt text

Per-turn routing from Opus 5.5 to Haiku 4.5 saves 51.3% at list prices but 9.2% once prompt caching is counted; routing to Sonnet 5.5 flips from 33.8% savings to a 15.5% cost increase. Across 600 simulated scenarios the median saving is 6.5% against 46.7% predicted, because each model keeps its own cache and every switch re-writes the transcript at 1.25x input price.

---

## Fact ledger

Every number in the post and the video, and where it lives. Paper = `research/when-caching-meets-routing/numbers.tex` (generated) or the paper text.

| Number | Claim | Source |
|---|---|---|
| 35–98% | Reported routing cost cuts | Paper §1: FrugalGPT (98%), RouteLLM (35–85%+), Hybrid LLM |
| 5–10% | Cache-read price as share of input | Anthropic pricing, retrieved 2026-09-28: 0.05x Opus 5.5, 0.1x others |
| 1.25x | 5-minute cache-write price | Anthropic pricing, 2026-09-28 |
| $0.20/MTok | Opus 5.5 and Sonnet 5.5 cache read | Paper Table 1 |
| 78.8% | Caching cut, all-Opus conversation | `\cachedisc` |
| $0.3865 → $0.0819 | Per-conversation cost, uncached → cached | `\allFnc`, `\allFc` |
| 12 / 6,000 / 20% | Baseline turns, cached prefix, hard-turn share | Paper Table 2 |
| 51.3% → 9.2% | Opus→Haiku per turn, list vs cache-aware | `\hNaive`, `\hCache` |
| 33.8% → −15.5% | Opus→Sonnet per turn, list vs cache-aware | `\sNaive`, `\sCache` |
| 600 | Monte Carlo scenarios | `\mcN` |
| 46.7% / 6.5% | Median savings, predicted vs simulated | `\mcNaive`, `\mcMed` |
| 40.2 pts | Median overstatement | `\mcGap` |
| 16.2% | Scenarios where routing raises cost | `\mcNeg` |
| 70.0% | Whole conversation on Haiku vs Opus | `\allHaiku` |
| 6 pages | PDF length | `pdfinfo` |

## Before posting

- The post names no employer, per the site rule for body copy.
- If this goes out through the LinkedIn engine, run `post-audio-bed` for the music bed and container check, and `racechart.py shipped` afterwards. The engine's cadence gate (≥14 days since the last shipped video) wasn't checked, because the engine lives on your machine.
