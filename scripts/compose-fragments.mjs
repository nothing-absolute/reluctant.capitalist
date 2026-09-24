import fs from 'node:fs';
import path from 'node:path';
import { splitDoc, serialize, sanitizeData, slugify } from './lib/staging.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const FRAG = path.join(ROOT, 'src', 'content', 'fragments');
const argv = process.argv.slice(2);
const apply = argv.includes('--apply');

const graph = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'data', 'fragment-graph.json'), 'utf8'));

// One post per mechanism that actually has fragments behind it. The post is the argument;
// the fragments are the evidence. This is the composition direction — fragments into posts —
// which is the inverse of the synthesis posts that gathered existing work.
const PLAN = {
  definition: {
    section: 'concepts',
    title: 'Someone else already decided what you are allowed to want',
    thesis:
      'Almost every system that captures a person does it by setting the definition first — the goal, ' +
      'the metric, the shape of a good day — and letting the rest fill in. The definition is the ' +
      'cheapest thing to control and the hardest to argue with, because by the time you notice it, ' +
      'it already sounds like your own idea.',
  },
  capture: {
    section: 'papers',
    title: 'The shape of being absorbed',
    thesis:
      'Capture does not feel like capture while it is happening. It feels like commitment, then ' +
      'expertise, then identity, and by the time you can name what happened you are inside it and ' +
      'calling it your own. Knowing the shape does not immunise you. It only lets you recognise it ' +
      'faster the next time.',
  },
  extraction: {
    section: 'papers',
    title: 'What the system actually takes',
    thesis:
      'Follow the value, not the pitch. The pitch tells you what you get; the value trace tells you ' +
      'what it costs and who pays. Most extraction is boring rather than villainous, which is ' +
      'exactly why it survives scrutiny.',
  },
  reach: {
    section: 'projects',
    title: 'Distribution is a design decision, not a growth hack',
    thesis:
      'How a thing gets seen is decided before a word is written. Choosing a distribution surface ' +
      'is choosing which constraints and which audiences you inherit. The reach strategy is part of ' +
      'the work, not a phase after it.',
  },
  legibility: {
    section: 'papers',
    title: 'Being understood is a separate problem from being right',
    thesis:
      'Correctness does not travel. A true thing stated in the wrong register, at the wrong length, ' +
      'for the wrong reader, does not land, and its author concludes the idea was bad. Most bad ' +
      'ideas are good ideas that failed to be legible.',
  },
  volume: {
    section: 'concepts',
    title: 'The loudest one wins, and that is the whole problem',
    thesis:
      'Volume is a strategy that works reliably and resets constantly. It is not a strategy about ' +
      'being right. Treating it as the latter is how people end up loud and certain and wrong.',
  },
  tooling: {
    section: 'projects',
    title: 'The instrument decides what you are able to think',
    thesis:
      'Every tool has a grain. What it makes easy becomes what you make, and what it makes awkward ' +
      'stops getting made at all. Choosing instruments is closer to choosing a vocabulary than it ' +
      'is to choosing a convenience.',
  },
  craft: {
    section: 'blog',
    title: 'Finishing is the part most of this work is about',
    thesis:
      'The interesting part of any build is the last ten percent, and the last ten percent is the ' +
      'part nobody watches. It is also the only part that turns an idea into an artifact you can ' +
      'be wrong about.',
  },
};

const frags = [];
for (const file of fs.readdirSync(FRAG).filter((f) => f.endsWith('.md') && !f.startsWith('_'))) {
  const abs = path.join(FRAG, file);
  const { data, body } = splitDoc(fs.readFileSync(abs, 'utf8'));
  const claim = body.split(/^## Connected fragments/m)[0].split(/^## Where this came from/m)[0].trim();
  frags.push({ slug: file.replace(/\.md$/, ''), id: `fragments/${file.replace(/\.md$/, '')}`, data, claim, mechanism: data.mechanism ?? 'open' });
}

const byMech = new Map();
for (const f of frags) {
  if (!byMech.has(f.mechanism)) byMech.set(f.mechanism, []);
  byMech.get(f.mechanism).push(f);
}

let written = 0;
for (const [mech, plan] of Object.entries(PLAN)) {
  const members = byMech.get(mech);
  if (!members?.length) continue;
  const slug = slugify(plan.title, 55);
  const abs = path.join(ROOT, 'src', 'content', plan.section, `${slug}.md`);
  if (fs.existsSync(abs)) {
    console.log(`  · ${mech} — ${plan.section}/${slug} exists, skipped`);
    continue;
  }

  const ordered = [...members].sort((a, b) => (b.data.signal ?? 3) - (a.data.signal ?? 3) || a.claim.length - b.claim.length);
  const lines = [`## The fragments`, '', `${members.length} pieces of this, pulled out of the raw working notes:`, ''];
  for (const m of ordered) {
    const excerpt = m.claim.replace(/\s+/g, ' ').replace(/[[\]]/g, '');
    lines.push(`- [${m.data.title}](/fragments/${m.slug}/) — ${excerpt.slice(0, 190)}${excerpt.length > 190 ? '…' : ''}`);
  }

  const body = `${plan.thesis}\n\n${lines.join('\n')}\n\n## Why this is a post and not just a pile\n\nEach of the above is a fragment because it stands alone and is worth reading alone. They are grouped here because they are the same force showing up in different rooms. The link graph does the rest — each fragment points at the ones it touches, and this post is one more node in it.\n`;

  const data = sanitizeData(plan.section, {
    title: plan.title,
    description: plan.thesis.slice(0, 165),
    date: new Date().toISOString().slice(0, 10),
    tags: [...new Set([mech, 'composition', 'fragments'])],
    source: `compose://${mech}`,
    draft: false,
    clarity: 4,
    quality: 4,
  });
  if (plan.section === 'concepts') data.status = 'developing';
  if (plan.section === 'projects') {
    data.status = 'concept';
    data.stage = 'idea';
  }

  if (apply) {
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, serialize(data, body));
  }
  written += 1;
  console.log(`  · ${mech} — ${plan.section}/${slug} (${members.length} fragments)`);
}

// Point fragments back at the composition post for their mechanism.
if (apply) {
  let back = 0;
  for (const [mech, plan] of Object.entries(PLAN)) {
    const members = byMech.get(mech);
    if (!members?.length) continue;
    const postSlug = slugify(plan.title, 55);
    if (!fs.existsSync(path.join(ROOT, 'src', 'content', plan.section, `${postSlug}.md`))) continue;
    for (const m of members) {
      const abs = path.join(FRAG, `${m.slug}.md`);
      if (!fs.existsSync(abs)) continue;
      const { data, body } = splitDoc(fs.readFileSync(abs, 'utf8'));
      const marker = '## Composed into';
      if (body.includes(marker)) continue;
      const next = `${body.trim()}\n\n${marker}\n\nPart of [${plan.title}](/${plan.section}/${postSlug}/) — the ${mech} argument, assembled.\n`;
      fs.writeFileSync(abs, serialize(data, next));
      back += 1;
    }
  }
  console.log(`  ${back} fragments linked back to their composition post`);
}

console.log(`[compose] ${written} posts ${apply ? 'written' : 'would write'} from ${frags.length} fragments`);
