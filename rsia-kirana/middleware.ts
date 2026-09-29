import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/login',
  },
});

// Tambahkan path lain yang perlu login di sini, misalnya '/akun/:path*'.
export const config = {
  matcher: ['/janji-temu/:path*'],
};