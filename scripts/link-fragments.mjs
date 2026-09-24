import fs from 'node:fs';
import path from 'node:path';
import { splitDoc, serialize, writeFileBackedUp } from './lib/staging.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const FRAG = path.join(ROOT, 'src', 'content', 'fragments');
const argv = process.argv.slice(2);
const apply = argv.includes('--apply');

const STOP = new Set(
  `the a an and or of to in on for is it with that this my i was at as be but not you we so do if from by are have
   how what why when a an the new use using make made build building create creating plan plans project projects
   would could should will can may might must there here about into over under more most other some such only own
   same than too very just now one two three get got look looks looking think thinking need needs want wants
   thing things stuff lot really actually basically probably maybe`.split(/\s+/),
);

const MECH_LABEL = {
  volume: 'loudness as the winning move',
  definition: 'who gets to set the terms',
  capture: 'getting absorbed by a system',
  reach: 'distribution and discovery',
  extraction: 'value being taken',
  legibility: 'being understood',
  tooling: 'the instruments',
  craft: 'making it well',
  open: 'shared and public goods',
};

const frags = [];
for (const file of fs.readdirSync(FRAG).filter((f) => f.endsWith('.md') && !f.startsWith('_'))) {
  const abs = path.join(FRAG, file);
  const { data, body } = splitDoc(fs.readFileSync(abs, 'utf8'));
  const prose = body.split(/^## Where this came from/m)[0];
  const toks = new Set(
    (String(data.title).toLowerCase() + ' ' + String(data.description).toLowerCase() + ' ' + prose.toLowerCase())
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3 && !STOP.has(w)),
  );
  frags.push({
    abs,
    slug: file.replace(/\.md$/, ''),
    id: `fragments/${file.replace(/\.md$/, '')}`,
    data,
    body,
    toks,
    mechanism: data.mechanism ?? 'open',
  });
}

function jaccard(a, b) {
  let shared = 0;
  for (const x of a) if (b.has(x)) shared += 1;
  return shared / (a.size + b.size - shared || 1);
}

const edges = new Map();
for (const a of frags) {
  const scored = [];
  for (const b of frags) {
    if (a.slug === b.slug) continue;
    const overlap = jaccard(a.toks, b.toks);
    const sameMech = a.mechanism === b.mechanism ? 0.08 : 0;
    const score = overlap + sameMech;
    if (overlap >= 0.12 || (overlap >= 0.07 && sameMech > 0)) scored.push({ b, score: Number(score.toFixed(3)) });
  }
  scored.sort((x, y) => y.score - x.score);
  edges.set(a.slug, scored.slice(0, 4).map((s) => ({ id: s.b.id, title: s.b.data.title, mechanism: s.b.mechanism, score: s.score })));
}

const incoming = new Map(frags.map((f) => [f.slug, []]));
for (const [slug, list] of edges) for (const e of list) incoming.get(e.id.split('/')[1])?.push(slug);

let changed = 0;
let totalOut = 0;
let totalBack = 0;

for (const f of frags) {
  const out = edges.get(f.slug) ?? [];
  const back = incoming.get(f.slug) ?? [];
  totalOut += out.length;
  totalBack += back.length;

  const lines = ['## Connected fragments', ''];
  if (out.length) {
    lines.push('**Leads to**', '');
    for (const e of out) lines.push(`- [${e.title}](/${e.id}/) — ${MECH_LABEL[e.mechanism] ?? e.mechanism}`);
    lines.push('');
  }
  if (back.length) {
    lines.push('**Reached from**', '');
    const seen = new Set();
    for (const slug of back.slice(0, 6)) {
      if (seen.has(slug)) continue;
      seen.add(slug);
      const src = frags.find((x) => x.slug === slug);
      if (src) lines.push(`- [${src.data.title}](/fragments/${slug}/)`);
    }
    lines.push('');
  }

  const next = `${f.body.trim()}\n\n${lines.join('\n').trim()}`;
  if (next.trim() !== f.body.trim()) {
    if (apply) writeFileBackedUp(ROOT, f.abs, serialize(f.data, next));
    changed += 1;
  }
}

const graph = {
  generatedAt: new Date().toISOString(),
  fragments: frags.length,
  edgesOut: totalOut,
  backlinks: totalBack,
  byMechanism: frags.reduce((acc, f) => {
    acc[f.mechanism] = (acc[f.mechanism] ?? 0) + 1;
    return acc;
  }, {}),
  links: Object.fromEntries(edges),
};
fs.writeFileSync(path.join(ROOT, 'src', 'data', 'fragment-graph.json'), `${JSON.stringify(graph, null, 2)}\n`);
fs.writeFileSync(path.join(ROOT, 'reviews', 'FRAGMENT-GRAPH.json'), `${JSON.stringify(graph, null, 2)}\n`);

console.log(`[link] ${frags.length} fragments | ${totalOut} forward edges | ${totalBack} backlinks | ${changed} ${apply ? 'updated' : 'would update'}`);
console.log('[link] by mechanism:', JSON.stringify(graph.byMechanism));
console.log('[link] wrote src/data/fragment-graph.json');
