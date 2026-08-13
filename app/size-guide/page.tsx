
export default function SizeGuidePage() {
  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', padding: '40px 20px', paddingTop: 'calc(var(--nav-height) + 40px)', minHeight: '70vh' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '42px', marginBottom: '24px' }}>Size Guide</h1>
      <div style={{ lineHeight: '1.9', color: 'var(--on-surface)' }}>
        <p style={{ marginBottom: '24px' }}>
          Use the chart below to find your perfect fit. Measurements are in inches.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginBottom: '24px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--outline-variant)' }}>
              <th style={{ padding: '12px' }}>Size</th>
              <th style={{ padding: '12px' }}>Bust</th>
              <th style={{ padding: '12px' }}>Waist</th>
              <th style={{ padding: '12px' }}>Hip</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--outline-variant)' }}>
              <td style={{ padding: '12px' }}>XS</td><td style={{ padding: '12px' }}>32"</td><td style={{ padding: '12px' }}>26"</td><td style={{ padding: '12px' }}>36"</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--outline-variant)' }}>
              <td style={{ padding: '12px' }}>S</td><td style={{ padding: '12px' }}>34"</td><td style={{ padding: '12px' }}>28"</td><td style={{ padding: '12px' }}>38"</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--outline-variant)' }}>
              <td style={{ padding: '12px' }}>M</td><td style={{ padding: '12px' }}>36"</td><td style={{ padding: '12px' }}>30"</td><td style={{ padding: '12px' }}>40"</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--outline-variant)' }}>
              <td style={{ padding: '12px' }}>L</td><td style={{ padding: '12px' }}>38"</td><td style={{ padding: '12px' }}>32"</td><td style={{ padding: '12px' }}>42"</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--outline-variant)' }}>
              <td style={{ padding: '12px' }}>XL</td><td style={{ padding: '12px' }}>40"</td><td style={{ padding: '12px' }}>34"</td><td style={{ padding: '12px' }}>44"</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--outline-variant)' }}>
              <td style={{ padding: '12px' }}>XXL</td><td style={{ padding: '12px' }}>42"</td><td style={{ padding: '12px' }}>36"</td><td style={{ padding: '12px' }}>46"</td>
            </tr>
          </tbody>
        </table>
        <p><em>Note: Fits may vary by style or personal preference.</em></p>
      </div>
    </div>
  );
}
