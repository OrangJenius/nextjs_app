import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAdminSession } from '@/lib/admin';
import { prisma } from '@/lib/prisma';
import { parseArticleBody, isUniqueViolation } from '@/lib/adminInput';

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const articleId = Number((await params).id);
  if (!Number.isInteger(articleId)) {
    return NextResponse.json({ error: 'ID tidak valid.' }, { status: 400 });
  }

  const parsed = parseArticleBody(await req.json().catch(() => null));
  if ('error' in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const existing = await prisma.articles.findUnique({
    where: { id: articleId },
    select: { published_at: true },
  });
  if (!existing) {
    return NextResponse.json({ error: 'Artikel tidak ditemukan.' }, { status: 404 });
  }

  // Tanggal terbit lama dipertahankan; baru diisi saat pertama kali diterbitkan
  const published_at = parsed.published ? existing.published_at ?? new Date() : null;

  try {
    await prisma.articles.update({
      where: { id: articleId },
      data: { ...parsed.data, published_at },
    });

    revalidatePath('/');
    revalidatePath('/berita');
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (isUniqueViolation(err)) {
      return NextResponse.json({ error: 'Slug sudah dipakai artikel lain.' }, { status: 409 });
    }
    console.error('Update article error:', err);
    return NextResponse.json({ error: 'Gagal menyimpan artikel.' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const articleId = Number((await params).id);
  if (!Number.isInteger(articleId)) {
    return NextResponse.json({ error: 'ID tidak valid.' }, { status: 400 });
  }

  try {
    await prisma.articles.delete({ where: { id: articleId } });
    revalidatePath('/');
    revalidatePath('/berita');
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Artikel tidak ditemukan.' }, { status: 404 });
  }
}