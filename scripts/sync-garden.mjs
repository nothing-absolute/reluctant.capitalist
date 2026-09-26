#!/usr/bin/env node
/**
 * sync-garden.mjs — copy a CURATED subset of your Obsidian vault into the
 * site's Digital Garden.
 *
 * The vault stays private; only notes that pass the rules in garden.config.json
 * are copied, stripped of private frontmatter, and rewritten as content
 * collection entries. Run with:  npm run sync:garden
 */
import { readFileSync, readdirSync, writeFileSync, statSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { homedir } from 'node:os';

const cwd = resolve('.');
const cfgPath = process.argv[2] ? resolve(cwd, process.argv[2]) : resolve(cwd, 'garden.config.json');
if (!existsSync(cfgPath)) {
  console.error('[garden] garden.config.json not found. Run from the project root.');
  process.exit(1);
}
const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'));

let vaultRoot = cfg.source?.replace(/^~/, homedir());
const outDir = resolve(cwd, cfg.output);
const isHidden = (p) => p.split(sep).some((part) => part.startsWith('.'));
const excluded = cfg.excludePaths ?? [];
const stripped = new Set(cfg.stripFrontmatterKeys ?? []);
const includedByFolder = cfg.includeFolders ?? null; // null = everything (still filtered below)
const excludeFile = cfg.excludeFile ? resolve(cwd, cfg.excludeFile) : null;
const excludes = excludeFile && existsSync(excludeFile)
  ? (JSON.parse(readFileSync(excludeFile, 'utf8')).exclude ?? [])
  : [];
function isExcluded(rel) {
  const segs = rel.split(sep);
  return excludes.some((e) => {
    const es = String(e).replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
    if (!es.length || es.length > segs.length) return false;
    return es.every((part, i) => segs[i] === part);
  });
}

function frontmatterToObject(raw) {
  const obj = {};
  let listKey = null;
  for (const line of raw.split('\n')) {
    const item = line.match(/^[ \t]*-\s+(.*)$/);
    if (item && listKey) {
      let v = item[1].trim();
      const q = v.match(/^["'](.*)["']$/);
      if (q) v = q[1];
      if (!Array.isArray(obj[listKey])) obj[listKey] = [];
      obj[listKey].push(v);
      continue;
    }
    listKey = null;
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!m) continue;
    let val = m[2].trim();
    if (val === '') {
      listKey = m[1];
      obj[m[1]] = [];
    } else if (val.startsWith('[')) {
      try { val = JSON.parse(val); } catch { /* keep string */ }
      obj[m[1]] = val;
    } else if (val === 'true' || val === 'false' || !isNaN(Number(val))) {
      val = isNaN(Number(val)) ? val === 'true' : Number(val);
      obj[m[1]] = val;
    } else if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      if (val.length > 1) val = val.slice(1, -1);
      obj[m[1]] = val;
    } else {
      obj[m[1]] = val;
    }
  }
  return obj;
}

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80) || 'note';
}

const usedSlugs = new Set();
function uniqueSlug(base) {
  let candidate = base;
  let i = 2;
  while (usedSlugs.has(candidate)) candidate = `${base}-${i++}`;
  usedSlugs.add(candidate);
  return candidate;
}

// Obsidian embeds (![[...]]) reference assets or notes that are not synced.
// Drop asset embeds entirely; leave note references as plain wikilink text.
const ASSET_EXT = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'mp4', 'mov', 'pdf', 'mp3', 'wav'];
function scrubEmbeds(body) {
  return body.replace(/!\[\[([^\]]+)\]\]/g, (m, target) => {
    const ext = target.toLowerCase().split('?')[0].split('.').pop();
    return ASSET_EXT.includes(ext) ? '' : `[[${target}]]`;
  });
}

function convert(note) {
  const fmMatch = note.match(/^---\n([\s\S]*?)\n---\n?/);
  const fm = fmMatch ? frontmatterToObject(fmMatch[1]) : {};
  const body = fmMatch ? note.slice(fmMatch[0].length) : note;
  for (const k of stripped) delete fm[k];
  const title =
    fm.title ??
    body.match(/^#\s+(.+)$/m)?.[1] ??
    null;
  return { fm, body, title };
}

function walk(dir, depth = 0) {
  if (depth > 6) return [];
  let out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (isHidden(p)) continue;
    if (excluded.some((e) => p.split(sep).includes(e.replace(/^\/+|\/+$/g, '')))) continue;
    const st = statSync(p);
    if (st.isDirectory()) out = out.concat(walk(p, depth + 1));
    else if (name.toLowerCase().endsWith('.md') && !name.startsWith('.')) out.push(p);
  }
  return out;
}

