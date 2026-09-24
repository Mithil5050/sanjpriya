import type { Metadata } from 'next';
import { Suspense } from 'react';
import CollectionPage from '@/components/CollectionPage';

export const metadata: Metadata = {
  title: 'Paithani Blouses Collection',
  description: 'Explore Sanjpriya\'s stunning Paithani Blouses and Unstitched Fabric collection — Traditional elegance for every occasion.',
};

export default function PaithaniBlousesPage() {
  return (
    <Suspense>
      <CollectionPage
        category="paithani-blouses"
        title="Paithani Blouses Collection"
        subtitle="Traditional Elegance"
        description="Embrace the timeless beauty of Paithani. Our collection features intricately woven blouses and unstitched fabrics, celebrating the rich heritage of Maharashtra's finest silk weaving tradition."
        image="/cat-paithani-blouses.jpg"
      />
    </Suspense>
  );
}
