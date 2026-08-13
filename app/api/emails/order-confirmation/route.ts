import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with a placeholder if the env var is missing
const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_key_replace_me');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderNumber, customerName, customerEmail, total, items } = body;

    if (!customerEmail) {
      return NextResponse.json({ error: 'Customer email is required' }, { status: 400 });
    }

    const itemsHtml = items.map((item: any) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          <strong>${item.name}</strong><br/>
          <span style="color: #666; font-size: 12px;">Size: ${item.size} | Color: ${item.color}</span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #c95d3c; margin-bottom: 0;">Sanjpriya Creations</h1>
          <p style="color: #666; margin-top: 5px;">Order Confirmation</p>
        </div>
        
        <div style="background: #fdfaf6; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h2 style="margin-top: 0;">Hi ${customerName},</h2>
          <p>Thank you for your order! We've received it and are getting it ready for you.</p>
          <p><strong>Order Number:</strong> ${orderNumber}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 12px; background: #eee;">Item</th>
              <th style="text-align: center; padding: 12px; background: #eee;">Qty</th>
              <th style="text-align: right; padding: 12px; background: #eee;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="text-align: right; padding: 12px; font-weight: bold;">Total:</td>
              <td style="text-align: right; padding: 12px; font-weight: bold; color: #c95d3c;">₹${total.toLocaleString('en-IN')}</td>
            </tr>
          </tfoot>
        </table>

        <div style="text-align: center; color: #888; font-size: 12px; margin-top: 40px;">
          <p>If you have any questions, reply to this email or contact us at priyankakhodve47@gmail.com</p>
          <p>&copy; ${new Date().getFullYear()} Sanjpriya Creations. All rights reserved.</p>
        </div>
      </div>
    `;

    // If there is no real API key, just log it instead of throwing an error
    if (!process.env.RESEND_API_KEY) {
      console.log('--- SIMULATED EMAIL SENT ---');
      console.log(`To: ${customerEmail}`);
      console.log(`Subject: Order Confirmation - ${orderNumber}`);
      console.log('HTML Content Generated Successfully');
      console.log('----------------------------');
      return NextResponse.json({ success: true, simulated: true });
    }

    // --- Store Owner Notification (always works, no domain needed) ---
    const ownerEmail = process.env.STORE_OWNER_EMAIL || 'priyankakhodve47@gmail.com';
    
    const ownerHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="background: #fdf6f0; border-left: 4px solid #c95d3c; padding: 16px; border-radius: 4px; margin-bottom: 24px;">
          <h2 style="margin: 0 0 4px 0; color: #c95d3c;">🛍️ New Order Received!</h2>
          <p style="margin: 0; color: #666;">Order <strong>${orderNumber}</strong> was just placed.</p>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #666; width: 140px;">Customer:</td><td style="padding: 8px 0; font-weight: 600;">${customerName}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Email:</td><td style="padding: 8px 0;">${customerEmail}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Order Total:</td><td style="padding: 8px 0; font-weight: 700; color: #c95d3c;">₹${total.toLocaleString('en-IN')}</td></tr>
        </table>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
        ${itemsHtml ? `
        <h3 style="margin: 0 0 12px 0;">Items Ordered</h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${itemsHtml}
        </table>
        ` : ''}
        <div style="margin-top: 24px; text-align: center;">
          <a href="https://localhost:3000/admin/orders" style="background: #c95d3c; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">View in Admin Panel</a>
        </div>
      </div>
    `;

    // Send to store owner first (always succeeds with onboarding@resend.dev)
    const ownerResult = await resend.emails.send({
      from: 'Sanjpriya Orders <onboarding@resend.dev>',
      to: [ownerEmail],
      subject: `🛍️ New Order: ${orderNumber} — ₹${total.toLocaleString('en-IN')}`,
      html: ownerHtml,
    });

    if (ownerResult.error) {
      console.error('Owner notification error:', ownerResult.error);
    } else {
      console.log('✅ Owner notification sent to:', ownerEmail);
    }

    // --- Customer Confirmation (requires domain verification) ---
    // Once you verify your domain at resend.com/domains and set up orders@sanjpriya.com,
    // this will send confirmation emails to customers automatically.
    if (customerEmail !== ownerEmail) {
      const customerResult = await resend.emails.send({
        from: 'Sanjpriya <onboarding@resend.dev>',
        to: [customerEmail],
        subject: `Order Confirmation - ${orderNumber} | Sanjpriya Creations`,
        html: htmlContent,
      });

      if (customerResult.error) {
        // Domain not yet verified — log but don't fail the response
        console.warn(`⚠️ Customer email not sent (domain not verified): ${customerResult.error.message}`);
        return NextResponse.json({ 
          success: true, 
          ownerNotified: true,
          customerEmailPending: true,
          note: 'Verify your domain at resend.com/domains to enable customer emails'
        });
      }

      console.log('✅ Customer confirmation sent to:', customerEmail);
    }

    return NextResponse.json({ success: true, ownerNotified: true, customerNotified: true });
  } catch (err: any) {
    console.error('Email API Error:', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
