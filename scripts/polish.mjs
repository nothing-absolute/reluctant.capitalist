// polish: AI-assisted review annotations for a review dir (runs after classify,
// before promote). Asks a local OpenAI-compatible LLM (default: the phone's
// PrivateLM server) to, per candidate:
//   - reformat/normalize the markdown body (site style)
//   - copyedit the prose
//   - suggest title/description/tags (frontmatter enrichment)
//   - produce a quality review (scores + notes)
// Writes <section>/<file>.polished.md next to each candidate (never edits the
// candidate), plus polish/POLISH.md annotations and polish/diffs/<file>.diff.
// `--apply` is the explicit publish step: it replaces the candidate with the
// polished version; then `npm run promote` copies approved files as usual.
//
// Usage:
//   node scripts/polish.mjs                 # newest review dir, all candidates
//   node scripts/polish.mjs 20260923-..     # a specific review dir
//   node scripts/polish.mjs --approved      # only `[x]` (approved) lines
//   node scripts/polish.mjs blog/slug       # a specific section/file
//   node scripts/polish.mjs --diff          # print unified diffs to stdout
//   node scripts/polish.mjs --apply         # apply polished files (publish step)
// Env: POLISH_API (default http://10.84.161.108:8080/v1), POLISH_MODEL,
//      POLISH_API_KEY (Bearer token, e.g. a Modal proxy token), POLISH_TIMEOUT_MS
//      (default 900000).
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { parseFrontmatter, cleanBody, cleanTitle } from './lib/normalize.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const argc = process.argv.slice(2);
const applyMode = argc.includes('--apply');
const diffOut = argc.includes('--diff');
const onlyApproved = argc.includes('--approved');
const forceLarge = argc.includes('--force');
const given = argc.filter((a) => !a.startsWith('-'));

const API = process.env.POLISH_API || 'http://10.84.161.108:8080/v1';
const API_KEY = process.env.POLISH_API_KEY || '';
const TIMEOUT = Number(process.env.POLISH_TIMEOUT_MS || 900000);
const MAX_TOKENS = Number(process.env.POLISH_MAX_TOKENS || 4096);
const MAX_INPUT_CHARS = 20000; // ~6k tokens in + budget for a full rewrite out

// --- review dir selection ---------------------------------------------------
function newestReview() {
  const dir = path.join(ROOT, 'reviews');
  if (!fs.existsSync(dir)) return null;
  return fs.readdirSync(dir)
    .filter((d) => fs.statSync(path.join(dir, d)).isDirectory() && fs.existsSync(path.join(dir, d, 'MANIFEST.md')))
    .sort().reverse()[0] || null;
}

let reviewName = null;
let fileSpecs = [];
for (const g of given) {
  const p = path.join(ROOT, 'reviews', g);
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) reviewName = g;
  else fileSpecs.push(g);
}
if (!reviewName) reviewName = newestReview();
if (!reviewName) {
  console.error('[polish] no review dir found — run classify first, or pass one');
  process.exit(1);
}
const reviewDir = path.join(ROOT, 'reviews', reviewName);
const manifest = path.join(reviewDir, 'MANIFEST.md');
if (!fs.existsSync(manifest)) {
  console.error(`[polish] ${reviewDir} has no MANIFEST.md`);
  process.exit(1);
}

// --- model discovery ----------------------------------------------------------
let model = process.env.POLISH_MODEL || null;
function authHeaders() {
  return API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {};
}

async function fetchModel() {
  if (model) return model;
  try {
    const res = await fetch(`${API}/models`, { signal: AbortSignal.timeout(10000), headers: authHeaders() });
    const j = await res.json();
    model = j?.data?.[0]?.id || null;
  } catch { model = null; }
  if (!model) {
    console.error(`[polish] cannot reach LLM at ${API} — start the server, or set POLISH_MODEL`);
    process.exit(1);
  }
  return model;
}

function stripThinking(content) {
  const s = (content || '').trim();
  const m = s.match(/^(?:thinking|think)\s*[\s\S]*?\nresponse\s*\n([\s\S]*)$/i);
  if (m && m[1].trim()) return m[1].trim();
  return s;
}

// Set POLISH_JSON_SCHEMA=1 when the OpenAI-compatible server supports
// response_format (llama.cpp grammar / structured output). Forces valid JSON
// even when the model would otherwise emit invalid escapes ($, quotes) in prose.
const SCHEMA = {
  type: 'object',
  properties: {
    reformatted: { type: 'string' },
    title: { type: 'string' },
    description: { type: 'string' },
    tags: { type: 'array', items: { type: 'string' } },
    scores: {
      type: 'object',
      properties: {
        clarity: { type: 'integer', minimum: 0, maximum: 5 },
        quality: { type: 'integer', minimum: 0, maximum: 5 },
      },
      required: ['clarity', 'quality'],
    },
    notes: { type: 'string' },
  },
  required: ['reformatted', 'title', 'description', 'tags', 'scores', 'notes'],
};
const useSchema = process.env.POLISH_JSON_SCHEMA === '1';

