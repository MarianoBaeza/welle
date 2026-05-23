export interface Library {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  soundCount: number;
  previewTracks: PreviewTrack[];
  tags: string[];
  image: string;
  accentColor: string;
}

export interface PreviewTrack {
  name: string;
  file: string;
  category: string;
  accentColor?: string;
}

export interface Bundle {
  name: string;
  tagline: string;
  description: string;
  price: number;
  soundCount: number;
  tags: string[];
  libraryIds: string[];
  image: string;
  accentColor?: string;
}
