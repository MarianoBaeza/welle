'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Library } from '@/types';

interface Props {
  library: Library;
}

export function LibraryCard({ library }: Props) {
  return (
    <div className="group relative aspect-square overflow-hidden bg-zinc-900 transition-shadow duration-300 hover:shadow-lg">
      <Image
        src={library.image}
        alt={library.name}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-end gap-4 p-5">
        <h2 className="text-4xl font-black text-white leading-none tracking-tight">
          {library.name}
        </h2>

        <div className="flex gap-2 flex-wrap">
          {library.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs uppercase tracking-widest text-zinc-300 border border-zinc-600 px-2.5 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            disabled
            title="Preview coming soon"
            className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center border border-zinc-600 text-zinc-400 cursor-not-allowed"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-0.5">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>

          <Link
            href={`/library/${library.slug}`}
            style={
              {
                '--accent': library.accentColor,
                borderColor: library.accentColor,
              } as React.CSSProperties
            }
            className="flex-1 text-center py-2.5 rounded-lg text-sm font-bold uppercase tracking-widest border text-white hover:bg-[var(--accent)] hover:text-black transition-colors duration-200"
          >
            Buy Now — ${library.price}
          </Link>
        </div>
      </div>
    </div>
  );
}
