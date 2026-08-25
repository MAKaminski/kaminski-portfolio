/* eslint-disable */
// Light-surface guard for a dark-theme site.
//
// This exists because of a specific bug that shipped to production and was
// found by a human looking at the page, not by any check here.
//
// The site moved to one dark theme (--bg is #060606). Converting the last
// light-theme components meant swapping card backgrounds to `.rilla-card` and
// flipping `text-gray-900` to `text-white`. In src/components/Highlights.tsx
// the text flipped and the container did not:
//
//     <div className="mt-16 bg-gradient-to-r from-gray-50 to-primary-50 ...">
//       <h3 className="text-2xl font-bold text-white ...">Additional Achievements</h3>
//
// White text on a near-white gradient. The build passed, TypeScript passed,
// every prerender assertion passed, and the section was illegible for anyone
// who loaded the home page.
//
// A headless-browser contrast check would catch more, but it cannot reach the
// deployed site from CI here and adding Playwright as a project dependency to
// catch a CSS class mistake is disproportionate. A static scan for light
// surface utilities catches this exact failure at the point it is introduced.
//
// Log-only, always exits 0 — same contract as verify-prerender.js. A styling
// nit must never fail a deploy.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');

// Tailwind utilities that paint a light surface. Opacity-modified variants
// (bg-white/5, bg-white/[0.03]) are the dark theme's own translucent overlays
// and are explicitly fine — the negative lookahead is what separates them.
const LIGHT_SURFACE = [
  { re: /\bbg-white(?![/\w[-])/g, why: 'solid white background' },
  { re: /\bbg-(?:gray|slate|zinc|neutral|stone)-(?:50|100|200)\b/g, why: 'light grey background' },
  { re: /\bbg-(?:primary|secondary|blue|sky|indigo)-(?:50|100)\b/g, why: 'light tinted background' },
  { re: /\b(?:from|to|via)-\w+-(?:50|100)\b/g, why: 'light gradient stop' },
  // Dark text is the mirror-image failure and just as invisible. A live
  // contrast sweep caught `text-gray-700` on #060606 at 1.97:1 — well under
  // the 4.5:1 WCAG AA floor — after the background rules above came back clean.
  {
    re: /\btext-(?:gray|slate|zinc|neutral|stone)-(?:600|700|800|900)\b/g,
    why: 'dark text on a dark background',
  },
  // Form controls with no bg- class at all inherit the browser's white. There
  // is no background token to match, but they always carry a light-theme
  // border, so that is the detectable tell. This is how three white inputs
  // survived on the dark contact card.
  {
    re: /\bborder-(?:gray|slate|zinc|neutral|stone)-(?:200|300|400)\b/g,
    why: 'light-theme border, usually an unstyled white form control',
  },
];

// Files that legitimately render on a light surface of their own.
const EXEMPT = [
  // A standalone tool page with its own light chrome, deliberately not themed.
  'src/pages/JiraPRD.tsx',
  // Utility dashboard, disallowed in robots.txt and not part of the portfolio.
  'src/components/AnalyticsDashboard.tsx',
];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else if (/\.(tsx|jsx)$/.test(entry.name)) out.push(p);
  }
  return out;
}

function main() {
  const findings = [];
  for (const file of walk(SRC)) {
    const rel = path.relative(ROOT, file);
    if (EXEMPT.includes(rel)) continue;
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, i) => {
      // Strip state-prefixed variants first: `hover:bg-white` next to
      // `hover:text-ink-900` is a deliberate button treatment that flips both
      // colours together, not a surface something is painted on.
      const scanned = line.replace(/\b(?:hover|focus|active|group-hover|focus-visible|disabled):[\w/[\]().-]+/g, '');
      for (const { re, why } of LIGHT_SURFACE) {
        re.lastIndex = 0;
        const hits = scanned.match(re);
        if (hits) findings.push({ rel, line: i + 1, hits: [...new Set(hits)].join(', '), why });
      }
    });
  }

  if (!findings.length) {
    console.log('check-theme: no light surfaces on the dark theme ✓');
    return;
  }
  console.warn(`\ncheck-theme: ${findings.length} light surface(s) on a dark-theme page`);
  console.warn('  Light surfaces carry white text and go unreadable; dark text on the');
  console.warn('  #060606 page does the same in reverse. Use .rilla-card for surfaces');
  console.warn('  (border-white/10 bg-white/[0.04]) and text-white/NN for copy.\n');
  for (const f of findings) {
    console.warn(`  ✗ ${f.rel}:${f.line} — ${f.hits}  (${f.why})`);
  }
  console.warn('');
}

try {
  main();
} catch (err) {
  console.warn(`check-theme: check itself failed (${err && err.message})`);
}
