import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { sanitizeData, serialize, slugify, writeFileBackedUp } from './lib/staging.mjs';
import { degenerate } from './lib/quality.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'src', 'content', 'fragments');
const BRAIN = process.env.ANTIGRAVITY_BRAIN ?? path.join(os.homedir(), '.gemini', 'antigravity', 'brain');
const API = process.env.POLISH_API ?? 'http://localhost:18000/v1';
const MODEL = process.env.POLISH_MODEL ?? 'qwen14b';
const TIMEOUT = Number(process.env.POLISH_TIMEOUT_MS ?? 900000);
const MAX_TOKENS = Number(process.env.POLISH_MAX_TOKENS ?? 4096);
const PER_CONVERSATION = Number(process.env.FRAGMENTS_PER_CONV ?? 12);
const argv = process.argv.slice(2);
const apply = argv.includes('--apply');
const limit = Number(process.env.FRAGMENT_LIMIT ?? 0);

const CONTEXT_FILE = path.join(ROOT, 'scripts', 'lib', 'creator-context.md');

// Same sensitive-artifact guard as the importer. A conversation that trips it is not
// distilled either — the fragments would carry the same private material.
const SENSITIVE = [
  'erica_outreach_letter',
  'nick_outreach_letter',
  'ema_contact_and_dm',
  'outreach_letter_v1',
  'contact_and_dm_draft',
];

const NOISE = /^(ok|okay|yes|no|thanks|thank you|got it|sounds good|perfect|great|continue|go ahead|do it|try it|next|again|fix it|run it|test it|please)\b[\s.!?]*$/i;

// Only reflective notes carry an idea worth distilling. Pure commands ("build a chart of...",
// "install X in Y") are the tool being talked to, not JD thinking, and forcing them into a
// first-person fragment fabricates a position he never took.
const REFLECTIVE = /\b(I|my|me|I think|because|why|should|would|instead|problem|idea|want|worry|worried|doubt|realiz|hmm|actually|prefer|feels|felt|decide|chose|choice|wasted|failed|works|worked)\b/i;
const OPERATIONAL =
  /^(install|uninstall|run|create|build|make|add|fix|update|check|look at|show|find|list|download|open|use|set up|configure|test|write|generate|implement|search|try|now|next|go|start|stop|remove|move|copy|rename|export|import|convert|render|deploy|commit|push|pull|clone|install)\b/i;
const ASSISTANT_VOICE = /\b(I will|I can|Let me|I recommend|I suggest|Here's what|This is what|I have (created|added|updated)|To (achieve|ensure|avoid),? I)\b/i;

function textOf(content) {
  if (Array.isArray(content)) {
    return content
      .map((x) => (typeof x === 'string' ? x : (x?.text ?? x?.content ?? '')))
      .join(' ')
      .trim();
  }
  return String(content ?? '').trim();
}

function stripTags(s) {
  return String(s)
    .replace(/<USER_REQUEST>/g, '')
    .replace(/<\/USER_REQUEST>/g, '')
    .replace(/<ADDITIONAL_METADATA>[\s\S]*?<\/ADDITIONAL_METADATA>/g, '')
    .replace(/<USER_SETTINGS_CHANGE>[\s\S]*?<\/USER_SETTINGS_CHANGE>/g, '')
    .replace(/<[^>]{2,40}>/g, ' ')
    .replace(/\[Tool calls\][\s\S]*?(?=\n\n|$)/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function readConversation(id) {
  const file = path.join(BRAIN, id, '.system_generated', 'logs', 'transcript_full.jsonl');
  if (!fs.existsSync(file)) return null;
  const userInputs = [];
  const thinking = [];
  let sensitive = false;

  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    let r;
    try {
      r = JSON.parse(line);
    } catch {
      continue;
    }
    const c = textOf(r.content);
    if (r.type === 'USER_INPUT') {
      const t = stripTags(c);
      if (t.length < 40 || NOISE.test(t) || t.split(' ').length < 12) continue;
      if (!REFLECTIVE.test(t)) continue;
      if (OPERATIONAL.test(t) && !/\b(because|why|I think|problem|idea|want|decide|chose|prefer)\b/i.test(t)) continue;
      userInputs.push(t);
    }
    const th = typeof r.thinking === 'string' ? r.thinking : textOf(r.thinking);
    if (th && th.length > 200) thinking.push(stripTags(th));
  }

  for (const u of userInputs) if (SENSITIVE.some((s) => u.toLowerCase().includes(s))) sensitive = true;
  return { id, userInputs, thinking, sensitive };
}

const SCHEMA = {
  type: 'object',
  properties: {
    fragments: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          claim: { type: 'string' },
          mechanism: {
            type: 'string',
            enum: ['volume', 'definition', 'capture', 'reach', 'extraction', 'legibility', 'tooling', 'craft', 'open'],
          },
          signal: { type: 'integer' },
          tags: { type: 'array', items: { type: 'string' } },
        },
        required: ['title', 'claim', 'mechanism', 'signal', 'tags'],
      },
    },
  },
  required: ['fragments'],
};

