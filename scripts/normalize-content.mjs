import fs from 'node:fs';
import path from 'node:path';
import { backupFile, sanitizeData, serialize, splitDoc } from './lib/staging.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const CONTENT = path.join(ROOT, 'src', 'content');
const SECTIONS = ['projects', 'blog', 'papers', 'art', 'comics', 'concepts', 'design', 'goals', 'values', 'garden'];
const argv = process.argv.slice(2);
const dryRun = argv.includes('--dry-run');
const apply = argv.includes('--apply');

const MAX_TAGS = 8;
const TAG_ALIASES = new Map([
  ['type/project', 'project'], ['topic/ai', 'ai'], ['topic/open-source', 'open-source'],
  ['project/hydration-station', 'hydration-station'], ['topic/solar', 'solar'],
]);

function demoteH1(body) {
  const lines = body.split('\n');
  let inFence = false;
  let changed = 0;
  const out = lines.map((line) => {
    const fence = /^\s*(```|~~~)/.test(line);
    if (fence) inFence = !inFence;
    if (inFence) return line;
    const m = line.match(/^(#{1})\s+(.*)$/);
    if (!m) return line;
    changed++;
    return `## ${m[2]}`;
  });
  return { body: out.join('\n'), changed };
}

function normalizeTags(tags) {
  const seen = new Set();
  const out = [];
  for (const raw of Array.isArray(tags) ? tags : []) {
    let t = String(raw).trim().toLowerCase().replace(/^#/, '').replace(/\s+/g, '-');
    if (!t) continue;
    t = TAG_ALIASES.get(t) ?? t;
    t = t.replace(/[^a-z0-9/_-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    if (!t || t.length > 40 || seen.has(t)) continue;
    seen.add(t);
    out.push(t);
    if (out.length >= MAX_TAGS) break;
  }
  return out;
}

const report = { generatedAt: new Date().toISOString(), applied: apply, h1Demoted: [], tagsNormalized: [], stubsTagged: [], sectionsTouched: {} };

for (const section of SECTIONS) {
  const dir = path.join(CONTENT, section);
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const abs = path.join(dir, file);
    const raw = fs.readFileSync(abs, 'utf8');
    const { data, body } = splitDoc(raw);
    if (data.draft !== true) continue;

    const before = JSON.stringify({ ...data, body });
    const { body: newBody, changed } = demoteH1(body);
    const newTags = normalizeTags(data.tags);
    const prose = newBody.replace(/<details>[\s\S]*?<\/details>/g, '').trim();
    const isStub = prose.length < 200;

    const next = { ...data, tags: newTags };
    if (isStub && !newTags.includes('needs-content')) next.tags = [...newTags, 'needs-content'].slice(0, MAX_TAGS);

    const out = serialize(sanitizeData(section, next), newBody);
    if (out === raw) continue;
    if (apply) {
      backupFile(ROOT, abs);
      fs.writeFileSync(abs, out);
    }
    const rel = `${section}/${file}`;
    if (changed) report.h1Demoted.push({ post: rel, count: changed });
    if (JSON.stringify(newTags) !== JSON.stringify(Array.isArray(data.tags) ? data.tags : [])) report.tagsNormalized.push({ post: rel, from: data.tags, to: next.tags });
    if (isStub) report.stubsTagged.push(rel);
    report.sectionsTouched[section] = (report.sectionsTouched[section] ?? 0) + 1;
  }
}

const outPath = path.join(ROOT, 'reviews', 'CONSISTENCY.json');
if (!dryRun) fs.writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`);

console.log(`[consistency] ${apply ? 'APPLIED' : 'dry run'} — drafts only, published posts untouched`);
console.log(`[consistency] H1 headings demoted in ${report.h1Demoted.length} posts (${report.h1Demoted.reduce((n, h) => n + h.count, 0)} headings)`);
console.log(`[consistency] tag lists normalized in ${report.tagsNormalized.length} posts`);
console.log(`[consistency] stub posts tagged needs-content: ${report.stubsTagged.length}`);
console.log(`[consistency] posts rewritten: ${Object.values(report.sectionsTouched).reduce((a, b) => a + b, 0)}`);
if (!dryRun) console.log('[consistency] wrote reviews/CONSISTENCY.json');
