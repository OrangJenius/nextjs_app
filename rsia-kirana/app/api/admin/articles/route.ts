import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAdminSession } from '@/lib/admin';
import { prisma } from '@/lib/prisma';
import { parseArticleBody, isUniqueViolation } from '@/lib/adminInput';

export async function POST(req: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const parsed = parseArticleBody(await req.json().catch(() => null));
  if ('error' in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const article = await prisma.articles.create({
      data: { ...parsed.data, published_at: parsed.published ? new Date() : null },
    });

    revalidatePath('/');
    revalidatePath('/berita');
    return NextResponse.json({ id: article.id }, { status: 201 });
  } catch (err) {
    if (isUniqueViolation(err)) {
      return NextResponse.json({ error: 'Slug sudah dipakai artikel lain.' }, { status: 409 });
    }
    console.error('Create article error:', err);
    return NextResponse.json({ error: 'Gagal menyimpan artikel.' }, { status: 500 });
  }
}