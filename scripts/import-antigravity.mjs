import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { cleanDescription, cleanTitle, slugify } from './lib/normalize.mjs';
import { backupFile, sanitizeData, serialize, splitDoc, stampNow } from './lib/staging.mjs';
import { redact, redactCounts } from './lib/redact.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');

const argv = process.argv.slice(2);
const dryRun = argv.includes('--dry-run');
const force = argv.includes('--force');
const includeData = argv.includes('--include-data');
const fromArg = (() => {
  const i = argv.indexOf('--from');
  return i >= 0 ? argv[i + 1] : undefined;
})();
const maxAssetMb = Number((() => {
  const i = argv.indexOf('--max-asset-mb');
  return i >= 0 ? argv[i + 1] : 25;
})());

const SENSITIVE_ARTIFACT = /(outreach|contact[_-]?and[_-]?dm|erica|instagram[_-]?dm|\bnick\b)/i;

const MEDIA = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.mp4', '.mov', '.webm']);
const DOCS = new Set(['.md', '.markdown']);
const OTHER_LINKABLE = new Set(['.pdf', '.html', '.htm', '.txt', '.csv', '.py', '.sh', '.js']);
const DATA = new Set(['.json', '.jsonl', '.yaml', '.yml']);

function defaultSource() {
  if (process.env.ANTIGRAVITY_ROOT) return process.env.ANTIGRAVITY_ROOT;
  const tarball = path.join(os.homedir(), 'antigravity_export.tar.gz');
  if (fs.existsSync(tarball)) return tarball;
  return path.join(os.homedir(), '.gemini', 'antigravity');
}

function resolveSource() {
  const source = fromArg ?? defaultSource();
  if (!fs.existsSync(source)) {
    console.error(`[antigravity] source not found: ${source}`);
    process.exit(1);
  }
  if (source.endsWith('.tar.gz') || source.endsWith('.tgz')) {
    const dest = path.join(os.tmpdir(), 'antigravity-extract');
    if (!fs.existsSync(path.join(dest, 'antigravity', 'brain'))) {
      fs.mkdirSync(dest, { recursive: true });
      console.log(`[antigravity] extracting ${path.basename(source)} (~250MB, one time)…`);
      execFileSync('tar', ['-xzf', source, '-C', dest], { stdio: 'ignore', maxBuffer: 1024 * 1024 });
    } else {
      console.log('[antigravity] using cached extraction');
    }
    return { root: path.join(dest, 'antigravity'), label: path.basename(source) };
  }
  return { root: source, label: path.basename(source) };
}

const stripWrappers = (s) => {
  let out = String(s ?? '');
  out = out.replace(/<ADDITIONAL_FEEDBACK>[\s\S]*?<\/ADDITIONAL_FEEDBACK>/g, '');
  out = out.replace(/<([A-Z][A-Z_]{3,})>[\s\S]*?<\/\1>/g, (match, tag) => (tag === 'USER_REQUEST' ? '' : match));
  out = out.replace(/<\/?USER_REQUEST>/g, '');
  return out.trim();
};

const cleanUserText = (s) => {
  const raw = String(s ?? '');
  const requests = [...raw.matchAll(/<USER_REQUEST>([\s\S]*?)<\/USER_REQUEST>/g)].map((m) => m[1]);
  let out = requests.length ? requests.join('\n\n') : raw;
  out = out.replace(/<([A-Z][A-Z_]{3,})>[\s\S]*?<\/\1>/g, '');
  out = out.replace(/<\/?[A-Z][A-Z_]{3,}>/g, '');
  return out.trim();
};

function readTurns(dir) {
  const log = path.join(dir, '.system_generated', 'logs', 'transcript_full.jsonl');
  if (!fs.existsSync(log)) return { turns: [], steps: 0, toolSteps: 0, checkpoints: 0, first: null, last: null };
  const turns = [];
  let steps = 0;
  let toolSteps = 0;
  let checkpoints = 0;
  let first = null;
  let last = null;
  const raw = fs.readFileSync(log, 'utf8');
  for (const line of raw.split(/\r?\n/)) {
    if (!line.trim()) continue;
    let d;
    try {
      d = JSON.parse(line);
    } catch {
      continue;
    }
    steps++;
    if (d.created_at) {
      if (!first || d.created_at < first) first = d.created_at;
      if (!last || d.created_at > last) last = d.created_at;
    }
    const type = d.type;
    const content = String(d.content ?? '').trim();
    if (type === 'CHECKPOINT') {
      checkpoints++;
      continue;
    }
    if (type === 'USER_INPUT') {
      const text = cleanUserText(content);
      if (text) turns.push({ role: 'user', text, at: d.created_at ?? null });
      continue;
    }
    if (type === 'PLANNER_RESPONSE') {
      if (content) turns.push({ role: 'assistant', text: content, at: d.created_at ?? null });
      continue;
    }
    if (!['EPHEMERAL_MESSAGE', 'CONVERSATION_HISTORY', 'SYSTEM_MESSAGE'].includes(type)) toolSteps++;
  }
  turns.sort((a, b) => String(a.at ?? '').localeCompare(String(b.at ?? '')));
  return { turns, steps, toolSteps, checkpoints, first, last };
}

