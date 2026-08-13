import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // Update the request cookies (so subsequent logic sees them)
            request.cookies.set(name, value)
          })
          
          supabaseResponse = NextResponse.next({
            request,
          })
          
          // Set the cookies on the response
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // This refreshes the session if expired and gets the current user
  const { data: { user } } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()

  // Protect /admin routes (except /admin/login)
  if (url.pathname.startsWith('/admin') && url.pathname !== '/admin/login') {
    if (!user) {
      // Not authenticated, redirect to login
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }

    // SECURITY: Ensure ONLY the store owner can access the admin panel
    const adminEmail = process.env.STORE_OWNER_EMAIL || 'priyankakhodve47@gmail.com';
    if (user.email !== adminEmail) {
      // If a normal customer tries to go to /admin, redirect them to their customer account
      url.pathname = '/account'
      return NextResponse.redirect(url)
    }
  }

  // Redirect authenticated admin users away from the admin login page
  if (url.pathname === '/admin/login' && user) {
    const adminEmail = process.env.STORE_OWNER_EMAIL || 'priyankakhodve47@gmail.com';
    if (user.email === adminEmail) {
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    } else {
      url.pathname = '/account'
      return NextResponse.redirect(url)
    }
  }

  // Protect /account and /checkout routes
  if (url.pathname.startsWith('/account') || url.pathname.startsWith('/checkout')) {
    if (!user) {
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  // Redirect authenticated users away from the customer login/signup pages
  if ((url.pathname === '/login' || url.pathname === '/signup') && user) {
    url.pathname = '/account'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
// Ensure the middleware is only called for relevant paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
