import { libraries, bundle } from '@/data/products';
import { BundlePageClient } from '@/components/BundlePageClient';

export const metadata = {
  title: 'Complete Bundle — Welle',
  description: bundle.description,
};

export default function BundlePage() {
  return <BundlePageClient libraries={libraries} bundle={bundle} />;
}
