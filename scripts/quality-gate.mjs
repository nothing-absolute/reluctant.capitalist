import fs from 'node:fs';
import path from 'node:path';
import { splitDoc, SECTION_KEYS } from './lib/staging.mjs';
import { repetition, duplicateParagraphs, splitSections, proseOnly } from './lib/quality.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const CONTENT = path.join(ROOT, 'src', 'content');
const argv = process.argv.slice(2);
const verbose = argv.includes('--verbose');

const reports = [];
for (const section of SECTION_KEYS) {
  const dir = path.join(CONTENT, section);
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const abs = path.join(dir, file);
    const { data, body } = splitDoc(fs.readFileSync(abs, 'utf8'));
    const { narrative, raw } = splitSections(body);
    const prose = narrative.replace(/```[\s\S]*?```/g, ' ').split(/^## The work so far\s*$/m)[0];
    const n = repetition(proseOnly(prose));
    const r = repetition(raw.replace(/```[\s\S]*?```/g, ' '));
    const dupParas = duplicateParagraphs(proseOnly(prose));
    const issues = [];
    if (n.words >= 80) {
      if (n.worst >= 3) issues.push(`narrative loop: 8-gram x${n.worst}`);
      if (dupParas > 0) issues.push(`${dupParas} duplicate paragraph(s)`);
      if (n.repeated > Math.max(8, Math.round(n.words / 60))) issues.push(`${n.repeated} repeated narrative 8-grams`);
    }
    const rawLoop = r.words > 400 && r.worst >= 5;
    if (rawLoop) issues.push(`raw transcript loop: 8-gram x${r.worst}`);
    if (n.words < 120) issues.push(`thin: ${n.words} words`);
    if (!issues.length) continue;
    reports.push({
      id: `${section}/${file.replace(/\.md$/, '')}`,
      title: data.title,
      words: n.words,
      rawWords: r.words,
      worst: n.worst,
      rawWorst: r.worst,
      dupParas,
      narrativeLoop: n.words >= 80 && (n.worst >= 3 || dupParas > 0),
      rawLoop,
      issues,
      source: data.source,
    });
  }
}

const narrativeLoops = reports.filter((r) => r.narrativeLoop);
const rawOnly = reports.filter((r) => !r.narrativeLoop && r.rawLoop);
const thin = reports.filter((r) => !r.narrativeLoop && !r.rawLoop);

fs.writeFileSync(
  path.join(ROOT, 'reviews', 'QUALITY.json'),
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      summary: { flagged: reports.length, narrativeLoops: narrativeLoops.length, rawTranscriptLoops: rawOnly.length, thin: thin.length },
      reports,
    },
    null,
    2,
  )}\n`,
);

console.log(`[quality] ${reports.length} posts flagged of 237`);
console.log(`  narrative loops (prose must be rewritten): ${narrativeLoops.length}`);
console.log(`  raw-transcript loops only (prose is fine):    ${rawOnly.length}`);
console.log(`  thin / other:                                 ${thin.length}\n`);
for (const r of narrativeLoops.slice(0, verbose ? 999 : 25)) {
  console.log(`  ${r.id}\n    ${r.issues.join('; ')}`);
}
if (narrativeLoops.length > 25 && !verbose) console.log(`  … ${narrativeLoops.length - 25} more`);
console.log('\n[quality] wrote reviews/QUALITY.json');
