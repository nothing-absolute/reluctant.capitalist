// Shared text normalization for the review pipeline.
// Deterministic only — no models. An AI polish pass is a later phase.
import path from 'node:path';

const FM_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
const WIKI = /!?\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

export function parseFrontmatter(md) {
  const m = FM_RE.exec(md);
  if (!m) return { data: {}, body: md };
  const data = {};
  const lines = m[1].split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('#')) continue;
    const colon = line.indexOf(':');
    if (colon < 1) continue;
    const key = line.slice(0, colon).trim();
    let val = line.slice(colon + 1).trim();
    if (val === '') {
      // block-style list (Obsidian's usual `tags:` followed by `- item` lines)
      const items = [];
      while (i + 1 < lines.length && /^\s*-\s+/.test(lines[i + 1])) {
        items.push(unquote(lines[++i].trim().replace(/^\s*-\s+/, '')));
      }
      if (items.length) data[key] = items;
      continue;
    }
    if (val.startsWith('[')) {
      let list = [val];
      if (!val.endsWith(']')) {
        while (i + 1 < lines.length && !lines[i + 1].trim().endsWith(']') && !lines[i + 1].includes(']')) i++;
      }
      const joined = list.join(' ').replace(/,$/, '');
      const inner = joined.slice(1, joined.lastIndexOf(']') > -1 ? joined.lastIndexOf(']') : undefined) ?? '';
      val = inner;
      const items = val.split(',').map((s) => unquote(s.trim())).filter(Boolean);
      data[key] = items;
      continue;
    }
    if (val.startsWith('"') || val.startsWith("'")) {
      // single-line quoted scalar; reassemble multi-line quoted if needed
      let s = val;
      while ((s.startsWith('"') && !s.endsWith('"')) || (s.startsWith("'") && !s.endsWith("'"))) {
        if (i + 1 < lines.length) { i++; s += ' ' + lines[i].trim(); } else break;
      }
      data[key] = unquote(s);
      continue;
    }
    if (val === '' || val === 'null' || val === '~') continue; // skip empties (no "---" hijack)
    data[key] = unquote(val);
  }
  return { data, body: md.slice(m[0].length) };
}

export function unquote(s) {
  s = s.trim();
  if (s.length >= 2) {
    if ((s[0] === '"' && s[s.length - 1] === '"') || (s[0] === "'" && s[s.length - 1] === "'")) {
      s = s.slice(1, -1);
    }
  }
  return s;
}

export function stripWikiLinks(s) {
  if (!s) return s;
  // ![[embed]] -> '' (it's an asset); [[Note]] or [[Note|alias]] -> link text
  return s.replace(WIKI, (full, link, alias) => {
    if (full.trimStart().startsWith('!')) return '';
    return (alias || link).trim();
  });
}

export function humanize(s) {
  const base = path.basename(s, path.extname(s));
  return base
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function cleanTitle(raw, fallback) {
  let t = stripWikiLinks(raw || '')
    .replace(/\{\{[^}]*\}\}/g, '')
    .replace(/^#+\s*/, '')
    .replace(/\s+/g, ' ')
    .trim();
  t = t.replace(/^["']|["']$/g, '');
  if (!t || /^\{\{/.test(t)) t = humanize(fallback || '');
  if (t.length > 90) t = t.slice(0, 87).replace(/\s+\S*$/, '') + '…';
  return t;
}

export function cleanDescription(raw, body) {
  let d = stripWikiLinks(raw || '')
    .replace(/\{\{[^}]*\}\}/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!d && body) {
    const first = body
      .split(/\r?\n/)
      .map((l) => l.trim())
      .find((l) => l && !l.startsWith('#') && !l.startsWith('-') && !l.startsWith('>') && !l.startsWith('!'));
    if (first) d = stripWikiLinks(first).replace(/\{\{[^}]*\}\}/g, '').trim();
  }
  if (d.length > 180) d = d.slice(0, 177).replace(/\s+\S*$/, '') + '…';
  return d;
}

export function cleanBody(md, title) {
  const { body } = parseFrontmatter(md);
  // collapse wikilinks/embeds up front ([[Note]] -> Note, [[Note|alias]] -> alias,
  // ![[embed]] -> ''), then sweep any residual brackets from odd/multiline links
  let out = stripWikiLinks(body)
    .replace(/\{\{[^}]*\}\}/g, '') // template vars
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // inline images
    .replace(/\[\[|\]\]|!\[\[/g, '') // residual [[ or ]] artifacts
    .split(/\r?\n/);
  const lines = [];
  for (const raw of out) {
    const l = raw.trimEnd();
    const tl = l.trim();
    if (!l) {
      if (lines.length && lines[lines.length - 1] !== '') lines.push('');
      continue;
    }
    if (/^=+\s*$/.test(tl) || /^-{3,}\s*$/.test(tl)) continue; // hr / setext underline
    // strip the H1 that is the title (page header renders it)
    const h1 = tl.match(/^#\s+(.*)$/);
    if (h1 && title && h1[1].replace(/\s+/g, ' ').toLowerCase() === title.toLowerCase()) continue;
    // demote one level: # -> ## so top-level headers match the journal style
    const dem = tl.match(/^(#{1,6})\s+(.*)$/);
    if (dem) {
      lines.push('#'.repeat(Math.min(dem[1].length + 1, 6)) + ' ' + dem[2]);
      continue;
    }
    // wikilinks inside body text
    lines.push(stripWikiLinks(l));
  }
  while (lines.length && lines[lines.length - 1] === '') lines.pop();
  return lines.join('\n').trim();
}

export function isTemplateJunk(cleanedBody) {
  // real template shells are < ~400 chars of prose and padded with placeholder UI
  const body = cleanedBody || '';
  if (body.length < 60) return 'near-empty';
  const hasTemplateVar = /\{\{/.test(body);
  const checkboxLines = (body.match(/^\s*- \[( |x)\]/gm) || []).length;
  const proseChars = body.replace(/\{\{[^}]*\}\}/g, '').replace(/- \[( |x)\] ?/g, '').trim().length;
  if (hasTemplateVar && proseChars < 300) return 'unfilled-template';
  if (proseChars < 80) return 'bare-skeleton';
  return null;
}

export function fmtDate(d) {
  if (d instanceof Date && !isNaN(d)) return d.toISOString().slice(0, 10);
  if (typeof d === 'number') return fmtDate(new Date(d));
  const m = String(d).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  return null;
}

export function slugify(s, max = 64) {
  const base = s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, max) || 'note';
  return base.replace(/-+$/g, '');
}