import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAdminSession } from '@/lib/admin';
import { prisma } from '@/lib/prisma';
import { parseServiceBody, isUniqueViolation } from '@/lib/adminInput';

export async function POST(req: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const parsed = parseServiceBody(await req.json().catch(() => null));
  if ('error' in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const service = await prisma.services.create({ data: parsed.data });
    revalidatePath('/');
    revalidatePath('/layanan');
    return NextResponse.json({ id: service.id }, { status: 201 });
  } catch (err) {
    if (isUniqueViolation(err)) {
      return NextResponse.json({ error: 'Slug sudah dipakai layanan lain.' }, { status: 409 });
    }
    console.error('Create service error:', err);
    return NextResponse.json({ error: 'Gagal menyimpan layanan.' }, { status: 500 });
  }
}