'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Product } from '@/lib/types';
import { useCart } from './CartProvider';
import { useToast } from './ToastProvider';

interface ProductCardProps {
  product: Product;
}


export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [wishlisted, setWishlisted] = useState(false);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const size = product.sizes[0] || 'M';
    const color = product.colors[0] || 'Default';
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size,
      color,
      quantity: 1,
      slug: product.slug,
    });
    showToast(`${product.name} added to cart!`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted(w => !w);
    showToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ♥', 'info');
  };

  const imageUrl = product.images[0] || `https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600`;

  return (
    <div className="product-card">
      <Link href={`/product/${product.slug}`} className="product-card-image" style={{ display: 'block' }}>
        <img
          src={imageUrl}
          alt={product.name}
          loading="lazy"
        />

        {/* Badge */}
        {product.badge && (
          <div className="product-card-badge">
            <span className={`badge ${product.badge === 'Premium' ? 'badge-gold' : product.badge === 'Best Seller' ? 'badge-dark' : 'badge-primary'}`}>
              {product.badge}
            </span>
          </div>
        )}

        {/* Discount badge */}
        {discount > 0 && (
          <div className="product-card-badge" style={{ top: product.badge ? 44 : 12 }}>
            <span className="badge" style={{ background: 'rgba(37,25,23,0.85)', color: 'white' }}>
              -{discount}%
            </span>
          </div>
        )}

        {/* Wishlist */}
        <button
          className="product-card-wishlist"
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={wishlisted ? '#E5097F' : 'none'} stroke="#E5097F" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* Quick Add */}
        <button className="product-card-quick-add" onClick={handleQuickAdd}>
          Quick Add to Cart
        </button>
      </Link>

      <div className="product-card-info">
        <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
          <div className="product-card-name">{product.name}</div>
        </Link>
        <div className="product-card-price">
          <span className="current">₹{product.price.toLocaleString('en-IN')}</span>
          {product.originalPrice && (
            <span className="original">₹{product.originalPrice.toLocaleString('en-IN')}</span>
          )}
        </div>
        <div className="product-card-rating">
          <span className="stars" style={{ color: 'var(--heritage-gold)', fontSize: 12 }}>
            {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
          </span>
          <span className="count" style={{ fontSize: 11, color: 'var(--outline)' }}>({product.reviewCount})</span>
        </div>
      </div>
    </div>
  );
}
