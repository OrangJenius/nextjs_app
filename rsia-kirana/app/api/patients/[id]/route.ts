import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Next.js 16: params adalah Promise
type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = Number((session.user as { id: string }).id);
  const { id } = await params;
  const { namaPasien, nik, noHp, email } = await req.json();

  if (!namaPasien || !nik || !noHp) {
    return NextResponse.json({ error: 'Nama, NIK, dan No. HP wajib diisi.' }, { status: 400 });
  }
  if (!/^\d{16}$/.test(nik)) {
    return NextResponse.json({ error: 'NIK harus tepat 16 digit angka.' }, { status: 400 });
  }

  // updateMany + filter user_id memastikan hanya pemilik yang bisa mengubah
  const result = await prisma.patients.updateMany({
    where: { id: Number(id), user_id: userId },
    data: { nama_pasien: namaPasien, nik, no_hp: noHp, email: email || null },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: 'Pasien tidak ditemukan.' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = Number((session.user as { id: string }).id);
  const { id } = await params;

  const result = await prisma.patients.deleteMany({
    where: { id: Number(id), user_id: userId },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: 'Pasien tidak ditemukan.' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}