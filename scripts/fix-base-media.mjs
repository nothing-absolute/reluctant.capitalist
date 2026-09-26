/**
 * Prefix root-absolute media paths in built HTML with the Pages base.
 *
 * Astro rewrites its own links when `base` is set, but it does not touch
 * literal HTML inside markdown content. Posts embed media as
 * `<img src="/antigravity/...">`, which resolves to the domain root instead of
 * the project subpath, so those 234 images 404 on a project Pages site.
 *
 * Rewrites generated output only — src/content is never modified. Idempotent:
 * a path that already carries the base is left alone.
 *
 *   node scripts/fix-base-media.mjs [--base /reluctant.capitalist] [--dir dist]
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const argv = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = argv.indexOf(name);
  return i === -1 ? fallback : argv[i + 1];
};

const base = (arg('--base', process.env.PAGES_BASE ?? '/') || '/').replace(/\/$/, '');
const dir = path.join(ROOT, arg('--dir', 'dist'));

// Local top-level directories that appear as literal root-absolute paths in
// content. External URLs and already-prefixed paths are left untouched.
const LOCAL = ['antigravity', 'assets', 'video'];

if (!base || base === '/') {
  console.log('[base-media] no base configured (PAGES_BASE unset or "/") — nothing to do');
  process.exit(0);
}

const re = new RegExp(`((?:src|href)=")(/(?:${LOCAL.join('|')})/)`, 'g');

let files = 0;
let hits = 0;
const walk = (d) => {
  for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, entry.name);
    if (entry.isDirectory()) {
      walk(p);
      continue;
    }
    if (!entry.name.endsWith('.html')) continue;
    const raw = fs.readFileSync(p, 'utf8');
    let n = 0;
    const out = raw.replace(re, (_, pre, rest) => {
      n += 1;
      return `${pre}${base}${rest}`;
    });
    if (n) {
      fs.writeFileSync(p, out);
      files += 1;
      hits += n;
    }
  }
};

if (!fs.existsSync(dir)) {
  console.error(`[base-media] ${path.relative(ROOT, dir)} does not exist — build first`);
  process.exit(1);
}
walk(dir);

console.log(`[base-media] base=${base} — prefixed ${hits} ref(s) across ${files} file(s)`);
const left = [];
const recheck = (d) => {
  for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, entry.name);
    if (entry.isDirectory()) recheck(p);
    else if (entry.name.endsWith('.html')) {
      const raw = fs.readFileSync(p, 'utf8');
      const m = raw.match(re);
      if (m) left.push(`${path.relative(dir, p)} (${m.length})`);
    }
  }
};
recheck(dir);
console.log(left.length ? `[base-media] WARNING still unprefixed:\n  ${left.join('\n  ')}` : '[base-media] verified: no unprefixed media refs remain');
