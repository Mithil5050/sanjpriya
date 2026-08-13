'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Product } from '@/lib/types';
import { useCart } from './CartProvider';
import { useToast } from './ToastProvider';
import WishlistButton from './WishlistButton';

interface ProductCardProps {
  product: Product;
}


export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { showToast } = useToast();
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
          <div className="product-card-badge" style={{ top: product.badge ? '44px' : '12px' }}>
            <span className="badge" style={{ background: 'rgba(37,25,23,0.85)', color: 'white' }}>
              -{discount}%
            </span>
          </div>
        )}

        {/* Wishlist */}
        <WishlistButton productId={product.id} />

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
