'use client';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';

export default function CartPage() {
  const { items, removeItem, updateQty, subtotal, clearCart } = useCart();
  const shipping = subtotal >= 1999 ? 0 : 149;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="empty-state" style={{ paddingTop: 'calc(var(--nav-height) + 80px)', minHeight: '80vh' }}>
        <div className="empty-state-icon">🛍</div>
        <h3>Your cart is empty</h3>
        <p>Add some beautiful ethnic pieces to get started!</p>
        <Link href="/" className="btn btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      {/* Items */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700 }}>
            Shopping Cart
          </h1>
          <button
            onClick={clearCart}
            className="btn btn-ghost btn-sm"
            style={{ fontSize: 12, color: 'var(--outline)' }}
          >
            Clear All
          </button>
        </div>

        <div className="cart-items">
          {items.map(item => (
            <div
              key={`${item.productId}-${item.size}-${item.color}`}
              className="cart-item"
            >
              <div className="cart-item-image">
                <img src={item.image} alt={item.name} />
              </div>
              <div>
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-meta">
                  Size: {item.size} · Color: {item.color}
                </div>
                <div className="qty-control">
                  <button
                    className="qty-btn"
                    onClick={() => updateQty(item.productId, item.size, item.color, item.quantity - 1)}
                    aria-label="Decrease quantity"
                  >−</button>
                  <span className="qty-value">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQty(item.productId, item.size, item.color, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >+</button>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                <div className="cart-item-price">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </div>
                <button
                  onClick={() => removeItem(item.productId, item.size, item.color)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--outline)', fontSize: 12, fontWeight: 600,
                    fontFamily: 'var(--font-body)', letterSpacing: '0.05em',
                  }}
                  aria-label={`Remove ${item.name}`}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Coupon */}
        <div style={{
          marginTop: 24, padding: 20,
          background: 'var(--accent-pink-light)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex', gap: 12,
        }}>
          <input
            type="text"
            placeholder="Coupon code"
            className="search-input"
            style={{ flex: 1, borderRadius: 'var(--radius)', padding: '12px 16px' }}
            aria-label="Enter coupon code"
          />
          <button className="btn btn-primary btn-sm">Apply</button>
        </div>
      </div>

      {/* Summary */}
      <div className="cart-summary-card">
        <div className="cart-summary-title">Order Summary</div>
        <div className="summary-row">
          <span>Subtotal ({items.length} items)</span>
          <span>₹{subtotal.toLocaleString('en-IN')}</span>
        </div>
        <div className="summary-row">
          <span>Shipping</span>
          <span style={{ color: shipping === 0 ? 'var(--tertiary)' : undefined }}>
            {shipping === 0 ? 'FREE ✓' : `₹${shipping}`}
          </span>
        </div>
        {shipping > 0 && (
          <p style={{ fontSize: 12, color: 'var(--outline)', marginBottom: 12 }}>
            Add ₹{(1999 - subtotal).toLocaleString('en-IN')} more for free shipping
          </p>
        )}
        <div className="summary-row total">
          <span>Total</span>
          <span>₹{total.toLocaleString('en-IN')}</span>
        </div>

        <Link href="/checkout" className="btn btn-primary" style={{ width: '100%', marginTop: 20, justifyContent: 'center' }}>
          Proceed to Checkout
        </Link>
        <Link href="/" className="btn btn-ghost" style={{ width: '100%', marginTop: 12, justifyContent: 'center' }}>
          Continue Shopping
        </Link>

        {/* Trust */}
        <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--outline-variant)' }}>
          {['🔒 Secure Checkout', '↩ 7-Day Returns', '🚚 Fast Delivery'].map(t => (
            <p key={t} style={{ fontSize: 12, color: 'var(--outline)', marginBottom: 6 }}>{t}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
