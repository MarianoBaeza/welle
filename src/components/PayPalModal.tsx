'use client';

import { useRouter } from 'next/navigation';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productSlug: string;
  price: number;
  type: 'library' | 'bundle';
  description?: string;
  soundCount?: number;
  tags?: string[];
  accentColor?: string;
  image?: string;
}

export function PayPalModal({
  isOpen,
  onClose,
  productName,
  productSlug,
  price,
  type,
  description,
  soundCount,
  tags,
  accentColor,
}: Props) {
  const router = useRouter();

  if (!isOpen) return null;

  const createOrder = async () => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productSlug, type }),
    });
    const { orderID } = await res.json();
    return orderID;
  };

  const onApprove = async ({ orderID }: { orderID: string }) => {
    const res = await fetch('/api/capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderID, productSlug, type }),
    });
    const data = await res.json();
    if (data.success) {
      sessionStorage.setItem(
        'welle_purchase',
        JSON.stringify({
          downloadUrls: data.downloadUrls,
          buyerName: data.buyerName,
          productName: data.productName,
          sendToken: data.sendToken,
        })
      );
      router.push(`/success?product=${productSlug}&type=${type}`);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center sm:p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

      {/* Mobile: full-screen purchase page */}
      <div
        className="sm:hidden relative z-10 w-full h-full bg-zinc-950 flex flex-col overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-12 pb-4 sm:pt-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            One-time purchase
          </p>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6 text-center pb-12">
          <h2 className="text-2xl font-bold text-white">{productName}</h2>

          {description && (
            <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">{description}</p>
          )}

          {(soundCount !== undefined || tags?.length) && (
            <div className="flex flex-wrap justify-center gap-2">
              {soundCount !== undefined && (
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={
                    accentColor
                      ? { backgroundColor: `${accentColor}22`, color: accentColor }
                      : { backgroundColor: '#27272a', color: '#a1a1aa' }
                  }
                >
                  {soundCount} sounds
                </span>
              )}
              {tags?.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full border border-zinc-700 text-zinc-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-start gap-1 leading-none">
            <span className="text-3xl font-black text-zinc-400 mt-4">$</span>
            <span
              className="text-[8rem] font-black leading-none"
              style={{ color: 'white' }}
            >
              {price}
            </span>
            <span className="text-sm text-zinc-500 self-end mb-4">USD</span>
          </div>

          <div className="w-full max-w-xs min-h-[120px]">
            <PayPalButtons
              style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay', height: 52 }}
              createOrder={createOrder}
              onApprove={onApprove}
            />
          </div>

          <p className="text-xs text-zinc-600">
            Instant download · Yours forever · No subscription
          </p>
        </div>
      </div>

      {/* Desktop: modal */}
      <div
        className="hidden sm:flex relative z-10 w-full max-w-sm bg-zinc-900 border border-white/10 rounded-2xl p-6 flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1">
                One-time purchase
              </p>
              <h2 className="text-xl font-bold text-white">{productName}</h2>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-white transition-colors mt-0.5"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          {(description || soundCount !== undefined || tags?.length) && (
            <div className="flex gap-3">
              <div className="flex flex-col gap-2 min-w-0">
                {description && (
                  <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
                )}
                {(soundCount !== undefined || tags?.length) && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {soundCount !== undefined && (
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={
                          accentColor
                            ? { backgroundColor: `${accentColor}22`, color: accentColor }
                            : { backgroundColor: '#27272a', color: '#a1a1aa' }
                        }
                      >
                        {soundCount} sounds
                      </span>
                    )}
                    {tags?.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full border border-zinc-700 text-zinc-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black text-white">${price}</span>
          <span className="text-zinc-500 text-sm">USD</span>
        </div>

        <div className="min-h-[120px]">
          <PayPalButtons
            style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay', height: 48 }}
            createOrder={createOrder}
            onApprove={onApprove}
          />
        </div>

        <p className="text-center text-xs text-zinc-600">
          Instant download · Yours forever · No subscription
        </p>
      </div>
    </div>
  );
}
