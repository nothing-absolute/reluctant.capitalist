#!/usr/bin/env node
/**
 * snapshot-notes.mjs — pull a copy of the vault into snapshots/<timestamp>/.
 *
 * The vault stays private forever; the snapshot is the ONLY thing the garden
 * ever reads. Copying happens once, up front, so what gets published is
 * reviewable on disk before it is ever turned into a web page.
 *
 * Only markdown notes are copied (no attachments/blobs). Dot-directories,
 * Templates, Attachments, etc. are skipped via excludePaths in garden.config.json.
 *
 * Run with:  npm run snapshot
 */
import { readFileSync, readdirSync, writeFileSync, statSync, mkdirSync, existsSync, copyFileSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { homedir } from 'node:os';

const cwd = resolve('.');
const cfgPath = process.argv[2] ? resolve(cwd, process.argv[2]) : resolve(cwd, 'garden.config.json');
if (!existsSync(cfgPath)) {
  console.error('[snapshot] garden.config.json not found. Run from the project root.');
  process.exit(1);
}
const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'));

const vaultRoot = cfg.source.replace(/^~/, homedir());
const snapshotsRoot = resolve(cwd, cfg.snapshotsDir ?? 'snapshots');
const excluded = cfg.excludePaths ?? [];
const includedByFolder = cfg.includeFolders ?? null; // null = snapshot everything allowed
const extensions = (cfg.extensions ?? ['.md']).map((e) => e.toLowerCase());

if (!existsSync(vaultRoot)) {
  console.error(`[snapshot] Vault source not found: ${vaultRoot}`);
  process.exit(1);
}

const isHidden = (p) => p.split(sep).some((part) => part.startsWith('.'));
function excludedRel(rel) {
  return rel.split(sep).some((part) => excluded.includes(part));
}

function walk(dir, depth = 0) {
  if (depth > 8) return [];
  let out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (isHidden(p)) continue;
    const rel = relative(vaultRoot, p);
    if (excludedRel(rel)) continue;
    const st = statSync(p);
    if (st.isDirectory()) out = out.concat(walk(p, depth + 1));
    else if (extensions.includes(name.toLowerCase().split('.').pop() ? `.${name.toLowerCase().split('.').pop()}` : '') && !name.startsWith('.')) out.push(p);
  }
  return out;
}

const stamp = new Date();
const pad = (n) => String(n).padStart(2, '0');
const ts =
  `${stamp.getFullYear()}-${pad(stamp.getMonth() + 1)}-${pad(stamp.getDate())}-` +
  `${pad(stamp.getHours())}${pad(stamp.getMinutes())}${pad(stamp.getSeconds())}`;
const snapDir = join(snapshotsRoot, ts);

if (existsSync(snapDir)) {
  console.error(`[snapshot] Snapshot already exists: ${snapDir}`);
  console.error('[snapshot] Refusing to overwrite. Delete it if you really mean to.');
  process.exit(1);
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
  console.error(`[snapshot] No notes found under ${vaultRoot}. Fix garden.config.json and retry.`);
  process.exit(1);
}

mkdirSync(snapDir, { recursive: true });
const copied = [];
for (const f of files) {
  const rel = relative(vaultRoot, f);
  const dest = join(snapDir, rel);
  mkdirSync(join(dest, '..'), { recursive: true });
  copyFileSync(f, dest);
  copied.push(rel.replace(/\\/g, '/'));
}

writeFileSync(
  join(snapDir, 'manifest.json'),
  JSON.stringify({ timestamp: ts, source: vaultRoot, notes: copied.length, files: copied }, null, 2),
);

console.log(`[snapshot] snapshotted ${copied.length} notes → ${snapDir}`);
for (const l of copied.slice(0, 15)) console.log(`  ${l}`);
if (copied.length > 15) console.log(`  … and ${copied.length - 15} more`);
console.log('[snapshot] Next: `npm run ingest` then `npm run classify`, edit reviews/*/MANIFEST.md, then `npm run promote`.');