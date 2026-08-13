import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
            } catch {}
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Since images are stored as a JSONB array, we need to find rows where the first image URL contains 'unsplash.com'.
    // Supabase JS client doesn't natively support easy JSONB array substring matching via simple eq.
    // Instead, we can fetch all products, filter them in Node, and delete them by ID.
    const { data: allProducts, error: fetchError } = await supabase.from('products').select('id, images');
    
    if (fetchError) throw fetchError;

    const dummyProductIds = allProducts
      .filter(p => {
        // If any image in the array is from unsplash, it's dummy data
        const images = p.images as string[];
        return images.some(url => url.includes('unsplash.com'));
      })
      .map(p => p.id);

    if (dummyProductIds.length === 0) {
      return NextResponse.json({ success: true, message: 'No dummy products found' });
    }

    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .in('id', dummyProductIds);

    if (deleteError) throw deleteError;

    return NextResponse.json({ success: true, message: `Deleted ${dummyProductIds.length} dummy products` });

  } catch (error: any) {
    console.error('Cleanup error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
