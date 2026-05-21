import { notFound } from 'next/navigation';
import { libraries, bundle, getLibraryBySlug } from '@/data/products';
import { LibraryPageClient } from '@/components/LibraryPageClient';

export function generateStaticParams() {
  return libraries.map((lib) => ({ slug: lib.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const library = getLibraryBySlug(slug);
  if (!library) return {};
  return {
    title: `${library.name} — Welle`,
    description: library.description,
  };
}

export default async function LibraryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const library = getLibraryBySlug(slug);
  if (!library) notFound();

  return <LibraryPageClient library={library} bundle={bundle} />;
}
