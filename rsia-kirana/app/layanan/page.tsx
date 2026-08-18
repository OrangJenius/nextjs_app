'use client';

import React, { useState } from 'react';
import LinkNext from 'next/link';
import Image from 'next/image';
import { 
  Heart, 
  Baby, 
  Activity, 
  Stethoscope, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ArrowLeft, 
  PhoneCall, 
  Calendar
} from 'lucide-react';

export default function LayananPage() {
  const [activeCategory, setActiveCategory] = useState<'semua' | 'ibuAnak' | 'jantung' | 'endokrin' | 'mcu'>('semua');

  const services = [
    {
      id: 1,
      category: 'ibuAnak',
      icon: <Heart className="text-rose-500" size={28} />,
      title: "Pemeriksaan Kebidanan & USG 4D",
      description: "Pelayanan kesehatan ibu hamil, pemantauan janin dengan USG 2D & 4D, serta pemeriksaan kebidanan lengkap oleh Dokter Spesialis Obsgyn.",
      features: ["Pemeriksaan USG 2D & 4D Live", "Pemeriksaan CTG Janin", "Konsultasi Kehamilan & Kandungan"],
      badge: "Unggulan"
    },
    {
      id: 2,
      category: 'ibuAnak',
      icon: <Baby className="text-sky-500" size={28} />,
      title: "Klinik Spesialis Anak & NICU",
      description: "Pemeriksaan kesehatan bayi, anak, dan remaja serta fasilitas perawatan intensif bayi baru lahir (NICU) & Perinatologi.",
      features: ["Tim Dokter Spesialis Anak", "Ruang Perinatologi & NICU Steril", "Persalinan VK & PONEK 24 Jam"],
      badge: "Fasilitas Kritis"
    },
    {
      id: 3,
      category: 'jantung',
      icon: <Activity className="text-red-500" size={28} />,
      title: "Diagnostik Non-Invasif Jantung",
      description: "Pencegahan dan pengobatan penyakit jantung & pembuluh darah dengan teknologi pemeriksaan diagnostik non-invasif modern.",
      features: ["Echocardiography (USG Jantung)", "Treadmill Test", "Pemeriksaan EKG Standar"],
      badge: "Spesialis"
    },
    {
      id: 4,
      category: 'jantung',
      icon: <Clock className="text-indigo-500" size={28} />,
      title: "Terapi EECP & Holter Monitoring",
      description: "Layanan evaluasi dan terapi rawat jalan untuk menjaga serta memulihkan kinerja sistem pembuluh darah dan jantung.",
      features: ["EECP (Enhanced External Counterpulsation)", "Holter Monitoring 24 Jam", "Spesialis Jantung & Pembuluh Darah"],
      badge: null
    },
    {
      id: 5,
      category: 'endokrin',
      icon: <Stethoscope className="text-emerald-500" size={28} />,
      title: "Klinik Diabetes & Metabolik",
      description: "Penanganan sub-spesialistik untuk pencegahan, pengobatan, dan pengelolaan Diabetes Melitus serta gangguan metabolik.",
      features: ["Spesialis Penyakit Dalam (Sp.PD-KEMD)", "Skrining & Tata Laksana Diabetes", "Konsultasi Edukasi & Gizi"],
      badge: null
    },
    {
      id: 6,
      category: 'endokrin',
      icon: <Sparkles className="text-amber-500" size={28} />,
      title: "Klinik Gangguan Tiroid & Hormonal",
      description: "Pelayanan diagnostik dan terapi komprehensif untuk masalah kelenjar tiroid (Hipertiroid/Hipotiroid) serta sistem hormon.",
      features: ["Evaluasi Fungsi Kelenjar Tiroid", "Pemeriksaan Laboratorium Penunjang", "Pendampingan Medis Berkelanjutan"],
      badge: null
    }
  ];

  // --- DATA PAKET GENERAL MEDICAL CHECK UP (dari brosur) ---
  const mcuPackages = [
    {
      id: 'standar',
      name: 'Standar',
      price: '355.000',
      features: [
        'Pemeriksaan Darah Lengkap',
        'Pemeriksaan Gula Darah Puasa',
        'Pemeriksaan Asam Urat',
        'Pemeriksaan Kolesterol Total',
        'Konsultasi dan Pemeriksaan Fisik Dokter'
      ],
      highlight: false
    },
    {
      id: 'gold',
      name: 'Gold',
      price: '795.000',
      features: [
        'Pemeriksaan Darah Lengkap',
        'Pemeriksaan Gula Darah Puasa',
        'Pemeriksaan Asam Urat',
        'EKG (Rekam Jantung)',
        'Profil Lipid (Kolesterol Total, LDL-HDL-Trigliserida)',
        'Urinalisis',
        'Konsultasi dan Pemeriksaan Fisik Dokter'
      ],
      highlight: true
    },
    {
      id: 'platinum',
      name: 'Platinum',
      price: '1.250.000',
      features: [
        'Pemeriksaan Darah Lengkap',
        'Pemeriksaan Gula Darah Puasa',
        'Pemeriksaan Asam Urat',
        'EKG (Rekam Jantung)',
        'Profil Lipid (Kolesterol Total, LDL-HDL-Trigliserida)',
        'Pemeriksaan Fungsi Hati (SGOT, SGPT)',
        'Pemeriksaan Fungsi Ginjal (Ureum, Kreatinin)',
        'Konsultasi dan Pemeriksaan Fisik Dokter'
      ],
      highlight: false
    }
  ];

  const filteredServices = activeCategory === 'semua' 
    ? services 
    : services.filter(s => s.category === activeCategory);

  const showMcu = activeCategory === 'semua' || activeCategory === 'mcu';

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
            Komitmen Pelayanan Medis
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">Layanan Medis & Fasilitas Unggulan</h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3 max-w-2xl mx-auto">
            Didedikasikan untuk memberikan pelayanan kesehatan berkualitas tinggi bagi Ibu, Anak, serta Pelayanan Spesialis Jantung dan Endokrin.
          </p>
        </div>
      </section>

      {/* --- MAIN CONTENT CONTAINER --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* --- CATEGORY FILTER TABS --- */}
        <div className="flex justify-center flex-wrap gap-2 mb-10">
          {[
            { id: 'semua', label: 'Semua Layanan' },
            { id: 'ibuAnak', label: 'Kesehatan Ibu & Anak' },
            { id: 'jantung', label: 'Pelayanan Jantung' },
            { id: 'endokrin', label: 'Pelayanan Endokrin' },
            { id: 'mcu', label: 'Medical Check Up' },
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
        {filteredServices.length > 0 && (
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
        )}

        {/* --- GENERAL MEDICAL CHECK UP SECTION (dari brosur) --- */}
        {showMcu && (
          <div className={filteredServices.length > 0 ? 'mt-20' : ''}>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="bg-rose-100 text-rose-700 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
                Paket Kesehatan
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
                General Medical Check Up
              </h2>
              <p className="text-slate-600 text-sm mt-2">di RSIA Kirana Manado</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {mcuPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`rounded-3xl p-7 border shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden ${
                    pkg.highlight
                      ? 'bg-gradient-to-b from-rose-500 to-pink-600 text-white border-rose-500 scale-[1.02]'
                      : 'bg-white text-slate-800 border-slate-100'
                  }`}
                >
                  <div>
                    <span
                      className={`inline-block text-[10px] font-extrabold px-3 py-1 rounded-full uppercase mb-4 ${
                        pkg.highlight
                          ? 'bg-white text-rose-600'
                          : 'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}
                    >
                      {pkg.name}
                    </span>

                    <p className={`text-[10px] italic ${pkg.highlight ? 'text-rose-100' : 'text-slate-400'}`}>
                      Harga Spesial
                    </p>
                    <p className="text-2xl font-extrabold mb-5">
                      Rp {pkg.price}
                      <span className="text-xs font-medium">,-</span>
                    </p>

                    <div
                      className={`space-y-2 border-t pt-4 mb-6 ${
                        pkg.highlight ? 'border-rose-300/50' : 'border-slate-100'
                      }`}
                    >
                      {pkg.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs">
                          <CheckCircle2
                            size={14}
                            className={`shrink-0 mt-0.5 ${pkg.highlight ? 'text-white' : 'text-emerald-500'}`}
                          />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <LinkNext
                    href="/janji-temu"
                    className={`w-full text-center font-semibold text-xs py-2.5 rounded-xl border transition-all block ${
                      pkg.highlight
                        ? 'bg-white text-rose-600 border-white hover:bg-rose-50'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'
                    }`}
                  >
                    Book Now
                  </LinkNext>
                </div>
              ))}
            </div>

            {/* Info kontak lanjutan MCU */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-slate-600">
              <span className="font-semibold text-slate-700">Informasi lebih lanjut hubungi:</span>
              <div className="flex items-center gap-3">
                <a
                  href="https://wa.me/6281388888898"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 bg-rose-50 text-rose-600 px-3 py-1.5 rounded-full hover:bg-rose-100 transition-all"
                >
                  <PhoneCall size={14} /> 0813-8888-8898
                </a>
                <a
                  href="https://instagram.com/rsiakirana_manado"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 bg-rose-50 text-rose-600 px-3 py-1.5 rounded-full hover:bg-rose-100 transition-all"
                >
                  @rsiakirana_manado
                </a>
                <a
                  href="https://facebook.com/RSIAKiranaManado"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 bg-rose-50 text-rose-600 px-3 py-1.5 rounded-full hover:bg-rose-100 transition-all"
                >
                  RSIA Kirana Manado
                </a>
              </div>
            </div>
          </div>
        )}

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