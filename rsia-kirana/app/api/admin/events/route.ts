import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAdminSession } from '@/lib/admin';
import { prisma } from '@/lib/prisma';
import { parseEventBody } from '@/lib/adminInput';

export async function POST(req: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const parsed = parseEventBody(await req.json().catch(() => null));
  if ('error' in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const event = await prisma.events.create({
      data: {
        ...parsed.data,
        event_images: {
          create: parsed.images.map((img, i) => ({
            url: img.url,
            caption: img.caption,
            sort_order: i,
          })),
        },
      },
    });

    revalidatePath('/events');
    revalidatePath('/events/[id]', 'page');
    return NextResponse.json({ id: event.id }, { status: 201 });
  } catch (err) {
    console.error('Create event error:', err);
    return NextResponse.json({ error: 'Gagal menyimpan event.' }, { status: 500 });
  }
}