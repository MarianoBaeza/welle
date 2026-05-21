'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Bundle, Library } from '@/types';
import { libraries } from '@/data/products';
import { NavHeader } from './NavHeader';
import { Footer } from './Footer';
import { LibraryPlayer } from './LibraryPlayer';
import { WelleButton } from './ui/welle-button';
import { BackgroundGradient } from './ui/background-gradient';

interface Props {
  library: Library;
  bundle: Bundle;
}

export function LibraryPageClient({ library, bundle }: Props) {
  const [loading, setLoading] = useState(false);

  const checkout = async (priceId: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen text-white flex flex-col">
      <BackgroundGradient
        hoveredId={library.id}
        accents={[{ id: library.id, color: library.accentColor }]}
      />

      <NavHeader />

      {/* Page content */}
      <div className="flex-1 pt-24 pb-0 px-6 max-w-7xl mx-auto w-full">

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
            <div className="flex flex-wrap gap-2">
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
                className="text-7xl font-black leading-none"
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
              onClick={() => checkout(library.stripePriceId)}
              disabled={loading}
              className="w-full text-base py-4"
            >
              {loading ? 'Redirecting...' : `Buy Now — $${library.price}`}
            </WelleButton>
          </div>
        </section>

        {/* ── Bundle upsell ─────────────────────────────────────────── */}
        <section className="mt-6 rounded-2xl bg-zinc-900/60 backdrop-blur-sm border border-white/10 p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <p className="text-xl font-bold">Get all 3 libraries</p>
              <span className="text-xs font-black uppercase tracking-widest bg-white text-black px-2.5 py-1 rounded-full">Best Value</span>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-zinc-400 text-sm">ASMR · Content Creator · Cinematic — 475 sounds</p>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-right">
              <p className="text-sm text-zinc-500 line-through">$57</p>
              <p className="text-4xl font-black text-white">$39</p>
              <p className="text-sm text-green-400 font-semibold mt-0.5">Save $18 (31% off)</p>
            </div>
            <WelleButton
              variant="solid"
              accentColor={"white"}
              onClick={() => checkout(bundle.stripePriceId)}
              disabled={loading}
              className="text-base py-4 px-12"
            >
              Get the Bundle
            </WelleButton>
          </div>
        </section>

      </div>

      {/* ── Full-width CTA banner ──────────────────────────────────── */}
      <section className="mt-16 border-t border-zinc-800 w-full bg-zinc-900/90">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 flex items-center justify-between gap-6">
          <div>
            <p className="text-white text-2xl font-bold">
              Make your creativity heard.
            </p>
            <p className="text-zinc-400 text-sm mt-1">One-time purchase · Instant download · Yours forever</p>
          </div>
          <WelleButton
            variant="solid"
            accentColor={library.accentColor}
            onClick={() => checkout(library.stripePriceId)}
            disabled={loading}
            className="flex-none px-10 py-4 text-base"
          >
            Buy Now — ${library.price}
          </WelleButton>
        </div>
      </section>

      <Footer />
    </main>
  );
}
