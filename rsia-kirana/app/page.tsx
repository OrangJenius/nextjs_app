'use client';

import React, { useState } from 'react';
import { Heart, Calendar, Clock, Phone, MapPin, UserCheck, ChevronRight, Baby, ShieldCheck, Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/layanan", label: "Layanan Unggulan" },
    { href: "/dokter", label: "Jadwal Dokter" },
    { href: "/fasilitas", label: "Fasilitas" },
    { href: "/aboutus", label: "Tentang Kami" },
    { href: "/events", label: "Events" },
    { href: "/berita", label: "Berita" },
  ];

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
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-12 h-12 shrink-0">
              <Image
                src="/images/logo.png"
                alt="Logo RSIA Kirana"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 block leading-tight">RSIA KIRANA</span>
              <span className="text-xs text-rose-500 font-medium tracking-wider">RUMAH SAKIT IBU & ANAK</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex space-x-8 text-sm font-semibold text-slate-600">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-rose-600 transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA Button */}
          <Link
            href="/janji-temu"
            className="hidden md:flex bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition-all items-center gap-2"
          >
            <Calendar size={16} /> Buat Janji Temu
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden p-2 text-slate-700 hover:text-rose-600 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Menu Panel */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-rose-100 px-4 py-4 space-y-1 shadow-lg">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block text-sm font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg px-3 py-2.5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/janji-temu"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-5 py-3 rounded-full text-sm font-semibold mt-3"
            >
              <Calendar size={16} /> Buat Janji Temu
            </Link>
          </div>
        )}
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
                <Link href="/janji-temu" className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-3.5 rounded-xl text-base font-semibold shadow-lg shadow-rose-200 transition-all text-center">
                  Daftar Online Sekarang
                </Link>
                <Link href="/layanan" className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-8 py-3.5 rounded-xl text-base font-semibold transition-all text-center">
                  Lihat Layanan Kami
                </Link>
              </div>
            </div>

            {/* Visual Banner Placeholder */}
            <div className="relative">
              <div className="w-full h-80 sm:h-96 bg-gradient-to-tr from-rose-200 to-pink-100 rounded-3xl flex flex-col items-center justify-center p-6 text-center border border-rose-100 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <h1 className="text-slate-800 font-bold mb-3 z-10">Partner Kami</h1>
                <div className="relative w-full h-full z-10">
                  <Image
                    src="/images/partners.png"
                    alt="Mitra Asuransi RSIA Kirana"
                    fill
                    className="object-contain"
                    loading='eager'
                  />
                </div>
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
            <p className="text-slate-600 mt-3">Fasilitas medis terpadu yang dirancang untuk kenyamanan anda.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Link href="/layanan">
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center mb-6">
                  <Baby size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Pelayanan Kesehatan Ibu dan Anak</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  RSIA Kirana menyediakan pelayanan kesehatan kepada ibu dan anak dengan memberikan tindakan medis dan pengobatan lengkap pada ibu hamil, bayi, anak dan remaja.
                </p>
              </div>
            </Link>

            <Link href="/layanan">
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center mb-6">
                  <Heart size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Pelayanan Jantung</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  RSIA Kirana menyediakan pelayanan untuk pencegahan dan pengobatan penyakit jantung dan pembuluh darah baik secara kuantitas maupun kualitas khususnya melalui pelayanan Diagnostik Non-Invasif: Echocardiografi, Holter Monitoring, Treadmill Test, dan EECP.
                </p>
              </div>
            </Link>

            <Link href="/layanan">
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Pelayanan Endokrin</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  RSIA Kirana menyediakan pelayanan sub-spesialistik untuk pencegahan dan penanganan penyakit diabetes melitus, tiroid, dan gangguan metabolik lainnya.
                </p>
              </div>
            </Link>
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
            <Link href="/dokter" className="text-rose-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all mt-4 md:mt-0">
              Lihat Semua Dokter <ChevronRight size={18} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Prof. dr. Hermie Tendean, Sp.OG (K)", spec: "Spesialis Kebidanan & Kandungan" },
              { name: "DR. dr. Novie H. Rampengan, Sp.A(K)", spec: "Spesialis Anak" },
              { name: "dr. Meiske Runkat, Sp.OG", spec: "Spesialis Kebidanan & Kandungan" },
              { name: "dr. Jane Metusala, Sp.A", spec: "Spesialis Anak" },
            ].map((doc, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
                <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center text-slate-400">
                  <UserCheck size={40} />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{doc.name}</h4>
                <p className="text-xs text-rose-500 font-medium mt-1 mb-4">{doc.spec}</p>
                <Link
                  href="/dokter"
                  className="block text-center w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold transition-colors"
                >
                  Lihat Jadwal Praktik
                </Link>
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
              <li><Link href="/" className="hover:text-white transition-colors">Beranda</Link></li>
              <li><Link href="/layanan" className="hover:text-white transition-colors">Layanan Unggulan</Link></li>
              <li><Link href="/fasilitas" className="hover:text-white transition-colors">Fasilitas Rawat Inap</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-semibold mb-4">Kontak</h5>
            <ul className="space-y-2 text-sm">
              <li>Call Center: 0813-8888-8898</li>
              <li>WhatsApp IGD: 0858-8888-8898</li>
              <li>Email: rskirana94@gmail.com</li>
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