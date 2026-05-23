'use client';

import { useRouter } from 'next/navigation';
import { Bundle } from '@/types';
import { WelleButton } from '@/components/ui/welle-button';

interface Props {
  bundle: Bundle;
  onBuy: () => void;
}

export function BundleCard({ bundle, onBuy }: Props) {
  const router = useRouter();

  return (
    <div
      className="group relative w-full h-[100svh] md:h-auto md:aspect-video md:max-h-[calc(100vh-5rem)] overflow-hidden bg-zinc-900 cursor-pointer"
      style={{
        backgroundImage: `url('${bundle.image}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onClick={() => router.push('/bundle')}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      {/* Mobile layout */}
      <div className="absolute inset-0 flex flex-col justify-center p-8 md:hidden">
        <div className="flex flex-col items-center text-center gap-5">
          <h2 className="text-4xl font-black text-white leading-none tracking-tight">
            {bundle.name}
          </h2>
          <div className="flex flex-col items-center gap-1">
            <span className="text-zinc-500 text-base line-through">${bundle.price + 18}</span>
            <span className="text-white text-7xl font-black leading-none">${bundle.price}</span>
          </div>
          <WelleButton accentColor="white" onClick={(e) => { e.stopPropagation(); onBuy(); }}>
            Get Bundle — ${bundle.price}
          </WelleButton>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="absolute inset-0 hidden md:flex flex-col justify-end p-10">
        <div className="flex items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 transition-transform duration-500 ease-out group-hover:-translate-y-4">
              <h2 className="text-5xl font-black text-white leading-none tracking-tight">
                {bundle.name}
              </h2>
              <p className="text-zinc-300 text-base mt-1">
                All 3 libraries. 475 sounds. One download.
              </p>
            </div>
            <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-out">
              <p className="max-w-md text-sm text-zinc-400 leading-relaxed overflow-hidden opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                ASMR stillness, cinematic gravity, content-ready energy — 475 sounds across every mood. One purchase. No subscriptions. Stop hunting for the right sound and start making the thing.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3 shrink-0">
            <span className="bg-white text-black text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full">
              Save $18
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-zinc-500 text-xl line-through">${bundle.price + 18}</span>
              <span className="text-white text-6xl font-black leading-none">${bundle.price}</span>
            </div>
            <WelleButton accentColor="white" onClick={(e) => { e.stopPropagation(); onBuy(); }}>
              Get Bundle — ${bundle.price}
            </WelleButton>
          </div>
        </div>
      </div>
    </div>
  );
}
