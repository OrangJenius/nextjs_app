import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin';
import { prisma } from '@/lib/prisma';
import AdminAppointments, { type AdminAppointment } from './adminAppointments';

export default async function AdminPage() {
  // Second layer after middleware: make sure this is really an admin
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const rows = await prisma.appointments.findMany({
    include: {
      doctors: true,
      patients: true, // adjust: your relation name for saved patients
    },
    orderBy: [{ preferred_date: 'desc' }, { created_at: 'desc' }],
    take: 500,
  });

  // Converted to plain strings/primitives because this goes to a Client Component.
  // Time is read with getUTC* to stay consistent with the /riwayat page.
  const appointments: AdminAppointment[] = rows.map((a) => ({
    id: a.id,
    patientName: a.patient_name,
    phone: a.phone,
    email: a.email,
    nik: a.nik ?? a.patients?.nik ?? null, // adjust
    isGuest: !a.patients, // no saved patient linked = guest booking
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

  return <AdminAppointments appointments={appointments} />;
}