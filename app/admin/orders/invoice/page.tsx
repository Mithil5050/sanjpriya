'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import OrderInvoice, { InvoiceOrder } from '@/components/admin/OrderInvoice';

function InvoiceContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const orderNumber = searchParams.get('order');

  const [order, setOrder] = useState<InvoiceOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then((orders: InvoiceOrder[]) => {
        if (!Array.isArray(orders)) {
          setError('Failed to load orders.');
          setLoading(false);
          return;
        }

        let found: InvoiceOrder | undefined;
        if (id) {
          found = orders.find(o => String(o.id) === String(id));
        } else if (orderNumber) {
          found = orders.find(o => o.order_number?.toLowerCase() === orderNumber.toLowerCase());
        }

        if (found) {
          setOrder(found);
        } else {
          setError(`Order not found for ${id ? `ID #${id}` : `Order #${orderNumber}`}.`);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Network error while loading invoice.');
        setLoading(false);
      });
  }, [id, orderNumber]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>📄</div>
        <div style={{ fontSize: '16px', fontWeight: 600 }}>Loading Tax Invoice...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <div style={{ fontSize: '36px', marginBottom: '12px' }}>⚠️</div>
        <div style={{ fontSize: '18px', fontWeight: 700, color: '#c95d3c', marginBottom: '8px' }}>Invoice Not Found</div>
        <p style={{ color: '#666', marginBottom: '20px' }}>{error || 'Unable to locate order details.'}</p>
        <button
          onClick={() => window.history.back()}
          style={{ padding: '8px 18px', borderRadius: '6px', background: '#333', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          ← Return to Orders
        </button>
      </div>
    );
  }

  return <OrderInvoice order={order} isStandalone={true} />;
}

export default function OrderInvoiceStandalonePage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading Invoice...</div>}>
      <InvoiceContent />
    </Suspense>
  );
}
