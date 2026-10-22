import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin';
import { prisma } from '@/lib/prisma';
import AdminAppointments, { type AdminAppointment } from './adminAppointments';

export default async function AdminPage() {
  // Lapisan kedua setelah middleware: pastikan benar-benar admin
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const rows = await prisma.appointments.findMany({
    include: { doctors: true },
    orderBy: [{ preferred_date: 'desc' }, { created_at: 'desc' }],
    take: 500,
  });

  // Data diubah ke string/primitif karena dikirim ke Client Component.
  // Jam dibaca dengan getUTC* agar konsisten dengan halaman /riwayat.
  const appointments: AdminAppointment[] = rows.map((a) => ({
    id: a.id,
    patientName: a.patient_name,
    phone: a.phone,
    email: a.email,
    doctorName: a.doctors?.name ?? null,
    specialization: a.doctors?.specialization ?? null,
    date: a.preferred_date.toISOString().slice(0, 10),
    time: `${String(a.preferred_time.getUTCHours()).padStart(2, '0')}:${String(
      a.preferred_time.getUTCMinutes()
    ).padStart(2, '0')}`,
    notes: a.notes,
    status: a.status,
    createdAt: a.created_at.toISOString(),
  }));

  return (
    <AdminAppointments
      appointments={appointments}
      adminName={session.user?.name ?? 'Admin'}
    />
  );
}