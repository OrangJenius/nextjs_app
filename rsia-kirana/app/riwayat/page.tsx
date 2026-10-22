import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Clock, Stethoscope, FileText } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import CancelButton from './cancelButton';

// CATATAN SOAL JAM: preferred_time disimpan tanpa suffix "Z" di route booking,
// jadi nilainya mengikuti timezone server tempat data itu dibuat (lokal saat
// dev di Windows, UTC saat di Vercel). Di bawah ini kita baca pakai getUTCHours
// supaya konsisten untuk SATU lingkungan yang sama; jika data dibuat dari host
// dengan timezone berbeda, jamnya bisa tampil bergeser. Sebaiknya standarkan
// penulisan preferred_time dengan suffix "Z" (UTC) ke depannya di route POST
// appointments, baru rapikan data lama kalau diperlukan.
function formatTime(d: Date) {
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

function formatDate(d: Date) {
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  pending: { label: 'Menunggu Konfirmasi', className: 'bg-amber-100 text-amber-700' },
  confirmed: { label: 'Terkonfirmasi', className: 'bg-emerald-100 text-emerald-700' },
  completed: { label: 'Selesai', className: 'bg-slate-200 text-slate-700' },
  cancelled: { label: 'Dibatalkan', className: 'bg-red-100 text-red-700' },
};

type AppointmentWithRelations = Awaited<ReturnType<typeof prisma.appointments.findMany>>[number] & {
  doctors: { name: string; specialization: string } | null;
  patients: { nama_pasien: string } | null;
};

async function cancelAppointment(formData: FormData) {
  'use server';
  
  const id = Number(formData.get('appointmentId'));
  
  if (id) {
    await prisma.appointments.update({
      where: { id },
      data: { status: 'cancelled' },
    });
    
    revalidatePath('/riwayat'); 
  }
}

function AppointmentCard({ appointment }: { appointment: AppointmentWithRelations }) {
  const statusInfo = STATUS_LABELS[appointment.status] ?? {
    label: appointment.status,
    className: 'bg-slate-100 text-slate-600',
  };

  const canCancel = appointment.status === 'pending' || appointment.status === 'confirmed';

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusInfo.className}`}>
          {statusInfo.label}
        </span>
        <span className="text-[11px] text-slate-400">
          Kode: APT-{String(appointment.id).padStart(6, '0')}
        </span>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-rose-500 shrink-0" />
          {formatDate(appointment.preferred_date)}
        </div>
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-rose-500 shrink-0" />
          {formatTime(appointment.preferred_time)} WITA
        </div>
        <div className="flex items-center gap-2 sm:col-span-2">
          <Stethoscope size={14} className="text-rose-500 shrink-0" />
          {appointment.doctors?.name ?? 'Dokter tidak diketahui'}
          {appointment.doctors?.specialization ? ` — ${appointment.doctors.specialization}` : ''}
        </div>
        {appointment.notes && (
          <div className="flex items-start gap-2 sm:col-span-2">
            <FileText size={14} className="text-rose-500 shrink-0 mt-0.5" />
            <span>{appointment.notes}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
        <p className="text-[11px] text-slate-400">
          Pasien:{' '}
          <strong className="text-slate-600">
            {appointment.patients?.nama_pasien ?? appointment.patient_name}
          </strong>
        </p>
        
        {canCancel && (
          <form action={cancelAppointment}>
            <input type="hidden" name="appointmentId" value={appointment.id} />
            <CancelButton/> 
          </form>
        )}
      </div>
    </div>
  );
}

export default async function RiwayatPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/login?callbackUrl=/riwayat');
  }

  const userId = Number((session.user as { id: string }).id);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [upcoming, past] = await Promise.all([
    prisma.appointments.findMany({
      where: { user_id: userId, preferred_date: { gte: today } },
      include: { doctors: true, patients: true },
      orderBy: { preferred_date: 'asc' },
    }),
    prisma.appointments.findMany({
      where: { user_id: userId, preferred_date: { lt: today } },
      include: { doctors: true, patients: true },
      orderBy: { preferred_date: 'desc' },
    }),
  ]);

  const total = upcoming.length + past.length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      <header className="bg-white border-b border-rose-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-rose-600 font-medium text-sm transition-colors">
            <ArrowLeft size={18} /> Kembali ke Beranda
          </Link>
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Logo RSIA Kirana"
              width={32}
              height={32}
              className="object-contain"
              priority
            />
            <span className="font-bold text-slate-900 tracking-tight text-sm">RSIA KIRANA</span>
          </div>
          <Link href="/janji-temu" className="text-rose-600 hover:text-rose-700 text-xs font-semibold">
            + Janji Baru
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 pt-10">
        <div className="text-center mb-10">
          <span className="bg-rose-100 text-rose-700 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
            Riwayat Janji Temu
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-3">Janji Temu Saya</h1>
          <p className="text-slate-600 text-sm mt-2">
            Masuk sebagai <strong>{session.user?.name}</strong>
          </p>
        </div>

        {total === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center">
            <p className="text-sm text-slate-500 mb-4">Belum ada janji temu yang tercatat.</p>
            <Link
              href="/janji-temu"
              className="inline-block bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-xl text-xs font-semibold"
            >
              Buat Janji Temu
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            <section>
              <h2 className="text-sm font-bold text-slate-900 mb-3">Akan Datang ({upcoming.length})</h2>
              {upcoming.length === 0 ? (
                <p className="text-xs text-slate-400">Tidak ada janji temu mendatang.</p>
              ) : (
                <div className="space-y-3">
                  {upcoming.map((a) => (
                    <AppointmentCard key={a.id} appointment={a as AppointmentWithRelations} />
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-sm font-bold text-slate-900 mb-3">Riwayat ({past.length})</h2>
              {past.length === 0 ? (
                <p className="text-xs text-slate-400">Belum ada riwayat janji temu.</p>
              ) : (
                <div className="space-y-3">
                  {past.map((a) => (
                    <AppointmentCard key={a.id} appointment={a as AppointmentWithRelations} />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}