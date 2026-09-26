/**
 * Generate sitemap.xml from the built site.
 *
 * Done post-build rather than via @astrojs/sitemap so it needs no new
 * dependency (the working copy is on eFAT, where npm install cannot link
 * binaries) and so it sees the same base-prefixed paths that actually ship.
 *
 *   node scripts/build-sitemap.mjs [--site https://host/] [--base /repo] [--dir dist]
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const argv = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = argv.indexOf(name);
  return i === -1 ? fallback : argv[i + 1];
};

const site = (arg('--site', 'https://nothing-absolute.github.io/reluctant.capitalist/') || '').replace(/\/?$/, '/');
const base = (arg('--base', process.env.PAGES_BASE ?? '/') || '/').replace(/\/$/, '');
const dir = path.join(ROOT, arg('--dir', 'dist'));

// `site` already embeds the project subpath, so build absolute URLs from the
// origin and prepend `base` explicitly — otherwise the path is doubled.
const origin = new URL(site).origin;

// Dev-gated placeholders and error pages should not be indexed. Derived
// /antigravity/ artifacts are build inputs, not site content.
const SKIP = new Set(['404.html', '404/index.html', 'review/index.html', 'staging/index.html']);
const SKIP_PREFIX = 'antigravity/';

if (!fs.existsSync(dir)) {
  console.error(`[sitemap] ${path.relative(ROOT, dir)} does not exist — build first`);
  process.exit(1);
}

const urls = [];
const walk = (d) => {
  for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (entry.name.endsWith('.html')) {
      const rel = path.relative(dir, p).split(path.sep).join('/');
      if (SKIP.has(rel) || rel.startsWith(SKIP_PREFIX)) continue;
      // dist/index.html -> "/", dist/blog/x/index.html -> "/blog/x/"
      const route = rel === 'index.html' ? '/' : `/${rel.replace(/index\.html$/, '')}`;
      urls.push(`${origin}${base}${route}`);
    }
  }
};
walk(dir);
urls.sort();

const esc = (u) => u.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${esc(u)}</loc></url>`).join('\n')}
</urlset>
`;

const out = path.join(dir, 'sitemap.xml');
fs.writeFileSync(out, xml);
console.log(`[sitemap] wrote ${urls.length} url(s) -> ${path.relative(ROOT, out)}`);
console.log(`[sitemap] sample: ${urls[0] ?? '(none)'}`);
