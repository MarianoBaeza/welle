'use client';

import { Bundle } from '@/types';
import { WelleButton } from './ui/welle-button';

interface Props {
  bundle: Bundle;
  onBuy: () => void;
  className?: string;
}

export function BundleUpsell({ bundle, onBuy, className }: Props) {
  const originalPrice = 57;
  const savings = originalPrice - bundle.price;
  const pct = Math.round((savings / originalPrice) * 100);

  return (
    <section
      className={`rounded-2xl bg-zinc-900/60 backdrop-blur-sm border border-white/10 p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6 ${className ?? ''}`}
    >
      <div className="text-center md:text-left w-full md:w-auto">
        <div className="flex flex-col sm:flex-row sm:items-center items-center md:items-start gap-2 mb-2">
          <p className="text-2xl font-bold">Get all 3 libraries</p>
          <span className="text-xs font-black uppercase tracking-widest bg-white text-black px-2.5 py-1 rounded-full">
            Best Value
          </span>
        </div>
        <p className="text-zinc-400 text-sm">ASMR · Content Creator · Cinematic — 475 sounds</p>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full md:w-auto">
        <div className="text-center md:text-right">
          <p className="text-sm text-zinc-500 line-through">${originalPrice}</p>
          <p className="text-4xl font-black text-white">${bundle.price}</p>
          <p className="text-sm text-green-400 font-semibold mt-0.5">
            Save ${savings} ({pct}% off)
          </p>
        </div>
        <WelleButton
          variant="solid"
          accentColor="white"
          onClick={onBuy}
          className="text-base py-4 px-12 w-full md:w-auto"
        >
          Get the Bundle
        </WelleButton>
      </div>
    </section>
  );
}
