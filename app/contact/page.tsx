
export default function ContactPage() {
  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', padding: '40px 20px', paddingTop: 'calc(var(--nav-height) + 40px)', minHeight: '70vh' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '42px', marginBottom: '24px' }}>Contact Us</h1>
      <div style={{ lineHeight: '1.9', color: 'var(--on-surface)' }}>
        <p style={{ marginBottom: '24px' }}>
          We would love to hear from you! Whether you have a question about an order, need sizing advice, or just want to say hello, we are here to help.
        </p>
        <div style={{ background: 'var(--surface-cream)', padding: '32px', borderRadius: 'var(--radius)', marginBottom: '32px' }}>
          <h3 style={{ marginBottom: '16px' }}>Get in Touch</h3>
          <p style={{ marginBottom: '12px' }}><strong>📍 Location:</strong> Pune, Maharashtra</p>
          <p style={{ marginBottom: '12px' }}><strong>📞 Phone / WhatsApp:</strong> +91 9322001658</p>
          <p style={{ marginBottom: '12px' }}><strong>✉️ Email:</strong> <a href="mailto:priyankakhodve47@gmail.com" style={{ color: 'var(--primary-energetic)' }}>priyankakhodve47@gmail.com</a></p>
        </div>
        <p>Our support team is available Monday to Saturday, 10 AM to 6 PM IST. We aim to respond to all emails within 24 hours.</p>
      </div>
    </div>
  );
}
