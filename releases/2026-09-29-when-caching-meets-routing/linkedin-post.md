# LinkedIn post — When Caching Meets Routing (white paper 04)

**Attach:** `when-caching-meets-routing.mp4` (this folder). 1080×1350 (4:5), H.264 High + AAC, 30 fps, 69.8 s, 4.4 MB. It has narration and a light music bed, mastered to −16 LUFS integrated, true peak −1.4 dBFS. The music sits about 10 dB under the voice and ducks further while he speaks. Every point is also on screen, so it still works when LinkedIn autoplays it muted.

**Thumbnail:** `frame-4.png` (the baseline result bars). `frame-1.png` (title card) is the fallback.

**Pillar:** Signal. **Link:** the PDF, in the post body.

**Credit lines:** the last two lines of the post are required and must be kept. The music is CC BY 4.0, which requires attribution, and the narration is disclosed as an AI voice so no one takes it for yours.

Rebuild with `python3 scripts/make-paper-video.py`. Scene lengths come from the voiceover clips in `audio/`, and the numbers come from `research/when-caching-meets-routing/results.json`.

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

Narration: AI voice (ElevenLabs). Music: Digital Lemonade - Kevin MacLeod (incompetech.com), CC BY 4.0

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

## Voiceover script

Voice: ElevenLabs library voice "Rick – Conversational AI" (`aUJKIGFNQrEc4LgAMxMR`), model `eleven_multilingual_v2`. It's a warm, conversational middle-aged American male voice, chosen over announcer-style voices. It is not a clone of anyone's voice. The ElevenLabs flow "When Caching Meets Routing — LinkedIn voiceover" holds the takes. Pauses were trimmed to about 0.35 s and tempo lifted 1.08× with pitch preserved.

| Scene | Line | Clip |
|---|---|---|
| 1 Title | When caching meets routing. A new paper on what model routing really saves. | `audio/vo1.mp3` |
| 2 Claim | Routing easy turns to a cheaper model is reported to cut LLM cost by thirty-five to ninety-eight percent. That's measured on single questions, at list prices. A voice agent is neither. | `audio/vo2.mp3` |
| 3 Why | Every turn re-sends the whole conversation. Caching makes that cheap, but only on the model that wrote the cache. Switch models turn by turn, and you keep paying to write it again. | `audio/vo3.mp3` |
| 4 Result | Routing Opus to Haiku saves fifty-one percent at list prices. With caching, it's nine. And routing Opus to Sonnet actually costs fifteen percent more. | `audio/vo4.mp3` |
| 5 Scenarios | Across six hundred scenarios, the list-price math predicts forty-seven percent. The simulation says six and a half. And sixteen percent of them lose money. | `audio/vo5.mp3` |
| 6 Rules | So: cache first. Compare effective prices, not list prices. And route per conversation, not per turn. | `audio/vo6.mp3` |
| 7 CTA | The paper, and the model behind it, are at michael-kaminski.io slash papers. | `audio/vo7.mp3` |

Spoken figures are rounded from the on-screen ones: 51.3 → fifty-one, 9.2 → nine, 15.5 → fifteen, 46.7 → forty-seven, 6.5 → six and a half, 16.2 → sixteen.

Music bed: `audio/bed-digital-lemonade.mp3`, a 100 s window starting 12 s into the track (never looped), mastered two-pass to −16 LUFS / −1.5 dBTP, 48 kHz. Licence confirmed on incompetech.com on 2026-09-29: Creative Commons Attribution 4.0.

## Before posting

- The post names no employer, per the site rule for body copy.
- Listen once end to end. I verified levels, sync and timing by measurement, but I can't hear it. Check that "L L M" and "michael-kaminski dot I O" come out naturally.
- If this goes out through the LinkedIn engine, the audio already meets `post-audio-bed`'s contract. Run its `verify` step, then `racechart.py shipped` afterwards. The engine's cadence gate (≥14 days since the last shipped video) wasn't checked, because the engine lives on your machine.
- The video is 69.8 s, above the house target of about 55 s because narration needs natural pacing. It's still well inside `verify`'s 90 s warning.
