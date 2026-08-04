'use client';

import React, { useState } from 'react';
import Link from 'next/link'; // fallback
import LinkNext from 'next/link';
import { 
  Heart, 
  Baby, 
  ShieldCheck, 
  Stethoscope, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ArrowLeft, 
  PhoneCall, 
  Calendar 
} from 'lucide-react';

export default function LayananPage() {
  const [activeCategory, setActiveCategory] = useState<'semua' | 'ibu' | 'anak' | 'fasilitas'>('semua');

  const services = [
    {
      id: 1,
      category: 'ibu',
      icon: <Heart className="text-rose-500" size={28} />,
      title: "Persalinan Metode ERACS",
      description: "Teknik operasi caesar dengan pemulihan lebih cepat, rasa nyeri minim, dan memungkinkan ibu langsung berinteraksi dengan bayi.",
      features: ["Bisa duduk/berjalan lebih cepat", "Nyeri pasca operasi minimal", "Pendampingan dokter anestesi senior"],
      badge: "Populer"
    },
    {
      id: 2,
      category: 'ibu',
      icon: <Sparkles className="text-amber-500" size={28} />,
      title: "Pemeriksaan USG 4D Live",
      description: "Melihat wajah dan gerakan janin secara nyata dan jelas, lengkap dengan evaluasi organ dalam oleh Dokter Spesialis OG.",
      features: ["Cetak foto 4D berwarna", "Video rekaman janin", "Konsultasi kondisi janin terpadu"],
      badge: "Unggulan"
    },
    {
      id: 3,
      category: 'anak',
      icon: <Baby className="text-sky-500" size={28} />,
      title: "Klinik Tumbuh Kembang Anak",
      description: "Layanan pemantauan motorik, sensorik, dan wicara buah hati didampingi tim dokter spesialis anak & terapis berpengalaman.",
      features: ["Skrining autisme & ADHD", "Terapi wicara & okupasi", "Konsultasi nutrisi & gizi anak"],
      badge: null
    },
    {
      id: 4,
      category: 'anak',
      icon: <Stethoscope className="text-indigo-500" size={28} />,
      title: "Imunisasi & Vaksinasi Lengkap",
      description: "Pemberian vaksin dasar hingga lanjutan dengan rantai dingin (cold-chain) terjamin untuk menjaga efektivitas vaksin.",
      features: ["Vaksin impor & nasional", "Ruang tunggu anak terpisah", "Buku rekam imunisasi digital"],
      badge: null
    },
    {
      id: 5,
      category: 'fasilitas',
      icon: <ShieldCheck className="text-emerald-500" size={28} />,
      title: "Ruang Perawatan NICU & PICU",
      description: "Unit perawatan intensif khusus untuk bayi prematur/kritis (NICU) dan anak-anak (PICU) dengan pemantauan 24 jam.",
      features: ["Inkubator canggih & ventilator", "Tim medis siaga 24 jam", "Akses kontrol steril ketat"],
      badge: "Fasilitas Kritis"
    },
    {
      id: 6,
      category: 'fasilitas',
      icon: <Clock className="text-rose-600" size={28} />,
      title: "IGD Ibu & Anak 24 Jam",
      description: "Penanganan kegawatdaruratan kebidanan dan anak secara cepat dan tepat oleh tim respon cepat.",
      features: ["Ambulans jemputan siaga", "Kamar tindakan darurat khusus", "Dokter jaga siaga di tempat"],
      badge: "24/7 Siaga"
    }
  ];

  const filteredServices = activeCategory === 'semua' 
    ? services 
    : services.filter(s => s.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      
      {/* --- NAVBAR SIMPLE --- */}
      <header className="bg-white border-b border-rose-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <LinkNext href="/" className="flex items-center gap-2 text-slate-600 hover:text-rose-600 font-medium text-sm transition-colors">
            <ArrowLeft size={18} /> Kembali ke Beranda
          </LinkNext>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
              <Heart className="fill-current" size={16} />
            </div>
            <span className="font-bold text-slate-900 tracking-tight text-sm">RSIA KIRANA</span>
          </div>
        </div>
      </header>

      {/* --- HERO HEADER --- */}
      <section className="bg-gradient-to-b from-rose-50 to-slate-50 py-14 border-b border-rose-100/50">
        <div className="max-w-4xl mx-auto text-center px-4">
          <span className="bg-rose-100 text-rose-700 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
            Komitmen Pelayanan Medis
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">Layanan Medis & Fasilitas Unggulan</h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3 max-w-2xl mx-auto">
            Didedikasikan khusus untuk kenyamanan dan keselamatan Ibu serta Buah Hati dengan penanganan medis berbasis teknologi modern.
          </p>
        </div>
      </section>

      {/* --- MAIN CONTENT CONTAINER --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* --- CATEGORY FILTER TABS --- */}
        <div className="flex justify-center flex-wrap gap-2 mb-10">
          {[
            { id: 'semua', label: 'Semua Layanan' },
            { id: 'ibu', label: 'Kesehatan Ibu & Kandungan' },
            { id: 'anak', label: 'Kesehatan & Tumbuh Kembang Anak' },
            { id: 'fasilitas', label: 'Fasilitas & Intensif' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all shadow-sm ${
                activeCategory === tab.id
                  ? 'bg-rose-500 text-white shadow-rose-200'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* --- SERVICE CARDS GRID --- */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div 
              key={service.id} 
              className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
            >
              {service.badge && (
                <span className="absolute top-4 right-4 bg-rose-50 text-rose-600 border border-rose-100 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                  {service.badge}
                </span>
              )}

              <div>
                <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-5">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{service.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Features List */}
                <div className="space-y-2 border-t border-slate-100 pt-4 mb-6">
                  {service.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Link inside Card */}
              <LinkNext 
                href="/janji-temu" 
                className="w-full bg-slate-50 hover:bg-rose-50 hover:text-rose-600 text-slate-700 text-center font-semibold text-xs py-2.5 rounded-xl border border-slate-200 hover:border-rose-200 transition-all block"
              >
                Reservasi Layanan Ini
              </LinkNext>
            </div>
          ))}
        </div>

        {/* --- CALL TO ACTION BANNER --- */}
        <div className="mt-16 bg-gradient-to-r from-rose-500 to-pink-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold">Konsultasikan Kebutuhan Anda Sekarang</h2>
            <p className="text-rose-100 text-sm max-w-xl">
              Bingung memilih layanan yang tepat? Tim perawat dan customer service RSIA Kirana siap memberikan petunjuk dan bantuan.
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