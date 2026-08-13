import type { Metadata } from 'next';
import { Suspense } from 'react';
import CollectionPage from '@/components/CollectionPage';

export const metadata: Metadata = {
  title: 'Ethnic Dresses',
  description: 'Discover Sanjpriya\'s ethnic dress collection — Anarkali gowns, sharara sets, lehenga cholis, Indo-Western dresses & Banarasi silk gowns for every occasion.',
};

export default function DressesPage() {
  return (
    <Suspense>
      <CollectionPage
        category="dresses"
        title="Ethnic Dresses"
        subtitle="Occasions Worth Remembering"
        description="From bridal lehengas to breezy kaftans — our dresses are designed for women who move through the world with intention, grace, and cultural pride."
        image="https://images.unsplash.com/photo-1594938298603-c8148c4b4d7e?w=1400&q=80"
      />
    </Suspense>
  );
}