const VOICE_BRIEF = `
## Voice — the part that matters most

Every fragment is written by JD, in his own voice, about his own work. He is a builder writing
notes to himself.

**Every fragment must be first person.** It must contain "I" or "my". If your draft does not, it is
wrong — rewrite it before returning.

**Distil the DECISION, not the content.** The notes are often instructions to a tool or build
specs. Do not summarise the instruction. Extract the thing JD decided, wanted, noticed, doubted or
is worried about — and only what you can honestly infer about why. If the note gives you no reason
and no position, there is no fragment; drop it.

- Keep his specifics. The strange concrete detail is the value; a generalised version is worth less
  than nothing.
- 40-90 words. Plain, declarative, unsentimental. Short sentences. No marketing register.
- No hype, no emoji, no "excited to".
- Never write documentation voice ("The X is used to", "This provides a", passive constructions
  with no person in them) and never write assistant voice ("I will create", "Let me", "I recommend
  that you"). Those are two different speakers and neither is JD.
- Do not invent an experience the note does not contain. If the note was a bare question, write the
  question as a real question he is asking, not as an answer he reached.

## mechanism — the force in the fragment, not the topic

- \`volume\` — loudness, reach or attention as the winning move
- \`definition\` — someone setting the terms, scope, metrics or boundaries
- \`capture\` — someone being absorbed by a system
- \`reach\` — distribution: how a thing gets seen at all
- \`extraction\` — value, money, attention or labour being taken
- \`legibility\` — being understood, or failing to be
- \`tooling\` — the instrument: code, hardware, process, technique
- \`craft\` — making it well: drawing, writing, building, finishing
- \`open\` — shared goods, commons, things left deliberately open

Pick the force, not the subject. A note about an instrument is \`tooling\`. A note about a platform
paying the loudest is \`volume\`. A note about being handed a goal before you can argue with it is
\`definition\`. Most fragments are \`tooling\` or \`craft\` — do not stretch them into something
profound. If none of the nine fit, it is probably not a fragment.

## signal — 1 to 5

How strongly this connects to the thesis that understanding the system beats being the loudest in
it. 5 = squarely about that. 1 = just a note. Be honest; most are 1-3.

## What to skip

Status chatter, "looks good", build logs, tool output, and anything restating the instruction. If
there is no real idea, return an empty array — an empty array is a correct answer, a padded fragment
is not. Never reuse a sentence from these instructions in your output.

Return only JSON: {"fragments": [...]} with at most ${PER_CONVERSATION} entries.`;

const SYSTEM = `You distil raw working notes into atomic fragments for "The Reluctant Capitalist" —
a site by JD, an independent maker writing about projects, papers, concepts and what the systems
around him are actually doing.
${VOICE_BRIEF}`;

const DOC_VOICE =
  /\b(is used to|is designed to|is intended to|is used for|provides a|is responsible for|is capable of|is used when|is primarily|is commonly|is often used|is a component|is a feature|is a tool|is a process|is a technique|is a method)\b/i;
const DOC_OPENING = /^(The|This|These|It|There)\s+\w+\s+(is|are|provides|allows|enables|supports|helps|can|will)\b/i;

const FIRST_PERSON = /\b(I|I'm|I've|I'd|I'll|my|me)\b/;

function voiceOk(claim) {
  if (DOC_VOICE.test(claim)) return false;
  if (DOC_OPENING.test(claim.trim())) return false;
  if (!FIRST_PERSON.test(claim)) return false;
  if (ASSISTANT_VOICE.test(claim)) return false;
  return true;
}

