// Central site metadata. Edit this once and it flows everywhere.

export const SITE = {
  title: 'The Reluctant Capitalist',
  tagline: 'A polymath\u2019s field notes on ideas, craft, and the awkward business of selling them.',
  description:
    'Projects, papers, concepts, comics, goals and values from an independent maker who would rather build than sell — and is learning to do both. Includes a limited digital garden and a chat with custom models.',
  url: 'https://nothing-absolute.github.io/reluctant.capitalist/',
  author: 'JD',
  language: 'en',
};

export type SectionKey =
  | 'projects'
  | 'blog'
  | 'papers'
  | 'art'
  | 'comics'
  | 'concepts'
  | 'design'
  | 'goals'
  | 'values'
  | 'garden'
  | 'fragments';

export interface SectionMeta {
  key: SectionKey;
  title: string;
  blurb: string;
  collectionLabel: string;
}

// Order here controls nav order. Home cards use the same order.
export const SECTIONS: SectionMeta[] = [
  { key: 'projects', title: 'Projects', collectionLabel: 'Projects', blurb: 'Things I am building, have built, or abandoned with intent. Every one of these started as a seed.' },
  { key: 'blog', title: 'Journal', collectionLabel: 'Journal posts', blurb: 'Long-form writing: what I learned, what I changed my mind about, and what I got wrong.' },
  { key: 'concepts', title: 'Concepts', collectionLabel: 'Concepts', blurb: 'Unfinished ideas treated as first-class assets. Half of making things is deciding not to.' },
  { key: 'papers', title: 'Papers', collectionLabel: 'Papers & essays', blurb: 'Longer, more formal writing. Slow pieces, not hot takes.' },
  { key: 'garden', title: 'Digital Garden', collectionLabel: 'Garden notes', blurb: 'A limited, curated slice of my second brain. Never the whole vault — only the notes I want to keep in public.' },
  { key: 'art', title: 'Art', collectionLabel: 'Art', blurb: 'Visual work. Proof that not everything here is a business plan.' },
  { key: 'comics', title: 'Comics', collectionLabel: 'Comics', blurb: 'Sequential art, mostly about the gap between what I imagine and what ships.' },
  { key: 'design', title: 'Design', collectionLabel: 'Design', blurb: 'Systems, interfaces, and the obsessive details between the idea and the artifact.' },
  { key: 'goals', title: 'Goals', collectionLabel: 'Goals', blurb: 'Public commitments. Written down so they are harder to quietly abandon.' },
  { key: 'values', title: 'Values', collectionLabel: 'Values', blurb: 'The operating system underneath everything else. If a project violates these, it fails even if it ships.' },
  { key: 'fragments', title: 'Fragments', collectionLabel: 'Fragments', blurb: 'Atomic blocks distilled from raw working notes. One idea each, heavily cross-linked. Cheap to make, meant to be recombined — signal volume over depth.' },
];

export const SECTION_BY_KEY: Record<SectionKey, SectionMeta> = Object.fromEntries(
  SECTIONS.map((s) => [s.key, s]),
) as Record<SectionKey, SectionMeta>;
