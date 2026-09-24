import type { Metadata } from 'next';
import { Suspense } from 'react';
import CollectionPage from '@/components/CollectionPage';

export const metadata: Metadata = {
  title: 'Clutches Collection',
  description: 'Explore Sanjpriya\'s stunning Clutches collection — Festive & Occasional Clutches Handbags for every event.',
};

export default function ClutchesPage() {
  return (
    <Suspense>
      <CollectionPage
        category="clutches"
        title="Clutches Collection"
        subtitle="Festive & Occasional"
        description="Complete your ensemble with our exquisite range of clutches. From intricately embroidered potlis to contemporary metallic pieces, find the perfect companion for your festive wear."
        image="/cat-clutches.jpg"
      />
    </Suspense>
  );
}
