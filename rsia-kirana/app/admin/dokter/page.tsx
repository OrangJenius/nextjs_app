import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin';
import { prisma } from '@/lib/prisma';
import { dateToHHMM } from '@/lib/time';
import DokterManager, { type AdminDoctor } from './dokterManager';

export default async function AdminDokterPage() {
  if (!(await getAdminSession())) {
    redirect('/admin/login');
  }

  const rows = await prisma.doctors.findMany({
    include: {
      doctors_schedule: { orderBy: [{ day_of_week: 'asc' }, { start_time: 'asc' }] },
    },
    orderBy: { name: 'asc' },
  });

  const doctors: AdminDoctor[] = rows.map((d) => ({
    id: d.id,
    name: d.name,
    specialization: d.specialization,
    category: d.category,
    photoUrl: d.photo_url,
    bio: d.bio,
    isActive: d.is_active,
    schedules: d.doctors_schedule.map((s) => ({
      dayOfWeek: s.day_of_week,
      start: dateToHHMM(s.start_time),
      end: dateToHHMM(s.end_time),
    })),
  }));

  return <DokterManager doctors={doctors} />;
}