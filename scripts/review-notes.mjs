// classify default: read the newest vault snapshot + ingest candidates,
// normalize each into the established site format (title/description/date/tags/clean body),
// route to the right section, and write a review tree + MANIFEST.md. Nothing is published.
//
// Reviews/<ts>/:
//   <section>/<slug>.md     candidate notes (schema-correct frontmatter)
//   skipped/<slug>.md       quarantined (template junk / empty / excluded) + reason in frontmatter
//   MANIFEST.md             checkbox list the owner edits; promoted by promote.mjs
import fs from 'node:fs';
import path from 'node:path';
import {
  parseFrontmatter, cleanTitle, cleanDescription, cleanBody,
  isTemplateJunk, fmtDate, slugify,
} from './lib/normalize.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'garden.config.json'), 'utf8'));

// --- newest snapshot -------------------------------------------------------
function newestSnapshot() {
  const dir = path.join(ROOT, cfg.snapshotsDir || 'snapshots');
  if (!fs.existsSync(dir)) return null;
  const snaps = fs.readdirSync(dir).filter((d) => fs.statSync(path.join(dir, d)).isDirectory()).sort().reverse();
  return snaps.length ? path.join(dir, snaps[0]) : null;
}

// --- exclusions ------------------------------------------------------------
const EXCLUDE_FILE = path.join(ROOT, cfg.excludeFile || '.garden-exclude.json');
let excludeList = [];
try { excludeList = JSON.parse(fs.readFileSync(EXCLUDE_FILE, 'utf8')).exclude || []; } catch {}

function isExcluded(rel) {
  const segs = rel.split('/');
  return excludeList.some((e) => {
    const es = String(e).split('/');
    return es.length <= segs.length && es.every((p, i) => p === segs[i]);
  });
}

// --- routing ---------------------------------------------------------------
const SECTION_BY_FOLDER = {
  'Projects': 'projects', 'projects': 'projects',
  'Daily': 'blog', 'Goals': 'goals',
};
function classifyPath(rel, frontmatter, cleanedBody) {
  const segs = rel.split('/');
  const folder = segs[0];
  if (SECTION_BY_FOLDER[folder]) return SECTION_BY_FOLDER[folder];
  if (folder === 'Knowledge') {
    const sub = segs[1] || '';
    if (/concept|idea/i.test(sub)) return 'concepts';
    return 'garden';
  }
  const t = (frontmatter.tags || []).join(' ');
  if (/\btype\/(concept|idea)\b/.test(t)) return 'concepts';
  if (/\btype\/(essay|paper|letter)\b/.test(t)) return 'papers';
  if (cleanedBody.length < 40 && rel.endsWith('Dashboard.md')) return 'garden';
  return 'garden';
}

// --- per-section frontmatter ------------------------------------------------
function renderNote(section, n) {
  const head = { title: n.title, description: n.description, date: n.date, tags: n.tags, source: n.source };
  switch (section) {
    case 'projects': return { ...head, status: n.status || inferStatus(n), stage: n.stage || inferStage(n) };
    case 'blog': return { ...head, draft: true };
    case 'concepts': return { ...head, status: inferConceptStatus(n) };
    case 'papers': return { ...head, type: 'notes' };
    case 'goals': return { ...head, status: 'active' };
    case 'garden': return { ...head, vault: n.vault };
    default: return head;
  }
}

function inferStatus(n) {
  const s = `${n.source} ${n.tags.join(' ')}`;
  if (/kickstarter|seed/i.test(s)) return 'concept';
  if (/prototyp|mock/i.test(s)) return 'prototype';
  return 'seed';
}
function inferStage(n) {
  const s = `${n.source} ${n.tags.join(' ')}`;
  if (/mvp|product/i.test(s)) return 'mvp';
  if (/mock|prototype/i.test(s)) return 'mock';
  if (/research/i.test(s)) return 'research';
  return 'idea';
}
function inferConceptStatus(n) {
  const s = `${n.source} ${n.tags.join(' ')}`;
  return /relayed/i.test(s) ? 'relayed' : /shelv/i.test(s) ? 'shelved' : 'developing';
}

const yaml = (k, v) => `${k}: "${String(v).replace(/"/g, '\\"')}"`;
function toFrontmatter(section, n) {
  const obj = renderNote(section, n);
  const lines = ['---'];
  for (const k of ['title', 'description', 'date', 'status', 'stage', 'draft', 'type', 'weight', 'vault', 'tags', 'source']) {
    if (obj[k] === undefined || obj[k] === null || obj[k] === '') continue;
    if (k === 'tags') {
      lines.push(`tags: ${JSON.stringify(obj[k])}`);
    } else if (k === 'draft' || k === 'vault') {
      lines.push(`${k}: ${String(obj[k])}`);
    } else {
      lines.push(yaml(k, obj[k]));
    }
  }
  lines.push('---', '');
  return lines.join('\n') + (n._body ?? '') + '\n';
}

