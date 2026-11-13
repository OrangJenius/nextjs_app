import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin';
import { prisma } from '@/lib/prisma';
import LayananManager, { type AdminService } from './layananManager';

export default async function AdminLayananPage() {
  if (!(await getAdminSession())) {
    redirect('/admin/login');
  }

  const rows = await prisma.services.findMany({ orderBy: { name: 'asc' } });

  const services: AdminService[] = rows.map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    description: s.description,
    iconUrl: s.icon_url,
  }));

  return <LayananManager services={services} />;
}