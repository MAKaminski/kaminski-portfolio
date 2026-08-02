# Executive Portfolio Website

A modern, responsive portfolio website built for an executive professional specializing in CXO/CSTO roles with expertise in Strategy, Finance, Product, and Analytics.

## Features

- **Modern Design**: Clean, professional design with smooth animations
- **Responsive**: Fully responsive across all devices
- **Interactive**: Smooth scrolling navigation and hover effects
- **Performance**: Optimized for fast loading and smooth interactions
- **Accessible**: Built with accessibility best practices

## Sections

1. **Hero**: Executive summary and target profile
2. **Experience**: Leadership experience and education
3. **Skills**: Comprehensive software and technology expertise
4. **Transactions**: Detailed transaction history and deal experience
5. **Highlights**: Career highlights and key accomplishments
6. **Contact**: Professional contact information and call-to-action

## Technology Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icons
- **Vite** - Fast build tool

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd kaminski-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Navigation header
│   ├── Hero.tsx        # Hero section
│   ├── Experience.tsx  # Experience section
│   ├── Skills.tsx      # Skills section
│   ├── Transactions.tsx # Transactions section
│   ├── Highlights.tsx  # Highlights section
│   ├── Contact.tsx     # Contact section
│   └── Footer.tsx      # Footer
├── App.tsx             # Main app component
├── index.tsx           # React entry point
└── index.css           # Global styles
```

## Customization

### Colors
The color scheme can be customized in `tailwind.config.js` under the `colors.primary` section.

### Content
Update the content in each component file to match your specific information.

### Styling
Modify the Tailwind classes in each component to adjust the styling.

## Deployment

The site can be deployed to any static hosting service:

- **Vercel**: Connect your GitHub repository
- **Netlify**: Drag and drop the build folder
- **GitHub Pages**: Use the gh-pages package
- **AWS S3**: Upload the build folder

## Digital Twin

The "Talk to my Digital Twin" button on the home page opens a voice-or-text
conversation with an AI trained on the public content of this site. It runs on
three Vercel serverless functions under `api/twin/`:

| Route | Does | Needs |
| --- | --- | --- |
| `POST /api/twin/chat` | Streams the conversation (Claude, `claude-opus-5`) | `ANTHROPIC_API_KEY` |
| `POST /api/twin/transcribe` | Speech to text (OpenAI Whisper) | `OPENAI_API_KEY` |
| `POST /api/twin/speak` | Text to speech in a cloned voice (ElevenLabs) | `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID` |

Set these in **Vercel → Project → Settings → Environment Variables**, scoped to
the environments you want them in (Production and Preview are separate). They
are read server-side only and are never exposed to the browser — do not prefix
them with `REACT_APP_`, which would bundle them into the client.

**Adding or changing a variable requires a redeploy.** Vercel binds env vars to a
deployment when it builds, so an existing deployment keeps reporting
`not_configured` until you redeploy — from the Vercel dashboard, or by pushing
any commit.

The SPA rewrite in `vercel.json` uses `"/((?!api/).*)"` rather than `"/(.*)"` so
the catch-all can't shadow these functions and serve `index.html` in their place.

`api/tsconfig.json` is load-bearing — don't delete it. Vercel compiles `api/*.ts`
against the nearest tsconfig, and the root one is CRA's (`target: es5`,
`module: esnext`, `include: ["src"]`). Emitting ESM into a CommonJS context —
`package.json` has no `"type": "module"` — makes every function fail at load with
`FUNCTION_INVOCATION_FAILED`, identically and with no useful message. The api
tsconfig pins CommonJS/ES2022 for the functions only; the CRA build is untouched.
Note that `vercel.json` entries reject unknown keys (`additionalProperties: false`),
so it can't carry inline comments — validate changes against
<https://openapi.vercel.sh/vercel.json> before pushing.

Each capability degrades on its own. With no keys set the button still opens and
explains that the twin isn't configured; without the ElevenLabs pair replies stay
text-only; without the OpenAI key the microphone reports that voice input is
unavailable and typing still works.

`ELEVENLABS_VOICE_ID` is the ID of a voice clone created in the ElevenLabs
dashboard. Until it is set, nothing is spoken — the twin will not fall back to a
stock voice.

### Tuning how the twin sounds

A Professional Voice Clone is fine-tuned per model. If the configured model isn't
one the voice has trained on, `speak` reads the voice's own `fine_tuning.state`
and retries on a model that is ready — the `X-Twin-Voice-Model` response header
reports which one actually spoke.

Optional knobs, all clamped to 0–1, no redeploy needed beyond the usual env-var
rebuild:

| Variable | Default | Effect |
| --- | --- | --- |
| `ELEVENLABS_STABILITY` | `0.4` | Lower is more expressive and more variable; higher is steadier and flatter. |
| `ELEVENLABS_SIMILARITY` | `0.85` | How hard the model pulls toward the source recordings. High helps a clone sound like its owner but amplifies noise in the source samples. |
| `ELEVENLABS_STYLE` | `0` | Exaggerates delivery. Adds latency and can destabilise a clone — raise only deliberately. |
| `ELEVENLABS_MODEL_ID` | auto | Pins a model instead of using the fallback. |

`use_speaker_boost` is always on; it improves resemblance to the source speaker
at no real cost.

**The largest lever isn't here.** Speech quality is dominated by the text handed
to the engine, and that comes from the `<format>` block in `api/_lib/persona.ts` —
spell figures out as words, hyphenate letter-by-letter acronyms, keep sentences
short, and avoid punctuation the engine reads literally. Tune that block before
touching the knobs above.

**These endpoints are public and cost money per call.** Each is capped at 20
requests per minute per IP, but that limit lives in the memory of a single warm
serverless instance, so it bounds a casual script rather than a distributed one.
Put a shared store (Vercel KV, Upstash) behind `rateLimit()` in `api/_lib/http.ts`
before promoting this anywhere high-traffic.

The persona and everything the twin knows live in `api/_lib/persona.ts`. It is
restricted to what is already published on this site and is instructed to say it
doesn't know rather than invent a client, a number, or a date.

## Performance

- Optimized images and assets
- Lazy loading for better performance
- Minimal bundle size
- Fast loading times

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

For questions or support, please reach out through the contact information provided in the portfolio. 

## Pinecone Vector DB Integration

This project includes a scaffold for integrating with Pinecone for semantic search and vector storage. You can use Pinecone to store and search information about your experience, skills, and even past conversations.

### Example API Endpoint (Node.js/Express)

```
// backend/pinecone.js
const { PineconeClient } = require('@pinecone-database/pinecone');
const express = require('express');
const router = express.Router();

const pinecone = new PineconeClient();
pinecone.init({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
});

router.post('/upsert', async (req, res) => {
  const { id, values, metadata } = req.body;
  await pinecone.upsert({
    indexName: 'portfolio',
    upsertRequest: {
      vectors: [{ id, values, metadata }],
    },
  });
  res.json({ success: true });
});

router.post('/query', async (req, res) => {
  const { values, topK } = req.body;
  const result = await pinecone.query({
    indexName: 'portfolio',
    queryRequest: {
      vector: values,
      topK: topK || 5,
      includeMetadata: true,
    },
  });
  res.json(result.matches);
});

module.exports = router;
```

### Porting Data/Conversation
- Extract your experience, skills, and conversation data as text chunks.
- Use an embedding model (e.g., OpenAI, Cohere) to convert text to vectors.
- Upsert these vectors into Pinecone using the `/upsert` endpoint.
- Query Pinecone for semantic search using the `/query` endpoint.

This scaffold can be extended for production use, including authentication, advanced metadata filtering, and integration with your AI chatbot. 