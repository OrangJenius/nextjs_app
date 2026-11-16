import React, { cache } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { DEFAULT_TAGS, formatArticleDate, makeExcerpt, type ArticleCategory } from '@/lib/articles';
import { safeImageSrc } from '@/lib/images';
import { isExternalImage } from '@/lib/events';

// Hanya artikel yang sudah terbit yang bisa dibuka. cache() mencegah query ganda
// karena halaman dan generateMetadata memakai data yang sama.
const getArticle = cache(async (id: number) =>
  prisma.articles.findFirst({ where: { id, published_at: { not: null } } })
);

// Next.js 16: params adalah Promise
type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) return {};

  const article = await getArticle(id);
  if (!article) return {};

  return {
    title: `${article.title} | RSIA Kirana`,
    description: article.excerpt || makeExcerpt(article.content),
  };
}

export default async function BeritaDetailPage({ params }: Props) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();

  const article = await getArticle(id);
  if (!article) notFound();

  const category: ArticleCategory = article.category === 'update' ? 'update' : 'berita';
  const tag = article.tag || DEFAULT_TAGS[category];
  const image = safeImageSrc(article.cover_image_url);
  const date = article.published_at ? formatArticleDate(article.published_at) : null;
  const meta = [article.source, date].filter(Boolean).join(' · ') || 'RSIA Kirana Manado';

  // Isi lengkap dipecah per paragraf (baris kosong). Jika isi kosong, pakai ringkasan.
  const body = article.content.trim() || article.excerpt || '';
  const paragraphs = body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      {/* --- NAVBAR SIMPLE --- */}
      <header className="bg-white border-b border-rose-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/berita" className="flex items-center gap-2 text-slate-600 hover:text-rose-600 font-medium text-sm transition-colors">
            <ArrowLeft size={18} /> Kembali ke Berita
          </Link>
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Logo RSIA Kirana"
              width={32}
              height={32}
              className="object-contain"
              priority
            />
            <span className="font-bold text-slate-900 tracking-tight text-sm">RSIA KIRANA</span>
          </div>
        </div>
      </header>

      {/* --- ARTIKEL (gaya koran, sama dengan halaman daftar berita) --- */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 mt-10">
        <span className="text-[11px] font-bold uppercase tracking-widest text-rose-600">{tag}</span>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight text-slate-900 mt-3">
          {article.title}
        </h1>

        <p className="mt-5 pb-6 border-b border-slate-200 text-[11px] uppercase tracking-wide text-slate-500">
          {meta}
          {article.hashtag && <span className="ml-2 normal-case text-rose-600">{article.hashtag}</span>}
        </p>

        {/* Gambar tampil utuh dengan proporsi aslinya (flyer tidak dipotong) */}
        {image && (
          <div className="mt-8 bg-slate-100">
            <Image
              src={image}
              alt={article.title}
              width={0}
              height={0}
              sizes="(max-width: 768px) 100vw, 768px"
              unoptimized={isExternalImage(image)}
              priority
              className="w-full h-auto"
            />
          </div>
        )}

        <div className="mt-8 space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
          {paragraphs.map((p, i) => (
            <p key={i} className="whitespace-pre-line">
              {p}
            </p>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200">
          <Link
            href="/berita"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-900 hover:text-rose-600 transition-colors"
          >
            <ArrowLeft size={14} /> Semua Berita
          </Link>
        </div>
      </article>
    </div>
  );
}