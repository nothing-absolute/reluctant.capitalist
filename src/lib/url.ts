// Internal-link helper that survives a non-root `base` (GitHub Pages subpath).
// Locally BASE_URL is '/', so pageUrl() reduces to the plain path and nothing changes.
const BASE = ((import.meta.env.BASE_URL as string | undefined) ?? '/').replace(/\/$/, '');

export function pageUrl(path: string): string {
  const bare = path.startsWith('/') ? path : `/${path}`;
  return `${BASE}${bare}`;
}

// Strip the base prefix back off a URL's pathname (e.g. for the active-nav check).
export function localPath(path: string): string {
  if (!BASE) return path;
  return path.startsWith(`${BASE}/`) || path === BASE ? (path.slice(BASE.length) || '/') : path;
}