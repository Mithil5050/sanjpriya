
export default function CareGuidePage() {
  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', padding: '40px 20px', paddingTop: 'calc(var(--nav-height) + 40px)', minHeight: '70vh' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '42px', marginBottom: '24px' }}>Care Guide</h1>
      <div style={{ lineHeight: '1.9', color: 'var(--on-surface)' }}>
        <h3 style={{ marginBottom: '12px', color: 'var(--primary-energetic)' }}>Cottons & Linens</h3>
        <p style={{ marginBottom: '24px' }}>Hand wash in cold water with mild detergent. Dry in shade to prevent color fading. Iron on medium heat.</p>
        
        <h3 style={{ marginBottom: '12px', color: 'var(--primary-energetic)' }}>Silks & Embroidered Garments</h3>
        <p style={{ marginBottom: '24px' }}>Strictly dry clean only. Store in a breathable cotton bag and avoid direct contact with perfumes or deodorants.</p>

        <h3 style={{ marginBottom: '12px', color: 'var(--primary-energetic)' }}>Chanderi & Delicate Fabrics</h3>
        <p style={{ marginBottom: '24px' }}>Dry clean recommended. If hand washing, do not soak. Wash separately in cold water and dry flat in shade.</p>
      </div>
    </div>
  );
}
