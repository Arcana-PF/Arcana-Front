import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth0 } from '../src/app/lib/auth0';

export async function middleware(request: NextRequest) {
  const res = await auth0.middleware(request);
  const { pathname, origin } = request.nextUrl;

  const session = await auth0.getSession(request);
  const user = session?.user;
  const isAuthenticated = Boolean(user);

  const protectedRoutes = ['/profile', '/cart', '/profile/orders'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  const authRoutes = ['/login', '/register'];
  const isAuthRoute = authRoutes.includes(pathname);

  const isAdmin = user?.role === 'admin'; // Asegúrate de incluir `role` en los claims del token

  const redirectTo = (path: string) => NextResponse.redirect(new URL(path, origin));

  if (isProtectedRoute && !isAuthenticated) {
    return redirectTo('/login');
  }

  if (isAuthRoute && isAuthenticated) {
    return redirectTo('/');
  }

  if (pathname === '/profile' && isAdmin) {
    return redirectTo('/profileadmin');
  }

  if (pathname === '/profileadmin' && !isAdmin) {
    return redirectTo('/profile');
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};