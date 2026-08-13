'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const params = useSearchParams();
  const orderNumber = params.get('order') || 'SNJ000000';

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--surface-cream)', padding: '40px var(--margin-mobile)',
    }}>
      <div style={{
        background: 'white', borderRadius: 'var(--radius-xl)', padding: '60px 48px',
        textAlign: 'center', maxWidth: 520, width: '100%',
        boxShadow: 'var(--shadow-soft)',
        border: '1px solid var(--outline-variant)',
      }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, marginBottom: 12, color: 'var(--on-surface)' }}>
          Order Placed!
        </h1>
        <p style={{ fontSize: 16, color: 'var(--on-surface-variant)', marginBottom: 24, lineHeight: 1.7 }}>
          Thank you for shopping with Sanjpriya! Your order has been confirmed and will be delivered within 5–7 business days.
        </p>

        <div style={{
          background: 'var(--accent-pink-light)', borderRadius: 'var(--radius-lg)',
          padding: '16px 24px', marginBottom: 32,
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--outline)', marginBottom: 4 }}>
            Your Order Number
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--primary-energetic)' }}>
            {orderNumber}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn btn-primary">Continue Shopping</Link>
          <Link href="/admin/orders" className="btn btn-ghost">View Orders</Link>
        </div>

        <p style={{ marginTop: 24, fontSize: 13, color: 'var(--outline)' }}>
          A confirmation email has been sent to your inbox.
        </p>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return <Suspense><SuccessContent /></Suspense>;
}
