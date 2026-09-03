'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const badge = searchParams.get('badge') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    if (!query && !badge) return;
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set('search', query);
    if (badge) params.set('badge', badge);
    fetch(`/api/products?${params}&limit=100`)
      .then(r => r.json())
      .then(d => { setProducts(d.products || []); setLoading(false); });
  }, [query, badge]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/search?q=${encodeURIComponent(searchInput)}`;
  };

  return (
    <div style={{ paddingTop: 'calc(var(--nav-height) + 40px)', minHeight: '80vh' }}>
      <div className="page-hero" style={{ paddingTop: 60 }}>
        <span className="overline">{badge || 'Search'}</span>
        <h1>{badge ? badge : query ? `Results for "${query}"` : 'Search'}</h1>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 0, maxWidth: 480, margin: '24px auto 0', border: '1.5px solid var(--primary-energetic)', borderRadius: 'var(--radius)', overflow: 'hidden', background: 'white' }}>
          <input
            type="text"
            className="search-input"
            placeholder="Search kurtis, blouses, dresses..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            style={{ border: 'none', borderRadius: 0 }}
            aria-label="Search products"
          />
          <button type="submit" className="btn btn-primary btn-sm" style={{ borderRadius: 0 }}>Search</button>
        </form>
      </div>

      <section className="section-sm">
        <div className="container">
          {loading ? (
            <div className="product-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i}>
                  <div className="skeleton" style={{ aspectRatio: '3/4', borderRadius: 'var(--radius-md)', marginBottom: 12 }} />
                  <div className="skeleton" style={{ height: 18, marginBottom: 8, borderRadius: 4 }} />
                  <div className="skeleton" style={{ height: 14, width: '60%', borderRadius: 4 }} />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <p style={{ marginBottom: 24, color: 'var(--outline)', fontSize: 14 }}>
                {products.length} result{products.length !== 1 ? 's' : ''} found
              </p>
              <div className="product-grid">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </>
          ) : (query || badge) ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3>No results found</h3>
              <p>Try a different search term or browse our collections.</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/kurtis" className="btn btn-primary">Kurtis</Link>
                <Link href="/blouses" className="btn btn-ghost">Blouses</Link>
                <Link href="/dresses" className="btn btn-ghost">Dresses</Link>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">✨</div>
              <h3>What are you looking for?</h3>
              <p>Search for kurtis, blouses, dresses, or any style.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function SearchPage() {
  return <Suspense><SearchContent /></Suspense>;
}
