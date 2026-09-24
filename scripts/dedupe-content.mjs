import fs from 'node:fs';
import path from 'node:path';
import { splitDoc } from './lib/staging.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const CONTENT = path.join(ROOT, 'src', 'content');
const API = process.env.POLISH_API ?? 'http://localhost:18000/v1';
const MODEL = process.env.POLISH_MODEL ?? 'qwen3-4b';
const THRESHOLD = Number(process.env.DUPE_THRESHOLD ?? 0.45);
const argv = process.argv.slice(2);
const apply = argv.includes('--apply');
const dryRun = !apply;

const SCHEMA = {
  type: 'object',
  properties: {
    same_topic: { type: 'boolean' },
    relationship: { type: 'string', enum: ['duplicate', 'same-topic-different-angle', 'unrelated'] },
    keep: { type: 'string' },
    unique_content_in_other: { type: 'boolean' },
    note: { type: 'string' },
  },
  required: ['same_topic', 'relationship', 'keep', 'unique_content_in_other', 'note'],
};

const SYSTEM = `You review two posts from a personal site and decide whether they are redundant.

- "duplicate": one fully supersedes the other; keeping both adds nothing.
- "same-topic-different-angle": same subject, genuinely different content; both should stay.
- "unrelated": the pairing is coincidental.

"keep" must be exactly "a" or "b" — the post that should survive if one had to go.
"unique_content_in_other" is true only if the post you did NOT pick contains material worth merging into the survivor.
"note" is one short sentence for the author.`;

function preview(rel) {
  const abs = path.join(CONTENT, rel);
  if (!fs.existsSync(abs)) return null;
  const { data, body } = splitDoc(fs.readFileSync(abs, 'utf8'));
  let b = body.replace(/<details>[\s\S]*?<\/details>/g, '\n[transcript]\n').replace(/!\[[^\]]*\]\([^)]*\)/g, '[image]');
  b = b.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/^#{1,6}\s+/gm, '').replace(/\s+/g, ' ').trim();
  return { title: data.title ?? '', desc: data.description ?? '', body: b.slice(0, 1800), draft: data.draft === true };
}

async function ask(a, b) {
  const user = [
    `POST A: ${a.rel}`,
    `Title: ${a.p.title}`,
    `Description: ${a.p.desc}`,
    `Body: ${a.p.body}`,
    '',
    `POST B: ${b.rel}`,
    `Title: ${b.p.title}`,
    `Description: ${b.p.desc}`,
    `Body: ${b.p.body}`,
    '',
    'Decide the relationship. Return only JSON.',
  ].join('\n');
  const res = await fetch(`${API}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(300000),
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: user },
      ],
      temperature: 0.2,
      max_tokens: 1024,
      chat_template_kwargs: { enable_thinking: false },
      response_format: { type: 'json_schema', json_schema: { name: 'dupe', strict: true, schema: SCHEMA } },
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const j = await res.json();
  const text = (j?.choices?.[0]?.message?.content ?? '').trim();
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

const audit = JSON.parse(fs.readFileSync(path.join(ROOT, 'reviews', 'AUDIT.json'), 'utf8'));
const candidates = audit.duplicates.filter((d) => d.score >= THRESHOLD);
console.log(`[dupe] ${candidates.length} candidate pairs at cosine >= ${THRESHOLD}`);

const out = { generatedAt: new Date().toISOString(), threshold: THRESHOLD, applied: apply, decisions: [] };
let dupes = 0;
let related = 0;
let unrelated = 0;
const doomed = new Set();

for (const c of candidates) {
  const pa = preview(c.a);
  const pb = preview(c.b);
  if (!pa || !pb) continue;
  process.stdout.write(`  · ${c.score} ${c.a} ~ ${c.b} ... `);
  let verdict;
  try {
    verdict = await ask({ rel: c.a, p: pa }, { rel: c.b, p: pb });
  } catch (err) {
    console.log(`FAILED (${err.message})`);
    continue;
  }
  const keepRel = verdict.keep === 'b' ? c.b : c.a;
  const dropRel = verdict.keep === 'b' ? c.a : c.b;
  if (verdict.relationship === 'duplicate') {
    dupes++;
    if (!verdict.unique_content_in_other) doomed.add(dropRel);
  } else if (verdict.relationship === 'same-topic-different-angle') related++;
  else unrelated++;
  out.decisions.push({ a: c.a, b: c.b, score: c.score, ...verdict, keep: keepRel, drop: verdict.relationship === 'duplicate' && !verdict.unique_content_in_other ? dropRel : null });
  console.log(`${verdict.relationship}${verdict.relationship === 'duplicate' ? ` → keep ${keepRel}` : ''}`);
}

if (apply && doomed.size) {
  const dir = path.join(ROOT, 'reviews', 'DUPLICATES');
  fs.mkdirSync(dir, { recursive: true });
  for (const rel of doomed) {
    const abs = path.join(CONTENT, rel);
    if (!fs.existsSync(abs)) continue;
    fs.copyFileSync(abs, path.join(dir, rel.replace(/\//g, '__')));
    fs.unlinkSync(abs);
  }
  console.log(`[dupe] moved ${doomed.size} redundant posts to reviews/DUPLICATES/ (preserved, not deleted)`);
}

const outPath = path.join(ROOT, 'reviews', 'DUPE-VERDICTS.json');
fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
console.log(`[dupe] ${dupes} duplicates, ${related} same-topic, ${unrelated} unrelated`);
console.log(`[dupe] wrote ${path.relative(ROOT, outPath)}`);
