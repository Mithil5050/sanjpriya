import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          {/* Brand */}
          <div className="footer-brand">
            <div className="logo">SANJPRIYA</div>
            <div className="tagline">Heritage Moderne</div>
            <p>
              Celebrating the rich tapestry of Indian craftsmanship through
              contemporary ethnic fashion. Each piece is a story of heritage,
              artisanship, and timeless beauty.
            </p>
            <div className="footer-social">
              {/* Instagram */}
              <a href="https://www.instagram.com/sanjpriya_creations?igsh=Y2NkenVvcmNpdHBt" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              {/* Facebook */}
              <a href="https://www.facebook.com/share/19aPC85a6b/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              {/* Pinterest */}
              <a href="#" aria-label="Pinterest" title="Pinterest">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.428 1.808-2.428.852 0 1.265.64 1.265 1.408 0 .858-.546 2.14-.828 3.33-.236.995.499 1.806 1.476 1.806 1.772 0 3.137-1.868 3.137-4.563 0-2.386-1.715-4.054-4.163-4.054-2.837 0-4.5 2.127-4.5 4.326 0 .856.33 1.775.741 2.276a.3.3 0 0 1 .069.286c-.076.313-.244.995-.277 1.134-.044.183-.145.222-.335.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.967-.527-2.292-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
                </svg>
              </a>
              {/* WhatsApp */}
              <a href="https://wa.me/919322001658" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" title="WhatsApp">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="footer-col">
            <h4>Shop</h4>
            <ul>
              <li><Link href="/kurtis">Kurtis</Link></li>
              <li><Link href="/blouses">Blouses</Link></li>
              <li><Link href="/dresses">Dresses</Link></li>
              <li><Link href="/search?badge=New+Arrival">New Arrivals</Link></li>
              <li><Link href="/search?badge=Heritage+Collection">Heritage Collection</Link></li>
              <li><Link href="/search?badge=Premium">Premium</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div className="footer-col">
            <h4>Help</h4>
            <ul>
              <li><Link href="/about">About Sanjpriya</Link></li>
              <li><Link href="/size-guide">Size Guide</Link></li>
              <li><Link href="/refund-policy#shipping">Shipping Info</Link></li>
              <li><Link href="/refund-policy#return">Returns & Exchanges</Link></li>
              <li><Link href="/care-guide">Care Guide</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Policy */}
          <div className="footer-col">
            <h4>Policies</h4>
            <ul>
              <li><Link href="/refund-policy">Policies</Link></li>
              <li><Link href="/refund-policy#return">Return & Refund</Link></li>
              <li><Link href="/refund-policy#shipping">Shipping</Link></li>
              <li><Link href="/account">My Account</Link></li>
              <li><Link href="/admin">Admin Panel</Link></li>
            </ul>
            <div style={{ marginTop: 24 }}>
              <h4>Contact</h4>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, marginTop: 8 }}>
                📍 Pune, Maharashtra<br/>
                📞 +91 9322001658<br/>
                ✉️ priyankakhodve47@gmail.com
              </p>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="footer-bottom">
          <p>© {year} Sanjpriya. All rights reserved. Crafted with ♥ in India.</p>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>We accept:</span>
            {['💳 UPI', '🏦 Net Banking', '💰 COD'].map(p => (
              <span key={p} style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: '0.05em' }}>{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
