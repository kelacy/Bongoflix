import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Public routes
  if (pathname.startsWith('/login') || pathname.startsWith('/register') || pathname === '/') {
    return NextResponse.next();
  }

  // Admin routes protection
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    try {
      const decoded = verify(token, process.env.JWT_SECRET);
      // In middleware we can't easily check role from DB, so we rely on token payload.
      // We should include role in JWT during login/register.
      if (decoded.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // User routes protection
  if (pathname.startsWith('/my-list') || pathname.startsWith('/watch')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}