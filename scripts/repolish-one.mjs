import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { contentPath, sanitizeData, serialize, splitDoc } from './lib/staging.mjs';

const exec = promisify(execFile);
const ROOT = path.resolve(import.meta.dirname, '..');

const argv = process.argv.slice(2);
const arg = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : undefined;
};

const section = arg('section');
const slug = arg('slug');
const jobId = arg('job');
const force = argv.includes('--force');

if (!section || !slug || !jobId) {
  console.error('[repolish] need --section, --slug and --job');
  process.exit(2);
}

const POD_ID = process.env.STAGING_POD_ID ?? 'cthe9i16afjw7q';
const POD_HOST = process.env.STAGING_POD_HOST ?? '193.183.22.55';
const POD_PORT = process.env.STAGING_POD_PORT ?? '1837';
const SSH_KEY = process.env.STAGING_SSH_KEY ?? `${process.env.HOME}/.ssh/id_ed25519`;
const MODEL = process.env.STAGING_MODEL ?? 'qwen3-4b';
const SERVE_PORT = 8000;

const jobsDir = path.join(ROOT, '.staging-jobs');
const statusFile = path.join(jobsDir, `${jobId}.json`);
const MAX_INPUT_CHARS = 20000;

let podTouched = false;
let cleanup = { state: 'starting', section, slug, jobId, startedAt: new Date().toISOString() };

function status(patch) {
  cleanup = { ...cleanup, ...patch, updatedAt: new Date().toISOString() };
  fs.mkdirSync(jobsDir, { recursive: true });
  fs.writeFileSync(statusFile, `${JSON.stringify(cleanup, null, 2)}\n`);
  console.log(`[repolish] ${cleanup.state}${cleanup.detail ? ` — ${cleanup.detail}` : ''}`);
}

function apiKey() {
  if (process.env.RUNPOD_API_KEY) return process.env.RUNPOD_API_KEY;
  const file = '/home/jd/.local/share/opencode/mcp-auth.json';
  if (fs.existsSync(file)) {
    return JSON.parse(fs.readFileSync(file, 'utf8')).runpod?.tokens?.accessToken ?? '';
  }
  return '';
}

const KEY = apiKey();
const CTL = path.join(process.env.HOME ?? '', '.local/bin/runpodctl');

async function pod(args, { allowFail = false } = {}) {
  if (!KEY) throw new Error('no RunPod API key available');
  try {
    const { stdout } = await exec(CTL, args, {
      env: { ...process.env, RUNPOD_API_KEY: KEY },
      maxBuffer: 32 * 1024 * 1024,
      timeout: 120000,
    });
    return stdout;
  } catch (err) {
    if (allowFail) return '';
    throw new Error(`runpodctl ${args.join(' ')} failed: ${err.stderr || err.message}`);
  }
}

async function podInfo() {
  const out = await pod(['pod', 'get', POD_ID, '-o', 'json'], { allowFail: true });
  if (!out.trim()) return null;
  try {
    return JSON.parse(out);
  } catch {
    return null;
  }
}

async function waitForPod(want, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  let last = 'unknown';
  while (Date.now() < deadline) {
    const info = await podInfo();
    const desired = info?.desiredStatus;
    last = desired ?? 'unknown';
    if (desired === want) return true;
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error(`pod ${POD_ID} did not reach ${want} (last: ${last})`);
}

function ssh(cmd, { timeout = 60000 } = {}) {
  return exec(
    'ssh',
    ['-i', SSH_KEY, '-p', POD_PORT, '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=10', `root@${POD_HOST}`, cmd],
    { timeout, maxBuffer: 32 * 1024 * 1024 },
  );
}

async function waitForServer(timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const { stdout } = await exec('curl', ['-sS', '--max-time', '5', `http://localhost:${SERVE_PORT}/v1/models`]);
      if (stdout.includes(MODEL)) return true;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 4000));
  }
  throw new Error('llama-server did not answer /v1/models in time');
}

