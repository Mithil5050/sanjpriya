import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'

export const dynamic = 'force-dynamic'

export default async function WishlistPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: wishlist, error } = await supabase
    .from('wishlist')
    .select('*, product:products(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching wishlist:', error)
  }

  const savedProducts = wishlist?.map(item => item.product).filter(Boolean) || []

  return (
    <div className="section" style={{ minHeight: '70vh' }}>
      <div className="container">
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '36px', color: 'var(--primary-dark)', marginBottom: '8px', textAlign: 'center' }}>
          My Wishlist
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--outline)', marginBottom: '48px' }}>
          {savedProducts.length} {savedProducts.length === 1 ? 'item' : 'items'} saved
        </p>

        {savedProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 24px', background: 'var(--surface-container-lowest)', borderRadius: '16px' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--outline)" strokeWidth="1" style={{ margin: '0 auto 16px' }}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', marginBottom: '8px' }}>Your wishlist is empty</h2>
            <p style={{ color: 'var(--outline)', marginBottom: '24px' }}>Save items you love to shop later.</p>
            <Link href="/" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="product-grid">
            {savedProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
