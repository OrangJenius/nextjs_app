import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin';
import { prisma } from '@/lib/prisma';

const VALID_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'];
const FINAL_STATUSES = ['completed', 'cancelled'];

// Next.js 16: params adalah Promise
type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const appointmentId = Number((await params).id);
  if (!Number.isInteger(appointmentId)) {
    return NextResponse.json({ error: 'ID tidak valid.' }, { status: 400 });
  }

  const { status, confirmed } = await req.json().catch(() => ({}));

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Status tidak valid.' }, { status: 400 });
  }

  const current = await prisma.appointments.findUnique({
    where: { id: appointmentId },
    select: { status: true },
  });
  if (!current) {
    return NextResponse.json({ error: 'Janji temu tidak ditemukan.' }, { status: 404 });
  }

  // Tidak ada perubahan
  if (current.status === status) {
    return NextResponse.json({ id: appointmentId, status });
  }

  // Perubahan yang wajib dikonfirmasi (aturan sama dengan dialog di halaman admin):
  // - dari Selesai/Dibatalkan ke status lain
  // - dari status apa pun ke Menunggu
  const needsConfirmation = FINAL_STATUSES.includes(current.status) || status === 'pending';
  if (needsConfirmation && confirmed !== true) {
    return NextResponse.json(
      { error: 'Perubahan status ini perlu konfirmasi.' },
      { status: 409 }
    );
  }

  const updated = await prisma.appointments.update({
    where: { id: appointmentId },
    data: { status },
  });

  return NextResponse.json({ id: updated.id, status: updated.status });
}