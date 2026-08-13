'use client';
import { useEffect, useState } from 'react';

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  city: string;
  state: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  payment_method: string;
  created_at: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = () => {
    fetch('/api/orders').then(r => r.json()).then(data => {
      setOrders(data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id: number, status: string) => {
    await fetch('/api/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    fetchOrders();
    if (selectedOrder?.id === id) setSelectedOrder(o => o ? { ...o, status } : null);
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div>
      <div className="admin-header">
        <h1>Orders</h1>
        <p style={{ color: 'var(--on-surface-variant)', fontSize: 14 }}>
          {orders.length} orders · Total Revenue: ₹{totalRevenue.toLocaleString('en-IN')}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedOrder ? '1fr 380px' : '1fr', gap: 24 }}>
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40 }}>Loading...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--outline)' }}>No orders yet. Start selling!</td></tr>
              ) : orders.map(order => (
                <tr key={order.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedOrder(order)}>
                  <td style={{ fontWeight: 700, color: 'var(--primary-energetic)' }}>{order.order_number}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{order.customer_name}</div>
                    <div style={{ fontSize: 11, color: 'var(--outline)' }}>{order.city}, {order.state}</div>
                  </td>
                  <td>{order.items?.length || 0} items</td>
                  <td style={{ fontWeight: 700 }}>₹{order.total.toLocaleString('en-IN')}</td>
                  <td style={{ textTransform: 'uppercase', fontSize: 11, fontWeight: 700 }}>{order.payment_method}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={e => { e.stopPropagation(); updateStatus(order.id, e.target.value); }}
                      onClick={e => e.stopPropagation()}
                      className={`status-badge status-${order.status}`}
                      style={{ border: 'none', cursor: 'pointer', background: 'transparent', fontFamily: 'inherit', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--outline)' }}>
                    {new Date(order.created_at).toLocaleDateString('en-IN')}
                  </td>
                  <td>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '6px 10px', fontSize: 11 }}
                      onClick={e => { e.stopPropagation(); setSelectedOrder(order); }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Detail Panel */}
        {selectedOrder && (
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: 24, height: 'fit-content', position: 'sticky', top: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>{selectedOrder.order_number}</h3>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--outline)' }}>×</button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--outline)', marginBottom: 8 }}>Customer</h4>
              <p style={{ fontSize: 14, fontWeight: 600 }}>{selectedOrder.customer_name}</p>
              <p style={{ fontSize: 13, color: 'var(--outline)' }}>{selectedOrder.customer_email}</p>
              <p style={{ fontSize: 13, color: 'var(--outline)' }}>{selectedOrder.customer_phone}</p>
            </div>

            <div style={{ marginBottom: 16, paddingTop: 16, borderTop: '1px solid var(--outline-variant)' }}>
              <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--outline)', marginBottom: 8 }}>Items</h4>
              {selectedOrder.items?.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                  <span>{item.name} × {item.quantity}</span>
                  <span style={{ fontWeight: 700 }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div style={{ paddingTop: 12, borderTop: '1px solid var(--outline-variant)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 4 }}>
                <span>Subtotal</span><span>₹{selectedOrder.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
                <span>Shipping</span><span>₹{selectedOrder.shipping}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700 }}>
                <span>Total</span><span style={{ color: 'var(--primary-energetic)' }}>₹{selectedOrder.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
