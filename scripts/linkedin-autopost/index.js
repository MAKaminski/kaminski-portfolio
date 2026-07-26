/* eslint-disable */
// Auto-poster: turns the newest unposted /writing article into a LinkedIn
// image post.
//
//   node scripts/linkedin-autopost            # dry run — writes artifacts, posts nothing
//   node scripts/linkedin-autopost --publish  # actually posts (needs credentials)
//   node scripts/linkedin-autopost --slug=my-article --publish
//
// Dry run is the default on purpose: publishing writes to a real public feed
// and cannot be undone from here. Nothing is sent unless --publish is passed
// *and* both credentials are present.
const fs = require('fs');
const path = require('path');

const { loadArticles } = require('./articles');
const { renderCard } = require('./card');
const { publish } = require('./linkedin');
const { composePost, SITE } = require('./compose');

const STATE_FILE = path.join(__dirname, 'posted.json');
const OUT_DIR = path.join(__dirname, 'out');

const argv = process.argv.slice(2);
const hasFlag = (name) => argv.includes(`--${name}`);
const flagValue = (name) => {
  const hit = argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : undefined;
};

function readState() {
  if (!fs.existsSync(STATE_FILE)) return { posted: [] };
  try {
    const parsed = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    return Array.isArray(parsed.posted) ? parsed : { posted: [] };
  } catch (err) {
    throw new Error(`posted.json is not valid JSON (${err.message}). Refusing to run — fix or delete it, otherwise every article looks unposted and would be re-posted.`);
  }
}

function writeState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + '\n');
}

/** Newest article that hasn't been posted yet. */
function pickArticle(articles, state, explicitSlug) {
  if (explicitSlug) {
    const found = articles.find((a) => a.slug === explicitSlug);
    if (!found) throw new Error(`No article with slug "${explicitSlug}"`);
    return found;
  }
  const done = new Set(state.posted.map((p) => p.slug));
  return [...articles]
    .filter((a) => !done.has(a.slug))
    .sort((a, b) => (a.date < b.date ? 1 : -1))[0];
}

async function main() {
  const wantsPublish = hasFlag('publish');
  const token = process.env.LINKEDIN_ACCESS_TOKEN;
  const authorUrn = process.env.LINKEDIN_AUTHOR_URN;

  const articles = loadArticles();
  const state = readState();
  const article = pickArticle(articles, state, flagValue('slug'));

  if (!article) {
    console.log(`Nothing to post — all ${articles.length} articles are already in posted.json.`);
    return;
  }

  const commentary = composePost(article);
  const image = await renderCard({
    title: article.title,
    series: article.series,
    date: article.date,
    domain: SITE.replace(/^https?:\/\//, ''),
  });
  const altText = `${article.series ? article.series + ' — ' : ''}${article.title}`;

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const imagePath = path.join(OUT_DIR, `${article.slug}.png`);
  const textPath = path.join(OUT_DIR, `${article.slug}.txt`);
  fs.writeFileSync(imagePath, image);
  fs.writeFileSync(textPath, commentary);

  console.log(`Article : ${article.title}`);
  console.log(`Slug    : ${article.slug}  (${article.date})`);
  console.log(`Image   : ${imagePath}  (${(image.length / 1024).toFixed(0)} KB)`);
  console.log(`Text    : ${textPath}  (${commentary.length} chars)`);
  console.log('---');
  console.log(commentary);
  console.log('---');

  if (!wantsPublish) {
    console.log('\nDry run. Nothing was posted. Re-run with --publish to post for real.');
    return;
  }

  const missing = [
    !token && 'LINKEDIN_ACCESS_TOKEN',
    !authorUrn && 'LINKEDIN_AUTHOR_URN',
  ].filter(Boolean);
  if (missing.length) {
    // Exit non-zero: --publish was explicitly requested and could not be
    // honoured, which should fail a CI run rather than look like a success.
    console.error(`\n--publish requires ${missing.join(' and ')}. See scripts/linkedin-autopost/README.md.`);
    process.exit(1);
  }

  const { postUrn } = await publish({
    token,
    authorUrn,
    commentary,
    imageBuffer: image,
    altText,
  });

  state.posted.push({
    slug: article.slug,
    title: article.title,
    postedAt: new Date().toISOString(),
    postUrn,
  });
  writeState(state);

  console.log(`\nPosted. ${postUrn}`);
  console.log('posted.json updated — commit it so the next run skips this article.');
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
