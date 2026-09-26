# The Reluctant Capitalist

> A polymath's field notes on ideas, craft, and the awkward business of selling them.

A personal blog + project index + limited digital garden + model chat, built as a **template** so it can be cloned and repurposed. The persona is baked into the design and seed content; swap the content, keep the machinery.

## What's inside

| Section | Route | Contents |
|---|---|---|
| Projects | `/projects/` | Things built, abandoned, or in progress |
| Journal | `/blog/` | Long-form writing |
| Concepts | `/concepts/` | Unfinished ideas treated as first-class assets |
| Papers | `/papers/` | Formal writing and working notes |
| Digital Garden | `/garden/` | A **limited, curated slice** of your Obsidian vault — never the whole thing |
| Art / Comics / Design | `/art/ /comics/ /design/` | Visual work |
| Goals / Values | `/goals/ /values/` | Public commitments and the operating system |
| Chat | `/chat/` | A streaming chat with any OpenAI-compatible model |

## Quick start

```bash
npm install
npm run dev          # http://localhost:4321
```

To point the chat at a real model, copy `.env.example` to `.env` and add a key. No key = demo mode (canned replies, streaming UI still testable).

## How content works

Drop markdown (or MDX) files into any folder under `src/content/` and the site builds them — no code changes. Schema and descriptions live in `src/content.config.ts`.

```bash
src/content/
  projects/   # status: seed | concept | prototype | active | paused | shipped | killed
  blog/       # draft: true hides an entry
  papers/     # type: essay | paper | letter | notes
  concepts/   # status: seed | developing | relayed | shelved
  art/  comics/  design/
  goals/      # status: active | done | stalled | dropped ; target: YYYY-MM-DD
  values/     # weight: ordering, high first
  garden/     # synced — see below
```

## Digital garden (limited second brain)

The vault stays private. `scripts/sync-garden.mjs` copies only notes that pass the allowlist rules in `garden.config.json`:

```bash
npm run sync:garden
```

The default config reads `~/Documents/UnifiedVault` and publishes only these folders — `Projects`, `projects`, `Areas`, `Knowledge`, `Daily`, `Goals`, `Inbox` — capped at 250 notes and 120 KB per note, and it strips private frontmatter keys (`aliases`, `excalidraw-plugin`, …). Edit the config — never publish a whole vault.

Most garden posts currently in `src/content/garden/` come from Antigravity conversation exports (`antigravity://…` ids) rather than the vault; those are ingested by `npm run ingest` and classified with `npm run classify`.

## Chat

`/chat/` is a **static demo**. It renders a scripted widget and posts nowhere — there is no `/api/chat` route and no adapter, because the site is a fully static build. To make it real you would need to add a server endpoint (or point the widget at a hosted one); see the deploy section for why that is not set up here.

## Deploy

The site is **fully static** (`output: 'static'`, no adapter). `npm run build` writes plain HTML to `dist/`, which can be served by any static host.

Deployment is automated via GitHub Actions — `.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push to `main`. Never deploy outside that path.

Two things are required for a project Pages site (served from a subpath, not the domain root):

- `PAGES_BASE` must be set to the project path, or Astro emits root-absolute links (`/blog/…`) that 404 off-prefix.
- `public/antigravity/` is **committed** (~145 MB). It was originally gitignored as regenerable data, but 59 posts reference 341 of those files, so a CI checkout without them 404s every image.

```bash
# reproduce the CI build locally
PAGES_BASE=/reluctant.capitalist npm run build
node scripts/fix-base-media.mjs   # prefix literal <img src="/antigravity/…"> in content
node scripts/build-sitemap.mjs    # emit dist/sitemap.xml
```

`scripts/fix-base-media.mjs` exists because Astro rewrites its own links for `base` but not literal HTML inside markdown. Both scripts are idempotent and touch only `dist/`.

## Customize

- Name, tagline, author, URL → `src/consts.ts`
- Colors, type, layout → `src/styles/global.css`
- Nav order and section blurbs → `SECTIONS` in `src/consts.ts`
- Favicon → `public/favicon.svg`
- RSS is generated at `/rss.xml`

## Content license

You're reading this as a template — your site, your copyright. The seed content is illustrative; replace it.
