'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Bundle, Library } from '@/types';
import { NavHeader } from './NavHeader';
import { Footer } from './Footer';
import { LibraryPlayer } from './LibraryPlayer';
import { WelleButton } from './ui/welle-button';
import { BackgroundGradient } from './ui/background-gradient';
import { PayPalModal } from './PayPalModal';
import { BundleUpsell } from './BundleUpsell';

interface Props {
  library: Library;
  bundle: Bundle;
}

type ModalProduct = {
  name: string;
  slug: string;
  price: number;
  type: 'library' | 'bundle';
  description?: string;
  soundCount?: number;
  tags?: string[];
  accentColor?: string;
  image?: string;
};

export function LibraryPageClient({ library, bundle }: Props) {
  const [modal, setModal] = useState<ModalProduct | null>(null);

  const openLibrary = () =>
    setModal({
      name: library.name,
      slug: library.slug,
      price: library.price,
      type: 'library',
      description: library.description,
      soundCount: library.soundCount,
      tags: library.tags,
      accentColor: library.accentColor,
      image: library.image,
    });

  const openBundle = () =>
    setModal({
      name: bundle.name,
      slug: 'bundle',
      price: bundle.price,
      type: 'bundle',
      description: bundle.description,
      soundCount: bundle.soundCount,
      tags: bundle.tags,
      accentColor: bundle.accentColor,
      image: bundle.image,
    });

  return (
    <main className="min-h-screen text-white flex flex-col">
      <BackgroundGradient
        hoveredId={library.id}
        accents={[{ id: library.id, color: library.accentColor }]}
      />

      <NavHeader />

      <div className="flex-1 pt-24 pb-0 px-6 max-w-7xl mx-auto w-full md:pt-20">

        {/* ── Banner ────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden p-4 md:p-6 grid grid-cols-1 md:grid-cols-[2fr_3fr_2fr] gap-5 md:gap-7">
          <Image
            src={library.image}
            alt=""
            fill
            className="object-cover"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-black/75" aria-hidden="true" />

          {/* Left: image + tags + description */}
          <div className="relative z-10 flex flex-col gap-3">
            <div className="relative aspect-square rounded-xl overflow-hidden">
              <Image src={library.image} alt={library.name} fill className="object-cover" />
            </div>
            <div className="flex flex-wrap gap-2 items-center justify-center md:justify-start">
              {library.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full border font-medium"
                  style={{ borderColor: library.accentColor + '66', color: library.accentColor }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">{library.description}</p>
          </div>

          {/* Center: player */}
          <div className="relative z-10 h-full flex-col items-center justify-center">
            <LibraryPlayer
              tracks={library.previewTracks}
              accentColor={library.accentColor}
              soundCount={library.soundCount}
            />
          </div>

          {/* Right: buy */}
          <div className="relative z-10 flex flex-col items-center justify-center gap-5 text-center">
            <div>
              <p className="text-zinc-300 text-sm font-medium uppercase tracking-widest mb-1">
                {library.soundCount} sounds
              </p>
              <p
                className="text-7xl font-semibold leading-none"
                style={{ color: library.accentColor }}
              >
                ${library.price}
              </p>
              <p className="text-zinc-300 text-sm mt-2 font-medium">One-time purchase</p>
              <p className="text-zinc-500 text-xs mt-0.5">Instant download · Yours forever</p>
            </div>
            <WelleButton
              variant="solid"
              accentColor={library.accentColor}
              onClick={openLibrary}
              className="w-full text-base py-4"
            >
              Buy Now — ${library.price}
            </WelleButton>
          </div>
        </section>

        <BundleUpsell bundle={bundle} onBuy={openBundle} className="mt-6" />

      </div>

      {/* ── Full-width CTA banner ──────────────────────────────────── */}
      <section className="mt-16 border-t border-zinc-800 w-full bg-zinc-900/90">
        <div className="flex max-w-7xl mx-auto px-6 md:px-12 py-12 flex-col sm:flex-row gap-6 items-center justify-between">
          <div>
            <p className="text-white text-2xl font-bold">
              Make your creativity heard.
            </p>
            <p className="text-zinc-400 text-sm mt-1">One-time purchase · Instant download · Yours forever</p>
          </div>
          <WelleButton
            variant="solid"
            accentColor={library.accentColor}
            onClick={openLibrary}
            className="flex-none px-10 py-4 text-base w-full sm:w-auto"
          >
            Buy Now — ${library.price}
          </WelleButton>
        </div>
      </section>

      <Footer />

      <PayPalModal
        isOpen={modal !== null}
        onClose={() => setModal(null)}
        productName={modal?.name ?? ''}
        productSlug={modal?.slug ?? ''}
        price={modal?.price ?? 0}
        type={modal?.type ?? 'library'}
        description={modal?.description}
        soundCount={modal?.soundCount}
        tags={modal?.tags}
        accentColor={modal?.accentColor}
        image={modal?.image}
      />
    </main>
  );
}
