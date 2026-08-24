import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import crypto from 'crypto';

function generateOrderNumber() {
  const prefix = 'SNJ';
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 9000 + 1000);
  return `${prefix}${date}${random}`;
}

export async function GET() {
  try {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Try to get authenticated user (for linking order to account)
    const cookieStore = await cookies();
    const serverSupabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll() {}
        },
      }
    );
    
    const { data: { user } } = await serverSupabase.auth.getUser();

    const orderNumber = generateOrderNumber();
    const orderPayload = {
      order_number: orderNumber,
      user_id: user?.id || null,
      customer_name: body.customerName,
      customer_email: body.customerEmail,
      customer_phone: body.customerPhone,
      address: body.address,
      city: body.city,
      state: body.state,
      pincode: body.pincode,
      items: body.items,
      subtotal: body.subtotal,
      shipping: body.shipping || 0,
      total: body.total,
      payment_method: body.paymentMethod || 'cod',
      razorpay_order_id: body.razorpayOrderId || null,
      razorpay_payment_id: body.razorpayPaymentId || null,
      razorpay_signature: body.razorpaySignature || null,
      status: body.paymentMethod === 'prepaid' ? 'confirmed' : 'pending',
    };

    // Verify Razorpay signature if prepaid
    if (body.paymentMethod === 'prepaid') {
      if (!body.razorpayOrderId || !body.razorpayPaymentId || !body.razorpaySignature) {
        return NextResponse.json({ error: 'Missing Razorpay payment details' }, { status: 400 });
      }

      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
        .update(`${body.razorpayOrderId}|${body.razorpayPaymentId}`)
        .digest('hex');

      if (generatedSignature !== body.razorpaySignature) {
        return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
      }
    }

    // Use the base supabase client (anon key) which works regardless of customer RLS state
    const { data, error } = await supabase.from('orders').insert([orderPayload]).select();

    if (error) {
      console.error('Order insert error:', JSON.stringify(error, null, 2));
      throw error;
    }

    // Try to sync with Shiprocket in the background
    // We import dynamically to avoid issues if Shiprocket env vars are missing
    try {
      const { createShiprocketOrder } = await import('@/lib/shiprocket');
      await createShiprocketOrder(orderPayload);
    } catch (e) {
      console.error('Failed to trigger Shiprocket sync', e);
    }

    return NextResponse.json({ orderNumber, id: data[0].id }, { status: 201 });
  } catch (err) {
    console.error('Order POST failed:', err);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { error } = await supabase.from('orders').update({ status: body.status }).eq('id', body.id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
