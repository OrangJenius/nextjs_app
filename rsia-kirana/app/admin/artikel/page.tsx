import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin';
import { prisma } from '@/lib/prisma';
import ArtikelManager, { type AdminArticle } from './artikelManager';

export default async function AdminArtikelPage() {
  if (!(await getAdminSession())) {
    redirect('/admin/login');
  }

  const rows = await prisma.articles.findMany({
    orderBy: { created_at: 'desc' },
    take: 200,
  });

  const articles: AdminArticle[] = rows.map((a) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    content: a.content,
    coverImageUrl: a.cover_image_url,
    category: a.category,
    tag: a.tag,
    excerpt: a.excerpt,
    source: a.source,
    hashtag: a.hashtag,
    publishedAt: a.published_at ? a.published_at.toISOString() : null,
    createdAt: a.created_at.toISOString(),
  }));

  return <ArtikelManager articles={articles} />;
}