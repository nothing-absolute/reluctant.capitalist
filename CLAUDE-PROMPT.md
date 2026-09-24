# Claude Prompt — Rebuild "The Reluctant Capitalist"

> Paste everything below the line into Claude (Artifacts mode works best for the
> single-file version). It describes the real site in
> `/media/jd/500gb/LINUX/reluctant.capitalist/` so you can recreate it from scratch.
> For the full Astro implementation instead of the mockup, change the final
> instruction from "one self-contained HTML file" to "a complete Astro 5 project".

---

Build a personal blog / project-index site called **"The Reluctant Capitalist."**

## Persona
An independent polymath maker who would rather build than sell, explain than
pitch. The site is the compromise: build honestly, publish the receipts, and let
the work ask for the money instead of the author. Tagline: *"A polymath's field
notes on ideas, craft, and the awkward business of selling them."*

## Design system
- **Paper texture**: warm cream background `#f5f1e6` with a faint 1px dot grain;
  raised panels `#ede7d5`; cards `#fbf9f2`.
- **Ink**: near-black `#1d1a15` text, muted `#6f685a` metadata.
- **Accent**: burnt sienna `#b8451c` (links, kickers, dollar sign in logo).
- **Type**: Fraunces (serif) for headings/body voice; JetBrains Mono for metadata,
  kickers, and `/$section` labels. No dark mode — this is paper on purpose.
- **Layout**: sticky header, max-width 1120px container, 680px prose column.
  Section index = responsive card grid (min 300px cards). Home = 2-column:
  latest feed + "Why reluctant?" sidebar.
- **Header wordmark**: `$The Reluctant Capitalist` with the dollar sign in accent.
- **Logo**: dark rounded square, cream `$` in serif, one burnt-sienna dot
  (SVG favicon).

## Pages & sections
1. **Home** (`/`) — masthead with tagline, 6 latest cards, a full section list
   with blurbs, sidebar essay "Why reluctant?", a chat teaser link.
2. **Ten content sections**, each an index page of cards + a detail page:
   Projects (status: seed/concept/prototype/active/paused/shipped/killed),
   Journal (blog posts), Concepts (unfinished ideas), Papers & essays,
   Art, Comics, Design, Goals (with target dates), Values (weighted ordering),
   Digital Garden.
3. **Digital Garden** — "a limited, curated slice of my second brain." Public
   rules: nothing private, notes get pruned, `[[wikilinks]]` render as text if
   unlinked. A welcome note states: "The vault contains decades of noise; this
   garden contains only the notes I am willing to stand behind in public."
4. **Chat page** (`/chat`) — a terminal-like chat window with a model picker,
   starter prompt chips, streaming responses, and a status line reading
   "demo mode — no API key configured" or "connected to <model>". Replies are
   rendered markdown-lite (bold, code, lists, code fences). In demo mode the
   assistant answers with a canned explanation of how to configure a key.

## Content model
Everything is markdown; each file has frontmatter (`title`, `description`,
`date`, `tags`, plus per-section fields like `status`, `weight`, `target`).
Drop a file in a folder and it appears — no code changes. Show 4–6 realistic
seed entries per section drawn from an indie maker's life: a hardware
crowdfunding mock (Opendoors), a single-file hydration tracker, an AI agent
persona called TERAX, a paused ops startup (Skycrew), a generative-video
experiment, a comic called "Pitch vs. Prototype", values like "Ideas are seeds,
not assets" and "Honest economics", and a concept called "Idea Relay" — a
blockchain-provenance marketplace for handing off unfinished projects.

## Reading experience
Serif body ~18px, generous line height, long-form detail pages with byline
(date · status pill · tags · stack), pull quotes with a burnt-sienna left
border, monospace metadata, subtle hover lift on cards.

## Deliverable
One self-contained HTML file (inline CSS + JS) that renders the full home page
and every section with the seed content above, plus a working chat panel in
demo mode. Make it feel like a real product, not a wireframe.
