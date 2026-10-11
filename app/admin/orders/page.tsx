'use client';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
  size?: string;
  color?: string;
  slug?: string;
  productId?: number;
}

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address: string;
  landmark: string | null;
  city: string;
  state: string;
  pincode: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  payment_method: string;
  razorpay_payment_id?: string | null;
  created_at: string;
}

interface PreviewImage {
  url: string;
  name: string;
  variant?: string;
  price?: number;
  slug?: string;
}

function ProductThumbnail({
  src,
  alt,
  size = 48,
  onClick,
}: {
  src?: string;
  alt: string;
  size?: number;
  onClick?: () => void;
}) {
  const [error, setError] = useState(false);
  const width = size;
  const height = Math.round(size * 1.25);

  if (!src || error) {
    return (
      <div
        onClick={onClick}
        style={{
          width,
          height,
          borderRadius: 6,
          background: 'var(--surface-container-high, #f0eee9)',
          border: '1px solid var(--outline-variant, #e0ddd5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: Math.max(14, Math.round(size * 0.35)),
          flexShrink: 0,
          cursor: onClick ? 'pointer' : 'default',
        }}
        title={alt}
      >
        <span>👗</span>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      style={{
        width,
        height,
        borderRadius: 6,
        overflow: 'hidden',
        border: '1px solid var(--outline-variant, #e0ddd5)',
        background: '#fff',
        flexShrink: 0,
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
      title={`${alt} (Click to enlarge)`}
    >
      <img
        src={src}
        alt={alt}
        onError={() => setError(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transition: 'transform 0.2s ease',
        }}
        onMouseEnter={(e) => onClick && (e.currentTarget.style.transform = 'scale(1.08)')}
        onMouseLeave={(e) => onClick && (e.currentTarget.style.transform = 'scale(1.0)')}
      />
    </div>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [previewImage, setPreviewImage] = useState<PreviewImage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchOrders = () => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(data => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    fetchOrders();
    if (selectedOrder?.id === id) {
      setSelectedOrder(o => (o ? { ...o, status } : null));
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
      if (!matchesStatus) return false;

      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();

      const orderNumberMatches = order.order_number?.toLowerCase().includes(term);
      const nameMatches = order.customer_name?.toLowerCase().includes(term);
      const phoneMatches = order.customer_phone?.toLowerCase().includes(term);
      const emailMatches = order.customer_email?.toLowerCase().includes(term);
      const productMatches = order.items?.some(i => i.name?.toLowerCase().includes(term));

      return orderNumberMatches || nameMatches || phoneMatches || emailMatches || productMatches;
    });
  }, [orders, statusFilter, searchTerm]);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: orders.length };
    orders.forEach(o => {
      const s = (o.status || 'pending').toLowerCase();
      counts[s] = (counts[s] || 0) + 1;
    });
    return counts;
  }, [orders]);

  return (
    <div>
      {/* Header */}
      <div className="admin-header" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 6px' }}>Orders Management</h1>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: 14, margin: 0 }}>
              {orders.length} total orders · Revenue: ₹{totalRevenue.toLocaleString('en-IN')}
            </p>
          </div>
          <button
            onClick={() => { setLoading(true); fetchOrders(); }}
            className="btn btn-ghost btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            🔄 Refresh Orders
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ background: 'white', borderRadius: 'var(--radius-lg, 12px)', padding: 16, marginBottom: 24, boxShadow: 'var(--shadow-card, 0 1px 3px rgba(0,0,0,0.05))' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[
              { id: 'all', label: 'All Orders' },
              { id: 'pending', label: 'Pending' },
              { id: 'confirmed', label: 'Confirmed' },
              { id: 'shipped', label: 'Shipped' },
              { id: 'delivered', label: 'Delivered' },
              { id: 'cancelled', label: 'Cancelled' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  border: statusFilter === tab.id ? 'none' : '1px solid var(--outline-variant, #e0ddd5)',
                  background: statusFilter === tab.id ? 'var(--primary-energetic, #c95d3c)' : '#fcfbf9',
                  color: statusFilter === tab.id ? 'white' : 'var(--on-surface-variant)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{tab.label}</span>
                <span style={{
                  fontSize: 10,
                  background: statusFilter === tab.id ? 'rgba(255,255,255,0.25)' : 'var(--surface-container-high, #eee)',
                  padding: '1px 6px',
                  borderRadius: 10,
                }}>
                  {statusCounts[tab.id] || 0}
                </span>
              </button>
            ))}
          </div>

          {/* Search box */}
          <div style={{ minWidth: 260, flex: '1 1 260px', maxWidth: 400 }}>
            <input
              type="text"
              placeholder="Search by order #, customer, or product..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 14px',
                borderRadius: 8,
                border: '1px solid var(--outline-variant, #e0ddd5)',
                fontSize: 13,
                outline: 'none',
                background: '#faf9f7',
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Orders Table + Details Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedOrder ? '1fr 420px' : '1fr', gap: 24, alignItems: 'start' }}>
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th style={{ minWidth: 240 }}>Product(s) Ordered</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40 }}>Loading orders...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--outline)' }}>
                    {searchTerm || statusFilter !== 'all' ? 'No orders match your filter criteria.' : 'No orders yet.'}
                  </td>
                </tr>
              ) : filteredOrders.map(order => (
                <tr
                  key={order.id}
                  style={{
                    cursor: 'pointer',
                    background: selectedOrder?.id === order.id ? 'var(--surface-container-low, #f5f2eb)' : undefined,
                  }}
                  onClick={() => setSelectedOrder(order)}
                >
                  <td style={{ fontWeight: 700, color: 'var(--primary-energetic)', whiteSpace: 'nowrap' }}>
                    {order.order_number}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{order.customer_name}</div>
                    <div style={{ fontSize: 11, color: 'var(--outline)' }}>{order.city}, {order.state}</div>
                    {order.customer_phone && (
                      <div style={{ fontSize: 11, color: 'var(--outline)' }}>📞 {order.customer_phone}</div>
                    )}
                  </td>

                  {/* PRODUCTS ORDERED WITH PICTURE */}
                  <td>
                    {(!order.items || order.items.length === 0) ? (
                      <span style={{ color: 'var(--outline)', fontSize: 12 }}>No items</span>
                    ) : order.items.length === 1 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <ProductThumbnail
                          src={order.items[0].image}
                          alt={order.items[0].name}
                          size={46}
                          onClick={() => {
                            if (order.items[0].image) {
                              setPreviewImage({
                                url: order.items[0].image,
                                name: order.items[0].name,
                                variant: [
                                  order.items[0].size && `Size: ${order.items[0].size}`,
                                  order.items[0].color && `Color: ${order.items[0].color}`,
                                ].filter(Boolean).join(' · '),
                                price: order.items[0].price,
                                slug: order.items[0].slug,
                              });
                            }
                          }}
                        />
                        <div style={{ minWidth: 0 }}>
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: 13,
                              lineHeight: 1.3,
                              maxWidth: 180,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                            title={order.items[0].name}
                          >
                            {order.items[0].name}
                          </div>
                          <div style={{ display: 'flex', gap: 6, marginTop: 4, alignItems: 'center', flexWrap: 'wrap' }}>
                            {order.items[0].size && (
                              <span style={{ fontSize: 10, background: 'var(--surface-container, #eee)', padding: '1px 6px', borderRadius: 4, fontWeight: 600 }}>
                                {order.items[0].size}
                              </span>
                            )}
                            {order.items[0].color && (
                              <span style={{ fontSize: 10, background: 'var(--surface-container, #eee)', padding: '1px 6px', borderRadius: 4, color: 'var(--outline)' }}>
                                {order.items[0].color}
                              </span>
                            )}
                            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary-energetic)' }}>
                              ×{order.items[0].quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {/* Thumbnails row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          {order.items.slice(0, 3).map((item, idx) => (
                            <ProductThumbnail
                              key={idx}
                              src={item.image}
                              alt={item.name}
                              size={36}
                              onClick={() => {
                                if (item.image) {
                                  setPreviewImage({
                                    url: item.image,
                                    name: item.name,
                                    variant: [
                                      item.size && `Size: ${item.size}`,
                                      item.color && `Color: ${item.color}`,
                                    ].filter(Boolean).join(' · '),
                                    price: item.price,
                                    slug: item.slug,
                                  });
                                }
                              }}
                            />
                          ))}
                          {order.items.length > 3 && (
                            <div
                              style={{
                                width: 36,
                                height: 45,
                                borderRadius: 6,
                                background: 'var(--surface-container-high, #eee)',
                                border: '1px solid var(--outline-variant, #ccc)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 11,
                                fontWeight: 700,
                                color: 'var(--on-surface-variant)',
                              }}
                            >
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 600 }}>
                          {order.items.reduce((s, i) => s + (i.quantity || 1), 0)} items ({order.items.length} products)
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: 'var(--outline)',
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={order.items.map(i => i.name).join(', ')}
                        >
                          {order.items[0].name} + {order.items.length - 1} more
                        </div>
                      </div>
                    )}
                  </td>

                  <td style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                    ₹{order.total?.toLocaleString('en-IN')}
                  </td>
                  <td>
                    <span style={{
                      textTransform: 'uppercase',
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 4,
                      background: order.payment_method === 'prepaid' ? '#e6f4ea' : '#f1f3f4',
                      color: order.payment_method === 'prepaid' ? '#137333' : '#3c4043',
                    }}>
                      {order.payment_method || 'COD'}
                    </span>
                  </td>
                  <td>
                    <select
                      value={order.status}
                      onChange={e => { e.stopPropagation(); updateStatus(order.id, e.target.value); }}
                      onClick={e => e.stopPropagation()}
                      className={`status-badge status-${order.status}`}
                      style={{
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--outline)', whiteSpace: 'nowrap' }}>
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '6px 12px', fontSize: 11, fontWeight: 600 }}
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

        {/* ORDER DETAIL SIDEBAR PANEL */}
        {selectedOrder && (
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-lg, 12px)',
              padding: 24,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              position: 'sticky',
              top: 24,
              maxHeight: 'calc(100vh - 48px)',
              overflowY: 'auto',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <span className={`status-badge status-${selectedOrder.status}`} style={{ marginBottom: 6 }}>
                  {selectedOrder.status}
                </span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, margin: '4px 0 2px' }}>
                  {selectedOrder.order_number}
                </h3>
                <span style={{ fontSize: 11, color: 'var(--outline)' }}>
                  Placed on {new Date(selectedOrder.created_at).toLocaleString('en-IN')}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 22,
                  color: 'var(--outline)',
                  lineHeight: 1,
                  padding: 4,
                }}
                title="Close details"
              >
                ✕
              </button>
            </div>

            {/* Quick Status Update */}
            <div style={{ marginBottom: 20, padding: 12, background: 'var(--surface-container-lowest, #faf9f7)', borderRadius: 8, border: '1px solid var(--outline-variant, #e0ddd5)' }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--outline)', marginBottom: 6 }}>
                Update Order Status
              </label>
              <select
                value={selectedOrder.status}
                onChange={e => updateStatus(selectedOrder.id, e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1px solid var(--outline-variant, #e0ddd5)',
                  fontSize: 13,
                  fontWeight: 600,
                  background: 'white',
                }}
              >
                <option value="pending">⏳ Pending (Under review)</option>
                <option value="confirmed">✅ Confirmed</option>
                <option value="shipped">🚚 Shipped</option>
                <option value="delivered">🎉 Delivered</option>
                <option value="cancelled">❌ Cancelled</option>
              </select>
            </div>

            {/* PRODUCT ITEMS WITH PICTURES */}
            <div style={{ marginBottom: 20, paddingTop: 16, borderTop: '1px solid var(--outline-variant)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h4 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--outline)', margin: 0 }}>
                  Products Ordered ({selectedOrder.items?.reduce((s, i) => s + (i.quantity || 1), 0) || 0})
                </h4>
                <span style={{ fontSize: 11, color: 'var(--outline)' }}>Click image to zoom</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {selectedOrder.items?.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      gap: 12,
                      padding: 12,
                      background: 'var(--surface-container-lowest, #faf9f7)',
                      borderRadius: 10,
                      border: '1px solid var(--outline-variant, #e0ddd5)',
                      alignItems: 'center',
                    }}
                  >
                    {/* Product picture thumbnail */}
                    <div style={{ position: 'relative' }}>
                      <ProductThumbnail
                        src={item.image}
                        alt={item.name}
                        size={60}
                        onClick={() => {
                          if (item.image) {
                            setPreviewImage({
                              url: item.image,
                              name: item.name,
                              variant: [
                                item.size && `Size: ${item.size}`,
                                item.color && `Color: ${item.color}`,
                              ].filter(Boolean).join(' · '),
                              price: item.price,
                              slug: item.slug,
                            });
                          }
                        }}
                      />
                      {item.image && (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 2,
                            right: 2,
                            background: 'rgba(0,0,0,0.6)',
                            color: 'white',
                            borderRadius: 4,
                            padding: '2px 4px',
                            fontSize: 9,
                            lineHeight: 1,
                            pointerEvents: 'none',
                          }}
                        >
                          🔍
                        </div>
                      )}
                    </div>

                    {/* Product details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 13,
                          marginBottom: 4,
                          lineHeight: 1.3,
                          color: 'var(--on-surface)',
                        }}
                      >
                        {item.name}
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
                        {item.size && (
                          <span style={{ fontSize: 11, fontWeight: 600, background: 'white', border: '1px solid var(--outline-variant)', padding: '1px 6px', borderRadius: 4 }}>
                            Size: <strong>{item.size}</strong>
                          </span>
                        )}
                        {item.color && (
                          <span style={{ fontSize: 11, background: 'white', border: '1px solid var(--outline-variant)', padding: '1px 6px', borderRadius: 4, color: 'var(--outline)' }}>
                            Color: <strong>{item.color}</strong>
                          </span>
                        )}
                        <span style={{ fontSize: 11, fontWeight: 700, background: 'var(--primary-energetic)', color: 'white', padding: '1px 6px', borderRadius: 4 }}>
                          Qty: {item.quantity}
                        </span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 12, color: 'var(--outline)' }}>
                          ₹{item.price?.toLocaleString('en-IN')} each
                        </span>
                        <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--primary-energetic)' }}>
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>

                      {item.slug && (
                        <a
                          href={`/product/${item.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-block',
                            marginTop: 4,
                            fontSize: 11,
                            color: 'var(--primary-energetic)',
                            textDecoration: 'none',
                            fontWeight: 600,
                          }}
                        >
                          View on Store ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Details */}
            <div style={{ marginBottom: 16, paddingTop: 16, borderTop: '1px solid var(--outline-variant)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--outline)', margin: 0 }}>
                  Customer
                </h4>
                {selectedOrder.customer_phone && (
                  <a
                    href={`https://wa.me/91${selectedOrder.customer_phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(selectedOrder.customer_name)},%20this%20is%20from%20Sanjpriya%20regarding%20your%20order%20%23${selectedOrder.order_number}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#25D366',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    💬 WhatsApp
                  </a>
                )}
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, margin: '0 0 2px' }}>{selectedOrder.customer_name}</p>
              <p style={{ fontSize: 13, color: 'var(--outline)', margin: '0 0 2px' }}>
                <a href={`mailto:${selectedOrder.customer_email}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  ✉️ {selectedOrder.customer_email}
                </a>
              </p>
              <p style={{ fontSize: 13, color: 'var(--outline)', margin: 0 }}>
                <a href={`tel:${selectedOrder.customer_phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  📞 {selectedOrder.customer_phone}
                </a>
              </p>
            </div>

            {/* Shipping Address */}
            <div style={{ marginBottom: 16, paddingTop: 16, borderTop: '1px solid var(--outline-variant)' }}>
              <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--outline)', marginBottom: 8 }}>
                Shipping Address
              </h4>
              <p style={{ fontSize: 13, margin: '0 0 4px', lineHeight: 1.4 }}>{selectedOrder.address}</p>
              {selectedOrder.landmark && (
                <p style={{ fontSize: 12, margin: '0 0 4px', color: 'var(--primary-energetic)', fontWeight: 600 }}>
                  📍 Landmark: {selectedOrder.landmark}
                </p>
              )}
              <p style={{ fontSize: 13, margin: 0, fontWeight: 500 }}>
                {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}
              </p>
            </div>

            {/* Payment & Order Summary */}
            <div style={{ paddingTop: 16, borderTop: '1px solid var(--outline-variant)' }}>
              <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--outline)', marginBottom: 12 }}>
                Payment Summary ({selectedOrder.payment_method?.toUpperCase() || 'COD'})
              </h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                <span style={{ color: 'var(--outline)' }}>Subtotal</span>
                <span>₹{selectedOrder.subtotal?.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                <span style={{ color: 'var(--outline)' }}>Shipping Fee</span>
                <span>{selectedOrder.shipping === 0 ? 'FREE' : `₹${selectedOrder.shipping}`}</span>
              </div>
              {selectedOrder.razorpay_payment_id && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 6, color: 'var(--outline)' }}>
                  <span>Payment ID</span>
                  <span style={{ fontFamily: 'monospace' }}>{selectedOrder.razorpay_payment_id}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--outline-variant)' }}>
                <span>Total Amount</span>
                <span style={{ color: 'var(--primary-energetic)' }}>
                  ₹{selectedOrder.total?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FULL RESOLUTION IMAGE PREVIEW LIGHTBOX */}
      {previewImage && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: 24,
          }}
          onClick={() => setPreviewImage(null)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 16,
              maxWidth: 520,
              width: '100%',
              maxHeight: '90vh',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              animation: 'fadeIn 0.2s ease',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--outline-variant)' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{previewImage.name}</h4>
                {previewImage.variant && (
                  <span style={{ fontSize: 12, color: 'var(--outline)' }}>{previewImage.variant}</span>
                )}
              </div>
              <button
                onClick={() => setPreviewImage(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 24,
                  cursor: 'pointer',
                  color: 'var(--outline)',
                  lineHeight: 1,
                  padding: 4,
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Image */}
            <div style={{ padding: 20, background: '#f5f4f0', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
              <img
                src={previewImage.url}
                alt={previewImage.name}
                style={{
                  maxHeight: '58vh',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  borderRadius: 8,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                }}
              />
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
              {previewImage.price && (
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary-energetic)' }}>
                  ₹{previewImage.price.toLocaleString('en-IN')}
                </div>
              )}
              <div style={{ display: 'flex', gap: 10, marginLeft: 'auto' }}>
                {previewImage.slug && (
                  <a
                    href={`/product/${previewImage.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: 12 }}
                  >
                    View on Website ↗
                  </a>
                )}
                <button
                  onClick={() => setPreviewImage(null)}
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: 12 }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

