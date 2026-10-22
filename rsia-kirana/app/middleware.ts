import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;

    if (pathname.startsWith('/admin')) {
      // Halaman login admin boleh diakses siapa saja
      if (pathname === '/admin/login') return NextResponse.next();

      if (req.nextauth.token?.role !== 'admin') {
        return NextResponse.redirect(new URL('/admin/login', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Rute /admin ditangani oleh fungsi middleware di atas
        if (req.nextUrl.pathname.startsWith('/admin')) return true;
        // Rute lain: cukup sudah login
        return !!token;
      },
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: ['/janji-temu/:path*', '/riwayat/:path*', '/profil/:path*', '/admin/:path*'],
};