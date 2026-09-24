import fs from 'node:fs';
import path from 'node:path';
import { splitDoc, serialize, writeFileBackedUp } from './lib/staging.mjs';
import { dedupeSource, factDigest, proseOnly, repetition, duplicateParagraphs } from './lib/quality.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const CONTENT = path.join(ROOT, 'src', 'content');
const argv = process.argv.slice(2);
const apply = argv.includes('--apply');

const themes = JSON.parse(fs.readFileSync(path.join(ROOT, 'reviews', 'THEMES.json'), 'utf8'));
const live = new Set();
for (const section of fs.readdirSync(CONTENT)) {
  const dir = path.join(CONTENT, section);
  if (!fs.statSync(dir).isDirectory()) continue;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.md'))) {
    const raw = fs.readFileSync(path.join(dir, f), 'utf8');
    if (/^draft:\s*true\s*$/m.test(raw)) continue;
    live.add(`${section}/${f.replace(/\.md$/, '')}`);
  }
}

function memberIndex(theme) {
  const members = theme.members.filter((m) => live.has(m.id));
  const bySection = new Map();
  for (const m of members) {
    if (!bySection.has(m.section)) bySection.set(m.section, []);
    bySection.get(m.section).push(m);
  }
  const order = ['projects', 'concepts', 'papers', 'blog', 'art', 'comics', 'design', 'goals', 'values', 'garden'];
  const sections = [...bySection.keys()].sort((a, b) => order.indexOf(a) - order.indexOf(b));
  const lines = ['## The work so far', ''];
  for (const section of sections) {
    const list = bySection.get(section).sort((a, b) => a.title.localeCompare(b.title));
    if (sections.length > 1) lines.push(`### ${section} (${list.length})`, '');
    for (const m of list) lines.push(`- [${m.title.replace(/[[\]]/g, '')}](/${m.id}/)`);
    lines.push('');
  }
  return { text: lines.join('\n').trim(), count: members.length };
}

let fixed = 0;
let removed = 0;
const dead = [];
const report = [];

for (const theme of themes.themes) {
  const target = themes.themes.find((t) => t.name === theme.name);
  const synthesis = fs
    .readdirSync(CONTENT)
    .flatMap((section) => {
      const dir = path.join(CONTENT, section);
      if (!fs.statSync(dir).isDirectory()) return [];
      return fs
        .readdirSync(dir)
        .filter((f) => f.endsWith('.md'))
        .map((f) => path.join(dir, f));
    })
    .filter((abs) => {
      if (!fs.existsSync(abs)) return false;
      const raw = fs.readFileSync(abs, 'utf8');
      return raw.includes(`source: "synthesis://${theme.name}"`) || raw.includes(`source: synthesis://${theme.name}`);
    });

  for (const abs of synthesis) {
    const raw = fs.readFileSync(abs, 'utf8');
    const { data, body } = splitDoc(raw);
    const existing = [...body.matchAll(/\]\(\/([a-z]+)\/([^/)]+)\/?\)/g)].map((m) => `${m[1]}/${m[2]}`);
    const broken = existing.filter((id) => !live.has(id));
    const rebuilt = memberIndex(theme);
    const prose = body.split(/^## The work so far\s*$/m)[0].trim();
    const next = `${prose}\n\n${rebuilt.text}`;
    if (broken.length) {
      removed += broken.length;
      dead.push(...broken.map((id) => ({ post: path.relative(CONTENT, abs), deadLink: id })));
    }
    if (broken.length || next !== body.trim()) {
      if (apply) writeFileBackedUp(ROOT, abs, serialize(data, next));
      fixed += 1;
      report.push({ post: path.relative(CONTENT, abs), theme: theme.name, deadRemoved: broken.length, liveLinks: rebuilt.count });
    }
  }
}

fs.writeFileSync(
  path.join(ROOT, 'reviews', 'LINKFIX.json'),
  `${JSON.stringify({ generatedAt: new Date().toISOString(), livePosts: live.size, postsFixed: fixed, deadLinksRemoved: removed, dead, report }, null, 2)}\n`,
);
console.log(`[linkfix] ${live.size} live posts | ${fixed} synthesis posts ${apply ? 'updated' : 'would update'} | ${removed} dead links removed`);
console.log('[linkfix] wrote reviews/LINKFIX.json');
