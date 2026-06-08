'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Library } from '@/types';
import { WelleButton } from '@/components/ui/welle-button';

interface Props {
  library: Library;
  onHoverEnter?: () => void;
  onHoverLeave?: () => void;
  onBuy?: () => void;
}

export function LibraryCard({ library, onHoverEnter, onHoverLeave, onBuy }: Props) {
  const router = useRouter();

  return (
    <div
      className="group relative aspect-square overflow-hidden bg-zinc-900 transition-shadow duration-300 hover:shadow-lg cursor-pointer"
      onMouseEnter={onHoverEnter}
      onMouseLeave={onHoverLeave}
      onClick={() => router.push(`/library/${library.slug}`)}
    >
      <Image
        src={library.image}
        alt={library.name}
        loading='eager'
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-end gap-3 p-5">
        <h2 className="text-4xl font-semibold text-white leading-none tracking-tight">
          {library.name}
        </h2>
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-300 leading-snug">{library.tagline}</p>
          <p className="text-xs uppercase tracking-widest text-zinc-400">-</p>
          <span className="text-xs uppercase tracking-widest text-zinc-400">
            {library.soundCount} sounds
          </span>
        </div>

        <div className="flex items-center gap-3">
          <WelleButton
            variant="outline-accent"
            accentColor={library.accentColor}
            onClick={(e) => { e.stopPropagation(); onBuy?.(); }}
          >
            Buy Now — ${library.price}
          </WelleButton>
        </div>
      </div>
    </div>
  );
}
