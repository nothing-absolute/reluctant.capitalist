import fs from 'node:fs';
import path from 'node:path';
import { splitDoc, serialize, writeFileBackedUp } from './lib/staging.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const CONTENT = path.join(ROOT, 'src', 'content');
const QUARANTINE = path.join(ROOT, 'reviews', 'QUARANTINE', 'looped');
const argv = process.argv.slice(2);
const apply = argv.includes('--apply');

if (!fs.existsSync(QUARANTINE)) {
  console.log('[restore] nothing quarantined');
  process.exit(0);
}

const restored = [];
const skipped = [];

for (const section of fs.readdirSync(QUARANTINE)) {
  const dir = path.join(QUARANTINE, section);
  if (!fs.statSync(dir).isDirectory()) continue;
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const from = path.join(dir, file);
    const to = path.join(CONTENT, section, file);
    if (fs.existsSync(to)) {
      skipped.push(`${section}/${file}`);
      continue;
    }
    const { data, body } = splitDoc(fs.readFileSync(from, 'utf8'));
    const next = {
      ...data,
      draft: true,
      tags: [...new Set([...(data.tags ?? []), 'raw-source', 'undistilled'])].slice(0, 8),
    };
    const note =
      '\n\n---\n\n> **Undistilled source.** This post is raw working material restored from quarantine: the\n' +
      '> narrative prose here is a machine transcript with repetition loops, kept for the record rather\n' +
      '> than for reading. The ideas inside it are being extracted into the\n' +
      '> [fragments](/fragments/) section, and the coherent version lives in the synthesis posts.\n' +
      '> Nothing is lost here — it is just not published.\n';
    if (apply) writeFileBackedUp(ROOT, to, serialize(next, `${body.trim()}${note}`));
    restored.push({ id: `${section}/${file.replace(/\.md$/, '')}`, title: data.title, from: path.relative(ROOT, from) });
  }
}

const manifest = {
  generatedAt: new Date().toISOString(),
  policy:
    'Looped posts are restored into their sections as drafts so no source material is hidden. They stay ' +
    'out of the published site because their narrative prose is machine repetition. Their ideas are ' +
    'carried by the fragments and the synthesis posts.',
  restored: restored.length,
  skippedExisting: skipped.length,
  entries: restored,
};
fs.writeFileSync(path.join(ROOT, 'reviews', 'RESTORED.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`[restore] ${restored.length} posts ${apply ? 'restored as drafts' : 'would restore'} | ${skipped.length} already present`);
console.log('[restore] wrote reviews/RESTORED.json');
