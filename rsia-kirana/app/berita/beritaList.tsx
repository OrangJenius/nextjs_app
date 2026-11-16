'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Newspaper } from 'lucide-react';
import { isExternalImage } from '@/lib/events';

export interface BeritaItem {
  id: number;
  category: 'berita' | 'update';
  tag: string;
  image: string | null;
  title: string;
  excerpt: string;
  source: string | null;
  date: string | null;
  hashtag: string | null;
}

type Filter = 'semua' | 'berita' | 'update';

const tabs: { id: Filter; label: string }[] = [
  { id: 'semua', label: 'Semua' },
  { id: 'berita', label: 'Berita' },
  { id: 'update', label: 'Update' },
];
const PAGE_SIZE = 3;

function Thumb({
  item,
  className,
  sizes,
  priority = false,
}: {
  item: BeritaItem;
  className: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
      {item.image ? (
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes={sizes}
          priority={priority}
          unoptimized={isExternalImage(item.image)}
          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-slate-300">
          <Newspaper size={36} />
        </div>
      )}
    </div>
  );
}

function Kicker({ item }: { item: BeritaItem }) {
  return (
    <span className="text-[11px] font-bold uppercase tracking-widest text-rose-600">{item.tag}</span>
  );
}

function Byline({ item }: { item: BeritaItem }) {
  const meta = [item.source, item.date].filter(Boolean).join(' · ') || 'RSIA Kirana Manado';
  return (
    <p className="text-[11px] uppercase tracking-wide text-slate-500">
      {meta}
      {item.hashtag && <span className="ml-2 normal-case text-rose-600">{item.hashtag}</span>}
    </p>
  );
}

// Tautan tak terlihat yang menutupi seluruh kartu: tampilan kartu tidak berubah,
// tetapi seluruh kartu bisa diklik untuk membuka artikel.
function CardLink({ item }: { item: BeritaItem }) {
  return (
    <Link
      href={`/berita/${item.id}`}
      aria-label={item.title}
      className="absolute inset-0 z-10"
    />
  );
}

export default function BeritaList({ items }: { items: BeritaItem[] }) {
  const [activeCategory, setActiveCategory] = useState<Filter>('semua');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filteredItems =
    activeCategory === 'semua' ? items : items.filter((item) => item.category === activeCategory);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const remaining = filteredItems.length - visibleItems.length;

  const [lead, ...rest] = visibleItems;
  const latest = filteredItems.slice(0, 5);

  const handleTabChange = (id: Filter) => {
    setActiveCategory(id);
    setVisibleCount(PAGE_SIZE); // start over when switching category
  };

  return (
    <>
      {/* --- SECTION NAV (newspaper style) --- */}
      <nav className="flex gap-8 border-b border-slate-200 mb-8" aria-label="Kategori">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`relative pb-3 text-sm font-semibold uppercase tracking-wider transition-colors ${
              activeCategory === tab.id ? 'text-slate-900' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            {tab.label}
            {activeCategory === tab.id && (
              <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-rose-500" />
            )}
          </button>
        ))}
      </nav>

      {!lead ? (
        <div className="text-center py-16 border border-dashed border-slate-200">
          <Newspaper className="mx-auto text-slate-300 mb-3" size={40} />
          <p className="text-slate-500 font-medium text-sm">Belum ada berita untuk kategori ini.</p>
        </div>
      ) : (
        <>
          {/* --- LEAD STORY --- */}
          <article className="group relative grid lg:grid-cols-5 gap-6 lg:gap-10 pb-10 mb-10 border-b border-slate-200">
            <Thumb
              item={lead}
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="lg:col-span-3 aspect-[16/10]"
            />
            <div className="lg:col-span-2 flex flex-col justify-center gap-3">
              <Kicker item={lead} />
              <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight text-slate-900">
                {lead.title}
              </h2>
              <p className="text-base text-slate-600 leading-relaxed line-clamp-4">{lead.excerpt}</p>
              <Byline item={lead} />
            </div>
            <CardLink item={lead} />
          </article>

          {rest.length > 0 && (
            <div className="grid lg:grid-cols-3 gap-10">
              {/* --- STORY LIST --- */}
              <div className="lg:col-span-2 divide-y divide-slate-200">
                {rest.map((item) => (
                  <article key={item.id} className="group relative flex gap-5 sm:gap-6 py-6 first:pt-0">
                    <div className="flex-1 min-w-0 flex flex-col gap-2">
                      <Kicker item={item} />
                      <h3 className="font-serif text-xl sm:text-2xl font-bold leading-snug text-slate-900 group-hover:text-rose-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 sm:line-clamp-3">
                        {item.excerpt}
                      </p>
                      <div className="mt-auto pt-1">
                        <Byline item={item} />
                      </div>
                    </div>
                    <Thumb
                      item={item}
                      sizes="(max-width: 640px) 120px, 200px"
                      className="w-28 sm:w-48 aspect-[4/3] shrink-0 self-start"
                    />
                    <CardLink item={item} />
                  </article>
                ))}
              </div>

              {/* --- SIDEBAR: TERBARU --- */}
              <aside className="lg:sticky lg:top-24 self-start">
                <h4 className="border-t-4 border-slate-900 pt-3 mb-2 text-sm font-extrabold uppercase tracking-widest text-slate-900">
                  Terbaru
                </h4>
                <ol className="divide-y divide-slate-200">
                  {latest.map((item, i) => (
                    <li key={item.id} className="flex gap-4 py-4">
                      <span className="font-serif text-3xl font-bold leading-none text-rose-500/80">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <Link
                          href={`/berita/${item.id}`}
                          className="block font-serif font-semibold leading-snug text-slate-900 hover:text-rose-600 transition-colors"
                        >
                          {item.title}
                        </Link>
                        <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-500">
                          {item.date ?? item.tag}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </aside>
            </div>
          )}
          {remaining > 0 && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="border border-slate-900 px-8 py-3 text-xs font-bold uppercase tracking-widest text-slate-900 transition-colors hover:bg-slate-900 hover:text-white"
              >
                Muat Lebih Banyak ({remaining})
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}