// --- main --------------------------------------------------------------------
const snapDir = newestSnapshot();
const snapNotes = {};
function walk(dir, base) {
  for (const f of fs.readdirSync(dir)) {
    if (f.startsWith('.')) continue;
    const full = path.join(dir, f);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full, path.join(base, f));
    else if (f.endsWith('.md')) {
      const rel = path.join(base, f);
      const content = fs.readFileSync(full, 'utf8');
      const { data } = parseFrontmatter(content);
      snapNotes[rel] = { source: rel, content, data, mtime: st.mtime };
    }
  }
}
if (snapDir) {
  walk(snapDir, '');
} else {
  console.error('[classify] no snapshots found — run `npm run snapshot` first');
  process.exit(1);
}

// ingest candidates (opencode + antigravity)
const ingest = [];
for (const p of ['reviews/src/opencode.json', 'reviews/src/antigravity.json']) {
  const fp = path.join(ROOT, p);
  if (fs.existsSync(fp)) {
    const j = JSON.parse(fs.readFileSync(fp, 'utf8'));
    for (const c of j.candidates || []) ingest.push({ ...c, vault: false });
  }
}

const ts = process.argv[2] || new Date().toISOString().slice(0, 10).replace(/-/g, '');
let stamp = process.argv[3] || '';
if (!stamp) {
  const d = new Date();
  stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}${String(d.getSeconds()).padStart(2, '0')}`;
}
const outRoot = path.join(ROOT, 'reviews', `${ts}-${stamp}`);
const runner = [];
const skipped = [];
const used = new Map();

function stash(section, n, extra = {}) {
  const dir = path.join(outRoot, section);
  fs.mkdirSync(dir, { recursive: true });
  const base = slugify(n.title);
  let i = (used.get(section) || 0) + 1;
  let slug = base;
  while (fs.existsSync(path.join(dir, `${slug}.md`))) slug = `${base}-${++i}`;
  used.set(section, i);
  const file = `${slug}.md`;
  fs.writeFileSync(path.join(dir, file), toFrontmatter(section, { ...n, ...extra }));
  runner.push({ section, file, title: n.title, source: n.source, hint: extra.hint || n.hint || '' });
}

// vault notes
for (const [rel, note] of Object.entries(snapNotes)) {
  if (isExcluded(rel)) {
    skipped.push({ rel, reason: 'excluded-by-config' });
    continue;
  }
  const bodyMd = note.content;
  const { data } = parseFrontmatter(bodyMd);
  const cleaned = cleanBody(bodyMd, cleanTitle(data.title, rel));
  const junk = isTemplateJunk(cleaned);
  const title = cleanTitle(data.title, rel);
  const description = cleanDescription(data.description, cleaned);
  const date = fmtDate(data.date) || (rel.startsWith('Daily/') && rel.match(/(\d{4}-\d{2}-\d{2})/)?.[1]) || fmtDate(note.mtime) || null;
  const tags = Array.isArray(data.tags)
    ? data.tags.map((t) => String(t).replace(/\{\{[^}]*\}\}/g, '').trim()).filter(Boolean).slice(0, 8)
    : [];
  const section = classifyPath(rel, data, cleaned);
  const n = { title, description, date, tags, source: rel, vault: true, _body: cleaned, hint: `vault · ${rel}` };
  if (junk) {
    skipped.push({ rel, reason: junk });
    continue;
  }
  stash(section, n);
}

// ingested candidates
for (const n of ingest) {
  const section = (n.sectionHint && fs.existsSync(path.join(ROOT, 'src/content', n.sectionHint === 'journal' ? 'blog' : n.sectionHint))) ? (n.sectionHint === 'journal' ? 'blog' : n.sectionHint) : 'garden';
  const body = cleanBody(n.body, n.title);
  stash(section, { ...n, _body: body, description: n.description || '', hint: n.kind === 'opencode' ? 'opencode session' : 'antigravity' });
}

// skipped files
for (const s of skipped) {
  const dir = path.join(outRoot, 'skipped');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${slugify(s.rel, 80)}.md`), `---\ntitle: "Skipped: ${escapeQuotes(s.rel)}"\ndescription: "${s.reason}"\n---\n`);
}

// MANIFEST
const groups = {};
for (const r of runner) (groups[r.section] ||= []).push(r);

let manifest = `# Review ${ts}-${stamp}\n\nCheck \`[x]\` to publish; change the section token (e.g. \`projects\`) to retarget; leave \`[ ]\` to skip.\nColumns: status \\t section \\t file \\t title \\t source\n\n`;
for (const [section, list] of Object.entries(groups)) {
  manifest += `## ${section}\n`;
  for (const r of list.sort((a, b) => (a.title > b.title ? 1 : -1))) {
    manifest += `- [ ]\t${section}\t${r.file}\t${r.title.replace(/\t/g, ' ')}\t${r.hint}\n`;
  }
  manifest += '\n';
}
fs.writeFileSync(path.join(outRoot, 'MANIFEST.md'), manifest);

console.log(`[classify] wrote ${runner.length} candidates + ${skipped.length} skipped to ${outRoot}`);
for (const [section, list] of Object.entries(groups)) {
  console.log(`  ${section.padEnd(10)} ${list.length}`);
}

function escapeQuotes(s) { return String(s).replace(/"/g, '\\"'); }