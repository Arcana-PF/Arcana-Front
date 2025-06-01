import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl

  const userSessionCookie = request.cookies.get('userSession')?.value
  const isAuthenticated = Boolean(userSessionCookie)

  const protectedRoutes = ['/profile', '/cart', '/profile/orders']
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )
console.log('Middleware cookie:', userSessionCookie)
  const authRoutes = ['/login', '/register']
  const isAuthRoute = authRoutes.includes(pathname)

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', origin)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', origin))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/profile/:path*', '/cart', '/login', '/register'],
}

