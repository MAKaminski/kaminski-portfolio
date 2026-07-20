/* eslint-disable */
// Generates PWA icons and the Open Graph social card from inline SVG using sharp.
// Run: node scripts/generate-icons.js  (also wired as a prebuild step)
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUBLIC = path.join(__dirname, '..', 'public');

const iconSvg = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0ea5e9"/>
      <stop offset="1" stop-color="#7c3aed"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="#0b1220"/>
  <rect x="3" y="3" width="58" height="58" rx="12" fill="none" stroke="url(#g)" stroke-width="2"/>
  <text x="32" y="43" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
        font-size="30" font-weight="800" fill="url(#g)">MK</text>
</svg>`;

const ogSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b1220"/>
      <stop offset="1" stop-color="#111a2e"/>
    </linearGradient>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#0ea5e9"/>
      <stop offset="1" stop-color="#a855f7"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="0" width="1200" height="8" fill="url(#g)"/>
  <text x="80" y="150" font-family="Helvetica, Arial, sans-serif" font-size="30" font-weight="700" fill="#0ea5e9" letter-spacing="3">FINTECH · FINANCE · ENGINEERING · ATLANTA</text>
  <text x="80" y="300" font-family="Helvetica, Arial, sans-serif" font-size="92" font-weight="800" fill="#ffffff">Michael Kaminski</text>
  <text x="80" y="390" font-family="Helvetica, Arial, sans-serif" font-size="46" font-weight="600" fill="#cbd5e1">Fintech Finance &amp; Engineering Leader</text>
  <text x="80" y="470" font-family="Helvetica, Arial, sans-serif" font-size="34" font-weight="400" fill="#94a3b8">Fluent in both PE-grade finance and hands-on engineering.</text>
  <text x="80" y="560" font-family="Helvetica, Arial, sans-serif" font-size="28" font-weight="600" fill="#64748b">michaelkaminski.com</text>
</svg>`;

async function main() {
  await sharp(Buffer.from(iconSvg(192))).png().toFile(path.join(PUBLIC, 'logo192.png'));
  await sharp(Buffer.from(iconSvg(512))).png().toFile(path.join(PUBLIC, 'logo512.png'));
  // favicon.ico fallback for legacy crawlers/browsers (PNG payload accepted by modern UAs)
  await sharp(Buffer.from(iconSvg(48))).png().toFile(path.join(PUBLIC, 'favicon.ico'));
  await sharp(Buffer.from(ogSvg)).jpeg({ quality: 88 }).toFile(path.join(PUBLIC, 'og-image.jpg'));
  // Replace the 1-byte placeholder so it is no longer a broken asset.
  await sharp(Buffer.from(ogSvg)).jpeg({ quality: 88 }).toFile(path.join(PUBLIC, 'michael-kaminski.jpg'));
  console.log('Generated logo192.png, logo512.png, favicon.ico, og-image.jpg, michael-kaminski.jpg');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
