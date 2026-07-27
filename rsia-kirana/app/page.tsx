import React from 'react';
import { Heart, Calendar, Clock, Phone, MapPin, UserCheck, Stethoscope, Baby, ShieldCheck, ChevronRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* --- TOP BAR INFO --- */}
      <div className="bg-rose-600 text-white text-xs sm:text-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1"><Phone size={14} /> Emergency: (0431) 555-9999</span>
            <span className="hidden md:flex items-center gap-1"><MapPin size={14} /> Jl. Jendral Sudirman No.78, Pinaesaan, Kec. Wenang, Kota Manado</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1"><Clock size={14} /> IGD 24 Jam</span>
          </div>
        </div>
      </div>

      {/* --- NAVBAR --- */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
              <Heart className="fill-current" size={20} />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 block leading-tight">RSIA KIRANA</span>
              <span className="text-xs text-rose-500 font-medium tracking-wider">RUMAH SAKIT IBU & ANAK</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8 text-sm font-semibold text-slate-600">
            <a href="#beranda" className="hover:text-rose-600 transition-colors">Beranda</a>
            <a href="#layanan" className="hover:text-rose-600 transition-colors">Layanan Unggulan</a>
            <a href="#dokter" className="hover:text-rose-600 transition-colors">Jadwal Dokter</a>
            <a href="#fasilitas" className="hover:text-rose-600 transition-colors">Fasilitas</a>
          </nav>

          {/* CTA Button */}
          <a 
            href="#janji-temu" 
            className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
          >
            <Calendar size={16} /> Buat Janji Temu
          </a>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section id="beranda" className="relative bg-gradient-to-b from-rose-50 via-white to-slate-50 py-20 lg:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <span className="inline-block bg-rose-100 text-rose-700 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase">
                Mitra Terpercaya Kesehatan Ibu & Buah Hati
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
                Pelayanan Penuh Kasih untuk <span className="text-rose-500">Masa Depan Si Kecil</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0">
                RSIA Kirana menghadirkan penanganan medis profesional berkibar kehangatan keluarga, didukung tim dokter spesialis kandungan dan anak berpengalaman.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <a href="#janji-temu" className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-3.5 rounded-xl text-base font-semibold shadow-lg shadow-rose-200 transition-all text-center">
                  Daftar Online Sekarang
                </a>
                <a href="/layanan" className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-8 py-3.5 rounded-xl text-base font-semibold transition-all text-center">
                  Lihat Layanan Kami
                </a>
              </div>
            </div>

            {/* Visual Banner Placeholder */}
            <div className="relative">
              <div className="w-full h-80 sm:h-96 bg-gradient-to-tr from-rose-200 to-pink-100 rounded-3xl flex flex-col items-center justify-center p-8 text-center border border-rose-100 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <Baby size={80} className="text-rose-400 mb-4" />
                <p className="text-slate-700 font-bold text-xl">Layanan Kebidanan & Kandungan Lengkap</p>
                <p className="text-slate-500 text-sm mt-2">USG 4D • Klinik Tumbuh Tumbuh Anak • NICU/PICU</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- LAYANAN UNGGULAN --- */}
      <section id="layanan" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Layanan Unggulan Kami</h2>
            <p className="text-slate-600 mt-3">Fasilitas medis terpadu yang dirancang khusus untuk kenyamanan ibu dan anak.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center mb-6">
                <Heart size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Kesehatan Kebidanan & Kandungan</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Pemeriksaan kehamilan rutin, konsultasi program hamil, hingga persalinan nyaman dengan metode eracs.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center mb-6">
                <Baby size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Kesehatan Anak & Imunisasi</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Layanan tumbuh kembang anak, imunisasi rutin lengkap, dan penanganan penyakit anak menyeluruh.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Perawatan Intensif (NICU / PICU)</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Ruang perawatan intensif khusus bayi baru lahir dan anak dengan peralatan medis mutakhir 24/7.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- DOKTER SPESIALIS --- */}
      <section id="dokter" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Tim Dokter Spesialis</h2>
              <p className="text-slate-600 mt-2">Tenaga medis profesional dan ramah siap mendampingi Anda.</p>
            </div>
            <a href="#" className="text-rose-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all mt-4 md:mt-0">
              Lihat Semua Dokter <ChevronRight size={18} />
            </a>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "dr. Jane Doe, Sp.OG", spec: "Spesialis Kebidanan & Kandungan" },
              { name: "dr. John Doe, Sp.A", spec: "Spesialis Anak" },
              { name: "dr. Alice, Sp.OG", spec: "Spesialis Kebidanan & Kandungan" },
              { name: "dr. Bob, Sp.A", spec: "Spesialis Tumbuh Kembang" },
            ].map((doc, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
                <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center text-slate-400">
                  <UserCheck size={40} />
                </div>
                <h4 className="font-bold text-slate-900">{doc.name}</h4>
                <p className="text-xs text-rose-500 font-medium mt-1 mb-4">{doc.spec}</p>
                <button className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold transition-colors">
                  Lihat Jadwal Praktik
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 text-white mb-4">
              <Heart className="text-rose-500 fill-current" size={20} />
              <span className="font-bold text-lg">RSIA KIRANA</span>
            </div>
            <p className="text-sm">
              Memberikan pelayanan kesehatan terbaik bagi ibu dan anak dengan penuh kepedulian dan kehangatan.
            </p>
          </div>
          <div>
            <h5 className="text-white font-semibold mb-4">Tautan Cepat</h5>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Profil RSIA Kirana</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Fasilitas Rawat Inap</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Tarif & Kamar</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-semibold mb-4">Kontak</h5>
            <ul className="space-y-2 text-sm">
              <li>Call Center: (0431) 555-0000</li>
              <li>WhatsApp IGD: 0812-3456-7890</li>
              <li>Email: info@rsiakirana.co.id</li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-semibold mb-4">Lokasi</h5>
            <p className="text-sm">
              Jl. Jendral Sudirman No.78, Pinaesaan, Kec. Wenang, Kota Manado
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-800 text-xs text-center">
          &copy; {new Date().getFullYear()} RSIA Kirana.
        </div>
      </footer>

    </div>
  );
}