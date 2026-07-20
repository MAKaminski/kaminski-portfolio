/* eslint-disable */
// Generate WebP versions of all JPEGs in public/images for faster LCP/CWV.
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const DIR = path.join(__dirname, '..', 'public', 'images');
(async () => {
  const files = fs.readdirSync(DIR).filter(f => /\.(jpe?g)$/i.test(f));
  for (const f of files) {
    const src = path.join(DIR, f);
    const out = path.join(DIR, f.replace(/\.(jpe?g)$/i, '.webp'));
    await sharp(src).webp({ quality: 78 }).toFile(out);
  }
  // Also produce a compressed, right-sized hero (max 480px display => 960 @2x)
  const hero = '484D0082-4587-4FEF-AE4B-E727C7BF176B_1_105_c';
  await sharp(path.join(DIR, hero + '.jpeg')).resize(960, 960, { fit: 'cover' }).webp({ quality: 80 }).toFile(path.join(DIR, hero + '-960.webp'));
  console.log('Generated WebP for', files.length, 'images + hero-960.webp');
})().catch(e => { console.error(e); process.exit(1); });