async function chat(messages, maxTokens) {
  const body = {
    model,
    messages,
    temperature: 0.3,
    max_tokens: maxTokens,
    chat_template_kwargs: { enable_thinking: false },
  };
  if (useSchema) {
    body.response_format = { type: 'json_schema', json_schema: { name: 'polished_note', strict: true, schema: SCHEMA } };
  }
  const res = await fetch(`${API}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    signal: AbortSignal.timeout(TIMEOUT),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`LLM HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const j = await res.json();
  const choice = j?.choices?.[0];
  return { content: stripThinking(choice?.message?.content || ''), truncated: choice?.finish_reason === 'length' };
}

const SYSTEM = `You are a blog-publishing assistant. You help turn an existing Obsidian note into a clean site post.

Given a note (YAML frontmatter + markdown body), reply with exactly ONE valid JSON object, no markdown fences, no commentary, with these keys:
- "reformatted": string — the body's markdown, normalized and copyedited. Rules:
  * Keep the author's meaning and every fact, date, and link; do not invent or drop content.
  * Remove Obsidian artifacts: [[wikilinks]] become plain text; ![[embeds]] and [[image.jpg|alt]] images are removed.
  * Strip template variables like {{...}} and horizontal rules.
  * Demote headings one level (an H1 becomes H2, etc.); body must not contain an H1 that equals the title.
  * Collapse runs of blank lines to a single blank line; trim leading/trailing whitespace.
  * Fix obvious grammar/spacing, but keep the author's voice and tone.
- "title": string — best title (<= 90 chars).
- "description": string — one-sentence summary (<= 180 chars).
- "tags": array of strings — <= 8 relevant tags, bare words (no #, no spaces).
- "scores": object with keys "clarity" and "quality", each an integer 0-5.
- "notes": string — 1-3 sentences of editorial review notes (strengths, what to fix).

Output only JSON.`;

// --- candidate discovery ------------------------------------------------------
const targets = [];
for (const line of fs.readFileSync(manifest, 'utf8').split(/\r?\n/)) {
  const m = line.match(/^-\s+(\[[ xX]\])\t(.+?)\t(.+?)\t/);
  if (!m) continue;
  const [checked, section, file] = [m[1], m[2].trim(), m[3].trim()];
  if (onlyApproved && checked !== '[x]' && checked !== '[X]') continue;
  let src = path.join(reviewDir, section, file);
  if (!fs.existsSync(src)) {
    const found = fs.readdirSync(reviewDir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && d.name !== 'skipped')
      .map((d) => path.join(reviewDir, d.name, file))
      .find((p) => fs.existsSync(p));
    if (found) src = found;
    else continue;
  }
  targets.push({ section, file, src, approved: /x/i.test(checked) });
}

if (fileSpecs.length) {
  const wanted = new Set(fileSpecs.map((f) => f.replace(/^\.?\/*/, '').replace(/\.md$/i, '')));
  const filtered = targets.filter((t) => {
    const key = `${t.section}/${t.file.replace(/\.md$/i, '')}`;
    return wanted.has(key) || wanted.has(t.file.replace(/\.md$/i, ''));
  });
  if (!filtered.length) {
    console.error(`[polish] no candidates match ${fileSpecs.join(', ')} — files live as <section>/<file>.md under ${reviewName}`);
    process.exit(1);
  }
  targets.length = 0;
  targets.push(...filtered);
}

if (!targets.length) {
  console.log(`[polish] ${reviewName}: no candidates to polish${onlyApproved ? ' (--approved: nothing checked)' : ''}`);
  process.exit(0);
}

// --- helpers ------------------------------------------------------------------
const yaml = (k, v) => `${k}: "${String(v).replace(/"/g, '\\"')}"`;
function toDoc(sections, body) {
  const lines = ['---'];
  for (const k of ['title', 'description', 'date', 'status', 'stage', 'draft', 'type', 'weight', 'vault', 'tags', 'source']) {
    if (sections[k] === undefined || sections[k] === null || sections[k] === '') continue;
    if (k === 'tags') lines.push(`tags: ${JSON.stringify(sections[k])}`);
    else if (k === 'draft' || k === 'vault') lines.push(`${k}: ${String(sections[k])}`);
    else lines.push(yaml(k, sections[k]));
  }
  lines.push('---', '');
  return lines.join('\n') + (body || '') + '\n';
}

function lineDiff(a, b) {
  const la = String(a).split(/\r?\n/);
  const lb = String(b).split(/\r?\n/);
  let added = 0, removed = 0;
  for (const l of lb) if (l.trim() && !la.includes(l.trim())) added++;
  for (const l of la) if (l.trim() && !lb.includes(l.trim())) removed++;
  return { added, removed };
}

function unifiedDiff(section, file, before, after) {
  const tmpA = '/tmp/polish-a-' + Date.now();
  const tmpB = '/tmp/polish-b-' + Date.now();
  fs.writeFileSync(tmpA, before);
  fs.writeFileSync(tmpB, after);
  try {
    return execFileSync('diff', ['-u', `--label`, `a/${section}/${file}`, `--label`, `b/${section}/${file}`, tmpA, tmpB], { encoding: 'utf8' });
  } catch (e) {
    return typeof e.stdout === 'string' ? e.stdout : `(diff unavailable)`;
  } finally {
    fs.unlinkSync(tmpA); fs.unlinkSync(tmpB);
  }
}

function extractJSON(text) {
  const trimmed = (text || '').trim();
  const repaired = trimmed.replace(/\\([^"\\/bfnrtu])/g, '$1');
  for (const t of [trimmed, repaired]) {
    try { return JSON.parse(t); } catch {}
    const m = t.match(/\{[\s\S]*\}/);
    if (m) { try { return JSON.parse(m[0]); } catch {} }
  }
  return null;
}

// --- run ----------------------------------------------------------------------
await fetchModel();
console.log(`[polish] ${reviewName}: ${targets.length} candidate(s) via ${model}`);

const polishDir = path.join(reviewDir, 'polish');
const diffDir = path.join(polishDir, 'diffs');
if (!applyMode) {
  fs.mkdirSync(diffDir, { recursive: true });
}
const report = [`# Polish report — ${reviewName}`, '', `Model: ${model}`, ''];
const failures = [];
let ok = 0;

for (const t of targets) {
  const raw = fs.readFileSync(t.src, 'utf8');
  const { data, body } = parseFrontmatter(raw);
  if (!applyMode && body.length > MAX_INPUT_CHARS && !forceLarge) {
    report.push(`- ${t.section}/${t.file}: **skipped** — ${body.length} chars of body exceeds ${MAX_INPUT_CHARS} (use --force)`);
    console.log(`  ! ${t.section}/${t.file}: too large (${body.length} chars), skipped`);
    continue;
  }
  const est = Math.max(1200, Math.ceil(body.length / 2.5) + 600);
  const maxTokens = Math.min(est, MAX_TOKENS);
  process.stdout.write(`  · ${t.section}/${t.file} ...`);

  let sug;
  try {
    const { content, truncated } = await chat([
      { role: 'system', content: SYSTEM },
      { role: 'user', content: `NOTE:\n${raw}` },
    ], maxTokens);
    sug = extractJSON(content);
    if (!sug) throw new Error('non-JSON reply');
    if (truncated) sug._truncated = true;
  } catch (err) {
    failures.push(`${t.section}/${t.file}: ${err.message}`);
    process.stdout.write(' FAILED\n');
    continue;
  }

  const newTitle = cleanTitle(sug.title, data.title);
  const newDesc = String(sug.description || data.description || '').trim();
  const newTags = Array.isArray(sug.tags) ? sug.tags.map(String).filter(Boolean).slice(0, 8) : data.tags;
  const refined = cleanBody(String(sug.reformatted || body), newTitle);
  const merged = {
    title: newTitle || data.title,
    description: newDesc.slice(0, 180),
    date: data.date,
    status: data.status, stage: data.stage, draft: data.draft, type: data.type, weight: data.weight, vault: data.vault,
    tags: newTags,
    source: data.source,
  };
  const polished = toDoc(merged, refined);
  const { added, removed } = lineDiff(body, refined);

  report.push(`- ${t.section}/${t.file} — ${t.approved ? 'approved' : 'pending'} — +${added}/-${removed} lines` +
    (sug._truncated ? ' **truncated reply**' : ''));
  if (sug.scores) report.push(`  - clarity ${sug.scores.clarity || '?'}/5 · quality ${sug.scores.quality || '?'}/5`);
  if (sug.title && String(sug.title) !== String(data.title)) report.push(`  - title: "${data.title}" → "${newTitle}"`);
  if (sug.description && sug.description !== data.description) report.push(`  - description: "${data.description}" → "${newDesc}"`);
  if (sug.notes) report.push(`  - notes: ${String(sug.notes).trim()}`);

  if (applyMode) {
    fs.writeFileSync(t.src, polished);
    console.log(` APPLIED (${added} +/- ${removed} lines)`);
  } else {
    fs.writeFileSync(path.join(reviewDir, t.section, `${t.file.replace(/\.md$/i, '')}.polished.md`), polished);
    fs.writeFileSync(path.join(diffDir, `${t.section}__${t.file}.diff`), unifiedDiff(t.section, t.file, body, refined));
    console.log(` +${added}/-${removed} lines; review: clarity ${sug.scores?.clarity ?? '?'}/5 quality ${sug.scores?.quality ?? '?'}/5`);
  }
  ok++;
}

fs.writeFileSync(path.join(polishDir, 'POLISH.md'), report.join('\n') + '\n');
console.log(`[polish] ${ok} polished, ${failures.length} failed → ${path.relative(ROOT, polishDir)}`);

if (failures.length) {
  console.warn('[polish] failures:');
  for (const f of failures) console.warn(`  - ${f}`);
}

if (!applyMode) {
  console.log(`[polish] next: review polish/POLISH.md and diffs/, then \`npm run polish -- --apply\` to accept, then \`npm run promote\``);
  if (diffOut) {
    for (const d of fs.readdirSync(diffDir).sort()) {
      console.log(`--- ${d} ---`);
      console.log(fs.readFileSync(path.join(diffDir, d), 'utf8'));
    }
  }
}