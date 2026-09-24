const RAW_SECTIONS = /^(chat transcript|assets?|tool calls?|search results?|conversation|metadata|source data|import)\b/i;

export function repetition(body, n = 8) {
  const words = String(body).toLowerCase().match(/[a-z']+/g) ?? [];
  if (words.length < n * 3) return { worst: 1, repeated: 0, words: words.length };
  const grams = new Map();
  for (let i = 0; i <= words.length - n; i += 1) {
    const key = words.slice(i, i + n).join(' ');
    grams.set(key, (grams.get(key) ?? 0) + 1);
  }
  let worst = 1;
  let repeated = 0;
  for (const count of grams.values()) {
    if (count > worst) worst = count;
    if (count > 1) repeated += count - 1;
  }
  return { worst, repeated, words: words.length };
}

export function duplicateParagraphs(body) {
  const paras = String(body)
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter((p) => p.split(' ').length > 25);
  const seen = new Map();
  for (const p of paras) seen.set(p, (seen.get(p) ?? 0) + 1);
  return [...seen.values()].reduce((a, b) => a + b - 1, 0);
}

export function splitSections(body) {
  const out = { narrative: [], raw: [] };
  let bucket = 'narrative';
  for (const line of String(body).split('\n')) {
    const h = line.match(/^##\s+(.*)$/);
    if (h) {
      bucket = RAW_SECTIONS.test(h[1].trim()) ? 'raw' : 'narrative';
      continue;
    }
    out[bucket].push(line);
  }
  return { narrative: out.narrative.join('\n'), raw: out.raw.join('\n') };
}

export function proseOf(body) {
  return splitSections(body)
    .narrative.replace(/```[\s\S]*?```/g, ' ')
    .replace(/^#{1,6} .*$/gm, ' ')
    .split(/^## The work so far\s*$/m)[0];
}

const URL_RE = /https?:\/\/[^\s)<>"']+/g;
const MONEY_RE = /\$\s?[\d,]+(?:\.\d+)?/g;

export function facts(text) {
  const t = String(text);
  const urls = new Set(t.match(URL_RE) ?? []);
  const money = new Set(t.match(MONEY_RE) ?? []);
  const numbers = new Set((t.match(/(?<![\w.])\d[\d,]{2,}(?:\.\d+)?(?![\w])/g) ?? []).map((s) => s.replace(/[,\s]/g, '')));
  const proper = new Set(
    (t.match(/\b[A-Z][a-zA-Z0-9]{2,}(?:\s+[A-Z][a-zA-Z0-9]{2,})?/g) ?? []).map((s) => s.toLowerCase()),
  );
  return { urls, money, numbers, proper, total: urls.size + money.size + numbers.size + proper.size };
}

export function preservation(source, candidate) {
  const a = facts(source);
  const b = facts(candidate);
  if (a.total === 0) return 1;
  let kept = 0;
  for (const set of ['urls', 'money', 'numbers', 'proper']) {
    for (const item of a[set]) if (b[set].has(item)) kept += 1;
  }
  return kept / a.total;
}

const normalize = (s) =>
  String(s)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

function tokensOf(s) {
  return new Set(normalize(s).split(' ').filter((w) => w.length > 2));
}

function jaccard(a, b) {
  let shared = 0;
  for (const x of a) if (b.has(x)) shared += 1;
  return shared / (a.size + b.size - shared || 1);
}

export function dedupeSource(text, { threshold = 0.82 } = {}) {
  const out = [];
  const seenExact = new Set();
  const seenTokens = [];

  for (const rawBlock of String(text).split(/\n{2,}/)) {
    const block = rawBlock.trim();
    if (!block) continue;
    if (/^([-*+]\s|\|)/.test(block) || /^#{1,6}\s/.test(block)) {
      out.push(block);
      continue;
    }
    const sentences = block.match(/[^.!?\n]+[.!?]*/g) ?? [block];
    const keptSentences = [];
    for (const sentence of sentences) {
      const norm = normalize(sentence);
      if (!norm || norm.length < 12) {
        keptSentences.push(sentence);
        continue;
      }
      if (seenExact.has(norm)) continue;
      const tk = tokensOf(sentence);
      if (tk.size < 5) {
        keptSentences.push(sentence);
        continue;
      }
      let near = false;
      for (const prior of seenTokens) {
        if (jaccard(tk, prior) >= threshold) {
          near = true;
          break;
        }
      }
      if (near) continue;
      seenExact.add(norm);
      seenTokens.push(tk);
      keptSentences.push(sentence);
    }
    const rebuilt = keptSentences.join('').replace(/\s+/g, ' ').trim();
    if (rebuilt) out.push(rebuilt);
  }
  return out.join('\n\n');
}

export function factDigest(text, { maxChars = 7000 } = {}) {
  const cleaned = proseOnly(dedupeSource(text));
  const sentences = cleaned.match(/[^.!?\n]+[.!?]*/g) ?? [];
  const scored = [];
  const seen = new Set();
  for (const s of sentences) {
    const norm = normalize(s);
    if (!norm || seen.has(norm)) continue;
    seen.add(norm);
    const slashes = (s.match(/\//g) ?? []).length;
    const spaces = (s.match(/\s/g) ?? []).length;
    if (slashes > 2 || spaces < 4) continue;
    if (/^[\w./-]+\.(?:png|jpe?g|mp4|gguf|py|txt|json|whl|md)$/i.test(s.trim())) continue;
    const numbers = (s.match(/\d/g) ?? []).length;
    const propers = (s.match(/\b[A-Z][a-zA-Z0-9]{2,}/g) ?? []).length;
    if (numbers || propers >= 2 || s.length > 90) scored.push({ s: s.trim(), weight: numbers * 2 + propers });
  }
  scored.sort((a, b) => b.weight - a.weight);
  const picked = scored.slice(0, 60).map((x) => x.s);
  let out = picked.join(' ').replace(/\s+/g, ' ');
  if (out.length > maxChars) out = `${out.slice(0, maxChars)}…`;
  return out;
}

export function proseOnly(text) {
  return String(text)
    .replace(/```[\s\S]*?```/g, ' ')
    .split('\n')
    .filter((line) => {
      const t = line.trim();
      if (!t) return false;
      if (/^[|#>\-*+]{1,6}\s/.test(t)) return false;
      if (/^\|.*\|$/.test(t)) return false;
      if (/^[-=*_]{3,}$/.test(t)) return false;
      return true;
    })
    .join('\n');
}

export function degenerate(text, { minWords = 80 } = {}) {
  const source = proseOnly(text);
  const { worst, repeated, words } = repetition(source);
  const dupParas = duplicateParagraphs(source);
  const issues = [];
  if (words >= minWords && worst >= 3) issues.push(`8-gram loop x${worst}`);
  if (words >= minWords && repeated > Math.max(8, Math.round(words / 60))) issues.push(`${repeated} repeated 8-grams`);
  if (dupParas > 0) issues.push(`${dupParas} duplicate paragraph(s)`);
  return { ok: issues.length === 0, issues, worst, repeated, words };
}
