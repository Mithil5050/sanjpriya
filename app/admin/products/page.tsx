'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchProducts = () => {
    setLoading(true);
    const url = filter === 'all' ? '/api/products?limit=100' : `/api/products?category=${filter}&limit=100`;
    fetch(url).then(r => r.json()).then(d => {
      setProducts(d.products || []);
      setLoading(false);
    });
  };

  useEffect(() => { fetchProducts(); }, [filter]);

  const handleDelete = async (slug: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await fetch(`/api/products/${slug}`, { method: 'DELETE' });
    fetchProducts();
  };

  const handleImport = async () => {
    if (!confirm('This will import all images from the content folder. Proceed?')) return;
    setLoading(true);
    try {
      const res = await fetch('/api/migrate', { method: 'POST' });
      const data = await res.json();
      if (data.error) alert(data.error);
      else alert('Migration complete!');
    } catch (err: any) {
      alert(err.message);
    }
    fetchProducts();
  };

  const handleCleanup = async () => {
    if (!confirm('This will permanently delete all placeholder products (with Unsplash images). Proceed?')) return;
    setLoading(true);
    try {
      const res = await fetch('/api/cleanup', { method: 'POST' });
      const data = await res.json();
      if (data.error) alert(data.error);
      else alert(data.message);
    } catch (err: any) {
      alert(err.message);
    }
    fetchProducts();
  };

  return (
    <div>
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Products</h1>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: 14 }}>
            Manage your product catalog — {products.length} products
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleCleanup} className="btn btn-secondary btn-sm" disabled={loading} style={{ background: 'var(--error-container)', color: 'var(--error)', borderColor: 'var(--error-container)' }}>
            Clean Dummy Data
          </button>
          <button onClick={handleImport} className="btn btn-secondary btn-sm" disabled={loading}>
            Import Content Products
          </button>
          <Link href="/admin/products/new" className="btn btn-primary btn-sm">+ Add Product</Link>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['all', 'kurtis', 'blouses', 'dresses'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`btn ${filter === f ? 'btn-primary' : 'btn-ghost'} btn-sm`}
            style={{ textTransform: 'capitalize' }}
          >
            {f === 'all' ? 'All' : f}
          </button>
        ))}
      </div>

      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Badge</th>
              <th>Rating</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40 }}>Loading...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--outline)' }}>No products found</td></tr>
            ) : products.map(p => (
              <tr key={p.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      style={{ width: 48, height: 60, objectFit: 'cover', borderRadius: 4 }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--outline)' }}>{p.slug}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge badge-cream" style={{ textTransform: 'capitalize' }}>{p.category}</span>
                </td>
                <td>
                  <div style={{ fontWeight: 700, color: 'var(--primary-energetic)' }}>₹{p.price.toLocaleString('en-IN')}</div>
                  {p.originalPrice && (
                    <div style={{ fontSize: 11, color: 'var(--outline)', textDecoration: 'line-through' }}>₹{p.originalPrice.toLocaleString('en-IN')}</div>
                  )}
                </td>
                <td>{p.badge ? <span className="badge badge-primary">{p.badge}</span> : '—'}</td>
                <td>{'★'.repeat(Math.round(p.rating))} ({p.reviewCount})</td>
                <td>
                  <span className={`status-badge ${p.inStock ? 'status-confirmed' : 'status-cancelled'}`}>
                    {p.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link
                      href={`/product/${p.slug}`}
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '6px 10px', fontSize: 11 }}
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/products/${p.slug}/edit`}
                      className="btn btn-primary btn-sm"
                      style={{ padding: '6px 10px', fontSize: 11, background: 'var(--primary-container)', color: 'var(--on-primary-container)' }}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p.slug, p.name)}
                      className="btn btn-sm"
                      style={{ padding: '6px 10px', fontSize: 11, background: 'var(--error-container)', color: 'var(--error)', border: 'none' }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
