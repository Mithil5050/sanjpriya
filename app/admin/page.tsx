'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
  size?: string;
  color?: string;
  slug?: string;
}

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: Array<{
    id: number;
    order_number: string;
    customer_name: string;
    total: number;
    status: string;
    created_at: string;
    items?: OrderItem[];
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    Promise.all([
      fetch('/api/products?limit=1').then(r => r.json()),
      fetch('/api/orders').then(r => r.json()),
    ]).then(([pData, orders]) => {
      const totalRevenue = orders.reduce((sum: number, o: { total: number }) => sum + o.total, 0);
      setStats({
        totalProducts: pData.total || 0,
        totalOrders: orders.length,
        totalRevenue,
        recentOrders: orders.slice(0, 5),
      });
    });
  }, []);

  const categoryBreakdown = [
    { label: 'Kurtis', icon: '👘', link: '/kurtis' },
    { label: 'Blouses', icon: '👚', link: '/blouses' },
    { label: 'Dresses', icon: '👗', link: '/dresses' },
    { label: 'Handbags', icon: '👜', link: '/handbags' },
    { label: 'Paithani Blouses', icon: '🌺', link: '/paithani-blouses' },
  ];

  return (
    <div>
      <div className="admin-header">
        <h1>Dashboard</h1>
        <p style={{ color: 'var(--on-surface-variant)', fontSize: 14 }}>
          Welcome back! Here's what's happening at Sanjpriya.
        </p>
      </div>

      {/* Stats */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-value">{stats?.totalProducts ?? '—'}</div>
          <div className="stat-label">Total Products</div>
        </div>
        <div className="admin-stat-card gold">
          <div className="stat-value">{stats?.totalOrders ?? '—'}</div>
          <div className="stat-label">Total Orders</div>
        </div>
        <div className="admin-stat-card green">
          <div className="stat-value">₹{stats ? stats.totalRevenue.toLocaleString('en-IN') : '—'}</div>
          <div className="stat-label">Total Revenue</div>
        </div>
        <div className="admin-stat-card secondary">
          <div className="stat-value">5</div>
          <div className="stat-label">Categories</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 0.65fr', gap: 24 }}>
        {/* Recent Orders */}
        <div className="admin-table">
          <div style={{ padding: '20px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>Recent Orders</h3>
            <Link href="/admin/orders" style={{ fontSize: 12, color: 'var(--primary-energetic)', fontWeight: 700 }}>View All →</Link>
          </div>
          <table>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentOrders.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--outline)', padding: 24 }}>No orders yet</td></tr>
              )}
              {stats?.recentOrders.map(order => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 700, color: 'var(--primary-energetic)' }}>
                    <Link href="/admin/orders" style={{ color: 'inherit', textDecoration: 'none' }}>
                      {order.order_number}
                    </Link>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{order.customer_name}</div>
                  </td>
                  <td>
                    {order.items && order.items.length > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {order.items[0].image ? (
                          <img
                            src={order.items[0].image}
                            alt={order.items[0].name}
                            style={{ width: 34, height: 42, objectFit: 'cover', borderRadius: 4, border: '1px solid var(--outline-variant)' }}
                          />
                        ) : (
                          <div style={{ width: 34, height: 42, borderRadius: 4, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>
                            👗
                          </div>
                        )}
                        <div style={{ maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12, fontWeight: 600 }}>
                          {order.items[0].name}
                          {order.items.length > 1 && (
                            <span style={{ color: 'var(--outline)', fontSize: 11, fontWeight: 400 }}> +{order.items.length - 1}</span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--outline)', fontSize: 12 }}>—</span>
                    )}
                  </td>
                  <td style={{ fontWeight: 700 }}>₹{order.total.toLocaleString('en-IN')}</td>
                  <td>
                    <span className={`status-badge status-${order.status}`}>{order.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Actions */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link href="/admin/products/new" className="btn btn-primary" style={{ justifyContent: 'center' }}>
              + Add New Product
            </Link>
            <Link href="/admin/orders" className="btn btn-ghost" style={{ justifyContent: 'center' }}>
              View All Orders
            </Link>
            <Link href="/" className="btn btn-ghost" style={{ justifyContent: 'center' }}>
              Visit Store
            </Link>
          </div>

          <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--outline-variant)' }}>
            <h4 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--outline)', marginBottom: 16 }}>
              Collections
            </h4>
            {categoryBreakdown.map(cat => (
              <div key={cat.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 14 }}>{cat.icon} {cat.label}</span>
                <Link href={cat.link} style={{ fontSize: 12, color: 'var(--primary-energetic)', fontWeight: 700 }}>View →</Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
