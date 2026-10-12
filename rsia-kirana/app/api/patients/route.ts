import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Kolom DB pakai snake_case (nama_pasien, no_hp), tapi API ini menerima dan
// mengembalikan JSON camelCase (namaPasien, noHp) supaya frontend konsisten.

function toClient(p: {
  id: number;
  nama_pasien: string;
  nik: string;
  no_hp: string;
  email: string | null;
}) {
  return { id: p.id, namaPasien: p.nama_pasien, nik: p.nik, noHp: p.no_hp, email: p.email };
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = Number((session.user as { id: string }).id);
  const rows = await prisma.patients.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' },
  });

  return NextResponse.json(rows.map(toClient));
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { namaPasien, nik, noHp, email } = await req.json();

  if (!namaPasien || !nik || !noHp) {
    return NextResponse.json({ error: 'Nama, NIK, dan No. HP wajib diisi.' }, { status: 400 });
  }
  if (!/^\d{16}$/.test(nik)) {
    return NextResponse.json({ error: 'NIK harus tepat 16 digit angka.' }, { status: 400 });
  }

  const userId = Number((session.user as { id: string }).id);

  const created = await prisma.patients.create({
    data: {
      nama_pasien: namaPasien,
      nik,
      no_hp: noHp,
      email: email || null,
      user_id: userId,
    },
  });

  return NextResponse.json(toClient(created), { status: 201 });
}