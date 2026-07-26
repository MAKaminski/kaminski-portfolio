# LinkedIn auto-poster

Turns the newest unposted `/writing` article into a LinkedIn image post: a
branded 1200×627 card plus commentary built from the article's own title and
description.

```bash
npm run linkedin:preview          # dry run — renders artifacts, posts nothing
npm run linkedin:post             # publishes (requires credentials, see below)
node scripts/linkedin-autopost --slug=my-article-slug
```

## It does not post by default

A dry run is the default because publishing writes to a real, public feed and
cannot be undone from here. Nothing is sent unless `--publish` is passed **and**
both credentials are set. A dry run writes to `out/` (gitignored):

- `out/<slug>.png` — the card that would be attached
- `out/<slug>.txt` — the exact commentary that would be posted

Review those before running for real.

## Setup

1. **Create a LinkedIn app** at <https://www.linkedin.com/developers/apps>, and
   associate it with a Page you control.
2. **Request the "Share on LinkedIn" product**, which grants the
   `w_member_social` scope. This is the only scope needed to post as yourself.
3. **Get a member access token** via the 3-legged OAuth flow. LinkedIn's
   developer console has a token generator that will do this for a single
   member without you standing up a callback server. Tokens expire in ~60 days,
   so this is a recurring manual step unless you also store the refresh token.
4. **Find your author URN.** With the token, `GET https://api.linkedin.com/v2/userinfo`
   returns a `sub` claim; the URN is `urn:li:person:<sub>`.

Then set:

| Variable | Example | Notes |
| --- | --- | --- |
| `LINKEDIN_ACCESS_TOKEN` | `AQV...` | Member token with `w_member_social`. Secret. |
| `LINKEDIN_AUTHOR_URN` | `urn:li:person:AbC123` | Who the post is authored by. |
| `LINKEDIN_API_VERSION` | `202401` | Optional. Pinned; bump deliberately. |

## State

`posted.json` records what has already gone out, so a scheduled run never
posts the same article twice. It is committed on purpose — CI runners are
ephemeral, so an untracked state file would mean re-posting the whole back
catalogue on every run.

If a post succeeds but the commit of `posted.json` fails, the next run will
re-post that article. Check the file before re-running after a failure.

## Scheduling

`.github/workflows/linkedin-autopost.yml` runs daily. It is **dry-run only**
unless you opt in:

- Manually: run the workflow via *Actions → LinkedIn auto-post → Run workflow*
  and set `publish` to `true`.
- On the schedule: set the repository variable `LINKEDIN_AUTOPOST_ENABLED` to
  `true`, and add `LINKEDIN_ACCESS_TOKEN` / `LINKEDIN_AUTHOR_URN` as repository
  secrets.

The dry-run artifacts are uploaded on every run, so you can see what *would*
have posted without enabling anything.

## Media

Images only for now. `card.js` owns rendering, so adding a video generator
later means adding a sibling module and choosing between them in `index.js` —
the LinkedIn client already separates "upload an asset" from "create a post",
and video uses the same shape against `/rest/videos`.
