import fs from 'node:fs';
import path from 'node:path';
import { splitDoc } from './lib/staging.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const CONTENT = path.join(ROOT, 'src', 'content');
const SECTIONS = ['projects', 'blog', 'papers', 'art', 'comics', 'concepts', 'design', 'goals', 'values', 'garden'];
const argv = process.argv.slice(2);
const apply = argv.includes('--apply');
const QUAR = path.join(ROOT, 'reviews', 'QUARANTINE');

const RULES = [
  { name: 'session-stub', re: /(what this is|this is):?\s*an?\s*opencode working session/i, minLen: 1200 },
  { name: 'scratch-workspace-stub', re: /an antigravity scratch project\s*[—-]/i, minLen: 0 },
  { name: 'shell-transcript', re: /(root@[\w.-]+:|^#\s+\d+\s|\^C)/m, minLen: 0, minHits: 3 },
  { name: 'error-log', re: /(throw err;|Error: Cannot find module|at Object\.<anonymous>)/, minLen: 0 },
  { name: 'stub-template', re: /(daily note with focus, tasks, and activity log|←\s*\|\s*→)/i, minLen: 0 },
];

function classify(body) {
  const reasons = [];
  for (const r of RULES) {
    const hits = (body.match(new RegExp(r.re.source, r.re.flags.includes('g') ? r.re.flags : `${r.re.flags}g`)) ?? []).length;
    const need = r.minHits ?? 1;
    if (hits >= need && body.length >= r.minLen) reasons.push(r.name);
  }
  if (body.trim().length < 200 && !reasons.length) reasons.push('near-empty');
  return reasons;
}

const llmVerdicts = new Map();
for (const f of fs.readdirSync(path.join(ROOT, 'reviews')).filter((x) => x.startsWith('POLISH2-') && x.endsWith('.json'))) {
  try {
    const d = JSON.parse(fs.readFileSync(path.join(ROOT, 'reviews', f), 'utf8'));
    for (const m of d.moved ?? []) if (m.verdict !== 'keep') llmVerdicts.set(m.from, m.verdict);
  } catch {}
}

const rows = [];
for (const section of SECTIONS) {
  const dir = path.join(CONTENT, section);
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const abs = path.join(dir, file);
    const { data, body } = splitDoc(fs.readFileSync(abs, 'utf8'));
    if (data.draft !== true) continue;
    const rel = `${section}/${file}`;
    const reasons = classify(body);
    const llm = llmVerdicts.get(rel);
    if (llm && !reasons.includes('llm-' + llm)) reasons.push(`llm-${llm}`);
    if (reasons.length) rows.push({ rel, abs, reasons, title: data.title ?? '', bodyLen: body.length });
  }
}

const counts = {};
for (const r of rows) for (const x of r.reasons) counts[x] = (counts[x] ?? 0) + 1;

console.log(`[quarantine] ${rows.length} draft posts qualify (of ${Object.values(counts).reduce((a, b) => a + b, 0)} reasons)`);
for (const [k, v] of Object.entries(counts).sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(4)}  ${k}`);
if (apply) {
  fs.mkdirSync(QUAR, { recursive: true });
  for (const r of rows) {
    fs.copyFileSync(r.abs, path.join(QUAR, r.rel.replace(/\//g, '__')));
    fs.unlinkSync(r.abs);
  }
  console.log(`[quarantine] moved ${rows.length} to reviews/QUARANTINE/ (copied, then removed from src/content — nothing deleted)`);
}
const out = path.join(ROOT, 'reviews', 'QUARANTINE.json');
if (apply) fs.writeFileSync(out, `${JSON.stringify({ generatedAt: new Date().toISOString(), applied: true, counts, rows }, null, 2)}\n`);
console.log(`[quarantine] sample:`);
for (const r of rows.slice(0, 6)) console.log(`  ${r.reasons.join('+').padEnd(22)} ${r.rel.split('/').pop()}`);