// ---- main ----
// source can point at a vault OR (new model) be empty and resolve to the newest snapshot dir
if (!vaultRoot || !existsSync(vaultRoot)) {
  const snapBase = resolve(cwd, cfg.snapshotsDir ?? 'snapshots');
  if (existsSync(snapBase)) {
    const snaps = readdirSync(snapBase)
      .filter((n) => statSync(join(snapBase, n)).isDirectory())
      .sort()
      .reverse();
    if (snaps.length) {
      vaultRoot = join(snapBase, snaps[0]);
      console.log(`[garden] source not set; using newest snapshot: ${vaultRoot}`);
    }
  }
}

if (!existsSync(vaultRoot)) {
  console.error(`[garden] Vault/snapshot source not found: ${vaultRoot}`);
  console.error(`[garden] Edit garden.config.json (or run the build anyway — seed notes are in src/content/garden).`);
  process.exit(0);
}

let files = walk(vaultRoot);

if (includedByFolder?.length) {
  const rootPrefix = vaultRoot + sep;
  files = files.filter((f) => {
    const rel = relative(vaultRoot, f).split(sep);
    return includedByFolder.includes(rel[0]);
  });
}

if (files.length === 0) {
  console.error(`[garden] No notes matched the source/filters under ${vaultRoot}.`);
  console.error('[garden] Refusing to wipe the existing garden. Fix garden.config.json and retry.');
  process.exit(1);
}

// remove any existing generated notes so deletions propagate
if (existsSync(outDir)) rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

let kept = 0;
const log = [];

for (const f of files) {
  if (kept >= cfg.maxNotes) break;
  const relPath = relative(vaultRoot, f);
  if (isExcluded(relPath)) continue;
  const absSize = statSync(f).size;
  if (absSize > (cfg.maxBytesPerNote ?? 12000)) continue;
  const raw = readFileSync(f, 'utf8');
  if (!raw.trim()) continue;

  const { fm, body, title } = convert(raw);
  const fmTags = Array.isArray(fm.tags) ? fm.tags : [];
  const tags = [...fmTags];
  if (cfg.includeTags?.length && !tags.some((t) => cfg.includeTags.includes(t))) continue;
  if (!cfg.includeTags?.length && !tags.length) tags.push('vault'); // keep everything discoverable

  const name = relPath.split(sep).pop().replace(/\.md$/i, '');
  const sourceDate = fm.date ?? new Date(statSync(f).mtime).toISOString().slice(0, 10);

  const out = [
    '---',
    `title: "${(title ?? name).replace(/"/g, '\\"')}"`,
    `description: "${(fm.description ?? scrubEmbeds(body.split('\n').find((l) => l.trim() && !l.startsWith('#')) ?? '').trim().slice(0, 140) ?? '').replace(/"/g, '\\"')}"`,
    `date: ${sourceDate}`,
    `tags: [${tags.map((t) => `"${String(t).replace(/"/g, '')}"`).join(', ')}]`,
    `source: "${relPath.replace(/\\/g, '/')}"`,
    `vault: true`,
    '---',
    '',
    scrubEmbeds(body.trim()),
    '',
  ].join('\n');

  const slug = uniqueSlug(slugify(fm.category ?? relPath.replace(/\.[^/.]+$/, '').split(sep).join('-')));
  writeFileSync(join(outDir, `${slug}.md`), out);
  log.push(`${slug}.md  ←  ${relPath}`);
  kept++;
}

if (kept === 0) {
  console.error('[garden] No notes survived the filters. Refusing to replace the existing garden with an empty one.');
  process.exit(1);
}

if (
  cfg.welcomeNote &&
  !existsSync(join(outDir, '_welcome.md')) &&
  !existsSync(join(outDir, 'welcome.md'))
) {
  writeFileSync(
    join(outDir, '_welcome.md'),
    [
      '---',
      'title: "Welcome to the Garden"',
      'description: "What lives here, and what never will."',
      'date: 2026-01-01',
      'tags: ["meta", "garden"]',
      'vault: false',
      '---',
      '',
      'This is the **limited edition** of my second brain. The vault contains decades of noise;',
      'this garden contains only the notes I am willing to stand behind in public.',
      '',
      'Rules of the garden:',
      '',
      '1. **Nothing private.** Sync is allowlist-based (`garden.config.json`), never "everything."',
      '2. **Notes are plants.** They get pruned, merged, and occasionally die. Treat them as provisional.',
      '3. **Links in, links out.** Garden notes may link to each other by `[[filename]]`; unknown links stay as text.',
      '',
      'To publish more, add folders or tags in `garden.config.json` and run `npm run sync:garden`.',
      '',
    ].join('\n'),
  );
  log.push('_welcome.md  ←  (generated)');
}

console.log(`[garden] synced ${log.length} notes from ${vaultRoot}`);
for (const l of log.slice(0, 30)) console.log(`  ${l}`);
if (log.length > 30) console.log(`  … and ${log.length - 30} more`);
