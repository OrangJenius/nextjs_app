import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin';
import { prisma } from '@/lib/prisma';

const VALID_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'];

// Next.js 16: params adalah Promise
type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const { status } = await req.json();

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Status tidak valid.' }, { status: 400 });
  }

  try {
    const updated = await prisma.appointments.update({
      where: { id: Number(id) },
      data: { status },
    });
    return NextResponse.json({ id: updated.id, status: updated.status });
  } catch {
    return NextResponse.json({ error: 'Janji temu tidak ditemukan.' }, { status: 404 });
  }
}