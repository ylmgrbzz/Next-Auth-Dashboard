import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  // Public routes
  if (
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/signup') ||
    request.nextUrl.pathname.startsWith('/api/auth')
  ) {
    // Eğer kullanıcı giriş yapmışsa ve login/signup sayfalarına erişmeye çalışıyorsa
    if (token) {
      try {
        await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } catch {
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // Protected routes
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/login',
    '/signup',
  ],
}; 