import fs from 'node:fs';
import path from 'node:path';
import { backupFile, sanitizeData, serialize, splitDoc, stampNow } from './lib/staging.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const CONTENT = path.join(ROOT, 'src', 'content');
const SECTIONS = ['projects', 'blog', 'papers', 'art', 'comics', 'concepts', 'design', 'goals', 'values', 'garden'];

const SECTION_PURPOSE = {
  projects: 'Things being built, owned or abandoned with intent. A project post says what is being made, why, and what "working" would look like.',
  blog: 'Dated journal entries and session writeups. First person, time-stamped, often short. Records what happened while something was being learned or built.',
  papers: 'Long-form, slower, more formal writing. An argument, an analysis, a retrospective. Stands on its own without needing a project around it.',
  concepts: 'Unfinished ideas treated as first-class assets. Half-made is acceptable; a half-made idea should be named as unfinished.',
  garden: 'Durable notes from the second brain. Treated, evergreen, linkable. Not a diary.',
  goals: 'Public commitments. Written down so they are harder to quietly abandon.',
  values: 'Operating principles. How a decision gets made, stated as a principle with its reason.',
  design: 'Systems, interfaces and the obsessive detail between the idea and the artifact.',
  art: 'Visual work. Proof that not everything here is a business plan.',
  comics: 'Sequential art, mostly about the gap between what is imagined and what ships.',
};

const argv = process.argv.slice(2);
const apply = argv.includes('--apply');
const only = (() => {
  const i = argv.indexOf('--only');
  return i >= 0 ? argv[i + 1] : null;
})();
const publish = argv.includes('--publish');
const limit = (() => {
  const i = argv.indexOf('--limit');
  return i >= 0 ? Number(argv[i + 1]) : Infinity;
})();

const API = process.env.POLISH_API ?? 'http://localhost:18000/v1';
const MODEL = process.env.POLISH_MODEL ?? 'qwen3-4b';
const TIMEOUT = Number(process.env.POLISH_TIMEOUT_MS ?? 900000);
const MAX_TOKENS = Number(process.env.POLISH_MAX_TOKENS ?? 8192);
const MAX_INPUT_CHARS = Number(process.env.SHAPE_MAX_INPUT ?? 16000);

const CONTEXT = fs.readFileSync(path.join(ROOT, 'scripts', 'lib', 'creator-context.md'), 'utf8');

const SCHEMA = {
  type: 'object',
  properties: {
    verdict: { type: 'string', enum: ['keep', 'misfit', 'junk'] },
    section: { type: 'string', enum: SECTIONS },
    title: { type: 'string' },
    description: { type: 'string' },
    goal: { type: 'string' },
    outcome: { type: 'string' },
    tags: { type: 'array', items: { type: 'string' } },
    related: { type: 'array', items: { type: 'string' } },
    confidence: { type: 'number' },
  },
  required: ['verdict', 'section', 'title', 'description', 'goal', 'outcome', 'tags', 'related', 'confidence'],
};

const BODY_SCHEMA = {
  type: 'object',
  properties: { body: { type: 'string' } },
  required: ['body'],
};

function postKind(body) {
  const fences = (body.match(/```/g) ?? []).length / 2;
  const tables = (body.match(/^\|.*\|$/gm) ?? []).length;
  const numbered = (body.match(/^\s*\d+\.\s+/gm) ?? []).length;
  const mermaid = (body.match(/```mermaid/g) ?? []).length;
  const turns = (body.match(/^\*\*(?:You|Antigravity)\*\*/gm) ?? []).length;
  const signal = fences * 3 + tables + numbered + mermaid * 4;
  if (signal >= 6) return { kind: 'substance', signal, detail: `${Math.round(fences)} code blocks, ${tables} table rows, ${numbered} numbered steps` };
  if (turns >= 4) return { kind: 'transcript', signal, detail: `${turns} chat turns` };
  return { kind: 'mixed', signal, detail: 'prose with light structure' };
}

function readAll() {
  const out = [];
  for (const section of SECTIONS) {
    const dir = path.join(CONTENT, section);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
      const abs = path.join(dir, file);
      const { data, body } = splitDoc(fs.readFileSync(abs, 'utf8'));
      out.push({ section, file, slug: file.replace(/\.md$/, ''), abs, data, body });
    }
  }
  return out;
}

const all = readAll();
const catalog = all
  .map((p) => `- ${p.section}/${p.slug} :: ${String(p.data.title ?? p.slug).replace(/"/g, "'").slice(0, 90)}`)
  .join('\n');

