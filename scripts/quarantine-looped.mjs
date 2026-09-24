import fs from 'node:fs';
import path from 'node:path';
import { SECTION_KEYS } from './lib/staging.mjs';
import { proseOnly, repetition, duplicateParagraphs, degenerate } from './lib/quality.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const CONTENT = path.join(ROOT, 'src', 'content');
const QUARANTINE = path.join(ROOT, 'reviews', 'QUARANTINE', 'looped');
const argv = process.argv.slice(2);
const apply = argv.includes('--apply');

const quality = JSON.parse(fs.readFileSync(path.join(ROOT, 'reviews', 'QUALITY.json'), 'utf8'));
const report = quality.reports;
const looped = report.filter((r) => r.narrativeLoop);
const thin = report.filter((r) => !r.narrativeLoop && /^thin:/.test((r.issues ?? [])[0] ?? ''));

const moved = [];
const drafted = [];

for (const r of looped) {
  const [section, slug] = r.id.split('/');
  const abs = path.join(CONTENT, section, `${slug}.md`);
  if (!fs.existsSync(abs)) continue;
  if (apply) {
    const dest = path.join(QUARANTINE, section, `${slug}.md`);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    if (!fs.existsSync(dest)) fs.copyFileSync(abs, dest);
    fs.unlinkSync(abs);
  }
  moved.push({ id: r.id, title: r.title, worst: r.worst, source: r.source, restoredFrom: path.relative(ROOT, path.join(QUARANTINE, section, `${slug}.md`)) });
}

for (const r of thin) {
  const [section, slug] = r.id.split('/');
  const abs = path.join(CONTENT, section, `${slug}.md`);
  if (!fs.existsSync(abs)) continue;
  const raw = fs.readFileSync(abs, 'utf8');
  if (/^draft:\s*true\s*$/m.test(raw)) continue;
  if (apply) {
    const updated = /^draft:/m.test(raw) ? raw.replace(/^draft:\s*(?:true|false)\s*$/m, 'draft: true') : raw.replace(/^---\s*$/m, '---\ndraft: true');
    fs.writeFileSync(abs, updated);
  }
  drafted.push(r.id);
}

const manifest = {
  generatedAt: new Date().toISOString(),
  policy:
    'Posts whose narrative prose is machine repetition loops are moved out of the published collections. ' +
    'The underlying ideas are not lost: they are carried by the 12 synthesis posts and by the raw ' +
    'Antigravity archive. Restore any file from restoredFrom to bring a post back.',
  loopedMoved: moved.length,
  thinDrafted: drafted.length,
  looped: moved,
  thin: drafted,
};
fs.writeFileSync(path.join(ROOT, 'reviews', 'QUARANTINE-LOOPED.json'), `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`[quarantine-looped] ${moved.length} looped posts ${apply ? 'moved' : 'would move'} -> reviews/QUARANTINE/looped/`);
console.log(`[quarantine-looped] ${drafted.length} thin posts ${apply ? 'set to draft' : 'would draft'}`);
console.log('[quarantine-looped] wrote reviews/QUARANTINE-LOOPED.json');
