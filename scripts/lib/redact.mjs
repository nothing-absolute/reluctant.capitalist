const RULES = [
  { name: 'email', re: /\b[\w.+-]+@[\w-]+\.[\w.-]{2,}\b/g, replacement: '[email redacted]' },
  { name: 'phone', re: /(?<!\d)(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}(?!\d)/g, replacement: '[phone redacted]' },
  { name: 'street-address', re: /\b\d{1,6}\s+[A-Z][\w.'-]*(?:\s+[A-Z][\w.'-]*){0,4}\s+(?:St|Street|Ave|Avenue|Rd|Road|Blvd|Boulevard|Dr|Drive|Ln|Lane|Way|Ct|Court|Pl|Place|Suite|Ste)\b\.?(?:[,\s]+(?:Ste|Suite|#)\s*\w+)?/gi, replacement: '[address redacted]' },
  { name: 'zip', re: /(\s[A-Z]{2})\s+\d{5}(?:-\d{4})?\b/g, replacement: '$1 [zip redacted]' },
  { name: 'zip-plus4', re: /\b\d{5}-\d{4}\b/g, replacement: '[zip redacted]' },
  { name: 'openai-key', re: /\bsk-[A-Za-z0-9_-]{16,}\b/g, replacement: '[secret redacted]' },
  { name: 'google-key', re: /\bAIza[0-9A-Za-z_-]{30,}\b/g, replacement: '[secret redacted]' },
  { name: 'github-token', re: /\bgh[pousr]_[A-Za-z0-9]{20,}\b/g, replacement: '[secret redacted]' },
  { name: 'aws-key', re: /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g, replacement: '[secret redacted]' },
  { name: 'bearer', re: /\bBearer\s+[A-Za-z0-9._~+/-]{20,}=*/g, replacement: 'Bearer [secret redacted]' },
  { name: 'assigned-secret', re: /\b((?:api[_-]?key|secret|password|passwd|token)\s*[:=]\s*)(?!\s*(?:["']?\$\{|["']?none|["']?null|["']?$))["']?[A-Za-z0-9._~+/-]{12,}["']?/gi, replacement: '$1[secret redacted]' },
];

export function redact(input) {
  const text = String(input ?? '');
  const counts = {};
  let out = text;
  for (const rule of RULES) {
    out = out.replace(rule.re, (...args) => {
      counts[rule.name] = (counts[rule.name] ?? 0) + 1;
      return rule.replacement.replace(/\$(\d)/g, (_, n) => args[Number(n)] ?? '');
    });
  }
  return { text: out, counts };
}

export function redactCounts(counts) {
  const entries = Object.entries(counts ?? {});
  if (!entries.length) return 'none';
  return entries.map(([k, v]) => `${k}×${v}`).join(', ');
}
