'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/products', label: 'Products', icon: '👗' },
  { href: '/admin/products/new', label: 'Add Product', icon: '➕' },
  { href: '/admin/orders', label: 'Orders', icon: '📦' },
  { href: '/admin/reviews', label: 'Reviews', icon: '⭐' },
  { href: '/', label: '← Back to Store', icon: '🏪' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) console.error('Session error:', error);
      if (!session && pathname !== '/admin/login') {
        router.push('/admin/login');
      } else if (session && pathname === '/admin/login') {
        router.push('/admin');
      } else {
        setAuthenticated(!!session);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session && pathname !== '/admin/login') {
        router.push('/admin/login');
      } else if (session && pathname === '/admin/login') {
        router.push('/admin');
      } else {
        setAuthenticated(!!session);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [pathname, router]);

  // Aggressive Session Timeout (15 minutes of inactivity)
  useEffect(() => {
    if (!authenticated || pathname === '/admin/login') return;

    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      // Set to 15 minutes (900000 ms)
      timeoutId = setTimeout(async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
      }, 900000);
    };

    // Initialize timer
    resetTimer();

    // Listen to activity events
    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    
    // Throttle the resets so we aren't calling clearTimeout 60 times a second on mousemove
    let isThrottled = false;
    const handleActivity = () => {
      if (!isThrottled) {
        resetTimer();
        isThrottled = true;
        setTimeout(() => (isThrottled = false), 1000); // Only reset timer max once per second
      }
    };

    events.forEach(event => document.addEventListener(event, handleActivity));

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => document.removeEventListener(event, handleActivity));
    };
  }, [authenticated, pathname, router]);

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Admin...</div>;
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <div className="admin-layout" style={{ minHeight: '100vh', display: 'flex' }}>
      <aside className="admin-sidebar" style={{ width: '250px', background: 'var(--inverse-surface)', color: 'white', position: 'fixed', height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div className="admin-brand" style={{ padding: '32px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="name" style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700 }}>SANJPRIYA</div>
          <div className="sub" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--heritage-gold)' }}>Admin Panel</div>
        </div>
        <nav style={{ padding: '24px 0', flex: 1 }}>
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-item ${pathname === item.href ? 'active' : ''}`}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px',
                color: pathname === item.href ? 'var(--primary-energetic)' : 'white',
                background: pathname === item.href ? 'rgba(255,255,255,0.05)' : 'transparent',
                textDecoration: 'none', fontSize: '14px', fontWeight: pathname === item.href ? 700 : 400,
                borderLeft: pathname === item.href ? '3px solid var(--primary-energetic)' : '3px solid transparent'
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🚪</span> Sign Out
          </button>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em', marginTop: '16px' }}>
            Sanjpriya v1.0<br/>Heritage Moderne
          </p>
        </div>
      </aside>

      <main className="admin-main" style={{ flex: 1, marginLeft: '250px', background: 'var(--surface-cream)', padding: '40px' }}>
        {children}
      </main>
    </div>
  );
}
