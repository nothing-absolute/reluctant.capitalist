import fs from 'node:fs';
import path from 'node:path';
import { splitDoc, serialize, writeFileBackedUp, SECTION_KEYS } from './lib/staging.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const CONTENT = path.join(ROOT, 'src', 'content');
const argv = process.argv.slice(2);
const apply = argv.includes('--apply');

const published = new Set();
const files = [];
for (const section of SECTION_KEYS) {
  const dir = path.join(CONTENT, section);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.md'))) {
    const abs = path.join(dir, f);
    files.push({ abs, section, id: `${section}/${f.replace(/\.md$/, '')}` });
    const raw = fs.readFileSync(abs, 'utf8');
    if (!/^draft:\s*true\s*$/m.test(raw)) published.add(`${section}/${f.replace(/\.md$/, '')}`);
  }
}

const RESERVED = new Set(['/staging', '/review', '/constellation', '/chat', '/rss.xml', '/']);
const LINK_RE = /\]\(\/([a-z]+)\/([^/)#?]+)\/?(?:#[^)]*)?\)/g;

const repairs = [];
for (const { abs, id } of files) {
  const raw = fs.readFileSync(abs, 'utf8');
  const { data, body } = splitDoc(raw);
  const dead = new Set();
  for (const m of body.matchAll(LINK_RE)) {
    if (RESERVED.has(`/${m[1]}/${m[2]}`)) continue;
    if (!published.has(`${m[1]}/${m[2]}`)) dead.add(`${m[1]}/${m[2]}`);
  }
  if (!dead.size) continue;

  let next = body;
  for (const target of dead) {
    next = next.replaceAll(new RegExp(`\\]\\(\\/${target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\/?\\)`, 'g'), ']');
  }
  if (apply && next !== body) writeFileBackedUp(ROOT, abs, serialize(data, next));
  repairs.push({ post: id, removed: [...dead] });
}

fs.writeFileSync(
  path.join(ROOT, 'reviews', 'DEADLINKS.json'),
  `${JSON.stringify({ generatedAt: new Date().toISOString(), published: published.size, postsWithDeadLinks: repairs.length, totalDeadLinks: repairs.reduce((a, r) => a + r.removed.length, 0), repairs }, null, 2)}\n`,
);
console.log(`[deadlinks] ${published.size} published | ${repairs.length} posts with dead links | ${repairs.reduce((a, r) => a + r.removed.length, 0)} links ${apply ? 'unlinked' : 'would unlink'}`);
console.log('[deadlinks] wrote reviews/DEADLINKS.json');
