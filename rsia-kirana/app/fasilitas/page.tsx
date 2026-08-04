'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  ArrowLeft, 
  Tv, 
  Wifi, 
  Coffee, 
  Wind, 
  ShieldCheck, 
  Bed, 
  Activity, 
  CheckCircle2, 
  Building2,
  Calendar
} from 'lucide-react';

export default function FasilitasPage() {
  const [activeTab, setActiveTab] = useState<'rawatInap' | 'medis' | 'umum'>('rawatInap');

  const roomTypes = [
    {
      title: "VIP Utama",
      tag: "Kenyamanan Maksimal",
      desc: "Kamar perawatan privat premium dengan kenyamanan serasa di rumah untuk mendukung pemulihan ibu dan kenyamanan keluarga.",
      facilities: [
        "1 Tempat Tidur Pasien Electric",
        "Sofa Bed Keluarga & Meja Makan",
        "Smart TV 50 Inc & Free High-Speed Wi-Fi",
        "Kulkas 2 Pintu & Microwave",
        "Kamar Mandi Privat (Hot Shower)",
        "Pantry & Welcome Drink/Fruit Basket"
      ],
      color: "border-rose-200 bg-rose-50/40"
    },
    {
      title: "VIP",
      tag: "Favorit Keluarga",
      desc: "Ruang rawat inap eksklusif satu pasien dengan fasilitas lengkap dan suasana tenang.",
      facilities: [
        "1 Tempat Tidur Pasien Electric",
        "Sofa Bed Penunggu",
        "Smart TV 43 Inc & Wi-Fi",
        "Kulkas Mini & Dispenser",
        "Kamar Mandi Privat (Water Heater)",
        "AC & Lemari Pakaian"
      ],
      color: "border-slate-200 bg-white"
    },
    {
      title: "Kelas 1",
      tag: "Privasi Terjaga",
      desc: "Ruangan nyaman diisi maksimal 2 pasien dengan sekat tirai fleksibel untuk menjaga privasi.",
      facilities: [
        "2 Tempat Tidur Pasien Manual/Electric",
        "Kursi Penunggu untuk Masing-masing",
        "TV Sharing & Wi-Fi",
        "Kamar Mandi Dalam",
        "AC Full 24 Jam"
      ],
      color: "border-slate-200 bg-white"
    },
    {
      title: "Kelas 2",
      tag: "Privasi Terjaga",
      desc: "Ruangan nyaman diisi maksimal 2 pasien dengan sekat tirai fleksibel untuk menjaga privasi.",
      facilities: [
        "3 Tempat Tidur Pasien Manual/Electric",
        "Kursi Penunggu untuk Masing-masing",
        "TV Sharing & Wi-Fi",
        "Kamar Mandi Dalam",
        "AC Full 24 Jam"
      ],
      color: "border-slate-200 bg-white"
    },
    {
      title: "Kelas 3",
      tag: "Privasi Terjaga",
      desc: "Ruangan nyaman diisi maksimal 2 pasien dengan sekat tirai fleksibel untuk menjaga privasi.",
      facilities: [
        "4 Tempat Tidur Pasien Manual/Electric",
        "Kursi Penunggu untuk Masing-masing",
        "TV Sharing & Wi-Fi",
        "Kamar Mandi Dalam",
        "AC Full 24 Jam"
      ],
      color: "border-slate-200 bg-white"
    }
  ];

  const medicalFacilities = [
    {
      title: "Ruang Bersalin (VK / Delivery Room)",
      desc: "Kamar bersalin yang steril dan dirancang hangat untuk proses persalinan yang tenang, didukung peralatan resusitasi bayi modern."
    },
    {
      title: "NICU & PICU",
      desc: "Unit perawatan intensif khusus bayi baru lahir (NICU) dan anak (PICU) dengan pemantauan monitor vital 24 jam."
    },
    {
      title: "Kamar Operasi (OK)",
      desc: "Dilengkapi teknologi filter udara HEPA untuk sterilitas tinggi saat prosedur operasi caesar maupun bedah anak."
    },
    {
      title: "Ruang ICU",
      desc: "Unit perawatan intensif dengan pemantauan monitor vital 24 jam."
    },
    {
      title: "Laboratorium & Farmasi 24 Jam",
      desc: "Layanan tes darah, skrining neonatus, dan penyediaan obat-obatan yang siaga setiap saat."
    },
    {
      title: "Ruang Isolasi",
      desc: "Layanan tes darah, skrining neonatus, dan penyediaan obat-obatan yang siaga setiap saat."
    },
    {
      title: "Ruang UGD/PONEK",
      desc: "Layanan tes darah, skrining neonatus, dan penyediaan obat-obatan yang siaga setiap saat."
    },
    {
      title: "Ruang Perinatologi",
      desc: "Layanan tes darah, skrining neonatus, dan penyediaan obat-obatan yang siaga setiap saat."
    },
    {
      title: "Ruang Recovery",
      desc: "Layanan tes darah, skrining neonatus, dan penyediaan obat-obatan yang siaga setiap saat."
    },
  ];

  const publicFacilities = [
    // { name: "Klinik Tumbuh Kembang & Playground", icon: <Building2 className="text-rose-500" size={24} /> },
    // { name: "Kantin & Cafe Keluarga", icon: <Coffee className="text-amber-500" size={24} /> },
    { name: "Ruang Laktasi & Edukasi Menyusui", icon: <Heart className="text-pink-500" size={24} /> },
    { name: "Area Parkir Luas & Keamanan 24 Jam", icon: <ShieldCheck className="text-emerald-500" size={24} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      
      {/* --- NAVBAR SIMPLE --- */}
      <header className="bg-white border-b border-rose-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-rose-600 font-medium text-sm transition-colors">
            <ArrowLeft size={18} /> Kembali ke Beranda
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
              <Heart className="fill-current" size={16} />
            </div>
            <span className="font-bold text-slate-900 tracking-tight text-sm">RSIA KIRANA</span>
          </div>
        </div>
      </header>

      {/* --- HERO HEADER --- */}
      <section className="bg-gradient-to-b from-rose-50 to-slate-50 py-12 border-b border-rose-100/50">
        <div className="max-w-4xl mx-auto text-center px-4">
          <span className="bg-rose-100 text-rose-700 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
            Fasilitas Modern & Higenis
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">Fasilitas RSIA Kirana</h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl mx-auto">
            Ruang perawatan yang bersih, aman, dan dirancang khusus untuk menciptakan kenyamanan seperti di rumah sendiri.
          </p>
        </div>
      </section>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* TAB NAVIGATION */}
        <div className="flex justify-center gap-3 mb-10">
          <button
            onClick={() => setActiveTab('rawatInap')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'rawatInap'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Kamar Rawat Inap
          </button>
          <button
            onClick={() => setActiveTab('medis')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'medis'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Fasilitas Medis
          </button>
          <button
            onClick={() => setActiveTab('umum')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'umum'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Fasilitas Umum
          </button>
        </div>

        {/* --- SECTION 1: KAMAR RAWAT INAP --- */}
        {activeTab === 'rawatInap' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {roomTypes.map((room, idx) => (
              <div 
                key={idx} 
                className={`rounded-3xl p-7 border ${room.color} shadow-sm hover:shadow-md transition-all flex flex-col justify-between`}
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-100 px-2.5 py-1 rounded-full">
                      {room.tag}
                    </span>
                    <Bed className="text-slate-400" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{room.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">{room.desc}</p>
                  
                  <div className="space-y-2.5 border-t border-slate-200/60 pt-4 mb-6">
                    <p className="text-xs font-bold text-slate-700">Fasilitas Kamar:</p>
                    {room.facilities.map((fac, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>{fac}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href="/janji-temu"
                  className="block w-full bg-slate-900 hover:bg-rose-600 text-white text-center text-xs font-bold py-3 rounded-xl transition-colors"
                >
                  Tanyakan Estimasi Tarif
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* --- SECTION 2: FASILITAS MEDIS --- */}
        {activeTab === 'medis' && (
          <div className="grid sm:grid-cols-2 gap-6">
            {medicalFacilities.map((med, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex gap-4 items-start">
                <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center shrink-0 border border-rose-100">
                  <Activity size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1">{med.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{med.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- SECTION 3: FASILITAS UMUM --- */}
        {activeTab === 'umum' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {publicFacilities.map((pub, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-center">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl mx-auto mb-4 flex items-center justify-center border border-slate-100">
                  {pub.icon}
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{pub.name}</h4>
              </div>
            ))}
          </div>
        )}

        {/* --- CTA BOTTOM --- */}
        <div className="mt-16 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center max-w-3xl mx-auto">
          <h3 className="text-xl font-bold text-slate-900">Ingin Mengunjungi atau Hospital Tour?</h3>
          <p className="text-xs text-slate-500 mt-2 max-w-lg mx-auto">
            Anda dapat melihat langsung kondisi kamar rawat inap dan fasilitas persalinan kami sebelum membuat keputusan.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link 
              href="/janji-temu" 
              className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-6 py-3 rounded-xl text-xs transition-colors flex items-center gap-2"
            >
              <Calendar size={16} /> Jadwalkan Hospital Tour
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}