async function call(user, temperature = 0.45) {
  const res = await fetch(`${API}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(TIMEOUT),
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: user },
      ],
      temperature,
      max_tokens: MAX_TOKENS,
      response_format: { type: 'json_schema', json_schema: { name: 'frags', strict: true, schema: SCHEMA } },
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const j = await res.json();
  const c = j?.choices?.[0];
  if (c?.finish_reason === 'length') throw new Error('truncated');
  const text = c?.message?.content ?? '';
  try {
    return JSON.parse(text);
  } catch {
    const m = text.match(/\{[\s\S]*\}/);
    if (m) {
      try {
        return JSON.parse(m[0]);
      } catch {}
    }
    throw new Error('unparseable');
  }
}

const ids = fs
  .readdirSync(BRAIN)
  .filter((d) => fs.existsSync(path.join(BRAIN, d, '.system_generated', 'logs', 'transcript_full.jsonl')))
  .slice(0, limit || undefined);

console.log(`[fragments] ${ids.length} conversations | model=${MODEL} | apply=${apply}`);
const offVoicePool = [];
const results = { generatedAt: new Date().toISOString(), model: MODEL, applied: apply, written: [], skipped: [], failed: [] };
const seenClaims = new Set();

for (const id of ids) {
  process.stdout.write(`  · ${id.slice(0, 8)} `);
  const conv = readConversation(id);
  if (!conv) {
    results.failed.push({ id, error: 'unreadable' });
    console.log('UNREADABLE');
    continue;
  }
  if (conv.sensitive) {
    results.skipped.push({ id, reason: 'sensitive artifact present' });
    console.log('SKIPPED (sensitive)');
    continue;
  }
  if (!conv.userInputs.length) {
    results.skipped.push({ id, reason: 'no usable user input' });
    console.log('SKIPPED (no user input)');
    continue;
  }

  const notes = conv.userInputs.map((t, i) => `[${i + 1}] ${t}`).join('\n\n');
  const withThinking = conv.thinking.length
    ? `\n\nASSISTANT REASONING (context only — do not distil the assistant's voice, only JD's own notes above):\n${conv.thinking.join('\n\n').slice(0, 6000)}`
    : '';

  let out;
  try {
    out = await call(`${notes}${withThinking}`);
  } catch (err) {
    results.failed.push({ id, error: err.message });
    console.log(`FAILED (${err.message})`);
    continue;
  }

  const frags = Array.isArray(out.fragments) ? out.fragments.slice(0, PER_CONVERSATION) : [];
  let kept = 0;
  const offVoice = [];
  const rejects = { short: 0, degenerate: 0, docVoice: 0, noFirstPerson: 0, assistantVoice: 0, dupe: 0 };
  for (const f of frags) {
    const title = String(f.title ?? '').replace(/[*_`#]/g, '').replace(/\s+/g, ' ').trim().slice(0, 70);
    const claim = String(f.claim ?? '').trim();
    if (!title || claim.split(' ').length < 12) {
      rejects.short += 1;
      continue;
    }
    const gate = degenerate(claim);
    if (!gate.ok) {
      rejects.degenerate += 1;
      continue;
    }
    if (DOC_VOICE.test(claim) || DOC_OPENING.test(claim.trim())) {
      rejects.docVoice += 1;
      continue;
    }
    if (!/\b(I|I'm|I've|I'd|I'll|my|me)\b/.test(claim)) {
      rejects.noFirstPerson += 1;
      offVoice.push({ title, claim, why: 'not first person', from: id });
      continue;
    }
    if (ASSISTANT_VOICE.test(claim)) {
      rejects.assistantVoice += 1;
      continue;
    }
    const key = claim.toLowerCase().replace(/[^a-z ]/g, '').split(' ').slice(0, 12).join(' ');
    if (seenClaims.has(key)) {
      rejects.dupe += 1;
      continue;
    }
    seenClaims.add(key);

    const slug = slugify(title, 55);
    const abs = path.join(OUT, `${slug}.md`);
    const tags = [...new Set((f.tags ?? []).map((t) => String(t).toLowerCase().replace(/^#/, '').replace(/[^a-z0-9-]/g, '')).filter(Boolean))].slice(0, 5);
    const data = sanitizeData('fragments', {
      title,
      description: claim.replace(/\s+/g, ' ').slice(0, 160),
      date: new Date().toISOString().slice(0, 10),
      tags: [...new Set([...tags, String(f.mechanism ?? 'open')])].slice(0, 6),
      source: `antigravity://${id}`,
      draft: false,
      mechanism: f.mechanism ?? 'open',
      signal: Math.max(1, Math.min(5, Number(f.signal) || 3)),
      from: id,
    });
    const body = `${claim}\n\n## Where this came from\n\nDistilled from working notes in Antigravity conversation \`${id.slice(0, 8)}\`. The raw note is stream-of-consciousness; this is the claim inside it.\n`;
    if (apply && !fs.existsSync(abs)) {
      fs.mkdirSync(OUT, { recursive: true });
      fs.writeFileSync(abs, serialize(data, body));
    }
    results.written.push({ id, slug, title, mechanism: f.mechanism, signal: f.signal, from: id });
    kept += 1;
  }
  const rej = Object.entries(rejects).filter(([, v]) => v > 0).map(([k, v]) => `${k}:${v}`).join(' ');
  offVoicePool.push(...offVoice);
  console.log(`${kept} fragments${rej ? `  [rejected ${rej}]` : ''}`);
}

// Repair pass: fragments rejected only for voice are worth one more attempt. They already
// passed the content gates, so the problem is register, not substance.
if (offVoicePool.length) {
  process.stdout.write(`\n[fragments] repairing ${offVoicePool.length} off-voice fragments ... `);
  let repaired = 0;
  for (let i = 0; i < offVoicePool.length; i += 8) {
    const batch = offVoicePool.slice(i, i + 8);
    let out;
    try {
      out = await call(
        [
          'Rewrite each of these in JD\'s first-person voice. Keep the substance and the specifics.',
          'He is a builder writing notes to himself. Every rewrite must contain "I" or "my".',
          'Never write documentation voice ("The X is used to") or assistant voice ("I will create",',
          '"Let me", "I recommend"). Do not add new facts. Do not change the mechanism.',
          '',
          ...batch.map((b, n) => `${n + 1}. ${b.claim}`),
        ].join('\n'),
        0.5,
      );
    } catch {
      continue;
    }
    const fixed = Array.isArray(out.fragments) ? out.fragments : [];
    fixed.forEach((f, idx) => {
      const src = batch[idx];
      if (!src) return;
      const claim = String(f.claim ?? '').trim();
      if (!claim || claim.split(' ').length < 12) return;
      if (DOC_VOICE.test(claim) || DOC_OPENING.test(claim.trim())) return;
      if (!/\b(I|I'm|I've|I'd|I'll|my|me)\b/.test(claim)) return;
      if (ASSISTANT_VOICE.test(claim)) return;
      const gate = degenerate(claim);
      if (!gate.ok) return;
      const slug = slugify(src.title, 55);
      const abs = path.join(OUT, `${slug}.md`);
      if (fs.existsSync(abs)) return;
      const data = sanitizeData('fragments', {
        title: src.title,
        description: claim.replace(/\s+/g, ' ').slice(0, 160),
        date: new Date().toISOString().slice(0, 10),
        tags: [...new Set([String(f.mechanism ?? 'open')])].slice(0, 6),
        source: `antigravity://${src.from}`,
        draft: false,
        mechanism: f.mechanism ?? 'open',
        signal: Math.max(1, Math.min(5, Number(f.signal) || 3)),
        from: src.from,
      });
      const body = `${claim}\n\n## Where this came from\n\nDistilled from working notes in Antigravity conversation \`${String(src.from).slice(0, 8)}\`. The raw note is stream-of-consciousness; this is the claim inside it.\n`;
      if (apply) {
        fs.mkdirSync(OUT, { recursive: true });
        fs.writeFileSync(abs, serialize(data, body));
      }
      results.written.push({ id: src.from, slug, title: src.title, mechanism: f.mechanism, signal: f.signal, from: src.from, repaired: true });
      repaired += 1;
    });
  }
  console.log(`${repaired} recovered`);
}

fs.writeFileSync(path.join(ROOT, 'reviews', 'FRAGMENTS.json'), `${JSON.stringify(results, null, 2)}\n`);
console.log(
  `\n[fragments] ${results.written.length} written, ${results.skipped.length} skipped, ${results.failed.length} failed`,
);
console.log('[fragments] wrote reviews/FRAGMENTS.json');
