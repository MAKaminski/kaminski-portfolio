# Writing series — daily article routine

`src/data/articles.ts` powers the `/writing` section and is edited concurrently by more than
one source (manual commits from Michael, scheduled/automated runs). Before generating a new
article, always:

1. **Check production first.** Run `git fetch origin main` and read
   `git show origin/main:src/data/articles.ts` to see the actual current article list — do not
   rely on the state of a local branch or a prior session's memory. Production may have moved
   ahead (new articles, redesigned `Writing.tsx`/`Article.tsx`) since the last run.
1b. **Also check open PRs before picking a series volume number or a date.** `origin/main` alone
   isn't the whole picture — other in-flight branches (manual or scheduled) routinely add their
   own `articles.ts` entry before merging, and `main` won't show it yet. List open PRs and, for
   any that touch `src/data/articles.ts`, read that file on their head branch
   (`git fetch origin <branch>` + `git show origin/<branch>:src/data/articles.ts`) so a new
   article doesn't reuse a "Vol. N" label or a date another pending PR already claimed. This bit
   the routine on 2026-07-26: PR #19 (open, unmerged) had already added "Vol. 2" for 2026-07-25,
   and PR #21 (open, unmerged) had already added "Vol. 3" for 2026-07-26, but a run that only
   checked `origin/main` couldn't see either and generated a colliding second "Vol. 2" dated
   2026-07-26 — effectively burying PR #19's entry until someone noticed. Fixed by pulling PR
   #19's real article back in and renumbering the new one to Vol. 4 on the next open date.
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
5. Never mention Stellantis or SFS in any article, and anonymize any non-public or deal data.
