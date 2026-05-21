import { Bundle, Library } from '@/types';

export const libraries: Library[] = [
  {
    id: 'asmr',
    slug: 'asmr',
    name: 'ASMR',
    tagline: 'Stillness your audience will feel.',
    description:
      'Tapping, textures, foley, rain, kalimba, ethereal tones — 162 sounds curated for creators who want their content to breathe. Perfect for ASMR channels, aesthetic edits, and relaxing streams.',
    price: 19,
    stripePriceId: process.env.STRIPE_PRICE_ASMR ?? '',
    soundCount: 162,
    previewTracks: [
      { name: 'Forest Ambience', file: '/previews/asmr/forest-ambience.mp3', category: 'Nature' },
      { name: 'Rain Ambience', file: '/previews/asmr/rain-ambience.mp3', category: 'Nature' },
      { name: 'Ethereal Ambience', file: '/previews/asmr/ethereal-ambience.mp3', category: 'Ethereal' },
      { name: 'Kalimba', file: '/previews/asmr/kalimba.mp3', category: 'Instruments' },
      { name: 'Page Turning', file: '/previews/asmr/page-turning.mp3', category: 'Foley' },
      { name: 'Clicking', file: '/previews/asmr/clicking.mp3', category: 'Foley' },
      { name: 'Soundscape', file: '/previews/asmr/soundscape.mp3', category: 'Relaxing' },
    ],
    tags: ['ASMR', 'Relaxing', 'Aesthetic'],
    image: '/asmr.jpeg',
    accentColor: '#4ade80',
  },
  {
    id: 'content-creator',
    slug: 'content-creator',
    name: 'Content Creator',
    tagline: 'Every cut lands harder.',
    description:
      'Impacts, risers, whooshes, glitches, and UI sounds built for the speed of the feed. 123 sounds that make your TikToks, Reels, and Shorts hit the way they should.',
    price: 19,
    stripePriceId: process.env.STRIPE_PRICE_CONTENT_CREATOR ?? '',
    soundCount: 123,
    previewTracks: [
      { name: 'Movie Trailer Impact', file: '/previews/content-creator/movie-trailer-impact.mp3', category: 'Impacts' },
      { name: 'Deep Impact', file: '/previews/content-creator/deep-impact.mp3', category: 'Impacts' },
      { name: 'Sweep Up', file: '/previews/content-creator/sweep-up.mp3', category: 'Transitions' },
      { name: 'Zip Transition', file: '/previews/content-creator/zip-transition.mp3', category: 'Transitions' },
      { name: 'Success Notification', file: '/previews/content-creator/success-notification.mp3', category: 'SFX' },
      { name: 'Retro Game', file: '/previews/content-creator/retro-game.mp3', category: 'SFX' },
      { name: 'Adventure Jingle', file: '/previews/content-creator/adventure-jingle.mp3', category: 'Music' },
      { name: 'Chill Trap', file: '/previews/content-creator/chill-trap.mp3', category: 'Music' },
    ],
    tags: ['TikTok', 'Reels', 'Editing'],
    image: '/content-creator.jpg',
    accentColor: '#22d3ee',
  },
  {
    id: 'cinematic',
    slug: 'cinematic',
    name: 'Cinematic',
    tagline: 'Sound that gives your stories weight.',
    description:
      'Deep atmospheres, tension builders, cinematic impacts, and emotional transitions. 190 sounds to make your vlogs, short films, and long-form content feel like they mean something.',
    price: 19,
    stripePriceId: process.env.STRIPE_PRICE_CINEMATIC ?? '',
    soundCount: 190,
    previewTracks: [
      { name: 'Horror Ambience', file: '/previews/cinematic/horror-ambience.mp3', category: 'Ambience' },
      { name: 'Nature Melodic', file: '/previews/cinematic/nature-melodic.mp3', category: 'Ambience' },
      { name: 'Fire Ambience', file: '/previews/cinematic/fire-ambience.mp3', category: 'Ambience' },
      { name: 'Classic Movie Trailer', file: '/previews/cinematic/movie-trailer-impact.mp3', category: 'Impacts' },
      { name: 'Deep Sub Drop', file: '/previews/cinematic/deep-sub-drop.mp3', category: 'Impacts' },
      { name: 'Haunted Choir Riser', file: '/previews/cinematic/haunted-choir-riser.mp3', category: 'Risers' },
      { name: 'Cinematic Drum Break', file: '/previews/cinematic/cinematic-drum-break.mp3', category: 'Drums' },
    ],
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
  image: '/bundle.jpg',
};

export function getLibraryBySlug(slug: string): Library | undefined {
  return libraries.find((lib) => lib.slug === slug);
}
