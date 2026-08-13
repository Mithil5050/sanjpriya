'use client';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';

const heroImages = [
  '/hero.png',
];

const categories = [
  {
    label: 'Explore',
    title: 'Kurtis',
    desc: 'From breezy block prints to regal Anarkalis',
    href: '/kurtis',
    image: '/cat-kurtis.jpg?v=4',
  },
  {
    label: 'Designer',
    title: 'Blouses',
    desc: 'Kanjeevaram silks to contemporary couture',
    href: '/blouses',
    image: '/cat-blouses.jpg',
  },
  {
    label: 'Ethnic',
    title: 'Dresses',
    desc: 'Sharara sets to floor-length Anarkali gowns',
    href: '/dresses',
    image: '/cat-dresses.jpg?v=3',
  },
];





export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [currentHero, setCurrentHero] = useState(0);
  const [newsEmail, setNewsEmail] = useState('');
  const [newsStatus, setNewsStatus] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch('/api/products?limit=20')
      .then(r => r.json())
      .then(d => setFeaturedProducts(d.products || []));
  }, []);



  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newsEmail }),
    });
    const data = await res.json();
    setNewsStatus(data.message || data.error || 'Subscribed!');
    if (res.ok) setNewsEmail('');
  };

  return (
    <>
      {/* ───── HERO ───── */}
      <section className="hero" ref={heroRef} id="hero">
        <div className="hero-bg" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
          {heroImages.map((img, i) => (
            <img
              key={img}
              src={img}
              alt="Sanjpriya Hero"
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                opacity: i === currentHero ? 1 : 0,
                transition: 'opacity 1.2s ease',
              }}
            />
          ))}
        </div>

        <div className="hero-content">
          <div className="hero-eyebrow">Heritage Moderne</div>
          <h1>
            Where Heritage <em>Meets</em><br />Contemporary Grace
          </h1>
          <p className="hero-subtitle">
            Discover Sanjpriya's curated collection of premium Indian ethnic wear — every thread tells a story of centuries of craftsmanship.
          </p>
          <div className="hero-actions">
            <Link href="/kurtis" className="btn btn-primary btn-lg">
              Explore Collection
            </Link>
            <Link href="/dresses" className="btn" style={{
              background: 'transparent', color: 'var(--on-surface)',
              backdropFilter: 'blur(8px)', border: '1px solid var(--outline)',
              padding: '18px 40px', fontSize: 14, letterSpacing: '0.15em',
              textTransform: 'uppercase', fontWeight: 700, fontFamily: 'var(--font-body)',
              borderRadius: 'var(--radius)', cursor: 'pointer',
            }}>
              View Dresses
            </Link>
          </div>
        </div>


      </section>

      {/* ───── ANNOUNCEMENT STRIP ───── */}
      <div style={{
        background: 'var(--primary-energetic)', color: 'white',
        textAlign: 'center', padding: '12px',
        fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700, letterSpacing: '0.15em',
      }}>
        ✦ FREE SHIPPING ON ORDERS ABOVE ₹1999 ✦ USE CODE SANJPRIYA10 FOR 10% OFF ✦ NEW COLLECTION NOW LIVE ✦
      </div>

      {/* ───── CATEGORIES ───── */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <span className="overline">Shop by Category</span>
            <h2>Curated for You</h2>
            <p>Three categories, one vision — celebrating the art of Indian ethnic fashion.</p>
          </div>
          <div className="category-grid">
            {categories.map(cat => (
              <Link key={cat.href} href={cat.href} className="category-card">
                <img src={cat.image} alt={cat.title} />
                <div className="category-card-overlay">
                  <div className="category-card-label">{cat.label}</div>
                  <div className="category-card-title">{cat.title}</div>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 12, fontFamily: 'var(--font-body)' }}>
                    {cat.desc}
                  </p>
                  <div className="category-card-cta">
                    Shop Now
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───── FEATURED PRODUCTS ───── */}
      <section className="section" style={{ background: 'var(--surface-cream)' }}>
        <div className="container">
          <div className="section-header">
            <span className="overline">Discover Our Range</span>
            <h2>New Arrivals</h2>
            <p>Our most loved styles — celebrated by women across India.</p>
          </div>
          {featuredProducts.length > 0 ? (
            <div className="product-grid">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="product-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <div className="skeleton" style={{ aspectRatio: '3/4', marginBottom: 12 }} />
                  <div className="skeleton" style={{ height: 18, marginBottom: 8, borderRadius: 4 }} />
                  <div className="skeleton" style={{ height: 14, width: '60%', borderRadius: 4 }} />
                </div>
              ))}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link href="/kurtis" className="btn btn-ghost">
              View All Collections →
            </Link>
          </div>
        </div>
      </section>

      {/* ───── FEATURED BANNER ───── */}
      <section className="featured-banner">
        <div className="featured-banner-inner">
          <div className="featured-banner-text">
            <span className="overline">The Art of Craft</span>
            <h2>Every Stitch <em>Tells</em> a Story</h2>
            <p>
              From the looms of Varanasi to the ateliers of Lucknow, each Sanjpriya piece is sourced from master craftspeople preserving India's most treasured textile traditions. When you wear Sanjpriya, you wear generations of skill.
            </p>
            <Link href="/blouses" className="btn btn-gold">
              Explore Blouses
            </Link>
          </div>
          <div className="featured-banner-image">
            <img
              src="/heritage-craft.jpg?v=2"
              alt="Heritage Craftsmanship"
            />
          </div>
        </div>
      </section>



      {/* ───── NEWSLETTER ───── */}
      <section className="newsletter-section">
        <div className="container">
          <span className="overline" style={{ display: 'block', marginBottom: 12 }}>Stay Connected</span>
          <h2>Join the Sanjpriya Circle</h2>
          <p>Be the first to know about new arrivals, exclusive offers, and heritage stories.</p>
          <form className="newsletter-form" onSubmit={handleNewsletter}>
            <input
              type="email"
              placeholder="Your email address"
              value={newsEmail}
              onChange={e => setNewsEmail(e.target.value)}
              required
              aria-label="Email address for newsletter"
            />
            <button type="submit">Subscribe</button>
          </form>
          {newsStatus && (
            <p style={{ marginTop: 12, fontSize: 14, color: 'var(--primary-energetic)', fontWeight: 600 }}>
              {newsStatus}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
