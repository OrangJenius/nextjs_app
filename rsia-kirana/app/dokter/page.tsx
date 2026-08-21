'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  Calendar, 
  Clock, 
  UserCheck, 
  ArrowLeft, 
  Filter,
  PhoneCall
} from 'lucide-react';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  category: 'kebidanan' | 'anak' | 'penyakitDalam' | 'endokrin' | 'jantung' | 'saraf' | 'rehabMedik' | 'bedah' | 'anastesi';
  experience: string;
  almamater: string;
  image?: string;
  schedules?: {
    days: string;
    hours: string;
  }[];
  bookable?: boolean; // default true — set false for doctors without a regular schedule
}

export default function DokterPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [selectedDay, setSelectedDay] = useState<string>('semua');

  const doctors: Doctor[] = [
    {
      id: 1,
      name: "Dr. dr. Novie H. Rampengan, Sp.A(K)",
      specialty: "Subspesialis Infeksi & Penyakit Tropis",
      category: "anak",
      experience: "10 Tahun",
      almamater: "Universitas Sam Ratulangi",
      image: "/images/dokter/novie-rampengan.png",
      schedules: [
        { days: "Jumat", hours: "15:00 - 17:00 WITA" },
        { days: "Sabtu", hours: "14:30 - 17:30 WITA" }
      ]
    },
    {
      id: 2,
      name: "dr. Jane Metusala, Sp.A",
      specialty: "Spesialis Anak",
      category: "anak",
      experience: "10 Tahun",
      almamater: "Universitas Sam Ratulangi",
      image: "/images/dokter/jane-metusala.png",
      schedules: [
        { days: "Selasa", hours: "12:15 - 14:15 WITA" },
        { days: "Kamis", hours: "12:30 - 14:30 WITA" }
      ]
    },
    {
      id: 3,
      name: "dr. Irene Maryauw, Sp.A",
      specialty: "Spesialis Anak",
      category: "anak",
      experience: "10 Tahun",
      almamater: "Universitas Sam Ratulangi",
      image: "/images/dokter/irene-maryauw.png",
      schedules: [
        { days: "Selasa", hours: "10:05 - 12:00 WITA" },
        { days: "Rabu", hours: "08:00 - 10:00 WITA" }
      ]
    },
    {
      id: 4,
      name: "dr. Meiske Runkat, Sp.OG",
      specialty: "Spesialis Obstetri dan Ginekologi",
      category: "kebidanan",
      experience: "10 Tahun",
      almamater: "Universitas Sam Ratulangi",
      image: "/images/dokter/meiske-runkat.png",
      schedules: [
        { days: "Senin - Jumat", hours: "10:00 - 12:00 WITA" },
      ]
    },
    {
      id: 5,
      name: "Prof. dr. Hermie Tendean, Sp.OG (K)",
      specialty: "Subspesialis Obstetri Sosial",
      category: "kebidanan",
      experience: "10 Tahun",
      almamater: "Universitas Sam Ratulangi",
      image: "/images/dokter/hermie-tendean.png",
      schedules: [
        { days: "Senin, Selasa, & Jumat", hours: "16:00 - 18:00 WITA" },
        { days: "Rabu", hours: "17:00 - 19:00 WITA" },
        { days: "Sabtu", hours: "14:00 - 16:00 WITA" },
      ]
    },
    {
      id: 6,
      name: "dr. Royke M.L. Rattu, Sp.OG",
      specialty: "Spesialis Obstetri dan Ginekologi",
      category: "kebidanan",
      experience: "10 Tahun",
      almamater: "Universitas Sam Ratulangi",
      image: "/images/dokter/royke-rattu.png",
      schedules: [
        { days: "Senin - Rabu", hours: "08:00 - 10:00 WITA" },
      ]
    },
    {
      id: 7,
      name: "dr. Arthur H. Rampengan, Sp.PD",
      specialty: "Spesialis Penyakit Dalam",
      category: "penyakitDalam",
      experience: "10 Tahun",
      almamater: "Universitas Sam Ratulangi",
      image: "/images/dokter/arthur-rampengan.png",
      schedules: [
        { days: "Kamis", hours: "12:00 - 14:00 WITA" },
        { days: "Jumat", hours: "12:00 - 15:00 WITA & 16:30 - 18:00 WITA" },
        { days: "Sabtu", hours: "10:00 - 14:00 WITA & 16:30 - 18:00 WITA" },
      ]
    },
    {
      id: 8,
      name: "dr. Novita Tanasal, Sp.PD",
      specialty: "Spesialis Penyakit Dalam",
      category: "penyakitDalam",
      experience: "10 Tahun",
      almamater: "Universitas Sam Ratulangi",
      image: "/images/dokter/novita-tanasal.png",
      schedules: [
        { days: "Rabu", hours: "14:00 - 16:00 WITA" },
      ]
    },
    {
      id: 9,
      name: "dr. Bisuk P. Sedli, Sp.PD-KEMD",
      specialty: "Spesialis Penyakit Dalam",
      category: "endokrin",
      experience: "10 Tahun",
      almamater: "Universitas Sam Ratulangi",
      image: "/images/dokter/bisuk-sedli.png",
      schedules: [
        { days: "Senin & Kamis", hours: "16:00 - 17:30 WITA" },
      ]
    },
    {
      id: 10,
      name: "Prof. Dr. dr. Starry H. Rampengan, Sp.JP(K)",
      specialty: "Subspesialis Intervensi Kardiovaskular",
      category: "jantung",
      experience: "10 Tahun",
      almamater: "Universitas Sam Ratulangi",
      image: "/images/dokter/starry-rampengan.png",
      schedules: [
        { days: "Senin - Jumat", hours: "20:00 - 22:00 WITA" },
        { days: "Sabtu", hours: "19:00 - 21:00 WITA" },
      ]
    },
    {
      id: 11,
      name: "Dr. dr. Sekplin A. S. Sekeon, Sp.N(K), FMIN, MPH",
      specialty: "Spesialis Saraf",
      category: "saraf",
      experience: "10 Tahun",
      almamater: "Universitas Sam Ratulangi",
      image: "/images/dokter/sekplin-sekeon.png",
      schedules: [
        { days: "Selasa & Jumat", hours: "15:00 - 17:00 WITA" },
      ]
    },
    {
      id: 12,
      name: "dr. Florensia B. Tewal, Sp.KFR",
      specialty: "Spesialis Kedokteran Fisik dan Rehabilitasi",
      category: "rehabMedik",
      experience: "10 Tahun",
      almamater: "Universitas Sam Ratulangi",
      image: "/images/dokter/florensia-tewal.png",
      schedules: [
        { days: "Selasa & Kamis", hours: "16:00 - 17:00 WITA" },
      ]
    },
    {
      id: 13,
      name: "dr. Leonardo Verdy Sagay, Sp.B",
      specialty: "Spesialis Bedah",
      category: "bedah",
      experience: "10 Tahun",
      almamater: "Universitas Sam Ratulangi",
      image: "/images/dokter/leonardo-sagay.png",
      schedules: [
        { days: "Selasa & Jumat", hours: "08:00 - 10:00 WITA" },
      ]
    },
    {
      id: 14,
      name: "dr. Pinkan Johana Lintong, Sp.B",
      specialty: "Spesialis Bedah",
      category: "bedah",
      experience: "10 Tahun",
      almamater: "Universitas Sam Ratulangi",
      image: "/images/dokter/pinkan-lintong.png",
      schedules: [
        { days: "Senin & Rabu", hours: "08:00 - 10:00 WITA" },
      ]
    },
    {
      id: 15,
      name: "dr. Praisy Gladys Intan Pardede, Sp.An-TI",
      specialty: "Spesialis Anastesi",
      category: "anastesi",
      experience: "10 Tahun",
      almamater: "Universitas Sam Ratulangi",
      image: "/images/dokter/praisy-pardede.png",
      // Dokter anastesi — bertugas mendampingi tindakan operasi, bukan praktik rawat jalan reguler
      bookable: false,
    },
  ];

  // Helper untuk mengecek apakah hari yang dipilih cocok dengan string jadwal
  const isDayMatching = (scheduleDays: string, targetDay: string) => {
    if (targetDay === 'semua') return true;
    
    const daysArr = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];
    const targetIndex = daysArr.indexOf(targetDay.toLowerCase());
    const lowerSchedule = scheduleDays.toLowerCase();

    if (lowerSchedule.includes('setiap hari')) return true;
    if (lowerSchedule.includes(targetDay.toLowerCase())) return true;

    // Handle format "Senin - Jumat" / "Senin - Rabu"
    if (lowerSchedule.includes('-')) {
      const parts = lowerSchedule.split('-').map(s => s.trim());
      if (parts.length === 2) {
        const startIndex = daysArr.findIndex(d => parts[0].includes(d));
        const endIndex = daysArr.findIndex(d => parts[1].includes(d));
        if (startIndex !== -1 && endIndex !== -1 && targetIndex >= startIndex && targetIndex <= endIndex) {
          return true;
        }
      }
    }

    return false;
  };

  // Filter logic
  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'semua' || doc.category === selectedCategory;

    const matchesDay = selectedDay === 'semua' || 
                        (doc.schedules?.some(s => isDayMatching(s.days, selectedDay)) ?? false);

    return matchesSearch && matchesCategory && matchesDay;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      
      {/* --- NAVBAR SIMPLE --- */}
      <header className="bg-white border-b border-rose-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-rose-600 font-medium text-sm transition-colors">
            <ArrowLeft size={18} /> Kembali ke Beranda
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

      {/* --- HERO HEADER --- */}
      <section className="bg-linear-to-b from-rose-50 to-slate-50 py-12 border-b border-rose-100/50">
        <div className="max-w-4xl mx-auto text-center px-4">
          <span className="bg-rose-100 text-rose-700 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
            Tim Dokter Profesional
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">Jadwal Praktik Dokter</h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl mx-auto">
            Temukan jadwal konsultasi dokter spesialis kebidanan, kandungan, dan anak terbaik untuk keluarga Anda.
          </p>
        </div>
      </section>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* --- SEARCH & FILTER BAR --- */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm mb-10 space-y-4">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama dokter atau spesialisasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 bg-slate-50/50"
            />
          </div>

          {/* Filter Dropdowns / Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2 border-t border-slate-100">
            
            {/* Category Filters */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0 mr-1">
                <Filter size={14} /> Poli:
              </span>
              {[
                { id: 'semua', label: 'Semua' },
                { id: 'kebidanan', label: 'Kebidanan & Kandungan' },
                { id: 'anak', label: 'Anak' },
                { id: 'penyakitDalam', label: 'Penyakit Dalam' },
                { id: 'endokrin', label: 'Endokrin' },
                { id: 'jantung', label: 'Jantung' },
                { id: 'saraf', label: 'Saraf' },
                { id: 'rehabMedik', label: 'Kedokteran Fisik & Rehab' },
                { id: 'bedah', label: 'Bedah' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id 
                      ? 'bg-rose-500 text-white' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Day Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-500 shrink-0">Hari:</span>
              <select 
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl border-none focus:ring-2 focus:ring-rose-400 w-full sm:w-auto"
              >
                <option value="semua">Semua Hari</option>
                <option value="senin">Senin</option>
                <option value="selasa">Selasa</option>
                <option value="rabu">Rabu</option>
                <option value="kamis">Kamis</option>
                <option value="jumat">Jumat</option>
                <option value="sabtu">Sabtu</option>
                <option value="minggu">Minggu</option>
              </select>
            </div>

          </div>

        </div>

        {/* --- DOCTORS GRID --- */}
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
            <UserCheck className="mx-auto text-slate-300 mb-3" size={48} />
            <p className="font-bold text-slate-700">Dokter tidak ditemukan</p>
            <p className="text-xs text-slate-500 mt-1">Coba sesuaikan kata kunci pencarian atau pilihan filter Anda.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => {
              const isBookable = doc.bookable !== false && !!doc.schedules?.length;

              return (
                <div 
                  key={doc.id}
                  className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Doctor Profile Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-rose-100 bg-rose-50 flex items-center justify-center">
                        {doc.image ? (
                          <Image
                            src={doc.image}
                            alt={doc.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover object-top"
                          />
                        ) : (
                          <UserCheck size={32} className="text-rose-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base leading-snug">{doc.name}</h3>
                        <p className="text-xs text-rose-500 font-medium mt-1">{doc.specialty}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Pengalaman: {doc.experience} • Alumni {doc.almamater}</p>
                      </div>
                    </div>

                    {/* Schedule List */}
                    <div className="bg-slate-50 rounded-2xl p-3.5 space-y-2 mb-6 border border-slate-100">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1 flex items-center gap-1">
                        <Clock size={12} /> Jadwal Praktik Regular
                      </span>
                      {doc.schedules && doc.schedules.length > 0 ? (
                        doc.schedules.map((sch, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs text-slate-700 font-medium">
                            <span className="flex items-center gap-1.5">
                              <Calendar size={12} className="text-rose-400" /> {sch.days}
                            </span>
                            <span className="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-[11px] text-slate-600">
                              {sch.hours}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 italic">
                          Bertugas di tindakan operasi (on-call) — tidak menerima jadwal rawat jalan reguler.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Booking Button */}
                  {isBookable ? (
                    <Link 
                      href="/janji-temu"
                      className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs py-3 rounded-xl text-center transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      <Calendar size={14} /> Buat Janji dengan Dokter Ini
                    </Link>
                  ) : (
                    <a 
                      href="wa.me/6281388888898"
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs py-3 rounded-xl text-center transition-colors flex items-center justify-center gap-2"
                    >
                      <PhoneCall size={14} /> Hubungi Rumah Sakit
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* --- INFO BOX --- */}
        <div className="mt-12 bg-rose-50 rounded-3xl p-6 border border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-500 text-white rounded-full flex items-center justify-center shrink-0">
              <PhoneCall size={20} />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Butuh Penanganan Darurat / IGD?</p>
              <p className="text-xs text-slate-600">Dokter spesialis kami siaga 24 jam untuk kondisi gawat darurat ibu dan anak.</p>
            </div>
          </div>
          <a 
            href="tel:04315559999" 
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shrink-0 transition-colors"
          >
            Hubungi Emergency (0431) 555-9999
          </a>
        </div>

      </main>
    </div>
  );
}