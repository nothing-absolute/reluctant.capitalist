import fs from 'node:fs';
import path from 'node:path';
import { splitDoc } from './lib/staging.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const CONTENT = path.join(ROOT, 'src', 'content');
const SECTIONS = ['projects', 'blog', 'papers', 'art', 'comics', 'concepts', 'design', 'goals', 'values', 'garden', 'fragments'];

const posts = [];
for (const section of SECTIONS) {
  const dir = path.join(CONTENT, section);
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const abs = path.join(dir, file);
    const raw = fs.readFileSync(abs, 'utf8');
    const { data, body } = splitDoc(raw);
    posts.push({
      section,
      file,
      abs,
      title: String(data.title ?? ''),
      description: String(data.description ?? ''),
      tags: Array.isArray(data.tags) ? data.tags : [],
      date: data.date ?? null,
      draft: data.draft === true,
      source: String(data.source ?? ''),
      body,
      bodyLen: body.length,
      rawLen: raw.length,
      hasTranscript: /<details>\s*\n?\s*<summary>Chat transcript/.test(body),
      headings: (body.match(/^#{1,6}\s+/gm) ?? []).length,
      h1: (body.match(/^#\s+/gm) ?? []).length,
      frontmatterKeys: Object.keys(data),
    });
  }
}

const issues = { schema: [], titles: [], descriptions: [], bodies: [], meta: [] };
const STOP = new Set(['the', 'a', 'an', 'and', 'or', 'of', 'to', 'in', 'on', 'for', 'is', 'it', 'with', 'that', 'this', 'my', 'i', 'was', 'at', 'as', 'be', 'but', 'not', 'you', 'we', 'so', 'do', 'if', 'from', 'by', 'are', 'have']);

function tokens(s) {
  return String(s)
    .toLowerCase()
    .replace(/<[^>]+>/g, ' ')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
}

for (const p of posts) {
  const allowed = {
    projects: ['title', 'description', 'date', 'tags', 'source', 'draft', 'clarity', 'quality', 'status', 'stage', 'stack', 'repo', 'url'],
    blog: ['title', 'description', 'date', 'tags', 'source', 'draft', 'clarity', 'quality'],
    papers: ['title', 'description', 'date', 'tags', 'source', 'draft', 'clarity', 'quality', 'type'],
    art: ['title', 'description', 'date', 'tags', 'source', 'draft', 'clarity', 'quality', 'medium'],
    comics: ['title', 'description', 'date', 'tags', 'source', 'draft', 'clarity', 'quality', 'series'],
    concepts: ['title', 'description', 'date', 'tags', 'source', 'draft', 'clarity', 'quality', 'status'],
    design: ['title', 'description', 'date', 'tags', 'source', 'draft', 'clarity', 'quality', 'discipline'],
    goals: ['title', 'description', 'date', 'tags', 'source', 'draft', 'clarity', 'quality', 'status', 'target'],
    values: ['title', 'description', 'date', 'tags', 'source', 'draft', 'clarity', 'quality', 'weight'],
    garden: ['title', 'description', 'date', 'tags', 'source', 'draft', 'clarity', 'quality', 'vault'],
    fragments: ['title', 'description', 'date', 'tags', 'source', 'draft', 'clarity', 'quality', 'mechanism', 'signal', 'from'],
  }[p.section] ?? [];
  const unknown = p.frontmatterKeys.filter((k) => !allowed.includes(k));
  if (unknown.length) issues.schema.push({ ...p, unknown });

  if (!p.title || p.title.length < 3) issues.titles.push({ ...p, why: 'missing/too short' });
  else if (p.title.length > 90) issues.titles.push({ ...p, why: `over 90 chars (${p.title.length})` });
  else if (p.title === p.title.toUpperCase() && p.title.length > 8) issues.titles.push({ ...p, why: 'ALL CAPS' });
  else if (/<[A-Z_]+>/.test(p.title)) issues.titles.push({ ...p, why: 'metadata tag in title' });
  else if (p.title.endsWith('…') || p.title.endsWith('...')) issues.titles.push({ ...p, why: 'truncated title' });
  else if (p.title.startsWith('"') && p.title.endsWith('"')) issues.titles.push({ ...p, why: 'quoted title' });

  if (!p.description) issues.descriptions.push({ ...p, why: 'missing' });
  else if (p.description.length > 180) issues.descriptions.push({ ...p, why: `over 180 (${p.description.length})` });
  else if (/<[A-Z_]+>/.test(p.description)) issues.descriptions.push({ ...p, why: 'metadata tag in description' });

  if (p.h1 > 0) issues.bodies.push({ ...p, why: `${p.h1} H1 in body` });
  if (p.bodyLen > 60000) issues.bodies.push({ ...p, why: `very large body (${p.bodyLen})` });
  if (p.bodyLen < 200) issues.bodies.push({ ...p, why: `near-empty body (${p.bodyLen})` });

  const prose = p.body.replace(/<details>[\s\S]*?<\/details>/g, '').trim();
  if (prose.length < 200 && !p.hasTranscript) issues.bodies.push({ ...p, why: 'almost no prose outside transcript' });
}

const tf = new Map();
const df = new Map();
for (const p of posts) {
  const t = tokens(`${p.title} ${p.title} ${p.description} ${p.body.slice(0, 2000)}`);
  const counts = new Map();
  for (const w of t) counts.set(w, (counts.get(w) ?? 0) + 1);
  tf.set(p.section + p.file, counts);
  for (const w of counts.keys()) df.set(w, (df.get(w) ?? 0) + 1);
}
const N = posts.length;
function cosine(a, b) {
  const A = tf.get(a.section + a.file);
  const B = tf.get(b.section + b.file);
  if (!A || !B) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (const [w, v] of A) {
    const idf = Math.log((N + 1) / ((df.get(w) ?? 0) + 1)) + 1;
    const x = (1 + Math.log(v)) * idf;
    na += x * x;
    const yv = B.get(w);
    if (yv) {
      const y = (1 + Math.log(yv)) * idf;
      dot += x * y;
    }
  }
  for (const [w, v] of B) {
    const idf = Math.log((N + 1) / ((df.get(w) ?? 0) + 1)) + 1;
    const y = (1 + Math.log(v)) * idf;
    nb += y * y;
  }
  return na && nb ? dot / Math.sqrt(na * nb) : 0;
}

const dupes = [];
for (let i = 0; i < posts.length; i++) {
  for (let j = i + 1; j < posts.length; j++) {
    const score = cosine(posts[i], posts[j]);
    if (score >= 0.30) dupes.push({ a: `${posts[i].section}/${posts[i].file}`, b: `${posts[j].section}/${posts[j].file}`, score: Number(score.toFixed(3)) });
  }
}
dupes.sort((x, y) => y.score - x.score);

const bySource = {};
for (const p of posts) {
  const k = p.source.startsWith('antigravity://') ? 'antigravity' : p.source || 'none';
  bySource[k] = (bySource[k] ?? 0) + 1;
}

const out = {
  generatedAt: new Date().toISOString(),
  totals: {
    posts: posts.length,
    drafts: posts.filter((p) => p.draft).length,
    withTranscript: posts.filter((p) => p.hasTranscript).length,
    bodyBytes: posts.reduce((n, p) => n + p.bodyLen, 0),
  },
  bySection: Object.fromEntries(SECTIONS.map((s) => [s, posts.filter((p) => p.section === s).length]).filter(([, v]) => v)),
  bySource,
  issues: {
    schema: issues.schema.map((i) => ({ post: `${i.section}/${i.file}`, unknown: i.unknown })),
    titles: issues.titles.map((i) => ({ post: `${i.section}/${i.file}`, why: i.why, title: i.title.slice(0, 70) })),
    descriptions: issues.descriptions.map((i) => ({ post: `${i.section}/${i.file}`, why: i.why })),
    bodies: issues.bodies.map((i) => ({ post: `${i.section}/${i.file}`, why: i.why })),
  },
  duplicates: dupes,
};

const dir = path.join(ROOT, 'reviews');
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'AUDIT.json'), `${JSON.stringify(out, null, 2)}\n`);

console.log(`[audit] ${out.totals.posts} posts (${out.totals.drafts} drafts), ${out.totals.withTranscript} with transcripts`);
console.log(`[audit] by section: ${Object.entries(out.bySection).map(([k, v]) => `${k} ${v}`).join(', ')}`);
console.log(`[audit] by source:  ${Object.entries(out.bySource).map(([k, v]) => `${k} ${v}`).join(', ')}`);
console.log(`[audit] issues: schema ${out.issues.schema.length}, titles ${out.issues.titles.length}, descriptions ${out.issues.descriptions.length}, bodies ${out.issues.bodies.length}`);
console.log(`[audit] near-duplicate pairs (cosine >= 0.30): ${dupes.length}`);
for (const d of dupes.slice(0, 12)) console.log(`         ${d.score}  ${d.a}  ~  ${d.b}`);
console.log('[audit] wrote reviews/AUDIT.json');
