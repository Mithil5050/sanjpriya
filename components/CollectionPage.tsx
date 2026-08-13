'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product } from '@/lib/types';
import ProductCard from './ProductCard';

interface CollectionPageProps {
  category: 'kurtis' | 'blouses' | 'dresses';
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function CollectionPage({ category, title, subtitle, description, image }: CollectionPageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('newest');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(15000);
  const [filterOpen, setFilterOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ category, sort });
    if (maxPrice < 15000) params.set('maxPrice', String(maxPrice));
    const res = await fetch(`/api/products?${params}`);
    const data = await res.json();
    let filtered = data.products || [];
    if (selectedSizes.length > 0) {
      filtered = filtered.filter((p: Product) =>
        selectedSizes.some(s => p.sizes.includes(s))
      );
    }
    setProducts(filtered);
    setTotal(filtered.length);
    setLoading(false);
  }, [category, sort, maxPrice, selectedSizes]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  return (
    <>
      {/* Page Hero */}
      <div className="page-hero" style={{ backgroundImage: `url('/hero.png')`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(253, 252, 249, 0.85)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="overline">{subtitle}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </div>

      {/* Collection content */}
      <section className="section-sm">
        <div className="container">
          <div className="collection-layout">
            {/* Filter Sidebar */}
            <aside className="filter-sidebar">
              <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>Filters</h3>
                {(selectedSizes.length > 0 || maxPrice < 15000) && (
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => { setSelectedSizes([]); setMaxPrice(15000); }}
                    style={{ padding: '6px 12px', fontSize: 11 }}
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Size Filter */}
              <div className="filter-group">
                <div className="filter-group-title">Size</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {SIZES.map(size => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`size-btn${selectedSizes.includes(size) ? ' selected' : ''}`}
                      style={{ padding: '6px 12px', fontSize: 12 }}
                      aria-pressed={selectedSizes.includes(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="filter-group">
                <div className="filter-group-title">Price Range</div>
                <div className="price-range">
                  <input
                    type="range"
                    min={500}
                    max={15000}
                    step={500}
                    value={maxPrice}
                    onChange={e => setMaxPrice(Number(e.target.value))}
                    aria-label="Maximum price"
                  />
                  <div className="price-display">
                    <span>₹500</span>
                    <span style={{ fontWeight: 700, color: 'var(--primary-energetic)' }}>
                      Up to ₹{maxPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Badge Filter */}
              <div className="filter-group">
                <div className="filter-group-title">Collection</div>
                {['New Arrival', 'Best Seller', 'Heritage Collection', 'Festive', 'Premium'].map(badge => (
                  <div key={badge} className="filter-checkbox">
                    <input type="checkbox" id={`badge-${badge}`} />
                    <label htmlFor={`badge-${badge}`}>{badge}</label>
                  </div>
                ))}
              </div>
            </aside>

            {/* Product Grid */}
            <div className="collection-content">
              <div className="collection-header">
                <div>
                  <div className="collection-title">{title}</div>
                  <div className="collection-count">{total} products</div>
                </div>
                <div className="collection-sort">
                  <label htmlFor="sort-select">Sort by:</label>
                  <select
                    id="sort-select"
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                  >
                    {SORT_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="product-grid product-grid-3">
                  {[...Array(9)].map((_, i) => (
                    <div key={i}>
                      <div className="skeleton" style={{ aspectRatio: '3/4', borderRadius: 'var(--radius-md)', marginBottom: 12 }} />
                      <div className="skeleton" style={{ height: 18, marginBottom: 8, borderRadius: 4 }} />
                      <div className="skeleton" style={{ height: 14, width: '60%', borderRadius: 4 }} />
                    </div>
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div className="product-grid product-grid-3">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">🌸</div>
                  <h3>No products found</h3>
                  <p>Try adjusting your filters to see more results.</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => { setSelectedSizes([]); setMaxPrice(15000); }}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
