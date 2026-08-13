'use client';
import Link from 'next/link';
import { useState } from 'react';

function QuickLink({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={href}
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase' as const,
        color: hovered ? 'var(--primary-energetic)' : 'var(--on-surface-variant)',
        textDecoration: 'none',
        borderBottom: hovered ? '2px solid var(--primary-energetic)' : '2px solid transparent',
        paddingBottom: 2,
        transition: 'color 200ms ease, border-color 200ms ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
    </Link>
  );
}

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      textAlign: 'center',
      padding: '40px 20px',
      background: 'var(--surface-cream)',
    }}>
      {/* Decorative number */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(100px, 20vw, 180px)',
        fontWeight: 800,
        lineHeight: 1,
        background: 'linear-gradient(135deg, var(--primary-energetic), var(--heritage-gold))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: 8,
        userSelect: 'none',
      }}>
        404
      </div>

      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: 'var(--outline)',
        marginBottom: 24,
      }}>
        Page Not Found
      </div>

      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(24px, 4vw, 36px)',
        fontWeight: 700,
        color: 'var(--on-surface)',
        marginBottom: 16,
        maxWidth: 500,
      }}>
        This thread seems to have unravelled
      </h1>

      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: 16,
        color: 'var(--on-surface-variant)',
        marginBottom: 40,
        maxWidth: 420,
        lineHeight: 1.7,
      }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back to the collection.
      </p>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/" className="btn btn-primary btn-lg">
          Go to Homepage
        </Link>
        <Link href="/kurtis" className="btn btn-ghost btn-lg">
          Browse Kurtis
        </Link>
      </div>

      {/* Quick category links */}
      <div style={{
        marginTop: 48,
        display: 'flex',
        gap: 24,
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        <QuickLink href="/kurtis" label="👘 Kurtis" />
        <QuickLink href="/blouses" label="👚 Blouses" />
        <QuickLink href="/dresses" label="👗 Dresses" />
        <QuickLink href="/search" label="🔍 Search" />
      </div>
    </div>
  );
}