function readArtifacts(dir) {
  const out = [];
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!name.isFile()) continue;
    if (name.name.startsWith('.')) continue;
    if (name.name.endsWith('.metadata.json')) continue;
    const ext = path.extname(name.name).toLowerCase();
    const full = path.join(dir, name.name);
    let size = 0;
    try {
      size = fs.statSync(full).size;
    } catch {
      continue;
    }
    let kind = 'other';
    if (MEDIA.has(ext)) kind = 'media';
    else if (DOCS.has(ext)) kind = 'doc';
    else if (DATA.has(ext)) kind = 'data';
    else if (OTHER_LINKABLE.has(ext)) kind = 'other';
    else continue;
    out.push({ name: name.name, ext, size, kind, full });
  }
  return out;
}

function classify(names, hasMedia) {
  const lower = names.map((n) => n.toLowerCase());
  const has = (...needles) => needles.some((n) => lower.some((f) => f.includes(n)));
  if (has('implementation_plan', 'plan', 'task', 'roadmap', 'spec')) return 'projects';
  if (has('research', 'walkthrough', 'analysis', 'report', 'summary', 'findings')) return 'papers';
  if (hasMedia && !has('md')) return 'art';
  return 'garden';
}

const PAGES_BASE = process.env.PAGES_BASE ?? '/';
const assetUrl = (slug, file) => `${PAGES_BASE.replace(/\/$/, '')}/antigravity/${slug}/${encodeURIComponent(file)}`;

function fmtBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

function buildBody({ conv, section, turns, artifacts, copied, skippedAssets, sourceLabel, redactions, tally }) {
  const parts = [];
  const red = (text) => {
    const r = redact(text);
    for (const [k, v] of Object.entries(r.counts)) tally[k] = (tally[k] ?? 0) + v;
    return r.text;
  };
  const firstUser = turns.find((t) => t.role === 'user');
  const introSource = firstUser ? firstUser.text : '';
  const intro = red(introSource.replace(/\s+/g, ' ').slice(0, 420));
  if (intro) parts.push(intro);

  const docs = artifacts.filter((a) => a.kind === 'doc');
  for (const doc of docs) {
    const body = splitDoc(fs.readFileSync(doc.full, 'utf8')).body;
    const cleaned = red(body);
    parts.push(`## ${doc.name.replace(/\.md$/i, '').replace(/[-_]+/g, ' ')}\n\n${cleaned.trim()}`);
  }

  if (copied.length) {
    const lines = ['## Assets'];
    for (const a of copied) {
      const url = assetUrl(conv.slug, a.name);
      if (a.kind === 'media' && ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(a.ext)) {
        lines.push(`![${a.name.replace(/\.[^.]+$/, '')}](${url})`);
      }
      lines.push(`- [${a.name}](${url}) — ${a.ext.replace('.', '').toUpperCase()}, ${fmtBytes(a.size)}`);
    }
    parts.push(lines.join('\n'));
  }
  if (skippedAssets.length) {
    parts.push(
      `## Assets not published\n\n${skippedAssets
        .map((a) => `- \`${a.name}\` — ${fmtBytes(a.size)}, over the ${maxAssetMb} MB limit`)
        .join('\n')}`,
    );
  }

  const dataArtifacts = artifacts.filter((a) => a.kind === 'data');
  if (dataArtifacts.length) {
    parts.push(
      `## Source data\n\n${dataArtifacts
        .map((a) => `- \`${a.name}\` (${fmtBytes(a.size)}) — kept out of the published site`)
        .join('\n')}`,
    );
  }

  if (turns.length) {
    const messages = turns
      .map((t) => {
        const who = t.role === 'user' ? 'You' : 'Antigravity';
        const when = t.at ? ` · ${t.at.replace('T', ' ').slice(0, 16)}` : '';
        return `**${who}**${when}\n\n${red(t.text).trim()}`;
      })
      .join('\n\n---\n\n');
    parts.push(
      `<details>\n<summary>Chat transcript — ${turns.length} messages${
        conv.first ? `, ${conv.first.slice(0, 10)} → ${String(conv.last ?? conv.first).slice(0, 10)}` : ''
      }</summary>\n\n${messages}\n\n</details>`,
    );
  }

  const toolNote = conv.toolSteps ? `, ${conv.toolSteps} tool actions` : '';
  const truncNote = conv.checkpoints ? `, ${conv.checkpoints} context checkpoints (earlier turns were truncated by Antigravity)` : '';
  const redactedNote = Object.keys(tally).length ? ` Redacted before publishing: ${redactCounts(tally)}.` : '';
  parts.push(
    `---\n\n*Imported from Antigravity conversation \`${conv.id}\` — ${conv.steps} recorded steps${toolNote}${truncNote}. Source: \`${sourceLabel}\`.${redactedNote}*`,
  );
  return parts.join('\n\n');
}

