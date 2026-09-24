import fs from 'node:fs';
import path from 'node:path';
import { sanitizeData, serialize, slugify } from './lib/staging.mjs';
import { degenerate } from './lib/quality.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const API = process.env.POLISH_API ?? 'http://localhost:18000/v1';
const MODEL = process.env.POLISH_MODEL ?? 'qwen3-4b';
const TIMEOUT = Number(process.env.POLISH_TIMEOUT_MS ?? 600000);
const MAX_TOKENS = Number(process.env.POLISH_MAX_TOKENS ?? 6144);
const argv = process.argv.slice(2);
const apply = argv.includes('--apply');
const minMembers = Number(process.env.SYNTH_MIN_MEMBERS ?? 8);

const CONTEXT = fs.readFileSync(path.join(ROOT, 'scripts', 'lib', 'creator-context.md'), 'utf8');
const themes = JSON.parse(fs.readFileSync(path.join(ROOT, 'reviews', 'THEMES.json'), 'utf8'));

const THEME_PLAN = {
  'odysseus-toolchain': { section: 'projects', title: 'Odysseus — the local-first agent toolchain', kind: 'A build-log hub for the personal AI stack: model routing, local inference, cloud GPU bursts, and the review tooling around them.' },
  'second-brain': { section: 'concepts', title: 'The second brain, and what it is actually for', kind: 'A concept hub: how the vault, the garden and the site relate, and what the note-taking is trying to become.' },
  openplotter: { section: 'projects', title: 'OpenPlotter — an open boat-monitoring platform', kind: 'A project hub pulling the hardware, the sim, the campaign and the data-visualisation work into one story.' },
  'the-machine': { section: 'projects', title: 'The Machine — a channel about how systems capture people', kind: 'A project hub for the video-essay channel: thesis, pillars, release plan and the publishing pipeline.' },
  'addiction-recovery': { section: 'papers', title: 'The tunnel and the way out', kind: 'A long-form paper hub about the using years, the losses, and what actually worked. Unsentimental, first person, no redemption arc imposed from outside.' },
  undertone: { section: 'projects', title: 'Undertone — a documentary project on algorithmic reach', kind: 'A project hub for the Undertone documentary work and the social-campaign experiments around it.' },
  makerspace: { section: 'concepts', title: 'Community compute and the resurrected third space', kind: 'A concept hub: the cooperative data-centre / makerspace vision, its precedents, and the governance problem nobody has solved.' },
  'music-hardware': { section: 'concepts', title: 'Open music hardware and the crowdfunding trap', kind: 'A concept hub on the market research and platform survey behind open-source music hardware.' },
  'family-capture': { section: 'papers', title: 'The pipeline that captured my father', kind: 'A paper hub on the self-help-to-extraction pipeline, written to be legible to the person inside it rather than to mock it.' },
  'hydration-station': { section: 'projects', title: 'Hydration Station — free water, community owned', kind: 'A project hub for the solar-powered water dispensers: the hardware, the economics, the campaign.' },
  'a-plain-of-jars': { section: 'projects', title: 'A Plain of Jars — the memoir', kind: 'A project hub for the graphic novel: structure, the deal terms, the release plan, the research.' },
  'mlm-truth': { section: 'projects', title: 'MLM Truth — an instrument, not an argument', kind: 'A project hub for the interactive tool and the data work behind it.' },
};

const SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    description: { type: 'string' },
    goal: { type: 'string' },
    outcome: { type: 'string' },
    tags: { type: 'array', items: { type: 'string' } },
    body: { type: 'string' },
    confidence: { type: 'number' },
  },
  required: ['title', 'description', 'goal', 'outcome', 'tags', 'body', 'confidence'],
};

const SYSTEM = `You are the editor-in-chief of "The Reluctant Capitalist". You are writing **synthesis
posts** — new pieces that gather scattered work into one legible thing.

${CONTEXT}

## What a synthesis post is

You are given a list of existing posts that all belong to one body of work. Your job is to write
the piece that should have existed all along: the one that says what this work *is*, what it is
*for*, and how the parts fit.

- Open with what the reader is looking at, concretely.
- Name the goal. Say what "working" looks like.
- Group the member posts into a narrative — several paragraphs explaining the arc, the current
  state, and what comes next. Refer to the work by name, not by link.
- Do NOT write a link list. The member index is appended automatically after your prose.
- Close with what is unresolved.

## Hard rules

- **Never invent a fact.** You cannot see the member posts' bodies. You may only use their titles,
  descriptions and the framing you are given. If you need a number, a date or a claim you were not
  given, leave it out.
- Write in the creator's voice: first person, plain, declarative, unsentimental, no hype, no emoji,
  no "excited to share", no bullet sludge.
- Markdown, headings start at \`##\`, no YAML frontmatter in the body.
- 700-1100 words. This is a real post, not an index.

Return only JSON with: title, description, goal, outcome, tags, body, confidence.`;

