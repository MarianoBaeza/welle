'use client';

import Image from 'next/image';
import { Bundle } from '@/types';

interface Props {
  bundle: Bundle;
}

function Waveform() {
  const bars = [4, 9, 6, 14, 8, 16, 10, 7, 13, 5, 11, 9, 15, 6, 12, 8, 14, 5, 10, 7];
  return (
    <svg viewBox="0 0 104 20" className="w-28 h-5" aria-hidden>
      {bars.map((h, i) => (
        <rect
          key={i}
          x={i * 5 + 1}
          y={(20 - h) / 2}
          width={3}
          height={h}
          rx={1}
          className="fill-zinc-600"
        />
      ))}
    </svg>
  );
}

export function BundleCard({ bundle }: Props) {
  return (
    <div className="group relative aspect-video overflow-hidden bg-zinc-900 ">
      <Image
        src={bundle.image}
        alt={bundle.name}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="100vw"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-end gap-5 p-8 md:p-10">
        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
            Best Value
          </span>
          <h2 className="text-5xl font-black text-white leading-none tracking-tight">
            {bundle.name}
          </h2>
          <p className="text-zinc-300 text-base mt-1">
            All 3 libraries. Every sound you need, in one bundle.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              disabled
              title="Preview coming soon"
              className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center border border-zinc-600 text-zinc-500 cursor-not-allowed"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-0.5">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <Waveform />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            disabled
            className="flex-1 md:flex-none md:px-10 py-3.5 rounded-xl text-sm font-black uppercase tracking-widest bg-white text-black cursor-not-allowed opacity-90 hover:opacity-100 transition-opacity"
          >
            Get Bundle — ${bundle.price}
          </button>
          <span className="text-zinc-400 text-sm line-through">$57</span>
        </div>
      </div>
    </div>
  );
}
