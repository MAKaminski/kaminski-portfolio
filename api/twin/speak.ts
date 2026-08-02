import { guard, type ApiRequest, type ApiResponse } from '../_lib/http';

/**
 * ElevenLabs text-to-speech in Michael's cloned voice.
 *
 * ELEVENLABS_VOICE_ID selects the clone; without it there is nothing to speak in,
 * so the endpoint reports itself unconfigured and the UI silently falls back to
 * text-only rather than speaking in a stranger's voice.
 *
 * A Professional Voice Clone is fine-tuned per model, not once — asking for a
 * model it hasn't trained on returns `400 voice_not_fine_tuned`. Rather than make
 * the operator match model IDs to training state by hand, that failure triggers a
 * lookup of the voice's own fine-tuning state and one retry on a model it is
 * actually ready for.
 */
const MAX_CHARS = 1200;
const API = 'https://api.elevenlabs.io/v1';
const DEFAULT_MODEL = 'eleven_turbo_v2_5';

/** Preference order when the voice is ready for more than one model. */
const MODEL_PREFERENCE = [
  'eleven_turbo_v2_5',
  'eleven_multilingual_v2',
  'eleven_turbo_v2',
  'eleven_flash_v2_5',
  'eleven_monolingual_v1',
];

/** 0–1 knob from the environment, so the voice can be tuned without a code change. */
function knob(name: string, fallback: number): number {
  const raw = Number(process.env[name]);
  return Number.isFinite(raw) ? Math.min(1, Math.max(0, raw)) : fallback;
}

/**
 * stability      — lower is more expressive and more variable, higher is steadier
 *                  and flatter. Conversation wants some life, so sit below centre.
 * similarity     — how hard the model pulls toward the source recordings. High
 *                  helps a clone sound like its owner, but drags in artefacts if
 *                  the source samples were noisy.
 * style          — exaggerates the speaker's delivery. Costs latency and
 *                  destabilises a clone, so it stays off unless asked for.
 * speaker_boost  — improves resemblance to the original speaker at no real cost;
 *                  the one setting that is simply on for a voice clone.
 */
function voiceSettings() {
  return {
    stability: knob('ELEVENLABS_STABILITY', 0.4),
    similarity_boost: knob('ELEVENLABS_SIMILARITY', 0.85),
    style: knob('ELEVENLABS_STYLE', 0),
    use_speaker_boost: true,
  };
}

function errorCode(body: string): string | undefined {
  try {
    const parsed = JSON.parse(body) as { detail?: { status?: string } | string };
    return typeof parsed.detail === 'string' ? parsed.detail : parsed.detail?.status;
  } catch {
    return undefined;
  }
}

/**
 * ElevenLabs reports fine-tuning per model, one of: not_started, queued,
 * fine_tuning, fine_tuned, failed, delayed.
 */
type Lookup =
  | { ok: true; state: Record<string, string> }
  | { ok: false; status: number };

/**
 * The voice's own fine-tuning state.
 *
 * Returns the failure rather than an empty result: "the lookup broke" and "the
 * voice is trained on nothing" both leave you with no model to fall back to, but
 * they are completely different problems and the first version of this collapsed
 * them into the same empty array. That cost an afternoon.
 */
async function voiceFineTuning(voiceId: string, key: string): Promise<Lookup> {
  try {
    const res = await fetch(`${API}/voices/${encodeURIComponent(voiceId)}`, {
      headers: { 'xi-api-key': key },
    });
    if (!res.ok) return { ok: false, status: res.status };

    const voice = (await res.json()) as {
      fine_tuning?: { state?: Record<string, string> };
    };
    return { ok: true, state: voice.fine_tuning?.state || {} };
  } catch {
    return { ok: false, status: 0 };
  }
}

/** Models this voice has finished fine-tuning on, best first. */
function readyModels(state: Record<string, string>): string[] {
  return Object.keys(state)
    .filter((m) => state[m] === 'fine_tuned')
    .sort((a, b) => {
      const ia = MODEL_PREFERENCE.indexOf(a);
      const ib = MODEL_PREFERENCE.indexOf(b);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });
}

