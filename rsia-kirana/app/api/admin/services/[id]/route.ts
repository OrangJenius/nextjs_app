import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAdminSession } from '@/lib/admin';
import { prisma } from '@/lib/prisma';
import { parseServiceBody, isUniqueViolation } from '@/lib/adminInput';

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const serviceId = Number((await params).id);
  if (!Number.isInteger(serviceId)) {
    return NextResponse.json({ error: 'ID tidak valid.' }, { status: 400 });
  }

  const parsed = parseServiceBody(await req.json().catch(() => null));
  if ('error' in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    await prisma.services.update({ where: { id: serviceId }, data: parsed.data });
    revalidatePath('/');
    revalidatePath('/layanan');
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (isUniqueViolation(err)) {
      return NextResponse.json({ error: 'Slug sudah dipakai layanan lain.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Layanan tidak ditemukan.' }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const serviceId = Number((await params).id);
  if (!Number.isInteger(serviceId)) {
    return NextResponse.json({ error: 'ID tidak valid.' }, { status: 400 });
  }

  const used = await prisma.appointments.count({ where: { service_id: serviceId } });
  if (used > 0) {
    return NextResponse.json(
      { error: `Layanan ini dipakai ${used} janji temu, jadi tidak bisa dihapus.` },
      { status: 409 }
    );
  }

  try {
    await prisma.services.delete({ where: { id: serviceId } });
    revalidatePath('/');
    revalidatePath('/layanan');
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Layanan tidak ditemukan.' }, { status: 404 });
  }
}