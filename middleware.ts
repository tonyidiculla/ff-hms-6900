import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
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
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Get current user
  const { data: { user }, error } = await supabase.auth.getUser()

  // Allow access to login page, password change page, and public assets
  const isPublicPath = request.nextUrl.pathname === '/login' || 
                      request.nextUrl.pathname === '/change-password' ||
                      request.nextUrl.pathname.startsWith('/_next') ||
                      request.nextUrl.pathname.startsWith('/api/auth/') ||
                      request.nextUrl.pathname === '/favicon.ico'

  if (isPublicPath) {
    return response
  }

  // Redirect to login if not authenticated
  if (error || !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Check if user needs to change password (skip for API routes)
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    const user_platform_id = user.user_metadata?.user_platform_id
    
    if (user_platform_id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_password_changed')
        .eq('user_platform_id', user_platform_id)
        .single()

      // If password hasn't been changed from initial password, force change
      if (profile && !profile.first_password_changed) {
        const changePasswordUrl = new URL('/change-password', request.url)
        changePasswordUrl.searchParams.set('required', 'true')
        return NextResponse.redirect(changePasswordUrl)
      }
    }
  }

  return response
}

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