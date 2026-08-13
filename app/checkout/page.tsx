'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';
import { useToast } from '@/components/ToastProvider';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { showToast } = useToast();
  const router = useRouter();
  const shipping = subtotal >= 1999 ? 0 : 149;
  const total = subtotal + shipping;

  const [form, setForm] = useState({
    customerName: '', customerEmail: '', customerPhone: '',
    address: '', city: '', state: '', pincode: '',
    paymentMethod: 'cod',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(err => ({ ...err, [e.target.name]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.customerName.trim()) newErrors.customerName = 'Name is required';
    if (!form.customerEmail.includes('@')) newErrors.customerEmail = 'Valid email required';
    if (form.customerPhone.length < 10) newErrors.customerPhone = 'Valid phone required';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.state.trim()) newErrors.state = 'State is required';
    if (form.pincode.length !== 6) newErrors.pincode = 'Valid 6-digit pincode required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (items.length === 0) { showToast('Your cart is empty!', 'error'); return; }

    setLoading(true);

    const isPrepaid = form.paymentMethod !== 'cod';

    if (isPrepaid) {
      const res = await loadRazorpay();
      if (!res) {
        showToast('Failed to load payment gateway. Check your connection.', 'error');
        setLoading(false);
        return;
      }

      try {
        const orderRes = await fetch('/api/payment/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: total })
        });
        const orderData = await orderRes.json();

        if (!orderData.success) {
          showToast('Failed to initialize payment.', 'error');
          setLoading(false);
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '', // Make sure this is in .env.local
          amount: orderData.order.amount,
          currency: orderData.order.currency,
          name: 'Sanjpriya Creations',
          description: 'Order Payment',
          order_id: orderData.order.id,
          prefill: {
            name: form.customerName,
            email: form.customerEmail,
            contact: form.customerPhone
          },
          handler: async function (response: any) {
            // Payment success callback
            await submitFinalOrder({
              ...form,
              paymentMethod: 'prepaid',
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });
          },
          theme: {
            color: '#c95d3c'
          },
          modal: {
            ondismiss: function() {
              setLoading(false);
            }
          }
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.on('payment.failed', function (response: any) {
          showToast(response.error.description || 'Payment Failed', 'error');
          setLoading(false);
        });
        paymentObject.open();

      } catch (err) {
        showToast('Error initializing payment.', 'error');
        setLoading(false);
      }
    } else {
      // COD Flow
      await submitFinalOrder({ ...form, paymentMethod: 'cod' });
    }
  };

  const submitFinalOrder = async (orderData: any) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...orderData, items, subtotal, shipping, total }),
      });
      const data = await res.json();
      if (res.ok) {
        // Trigger order confirmation email in the background
        fetch('/api/emails/order-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderNumber: data.orderNumber,
            customerName: form.customerName,
            customerEmail: form.customerEmail,
            total,
            items
          })
        }).catch(err => console.error('Failed to trigger email:', err));

        clearCart();
        showToast(`Order ${data.orderNumber} placed successfully! 🎉`);
        router.push(`/order-success?order=${data.orderNumber}`);
      } else {
        showToast(data.error || 'Failed to place order. Please try again.', 'error');
      }
    } catch {
      showToast('Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="empty-state" style={{ paddingTop: 'calc(var(--nav-height) + 80px)', minHeight: '80vh' }}>
        <div className="empty-state-icon">🛍</div>
        <h3>Nothing to checkout</h3>
        <p>Add some products to your cart first.</p>
        <Link href="/" className="btn btn-primary">Start Shopping</Link>
      </div>
    );
  }

  const states = ['Andhra Pradesh', 'Delhi', 'Gujarat', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'];

  return (
    <div className="checkout-page">
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span className="separator">/</span>
        <Link href="/cart">Cart</Link>
        <span className="separator">/</span>
        <span className="current">Checkout</span>
      </div>

      <h1 className="checkout-title">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="checkout-grid">
          {/* Left: form */}
          <div>
            {/* Contact */}
            <div className="form-section">
              <div className="form-section-title">Contact Information</div>
              <div className="form-row">
                <div className="input-field">
                  <input type="text" name="customerName" id="customerName" placeholder=" " value={form.customerName} onChange={handleChange} required />
                  <label htmlFor="customerName">Full Name *</label>
                  {errors.customerName && <span style={{ color: 'var(--error)', fontSize: 12 }}>{errors.customerName}</span>}
                </div>
                <div className="input-field">
                  <input type="email" name="customerEmail" id="customerEmail" placeholder=" " value={form.customerEmail} onChange={handleChange} required />
                  <label htmlFor="customerEmail">Email Address *</label>
                  {errors.customerEmail && <span style={{ color: 'var(--error)', fontSize: 12 }}>{errors.customerEmail}</span>}
                </div>
              </div>
              <div className="input-field">
                <input type="tel" name="customerPhone" id="customerPhone" placeholder=" " value={form.customerPhone} onChange={handleChange} maxLength={10} required />
                <label htmlFor="customerPhone">Phone Number *</label>
                {errors.customerPhone && <span style={{ color: 'var(--error)', fontSize: 12 }}>{errors.customerPhone}</span>}
              </div>
            </div>

            {/* Shipping */}
            <div className="form-section">
              <div className="form-section-title">Shipping Address</div>
              <div className="input-field">
                <textarea name="address" id="address" placeholder=" " value={form.address} onChange={handleChange} rows={2} required style={{ resize: 'none' }} />
                <label htmlFor="address">Full Address *</label>
                {errors.address && <span style={{ color: 'var(--error)', fontSize: 12 }}>{errors.address}</span>}
              </div>
              <div className="form-row">
                <div className="input-field">
                  <input type="text" name="city" id="city" placeholder=" " value={form.city} onChange={handleChange} required />
                  <label htmlFor="city">City *</label>
                  {errors.city && <span style={{ color: 'var(--error)', fontSize: 12 }}>{errors.city}</span>}
                </div>
                <div className="input-field">
                  <input type="text" name="pincode" id="pincode" placeholder=" " value={form.pincode} onChange={handleChange} maxLength={6} required />
                  <label htmlFor="pincode">Pincode *</label>
                  {errors.pincode && <span style={{ color: 'var(--error)', fontSize: 12 }}>{errors.pincode}</span>}
                </div>
              </div>
              <div className="input-field">
                <select name="state" id="state" value={form.state} onChange={handleChange} required>
                  <option value="">Select State</option>
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <label htmlFor="state">State *</label>
                {errors.state && <span style={{ color: 'var(--error)', fontSize: 12 }}>{errors.state}</span>}
              </div>
            </div>

            {/* Payment */}
            <div className="form-section">
              <div className="form-section-title">Payment Method</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { value: 'cod', label: '💰 Cash on Delivery', desc: 'Pay when delivered' },
                  { value: 'upi', label: '📱 UPI / PhonePe / GPay', desc: 'Instant payment' },
                  { value: 'card', label: '💳 Credit / Debit Card', desc: 'All major cards accepted' },
                ].map(method => (
                  <label
                    key={method.value}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
                      padding: '14px 16px', border: `1.5px solid ${form.paymentMethod === method.value ? 'var(--primary-energetic)' : 'var(--outline-variant)'}`,
                      borderRadius: 'var(--radius-lg)',
                      background: form.paymentMethod === method.value ? 'var(--accent-pink-light)' : 'white',
                      transition: 'all 200ms ease',
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={form.paymentMethod === method.value}
                      onChange={handleChange}
                      style={{ accentColor: 'var(--primary-energetic)' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{method.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--outline)' }}>{method.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right: summary */}
          <div className="cart-summary-card" style={{ top: 'calc(var(--nav-height) + 20px)', position: 'sticky' }}>
            <div className="cart-summary-title">Order Summary</div>

            {/* Items */}
            <div style={{ marginBottom: 16, maxHeight: 240, overflowY: 'auto' }}>
              {items.map(item => (
                <div key={`${item.productId}-${item.size}-${item.color}`} style={{
                  display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center',
                }}>
                  <img src={item.image} alt={item.name} style={{ width: 50, height: 65, objectFit: 'cover', borderRadius: 4 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--outline)' }}>{item.size} · {item.color} · Qty: {item.quantity}</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary-energetic)' }}>
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span style={{ color: shipping === 0 ? 'var(--tertiary)' : undefined }}>
                {shipping === 0 ? 'FREE' : `₹${shipping}`}
              </span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 20, justifyContent: 'center' }}
              disabled={loading}
              id="place-order-btn"
            >
              {loading ? 'Placing Order...' : `Place Order — ₹${total.toLocaleString('en-IN')}`}
            </button>

            <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--outline)', marginTop: 12 }}>
              🔒 Your order is secure and encrypted
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
