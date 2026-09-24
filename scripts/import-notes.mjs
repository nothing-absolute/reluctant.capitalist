import fs from 'node:fs';
import path from 'node:path';
import { cleanDescription, slugify } from './lib/normalize.mjs';
import { backupFile, sanitizeData, serialize, splitDoc, stampNow } from './lib/staging.mjs';
import { redact } from './lib/redact.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const argv = process.argv.slice(2);
const dryRun = argv.includes('--dry-run');
const force = argv.includes('--force');
const sourceTag = (() => {
  const i = argv.indexOf('--source');
  return i >= 0 ? argv[i + 1] : 'notes';
})();
const defaultSection = (() => {
  const i = argv.indexOf('--section');
  return i >= 0 ? argv[i + 1] : 'papers';
})();

const inputs = argv.filter((a, i) => !a.startsWith('--') && !argv[i - 1]?.startsWith('--'));
if (!inputs.length) {
  console.error('[notes] usage: node scripts/import-notes.mjs <file.md[::section[::title]]> [...] [--section papers] [--source label] [--dry-run] [--force]');
  process.exit(1);
}

const reviewName = `${stampNow()}-notes`;
const reviewDir = path.join(ROOT, 'reviews', reviewName);
const manifest = [];
const summary = { review: reviewName, source: sourceTag, generatedAt: new Date().toISOString(), notes: [], redactions: {} };
let redactions = {};

function deriveTitle(raw, file, override) {
  if (override) return override;
  const { data } = splitDoc(raw);
  if (data.title) return String(data.title);
  const heading = raw.match(/^#\s+(.+)$/m);
  if (heading) {
    const candidate = heading[1].replace(/[*_`#]/g, '').trim();
    const looksLikeSiteName = candidate === candidate.toUpperCase() && candidate.length < 30;
    if (!looksLikeSiteName) return candidate;
    const bold = raw.match(/^\*\*(.+?)\*\*/m);
    if (bold) return bold[1].replace(/[*_`]/g, '').trim();
  }
  return path.basename(file, path.extname(file)).replace(/[-_]+/g, ' ');
}

for (const input of inputs) {
  const [file, sectionArg, titleArg] = input.split('::');
  const abs = path.resolve(file);
  if (!fs.existsSync(abs)) {
    console.error(`[notes] missing: ${file}`);
    continue;
  }
  const section = sectionArg || defaultSection;
  const raw = fs.readFileSync(abs, 'utf8');
  const { body } = splitDoc(raw);
  const cleaned = redact(body);
  for (const [k, v] of Object.entries(cleaned.counts)) redactions[k] = (redactions[k] ?? 0) + v;

  const title = deriveTitle(raw, abs, titleArg);
  const slug = slugify(title, 60) || slugify(path.basename(file), 40);
  const description = redact(cleanDescription(splitDoc(raw).body, cleaned.text)).text;

  const data = sanitizeData(section, {
    title,
    description,
    date: new Date().toISOString().slice(0, 10),
    tags: [sourceTag, section === 'papers' ? 'essay' : 'project'],
    source: `${sourceTag}://${path.basename(file)}`,
    draft: true,
  });
  if (section === 'papers') data.type = 'essay';
  if (section === 'projects') {
    data.status = 'concept';
    data.stage = 'idea';
  }

  const output = serialize(data, cleaned.text);
  const dest = path.join(ROOT, 'src', 'content', section, `${slug}.md`);
  let status = 'staged';
  if (fs.existsSync(dest) && !force) {
    status = fs.readFileSync(dest, 'utf8') === output ? 'unchanged' : 'conflict';
  }
  if (status === 'conflict') {
    console.warn(`[notes] conflict (use --force): ${section}/${slug}.md`);
  } else if (status === 'staged' && !dryRun) {
    backupFile(ROOT, dest);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, output);
  }
  manifest.push(`- [ ]\t${section}\t${slug}.md\t${title}\t${path.basename(file)}`);
  summary.notes.push({ section, slug, title, source: path.basename(file), status });
  console.log(`[notes] ${status.padEnd(9)} ${section}/${slug}.md — ${title.slice(0, 60)}`);
}

summary.redactions = redactions;
if (!dryRun) {
  fs.mkdirSync(reviewDir, { recursive: true });
  fs.writeFileSync(path.join(reviewDir, 'MANIFEST.md'), `# Imported notes — ${reviewName}\n\nSource tag: \`${sourceTag}\`\n\n${manifest.join('\n')}\n`);
  fs.writeFileSync(path.join(reviewDir, 'IMPORT.json'), `${JSON.stringify(summary, null, 2)}\n`);
}
const staged = summary.notes.filter((n) => n.status === 'staged').length;
console.log(`[notes] ${staged} staged, ${summary.notes.length - staged} skipped/conflict`);
console.log(`[notes] redactions: ${Object.entries(redactions).map(([k, v]) => `${k}×${v}`).join(', ') || 'none'}`);
console.log('[notes] review at http://localhost:4321/staging — everything is a draft');
