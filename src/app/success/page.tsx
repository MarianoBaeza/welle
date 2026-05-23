import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { NavHeader } from '@/components/NavHeader';
import { Footer } from '@/components/Footer';
import { libraries, bundle } from '@/data/products';

interface Props {
  searchParams: Promise<{ product?: string; type?: string }>;
}

export default async function SuccessPage({ searchParams }: Props) {
  const { product, type } = await searchParams;

  let productName = 'your library';
  if (type === 'bundle') {
    productName = bundle.name;
  } else if (product) {
    const library = libraries.find((l) => l.slug === product);
    if (library) productName = library.name;
  }

  return (
    <main className="min-h-screen text-white flex flex-col relative overflow-hidden bg-zinc-950">
      {/* Comfort gradient */}
      <div
        className="pointer-events-none absolute inset-0 -z-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 55% at 50% -5%, oklch(0.48 0.09 58 / 0.38), transparent)',
        }}
        aria-hidden="true"
      />

      <NavHeader />

      <div className="flex-1 flex items-center justify-center px-6 py-24 relative z-10">
        <div className="flex flex-col items-center text-center gap-6 max-w-md">
          <CheckCircle
            size={56}
            strokeWidth={1.5}
            className="text-amber-400"
          />

          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-black text-white leading-tight">
              You&apos;re all set.
            </h1>
            <p className="text-zinc-400 text-lg font-light">
              <span className="text-white font-medium">{productName}</span> is yours.
            </p>
          </div>

          <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
            Your download link will arrive by email within the next few minutes. Check your spam folder if it doesn&apos;t show up.
          </p>

          <Link
            href="/"
            className="mt-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors tracking-wide uppercase"
          >
            Back to the store →
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
