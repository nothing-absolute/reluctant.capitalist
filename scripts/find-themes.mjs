import fs from 'node:fs';
import path from 'node:path';
import { splitDoc } from './lib/staging.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const CONTENT = path.join(ROOT, 'src', 'content');
const SECTIONS = ['projects', 'blog', 'papers', 'art', 'comics', 'concepts', 'design', 'goals', 'values', 'garden'];

const STOP = new Set(
  `the a an and or of to in on for is it with that this my i was at as be but not you we so do if from by are have
   me he she they them his her our your what which who when where why how all any both each few more most other some
   such no nor only own same than too very can will just should now one two three get got make made use used using new
   also would could may might must via etc per out up down about into over under again further once here there when
   build building create creating plan plans project projects guide using based`.split(/\s+/),
);

const SEED_TERMS = {
  'the-machine': ['video essay', 'youtube', 'channel', 'campaign', 'kickstarter', 'thumbnail', 'audience', 'subscriber', 'cms', 'monetiz'],
  'a-plain-of-jars': ['plain of jars', 'sioux falls', 'ska', 'saddle creek', 'memoir', 'graphic novel', 'narrative', 'comic', 'panel', 'volume'],
  'openplotter': ['boat', 'monitor', 'openplotter', 'fishing', 'nmea', 'sim', 'telemetry', 'passage', 'plotted'],
  'undertone': ['undertone', 'instagram', 'algorithm', 'mind control', 'thumbnail', 'reach', 'viral'],
  'mlm-truth': ['mlm', 'distributor', 'recruit', 'downline', 'unilevel', 'network marketing', 'quicksand', 'pyramid', 'rescue tool'],
  'second-brain': ['obsidian', 'vault', 'note', 'zettel', 'garden', 'capture', 'PARA', 'second brain', 'linked thought'],
  'odysseus-toolchain': ['odysseus', 'opencode', 'omniroute', 'pipeline', 'ollama', 'runpod', 'llama', 'agent', 'model'],
  'makerspace': ['makerspace', 'hackspace', 'data center', 'community', 'cooperative', 'solarpunk', 'earthship', 'dead mall', 'precious plastic'],
  'family-capture': ['mlm', 'the secret', 'nlp', 'toastmasters', 'dad', 'father', 'prosperity', 'mindset', 'affiliate'],
  'addiction-recovery': ['overdose', 'oxy', 'heroin', 'suboxone', 'rehab', '12 step', 'sobriety', 'using', 'clean'],
  'hydration-station': ['hydration', 'water', 'solar', 'vending', 'dispenser', 'nonprofit', 'kiosk'],
  'music-hardware': ['synthesizer', 'midi', 'pedal', 'daisy', 'teensy', 'music hardware', 'kickstarter hardware'],
};

function tokens(text) {
  return new Set(
    String(text)
      .toLowerCase()
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/https?:\/\/\S+/g, ' ')
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3 && !STOP.has(w)),
  );
}

const posts = [];
for (const section of SECTIONS) {
  const dir = path.join(CONTENT, section);
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const abs = path.join(dir, file);
    const raw = fs.readFileSync(abs, 'utf8');
    if (/^draft:\s*true\s*$/m.test(raw)) continue;
    const { data, body } = splitDoc(raw);
    const prose = body.replace(/```[\s\S]*?```/g, ' ').replace(/^#+ .*$/gm, ' ').slice(0, 4000);
    posts.push({
      id: `${section}/${file.replace(/\.md$/, '')}`,
      section,
      slug: file.replace(/\.md$/, ''),
      title: String(data.title ?? file),
      description: String(data.description ?? ''),
      body,
      titleTokens: tokens(`${data.title ?? ''} ${data.title ?? ''} ${data.description ?? ''}`),
      bodyTokens: tokens(prose),
    });
  }
}

const themes = [];
for (const [name, terms] of Object.entries(SEED_TERMS)) {
  const members = [];
  for (const p of posts) {
    const all = new Set([...p.titleTokens, ...p.bodyTokens]);
    const hits = terms.filter((t) => all.has(t) || p.body.toLowerCase().includes(t)).length;
    const ratio = hits / terms.length;
    if (ratio >= 0.22) members.push({ ...p, score: Number(ratio.toFixed(2)) });
  }
  members.sort((a, b) => b.score - a.score);
  const sections = new Set(members.map((m) => m.section));
  themes.push({
    name,
    terms,
    count: members.length,
    sections: [...sections],
    spread: sections.size,
    members: members.map((m) => ({ id: m.id, title: m.title, section: m.section, score: m.score })),
  });
}

themes.sort((a, b) => b.count - a.count);
const out = { generatedAt: new Date().toISOString(), totalPosts: posts.length, themes };
fs.writeFileSync(path.join(ROOT, 'reviews', 'THEMES.json'), `${JSON.stringify(out, null, 2)}\n`);

console.log(`[themes] ${posts.length} posts, ${themes.length} candidate themes\n`);
for (const t of themes) {
  const bar = '█'.repeat(Math.min(30, t.count));
  console.log(`  ${t.name.padEnd(20)} ${String(t.count).padStart(3)} posts  ${t.spread} sections  ${bar}`);
}
const unthemed = posts.filter((p) => !themes.some((t) => t.members.some((m) => m.id === p.id)));
console.log(`\n  posts in no theme: ${unthemed.length}`);
console.log('[themes] wrote reviews/THEMES.json');
