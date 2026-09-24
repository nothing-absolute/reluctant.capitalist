import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import {
  StagingError,
  backupFile,
  contentPath,
  sanitizeData,
  serialize,
  setDraft,
  splitDoc,
  stampNow,
  writeFileBackedUp,
} from './staging.mjs';

const ROOT = path.resolve(import.meta.dirname, '..', '..');

export function projectRoot() {
  return ROOT;
}

function reviewName() {
  const dir = path.join(ROOT, 'reviews');
  if (!fs.existsSync(dir)) return null;
  return (
    fs
      .readdirSync(dir)
      .filter((d) => fs.statSync(path.join(dir, d)).isDirectory() && fs.existsSync(path.join(dir, d, 'MANIFEST.md')))
      .sort()
      .reverse()[0] ?? null
  );
}

function stagingStatePath() {
  const name = reviewName();
  if (!name) return null;
  return path.join(ROOT, 'reviews', name, 'polish', 'STAGING.json');
}

function readState() {
  const p = stagingStatePath();
  if (!p || !fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function writeState(state) {
  const p = stagingStatePath();
  if (!p) return null;
  state.generatedAt = new Date().toISOString();
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, `${JSON.stringify(state, null, 2)}\n`);
  return p;
}

function markState(section, file, status) {
  const state = readState();
  if (!state) return;
  const entry = state.staged.find((s) => s.section === section && s.file === file);
  if (entry) entry.status = status;
  writeState(state);
}

export function readEntry(section, slug) {
  const abs = contentPath(ROOT, section, slug);
  if (!fs.existsSync(abs)) throw new StagingError(`no staged file at ${path.relative(ROOT, abs)}`);
  return { abs, raw: fs.readFileSync(abs, 'utf8') };
}

export function saveEntry({ section, slug, markdown }) {
  if (typeof markdown !== 'string' || !markdown.trim()) throw new StagingError('markdown is required');
  const abs = contentPath(ROOT, section, slug);
  const { data } = splitDoc(markdown);
  if (!data.title) throw new StagingError('frontmatter needs a title');
  const clean = sanitizeData(section, data);
  if (clean.draft === undefined) clean.draft = true;
  const output = serialize(clean, splitDoc(markdown).body);
  writeFileBackedUp(ROOT, abs, output);
  markState(section, `${slug}.md`, clean.draft ? 'staged' : 'approved');
  return { path: path.relative(ROOT, abs), draft: Boolean(clean.draft) };
}

export function approveEntry({ section, slug }) {
  const { abs, raw } = readEntry(section, slug);
  const output = setDraft(raw, false);
  writeFileBackedUp(ROOT, abs, output);
  markState(section, `${slug}.md`, 'approved');
  return { path: path.relative(ROOT, abs), draft: false };
}

export function unpublishEntry({ section, slug }) {
  const { abs, raw } = readEntry(section, slug);
  const output = setDraft(raw, true);
  writeFileBackedUp(ROOT, abs, output);
  markState(section, `${slug}.md`, 'staged');
  return { path: path.relative(ROOT, abs), draft: true };
}

export function rejectEntry({ section, slug }) {
  const abs = contentPath(ROOT, section, slug);
  if (!fs.existsSync(abs)) throw new StagingError('nothing to reject');
  const name = reviewName();
  const destDir = name ? path.join(ROOT, 'reviews', name, 'polish', 'rejected') : path.join(ROOT, '.staging-rejected');
  fs.mkdirSync(destDir, { recursive: true });
  const dest = path.join(destDir, `${section}__${slug}.md`);
  backupFile(ROOT, abs);
  fs.copyFileSync(abs, dest);
  fs.unlinkSync(abs);
  markState(section, `${slug}.md`, 'rejected');
  return { moved: path.relative(ROOT, dest) };
}

const jobsDir = () => path.join(ROOT, '.staging-jobs');

export function jobStatus(jobId) {
  if (!/^[a-z0-9-]+$/i.test(String(jobId))) throw new StagingError('bad job id');
  const file = path.join(jobsDir(), `${jobId}.json`);
  if (!fs.existsSync(file)) throw new StagingError('unknown job');
  const status = JSON.parse(fs.readFileSync(file, 'utf8'));
  const logFile = path.join(jobsDir(), `${jobId}.log`);
  if (fs.existsSync(logFile)) {
    const lines = fs.readFileSync(logFile, 'utf8').split(/\r?\n/).filter(Boolean);
    status.log = lines.slice(-25);
  }
  return status;
}

export function startPolishJob({ section, slug, force = false }) {
  const { abs } = readEntry(section, slug);
  const jobId = `polish-${section}-${slug}-${Date.now().toString(36)}`;
  fs.mkdirSync(jobsDir(), { recursive: true });
  const statusFile = path.join(jobsDir(), `${jobId}.json`);
  const logFile = path.join(jobsDir(), `${jobId}.log`);
  fs.writeFileSync(
    statusFile,
    `${JSON.stringify({ jobId, state: 'starting', section, slug, startedAt: new Date().toISOString(), pid: null }, null, 2)}\n`,
  );
  const log = fs.openSync(logFile, 'a');
  const child = spawn(
    process.execPath,
    [path.join(ROOT, 'scripts', 'repolish-one.mjs'), '--section', section, '--slug', slug, '--job', jobId, ...(force ? ['--force'] : [])],
    { cwd: ROOT, detached: true, stdio: ['ignore', log, log], env: { ...process.env } },
  );
  child.unref();
  const status = JSON.parse(fs.readFileSync(statusFile, 'utf8'));
  status.pid = child.pid;
  fs.writeFileSync(statusFile, `${JSON.stringify(status, null, 2)}\n`);
  return { jobId, source: path.relative(ROOT, abs) };
}

export function runpodAudit() {
  const key = process.env.RUNPOD_API_KEY;
  if (!key) return { ok: false, reason: 'RUNPOD_API_KEY is not set for the dev server' };
  return { ok: true, key };
}

export { StagingError, stampNow, splitDoc, serialize, sanitizeData };
