# Writing series — daily article routine

`src/data/articles.ts` powers the `/writing` section and is edited concurrently by more than
one source (manual commits from Michael, scheduled/automated runs). Before generating a new
article, always:

1. **Check production first.** Run `git fetch origin main` and read
   `git show origin/main:src/data/articles.ts` to see the actual current article list — do not
   rely on the state of a local branch or a prior session's memory. Production may have moved
   ahead (new articles, redesigned `Writing.tsx`/`Article.tsx`) since the last run.
2. **Check in-flight work too, not just `main`.** `origin/main` is not the whole picture — a run
   that only reads `main` cannot see sibling runs whose articles are still sitting in unmerged
   branches, and several concurrent runs will each happily claim the same date and the same
   volume number. Before picking a date or a `Vol. N`, also run
   `git ls-remote origin 'refs/heads/*'` and check every unmerged branch's `articles.ts`
   (`git show origin/<branch>:src/data/articles.ts`). Treat dates and volume numbers claimed by
   an open branch as taken.
3. **Never duplicate a date.** Exactly one article per calendar `date` is allowed, across the
   whole array — this is enforced at module load (`articles.ts` throws if two entries share a
   `date`). If today's date is already taken by another article, pick the next unique date
   rather than skip generating one.
4. **Always add exactly one new article per run.** The count should increase by exactly one
   from whatever production currently has — never regenerate/replace an existing entry, never
   skip a run (stagnation is treated as a bug), and never add more than one per run.
5. **Merge, don't overwrite.** If the local branch has diverged from `origin/main` (e.g. a
   redesign landed while this branch was in flight), merge `origin/main` in and resolve
   conflicts by keeping both sides' articles rather than dropping either. The same applies to a
   sibling branch's article: recover it and renumber, never drop it to resolve a collision.
6. **Rebuild `build/` before committing.** The compiled bundle is checked in, so an article added
   to `src/` without a `npm run build` leaves the committed artifact contradicting the source.
7. Never mention Stellantis or SFS in **article body copy or in project/case-study
   narrative** — describe the employer as "a regulated consumer lender" — and anonymize any
   non-public or deal data. The employer name may still appear where it is load-bearing for
   entity resolution and already public: `Person.worksFor` in `public/index.html`,
   `public/llms.txt`, and the `src/data/experience.ts` timeline. (This used to read "in any
   article", which left it unclear whether the JSON-LD was in scope; it is not.)

8. **Every route must be prerendered.** `scripts/routes.js` is the single source of truth
   for non-article routes and is consumed by both `scripts/prerender.js` and
   `scripts/generate-sitemap.js`. Adding a route to one and not the other is what caused
   eleven URLs to serve the home page's HTML to crawlers. `scripts/verify-prerender.js`
   runs after every build and will say so if it happens again — read its output.
