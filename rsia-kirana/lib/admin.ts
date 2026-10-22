import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Mengembalikan session HANYA jika user yang login benar-benar admin.
// Role dicek ulang ke database (bukan hanya dari token), supaya akun yang
// sudah diturunkan dari admin langsung kehilangan akses.
export async function getAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const id = Number((session.user as { id: string }).id);
  const user = await prisma.users.findUnique({
    where: { id },
    select: { role: true },
  });

  return user?.role === 'admin' ? session : null;
}