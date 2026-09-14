'use client';
import { useState } from 'react';

export default function FestiveBanner() {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText('BAPPA10');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section style={{
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 50%, var(--heritage-gold) 100%)',
      color: 'white',
      padding: '48px 24px',
      textAlign: 'center',
      boxShadow: '0 8px 32px rgba(138, 28, 41, 0.2)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
    }}>
      {/* Decorative subtle pattern overlay */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        opacity: 0.6,
        pointerEvents: 'none',
      }}></div>

      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(32px, 5vw, 48px)',
        fontWeight: 700,
        letterSpacing: '0.02em',
        textShadow: '0 2px 10px rgba(0,0,0,0.3)',
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        lineHeight: 1.2
      }}>
        <span>Ganesh Chaturthi Special Offer</span>
        <span style={{ animation: 'float 3s ease-in-out infinite', display: 'inline-block' }}>🌺</span>
      </div>
      
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: 'clamp(18px, 2.5vw, 24px)',
        fontWeight: 500,
        letterSpacing: '0.08em',
        opacity: 0.9,
        maxWidth: '700px',
        margin: '0 auto',
        zIndex: 1,
        textTransform: 'uppercase'
      }}>
        Flat 25% OFF on Exclusive Ethnic Collections
      </p>

      <button 
        onClick={handleCopyCode}
        style={{
          marginTop: '12px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          color: 'white',
          padding: '16px 40px',
          borderRadius: '50px',
          fontFamily: 'var(--font-body)',
          fontSize: '18px',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'white';
          e.currentTarget.style.color = 'var(--primary)';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.color = 'white';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        }}
        aria-label="Copy Promo Code"
      >
        {copied ? (
          <>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Code Copied!
          </>
        ) : (
          <>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Use Code: BAPPA10
          </>
        )}
      </button>

      {/* Floating animation keyframes added inline for isolation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      `}} />
    </section>
  );
}
