'use client';

import { useEffect, useRef, useState } from 'react';

interface PurchaseData {
  downloadUrls: { name: string; url: string }[];
  buyerName: string;
  productName: string;
}

const RESEND_COOLDOWN = 60;
const SUPPORT_EMAIL = 'wellesupport@gmail.com';

export function EmailForm() {
  const [purchase, setPurchase] = useState<PurchaseData | null>(null);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'resending' | 'resent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('welle_purchase');
    if (stored) {
      setPurchase(JSON.parse(stored));
      sessionStorage.removeItem('welle_purchase');
    }
  }, []);

  useEffect(() => {
    if (status === 'sent') {
      setCooldown(RESEND_COOLDOWN);
      intervalRef.current = setInterval(() => {
        setCooldown((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current!);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [status]);

  if (!purchase) return null;

  const sendEmail = async (isResend = false) => {
    setStatus(isResend ? 'resending' : 'loading');
    try {
      const res = await fetch('/api/send-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          buyerName: purchase.buyerName,
          downloadUrls: purchase.downloadUrls,
          productName: purchase.productName,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Unknown error');
      setStatus(isResend ? 'resent' : 'sent');
    } catch (err) {
      setErrorMsg(String(err));
      setStatus('error');
    }
  };

  if (status === 'resent') {
    return (
      <div className="flex flex-col items-center gap-3 text-center max-w-xs">
        <p className="text-zinc-300 text-sm font-medium">Email resent.</p>
        <p className="text-zinc-500 text-sm leading-relaxed">
          Still nothing? Write us at{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-amber-400 hover:text-amber-300 transition-colors">
            {SUPPORT_EMAIL}
          </a>{' '}
          and we&apos;ll sort it out.
        </p>
      </div>
    );
  }

  if (status === 'sent') {
    return (
      <div className="flex flex-col items-center gap-4 text-center max-w-xs">
        <p className="text-zinc-300 text-sm font-medium">
          Check your inbox — the download link is on its way.
        </p>
        <button
          onClick={() => sendEmail(true)}
          disabled={cooldown > 0}
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Didn't arrive? Resend"}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); sendEmail(); }} className="flex flex-col gap-3 w-full max-w-xs">
      <p className="text-zinc-400 text-sm text-center">Where should we send the download?</p>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 text-sm outline-none focus:border-amber-400/50 transition-colors"
      />
      {status === 'error' && (
        <p className="text-red-400 text-xs text-center">{errorMsg || 'Something went wrong. Try again.'}</p>
      )}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3 rounded-xl bg-amber-400 text-zinc-950 font-bold text-sm hover:bg-amber-300 transition-colors disabled:opacity-50"
      >
        {status === 'loading' ? 'Sending…' : 'Send download link'}
      </button>
    </form>
  );
}
