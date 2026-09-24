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

The default config publishes **only `~/Documents/Projects`** with a 40-note cap and strips private frontmatter keys (`aliases`, `excalidraw-plugin`, …). Edit the config — never publish a whole vault.

## Chat with your models

`/api/chat` proxies to any OpenAI-compatible endpoint with streaming:

- **Hosted:** `OPENAI_API_KEY` + `OPENAI_BASE_URL` + `OPENAI_MODEL`
- **Local:** `LLM_MODELS="local://qwen2.5:7b"` + `OPENAI_LOCAL_BASE_URL` (works with Ollama, LM Studio, vLLM, RunPod, Groq, …)
- **Multiple models:** comma-separate `LLM_MODELS` to get a picker
- `CHAT_SYSTEM_PROMPT` sets the persona

## Deploy

All content pages are static; only `/api/*` runs on-demand. The project ships with the **Node standalone adapter** (`@astrojs/node`), so `npm run build` produces a runnable server:

```bash
npm run build
PORT=4321 node dist/server/entry.mjs
```

Deployment options:

- **Node hosts** (Render, Fly, Railway, any VPS): run the entry script directly.
- **Netlify / Vercel / Cloudflare Pages**: swap `@astrojs/node` for that platform's adapter (same config shape, then redeploy). Env vars only matter for the chat endpoints.

If you never intend to use the chat, you can drop the adapter and the API routes and deploy as pure static HTML.

## Customize

- Name, tagline, author, URL → `src/consts.ts`
- Colors, type, layout → `src/styles/global.css`
- Nav order and section blurbs → `SECTIONS` in `src/consts.ts`
- Favicon → `public/favicon.svg`
- RSS is generated at `/rss.xml`

## Content license

You're reading this as a template — your site, your copyright. The seed content is illustrative; replace it.
