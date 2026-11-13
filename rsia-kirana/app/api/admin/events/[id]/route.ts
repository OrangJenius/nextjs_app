import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAdminSession } from '@/lib/admin';
import { prisma } from '@/lib/prisma';
import { parseEventBody } from '@/lib/adminInput';

// Next.js 16: params adalah Promise
type Ctx = { params: Promise<{ id: string }> };

function revalidateEventPages() {
  revalidatePath('/events');
  revalidatePath('/events/[id]', 'page');
}

export async function PUT(req: Request, { params }: Ctx) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const eventId = Number((await params).id);
  if (!Number.isInteger(eventId)) {
    return NextResponse.json({ error: 'ID tidak valid.' }, { status: 400 });
  }

  const parsed = parseEventBody(await req.json().catch(() => null));
  if ('error' in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const exists = await prisma.events.findUnique({ where: { id: eventId }, select: { id: true } });
  if (!exists) {
    return NextResponse.json({ error: 'Event tidak ditemukan.' }, { status: 404 });
  }

  try {
    // Daftar gambar diganti seluruhnya sesuai urutan di form
    await prisma.$transaction(async (tx) => {
      await tx.events.update({ where: { id: eventId }, data: parsed.data });
      await tx.event_images.deleteMany({ where: { event_id: eventId } });
      if (parsed.images.length > 0) {
        await tx.event_images.createMany({
          data: parsed.images.map((img, i) => ({
            event_id: eventId,
            url: img.url,
            caption: img.caption,
            sort_order: i,
          })),
        });
      }
    });

    revalidateEventPages();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Update event error:', err);
    return NextResponse.json({ error: 'Gagal menyimpan event.' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const eventId = Number((await params).id);
  if (!Number.isInteger(eventId)) {
    return NextResponse.json({ error: 'ID tidak valid.' }, { status: 400 });
  }

  try {
    await prisma.events.delete({ where: { id: eventId } }); // gambar ikut terhapus (cascade)
    revalidateEventPages();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Event tidak ditemukan.' }, { status: 404 });
  }
}