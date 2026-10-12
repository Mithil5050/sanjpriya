'use client';
import React, { useRef } from 'react';

export interface InvoiceOrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
  size?: string;
  color?: string;
  slug?: string;
  productId?: number;
}

export interface InvoiceOrder {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address: string;
  landmark: string | null;
  city: string;
  state: string;
  pincode: string;
  items: InvoiceOrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  payment_method: string;
  razorpay_payment_id?: string | null;
  created_at: string;
}

export function numberToWordsINR(amount: number): string {
  const num = Math.round(amount);
  if (num === 0) return 'Zero Rupees Only';

  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertTwoDigits(n: number): string {
    if (n < 20) return ones[n];
    return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
  }

  function convertThreeDigits(n: number): string {
    let str = '';
    if (Math.floor(n / 100) > 0) {
      str += ones[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n > 0) {
      str += (str !== '' ? 'and ' : '') + convertTwoDigits(n);
    }
    return str.trim();
  }

  let crore = Math.floor(num / 10000000);
  let remainder = num % 10000000;
  let lakh = Math.floor(remainder / 100000);
  remainder = remainder % 100000;
  let thousand = Math.floor(remainder / 1000);
  let hundred = remainder % 1000;

  let words = '';
  if (crore > 0) words += convertThreeDigits(crore) + ' Crore ';
  if (lakh > 0) words += convertThreeDigits(lakh) + ' Lakh ';
  if (thousand > 0) words += convertThreeDigits(thousand) + ' Thousand ';
  if (hundred > 0) words += convertThreeDigits(hundred) + ' ';

  return words.trim() ? `${words.trim()} Rupees Only` : 'Zero Rupees Only';
}

interface OrderInvoiceProps {
  order: InvoiceOrder;
  onClose?: () => void;
  isStandalone?: boolean;
}

export default function OrderInvoice({ order, onClose, isStandalone = false }: OrderInvoiceProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const invoiceNumber = `INV-${order.order_number}`;
  const orderDate = new Date(order.created_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const orderTime = new Date(order.created_at).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const discount = Math.max(0, (order.subtotal + (order.shipping || 0)) - order.total);
  const isPrepaid = order.payment_method?.toLowerCase() === 'prepaid';

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadHTML = () => {
    if (!invoiceRef.current) return;
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice - ${order.order_number}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 20px; color: #1a1a1a; }
          @page { size: A4 portrait; margin: 12mm; }
          * { box-sizing: border-box; }
        </style>
      </head>
      <body>
        ${invoiceRef.current.innerHTML}
      </body>
      </html>
    `;
    const blob = new Blob([invoiceHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${order.order_number}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const invoiceContent = (
    <div
      ref={invoiceRef}
      id="printable-invoice"
      style={{
        background: '#ffffff',
        color: '#1a1a1a',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '36px 40px',
        boxShadow: isStandalone ? '0 4px 24px rgba(0,0,0,0.06)' : 'none',
        borderRadius: isStandalone ? '8px' : '0',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        fontSize: '13px',
        lineHeight: 1.5,
      }}
    >
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '20px', borderBottom: '2px solid #c95d3c' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
            <img
              src="/logo.jpg"
              alt="Sanjpriya Creations"
              style={{ height: '56px', width: 'auto', objectFit: 'contain' }}
            />
            <div>
              <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800, letterSpacing: '0.04em', color: '#1a1a1a' }}>
                SANJPRIYA CREATIONS
              </h1>
              <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#8c593b', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Heritage Moderne Ethnic Wear
              </p>
            </div>
          </div>
          <div style={{ fontSize: '11px', color: '#666', lineHeight: 1.4, marginTop: '8px' }}>
            <div>Email: <strong>support@sanjpriya.com</strong> | Phone: <strong>+91 93240 18833</strong></div>
            <div>Website: <strong>www.sanjpriya.com</strong> | Mumbai, Maharashtra, India</div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{
            display: 'inline-block',
            background: '#c95d3c',
            color: '#ffffff',
            padding: '5px 14px',
            borderRadius: '4px',
            fontWeight: 800,
            fontSize: '13px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '10px'
          }}>
            TAX INVOICE
          </div>
          <table style={{ marginLeft: 'auto', borderCollapse: 'collapse', fontSize: '12px' }}>
            <tbody>
              <tr>
                <td style={{ color: '#777', padding: '2px 8px 2px 0', textAlign: 'right' }}>Invoice No:</td>
                <td style={{ fontWeight: 700, textAlign: 'right', color: '#1a1a1a' }}>{invoiceNumber}</td>
              </tr>
              <tr>
                <td style={{ color: '#777', padding: '2px 8px 2px 0', textAlign: 'right' }}>Invoice Date:</td>
                <td style={{ fontWeight: 600, textAlign: 'right' }}>{orderDate}</td>
              </tr>
              <tr>
                <td style={{ color: '#777', padding: '2px 8px 2px 0', textAlign: 'right' }}>Order ID:</td>
                <td style={{ fontWeight: 700, textAlign: 'right', color: '#c95d3c' }}>{order.order_number}</td>
              </tr>
              <tr>
                <td style={{ color: '#777', padding: '2px 8px 2px 0', textAlign: 'right' }}>Order Time:</td>
                <td style={{ color: '#555', textAlign: 'right' }}>{orderTime}</td>
              </tr>
              <tr>
                <td style={{ color: '#777', padding: '2px 8px 2px 0', textAlign: 'right' }}>Payment Mode:</td>
                <td style={{ fontWeight: 700, textAlign: 'right', textTransform: 'uppercase', color: isPrepaid ? '#137333' : '#b06000' }}>
                  {order.payment_method || 'COD'} ({isPrepaid ? 'PAID' : 'COD'})
                </td>
              </tr>
              {order.razorpay_payment_id && (
                <tr>
                  <td style={{ color: '#777', padding: '2px 8px 2px 0', textAlign: 'right' }}>Txn Ref:</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '11px', textAlign: 'right' }}>{order.razorpay_payment_id}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* BILL TO & SHIP TO SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px', margin: '20px 0', padding: '16px', background: '#fcfbf9', border: '1px solid #ebe8e2', borderRadius: '6px' }}>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8c593b', marginBottom: '6px' }}>
            BILL TO & SHIP TO (CUSTOMER)
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a1a', marginBottom: '4px' }}>
            {order.customer_name}
          </div>
          <div style={{ color: '#444', fontSize: '12px', lineHeight: 1.5 }}>
            <div>{order.address}</div>
            {order.landmark && (
              <div style={{ color: '#c95d3c', fontWeight: 600 }}>Landmark: {order.landmark}</div>
            )}
            <div><strong>{order.city}</strong>, {order.state} - <strong>{order.pincode}</strong></div>
            <div style={{ marginTop: '4px', color: '#555' }}>
              📞 {order.customer_phone} | ✉️ {order.customer_email}
            </div>
          </div>
        </div>

        <div style={{ borderLeft: '1px solid #e0ddd5', paddingLeft: '20px' }}>
          <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8c593b', marginBottom: '6px' }}>
            SUPPLY & TAX DETAILS
          </div>
          <div style={{ fontSize: '12px', color: '#444', lineHeight: 1.6 }}>
            <div>Place of Supply: <strong>{order.state || 'Maharashtra'}</strong></div>
            <div>Country: <strong>India</strong></div>
            <div>Nature of Transaction: <strong>Retail Sale (B2C)</strong></div>
            <div>Invoice Type: <strong>Original for Recipient</strong></div>
          </div>
        </div>
      </div>

      {/* ITEMS TABLE */}
      <table style={{ width: '100%', borderCollapse: 'collapse', margin: '20px 0 16px' }}>
        <thead>
          <tr style={{ background: '#f3f0e9', borderBottom: '2px solid #d5cec0' }}>
            <th style={{ padding: '10px 8px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#444', width: '36px' }}>#</th>
            <th style={{ padding: '10px 8px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#444' }}>Description of Goods</th>
            <th style={{ padding: '10px 8px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#444', width: '80px' }}>HSN</th>
            <th style={{ padding: '10px 8px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#444', width: '48px' }}>Qty</th>
            <th style={{ padding: '10px 8px', textAlign: 'right', fontSize: '11px', fontWeight: 700, color: '#444', width: '100px' }}>Unit Rate</th>
            <th style={{ padding: '10px 8px', textAlign: 'right', fontSize: '11px', fontWeight: 700, color: '#444', width: '110px' }}>Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {order.items?.map((item, index) => {
            const lineTotal = item.price * item.quantity;
            return (
              <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px 8px', textAlign: 'center', color: '#777', fontSize: '12px' }}>
                  {index + 1}
                </td>
                <td style={{ padding: '12px 8px' }}>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#1a1a1a' }}>{item.name}</div>
                  <div style={{ fontSize: '11px', color: '#666', marginTop: '2px', display: 'flex', gap: '8px' }}>
                    {item.size && <span>Size: <strong>{item.size}</strong></span>}
                    {item.color && <span>Color: <strong>{item.color}</strong></span>}
                  </div>
                </td>
                <td style={{ padding: '12px 8px', textAlign: 'center', fontSize: '12px', color: '#666' }}>
                  6204
                </td>
                <td style={{ padding: '12px 8px', textAlign: 'center', fontWeight: 700, fontSize: '13px' }}>
                  {item.quantity}
                </td>
                <td style={{ padding: '12px 8px', textAlign: 'right', fontSize: '12px', color: '#444' }}>
                  ₹{item.price?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 700, fontSize: '13px', color: '#1a1a1a' }}>
                  ₹{lineTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* SUMMARY SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px', marginTop: '10px' }}>
        {/* Left Column: Words & Payment Note */}
        <div>
          <div style={{ background: '#fdfbf7', padding: '12px 16px', borderRadius: '6px', border: '1px solid #ebe6dd', marginBottom: '14px' }}>
            <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8c593b', marginBottom: '2px' }}>
              AMOUNT IN WORDS
            </div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#1a1a1a' }}>
              {numberToWordsINR(order.total)}
            </div>
          </div>

          <div style={{ fontSize: '11px', color: '#666', lineHeight: 1.5, padding: '4px' }}>
            <div style={{ fontWeight: 700, color: '#444', marginBottom: '2px' }}>Payment Information:</div>
            <div>Mode: <strong>{order.payment_method?.toUpperCase()}</strong></div>
            <div>Status: <strong style={{ color: isPrepaid ? '#137333' : '#b06000' }}>{isPrepaid ? 'Paid in Full' : 'Cash on Delivery (Pending Collection)'}</strong></div>
            {order.razorpay_payment_id && <div>Razorpay ID: <code>{order.razorpay_payment_id}</code></div>}
          </div>
        </div>

        {/* Right Column: Totals Breakdown */}
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <tbody>
              <tr>
                <td style={{ padding: '6px 8px', color: '#666' }}>Items Subtotal:</td>
                <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 600 }}>
                  ₹{order.subtotal?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
              {discount > 0 && (
                <tr>
                  <td style={{ padding: '6px 8px', color: '#137333' }}>Discount / Coupon:</td>
                  <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700, color: '#137333' }}>
                    -₹{discount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              )}
              <tr>
                <td style={{ padding: '6px 8px', color: '#666' }}>Shipping & Handling:</td>
                <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 600 }}>
                  {order.shipping === 0 ? 'FREE' : `₹${order.shipping.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </td>
              </tr>
              <tr style={{ borderTop: '2px solid #1a1a1a', borderBottom: '2px solid #1a1a1a', background: '#fdfbf7' }}>
                <td style={{ padding: '10px 8px', fontWeight: 800, fontSize: '14px', color: '#1a1a1a' }}>TOTAL AMOUNT:</td>
                <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 800, fontSize: '16px', color: '#c95d3c' }}>
                  ₹{order.total?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER & SIGNATURE */}
      <div style={{ marginTop: '36px', paddingTop: '16px', borderTop: '1px solid #e0ddd5', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ fontSize: '10px', color: '#777', maxWidth: '420px', lineHeight: 1.4 }}>
          <div style={{ fontWeight: 700, marginBottom: '2px', color: '#555' }}>Terms & Conditions:</div>
          <div>1. Goods sold are subject to standard return/exchange policies of Sanjpriya Creations.</div>
          <div>2. All disputes are subject to Mumbai jurisdiction only.</div>
          <div>3. This is a computer-generated tax invoice and requires no physical signature.</div>
        </div>

        <div style={{ textAlign: 'center', minWidth: '180px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#333', marginBottom: '32px' }}>
            For SANJPRIYA CREATIONS
          </div>
          <div style={{ borderTop: '1px solid #999', paddingTop: '4px', fontSize: '10px', color: '#666' }}>
            Authorized Signatory
          </div>
        </div>
      </div>
    </div>
  );

  if (isStandalone) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f4f0', padding: '30px 20px' }}>
        {/* Standalone Action Bar (Hidden when printing) */}
        <div className="no-print" style={{ maxWidth: '800px', margin: '0 auto 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => window.history.back()}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              background: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ← Back to Orders
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleDownloadHTML}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                background: '#fff',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              📥 Download HTML
            </button>
            <button
              onClick={handlePrint}
              style={{
                padding: '8px 20px',
                borderRadius: '6px',
                border: 'none',
                background: '#c95d3c',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              🖨️ Print / Save as PDF
            </button>
          </div>
        </div>

        {invoiceContent}

        <style jsx global>{`
          @media print {
            .no-print {
              display: none !important;
            }
            body {
              background: #fff !important;
              padding: 0 !important;
              margin: 0 !important;
            }
            #printable-invoice {
              box-shadow: none !important;
              padding: 0 !important;
              margin: 0 !important;
              max-width: 100% !important;
            }
            @page {
              size: A4 portrait;
              margin: 10mm;
            }
          }
        `}</style>
      </div>
    );
  }

  // Modal View
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(5px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#f5f4f0',
          borderRadius: '12px',
          maxWidth: '860px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Control Bar */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 24px',
            background: '#ffffff',
            borderBottom: '1px solid #e0ddd5',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '18px' }}>📄</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
                Invoice Preview — {order.order_number}
              </h3>
              <span style={{ fontSize: '11px', color: '#777' }}>Ready for Tax / CA Filing & Customer Print</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <a
              href={`/admin/orders/invoice?id=${order.id}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '7px 14px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                background: '#fff',
                color: '#333',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              ↗ Open Full Page
            </a>

            <button
              onClick={handlePrint}
              style={{
                padding: '7px 16px',
                borderRadius: '6px',
                border: 'none',
                background: '#c95d3c',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              🖨️ Print / Save as PDF
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#888',
                lineHeight: 1,
                padding: '0 4px',
                marginLeft: '6px',
              }}
              title="Close modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body: Scrollable invoice document */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {invoiceContent}
        </div>
      </div>

      <style jsx global>{`
        @media print {
          /* Hide everything in app except printable-invoice */
          body * {
            visibility: hidden !important;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible !important;
          }
          #printable-invoice {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            background: #fff !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
        }
      `}</style>
    </div>
  );
}
