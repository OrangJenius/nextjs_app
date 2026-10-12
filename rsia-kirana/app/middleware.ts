import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/login',
  },
});

export const config = {
  matcher: ['/janji-temu/:path*', '/riwayat/:path*', '/profil/:path*'],
};