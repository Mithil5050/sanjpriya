import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const admin = searchParams.get('admin');

    let query = supabase.from('reviews').select('*').order('created_at', { ascending: false });
    
    if (productId) {
      query = query.eq('product_id', productId);
    }
    
    // If not admin, only fetch approved reviews
    if (admin !== 'true') {
      query = query.eq('status', 'approved');
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Convert snake_case to camelCase
    const reviews = data.map(row => ({
      id: row.id,
      productId: row.product_id,
      customerName: row.customer_name,
      rating: row.rating,
      title: row.title,
      comment: row.comment,
      photoUrl: row.photo_url,
      status: row.status,
      createdAt: row.created_at,
    }));

    return NextResponse.json(reviews);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, customerName, rating, title, comment, photoUrl } = body;

    if (!productId || !customerName || !rating || !title || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase.from('reviews').insert([
      {
        product_id: productId,
        customer_name: customerName,
        rating,
        title,
        comment,
        photo_url: photoUrl || null,
        status: 'pending', // Default status
      }
    ]).select().single();

    if (error) {
      console.error('Error inserting review:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, review: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to submit review' }, { status: 500 });
  }
}
