'use client';

import Image from 'next/image';
import { Bundle } from '@/types';
import { WelleButton } from '@/components/ui/welle-button';

interface Props {
  bundle: Bundle;
}

export function BundleCard({ bundle }: Props) {
  function handleBuy() {
    // TODO: trigger Stripe checkout
  }

  return (
    <div
      className="group relative aspect-video max-h-[calc(100vh-5rem)] overflow-hidden bg-zinc-900 cursor-pointer"
      onClick={handleBuy}
    >
      <Image
        src={bundle.image}
        alt={bundle.name}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="100vw"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
        <div className="flex items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 transition-transform duration-500 ease-out group-hover:-translate-y-4">
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
            <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-out">
              <p className="max-w-md text-sm text-zinc-400 leading-relaxed overflow-hidden opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                475 sounds spanning every mood and energy. ASMR stillness, cinematic gravity, content-ready chaos — all in a single download. Stop hunting for the right sound. Start creating.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-zinc-500 text-xs uppercase tracking-widest">Total price</span>
              <span className="text-zinc-400 text-sm line-through">$57</span>
            </div>
            <WelleButton accentColor="white" onClick={(e) => { e.stopPropagation(); handleBuy(); }}>
              Get Bundle — ${bundle.price}
            </WelleButton>
          </div>
        </div>
      </div>
    </div>
  );
}
