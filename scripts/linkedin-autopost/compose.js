/* eslint-disable */
// Turns an article into LinkedIn post copy.
//
// Deliberately mechanical: it reuses the article's own title and description
// rather than generating new claims, so a scheduled run can never publish a
// statement that isn't already on the site.
const { toPlainText } = require('./articles');

const SITE = 'https://www.michael-kaminski.io';
const MAX_LEN = 3000; // LinkedIn's hard commentary limit

/** Hashtags by topic, matched against the article's own words. */
const TAG_RULES = [
  { test: /fintech|payments?|lending|credit|bank/i, tags: ['#Fintech'] },
  { test: /atlanta/i, tags: ['#Atlanta'] },
  { test: /cfo|cto|fractional/i, tags: ['#FractionalCFO'] },
  { test: /ai|claude|llm|agent|posthog|analytics/i, tags: ['#AI'] },
  { test: /build|ship|code|engineer|refactor|bug/i, tags: ['#SoftwareEngineering'] },
  { test: /quality of earnings|diligence|m&a|valuation/i, tags: ['#PrivateEquity'] },
];

function hashtagsFor(article) {
  const haystack = `${article.title} ${article.description} ${article.series || ''}`;
  const tags = new Set(['#BuildInPublic']);
  TAG_RULES.forEach((rule) => {
    if (rule.test.test(haystack)) rule.tags.forEach((t) => tags.add(t));
  });
  return [...tags].slice(0, 5).join(' ');
}

/** First sentence of the body, used as the hook when it's punchy enough. */
function openingLine(article) {
  const plain = toPlainText(article.body);
  const first = (plain.split(/(?<=[.!?])\s+/)[0] || '').trim();
  return first.length >= 40 && first.length <= 220 ? first : '';
}

function composePost(article) {
  const url = `${SITE}/writing/${article.slug}`;
  const hook = openingLine(article);

  const parts = [
    article.series ? `${article.series} — ${article.title}` : article.title,
    '',
    hook || article.description,
  ];

  // Only include the description separately when it isn't already the hook,
  // otherwise the post repeats itself.
  if (hook && article.description && hook !== article.description) {
    parts.push('', article.description);
  }

  parts.push('', `Read it → ${url}`, '', hashtagsFor(article));

  let text = parts.join('\n').replace(/\n{3,}/g, '\n\n').trim();

  if (text.length > MAX_LEN) {
    const tail = `\n\nRead it → ${url}\n\n${hashtagsFor(article)}`;
    text = text.slice(0, MAX_LEN - tail.length - 1).replace(/\s+\S*$/, '') + '…' + tail;
  }
  return text;
}

module.exports = { composePost, hashtagsFor, SITE, MAX_LEN };
