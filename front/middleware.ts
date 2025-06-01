import { NextResponse, type NextRequest } from 'next/server'


export function middleware(request: NextRequest) {
    
    const {pathname, origin} = request.nextUrl;
    if((pathname === '/dashboard' || pathname === '/cart' || pathname === '/dashboard/orders') && !request.cookies.get('userSession')) {
        const logintUrl = new URL("/login", origin)
        return NextResponse.redirect(logintUrl)

     }else{
           return NextResponse.next()
        }
}