async function call(user) {
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
      temperature: 0.4,
      max_tokens: MAX_TOKENS,
      chat_template_kwargs: { enable_thinking: false },
      response_format: { type: 'json_schema', json_schema: { name: 'synth', strict: true, schema: SCHEMA } },
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

function memberIndex(theme) {
  const bySection = new Map();
  for (const m of theme.members) {
    if (!bySection.has(m.section)) bySection.set(m.section, []);
    bySection.get(m.section).push(m);
  }
  const order = ['projects', 'concepts', 'papers', 'blog', 'art', 'comics', 'design', 'goals', 'values', 'garden'];
  const sections = [...bySection.keys()].sort((a, b) => order.indexOf(a) - order.indexOf(b));
  const lines = ['## The work so far', ''];
  for (const section of sections) {
    const members = bySection.get(section).sort((a, b) => a.title.localeCompare(b.title));
    if (sections.length > 1) {
      lines.push(`### ${section} (${members.length})`, '');
    }
    for (const m of members) {
      lines.push(`- [${m.title.replace(/[[\]]/g, '')}](/${m.id}/)`);
    }
    lines.push('');
  }
  return lines.join('\n').trim();
}

const targets = themes.themes.filter((t) => t.count >= minMembers && THEME_PLAN[t.name]);
console.log(`[synth] ${targets.length} themes with >= ${minMembers} posts`);
const results = { generatedAt: new Date().toISOString(), model: MODEL, applied: apply, posts: [], failed: [] };

for (const theme of targets) {
  const plan = THEME_PLAN[theme.name];
  process.stdout.write(`  · ${theme.name} (${theme.count} posts) ... `);
  const listing = theme.members
    .slice(0, 60)
    .map((m) => `- ${m.id} :: ${m.title}`)
    .join('\n');
  const user = [
    `THEME: ${theme.name}`,
    `INTENDED ROLE: ${plan.kind}`,
    `SUGGESTED TITLE: ${plan.title}`,
    `MEMBER POSTS (${theme.count}, spread across ${theme.sections.join(', ')}):`,
    listing,
    '',
    'Write the synthesis post. Refer to this work by name in the prose. No link list — one is appended for you.',
  ].join('\n');

  let s;
  try {
    s = await call(user);
  } catch (err) {
    results.failed.push({ theme: theme.name, error: err.message });
    console.log(`FAILED (${err.message})`);
    continue;
  }

  const title = String(s.title ?? plan.title).replace(/[*_`#]/g, '').replace(/\s+/g, ' ').trim().slice(0, 110);
  const description = String(s.description ?? '').replace(/[*_`#]/g, '').replace(/\s+/g, ' ').trim().slice(0, 175);
  const tags = [...new Set((s.tags ?? []).map((t) => String(t).toLowerCase().replace(/^#/, '').replace(/\s+/g, '-').replace(/[^a-z0-9/_-]/g, '')).filter(Boolean))].slice(0, 6);
  const slug = slugify(title, 60);
  const dest = path.join(ROOT, 'src', 'content', plan.section, `${slug}.md`);

  const body = `${String(s.body ?? '').trim()}\n\n${memberIndex(theme)}`;

  const gate = degenerate(String(s.body ?? ''));
  if (!gate.ok) {
    results.failed.push({ theme: theme.name, error: `degenerate: ${gate.issues.join('; ')}` });
    console.log(`REJECTED (${gate.issues.join('; ')})`);
    continue;
  }

  const data = sanitizeData(plan.section, {
    title,
    description,
    date: new Date().toISOString().slice(0, 10),
    tags: [...new Set([...tags, 'synthesis', theme.name])].slice(0, 8),
    source: `synthesis://${theme.name}`,
    draft: false,
    clarity: 5,
    quality: 5,
  });
  if (plan.section === 'projects') {
    data.status = 'active';
    data.stage = 'research';
  }
  if (plan.section === 'concepts') data.status = 'developing';

  const out = serialize(data, body);
  if (apply && !fs.existsSync(dest)) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, out);
  }
  const links = (body.match(/\]\(\/[a-z]+\/[^)]+\)/g) ?? []).length;
  results.posts.push({ theme: theme.name, section: plan.section, slug, title, goal: s.goal, outcome: s.outcome, members: theme.count, linksEmitted: links, confidence: s.confidence });
  console.log(`${plan.section}/${slug} — ${links}/${theme.count} linked, ${body.split(/\s+/).length} words`);
}

const dataDir = path.join(ROOT, 'src', 'data');
if (apply) {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(path.join(dataDir, 'themes.json'), `${JSON.stringify(themes, null, 2)}\n`);
  fs.writeFileSync(path.join(ROOT, 'reviews', 'SYNTHESIS.json'), `${JSON.stringify(results, null, 2)}\n`);
  console.log('[synth] wrote src/data/themes.json + reviews/SYNTHESIS.json');
}
console.log(`[synth] ${results.posts.length} synthesis posts, ${results.failed.length} failed`);
