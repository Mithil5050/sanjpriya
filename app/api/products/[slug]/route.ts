import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function parseProduct(row: Record<string, any>) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category,
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : null,
    description: row.description,
    fabric: row.fabric,
    care: row.care,
    sizes: row.sizes,
    colors: row.colors,
    images: row.images,
    badge: row.badge,
    inStock: Boolean(row.in_stock), // Assuming keeping the old schema flag for now or updating it later
    featured: Boolean(row.featured),
    rating: Number(row.rating),
    reviewCount: row.review_count,
    createdAt: row.created_at,
  };
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single();
    
    if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(parseProduct(data));
  } catch {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const cookieStore = await cookies();
    const supabaseServer = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {}
          },
        },
      }
    );

    const { slug } = await params;
    const body = await req.json();

    const { error } = await supabaseServer.from('products').update({
      name: body.name,
      price: body.price,
      original_price: body.originalPrice || null,
      description: body.description,
      fabric: body.fabric,
      care: body.care,
      sizes: body.sizes || [],
      colors: body.colors || [],
      images: body.images || [],
      badge: body.badge || null,
      in_stock: body.inStock !== false, // boolean
      featured: body.featured ? true : false,
    }).eq('slug', slug);

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const cookieStore = await cookies();
    const supabaseServer = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {}
          },
        },
      }
    );

    const { slug } = await params;
    const { error } = await supabaseServer.from('products').delete().eq('slug', slug);
    
    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete product' }, { status: 500 });
  }
}
