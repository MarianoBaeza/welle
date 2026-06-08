'use client';

import { useState } from 'react';
import { Library, Bundle } from '@/types';
import { LibraryCard } from '@/components/LibraryCard';
import { BundleCard } from '@/components/BundleCard';
import { BundleUpsell } from '@/components/BundleUpsell';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { PayPalModal } from '@/components/PayPalModal';

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

export function HomeClient({ libraries, bundle }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalProduct | null>(null);

  const accents = libraries.map((lib) => ({ id: lib.id, color: lib.accentColor }));

  return (
    <>
      <BackgroundGradient hoveredId={hoveredId} accents={accents} />

      <div className="md:max-w-7xl md:mx-auto md:pt-20 w-full md:px-6">
        <BundleCard
          bundle={bundle}
          onBuy={() => setModal({
            name: bundle.name,
            slug: 'bundle',
            price: bundle.price,
            type: 'bundle',
            description: bundle.description,
            soundCount: bundle.soundCount,
            tags: bundle.tags,
            accentColor: bundle.accentColor,
            image: bundle.image,
          })}
        />
      </div>

      <div className="md:max-w-7xl md:mx-auto md:px-6 md:py-12 w-full flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6 w-full">
          {libraries.map((library) => (
            <LibraryCard
              key={library.id}
              library={library}
              onHoverEnter={() => setHoveredId(library.id)}
              onHoverLeave={() => setHoveredId(null)}
              onBuy={() =>
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
                })
              }
            />
          ))}
        </div>
        <BundleUpsell
          bundle={bundle}
          onBuy={() => setModal({
            name: bundle.name,
            slug: 'bundle',
            price: bundle.price,
            type: 'bundle',
            description: bundle.description,
            soundCount: bundle.soundCount,
            tags: bundle.tags,
            accentColor: bundle.accentColor,
            image: bundle.image,
          })}
        />
      </div>

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
    </>
  );
}