const { root: agRoot, label: sourceLabel } = resolveSource();
const brainDir = path.join(agRoot, 'brain');
if (!fs.existsSync(brainDir)) {
  console.error(`[antigravity] no brain/ directory under ${agRoot}`);
  process.exit(1);
}

const convDirs = fs
  .readdirSync(brainDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && fs.existsSync(path.join(brainDir, d.name, '.system_generated')))
  .map((d) => path.join(brainDir, d.name));

const prune = argv.includes('--prune');

const reviewName = `${stampNow()}-antigravity`;
const reviewDir = path.join(ROOT, 'reviews', reviewName);
const manifestLines = [];
const summary = { review: reviewName, source: sourceLabel, generatedAt: new Date().toISOString(), posts: [], skipped: [], redactions: {} };
let redactionTotals = {};
let written = 0;
let skipped = 0;
let conflicts = 0;
let pruned = 0;

if (prune && !dryRun) {
  const reviewRoot = path.join(ROOT, 'reviews');
  for (const d of fs.readdirSync(reviewRoot)) {
    const manifestPath = path.join(reviewRoot, d, 'IMPORT.json');
    if (!d.endsWith('-antigravity') || !fs.existsSync(manifestPath)) continue;
    let prior;
    try {
      prior = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch {
      continue;
    }
    for (const p of prior.posts ?? []) {
      if (p.status !== 'staged') continue;
      const f = path.join(ROOT, 'src', 'content', p.section, `${p.slug}.md`);
      if (fs.existsSync(f) && fs.readFileSync(f, 'utf8').slice(0, 900).includes(`antigravity://${p.id}`)) {
        fs.unlinkSync(f);
        pruned++;
      }
      const ad = path.join(ROOT, 'public', 'antigravity', p.slug);
      if (fs.existsSync(ad)) fs.rmSync(ad, { recursive: true, force: true });
    }
    fs.rmSync(path.join(reviewRoot, d), { recursive: true, force: true });
  }
}

for (const dir of convDirs) {
  const id = path.basename(dir);
  const { turns, steps, toolSteps, checkpoints, first, last } = readTurns(dir);
  const artifacts = readArtifacts(dir);
  const sensitive = artifacts.some((a) => SENSITIVE_ARTIFACT.test(a.name));
  const safeArtifacts = sensitive ? artifacts.filter((a) => !SENSITIVE_ARTIFACT.test(a.name)) : artifacts;
  if (!turns.length && !safeArtifacts.length) {
    skipped++;
    summary.skipped.push({ id, reason: 'no transcript and no artifacts' });
    continue;
  }

  const firstUser = turns.find((t) => t.role === 'user');
  const firstAssistant = turns.find((t) => t.role === 'assistant');
  const docArtifact = safeArtifacts.find((a) => a.kind === 'doc');
  const fallbackName = docArtifact ? docArtifact.name.replace(/\.md$/i, '').replace(/[-_]+/g, ' ') : `Antigravity chat ${id.slice(0, 8)}`;

  const titleSource = (firstUser?.text ?? firstAssistant?.text ?? fallbackName).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const title = cleanTitle(titleSource, fallbackName);

  const words = String(title).split(/\s+/).slice(0, 9).join(' ');
  const slugBase = slugify(words, 60) || slugify(fallbackName, 40) || id.slice(0, 8);
  const section = classify(safeArtifacts.map((a) => a.name), safeArtifacts.some((a) => a.kind === 'media'));

  let slug = slugBase;
  let n = 2;
  for (;;) {
    const existingPath = path.join(ROOT, 'src', 'content', section, `${slug}.md`);
    if (!fs.existsSync(existingPath)) break;
    const existing = splitDoc(fs.readFileSync(existingPath, 'utf8'));
    if (existing.data.source === `antigravity://${id}`) break;
    slug = `${slugBase}-${n++}`;
  }

  const conv = { id, slug, steps, toolSteps, checkpoints, first, last };
  const assetOutDir = path.join(ROOT, 'public', 'antigravity', slug);
  const copied = [];
  const skippedAssets = [];
  for (const a of safeArtifacts) {
    if (a.kind === 'data' && !includeData) continue;
    if (a.size > maxAssetMb * 1024 * 1024) {
      skippedAssets.push(a);
      continue;
    }
    if (!dryRun) {
      fs.mkdirSync(assetOutDir, { recursive: true });
      fs.copyFileSync(a.full, path.join(assetOutDir, a.name));
    }
    copied.push(a);
  }

  const tally = {};
  const shownTurns = sensitive ? [] : turns;
  let finalBody = buildBody({
    conv,
    section,
    turns: shownTurns,
    artifacts: safeArtifacts,
    copied,
    skippedAssets,
    sourceLabel,
    redactions: null,
    tally,
  });
  if (sensitive) {
    tally['transcript messages withheld'] = turns.length;
    finalBody += `\n\n---\n\n*This conversation contained outreach drafts and third-party contact details. Those artifacts and the full transcript are withheld from the site and kept in the private source archive instead.*`;
  }

  const descRaw = cleanDescription(firstUser?.text ?? '', finalBody);
  const description = redact(descRaw).text;
  for (const [k, v] of Object.entries(redact(descRaw).counts)) tally[k] = (tally[k] ?? 0) + v;

  const data = sanitizeData(section, {
    title,
    description,
    date: first ? first.slice(0, 10) : undefined,
    tags: ['antigravity', 'chat', section === 'garden' ? 'note' : section],
    source: `antigravity://${id}`,
    draft: true,
    vault: section === 'garden' ? false : undefined,
  });

  const output = serialize(data, finalBody);
  const dest = path.join(ROOT, 'src', 'content', section, `${slug}.md`);
  if (fs.existsSync(dest) && !force) {
    conflicts++;
    summary.posts.push({ id, section, slug, status: 'conflict' });
    continue;
  }
  if (!dryRun) {
    backupFile(ROOT, dest);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, output);
  }
  written++;
  for (const [k, v] of Object.entries(tally)) {
    redactionTotals[k] = (redactionTotals[k] ?? 0) + v;
  }
  manifestLines.push(`- [ ]\t${section}\t${slug}.md\t${title}\tantigravity:${id}`);
  summary.posts.push({
    id,
    section,
    slug,
    status: 'staged',
    title,
    date: data.date ?? null,
    turns: turns.length,
    steps,
    toolSteps,
    artifacts: artifacts.length,
    assetsCopied: copied.length,
    assetsSkipped: skippedAssets.length,
    dataFilesHeldBack: safeArtifacts.filter((a) => a.kind === 'data').length,
    withheld: sensitive,
  });
}