const SYSTEM = `You are the editor-in-chief of "The Reluctant Capitalist", shaping its entire archive.

${CONTEXT}

## The sections

${SECTIONS.map((s) => `- **${s}** — ${SECTION_PURPOSE[s]}`).join('\n')}

## Format constraints (hard)

- Markdown only. Headings start at \`##\`. Never emit an H1.
- No YAML frontmatter in \`body\` — it is supplied separately.
- Remove tool noise: raw shell transcripts, stack traces, "searched the web" scaffolding, duplicated boilerplate, assistant throat-clearing, "let me know if…", restatements of the request.
- Keep the author's voice. Do not sand it into corporate neutral.
- No emoji.

## The one rule that matters most: cut padding, never substance

Before writing, decide what kind of post this is.

**Mostly padding** — a chat transcript, a session log, a rambling brainstorm, a build-log wrapped in
narration. Then cut hard. A long winded post may become a short one. Keep the substance, drop the
scaffolding around it.

**Mostly substance** — an implementation plan, a specification, code, a data table, a financial
model, a term sheet, an argument laid out in steps. Then **preserve it in full**. Tighten the prose
*around* the substance, fix the structure, add a clear opening — but every plan, every step, every
table, every figure, every code block stays.

Concretely, for a substantive post:

- Do not summarize it. Do not replace a detailed plan with a paragraph describing the plan.
- If the source has numbered steps, the output has those same steps.
- If the source has a table, the output keeps the table with the same numbers.
- If the source has code or configuration, keep it.
- Deleting more than a third of a post that contains plans, tables, code or figures means you cut
  substance, not padding. Go back and restore it.

A short post is only better when it was short because it was padded.

## Focus

Each shaped post must make its purpose legible: what this is, what it is for, what "this worked"
looks like. If a post is a fragment, make it an honest fragment with a clear shape — not a padded
essay.

## Backlinking

Pick 0-3 entries from the site catalog below that this post genuinely connects to. Use the exact
\`section/slug\` form. Only link when the connection is real — a shared subject, a dependency, a
contradiction, a stated next step. Never link merely because the words overlap.

## Site catalog

${catalog}

## Your task

Classify and frame the post supplied by the user. Do NOT rewrite its body — a separate pass handles
that. Return only JSON.

- \`verdict\`: "keep" if it belongs on this site, "misfit" if it is real but belongs to no section, "junk" if it is noise.
- \`section\`: the single best section.
- \`title\`: plain declarative phrase, sentence case, no slogan, no trailing ellipsis, no ALL CAPS.
- \`description\`: one sentence, under 160 characters.
- \`goal\`: what this post is trying to achieve, in one sentence.
- \`outcome\`: what "this worked" looks like for this post, in one sentence.
- \`tags\`: 3-6 short lowercase tags.
- \`related\`: 0-3 catalog ids.
- \`confidence\`: 0-1, how sure you are about the section and framing.`;

const RESHAPE_RULES = {
  substance: `This document is SUBSTANTIVE technical or argumentative material. Your job is mechanical
formatting, NOT summarising.

- Reproduce all of it: every heading, every numbered step, every table row, every code block, every
  mermaid diagram, every constraint, every figure.
- Do not replace a detailed plan with a paragraph about the plan.
- Delete nothing that carries information. Output must be at least 85% of the input length.
- What you may change: demote H1s to H2, remove YAML frontmatter, fix heading hierarchy, merge
  duplicated headings, tighten wordy sentences, delete assistant throat-clearing and tool noise.`,

  transcript: `This document is a CHAT TRANSCRIPT or session log. The value is what was learned and
decided, not the banter.

- Cut the scaffolding hard: assistant preambles, "let me know if", restatements of the request,
  repeated tool output, false starts.
- Keep every substantive statement, decision, figure, name, link and artifact reference.
- Turn what remains into readable prose under clear headings. Do not leave a wall of chat.
- Output should typically be 30-60% of input length. That is expected and correct here.`,

  mixed: `This document is ordinary prose with some structure. Lightly edit it.

- Fix heading hierarchy (H1 becomes H2), remove frontmatter, tighten wordy sentences, cut filler.
- Keep all substance: facts, figures, names, links, decisions.
- Output should be 70-95% of input length.`,
};

const RESHAPE_SYSTEM = `You are a formatter for a personal website. You are an EDITOR, not a summarizer.

Non-negotiable across every job:
- Never invent facts, figures, quotes, names or outcomes.
- Never drop a code block, table, mermaid diagram, numbered list or URL.
- Output Markdown only, no YAML frontmatter, headings start at H2.
- Keep the author's voice and all remaining original wording where you can.

Return JSON: {"body": "..."}`;

