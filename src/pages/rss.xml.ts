import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../consts';
import { pageUrl } from '../lib/url';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const items = [];
  const keys = ['blog', 'projects', 'papers', 'concepts', 'garden'] as const;
  for (const key of keys) {
    const entries = await getCollection(key, ({ data }) => !('draft' in data && data.draft));
    for (const entry of entries) {
      const d = entry.data as any;
      if (!d.date) continue;
      items.push({
        title: d.title,
        description: d.description ?? '',
        pubDate: d.date,
        link: pageUrl(`/${key}/${entry.id.replace(/\.(md|mdx)$/, '')}/`),
      });
    }
  }
  items.sort((a, b) => (b.pubDate as any) - (a.pubDate as any));
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items,
    customData: `<language>${SITE.language}</language>`,
  });
}
