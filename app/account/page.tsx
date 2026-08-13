import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function AccountDashboard() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
      }
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch orders for this user
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div style={{
      minHeight: '80vh',
      padding: '40px 20px',
      paddingTop: 'calc(var(--nav-height) + 40px)',
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', marginBottom: '8px' }}>
            My Account
          </h1>
          <p style={{ color: 'var(--on-surface-variant)' }}>
            Welcome back, {user.user_metadata?.full_name || user.email}
          </p>
        </div>
        
        {/* Sign Out Button - This would typically be a client component, but we can use a server action or simple link to an api route */}
        <form action="/api/auth/signout" method="POST">
          <button type="submit" className="btn btn-secondary btn-sm">
            Sign Out
          </button>
        </form>
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '32px', boxShadow: 'var(--shadow-soft)' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '24px' }}>
          Order History
        </h2>

        {error ? (
          <p style={{ color: 'var(--error)' }}>Failed to load orders.</p>
        ) : !orders || orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--on-surface-variant)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛍️</div>
            <p>You haven't placed any orders yet.</p>
            <Link href="/" className="btn btn-primary" style={{ marginTop: '20px' }}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="admin-table">
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--outline-variant)' }}>
                  <th style={{ padding: '12px 16px', color: 'var(--on-surface-variant)' }}>Order #</th>
                  <th style={{ padding: '12px 16px', color: 'var(--on-surface-variant)' }}>Date</th>
                  <th style={{ padding: '12px 16px', color: 'var(--on-surface-variant)' }}>Items</th>
                  <th style={{ padding: '12px 16px', color: 'var(--on-surface-variant)' }}>Total</th>
                  <th style={{ padding: '12px 16px', color: 'var(--on-surface-variant)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--outline-variant)' }}>
                    <td style={{ padding: '16px', fontWeight: 600 }}>{order.order_number}</td>
                    <td style={{ padding: '16px', color: 'var(--on-surface-variant)' }}>
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '16px' }}>
                      {order.items?.length || 0} items
                    </td>
                    <td style={{ padding: '16px', fontWeight: 700, color: 'var(--primary-energetic)' }}>
                      ₹{order.total.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span className={`badge ${order.status === 'delivered' ? 'badge-primary' : 'badge-cream'}`} style={{ textTransform: 'capitalize' }}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
