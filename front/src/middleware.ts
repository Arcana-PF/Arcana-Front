import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  const userSessionCookie = request.cookies.get('userSession')?.value;
  const isAuthenticated = Boolean(userSessionCookie);

  // Convertir la cookie a objeto si es JSON
  let userData;
  try {
    userData = userSessionCookie ? JSON.parse(userSessionCookie) : null;
  } catch (error) {
    console.error("Error al parsear la cookie userSession:", error);
  }

  const isAdmin = Boolean(userData?.isAdmin);

  const protectedRoutes = ['/profile', '/cart', '/profile/orders'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  const authRoutes = ['/login', '/register'];
  const isAuthRoute = authRoutes.includes(pathname);


  function redirectTo(path: string) {
    return NextResponse.redirect(new URL(path, origin));
  }

  if (isProtectedRoute && !isAuthenticated) {
    return redirectTo('/login');
  }

  if (isAuthRoute && isAuthenticated) {
    return redirectTo('/');
  }

  // Redirigir admins a su perfil exclusivo
  if (pathname === '/profile' && isAdmin) {
    return redirectTo('/profileadmin');
  }

  // Redirigir a la página de inicio si se accede a /profileadmin sin ser admin
  if (pathname === '/profileadmin' && !isAdmin) {
    return redirectTo('/profile');
  }

  return NextResponse.next();
}