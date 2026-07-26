/* eslint-disable */
// Renders the post's media: a branded 1200x627 card built as SVG and
// rasterised with sharp (same approach as scripts/generate-icons.js).
//
// 1200x627 is LinkedIn's recommended single-image ratio — anything squarer
// gets letterboxed in the feed.
const sharp = require('sharp');

const WIDTH = 1200;
const HEIGHT = 627;
const BG = '#060606';
const ACCENT = '#fff500';
// Anton / Space Grotesk are webfonts and are not installed on CI runners, so
// the card asks for a stack that degrades to whatever sans the machine has.
const DISPLAY_STACK = "'Anton', 'DejaVu Sans', 'Liberation Sans', Helvetica, Arial, sans-serif";
const BODY_STACK = "'Space Grotesk', 'DejaVu Sans', 'Liberation Sans', Helvetica, Arial, sans-serif";

const escapeXml = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

/**
 * Greedy wrap by estimated advance width. SVG has no text flow, so lines have
 * to be measured here.
 *
 * 0.62em per character. Measured against the rendered fallback (bold DejaVu
 * Sans) at ~0.58em; the extra margin means a wider-than-expected font wraps
 * early rather than running off the right edge, which is unrecoverable.
 */
function wrap(text, fontSize, maxWidth, maxLines) {
  const perChar = fontSize * 0.62;
  const limit = Math.floor(maxWidth / perChar);
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = '';

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length <= limit) {
      line = candidate;
    } else {
      if (line) lines.push(line);
      line = word;
    }
    if (lines.length === maxLines) break;
  }
  if (line && lines.length < maxLines) lines.push(line);

  // Ellipsise if the title didn't fit in the allotted lines.
  const consumed = lines.join(' ').split(/\s+/).length;
  if (consumed < words.length && lines.length) {
    lines[lines.length - 1] = lines[lines.length - 1].replace(/[.,;:]?$/, '') + '…';
  }
  return lines;
}

function buildSvg({ title, series, date, domain }) {
  const titleSize = title.length > 78 ? 54 : title.length > 48 ? 62 : 74;
  const lines = wrap(title, titleSize, WIDTH - 220, 4);
  const lineHeight = Math.round(titleSize * 1.14);
  // Optically centre the title block in the band between the badge (ends ~126)
  // and the footer rule (~519).
  const blockTop = 330 - ((lines.length - 1) * lineHeight) / 2;

  const badge = series || 'Writing';
  const badgeWidth = Math.max(140, badge.length * 12 + 44);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <radialGradient id="glow" cx="50%" cy="0%" r="70%">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="${BG}"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>
  <rect x="0" y="0" width="${WIDTH}" height="6" fill="${ACCENT}"/>

  <!-- series badge -->
  <rect x="100" y="86" width="${badgeWidth}" height="40" rx="20" fill="${ACCENT}"/>
  <text x="${100 + badgeWidth / 2}" y="113" text-anchor="middle"
        font-family="${BODY_STACK}" font-size="19" font-weight="700" fill="${BG}">${escapeXml(badge)}</text>

  <!-- title -->
  ${lines
    .map(
      (line, i) =>
        `<text x="100" y="${blockTop + i * lineHeight}" font-family="${DISPLAY_STACK}" font-size="${titleSize}" font-weight="700" fill="#ffffff">${escapeXml(line)}</text>`
    )
    .join('\n  ')}

  <!-- footer -->
  <rect x="100" y="${HEIGHT - 108}" width="${WIDTH - 200}" height="1" fill="#ffffff" fill-opacity="0.14"/>
  <text x="100" y="${HEIGHT - 62}" font-family="${BODY_STACK}" font-size="24" font-weight="700" fill="#ffffff">Michael Kaminski</text>
  <text x="100" y="${HEIGHT - 34}" font-family="${BODY_STACK}" font-size="19" fill="#ffffff" fill-opacity="0.55">${escapeXml(domain)}</text>
  <text x="${WIDTH - 100}" y="${HEIGHT - 34}" text-anchor="end" font-family="${BODY_STACK}" font-size="19" fill="${ACCENT}">${escapeXml(date)}</text>
</svg>`;
}

/** Render the card to a PNG buffer. */
async function renderCard(meta) {
  const svg = buildSvg(meta);
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}

module.exports = { renderCard, buildSvg, WIDTH, HEIGHT };
