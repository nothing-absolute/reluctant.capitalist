import fs from 'node:fs';
import path from 'node:path';
import { backupFile, sanitizeData, serialize, splitDoc, stampNow } from './lib/staging.mjs';
import { redact } from './lib/redact.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const CONTENT = path.join(ROOT, 'src', 'content');
const SECTIONS = ['projects', 'blog', 'papers', 'art', 'comics', 'concepts', 'design', 'goals', 'values', 'garden'];
const API = process.env.POLISH_API ?? 'http://localhost:18000/v1';
const MODEL = process.env.POLISH_MODEL ?? 'qwen3-4b';
const TIMEOUT = Number(process.env.POLISH_TIMEOUT_MS ?? 600000);
const MAX_TOKENS = Number(process.env.POLISH_MAX_TOKENS ?? 8192);
const argv = process.argv.slice(2);
const only = (() => {
  const i = argv.indexOf('--only');
  return i >= 0 ? argv[i + 1] : null;
})();
const apply = argv.includes('--apply');
const dryRun = !apply;

const MAX_INPUT = 12000;

const SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    description: { type: 'string' },
    tags: { type: 'array', items: { type: 'string' } },
    section: { type: 'string', enum: SECTIONS },
    verdict: { type: 'string', enum: ['keep', 'stub', 'junk'] },
    summary: { type: 'string' },
  },
  required: ['title', 'description', 'tags', 'section', 'verdict', 'summary'],
};

const META_PROMPT = `You are the editor for "The Reluctant Capitalist", a personal site of projects, essays, notes and work in progress.

You are given one existing post. Produce publication-quality metadata for it.

- title: a real human title, 3-12 words, sentence case, no trailing ellipsis, no ALL CAPS, no markdown, no quotes. Describe what the post actually IS, not the literal prompt that created it.
- description: one sentence, under 160 characters, plain prose, no markdown.
- tags: 3-6 short lowercase tags, bare words or simple slugs, no "#", no spaces.
- section: the single best collection for this post. Choose exactly one of: ${SECTIONS.join(', ')}.
  Use: projects for things being built, blog for dated journal entries and session writeups, papers for essays and long-form writing, concepts for ideas, garden for durable notes, goals for commitments, art and comics for visual work, values for principles, design for design notes.
- verdict: "keep" if the post has real substance worth publishing, "stub" if it is only a placeholder with no content, "junk" if it is machine noise, a raw tool transcript dump, or not a post at all.
- summary: two or three sentences describing what the post contains, written for a reader deciding whether to open it. No preamble.

Return only JSON.`;

const STRICT_APPEND = `

IMPORTANT — the title must describe the subject of THIS post and nothing else.
Never take a title from an unrelated subject. Do not name a product, project or
person that does not appear in the content below.
If the post is a dated journal or work-session entry with no single subject, name
what the session actually did or recorded.
Never output a bare date, never end the title with an ellipsis, and never leave
brackets or quotes unbalanced.`;

const strict = argv.includes('--strict');
const systemPrompt = strict ? META_PROMPT + STRICT_APPEND : META_PROMPT;

const log = (...a) => console.log('[polish2]', ...a);

