/**
 * Classify machine-generated import artifacts vs authored content.
 *
 * The corpus is built by importing Antigravity / opencode / compose sessions.
 * Some imports are genuine authored notes; others are verbatim agent chatter
 * ("I have completed the exploration of ... and delivered the report to the
 * main agent via send_message") or ephemeral operational scratch
 * ("Free up RAM and CPU", "Navigate to http://localhost:7000"). Those are not
 * posts. They also leak absolute local paths.
 *
 * Read-only. Writes reviews/TRIAGE.json. Quarantine separately, via
 * quarantine-junk.mjs --apply or by hand, so the step stays reversible.
 */
import fs from 'node:fs';
import path from 'node:path';
import { splitDoc } from './lib/staging.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const CONTENT = path.join(ROOT, 'src', 'content');
const SECTIONS = fs
  .readdirSync(CONTENT, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const SIGNALS = {
  // Verbatim agent self-report: the importer logged the agent narrating itself.
  agentLog: /Imported from Antigravity conversation|recorded steps|tool actions|via `?send_message`?|to the main agent|main agent via/i,
  // Absolute local paths. Privacy: reveals the owner's directory layout.
  pathLeak: /\/home\/jd|\/media\/jd/i,
  // Ephemeral operational instruction, not a note.
  operational: /localhost:\d+|127\.0\.0\.1/i,
  // Raw machine transcript pasted into the body.
  transcript: /<details>\s*\n?\s*<summary>Chat transcript/,
  // Title is a bare command to a tool.
  imperativeTitle:
    /^(navigate|reload|free up|use thunar|install|uninstall|export all|set up|help me|i will|i have|i need|write a|create a|build a|find a|look up|make a|add |fix |simulate|evulate|check )\b/i,
};

const rows = [];
for (const section of SECTIONS) {
  const dir = path.join(CONTENT, section);
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.md')).sort()) {
    const rel = `${section}/${file}`;
    const raw = fs.readFileSync(path.join(dir, file), 'utf8');
    const { data, body } = splitDoc(raw);
    const title = String(data.title ?? '');
    const probe = `${title}\n${body}`;

    const reasons = Object.entries(SIGNALS)
      .filter(([name, re]) => (name === 'imperativeTitle' ? re.test(title) : re.test(probe)))
      .map(([name]) => name);

    rows.push({
      rel,
      section,
      title,
      draft: data.draft === true,
      bytes: raw.length,
      reasons,
      score: reasons.length,
    });
  }
}

const flagged = rows.filter((r) => r.score > 0);
const clean = rows.filter((r) => r.score === 0);

const byReason = {};
for (const r of flagged) for (const x of r.reasons) byReason[x] = (byReason[x] ?? 0) + 1;

// A post is only a strong removal candidate if it is machine chatter or leaks
// paths. A stray "localhost" mention inside an otherwise authored post is not.
const strong = flagged.filter((r) => r.reasons.includes('agentLog') || r.reasons.includes('pathLeak'));
const weak = flagged.filter((r) => !strong.includes(r));

const out = {
  generatedAt: new Date().toISOString(),
  totals: {
    posts: rows.length,
    clean: clean.length,
    flagged: flagged.length,
    strong: strong.length,
    weak: weak.length,
    strongPublished: strong.filter((r) => !r.draft).length,
    strongDraft: strong.filter((r) => r.draft).length,
  },
  byReason,
  strong,
  weak,
};
fs.mkdirSync(path.join(ROOT, 'reviews'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'reviews', 'TRIAGE.json'), `${JSON.stringify(out, null, 2)}\n`);

console.log(`[triage] ${rows.length} posts: ${clean.length} clean, ${flagged.length} flagged`);
console.log(`[triage] strong (agent chatter or path leak): ${strong.length}  (${out.totals.strongPublished} would publish, ${out.totals.strongDraft} draft)`);
console.log(`[triage] weak (incidental signal only):       ${weak.length}`);
for (const [k, v] of Object.entries(byReason).sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(4)}  ${k}`);
console.log('\n[triage] by section (strong):');
const secCount = {};
for (const r of strong) secCount[r.section] = (secCount[r.section] ?? 0) + 1;
for (const [k, v] of Object.entries(secCount).sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(4)}  ${k}`);
console.log('\n[triage] sample strong:');
for (const r of strong.slice(0, 10)) console.log(`  ${r.reasons.join('+').padEnd(20)} ${r.draft ? 'draft ' : 'PUBLIC '} ${r.rel}`);
console.log('[triage] wrote reviews/TRIAGE.json');
