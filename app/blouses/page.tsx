import type { Metadata } from 'next';
import { Suspense } from 'react';
import CollectionPage from '@/components/CollectionPage';

export const metadata: Metadata = {
  title: 'Designer Blouses',
  description: 'Shop Sanjpriya\'s designer blouses — Kanjeevaram silk, Zardozi embroidery, backless styles, Chikankari & more. Premium saree blouses crafted by master artisans.',
};

export default function BlousesPage() {
  return (
    <Suspense>
      <CollectionPage
        category="blouses"
        title="Designer Blouses"
        subtitle="Artisan Craftsmanship"
        description="Where a blouse becomes a masterpiece. From Kanjeevaram silks to contemporary off-shoulder designs — each blouse is a story of extraordinary craft."
        image="https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=1400&q=80"
      />
    </Suspense>
  );
}
