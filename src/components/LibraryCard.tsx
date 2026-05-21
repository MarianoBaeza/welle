'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Library } from '@/types';
import { WelleButton } from '@/components/ui/welle-button';

interface Props {
  library: Library;
  onHoverEnter?: () => void;
  onHoverLeave?: () => void;
}

export function LibraryCard({ library, onHoverEnter, onHoverLeave }: Props) {
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
          <WelleButton
            variant="outline-accent"
            accentColor={library.accentColor}
            onClick={(e) => e.stopPropagation()}
          >
            Buy Now — ${library.price}
          </WelleButton>
        </div>
      </div>
    </div>
  );
}
