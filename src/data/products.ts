// PRERENDER CONTRACT — scripts/prerender.js slices this file between
//   `export const products: Product[] =`  and  `export const getProduct`
// and evaluates the slice as plain JavaScript. Inside the array literal:
//   no imports, no identifiers from other modules, no `as const`,
//   no enums / satisfies / type assertions, no template literals that
//   interpolate anything — plain string, number, boolean, array and
//   object literals only.
// Helpers and anything clever go BELOW the `export const getProduct` sentinel.

export type Product = {
  name: string;
  repoUrl: string;
  image?: string;
  /** The product's own app icon, when its repo ships one. Cards without it show initials. */
  icon?: string;
  category: string;
  description: string;
  tags: string[];
};

// Desktop tools and open-source utilities built by Michael Kaminski, hosted on GitHub.
export const products: Product[] = [
  {
    name: 'launch-template',
    repoUrl: 'https://github.com/MAKaminski/launch-template',
    image: '/images/products/launch-template.webp',
    category: 'Template · Next.js 16',
    description:
      'Stand up a new product-idea launch — marketing site, analytics, database, payments and booking — in under fifteen minutes, repeatedly, for many ideas in parallel. One hosting project per launch; everything underneath shared and joined by a single launch_slug. Runs with zero credentials; each unconfigured integration degrades to a no-op with one warning.',
    tags: ['Next.js', 'PostHog', 'Supabase', 'Stripe', 'Cal.com'],
  },
  {
    name: 'TM Voice',
    repoUrl: 'https://github.com/MAKaminski/tm-voice',
    image: '/images/products/tm-voice.webp',
    category: 'Voice agent · Outbound calling',
    description:
      'An outbound calling agent for a residential maintenance contractor. Finds who approves vendors at property managers and hands the answer to a person; it does not sell, quote or book. Suppression, do-not-call, consent, line type, calling window and daily caps are decided in one database transaction before anything reaches the phone network, and consent records are never edited or deleted.',
    tags: ['TypeScript', 'Vapi', 'Telnyx', 'Compliance'],
  },
  {
    name: 'MacMonitor',
    repoUrl: 'https://github.com/MAKaminski/MacMonitor',
    image: '/images/products/macmonitor.webp',
    icon: '/images/logos/products/macmonitor.webp',
    category: 'macOS · System Monitor',
    description:
      'A fork of the Apple Silicon menu-bar system monitor, extended with a resizable Desktop HUD — live CPU, memory, network, GPU, battery, and power-rail metrics, a launcher tile grid, an embedded terminal, and tabs for finances, calendar, iMessage, and a multi-agent Claude assistant.',
    tags: ['Swift', 'SwiftUI', 'WidgetKit', 'macOS'],
  },
  {
    name: 'Touch Up D',
    repoUrl: 'https://github.com/MAKaminski/Touch-Up-D',
    image: '/images/products/touch-up-d.webp',
    category: 'macOS · Touchscreen Driver',
    description:
      'Turns any touchscreen monitor into a real touch control deck for macOS. A root launchd daemon seizes the touch device below WindowServer, maps taps to the bound display, and snaps the cursor back the instant your finger lifts.',
    tags: ['Swift', 'IOKit', 'launchd', 'macOS'],
  },
  {
    name: 'DesktopLens',
    repoUrl: 'https://github.com/MAKaminski/DesktopLens',
    image: '/images/products/desktoplens.webp',
    category: 'macOS · Ambient Context Capture',
    description:
      'Privacy-first, on-device context capture — watches your screen, mic, and active app, reduces each window of activity to plain text via OCR and Whisper, then deletes the raw media. Only redacted text ever persists, ready to feed a local LLM or a Claude scheduled task.',
    tags: ['Shell', 'Vision OCR', 'whisper.cpp', 'macOS'],
  },
  {
    name: 'depot-mcp',
    repoUrl: 'https://github.com/MAKaminski/depot-mcp',
    image: '/images/products/depot-mcp.webp',
    category: 'MCP Server · Investment Research',
    description:
      'A Model Context Protocol server that hands an agent real research tools rather than a search box: price and fundamentals, multi-source news with sentiment scoring, housing and macro indicators, and valuation analysis — all callable as typed tools over a single equity.',
    tags: ['TypeScript', 'MCP', 'Market Data'],
  },
  {
    name: 'AutoHotKey Go',
    repoUrl: 'https://github.com/MAKaminski/AutoHotKey_Go',
    image: '/images/products/autohotkey-go.webp',
    category: 'Windows · Agent Desktop Toolbar',
    description:
      'A native Go/Win32 desktop toolbar for collections agents — CRM account scraping, timezone-aware quiet-hour compliance checks, and one-key call actions, with no AutoHotkey runtime and no interpreted script to drift out of sync with the UI.',
    tags: ['Go', 'Win32', 'Automation'],
  },
];

export const getProduct = (name: string): Product | undefined =>
  products.find((p) => p.name === name);
