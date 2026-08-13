
export default function AboutPage() {
  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', padding: '40px 20px', paddingTop: 'calc(var(--nav-height) + 40px)', minHeight: '70vh' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '42px', marginBottom: '24px' }}>About Sanjpriya</h1>
      <div style={{ lineHeight: '1.9', color: 'var(--on-surface)' }}>
        <p style={{ marginBottom: '16px' }}>
          Sanjpriya Creations is dedicated to bringing you the finest ethnic wear, blending traditional Indian craftsmanship with contemporary designs.
        </p>
        <p style={{ marginBottom: '16px' }}>
          We work closely with artisans across India to source authentic fabrics and create exquisite Kurtis, Blouses, and Dresses. Our mission is to celebrate the art of Indian textiles while providing you with premium quality and elegant styles.
        </p>
      </div>
    </div>
  );
}
