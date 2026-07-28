'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  Search, 
  Calendar, 
  Clock, 
  UserCheck, 
  ArrowLeft, 
  Filter,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  category: 'kebidanan' | 'anak' | 'tumbuhKembang';
  experience: string;
  almamater: string;
  schedules: {
    days: string;
    hours: string;
  }[];
}

export default function DokterPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [selectedDay, setSelectedDay] = useState<string>('semua');

  const doctors: Doctor[] = [
    {
      id: 1,
      name: "dr. Jane Doe, Sp.OG",
      specialty: "Spesialis Kebidanan & Kandungan",
      category: "kebidanan",
      experience: "12 Tahun",
      almamater: "Universitas Indonesia",
      schedules: [
        { days: "Senin - Rabu", hours: "08:00 - 12:00 WIB" },
        { days: "Jumat", hours: "14:00 - 17:00 WIB" }
      ]
    },
    {
      id: 2,
      name: "dr. John Doe, Sp.A",
      specialty: "Spesialis Kesehatan Anak",
      category: "anak",
      experience: "10 Tahun",
      almamater: "Universitas Gadjah Mada",
      schedules: [
        { days: "Senin - Kamis", hours: "09:00 - 13:00 WIB" },
        { days: "Sabtu", hours: "08:00 - 11:00 WIB" }
      ]
    },
    {
      id: 3,
      name: "dr. Alice, Sp.OG (K) Fetomaternal",
      specialty: "Subspesialis Kebidanan & Fetomaternal",
      category: "kebidanan",
      experience: "15 Tahun",
      almamater: "Universitas Airlangga",
      schedules: [
        { days: "Selasa & Kamis", hours: "13:00 - 17:00 WIB" },
        { days: "Sabtu", hours: "10:00 - 14:00 WIB" }
      ]
    },
    {
      id: 4,
      name: "dr. Bob, Sp.A",
      specialty: "Spesialis Tumbuh Kembang Anak",
      category: "tumbuhKembang",
      experience: "8 Tahun",
      almamater: "Universitas Padjadjaran",
      schedules: [
        { days: "Rabu - Jumat", hours: "10:00 - 14:00 WIB" },
        { days: "Minggu", hours: "09:00 - 12:00 WIB" }
      ]
    },
    {
      id: 5,
      name: "dr. Jenny, Sp.OG",
      specialty: "Spesialis Kebidanan & Kandungan",
      category: "kebidanan",
      experience: "9 Tahun",
      almamater: "Universitas Diponegoro",
      schedules: [
        { days: "Senin & Jumat", hours: "16:00 - 20:00 WIB" },
        { days: "Sabtu", hours: "13:00 - 16:00 WIB" }
      ]
    },
    {
      id: 6,
      name: "dr. James, Sp.A",
      specialty: "Spesialis Anak & Neonatologi",
      category: "anak",
      experience: "11 Tahun",
      almamater: "Universitas Indonesia",
      schedules: [
        { days: "Setiap Hari", hours: "08:00 - 10:00 WIB" },
        { days: "Selasa & Kamis", hours: "16:00 - 19:00 WIB" }
      ]
    }
  ];

  // Filter logic
  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'semua' || doc.category === selectedCategory;

    const matchesDay = selectedDay === 'semua' || doc.schedules.some(s => 
      s.days.toLowerCase().includes(selectedDay.toLowerCase()) || s.days.toLowerCase().includes('setiap hari')
    );

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
              placeholder="Cari nama dokter atau spesialisasi (misal: dr. Anisa, Anak, Fetomaternal)..."
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
                { id: 'tumbuhKembang', label: 'Tumbuh Kembang' },
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
            {filteredDoctors.map((doc) => (
              <div 
                key={doc.id}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Doctor Profile Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center shrink-0 border border-rose-100 font-bold">
                      <UserCheck size={32} />
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
                    {doc.schedules.map((sch, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs text-slate-700 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-rose-400" /> {sch.days}
                        </span>
                        <span className="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-[11px] text-slate-600">
                          {sch.hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Booking Button */}
                <Link 
                  href="/janji-temu"
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs py-3 rounded-xl text-center transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <Calendar size={14} /> Buat Janji dengan Dokter Ini
                </Link>
              </div>
            ))}
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