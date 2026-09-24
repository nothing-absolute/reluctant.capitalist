// Extract candidate notes from Google Antigravity's local store.
// Sources: ~/.gemini/antigravity-ide/brain/<conv>/*.md artifacts (root-level only,
// not .system_generated/ or browser/) and the scratch project dirs.
// Outputs reviews/src/antigravity.json for review-notes.mjs. Deterministic.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { cleanTitle, cleanDescription, fmtDate, parseFrontmatter, stripWikiLinks } from './lib/normalize.mjs';

const ROOT = process.env.ANTIGRAVITY_ROOT || path.join(os.homedir(), '.gemini/antigravity-ide');
const OUT = process.argv[2] || 'reviews/src/antigravity.json';

const candidates = [];

function add(kind, source, hint, title, date, tags, content) {
  const { data } = parseFrontmatter(content);
  candidates.push({
    kind,
    source,
    sectionHint: hint,
    title: cleanTitle(data.title || title, title),
    description: cleanDescription(data.description || '', content),
    date,
    tags,
    body: stripWikiLinks(content),
  });
}

const brain = path.join(ROOT, 'brain');
if (fs.existsSync(brain)) {
  for (const conv of fs.readdirSync(brain)) {
    const dir = path.join(brain, conv);
    if (!fs.statSync(dir).isDirectory()) continue;
    let entries;
    try { entries = fs.readdirSync(dir); } catch { continue; }
    for (const f of entries) {
      if (!f.endsWith('.md')) continue;
      const fp = path.join(dir, f);
      const st = fs.statSync(fp);
      if (!st.isFile()) continue;
      const content = fs.readFileSync(fp, 'utf8');
      const hint = /plan/i.test(f) ? 'projects' : /walkthrough|report|summary/i.test(f) ? 'papers' : 'garden';
      add('antigravity', `antigravity://${conv}/${f}`, hint, f.replace(/\.md$/, ''), fmtDate(st.mtime), ['antigravity', 'artifact'], content);
    }
  }
}

const scratch = path.join(ROOT, 'scratch');
if (fs.existsSync(scratch)) {
  for (const d of fs.readdirSync(scratch)) {
    const dir = path.join(scratch, d);
    if (!fs.statSync(dir).isDirectory()) continue;
    const st = fs.statSync(dir);
    let list;
    try { list = fs.readdirSync(dir); } catch { list = []; }
    const files = list.filter((f) => !f.startsWith('.')).slice(0, 30);
    const body = [
      `**What this is:** an Antigravity scratch project — created as a workspace here.`,
      '',
      '## Contents',
      '',
      ...files.map((f) => `- \`${f}\``),
    ].join('\n');
    candidates.push({
      kind: 'antigravity',
      source: `antigravity://scratch/${d}`,
      sectionHint: 'projects',
      title: cleanTitle('', d),
      description: `Antigravity scratch project "${d}" — ${files.length} item(s) in its workspace.`,
      date: fmtDate(st.mtime),
      tags: ['antigravity', 'project'],
      body,
    });
  }
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({ generated: new Date().toISOString(), candidates }, null, 2));
console.log(`[ingest:antigravity] ${candidates.length} candidates -> ${OUT}`);