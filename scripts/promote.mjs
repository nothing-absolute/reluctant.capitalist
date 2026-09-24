// promote: copy approved candidates from a review dir into src/content/<section>/.
// Reads MANIFEST.md — lines `- [x]\t<section>\t<file>\t<title>\t<hint>` are approved.
// Never overwrites existing content files unless --force. --dry-run prints only.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const argc = process.argv.slice(2);
const dryRun = argc.includes('--dry-run');
const force = argc.includes('--force');
const given = argc.filter((a) => !a.startsWith('-'));

function newestReview() {
  const dir = path.join(ROOT, 'reviews');
  if (!fs.existsSync(dir)) return null;
  return fs.readdirSync(dir)
    .filter((d) => fs.statSync(path.join(dir, d)).isDirectory() && fs.existsSync(path.join(dir, d, 'MANIFEST.md')))
    .sort().reverse()[0] || null;
}

const reviewName = given[0] || newestReview();
if (!reviewName) {
  console.error('[promote] no review dir found — run classify first');
  process.exit(1);
}
const reviewsRoot = path.join(ROOT, 'reviews');
const reviewDir = path.join(reviewsRoot, reviewName);
const reviewDirRooted = path.isAbsolute(reviewName) || reviewName.startsWith('reviews' + path.sep)
  ? reviewName
  : path.join(reviewsRoot, reviewName);
const manifest = path.join(reviewDirRooted, 'MANIFEST.md');
if (!fs.existsSync(manifest)) {
  console.error(`[promote] ${reviewDirRooted} has no MANIFEST.md`);
  process.exit(1);
}

const targets = [];
for (const line of fs.readFileSync(manifest, 'utf8').split(/\r?\n/)) {
  const m = line.match(/^-\s+\[x\]\t(.+?)\t(.+?)\t/);
  if (m) {
    const [section, file] = [m[1].trim(), m[2].trim()];
    if (!/^[a-z0-9-]+$/.test(section)) {
      console.warn(`[promote] skipping bad section "${section}" for ${file}`);
      continue;
    }
    let src = path.join(reviewDirRooted, section, file);
    if (!fs.existsSync(src)) {
      // retargeted: file was stashed under its original classified section — find it
      const found = fs.readdirSync(reviewDirRooted, { withFileTypes: true })
        .filter((d) => d.isDirectory() && d.name !== 'skipped')
        .map((d) => path.join(reviewDirRooted, d.name, file))
        .find((p) => fs.existsSync(p));
      if (found) {
        console.log(`[promote] retargeted ${section}/${file} <- ${path.relative(reviewDirRooted, found)}`);
        src = found;
      } else {
        console.warn(`[promote] missing candidate ${src}`);
        continue;
      }
    }
    targets.push({ section, file, src });
  }
}

if (!targets.length) {
  console.log(`[promote] ${reviewName}: nothing approved in MANIFEST (no \`[x]\` lines)`);
  process.exit(0);
}

const moved = [];
const conflicts = [];
for (const t of targets) {
  const destDir = path.join(ROOT, 'src/content', t.section);
  const dest = path.join(destDir, t.file);
  if (fs.existsSync(dest) && !force) {
    conflicts.push(`${t.section}/${t.file}`); // retarget/rename before promote
    continue;
  }
  moved.push(dest);
  if (!dryRun) {
    fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(t.src, dest);
    console.log(`  -> src/content/${t.section}/${t.file}`);
  } else {
    console.log(`  (dry) src/content/${t.section}/${t.file}`);
  }
}

console.log(`[promote] ${reviewName}: ${moved.length} published${dryRun ? ' (dry-run)' : ''}`);
if (conflicts.length) {
  console.warn(`[promote] targets already exist (use --force or rename): ${conflicts.join(', ')}`);
}
if (!dryRun) {
  console.log('[promote] draft/journal entries are still not live — set `draft: false` to publish');
}