'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { useCart } from '@/components/CartProvider';
import { useToast } from '@/components/ToastProvider';
import ProductCard from '@/components/ProductCard';
import CustomerReviews from '@/components/CustomerReviews';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { addItem } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/products/${slug}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(p => {
        setProduct(p);
        setSelectedSize(p.sizes?.[0] || '');
        setSelectedColor(p.colors?.[0] || '');
        setLoading(false);
        // Load related
        fetch(`/api/products?category=${p.category}&limit=4`)
          .then(r => r.json())
          .then(d => setRelatedProducts((d.products || []).filter((rp: Product) => rp.slug !== slug).slice(0, 4)));
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize) { showToast('Please select a size', 'error'); return; }
    if (!selectedColor) { showToast('Please select a color', 'error'); return; }
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      quantity,
      slug: product.slug,
    });
    showToast(`${product.name} added to cart! 🛍`);
  };

  const discount = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  if (loading) {
    return (
      <div className="product-detail">
        <div className="skeleton" style={{ aspectRatio: '3/4', borderRadius: 'var(--radius-lg)' }} />
        <div style={{ paddingTop: 8 }}>
          <div className="skeleton" style={{ height: 16, width: 100, marginBottom: 16, borderRadius: 4 }} />
          <div className="skeleton" style={{ height: 40, marginBottom: 20, borderRadius: 4 }} />
          <div className="skeleton" style={{ height: 28, width: 140, marginBottom: 32, borderRadius: 4 }} />
          <div className="skeleton" style={{ height: 200, borderRadius: 8 }} />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="empty-state" style={{ paddingTop: 'calc(var(--nav-height) + 80px)' }}>
        <div className="empty-state-icon">🔍</div>
        <h3>Product not found</h3>
        <p>This product may have been removed or the URL is incorrect.</p>
        <Link href="/" className="btn btn-primary">Go Home</Link>
      </div>
    );
  }

  const catLabel = product.category.charAt(0).toUpperCase() + product.category.slice(1);

  return (
    <>
      <div className="product-detail">
        {/* Gallery */}
        <div className="product-gallery">
          <div className="product-gallery-main">
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
            />
          </div>
          {product.images.length > 1 && (
            <div className="product-gallery-thumbs">
              {product.images.map((img, i) => (
                <div
                  key={i}
                  className={`product-gallery-thumb ${i === selectedImage ? 'active' : ''}`}
                  onClick={() => setSelectedImage(i)}
                >
                  <img src={img} alt={`${product.name} view ${i + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="product-info-panel">
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span className="separator">/</span>
            <Link href={`/${product.category}`}>{catLabel}</Link>
            <span className="separator">/</span>
            <span className="current">{product.name}</span>
          </div>

          <div className="product-info-category">{catLabel}</div>
          <h1 className="product-info-name">{product.name}</h1>

          {/* Price */}
          <div className="product-info-price-row">
            <span className="product-info-price">₹{product.price.toLocaleString('en-IN')}</span>
            {product.originalPrice && (
              <>
                <span className="product-info-price-original">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                <span className="product-info-savings">{discount}% OFF</span>
              </>
            )}
          </div>



          {/* Badges */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            {product.badge && (
              <span className={`badge ${product.badge === 'Premium' ? 'badge-gold' : 'badge-primary'}`}>
                {product.badge}
              </span>
            )}
            {product.inStock ? (
              <span className="badge badge-cream">✓ In Stock</span>
            ) : (
              <span className="badge" style={{ background: 'var(--error-container)', color: 'var(--error)' }}>Out of Stock</span>
            )}
          </div>

          {/* Size */}
          <div className="product-option-label">Select Size</div>
          <div className="size-options">
            {product.sizes.map(size => (
              <button
                key={size}
                className={`size-btn${selectedSize === size ? ' selected' : ''}`}
                onClick={() => setSelectedSize(size)}
                aria-pressed={selectedSize === size}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Color */}
          <div className="product-option-label">Color</div>
          <div className="color-options">
            {product.colors.map(color => (
              <button
                key={color}
                className={`color-chip${selectedColor === color ? ' selected' : ''}`}
                onClick={() => setSelectedColor(color)}
                aria-pressed={selectedColor === color}
              >
                {color}
              </button>
            ))}
          </div>

          {/* Quantity */}
          <div className="product-option-label" style={{ marginBottom: 10 }}>Quantity</div>
          <div className="qty-control" style={{ marginBottom: 24 }}>
            <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
            <span className="qty-value">{quantity}</span>
            <button className="qty-btn" onClick={() => setQuantity(q => q + 1)} aria-label="Increase quantity">+</button>
          </div>

          {/* Actions */}
          <div className="product-actions">
            <button
              className="btn btn-primary btn-lg"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              id="add-to-cart-btn"
            >
              {product.inStock ? '🛍 Add to Cart' : 'Out of Stock'}
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => {
                setWishlisted(w => !w);
                showToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ♥', 'info');
              }}
              style={{ padding: '18px 18px', color: wishlisted ? 'var(--primary-energetic)' : undefined }}
              aria-label="Wishlist"
            >
              {wishlisted ? '♥' : '♡'}
            </button>
          </div>

          {/* Trust badges */}
          <div style={{
            display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 28,
            padding: '16px', background: 'var(--surface-container-low)',
            borderRadius: 'var(--radius-lg)',
          }}>
            {[
              { icon: '🚚', text: 'Free Delivery', sub: 'On orders above ₹1999' },
              { icon: '↩', text: 'Easy Returns', sub: '7-day return policy' },
              { icon: '🔒', text: 'Secure Payment', sub: 'SSL encrypted' },
            ].map(b => (
              <div key={b.text} style={{ flex: 1, minWidth: 100 }}>
                <div style={{ fontSize: 20, marginBottom: 2 }}>{b.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--on-surface)' }}>{b.text}</div>
                <div style={{ fontSize: 11, color: 'var(--outline)' }}>{b.sub}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="product-details-tabs">
            <div className="tab-list" role="tablist">
              {['description', 'fabric', 'care'].map(tab => (
                <button
                  key={tab}
                  className={`tab-btn${activeTab === tab ? ' active' : ''}`}
                  role="tab"
                  aria-selected={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'description' ? 'Description' : tab === 'fabric' ? 'Fabric & Fit' : 'Care Guide'}
                </button>
              ))}
            </div>
            <div className="tab-content" role="tabpanel">
              {activeTab === 'description' && <p>{product.description}</p>}
              {activeTab === 'fabric' && (
                <div>
                  <p><strong>Fabric:</strong> {product.fabric}</p>
                  <p style={{ marginTop: 8 }}>Available in sizes: {product.sizes.join(', ')}</p>
                  <p style={{ marginTop: 8 }}>Colors: {product.colors.join(', ')}</p>
                </div>
              )}
              {activeTab === 'care' && (
                <div>
                  <p>🌿 <strong>Care Instructions:</strong></p>
                  <p style={{ marginTop: 8 }}>{product.care}</p>
                  <p style={{ marginTop: 12, fontSize: 13, color: 'var(--outline)' }}>
                    Note: Colors may slightly vary from screen to actual product due to photography lighting.
                  </p>
                </div>
              )}
            </div>
          </div>

          <CustomerReviews productId={product.id} />
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="section-sm" style={{ background: 'var(--surface-cream)' }}>
          <div className="container">
            <div className="section-header" style={{ marginBottom: 40 }}>
              <span className="overline">You Might Also Love</span>
              <h2>Related {catLabel}</h2>
            </div>
            <div className="product-grid">
              {relatedProducts.map(rp => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