async function chat(system, user, maxTokens = MAX_TOKENS) {
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
      temperature: 0.3,
      max_tokens: maxTokens,
      chat_template_kwargs: { enable_thinking: false },
      response_format: { type: 'json_schema', json_schema: { name: 'meta', strict: true, schema: SCHEMA } },
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 160)}`);
  const j = await res.json();
  const c = j?.choices?.[0];
  if (c?.finish_reason === 'length') throw new Error('output truncated');
  const text = c?.message?.content ?? '';
  const repaired = text.trim().replace(/\\([^"\\/bfnrtu])/g, '$1');
  for (const cand of [text.trim(), repaired]) {
    try {
      return JSON.parse(cand);
    } catch {
      const m = cand.match(/\{[\s\S]*\}/);
      if (m) {
        try {
          return JSON.parse(m[0]);
        } catch {}
      }
    }
  }
  throw new Error('unparseable JSON');
}

function bodyPreview(body) {
  let b = body.replace(/<details>[\s\S]*?<\/details>/g, '\n[chat transcript withheld]\n');
  b = b.replace(/!\[[^\]]*\]\([^)]*\)/g, '[image]');
  b = b.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
  b = b.replace(/^#{1,6}\s+/gm, '');
  b = b.replace(/\s+/g, ' ').trim();
  if (b.length > MAX_INPUT) b = `${b.slice(0, MAX_INPUT)}…`;
  return b;
}

const targets = [];
for (const section of SECTIONS) {
  const dir = path.join(CONTENT, section);
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const abs = path.join(dir, file);
    const { data, body } = splitDoc(fs.readFileSync(abs, 'utf8'));
    if (data.draft !== true) continue;
    if (only && `${section}/${file}` !== only) continue;
    targets.push({ section, file, abs, data, body });
  }
}

log(`model ${MODEL} via ${API}`);
log(`${targets.length} draft posts to process${only ? ` (only ${only})` : ''}`);

const results = { generatedAt: new Date().toISOString(), model: MODEL, processed: [], moved: [], failed: [], unchanged: 0 };
let ok = 0;
let failed = 0;
let movedCount = 0;

for (const t of targets) {
  const preview = bodyPreview(t.body);
  const user = [
    `Current collection: ${t.section}`,
    `Current title: ${t.data.title ?? '(none)'}`,
    `Current description: ${t.data.description ?? '(none)'}`,
    `Current tags: ${(t.data.tags ?? []).join(', ') || '(none)'}`,
    '',
    'POST CONTENT:',
    preview || '(empty)',
  ].join('\n');

  process.stdout.write(`  · ${t.section}/${t.file} ... `);
  let meta;
  try {
    meta = await chat(systemPrompt, user, 2048);
  } catch (err) {
    failed++;
    results.failed.push({ post: `${t.section}/${t.file}`, error: err.message });
    log(`FAILED ${t.section}/${t.file}: ${err.message}`);
    continue;
  }

  const title = String(meta.title ?? '').replace(/[*_`#]/g, '').replace(/\s+/g, ' ').trim().slice(0, 110);
  const description = redact(String(meta.description ?? '').replace(/[*_`#]/g, '').replace(/\s+/g, ' ').trim()).text.slice(0, 175);
  const tags = Array.isArray(meta.tags)
    ? [...new Set(meta.tags.map((x) => String(x).toLowerCase().replace(/^#/, '').replace(/\s+/g, '-').replace(/[^a-z0-9/_-]/g, '')).filter(Boolean))].slice(0, 6)
    : [];
  const target = SECTIONS.includes(meta.section) ? meta.section : t.section;
  const verdict = ['keep', 'stub', 'junk'].includes(meta.verdict) ? meta.verdict : 'keep';

  if (verdict !== 'keep') {
    movedCount++;
    results.moved.push({ from: `${t.section}/${t.file}`, verdict, suggestedSection: target, title });
    log(`verdict=${verdict} (left in place, tagged for review)`);
    const next = { ...t.data, title: title || t.data.title, description: description || t.data.description, tags: [...new Set([...(t.data.tags ?? []), verdict])].slice(0, 8) };
    if (apply) {
      backupFile(ROOT, t.abs);
      fs.writeFileSync(t.abs, serialize(sanitizeData(t.section, next), t.body));
    }
    ok++;
    continue;
  }

  let dest = t.abs;
  let moved = false;
  if (target !== t.section) {
    const slug = path.basename(t.file, '.md');
    dest = path.join(CONTENT, target, `${slug}.md`);
    if (!fs.existsSync(dest) || fs.readFileSync(dest, 'utf8') === fs.readFileSync(t.abs, 'utf8')) moved = true;
  }

  const next = { ...t.data, title: title || t.data.title, description: description || t.data.description, tags: tags.length ? tags : t.data.tags };
  const out = serialize(sanitizeData(target, next), t.body);

  if (apply) {
    backupFile(ROOT, t.abs);
    if (moved) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, out);
      fs.unlinkSync(t.abs);
    } else {
      fs.writeFileSync(t.abs, out);
    }
  }
  if (moved) movedCount++;
  ok++;
  results.processed.push({ from: `${t.section}/${t.file}`, to: moved ? `${target}/${path.basename(t.file)}` : null, title, section: target, verdict });
  log(`ok${moved ? ` → moved to ${target}` : ''}: ${title.slice(0, 58)}`);
}

const outPath = path.join(ROOT, 'reviews', `POLISH2-${stampNow()}.json`);
fs.writeFileSync(outPath, `${JSON.stringify(results, null, 2)}\n`);
log(`${ok} ok, ${failed} failed, ${movedCount} flagged/moved`);
log(`wrote ${path.relative(ROOT, outPath)}`);
