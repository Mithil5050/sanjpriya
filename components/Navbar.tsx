'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from './CartProvider';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/kurtis', label: 'Kurtis' },
  { href: '/blouses', label: 'Blouses' },
  { href: '/dresses', label: 'Dresses' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const navClass = `navbar ${isHome && !scrolled ? 'transparent' : 'scrolled'}`;

  return (
    <>
      <nav className={navClass} role="navigation" aria-label="Main navigation">
        <div className="navbar-inner">
          {/* Left logo */}
          <div className="navbar-left">
            <Link href="/" className="navbar-logo" aria-label="Sanjpriya Home" style={{ display: 'flex', alignItems: 'center' }}>
              <img src="/logo.jpg" alt="Sanjpriya Logo" style={{ height: '64px', width: 'auto', objectFit: 'contain' }} />
            </Link>
          </div>

          {/* Center nav links */}
          <div className="navbar-center" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="navbar-nav" style={{ display: 'flex' }}>
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={pathname === link.href ? 'active' : ''}
                  style={{ margin: '0 14px' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right icons */}
          <div className="navbar-right">

            {/* Search */}
            <Link href="/search" className="nav-icon-btn" aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </Link>

            {/* Account */}
            <Link href="/account" className="nav-icon-btn" aria-label="Account">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </Link>

            {/* Cart */}
            <Link href="/cart" className="nav-icon-btn" aria-label={`Cart (${totalItems} items)`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {totalItems > 0 && (
                <span className="cart-count">{totalItems > 9 ? '9+' : totalItems}</span>
              )}
            </Link>

            {/* Hamburger */}
            <button
              className="nav-hamburger"
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Menu"
              aria-expanded={mobileOpen}
            >
              <span style={{ transform: mobileOpen ? 'rotate(45deg) translate(5px, 5px)' : undefined }} />
              <span style={{ opacity: mobileOpen ? 0 : 1 }} />
              <span style={{ transform: mobileOpen ? 'rotate(-45deg) translate(5px, -5px)' : undefined }} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: 'var(--nav-height)', left: 0, right: 0, bottom: 0,
          background: 'rgba(37,25,23,0.5)', zIndex: 999,
        }} onClick={() => setMobileOpen(false)}>
          <div style={{
            background: 'var(--surface-container-lowest)',
            padding: '24px',
            display: 'flex', flexDirection: 'column', gap: '4px',
          }} onClick={e => e.stopPropagation()}>
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: '14px 0',
                  borderBottom: '1px solid var(--outline-variant)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: pathname === link.href ? 'var(--primary-energetic)' : 'var(--on-surface)',
                  display: 'block',
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/cart" style={{
              marginTop: '16px', display: 'block', textAlign: 'center',
            }}>
              <span className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                🛍 Cart ({totalItems})
              </span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
