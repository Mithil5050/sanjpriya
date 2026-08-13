'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from './ToastProvider';

export default function WishlistButton({ productId }: { productId: string | number }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Check if item is in wishlist on mount
    fetch('/api/wishlist')
      .then(res => res.json())
      .then(data => {
        if (data.wishlist) {
          setIsWishlisted(data.wishlist.some((item: any) => item.product_id === productId));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productId]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;
    setLoading(true);

    try {
      if (isWishlisted) {
        const res = await fetch(`/api/wishlist?productId=${productId}`, { method: 'DELETE' });
        if (res.ok) {
          setIsWishlisted(false);
          showToast('Removed from wishlist');
          router.refresh(); // Refresh the page to update wishlist page if we are on it
        } else if (res.status === 401) {
          router.push('/login');
        }
      } else {
        const res = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        });
        if (res.ok) {
          setIsWishlisted(true);
          showToast('Added to wishlist');
        } else if (res.status === 401) {
          router.push('/login');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        zIndex: 10,
        transition: 'transform 0.2s',
        transform: loading ? 'scale(0.9)' : 'scale(1)',
      }}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={isWishlisted ? 'var(--primary-energetic)' : 'none'}
        stroke={isWishlisted ? 'var(--primary-energetic)' : 'currentColor'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    </button>
  );
}
