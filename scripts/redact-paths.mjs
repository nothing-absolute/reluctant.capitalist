/**
 * Redact absolute local filesystem paths from published content.
 *
 * Genuine authored posts still carry the owner's real directory layout
 * (/home/jd/..., /media/jd/...). That is a privacy leak once the site is
 * public, and it is not content — the path is an artifact of the import.
 * Only the `local-path` rule is applied, so already-clean prose is untouched.
 *
 *   node scripts/redact-paths.mjs          # dry run
 *   node scripts/redact-paths.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';
import { redact } from './lib/redact.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const CONTENT = path.join(ROOT, 'src', 'content');
const apply = process.argv.slice(2).includes('--apply');

const changed = [];
let totalHits = 0;

for (const section of fs.readdirSync(CONTENT, { withFileTypes: true }).filter((d) => d.isDirectory())) {
  const dir = path.join(CONTENT, section.name);
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.md')).sort()) {
    const abs = path.join(dir, file);
    const raw = fs.readFileSync(abs, 'utf8');
    const { text, counts } = redact(raw, ['local-path']);
    const hits = counts['local-path'] ?? 0;
    if (!hits) continue;
    totalHits += hits;
    changed.push({ rel: `${section.name}/${file}`, hits, draft: /^---\n[\s\S]*?\ndraft: true/m.test(raw) });
    if (apply) fs.writeFileSync(abs, text);
  }
}

const pub = changed.filter((c) => !c.draft).length;
console.log(`[paths] ${changed.length} posts contain local paths (${totalHits} occurrences)`);
console.log(`[paths] ${pub} would publish, ${changed.length - pub} draft`);
console.log(`[paths] ${apply ? 'redacted' : 'would redact'} (dry run — pass --apply to write)`);
for (const c of changed.slice(0, 12)) console.log(`  ${String(c.hits).padStart(3)}x ${c.draft ? 'draft ' : 'PUBLIC '} ${c.rel}`);
if (changed.length > 12) console.log(`  … ${changed.length - 12} more`);
if (apply) {
  console.log(`\n[paths] done — review with: git diff --stat`);
  console.log('[paths] revert with: git checkout -- src/content');
}
