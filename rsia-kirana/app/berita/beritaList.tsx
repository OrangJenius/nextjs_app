'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Newspaper, Megaphone } from 'lucide-react';
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

const tabs: { id: Filter; label: string; icon: React.ReactNode }[] = [
  { id: 'semua', label: 'Semua', icon: null },
  { id: 'berita', label: 'Berita', icon: <Newspaper size={14} /> },
  { id: 'update', label: 'Update', icon: <Megaphone size={14} /> },
];

export default function BeritaList({ items }: { items: BeritaItem[] }) {
  const [activeCategory, setActiveCategory] = useState<Filter>('semua');

  const filteredItems =
    activeCategory === 'semua' ? items : items.filter((item) => item.category === activeCategory);

  return (
    <>
      {/* --- CATEGORY FILTER TABS --- */}
      <div className="flex justify-center flex-wrap gap-2 mb-10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold transition-all shadow-sm ${
              activeCategory === tab.id
                ? 'bg-rose-500 text-white shadow-rose-200'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- NEWS/UPDATE CARDS GRID --- */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-100">
          <Newspaper className="mx-auto text-slate-300 mb-3" size={40} />
          <p className="text-slate-500 font-medium text-sm">Belum ada berita untuk kategori ini.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {filteredItems.map((item) => {
            const meta = [item.source, item.date].filter(Boolean).join(' • ') || 'RSIA Kirana Manado';
            return (
              <article
                key={item.id}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
              >
                {/* Image — shown uncropped since the flyer already has text baked in */}
                <div className="relative w-full bg-slate-100" style={{ aspectRatio: '3 / 4' }}>
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      unoptimized={isExternalImage(item.image)}
                      className="object-contain"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                      <Newspaper size={48} />
                    </div>
                  )}
                  <span
                    className={`absolute top-4 left-4 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase shadow-sm ${
                      item.category === 'berita' ? 'bg-rose-500 text-white' : 'bg-slate-900/85 text-white'
                    }`}
                  >
                    {item.tag}
                  </span>
                </div>

                {/* Caption — short, since the full write-up is already on the flyer */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">{item.title}</h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{item.excerpt}</p>

                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{meta}</span>
                    {item.hashtag && <span className="text-rose-500 font-semibold">{item.hashtag}</span>}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}