const SYSTEM = `You are a blog-publishing assistant. You help turn an existing Obsidian note into a clean site post.

Given a note (YAML frontmatter + markdown body), reply with exactly ONE valid JSON object, no markdown fences, no commentary, with these keys:
- "reformatted": string — the body's markdown, normalized and copyedited. Rules:
  * Keep the author's meaning and every fact, date, and link; do not invent or drop content.
  * Remove Obsidian artifacts: [[wikilinks]] become plain text; ![[embeds]] and [[image.jpg|alt]] images are removed.
  * Strip template variables like {{...}} and horizontal rules.
  * Demote headings one level (an H1 becomes H2, etc.); body must not contain an H1 that equals the title.
  * Collapse runs of blank lines to a single blank line; trim leading/trailing whitespace.
  * Fix obvious grammar/spacing, but keep the author's voice and tone.
- "title": string — best title (<= 90 chars).
- "description": string — one-sentence summary (<= 180 chars).
- "tags": array of strings — <= 8 relevant tags, bare words (no #, no spaces).
- "scores": object with keys "clarity" and "quality", each an integer 0-5.
- "notes": string — 1-3 sentences of editorial review notes (strengths, what to fix).

Output only JSON.`;

const SCHEMA = {
  type: 'object',
  properties: {
    reformatted: { type: 'string' },
    title: { type: 'string' },
    description: { type: 'string' },
    tags: { type: 'array', items: { type: 'string' } },
    scores: {
      type: 'object',
      properties: {
        clarity: { type: 'integer', minimum: 0, maximum: 5 },
        quality: { type: 'integer', minimum: 0, maximum: 5 },
      },
      required: ['clarity', 'quality'],
    },
    notes: { type: 'string' },
  },
  required: ['reformatted', 'title', 'description', 'tags', 'scores', 'notes'],
};

