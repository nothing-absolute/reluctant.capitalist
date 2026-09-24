# Agent Instructions — reluctant.capitalist

## Home and storage
- This project lives at `/media/jd/500gb/LINUX/reluctant.capitalist/`. It is the permanent home for the site's code and data (second-brain snapshots and, in future, the app database in `data/`).
- The drive is **exFAT**: no symlinks, no hardlinks, no persistent exec bits. Never `pnpm install`/`npm install` directly here (both create `.bin`/shim symlinks and fail). To install locally: install in `/tmp/opencode/rc-install` (copy `package.json` + `pnpm-lock.yaml`, run `pnpm install --frozen-lockfile`), then `rsync -L -a` node_modules here to dereference all symlinks. CI installs normally instead.

## Publishing policy (the most important rule)
- **Never auto-publish.** Nothing on this site goes public — merged into `src/content/**`, deployed, or pushed to a released branch — without the owner's explicit, per-step decision.
- Second brain content enters the project only through versioned **snapshots** (`snapshots/<timestamp>/`), which are private in-project records. OpenCode and Antigravity history enters only as **ingest candidates** (`reviews/src/*.json`). None of these are served.
- **Review → promote** is the only way content reaches the served site: a classified review tree (`reviews/<ts>/` + `MANIFEST.md`) is checked by the owner, and `npm run promote` copies only `[x]`-approved entries into `src/content/<section>/`.
- `draft: true` (set automatically on journal/blog entries) keeps a published file off the public pages until the owner flips it. GitHub Pages deploys happen via the `deploy.yml` workflow; never deploy outside that path.

## Beta stage: LLM owns the editorial decisions (owner directive, 2026-09-24)

**This section deliberately overrides "never auto-publish" above, for the shaping pass only.**

- JD's instruction: for this beta prototype, **the LLM decides everything about how content is
  formatted, categorized, titled, focused and backlinked.** Do not ask for per-post approval and do
  not hold results as `draft: true` awaiting sign-off. JD will curate *afterwards* — altering or
  excluding any post from the public build is his prerogative, not a precondition for the work.
- This is an explicit test of capability: can a cloud-GPU LLM take a large, non-uniform, badly
  formatted corpus and mold it into this site's constrained blog format, from first principles and
  the creator's own writing, without hand-holding?
- The work runs on **RunPod** (provision only while processing; stop immediately after — see the
  RunPod cost guard in `/home/jd/Prototypes/AGENTS.md`).
- **What this does NOT change:** deploying to the public internet. There is no deploy path in this
  repo. `draft: false` means "included in the local build and on localhost", not "pushed to GitHub
  Pages". Any real publish remains a manual, owner-initiated step.
- **Revert path:** everything is regenerable from `reviews/` plus `.staging-backups/`, and
  `baseline-staging-2026-09-24` is the pre-beta tag. `scripts/shape-posts.mjs` is idempotent-ish:
  re-running it reshapes whatever is currently in `src/content`.

## Commands
- Build: `npm run build` (local) else the GitHub Actions workflow `pnpm build` (CI). Preview: `npm run dev` (localhost) / `npm run preview` (built output).
- Review loop (the daily flow):
  1. `npm run snapshot` — copy the second brain into `snapshots/<ts>/`.
  2. `npm run ingest` — extract opencode + antigravity candidates into `reviews/src/*.json`.
  3. `npm run classify` — normalize + route snapshot + ingest into `reviews/<ts>/{projects,blog,concepts,papers,goals,garden,skipped}/` and write `MANIFEST.md` (checkbox lines you edit).
  4. Owner edits `MANIFEST.md`: `- [x]` approves, the section token retargets, `[ ]` skips. Inspect candidate files directly.
  5. `npm run promote [--dry-run] [--force]` — copy approved entries into `src/content/<section>/`. Journal entries stay `draft: true` until flipped off.
  6. Rebuild/re-read. Exclusions for the vault go in `.garden-exclude.json` (exact path or folder-prefix) and are quarantined at classify time.
- The vault itself is never read by the build; only snapshots are. Garden notes are generated candidates, not hand-edited — prefer editing the source vault note and re-snapshotting.

## Content schema
Content files drop into `src/content/<section>/` — see `src/content.config.ts` and `src/consts.ts`. Every collection carries an optional `source` field for provenance (`vault path`, `opencode://…`, `antigravity://…`). Normalization is deterministic (`scripts/lib/normalize.mjs`): empty frontmatter values are dropped (they used to parse as `"---"`), template vars (`{{…}}`), wikilinks/embeds are collapsed, `#` headers demoted to `##`, junk templates quarantined.

## Known later phases (not yet implemented)
- AI polish pass over promoted drafts (deterministic cleanup only today — no models in the pipeline).
- Local `/review/` web page instead of on-disk manifest review.