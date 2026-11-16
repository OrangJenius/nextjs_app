import React from 'react';
import LinkNext from 'next/link';
import Image from 'next/image';
import { ArrowLeft, PhoneCall, Calendar } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { DEFAULT_TAGS, formatArticleDate, makeExcerpt, type ArticleCategory } from '@/lib/articles';
import { safeImageSrc } from '@/lib/images';
import BeritaList, { type BeritaItem } from './beritaList';

export default async function BeritaPage() {
  // Hanya artikel yang sudah diterbitkan (published_at terisi); draf tidak tampil
  const rows = await prisma.articles.findMany({
    where: { published_at: { not: null } },
    orderBy: [{ published_at: 'desc' }, { id: 'desc' }],
  });

  const items: BeritaItem[] = rows.map((a) => {
    const category: ArticleCategory = a.category === 'update' ? 'update' : 'berita';
    return {
      id: a.id,
      category,
      tag: a.tag || DEFAULT_TAGS[category],
      image: safeImageSrc(a.cover_image_url),
      title: a.title,
      excerpt: a.excerpt || makeExcerpt(a.content),
      source: a.source,
      date: a.published_at ? formatArticleDate(a.published_at) : null,
      hashtag: a.hashtag,
    };
  });

  const today = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Makassar',
  }).format(new Date());

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans pb-20">
      {/* --- NAVBAR --- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <LinkNext
            href="/"
            className="flex items-center gap-2 text-slate-600 hover:text-rose-600 font-medium text-sm transition-colors"
          >
            <ArrowLeft size={18} /> Kembali ke Beranda
          </LinkNext>
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

      {/* --- MASTHEAD --- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-slate-500 border-b border-slate-200 pb-3">
          <span>{today}</span>
          <span>Manado</span>
        </div>
        <div className="py-8 text-center border-b-4 border-double border-slate-900 mb-8">
          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight">
            Kabar Kirana
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3 max-w-2xl mx-auto">
            Kegiatan, liputan media, serta kerja sama dan layanan terbaru dari RSIA Kirana Manado.
          </p>
        </div>
      </section>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <BeritaList items={items} />

        {/* --- CONTACT STRIP --- */}
        <div className="mt-16 border-t-4 border-slate-900 pt-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center lg:text-left">
            <h2 className="font-serif text-2xl font-bold text-slate-900">Ingin Info Lebih Lanjut?</h2>
            <p className="text-slate-600 text-sm mt-1 max-w-xl">
              Tim customer service RSIA Kirana siap membantu menjawab pertanyaan Anda seputar layanan dan
              kegiatan terbaru kami.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <LinkNext
              href="/janji-temu"
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-3 text-xs sm:text-sm text-center transition-colors flex items-center justify-center gap-2"
            >
              <Calendar size={16} /> Buat Janji Temu
            </LinkNext>
            <a
              href="https://wa.me/6281388888898"
              target="_blank"
              rel="noreferrer"
              className="border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-bold px-6 py-3 text-xs sm:text-sm text-center transition-colors flex items-center justify-center gap-2"
            >
              <PhoneCall size={16} /> Chat CS WhatsApp
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}