function extractJSON(text) {
  const trimmed = (text || '').trim();
  const repaired = trimmed.replace(/\\([^"\\/bfnrtu])/g, '$1');
  for (const candidate of [trimmed, repaired]) {
    try {
      return JSON.parse(candidate);
    } catch {
      const m = candidate.match(/\{[\s\S]*\}/);
      if (m) {
        try {
          return JSON.parse(m[0]);
        } catch {
          /* try next */
        }
      }
    }
  }
  return null;
}

async function startPod() {
  const info = await podInfo();
  if (!info) throw new Error(`pod ${POD_ID} not found — set STAGING_POD_ID or create one`);
  if (info.desiredStatus === 'RUNNING') {
    podTouched = true;
    status({ state: 'pod-ready', detail: 'pod was already running' });
    return;
  }
  const attempts = Number(process.env.STAGING_POD_RETRIES ?? 3);
  let lastError = '';
  for (let attempt = 1; attempt <= attempts; attempt++) {
    status({ state: 'pod-starting', detail: `starting ${POD_ID} (attempt ${attempt}/${attempts})` });
    try {
      await pod(['pod', 'start', POD_ID]);
      podTouched = true;
      await waitForPod('RUNNING', 240000);
      status({ state: 'pod-running', detail: 'pod is up' });
      return;
    } catch (err) {
      lastError = err.message;
      if (/not enough free GPUs|host machine|server_error/i.test(err.message) && attempt < attempts) {
        status({ state: 'pod-retrying', detail: 'host has no free GPU right now; retrying shortly' });
        await new Promise((r) => setTimeout(r, 20000));
        continue;
      }
      throw err;
    }
  }
  throw new Error(lastError || 'could not start the pod');
}

async function startServer() {
  status({ state: 'server-starting', detail: 'booting llama-server' });
  await ssh(
    `pkill -x llama-server >/dev/null 2>&1; sleep 1; nohup /workspace/llama.cpp/build/bin/llama-server -m /workspace/Qwen_Qwen3-4B-Q4_K_M.gguf -c 32768 -t 8 -ngl 999 --alias ${MODEL} --host 0.0.0.0 --port ${SERVE_PORT} > /workspace/llama-server.log 2>&1 < /dev/null & disown; sleep 2; true`,
    { timeout: 30000 },
  ).catch(() => ({}));

  status({ state: 'server-loading', detail: 'waiting for the model to load' });
  await waitForServer(240000);
  status({ state: 'server-ready' });
}

function tunnel() {
  const port = process.env.STAGING_TUNNEL_PORT ?? '18000';
  return exec('bash', [
    '-lc',
    `pkill -f "ssh.*18[3]7.*-L ${port}" >/dev/null 2>&1; sleep 1; ssh -i ${SSH_KEY} -p ${POD_PORT} -o StrictHostKeyChecking=no -f -N -L ${port}:localhost:${SERVE_PORT} root@${POD_HOST}`,
  ]).catch(() => ({}));
}

let endpoint = null;

async function resolveEndpoint() {
  const external = process.env.STAGING_API;
  if (external) {
    status({ state: 'using-external-endpoint', detail: external });
    const { stdout } = await exec('curl', ['-sS', '--max-time', '8', `${external.replace(/\/$/, '')}/models`]).catch(() => ({ stdout: '' }));
    if (!stdout.includes(MODEL)) throw new Error(`STAGING_API ${external} did not return ${MODEL}`);
    endpoint = external.replace(/\/$/, '');
    return;
  }
  await startPod();
  await startServer();
  await tunnel();
  endpoint = `http://localhost:${process.env.STAGING_TUNNEL_PORT ?? 18000}/v1`;
}

async function runPolish(raw) {
  const { body } = splitDoc(raw);
  if (body.length > MAX_INPUT_CHARS && !force) {
    throw new Error(`body is ${body.length} chars, over the ${MAX_INPUT_CHARS} limit (use --force)`);
  }
  const maxTokens = Math.min(Math.max(1200, Math.ceil(body.length / 2.5) + 600), Number(process.env.STAGING_MAX_TOKENS ?? 16384));
  status({ state: 'generating', detail: `asking ${MODEL} (max_tokens ${maxTokens})` });

  const res = await fetch(`${endpoint}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(Number(process.env.STAGING_TIMEOUT_MS ?? 600000)),
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: `NOTE:\n${raw}` },
      ],
      temperature: 0.3,
      max_tokens: maxTokens,
      chat_template_kwargs: { enable_thinking: false },
      response_format: { type: 'json_schema', json_schema: { name: 'polished_note', strict: true, schema: SCHEMA } },
    }),
  });
  if (!res.ok) throw new Error(`llama-server HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const j = await res.json();
  const choice = j?.choices?.[0];
  if (choice?.finish_reason === 'length') throw new Error('the model ran out of output tokens — try a smaller file or raise STAGING_MAX_TOKENS');
  const sug = extractJSON(choice?.message?.content ?? '');
  if (!sug) throw new Error('the model did not return usable JSON');
  return sug;
}

async function main() {
  const abs = contentPath(ROOT, section, slug);
  if (!fs.existsSync(abs)) throw new Error(`no staged file for ${section}/${slug}`);
  const raw = fs.readFileSync(abs, 'utf8');

  await resolveEndpoint();
  const sug = await runPolish(raw);

  const { data, body } = splitDoc(raw);
  const clean = sanitizeData(section, {
    ...data,
    title: sug.title || data.title,
    description: sug.description || data.description,
    tags: Array.isArray(sug.tags) && sug.tags.length ? sug.tags : data.tags,
    clarity: sug.scores?.clarity ?? data.clarity,
    quality: sug.scores?.quality ?? data.quality,
  });
  clean.draft = data.draft === true;
  const output = serialize(clean, String(sug.reformatted ?? body));

  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '').replace('T', '-');
  const backupDir = path.join(ROOT, '.staging-backups', stamp);
  fs.mkdirSync(backupDir, { recursive: true });
  fs.copyFileSync(abs, path.join(backupDir, `${section}__${slug}.md`));
  fs.writeFileSync(abs, output);
  status({ state: 'done', detail: 'written; still a draft', scores: { clarity: clean.clarity, quality: clean.quality } });
}

try {
  await main();
  process.exitCode = 0;
} catch (err) {
  status({ state: 'failed', error: err?.message ?? String(err) });
  process.exitCode = 1;
} finally {
  try {
    exec('bash', ['-lc', 'pkill -f "ssh.*18[3]7.*-L 18000" >/dev/null 2>&1; true']);
  } catch {
    /* ignore */
  }
  if (podTouched) {
    try {
      status({ state: 'teardown', detail: `stopping ${POD_ID} so it stops billing` });
      await pod(['pod', 'stop', POD_ID], { allowFail: true });
      const info = await podInfo();
      status({ state: info?.desiredStatus === 'EXITED' ? 'done' : cleanup.state, detail: 'pod stopped', pod: info?.desiredStatus });
    } catch (err) {
      console.error(`[repolish] FAILED to stop pod ${POD_ID}: ${err.message}`);
      status({ state: 'failed', error: `pod ${POD_ID} may still be running and billing: ${err.message}` });
      process.exitCode = 1;
    }
  }
}
