import type { Metadata } from 'next';
import { Suspense } from 'react';
import CollectionPage from '@/components/CollectionPage';

export const metadata: Metadata = {
  title: 'Handbags Collection',
  description: 'Explore Sanjpriya\'s stunning Handbags collection — Festive & Occasional Handbags for every event.',
};

export default function HandbagsPage() {
  return (
    <Suspense>
      <CollectionPage
        category="handbags"
        title="Handbags Collection"
        subtitle="Festive & Occasional"
        description="Complete your ensemble with our exquisite range of handbags. From intricately embroidered potlis to contemporary metallic pieces, find the perfect companion for your festive wear."
        image="/cat-handbags.jpg"
      />
    </Suspense>
  );
}
