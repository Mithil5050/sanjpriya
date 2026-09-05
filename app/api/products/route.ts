import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

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
    sizes: row.sizes, // JSONB already parsed by Supabase client
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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const badge = searchParams.get('badge');
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = (page - 1) * limit;

    let query = supabase.from('products').select('*', { count: 'exact' });

    if (category) query = query.eq('category', category);
    if (featured === 'true') query = query.eq('featured', true);
    if (search) {
      // Split by spaces to allow multi-word flexible search (e.g., "red kurti")
      const searchTerms = search.trim().split(/\s+/).filter(t => t.length > 0);
      searchTerms.forEach(term => {
        // Ensure every search term exists in at least one of these fields
        query = query.or(
          `name.ilike.%${term}%,description.ilike.%${term}%,category.ilike.%${term}%,fabric.ilike.%${term}%`
        );
      });
    }
    if (badge) query = query.eq('badge', badge);
    
    const badges = searchParams.get('badges');
    if (badges) query = query.in('badge', badges.split(','));
    
    const maxPrice = searchParams.get('maxPrice');
    if (maxPrice) query = query.lte('price', parseFloat(maxPrice));

    if (sort === 'price_asc') query = query.order('price', { ascending: true });
    else if (sort === 'price_desc') query = query.order('price', { ascending: false });
    else if (sort === 'popular') query = query.order('review_count', { ascending: false });
    else if (sort === 'rating') query = query.order('rating', { ascending: false });
    else query = query.order('created_at', { ascending: false });

    query = query.range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error) throw error;

    const total = count || 0;

    return NextResponse.json({
      products: data.map(parseProduct),
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabaseServer = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch (error) {
              // Ignored
            }
          },
        },
      }
    );

    const body = await req.json();

    const { data, error } = await supabaseServer.from('products').insert([
      {
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        category: body.category,
        price: body.price,
        original_price: body.originalPrice || null,
        description: body.description,
        fabric: body.fabric || '',
        care: body.care || '',
        sizes: body.sizes || [],
        colors: body.colors || [],
        images: body.images || [],
        badge: body.badge || null,
        in_stock: body.inStock !== false, // Changed from 1/0 to true/false as in_stock is likely a boolean based on previous schemas
        featured: body.featured ? true : false,
        rating: body.rating || 4.5,
        review_count: body.reviewCount || 0,
      }
    ]).select();

    if (error) {
      console.error("Supabase Insert Error:", error);
      return NextResponse.json({ error: error.message || 'Supabase Insert Error', details: error }, { status: 500 });
    }

    return NextResponse.json({ id: data[0].id }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || 'Failed to create product' }, { status: 500 });
  }
}
