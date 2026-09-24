// Extract candidate notes from opencode's SQLite history (~/.local/share/opencode/opencode.db).
// Outputs reviews/src/opencode.json for review-notes.mjs. Deterministic.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { DatabaseSync } from 'node:sqlite';
import { cleanTitle, cleanDescription, fmtDate, slugify } from './lib/normalize.mjs';

const DB = process.env.OPENCODE_DB || path.join(os.homedir(), '.local/share/opencode/opencode.db');
const OUT = process.argv[2] || 'reviews/src/opencode.json';
const MIN_MESSAGES = Number(process.env.OPENCODE_MIN_MSGS || 8);

function rows(db, sql, ...args) {
  const st = db.prepare(sql);
  return args.length ? st.all(...args) : st.all();
}

function msgCount(db, sessionId) {
  return db.prepare('select count(*) n from message where session_id = ?').get(sessionId).n;
}

function todosDone(db, sessionId) {
  return rows(db, 'select content from todo where session_id = ? and status = ?', sessionId, 'done').map((r) => r.content);
}

function firstUserText(db, sessionId) {
  const parts = rows(
    db,
    `select p.data from part p join message m on p.message_id = m.id
     where m.session_id = ? and m.data like '%"role":"user"%'
     order by m.time_created limit 1`,
    sessionId,
  );
  for (const p of parts.slice(0, 20)) {
    try {
      const d = JSON.parse(p.data);
      if (d.type === 'text' && typeof d.text === 'string' && d.text.trim()) return d.text.trim();
    } catch {}
  }
  return '';
}

const db = new DatabaseSync(DB, { readOnly: true });
const sessions = rows(db, `select id, slug, directory, path, title, time_created from session`);

const candidates = [];
let dropped = 0;
for (const s of sessions) {
  const n = msgCount(db, s.id);
  if (n < MIN_MESSAGES) { dropped++; continue; }
  const first = firstUserText(db, s.id);
  const todo = todosDone(db, s.id);
  const date = fmtDate(Number(s.time_created));
  const dir = s.directory || '(unknown working dir)';
  let body = [
    `**What this is:** an opencode working session — ${n} messages${todo.length ? `, ${todo.length} task(s) completed` : ''}.`,
    '',
    `**When:** ${date || 'unknown'} · **Working directory:** \`${dir}\``,
  ].join('\n');
  if (first) body += `\n\n**Opened with:**\n\n> ${first.split('\n').slice(0, 6).join('\n> ').slice(0, 900)}`;
  if (todo.length) body += `\n\n**Tasks completed:**\n\n- ${todo.slice(0, 10).join('\n- ')}`;
  const t = cleanTitle(s.title, s.slug);
  candidates.push({
    kind: 'opencode',
    source: `opencode://${s.slug}`,
    sectionHint: 'journal',
    title: t,
    description: cleanDescription('', first),
    date,
    tags: ['opencode', 'session'],
    body,
  });
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({ generated: new Date().toISOString(), dropped, candidates }, null, 2));
console.log(`[ingest:opencode] ${candidates.length} session candidates (dropped ${dropped} with < ${MIN_MESSAGES} msgs) -> ${OUT}`);