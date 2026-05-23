'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Bundle, Library } from '@/types';
import { NavHeader } from './NavHeader';
import { Footer } from './Footer';
import { LibraryPlayer } from './LibraryPlayer';
import { LibraryCard } from './LibraryCard';
import { BackgroundGradient } from './ui/background-gradient';
import { PayPalModal } from './PayPalModal';
import { WelleButton } from './ui/welle-button';

interface Props {
  libraries: Library[];
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

export function BundlePageClient({ libraries, bundle }: Props) {
  const [modal, setModal] = useState<ModalProduct | null>(null);
  const [currentAccent, setCurrentAccent] = useState(bundle.accentColor ?? '#ffffff');

  const bundleTracks = useMemo(
    () =>
      libraries.flatMap((lib) =>
        lib.previewTracks.slice(0, 2).map((t) => ({
          ...t,
          category: lib.name,
          accentColor: lib.accentColor,
        }))
      ),
    [libraries]
  );

  const openBundle = () =>
    setModal({
      name: bundle.name,
      slug: 'bundle',
      price: bundle.price,
      type: 'bundle',
      description: bundle.description,
      soundCount: bundle.soundCount,
      tags: bundle.tags,
      image: bundle.image,
    });

  const openLibrary = (lib: Library) =>
    setModal({
      name: lib.name,
      slug: lib.slug,
      price: lib.price,
      type: 'library',
      description: lib.description,
      soundCount: lib.soundCount,
      tags: lib.tags,
      accentColor: lib.accentColor,
      image: lib.image,
    });

  return (
    <main className="min-h-screen text-white flex flex-col">
      <BackgroundGradient hoveredId="bundle" accents={[{ id: 'bundle', color: currentAccent }]} />

      <NavHeader />

      <div className="flex-1 pt-24 pb-0 px-6 max-w-7xl mx-auto w-full">

        {/* ── Banner ────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden p-4 md:p-6 grid grid-cols-1 md:grid-cols-[2fr_3fr_2fr] gap-5 md:gap-7">
          <Image
            src={bundle.image}
            alt=""
            fill
            className="object-cover"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-black/75" aria-hidden="true" />

          {/* Left: image + tags + description */}
          <div className="relative z-10 flex flex-col gap-3">
            <div className="relative aspect-square rounded-xl overflow-hidden">
              <Image src={bundle.image} alt={bundle.name} fill className="object-cover" />
            </div>
            <div className="flex flex-wrap gap-2 items-center justify-center md:justify-start">
              {bundle.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full border font-medium transition-colors duration-500"
                  style={{ borderColor: currentAccent + '66', color: currentAccent }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">{bundle.description}</p>
          </div>

          {/* Center: player */}
          <div className="relative z-10 h-full flex-col items-center justify-center">
            <LibraryPlayer
              tracks={bundleTracks}
              accentColor={currentAccent}
              soundCount={bundle.soundCount}
              onAccentChange={setCurrentAccent}
            />
          </div>

          {/* Right: buy */}
          <div className="relative z-10 flex flex-col items-center justify-center gap-5 text-center">
            <div>
              <p className="text-zinc-300 text-sm font-medium uppercase tracking-widest mb-1">
                {bundle.soundCount} sounds
              </p>
              <div className="flex flex-col items-center">
                <span className="text-zinc-500 text-lg line-through">${bundle.price + 18}</span>
                <p
                  className="text-7xl font-black leading-none transition-colors duration-500"
                  style={{ color: currentAccent }}
                >
                  ${bundle.price}
                </p>
              </div>
              <p className="text-zinc-300 text-sm mt-2 font-medium">One-time purchase</p>
              <p className="text-zinc-500 text-xs mt-0.5">Instant download · Yours forever</p>
            </div>
            <WelleButton
              variant="solid"
              accentColor={currentAccent}
              onClick={openBundle}
              className="w-full text-base py-4"
            >
              Get Bundle — ${bundle.price}
            </WelleButton>
          </div>
        </section>

        {/* Library cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {libraries.map((lib) => (
            <LibraryCard
              key={lib.id}
              library={lib}
              onBuy={() => openLibrary(lib)}
            />
          ))}
        </div>

      </div>

      {/* ── Full-width CTA banner ──────────────────────────────────── */}
      <section className="mt-16 border-t border-zinc-800 w-full bg-zinc-900/90">
        <div className="flex max-w-7xl mx-auto px-6 md:px-12 py-12 flex-col sm:flex-row gap-6 items-center justify-between">
          <div>
            <p className="text-white text-2xl font-bold">
              All three moods. One download.
            </p>
            <p className="text-zinc-400 text-sm mt-1">One-time purchase · Instant download · Yours forever</p>
          </div>
          <WelleButton
            variant="solid"
            accentColor={currentAccent}
            onClick={openBundle}
            className="flex-none px-10 py-4 text-base w-full sm:w-auto"
          >
            Get Bundle — ${bundle.price}
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
