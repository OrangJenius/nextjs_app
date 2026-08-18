'use client';

import React, { useState } from 'react';
import LinkNext from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  PhoneCall, 
  Calendar,
  Newspaper,
  Megaphone
} from 'lucide-react';

export default function BeritaPage() {
  const [activeCategory, setActiveCategory] = useState<'semua' | 'berita' | 'update'>('semua');

  // --- DATA BERITA (#KiranaNews) ---
  const newsItems = [
    {
      id: 'n1',
      category: 'berita',
      tag: '#KiranaNews',
      image: '/images/paskah 2026.png',
      title: 'Tim Medis RSIA Kirana Bertugas di Paskah Nasional 2026',
      excerpt:
        'Tim Medis RSIA Kirana Manado turut ambil bagian dalam kegiatan Paskah Nasional 2026 yang berlokasi di Pohon Kasih, Kawasan Megamas, dengan memberikan pelayanan kesehatan bagi para peserta kegiatan.',
      body: [
        'Tim Medis RSIA Kirana Manado turut ambil bagian dalam kegiatan Paskah Nasional 2026 yang berlokasi di Pohon Kasih, Kawasan Megamas, dengan memberikan pelayanan kesehatan bagi para peserta kegiatan.',
        'Dengan kesiapsiagaan dan dedikasi, tim hadir untuk memastikan keamanan dan kenyamanan selama acara berlangsung. Partisipasi ini menjadi wujud komitmen RSIA Kirana dalam menghadirkan pelayanan yang profesional dan humanis bagi masyarakat.'
      ],
      source: 'RSIA Kirana Manado',
      date: null
    },
    {
      id: 'n2',
      category: 'berita',
      tag: 'Liputan Media',
      image: '/images/familygathering.jpeg',
      title: 'RSIA Kirana Manado Gelar Family Gathering',
      excerpt:
        'RSIA Kirana Manado mengadakan family gathering bersama manajemen, tenaga medis, dan seluruh karyawan di Kabosaran Beach untuk mempererat kebersamaan dan kekompakan tim.',
      body: [
        'RSIA Kirana Manado mengadakan kegiatan family gathering yang diikuti oleh jajaran manajemen, tenaga medis, serta seluruh karyawan, bertempat di Kabosaran Beach.',
        'Kegiatan ini digelar sebagai momen untuk mempererat hubungan kekeluargaan sekaligus meningkatkan kekompakan antar tim melalui berbagai kegiatan kebersamaan di luar rutinitas kerja rumah sakit.',
        'Manajemen RSIA Kirana Manado berharap semangat kebersamaan yang terjalin dapat turut mendukung kualitas pelayanan bagi pasien dan masyarakat.'
      ],
      source: 'Manado Post — Evergreen Weekend, Sabtu 20 Juni 2026',
      date: '20 Juni 2026'
    }
  ];

  // --- DATA UPDATE (#KiranaUpdate) ---
  const updateItems = [
    {
      id: 'u1',
      category: 'update',
      tag: '#KiranaUpdate',
      image: '/images/alfagift.png',
      title: 'Kolaborasi RSIA Kirana x Alfagift',
      excerpt:
        'RSIA Kirana Manado menjalin kerja sama dengan Alfagift untuk memberikan gift voucher spesial bagi para pasien.',
      body: [
        'RSIA Kirana Manado menjalin kerja sama dengan Alfagift untuk memberikan gift voucher spesial bagi para pasien.',
        'Melalui kolaborasi ini, RSIA Kirana Manado berharap dapat menghadirkan nilai tambah dan bentuk apresiasi kepada pasien serta keluarga yang mempercayakan kesehatannya kepada kami.',
        'Semoga kerja sama ini dapat memberikan manfaat dan pengalaman yang lebih menyenangkan bagi setiap pasien di RSIA Kirana Manado.'
      ],
      partner: 'Alfagift',
      date: null
    },
    {
      id: 'u2',
      category: 'update',
      tag: '#KiranaUpdate',
      image: '/images/radiance.png',
      title: 'Kolaborasi RSIA Kirana x Radiance Baby Photography',
      excerpt:
        'RSIA Kirana Manado kini bekerja sama dengan Radiance Baby Photography untuk menghadirkan layanan foto newborn yang hangat, aman, dan penuh kenangan.',
      body: [
        'RSIA Kirana Manado kini bekerja sama dengan Radiance Baby Photography untuk menghadirkan layanan foto newborn yang hangat, aman, dan penuh kenangan.',
        'Kerja sama ini merupakan bagian dari komitmen RSIA Kirana Manado memberikan pelayanan yang lebih lengkap bagi keluarga, tidak hanya dalam hal kesehatan ibu dan bayi, tetapi juga dalam mengabadikan momen istimewa setelah kelahiran.'
      ],
      partner: 'Radiance Baby Photography',
      date: null,
      hashtag: '#KeKIRANAjo'
    }
  ];

  const allItems = [...newsItems, ...updateItems];

  const filteredItems =
    activeCategory === 'semua'
      ? allItems
      : allItems.filter((item) => item.category === activeCategory);

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

        {/* --- CATEGORY FILTER TABS --- */}
        <div className="flex justify-center flex-wrap gap-2 mb-10">
          {[
            { id: 'semua', label: 'Semua', icon: null },
            { id: 'berita', label: 'Berita', icon: <Newspaper size={14} /> },
            { id: 'update', label: 'Update', icon: <Megaphone size={14} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
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
        <div className="grid md:grid-cols-2 gap-8">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
            >
              {/* Image — shown uncropped since the flyer already has text baked in */}
              <div className="relative w-full bg-slate-100" style={{ aspectRatio: '3 / 4' }}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-contain"
                />
                <span
                  className={`absolute top-4 left-4 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase shadow-sm ${
                    item.category === 'berita'
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-900/85 text-white'
                  }`}
                >
                  {item.tag}
                </span>
              </div>

              {/* Caption — short, since the full write-up is already on the flyer */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {item.excerpt}
                </p>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{item.date || (item as any).source || (item as any).partner || 'RSIA Kirana Manado'}</span>
                  {(item as any).hashtag && (
                    <span className="text-rose-500 font-semibold">{(item as any).hashtag}</span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

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