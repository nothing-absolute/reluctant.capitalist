import fs from 'node:fs';
import path from 'node:path';
import {
  ALLOWED_FIELDS,
  SECTION_KEYS,
  backupFile,
  sanitizeData,
  serialize,
  splitDoc,
  stampNow,
} from './lib/staging.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const MAX_INPUT_CHARS = 20000;

const argv = process.argv.slice(2);
const dryRun = argv.includes('--dry-run');
const force = argv.includes('--force');
const reviewArg = argv.find((a) => !a.startsWith('--'));

function newestReview() {
  const dir = path.join(ROOT, 'reviews');
  if (!fs.existsSync(dir)) return null;
  return fs
    .readdirSync(dir)
    .filter((d) => fs.statSync(path.join(dir, d)).isDirectory() && fs.existsSync(path.join(dir, d, 'MANIFEST.md')))
    .sort()
    .reverse()[0] ?? null;
}

const reviewName = reviewArg ?? newestReview();
if (!reviewName) {
  console.error('[stage] no review directory found');
  process.exit(1);
}
const reviewDir = path.join(ROOT, 'reviews', reviewName);
const polishDir = path.join(reviewDir, 'polish');

function readScores() {
  const scores = new Map();
  const report = path.join(polishDir, 'POLISH.md');
  if (!fs.existsSync(report)) return scores;
  const lines = fs.readFileSync(report, 'utf8').split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const head = lines[i].match(/^-\s+(.+?)\s+—\s+(?:approved|pending)\s+—\s+\+\d+\/-\d+ lines\s*$/);
    if (!head) continue;
    const key = head[1].trim();
    const detail = lines[i + 1]?.match(/clarity\s+(\d)\/5\s+·\s+quality\s+(\d)\/5/);
    if (detail) scores.set(key, { clarity: Number(detail[1]), quality: Number(detail[2]) });
  }
  return scores;
}

const scores = readScores();
const manifest = fs
  .readFileSync(path.join(reviewDir, 'MANIFEST.md'), 'utf8')
  .split(/\r?\n/)
  .map((line) => line.match(/^-\s+\[[ xX]\]\t(.+?)\t(.+?)\t/))
  .filter(Boolean)
  .map((m) => ({ section: m[1].trim(), file: m[2].trim() }));

const staged = [];
const leftovers = [];
const conflicts = [];
let imported = 0;

for (const entry of manifest) {
  const { section, file } = entry;
  const candidate = path.join(reviewDir, section, file);
  const polished = path.join(reviewDir, section, file.replace(/\.md$/i, '.polished.md'));
  const hasCandidate = fs.existsSync(candidate);
  const hasPolished = fs.existsSync(polished);

  if (!SECTION_KEYS.includes(section)) {
    leftovers.push({ section, file, reason: hasPolished ? 'unclassified-section' : 'unclassified' });
    continue;
  }
  if (!hasPolished) {
    const reason = !hasCandidate ? 'missing' : bodyLength(candidate) > MAX_INPUT_CHARS ? 'too-large-for-polish' : 'polish-failed';
    leftovers.push({ section, file, reason });
    continue;
  }

  const raw = fs.readFileSync(polished, 'utf8');
  const { data, body } = splitDoc(raw);
  const clean = sanitizeData(section, data);
  clean.draft = true;
  const score = scores.get(`${section}/${file}`);
  if (score) {
    clean.clarity = score.clarity;
    clean.quality = score.quality;
  }
  const output = serialize(clean, body);
  const dest = path.join(ROOT, 'src', 'content', section, file);

  if (fs.existsSync(dest)) {
    const existing = splitDoc(fs.readFileSync(dest, 'utf8'));
    if (existing.data.draft === false && !force) {
      staged.push({
        section,
        file,
        status: 'approved',
        draft: false,
        clarity: clean.clarity ?? null,
        quality: clean.quality ?? null,
        dest: path.relative(ROOT, dest),
      });
      continue;
    }
    if (!force && existing.data.body !== undefined) {
      const current = serialize(existing.data, existing.body);
      if (current !== output) {
        conflicts.push(`${section}/${file}`);
        staged.push({ section, file, status: 'conflict', dest: path.relative(ROOT, dest) });
        continue;
      }
    }
  }

  if (!dryRun) {
    backupFile(ROOT, dest);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, output);
  }
  imported++;
  staged.push({
    section,
    file,
    status: 'staged',
    draft: true,
    clarity: clean.clarity ?? null,
    quality: clean.quality ?? null,
    dest: path.relative(ROOT, dest),
  });
}

function bodyLength(file) {
  const { body } = splitDoc(fs.readFileSync(file, 'utf8'));
  return body.length;
}

const skippedDir = path.join(reviewDir, 'skipped');
if (fs.existsSync(skippedDir)) {
  for (const f of fs.readdirSync(skippedDir).filter((f) => f.endsWith('.md'))) {
    leftovers.push({ section: 'skipped', file: f, reason: 'unclassified' });
  }
}

const rejectedDir = path.join(polishDir, 'rejected');
if (fs.existsSync(rejectedDir)) {
  for (const f of fs.readdirSync(rejectedDir).filter((f) => f.endsWith('.md'))) {
    const m = f.match(/^(.+?)__(.+)\.md$/);
    if (m) staged.push({ section: m[1], file: m[2], status: 'rejected' });
  }
}

const state = {
  review: reviewName,
  generatedAt: new Date().toISOString(),
  dryRun,
  counts: {
    manifest: manifest.length,
    staged: staged.filter((s) => s.status === 'staged').length,
    conflicts: conflicts.length,
    leftovers: leftovers.length,
  },
  staged,
  leftovers,
  allowedFields: ALLOWED_FIELDS,
};

if (!dryRun) {
  fs.mkdirSync(polishDir, { recursive: true });
  fs.writeFileSync(path.join(polishDir, 'STAGING.json'), `${JSON.stringify(state, null, 2)}\n`);
}

console.log(`[stage] review ${reviewName}${dryRun ? ' (dry-run)' : ''}`);
console.log(`[stage] ${imported} staged as draft, ${conflicts.length} conflicts, ${leftovers.length} leftovers`);
if (conflicts.length) {
  console.warn('[stage] destination differs, skipped (use --force):');
  for (const c of conflicts) console.warn(`  - ${c}`);
}
if (leftovers.length) {
  console.log('[stage] leftovers (stay in /review):');
  for (const l of leftovers) console.log(`  - ${l.section}/${l.file} — ${l.reason}`);
}
if (!dryRun) {
  console.log(`[stage] wrote ${path.relative(ROOT, path.join(polishDir, 'STAGING.json'))}`);
  console.log('[stage] next: npm run dev → http://localhost:4321/staging');
}
void stampNow;
