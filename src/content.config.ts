import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const common = {
  title: z.string().describe('Short, human title.'),
  description: z.string().optional().describe('One-line summary shown on cards.'),
  date: z.coerce.date().optional().describe('ISO date (YYYY-MM-DD). Newest first.'),
  tags: z.array(z.string()).default([]),
  source: z.string().optional().describe('Origin: vault path, opencode session, or antigravity artifact.'),
  draft: z.boolean().default(false).describe('Pending review: excluded from pages, indexes and RSS until approved.'),
  clarity: z.number().optional().describe('LLM review score, 0-5.'),
  quality: z.number().optional().describe('LLM review score, 0-5.'),
};

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    ...common,
    status: z
      .enum(['seed', 'concept', 'prototype', 'active', 'paused', 'shipped', 'killed'])
      .default('seed')
      .describe('Lifecycle stage of the project.'),
    stage: z
      .enum(['idea', 'research', 'mock', 'mvp', 'product', 'retired'])
      .default('idea'),
    stack: z.array(z.string()).default([]),
    repo: z.string().url().optional(),
    url: z.string().url().optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({ ...common }),
});

const papers = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/papers' }),
  schema: z.object({
    ...common,
    type: z.enum(['essay', 'paper', 'letter', 'notes']).default('essay'),
  }),
});

const art = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/art' }),
  schema: z.object({
    ...common,
    medium: z.string().default('mixed'),
  }),
});

const comics = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/comics' }),
  schema: z.object({
    ...common,
    series: z.string().optional(),
  }),
});

const concepts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/concepts' }),
  schema: z.object({
    ...common,
    status: z.enum(['seed', 'developing', 'relayed', 'shelved']).default('seed'),
  }),
});

const design = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/design' }),
  schema: z.object({
    ...common,
    discipline: z.string().default('general'),
  }),
});

const goals = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/goals' }),
  schema: z.object({
    ...common,
    status: z.enum(['active', 'done', 'stalled', 'dropped']).default('active'),
    target: z.coerce.date().optional().describe('Planned completion date.'),
  }),
});

const values = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/values' }),
  schema: z.object({
    ...common,
    weight: z.number().default(1).describe('Ordering weight, high = listed first.'),
  }),
});

// Notes copied from the Obsidian vault by scripts/sync-garden.mjs.
// This is the "limited second brain" — a curated subset, never the whole vault.
const garden = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/garden' }),
  schema: z.object({
    ...common,
    vault: z.boolean().default(true).describe('True when a note originated in the vault.'),
  }),
});

export const collections = {
  projects,
  blog,
  papers,
  art,
  comics,
  concepts,
  design,
  goals,
  values,
  garden,
};
