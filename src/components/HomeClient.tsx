'use client';

import { useState } from 'react';
import { Library, Bundle } from '@/types';
import { LibraryCard } from '@/components/LibraryCard';
import { BundleCard } from '@/components/BundleCard';
import { BackgroundGradient } from '@/components/ui/background-gradient';

interface Props {
  libraries: Library[];
  bundle: Bundle;
}

export function HomeClient({ libraries, bundle }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const accents = libraries.map((lib) => ({ id: lib.id, color: lib.accentColor }));

  return (
    <>
      <BackgroundGradient hoveredId={hoveredId} accents={accents} />

      <div className="max-w-7xl mx-auto px-6 pb-16 pt-20 flex flex-col gap-6 flex-1 w-full">
        <BundleCard bundle={bundle} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {libraries.map((library) => (
            <LibraryCard
              key={library.id}
              library={library}
              onHoverEnter={() => setHoveredId(library.id)}
              onHoverLeave={() => setHoveredId(null)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
