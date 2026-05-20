export interface Library {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  stripePriceId: string;
  soundCount: number;
  previewTracks: PreviewTrack[];
  tags: string[];
  image: string;
  accentColor: string;
}

export interface PreviewTrack {
  name: string;
  file: string;
}

export interface Bundle {
  name: string;
  price: number;
  stripePriceId: string;
  libraryIds: string[];
  image: string;
}
