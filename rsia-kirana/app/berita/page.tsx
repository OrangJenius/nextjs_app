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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">

      {/* --- NAVBAR SIMPLE --- */}
      <header className="bg-white border-b border-rose-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <LinkNext href="/" className="flex items-center gap-2 text-slate-600 hover:text-rose-600 font-medium text-sm transition-colors">
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

      {/* --- HERO HEADER --- */}
      <section className="bg-gradient-to-b from-rose-50 to-slate-50 py-14 border-b border-rose-100/50">
        <div className="max-w-4xl mx-auto text-center px-4">
          <span className="bg-rose-100 text-rose-700 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
            Kabar Terbaru
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">Berita & Update RSIA Kirana</h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3 max-w-2xl mx-auto">
            Ikuti kegiatan, liputan media, serta kerja sama dan layanan terbaru dari RSIA Kirana Manado.
          </p>
        </div>
      </section>

      {/* --- MAIN CONTENT CONTAINER --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">

        {/* Tab filter + kartu berita (butuh state, jadi Client Component) */}
        <BeritaList items={items} />

        {/* --- CALL TO ACTION BANNER --- */}
        <div className="mt-16 bg-gradient-to-r from-rose-500 to-pink-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold">Ingin Info Lebih Lanjut?</h2>
            <p className="text-rose-100 text-sm max-w-xl">
              Tim customer service RSIA Kirana siap membantu menjawab pertanyaan Anda seputar layanan dan kegiatan terbaru kami.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <LinkNext
              href="/janji-temu"
              className="bg-white text-rose-600 hover:bg-rose-50 font-bold px-6 py-3 rounded-xl text-xs sm:text-sm text-center transition-all flex items-center justify-center gap-2"
            >
              <Calendar size={16} /> Buat Janji Temu
            </LinkNext>
            <a
              href="https://wa.me/6281388888898"
              target="_blank"
              rel="noreferrer"
              className="bg-rose-700 hover:bg-rose-800 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm text-center transition-all flex items-center justify-center gap-2"
            >
              <PhoneCall size={16} /> Chat CS WhatsApp
            </a>
          </div>
        </div>

      </main>
    </div>
  );
}