function userPrompt(p) {
  let body = p.body;
  const truncated = body.length > MAX_INPUT_CHARS;
  if (truncated) body = `${body.slice(0, MAX_INPUT_CHARS)}\n\n[source truncated]`;
  return [
    `CURRENT SECTION: ${p.section}`,
    `CURRENT TITLE: ${p.data.title ?? '(none)'}`,
    '---',
    body,
    '---',
  ].join('\n');
}

async function call(system, user, schema, maxTokens) {
  const res = await fetch(`${API}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(TIMEOUT),
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.25,
      max_tokens: maxTokens,
      chat_template_kwargs: { enable_thinking: false },
      response_format: { type: 'json_schema', json_schema: { name: 'out', strict: true, schema } },
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 140)}`);
  const j = await res.json();
  const c = j?.choices?.[0];
  if (c?.finish_reason === 'length') throw new Error('truncated — raise POLISH_MAX_TOKENS');
  const text = c?.message?.content ?? '';
  try {
    return JSON.parse(text);
  } catch {
    const m = text.match(/\{[\s\S]*\}/);
    if (m) {
      try {
        return JSON.parse(m[0]);
      } catch {}
    }
    throw new Error('unparseable');
  }
}

const shape = (p) => call(SYSTEM, userPrompt(p), SCHEMA, 2048);
const reshape = (p, kind) =>
  call(`${RESHAPE_SYSTEM}\n\n${RESHAPE_RULES[kind]}`, userPrompt(p), BODY_SCHEMA, MAX_TOKENS);

const slugToPath = new Map(all.map((p) => [`${p.section}/${p.slug}`, p.abs]));

function demoteH1(body) {
  let inFence = false;
  return body
    .split('\n')
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        inFence = !inFence;
        return line;
      }
      if (inFence) return line;
      const m = line.match(/^#\s+(.*)$/);
      return m ? `## ${m[1]}` : line;
    })
    .join('\n');
}

function backlinksFor(related, selfSlug) {
  const lines = [];
  for (const id of related ?? []) {
    const key = String(id).trim();
    if (!key || key === selfSlug) continue;
    if (!slugToPath.has(key)) continue;
    lines.push(key);
  }
  if (!lines.length) return '';
  const items = lines
    .map((key) => {
      const target = all.find((p) => `${p.section}/${p.slug}` === key);
      const t = String(target?.data.title ?? key).replace(/"/g, "'");
      return `- [${t}](/${key}/)`;
    })
    .join('\n');
  return `\n\n## Related\n\n${items}`;
}

function signalTokens(text) {
  const out = new Set();
  for (const m of text.matchAll(/https?:\/\/[^\s)\]]+/g)) out.add(m[0].replace(/[.,;]$/, ''));
  for (const m of text.matchAll(/\$[\d,.]+[kKmM]?\b/g)) out.add(m[0]);
  for (const m of text.matchAll(/\b\d[\d,]{2,}(?:\.\d+)?%?\b/g)) out.add(m[0]);
  for (const m of text.matchAll(/\b(?:[A-Z][a-zA-Z0-9]+)(?:\s+[A-Z][a-zA-Z0-9]+){1,3}\b/g)) out.add(m[0]);
  return out;
}

function preservation(source, shaped) {
  const want = [...signalTokens(source)].filter((t) => t.length > 3);
  if (!want.length) return { kept: 1, total: 0, missing: [] };
  const have = signalTokens(shaped);
  const missing = want.filter((t) => !have.has(t) && !shaped.includes(t));
  return { kept: 1 - missing.length / want.length, total: want.length, missing: missing.slice(0, 6) };
}

let targets = all.filter((p) => p.data.draft === true);
if (only) targets = targets.filter((p) => `${p.section}/${p.slug}` === only || `${p.section}/${p.file}` === only);
targets = targets.slice(0, limit);

console.log(`[shape] ${targets.length} posts | model ${MODEL} | ${apply ? 'WRITING' : 'dry run'}`);
console.log(`[shape] catalog ${all.length} posts, system prompt ${SYSTEM.length} chars`);

const results = { generatedAt: new Date().toISOString(), model: MODEL, publish, applied: apply, shaped: [], skipped: [], failed: [] };
let ok = 0;
let failed = 0;
let contentLoss = 0;

