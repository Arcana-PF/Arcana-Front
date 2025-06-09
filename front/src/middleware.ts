import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  const userSessionCookie = request.cookies.get('userSession')?.value;
  const isAuthenticated = Boolean(userSessionCookie);

  // Convertir la cookie a objeto si es JSON
  let userData;
  if (userSessionCookie) {
    try {
      // Verificar que el valor tenga un formato JSON
      if (userSessionCookie.startsWith('{') && userSessionCookie.endsWith('}')) {
        userData = JSON.parse(userSessionCookie);
      } else {
        console.error("Formato inválido en la cookie userSession:", userSessionCookie);
      }
    } catch (error) {
      console.error("Error al parsear la cookie:", error);
    }
  }

  const isAdmin = userData?.isAdmin || false;

  const protectedRoutes = ['/profile', '/cart', '/profile/orders'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  const authRoutes = ['/login', '/register'];
  const isAuthRoute = authRoutes.includes(pathname);

  console.log('Middleware userData:', userData);

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', origin);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', origin));
  }

  // Redirigir admins a su perfil exclusivo
  if (pathname === '/profile' && isAdmin) {
    return NextResponse.redirect(new URL('/profileadmin', origin));
  }

  // Redirigir a la página de inicio si se accede a /profileadmin sin ser admin
  if (pathname === '/profileadmin' && !isAdmin) {
    return NextResponse.redirect(new URL('/profile', origin))
  }

  return NextResponse.next();
}