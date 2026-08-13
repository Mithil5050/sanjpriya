'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

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
          <div className="stat-value">3</div>
          <div className="stat-label">Categories</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
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
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentOrders.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--outline)', padding: 24 }}>No orders yet</td></tr>
              )}
              {stats?.recentOrders.map(order => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 700, color: 'var(--primary-energetic)' }}>{order.order_number}</td>
                  <td>{order.customer_name}</td>
                  <td>₹{order.total.toLocaleString('en-IN')}</td>
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