for (const p of targets) {
  process.stdout.write(`  · ${p.section}/${p.slug} ... `);
  let s;
  try {
    s = await shape(p);
  } catch (err) {
    failed++;
    results.failed.push({ post: `${p.section}/${p.slug}`, error: err.message });
    console.log(`FAILED (${err.message})`);
    continue;
  }

  const verdict = ['keep', 'misfit', 'junk'].includes(s.verdict) ? s.verdict : 'keep';
  if (verdict === 'junk') {
    results.skipped.push({ post: `${p.section}/${p.slug}`, verdict, reason: s.goal });
    console.log(`junk — ${String(s.goal).slice(0, 50)}`);
    continue;
  }

  const title = String(s.title ?? '').replace(/[*_`#]/g, '').replace(/\s+/g, ' ').trim().slice(0, 110);
  const description = String(s.description ?? '').replace(/[*_`#]/g, '').replace(/\s+/g, ' ').trim().slice(0, 175);
  const tags = [...new Set((s.tags ?? []).map((t) => String(t).toLowerCase().replace(/^#/, '').replace(/\s+/g, '-').replace(/[^a-z0-9/_-]/g, '')).filter(Boolean))].slice(0, 6);
  const target = verdict === 'misfit' ? p.section : SECTIONS.includes(s.section) ? s.section : p.section;

  const kind = postKind(p.body);
  let shapedBody;
  try {
    const r = await reshape(p, kind.kind);
    shapedBody = String(r.body ?? '').trim();
  } catch (err) {
    failed++;
    results.failed.push({ post: `${p.section}/${p.slug}`, error: `reshape: ${err.message}`, kind: kind.kind });
    console.log(`RESHAPE FAILED (${err.message})`);
    continue;
  }
  shapedBody = shapedBody.replace(/^---\n[\s\S]*?\n---\n/, '');
  shapedBody = demoteH1(shapedBody);
  shapedBody += backlinksFor(s.related, `${p.section}/${p.slug}`);

  const before = p.body.replace(/\s+/g, ' ').trim().length;
  const after = shapedBody.replace(/\s+/g, ' ').trim().length;
  const shrink = before ? (before - after) / before : 0;
  const keep = preservation(p.body, shapedBody);
  const lossy = keep.total >= 8 && keep.kept < 0.7;
  if (lossy) contentLoss++;

  const rejectedBody = lossy;
  if (rejectedBody) {
    shapedBody = p.body;
    console.log(`  ⤷ body rewrite rejected (facts ${(keep.kept * 100).toFixed(0)}% of ${keep.total}) — keeping source body, keeping LLM framing`);
  }

  const next = { ...p.data, title: title || p.data.title, description: description || p.data.description, tags: tags.length ? tags : p.data.tags };
  if (publish) next.draft = false;
  const out = serialize(sanitizeData(target, next), shapedBody);

  let dest = p.abs;
  if (target !== p.section) dest = path.join(CONTENT, target, p.file);
  if (apply) {
    backupFile(ROOT, p.abs);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, out);
    if (dest !== p.abs && fs.existsSync(p.abs)) fs.unlinkSync(p.abs);
  }
  ok++;
  results.shaped.push({
    from: `${p.section}/${p.slug}`,
    to: target === p.section ? null : `${target}/${p.slug}`,
    verdict,
    title,
    goal: s.goal,
    outcome: s.outcome,
    related: s.related ?? [],
    confidence: s.confidence,
    kind: kind.kind,
    kindDetail: kind.detail,
    beforeChars: before,
    afterChars: after,
    shrink: Number(shrink.toFixed(3)),
    factPreserved: Number(keep.kept.toFixed(3)),
    factsChecked: keep.total,
    missingSignals: keep.missing,
    possibleContentLoss: lossy,
    bodyRewriteRejected: rejectedBody,
  });
  console.log(
    `${verdict}${target !== p.section ? `→${target}` : ''} conf=${Number(s.confidence ?? 0).toFixed(2)} ` +
      `${rejectedBody ? 'META-ONLY' : `len ${before}→${after}`} facts ${(keep.kept * 100).toFixed(0)}%${lossy ? ' ⚠ BODY KEPT' : ''} :: ${title.slice(0, 34)}`,
  );
}

const outPath = path.join(ROOT, 'reviews', `SHAPED-${stampNow()}.json`);
fs.writeFileSync(outPath, `${JSON.stringify(results, null, 2)}\n`);
console.log(`[shape] ${ok} shaped, ${results.skipped.length} junk, ${failed} failed, ${contentLoss} flagged for shrinkage`);
console.log(`[shape] wrote ${path.relative(ROOT, outPath)}`);
