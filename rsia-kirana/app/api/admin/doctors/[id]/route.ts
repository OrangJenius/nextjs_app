import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAdminSession } from '@/lib/admin';
import { prisma } from '@/lib/prisma';
import { parseDoctorBody } from '@/lib/adminInput';
import { hhmmToDate } from '@/lib/time';

// Next.js 16: params adalah Promise
type Ctx = { params: Promise<{ id: string }> };

function revalidateDoctorPages() {
  revalidatePath('/');
  revalidatePath('/dokter');
  revalidatePath('/janji-temu');
}

export async function PUT(req: Request, { params }: Ctx) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const parsed = parseDoctorBody(await req.json().catch(() => null));
  if ('error' in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const exists = await prisma.doctors.findUnique({ where: { id }, select: { id: true } });
  if (!exists) {
    return NextResponse.json({ error: 'Dokter tidak ditemukan.' }, { status: 404 });
  }

  try {
    // Jadwal diganti seluruhnya: hapus yang lama, buat yang baru
    await prisma.$transaction(async (tx) => {
      await tx.doctors.update({ where: { id }, data: parsed.data });
      await tx.doctors_schedule.deleteMany({ where: { doctor_id: id } });
      if (parsed.schedules.length > 0) {
        await tx.doctors_schedule.createMany({
          data: parsed.schedules.map((s) => ({
            doctor_id: id,
            day_of_week: s.dayOfWeek,
            start_time: hhmmToDate(s.start),
            end_time: hhmmToDate(s.end),
          })),
        });
      }
    });

    revalidateDoctorPages();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Update doctor error:', err);
    return NextResponse.json({ error: 'Gagal menyimpan dokter.' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;

  // Dokter yang sudah punya janji temu tidak dihapus agar riwayat tidak rusak
  const used = await prisma.appointments.count({ where: { doctor_id: id } });
  if (used > 0) {
    return NextResponse.json(
      {
        error: `Dokter ini punya ${used} janji temu. Nonaktifkan saja (hilangkan centang "Aktif") agar riwayat tetap utuh.`,
      },
      { status: 409 }
    );
  }

  try {
    await prisma.doctors.delete({ where: { id } }); // jadwal ikut terhapus (cascade)
    revalidateDoctorPages();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Dokter tidak ditemukan.' }, { status: 404 });
  }
}