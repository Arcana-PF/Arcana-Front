import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from './app/lib/auth0';

export async function middleware(request: NextRequest) {
  const response = await auth0.middleware(request);
  const session = await auth0.getSession(request);
  const user = session?.user;

  const { pathname } = request.nextUrl;

  // Redirigir a /profileadmin si el usuario es admin y accede a /profile
  if (pathname === '/profile' && user?.isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = '/profileadmin';
    return NextResponse.redirect(url);
  }

  // Redirigir a /profile si el usuario NO es admin y accede a /profileadmin
  if (pathname === '/profileadmin' && !user?.isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = '/profile';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|login|register|public).*)',
  ],
};