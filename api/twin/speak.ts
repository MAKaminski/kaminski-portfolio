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

function errorCode(body: string): string | undefined {
  try {
    const parsed = JSON.parse(body) as { detail?: { status?: string } | string };
    return typeof parsed.detail === 'string' ? parsed.detail : parsed.detail?.status;
  } catch {
    return undefined;
  }
}

/** Models this voice has finished fine-tuning on, best first. */
async function readyModels(voiceId: string, key: string): Promise<string[]> {
  try {
    const res = await fetch(`${API}/voices/${encodeURIComponent(voiceId)}`, {
      headers: { 'xi-api-key': key },
    });
    if (!res.ok) return [];

    const voice = (await res.json()) as {
      fine_tuning?: { state?: Record<string, string> };
    };
    const state = voice.fine_tuning?.state || {};
    const ready = Object.keys(state).filter((m) => state[m] === 'fine_tuned');

    return ready.sort((a, b) => {
      const ia = MODEL_PREFERENCE.indexOf(a);
      const ib = MODEL_PREFERENCE.indexOf(b);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });
  } catch {
    return [];
  }
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
        voice_settings: { stability: 0.45, similarity_boost: 0.8 },
      }),
    });

  try {
    const first = process.env.ELEVENLABS_MODEL_ID || DEFAULT_MODEL;
    let upstream = await synth(first);
    let detail = upstream.ok ? '' : await upstream.text();

    if (!upstream.ok && errorCode(detail) === 'voice_not_fine_tuned') {
      const candidates = (await readyModels(voiceId, key)).filter((m) => m !== first);
      console.warn('[twin/speak] %s not fine-tuned; ready: %s', first, candidates.join(',') || 'none');

      if (!candidates.length) {
        res.status(502).json({
          error:
            "The cloned voice isn't finished training yet, so replies stay text-only for now.",
          upstreamStatus: upstream.status,
          upstreamCode: 'voice_not_fine_tuned',
        });
        return;
      }

      upstream = await synth(candidates[0]);
      detail = upstream.ok ? '' : await upstream.text();
      if (upstream.ok) console.info('[twin/speak] fell back to %s', candidates[0]);
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
    res.status(200).send(audio);
  } catch (err) {
    console.error('[twin/speak]', err instanceof Error ? err.message : err);
    res.status(502).json({ error: 'Voice playback is unavailable right now.' });
  }
}