/** What to tell a visitor, based on where the training actually is. */
function trainingMessage(state: Record<string, string>): string {
  const values = Object.values(state);
  if (values.some((v) => v === 'fine_tuning' || v === 'queued' || v === 'delayed')) {
    return "The cloned voice is still training, so replies stay text-only until it finishes.";
  }
  if (values.length && values.every((v) => v === 'failed')) {
    return 'Voice playback is unavailable right now.';
  }
  return "The cloned voice isn't ready yet, so replies stay text-only for now.";
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!guard(req, res, {
    requiredEnv: ['ELEVENLABS_API_KEY', 'ELEVENLABS_VOICE_ID'],
    limit: 20,
    windowMs: 60_000,
    // Reads into "<feature> isn't configured…", so keep this a singular noun.
    feature: 'Voice playback',
  })) return;

  const { text } = (req.body || {}) as { text?: string };
  if (typeof text !== 'string' || !text.trim()) {
    res.status(400).json({ error: 'Expected text to speak.' });
    return;
  }

  const key = process.env.ELEVENLABS_API_KEY as string;
  const voiceId = process.env.ELEVENLABS_VOICE_ID as string;
  const body = text.trim().slice(0, MAX_CHARS);
  const url = `${API}/text-to-speech/${encodeURIComponent(voiceId)}`;

  const synth = (modelId: string) =>
    fetch(url, {
      method: 'POST',
      headers: {
        'xi-api-key': key,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text: body,
        model_id: modelId,
        voice_settings: voiceSettings(),
      }),
    });

  try {
    const first = process.env.ELEVENLABS_MODEL_ID || DEFAULT_MODEL;
    let served = first;
    let upstream = await synth(first);
    let detail = upstream.ok ? '' : await upstream.text();

    if (!upstream.ok && errorCode(detail) === 'voice_not_fine_tuned') {
      const lookup = await voiceFineTuning(voiceId, key);

      // The lookup failing is a different outage from the voice being untrained,
      // and it is the operator's problem rather than a waiting game. Say which.
      if (!lookup.ok) {
        console.error('[twin/speak] voice lookup failed: GET /voices/%s -> %d', voiceId, lookup.status);
        res.status(502).json({
          error: 'Voice playback is unavailable right now.',
          upstreamStatus: lookup.status,
          upstreamCode: 'voice_lookup_failed',
        });
        return;
      }

      const candidates = readyModels(lookup.state).filter((m) => m !== first);
      console.warn(
        '[twin/speak] %s not fine-tuned; states: %s; ready: %s',
        first,
        JSON.stringify(lookup.state),
        candidates.join(',') || 'none'
      );

      if (!candidates.length) {
        res.status(502).json({
          error: trainingMessage(lookup.state),
          upstreamStatus: upstream.status,
          upstreamCode: 'voice_not_fine_tuned',
          // Per-model training status. Not a secret — it's the only thing that
          // distinguishes "wait, it's training" from "the training failed" from
          // "nobody ever started it", and without it the 502 is unactionable.
          fineTuning: lookup.state,
        });
        return;
      }

      served = candidates[0];
      upstream = await synth(served);
      detail = upstream.ok ? '' : await upstream.text();
      if (upstream.ok) console.info('[twin/speak] fell back to %s', served);
    }

    if (!upstream.ok) {
      console.error('[twin/speak]', upstream.status, detail.slice(0, 400));
      // Enough to tell a rejected key from an unresolvable voice from an
      // untrained model. The status slug is a diagnostic code, not a secret.
      const code = errorCode(detail);
      res.status(502).json({
        error: 'Voice playback is unavailable right now.',
        upstreamStatus: upstream.status,
        ...(code ? { upstreamCode: code } : {}),
      });
      return;
    }

    const audio = Buffer.from(await upstream.arrayBuffer());
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-store');
    // Which model actually spoke — the fallback makes this non-obvious, and it
    // decides which tuning knobs are even available.
    res.setHeader('X-Twin-Voice-Model', served);
    res.status(200).send(audio);
  } catch (err) {
    console.error('[twin/speak]', err instanceof Error ? err.message : err);
    res.status(502).json({ error: 'Voice playback is unavailable right now.' });
  }
}
