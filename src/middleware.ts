import { defineMiddleware } from 'astro:middleware';
import {
  StagingError,
  approveEntry,
  jobStatus,
  rejectEntry,
  saveEntry,
  startPolishJob,
  unpublishEntry,
} from '../scripts/lib/staging-actions.mjs';

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const handlers = {
  save: (p) => saveEntry(p),
  approve: (p) => approveEntry(p),
  unpublish: (p) => unpublishEntry(p),
  reject: (p) => rejectEntry(p),
  polish: (p) => startPolishJob(p),
  'polish-status': (p) => jobStatus(p.job),
};

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  if (!pathname.startsWith('/api/staging/')) return next();

  const action = pathname.slice('/api/staging/'.length);
  if (!import.meta.env.DEV) return json({ error: 'staging actions are dev-only' }, 403);

  if (action === 'polish-status') {
    if (context.request.method !== 'GET') return json({ error: 'use GET' }, 405);
    try {
      return json({ ok: true, job: jobStatus(context.url.searchParams.get('job')) });
    } catch (err) {
      return json({ error: err.message }, 400);
    }
  }

  if (context.request.method !== 'POST') return json({ error: 'use POST' }, 405);

  const handler = handlers[action];
  if (!handler) return json({ error: `unknown action: ${action}` }, 404);

  let payload = {};
  try {
    payload = await context.request.json();
  } catch {
    return json({ error: 'invalid JSON body' }, 400);
  }

  try {
    const result = handler(payload);
    return json({ ok: true, action, ...result });
  } catch (err) {
    if (err instanceof StagingError) return json({ error: err.message }, 400);
    return json({ error: err?.message ?? String(err) }, 500);
  }
});
