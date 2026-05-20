import { Bundle, Library } from '@/types';

export const libraries: Library[] = [
  {
    id: 'asmr',
    slug: 'asmr',
    name: 'ASMR',
    tagline: 'Immersive, relaxing sounds for your content',
    description:
      'A curated collection of high-quality ASMR sounds: tapping, textures, close-up foley, and atmospheric ambiences. Perfect for ASMR creators, relaxing streams, and aesthetic videos.',
    price: 19,
    stripePriceId: process.env.STRIPE_PRICE_ASMR ?? '',
    soundCount: 60,
    previewTracks: [],
    tags: ['ASMR', 'Relaxing', 'Aesthetic'],
    image: '/asmr.jpeg',
    accentColor: '#4ade80',
  },
  {
    id: 'content-creator',
    slug: 'content-creator',
    name: 'Content Creator',
    tagline: 'Every sound your edits need',
    description:
      'Risers, impacts, whooshes, glitches, and UI sounds — everything to make your TikToks, Reels, and Shorts hit harder. Designed for speed and maximum impact.',
    price: 19,
    stripePriceId: process.env.STRIPE_PRICE_CONTENT_CREATOR ?? '',
    soundCount: 80,
    previewTracks: [],
    tags: ['TikTok', 'Reels', 'Editing'],
    image: '/content-creator.jpg',
    accentColor: '#22d3ee',
  },
  {
    id: 'cinematic',
    slug: 'cinematic',
    name: 'Cinematic',
    tagline: 'Professional sound design for storytellers',
    description:
      'Deep atmospheres, tension builders, cinematic impacts, and emotional transitions. Elevate your vlogs, short films, and long-form content with a professional sound palette.',
    price: 19,
    stripePriceId: process.env.STRIPE_PRICE_CINEMATIC ?? '',
    soundCount: 70,
    previewTracks: [],
    tags: ['Cinematic', 'Vlogs', 'Film'],
    image: '/cinematic.png',
    accentColor: '#f59e0b',
  },
];

export const bundle: Bundle = {
  name: 'Complete Bundle',
  price: 39,
  stripePriceId: process.env.STRIPE_PRICE_BUNDLE ?? '',
  libraryIds: ['asmr', 'content-creator', 'cinematic'],
  image: '/bundle.png',
};

export function getLibraryBySlug(slug: string): Library | undefined {
  return libraries.find((lib) => lib.slug === slug);
}
