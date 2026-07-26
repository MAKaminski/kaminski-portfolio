/* eslint-disable */
// Loads src/data/articles.ts from Node without a build step.
//
// The article list is authored in TypeScript and consumed by the React app, so
// rather than duplicating it (which would immediately drift) this transpiles
// that one file in memory with the TypeScript compiler that's already a
// dependency. The module-load duplicate-date guard in articles.ts runs as a
// side effect, so a malformed list fails here too rather than at deploy time.
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const ARTICLES_TS = path.join(__dirname, '..', '..', 'src', 'data', 'articles.ts');

function loadArticles() {
  const source = fs.readFileSync(ARTICLES_TS, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
    fileName: 'articles.ts',
  });

  const mod = { exports: {} };
  new Function('exports', 'module', 'require', outputText)(mod.exports, mod, require);

  if (!Array.isArray(mod.exports.articles)) {
    throw new Error('src/data/articles.ts did not export an `articles` array');
  }
  return mod.exports.articles;
}

/** Strip the author-written HTML body down to plain text. */
function toPlainText(html) {
  return html
    .replace(/<\/(p|h2|h3|li|ul)>/gi, '\n')
    .replace(/<li>/gi, '• ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/\n{2,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

module.exports = { loadArticles, toPlainText };