summary.counts = { conversations: convDirs.length, written, skipped, conflicts, pruned, assetsCopied: summary.posts.reduce((n, p) => n + (p.assetsCopied ?? 0), 0) };
summary.redactions = redactionTotals;

if (!dryRun) {
  fs.mkdirSync(reviewDir, { recursive: true });
  fs.writeFileSync(
    path.join(reviewDir, 'MANIFEST.md'),
    `# Antigravity import — ${reviewName}\n\nSource: \`${sourceLabel}\`\n\n${manifestLines.join('\n')}\n`,
  );
  fs.writeFileSync(path.join(reviewDir, 'IMPORT.json'), `${JSON.stringify(summary, null, 2)}\n`);
}

console.log(`[antigravity] ${dryRun ? 'dry run — ' : ''}source ${sourceLabel}`);
if (prune) console.log(`[antigravity] pruned ${pruned} posts from previous imports`);
console.log(`[antigravity] ${written} posts staged, ${skipped} conversations skipped, ${conflicts} conflicts`);
console.log(`[antigravity] ${summary.counts.assetsCopied} assets copied to public/antigravity/`);
console.log(`[antigravity] redactions: ${redactCounts(redactionTotals)}`);
const bySection = {};
for (const p of summary.posts) if (p.status === 'staged') bySection[p.section] = (bySection[p.section] ?? 0) + 1;
console.log(`[antigravity] by section: ${Object.entries(bySection).map(([k, v]) => `${k} ${v}`).join(', ')}`);
if (!dryRun) {
  console.log(`[antigravity] wrote ${path.relative(ROOT, path.join(reviewDir, 'IMPORT.json'))}`);
  console.log('[antigravity] review them at http://localhost:4321/staging — all posts are drafts');
}
