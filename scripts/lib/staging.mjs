import fs from 'node:fs';
import path from 'node:path';

export const SECTION_KEYS = [
  'projects',
  'blog',
  'papers',
  'art',
  'comics',
  'concepts',
  'design',
  'goals',
  'values',
  'garden',
  'fragments',
];

const COMMON_FIELDS = ['title', 'description', 'date', 'tags', 'source', 'draft', 'clarity', 'quality'];

export const ALLOWED_FIELDS = {
  projects: [...COMMON_FIELDS, 'status', 'stage', 'stack', 'repo', 'url'],
  blog: [...COMMON_FIELDS],
  papers: [...COMMON_FIELDS, 'type'],
  art: [...COMMON_FIELDS, 'medium'],
  comics: [...COMMON_FIELDS, 'series'],
  concepts: [...COMMON_FIELDS, 'status'],
  design: [...COMMON_FIELDS, 'discipline'],
  goals: [...COMMON_FIELDS, 'status', 'target'],
  values: [...COMMON_FIELDS, 'weight'],
  garden: [...COMMON_FIELDS, 'vault'],
  fragments: [...COMMON_FIELDS, 'mechanism', 'signal', 'from'],
};

export const ENUMS = {
  'projects.status': ['seed', 'concept', 'prototype', 'active', 'paused', 'shipped', 'killed'],
  'projects.stage': ['idea', 'research', 'mock', 'mvp', 'product', 'retired'],
  'papers.type': ['essay', 'paper', 'letter', 'notes'],
  'concepts.status': ['seed', 'developing', 'relayed', 'shelved'],
  'goals.status': ['active', 'done', 'stalled', 'dropped'],
  'fragments.mechanism': ['volume', 'definition', 'capture', 'reach', 'extraction', 'legibility', 'tooling', 'craft', 'open'],
};

export class StagingError extends Error {}

export function isSection(section) {
  return SECTION_KEYS.includes(section);
}

export function isSlug(slug) {
  return typeof slug === 'string' && /^[a-z0-9][a-z0-9-]*$/i.test(slug) && !slug.includes('..');
}

export function requireTarget(section, slug) {
  if (!isSection(section)) throw new StagingError(`unknown section: ${section}`);
  if (!isSlug(slug)) throw new StagingError(`unsafe slug: ${slug}`);
  return { section, slug, file: `${slug}.md` };
}

export function contentPath(root, section, slug) {
  const t = requireTarget(section, slug);
  return path.join(root, 'src', 'content', t.section, t.file);
}

export function splitDoc(md) {
  const text = String(md ?? '');
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { data: {}, body: text.replace(/^\s+/, '') };
  return { data: parseYaml(match[1]), body: text.slice(match[0].length) };
}

function parseYaml(block) {
  const data = {};
  const lines = block.split(/\r?\n/);
  let listKey = null;
  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const listItem = line.match(/^\s*-\s+(.*)$/);
    if (listItem && listKey) {
      data[listKey].push(coerceScalar(listItem[1]));
      continue;
    }
    const kv = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (!kv) continue;
    const [, key, rawValue] = kv;
    const value = rawValue.trim();
    if (value === '') {
      listKey = key;
      data[key] = [];
      continue;
    }
    listKey = null;
    data[key] = coerceScalar(value);
  }
  return data;
}

function coerceScalar(value) {
  const v = String(value).trim();
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (v === 'null' || v === '~') return null;
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  if (v.startsWith('[') && v.endsWith(']')) {
    const inner = v.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(',').map((part) => coerceScalar(unquote(part)));
  }
  return unquote(v);
}

function unquote(s) {
  const t = String(s).trim();
  if (t.length >= 2 && ((t[0] === '"' && t.at(-1) === '"') || (t[0] === "'" && t.at(-1) === "'"))) {
    return t.slice(1, -1).replace(/\\"/g, '"').replace(/\\'/g, "'");
  }
  return t;
}

function quote(value) {
  return `"${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

export function sanitizeData(section, data) {
  const allowed = ALLOWED_FIELDS[section] ?? COMMON_FIELDS;
  const out = {};
  for (const key of allowed) {
    if (data[key] === undefined || data[key] === null || data[key] === '') continue;
    const enumValues = ENUMS[`${section}.${key}`];
    if (enumValues && !enumValues.includes(data[key])) continue;
    out[key] = data[key];
  }
  if (!out.title) out.title = 'Untitled';
  if (out.tags && !Array.isArray(out.tags)) out.tags = [String(out.tags)];
  for (const key of ['clarity', 'quality', 'weight']) {
    if (key in out) out[key] = Number(out[key]);
    if (Number.isNaN(out[key])) delete out[key];
  }
  if ('draft' in out) out.draft = Boolean(out.draft);
  return out;
}

export function serialize(data, body) {
  const lines = ['---'];
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      lines.push(`${key}: ${JSON.stringify(value.map(String))}`);
    } else if (typeof value === 'boolean' || typeof value === 'number') {
      lines.push(`${key}: ${value}`);
    } else {
      lines.push(`${key}: ${quote(value)}`);
    }
  }
  lines.push('---', '');
  const trimmedBody = String(body ?? '').replace(/^\s+/, '');
  return `${lines.join('\n')}\n${trimmedBody.replace(/\s*$/, '')}\n`;
}

export function backupRoot(root) {
  return path.join(root, '.staging-backups');
}

export function backupFile(root, absPath, stamp = stampNow()) {
  if (!fs.existsSync(absPath)) return null;
  const rel = path.relative(root, absPath).replace(/[\\/]/g, '__');
  const dir = path.join(backupRoot(root), stamp);
  fs.mkdirSync(dir, { recursive: true });
  let dest = path.join(dir, rel);
  let n = 1;
  while (fs.existsSync(dest)) {
    dest = path.join(dir, `${rel}.${n}`);
    n++;
  }
  fs.copyFileSync(absPath, dest);
  return dest;
}

export function writeFileBackedUp(root, absPath, contents) {
  backupFile(root, absPath);
  fs.mkdirSync(path.dirname(absPath), { recursive: true });
  fs.writeFileSync(absPath, contents);
  return absPath;
}

export function slugify(input, max = 60) {
  return String(input)
    .toLowerCase()
    .replace(/['\u2019]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, max)
    .replace(/-+$/, '');
}

export function stampNow(d = new Date()) {
  return d.toISOString().replace(/[-:]/g, '').replace(/\..+/, '').replace('T', '-');
}

export function setDraft(md, draft) {
  const { data, body } = splitDoc(md);
  data.draft = Boolean(draft);
  return serialize(sanitizeDataFromOwnDoc(data), body);
}

function sanitizeDataFromOwnDoc(data) {
  const out = { ...data };
  if (out.tags && !Array.isArray(out.tags)) out.tags = [String(out.tags)];
  return out;
}

export function setScores(md, clarity, quality) {
  const { data, body } = splitDoc(md);
  if (clarity !== undefined && clarity !== null) data.clarity = Number(clarity);
  if (quality !== undefined && quality !== null) data.quality = Number(quality);
  return serialize(sanitizeDataFromOwnDoc(data), body);
}
