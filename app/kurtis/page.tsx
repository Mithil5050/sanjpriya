import type { Metadata } from 'next';
import { Suspense } from 'react';
import CollectionPage from '@/components/CollectionPage';

export const metadata: Metadata = {
  title: 'Kurtis Collection',
  description: 'Explore Sanjpriya\'s stunning Kurtis collection — from Anarkali to block prints, Chikankari to Bandhani. Premium ethnic kurtis for every occasion.',
};

export default function KurtisPage() {
  return (
    <Suspense>
      <CollectionPage
        category="kurtis"
        title="Kurtis Collection"
        subtitle="Handpicked Heritage"
        description="From breezy block-printed cottons to regal embroidered Anarkalis — our Kurtis collection celebrates every facet of Indian ethnic fashion."
        image="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1400&q=80"
      />
    </Suspense>
  );
}
