// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// https://astro.build/config
const base = process.env.PAGES_BASE ?? '/';

export default defineConfig({
  site: 'https://nothing-absolute.github.io/reluctant.capitalist/',
  base,
  integrations: [mdx()],
  // Fully static build (output defaults to static): dist/ serves anywhere.
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
});
