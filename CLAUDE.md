# Writing series — daily article routine

`src/data/articles.ts` powers the `/writing` section and is edited concurrently by more than
one source (manual commits from Michael, scheduled/automated runs). Before generating a new
article, always:

1. **Check production first.** Run `git fetch origin main` and read
   `git show origin/main:src/data/articles.ts` to see the actual current article list — do not
   rely on the state of a local branch or a prior session's memory. Production may have moved
   ahead (new articles, redesigned `Writing.tsx`/`Article.tsx`) since the last run.
2. **Never duplicate a date.** Exactly one article per calendar `date` is allowed, across the
   whole array — this is enforced at module load (`articles.ts` throws if two entries share a
   `date`). If today's date is already taken by another article, pick the next unique date
   rather than skip generating one.
3. **Always add exactly one new article per run.** The count should increase by exactly one
   from whatever production currently has — never regenerate/replace an existing entry, never
   skip a run (stagnation is treated as a bug), and never add more than one per run.
4. **Merge, don't overwrite.** If the local branch has diverged from `origin/main` (e.g. a
   redesign landed while this branch was in flight), merge `origin/main` in and resolve
   conflicts by keeping both sides' articles rather than dropping either.
5. **Never touch `build/`.** Vercel builds this app from source (`vercel.json`:
   `buildCommand: "npm run build"`) — the committed `build/` directory is not what gets deployed.
   Do not run `npm run build` and commit the output as part of this routine. Regenerating it from
   whatever base this branch happens to be on produces a diff against a stale point that can look
   like (or actually cause, on a careless merge) other in-flight PRs' unmerged work — e.g. a new
   page or asset — getting reverted. Only touch `src/data/articles.ts` (and `public/sitemap.xml`
   if adding a sitemap entry for the new article).
6. **Check open PRs too, not just `main`.** Before picking a date or writing content, skim open
   PRs that touch `src/data/articles.ts` (they may claim a date `main` doesn't know about yet) and
   skim what other open PRs already shipped (to avoid writing about — or duplicating — work someone
   else's run already covered). This routine runs concurrently with other automated work in this
   repo; `main` alone is not the full picture of what's in flight.
7. Never mention Stellantis or SFS in any article, and anonymize any non-public or deal data.
