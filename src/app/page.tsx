import { libraries, bundle } from '@/data/products';
import { LibraryCard } from '@/components/LibraryCard';
import { BundleCard } from '@/components/BundleCard';
import { NavHeader } from '@/components/NavHeader';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <NavHeader />

      <div className="max-w-7xl mx-auto px-6 pb-16 pt-20 flex flex-col gap-6 flex-1 w-full">
        <BundleCard bundle={bundle} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {libraries.map((library) => (
            <LibraryCard key={library.id} library={library} />
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
