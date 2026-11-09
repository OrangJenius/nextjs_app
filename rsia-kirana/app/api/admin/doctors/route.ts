import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAdminSession } from '@/lib/admin';
import { prisma } from '@/lib/prisma';
import { parseDoctorBody } from '@/lib/adminInput';
import { hhmmToDate } from '@/lib/time';

export async function POST(req: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const parsed = parseDoctorBody(await req.json().catch(() => null));
  if ('error' in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const doctor = await prisma.doctors.create({
      data: {
        ...parsed.data,
        doctors_schedule: {
          create: parsed.schedules.map((s) => ({
            day_of_week: s.dayOfWeek,
            start_time: hhmmToDate(s.start),
            end_time: hhmmToDate(s.end),
          })),
        },
      },
    });

    revalidatePath('/');
    revalidatePath('/dokter');
    revalidatePath('/janji-temu');
    // revalidatePath('/admin/dokter');
    return NextResponse.json({ id: doctor.id }, { status: 201 });
  } catch (err) {
    console.error('Create doctor error:', err);
    return NextResponse.json({ error: 'Gagal menyimpan dokter.' }, { status: 500 });
  }
}