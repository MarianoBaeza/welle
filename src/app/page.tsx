import { libraries, bundle } from '@/data/products';
import { HomeClient } from '@/components/HomeClient';
import { NavHeader } from '@/components/NavHeader';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen text-white flex flex-col">
      <NavHeader />
      <HomeClient libraries={libraries} bundle={bundle} />
      <Footer />
    </main>
  );
}
