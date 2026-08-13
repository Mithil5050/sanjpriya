import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Return, Shipping & Privacy Policy',
  description: 'Sanjpriya Creations policies — returns, refunds, shipping, privacy, and terms.',
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: '40px' }}>
    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '16px', color: 'var(--on-surface)' }}>
      {title}
    </h2>
    <div style={{ color: 'var(--on-surface)', lineHeight: '1.9' }}>{children}</div>
  </section>
);

const Bullet = ({ children }: { children: React.ReactNode }) => (
  <li style={{ marginBottom: '8px' }}>{children}</li>
);

export default function PolicyPage() {
  return (
    <div style={{
      maxWidth: '820px',
      margin: '0 auto',
      padding: '40px 20px',
      paddingTop: 'calc(var(--nav-height) + 40px)',
    }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '42px', marginBottom: '8px' }}>
        Policies
      </h1>
      <p style={{ color: 'var(--on-surface-variant)', marginBottom: '48px', fontSize: '15px' }}>
        Last updated: August 2026
      </p>

      <Section title="1. Return & Refund Policy">
        <ul style={{ paddingLeft: '20px', margin: '0 0 16px 0' }}>
          <Bullet>
            <strong>Return Window:</strong> You can request a return or exchange within <strong>5 days</strong> of receiving your order if there is a defect or issue.
          </Bullet>
          <Bullet>
            <strong>Conditions:</strong>
            <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
              <Bullet>The product must be unused, unwashed, with all original tags intact, and in its original condition.</Bullet>
              <Bullet>An <strong>unboxing video</strong> is mandatory while opening the package to verify any damage or missing items.</Bullet>
            </ul>
          </Bullet>
          <Bullet>
            <strong>Refunds:</strong> Once the returned product is received and inspected, refunds will be processed within <strong>5 to 7 business days</strong> to your original payment method. For COD orders, bank details will be collected.
          </Bullet>
        </ul>
      </Section>

      <Section title="2. Shipping & Delivery Policy">
        <ul style={{ paddingLeft: '20px', margin: 0 }}>
          <Bullet>
            <strong>Delivery Time:</strong> Orders are typically delivered within <strong>3 to 7 business days</strong> from the date of confirmation.
          </Bullet>
          <Bullet>
            <strong>Shipping Charges:</strong>
            <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
              <Bullet>Free shipping may apply to all <strong>Prepaid</strong> orders.</Bullet>
              <Bullet>An additional <strong>COD charge</strong> is applicable for <strong>Cash on Delivery</strong> orders.</Bullet>
            </ul>
          </Bullet>
          <Bullet>
            <strong>Courier Partners:</strong> We ship across India through our trusted delivery partners via Shiprocket / Delhivery.
          </Bullet>
        </ul>
      </Section>

      <Section title="3. Privacy Policy">
        <ul style={{ paddingLeft: '20px', margin: 0 }}>
          <Bullet>Sanjpriya respects your privacy.</Bullet>
          <Bullet>
            We collect your personal information (name, address, phone number, email) strictly to process and deliver your orders.
          </Bullet>
          <Bullet>
            Your data is never sold or shared with any third party. Our website uses secure payment gateways to ensure your financial details remain safe.
          </Bullet>
        </ul>
      </Section>

      <Section title="4. Terms and Conditions">
        <ul style={{ paddingLeft: '20px', margin: 0 }}>
          <Bullet>
            By using the Sanjpriya website, you agree to all our terms and conditions.
          </Bullet>
          <Bullet>
            Product colors and designs displayed on the website may slightly vary due to screen resolution and lighting during photography.
          </Bullet>
          <Bullet>
            All content, images, and brand rights of Sanjpriya are strictly protected and cannot be used without permission.
          </Bullet>
        </ul>
      </Section>

      <div style={{
        borderTop: '1px solid var(--outline-variant)',
        paddingTop: '32px',
        marginTop: '16px',
        color: 'var(--on-surface-variant)',
        fontSize: '14px'
      }}>
        For any queries regarding our policies, reach us at: <strong>priyankakhodve47@gmail.com</strong>
      </div>
    </div>
  );
}
