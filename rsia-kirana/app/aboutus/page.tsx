'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Heart, 
  Award, 
  Users, 
  Building2, 
  Target, 
  Eye, 
  ShieldCheck, 
  Stethoscope, 
  Clock, 
  PhoneCall,
  MapPin,
  Mail,
  Activity,
  CalendarCheck,
  CheckCircle2,
  FileText
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      {/* Header / Navbar */}
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

      {/* Hero Section */}
      <section className="bg-linear-to-b from-rose-50 via-white to-slate-50 pt-12 pb-16 border-b border-rose-100/60">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 text-xs px-3.5 py-1.5 rounded-full font-semibold uppercase tracking-wider mb-3">
            <h1>Profile Rumah Sakit</h1>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 leading-tight">
            Melayani dengan Kasih, <br className="hidden sm:inline" />
            <span className="text-rose-500">Menjaga Kesehatan Ibu & Anak</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mt-4 leading-relaxed">
            RSIA Kirana berlokasi strategis di pusat Kota Manado dan berkomitmen memberikan pelayanan kesehatan berkualitas, aman, dan berorientasi pada keselamatan pasien serta kenyamanan keluarga.
          </p>
          <div className="mt-4 text-xs font-medium text-slate-500">
            Direktur: <span className="font-bold text-slate-700">dr. Andrew Christian Pangemanan, M.Kes</span>
          </div>
        </div>
      </section>

      {/* Statistik Ringkas */}
      <section className="max-w-5xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center">
          <div className="p-2">
            <Building2 className="mx-auto text-rose-500 mb-2" size={28} />
            <div className="text-2xl font-extrabold text-slate-900">5</div>
            <div className="text-xs text-slate-500 mt-1">Klinik Spesialis Utama</div>
          </div>
          <div className="p-2">
            <Stethoscope className="mx-auto text-rose-500 mb-2" size={28} />
            <div className="text-2xl font-extrabold text-slate-900">15</div>
            <div className="text-xs text-slate-500 mt-1">Dokter Spesialis</div>
          </div>
          <div className="p-2">
            <Users className="mx-auto text-rose-500 mb-2" size={28} />
            <div className="text-2xl font-extrabold text-slate-900">84</div>
            <div className="text-xs text-slate-500 mt-1">Total Tenaga Medis & Staff</div>
          </div>
          <div className="p-2">
            <Award className="mx-auto text-rose-500 mb-2" size={28} />
            <div className="text-2xl font-extrabold text-slate-900">50</div>
            <div className="text-xs text-slate-500 mt-1">Kapasitas Tempat Tidur</div>
          </div>
        </div>
      </section>

      {/* Tentang Kami & Komitmen Layanan */}
      <section className="max-w-5xl mx-auto px-4 mt-16">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Tentang RSIA Kirana</h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Rumah Sakit Ibu dan Anak (RSIA) Kirana merupakan rumah sakit khusus Kelas C yang berdiri di jantung Kota Manado di bawah naungan PT. Rumah Sakit Ibu dan Anak Kirana.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              Kami melayani pasien Umum, BPJS Kesehatan, dan Asuransi Swasta. Dengan dukungan tenaga medis profesional, fasilitas modern, serta penerapan standar keselamatan pasien, kami senantiasa berbenah demi memberikan mutu pelayanan terbaik.
            </p>
          </div>
          <div className="bg-rose-50 rounded-2xl p-6 border border-rose-100 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="text-rose-500" size={18} /> Informasi & Identitas Rumah Sakit
            </h3>
            <ul className="text-xs text-slate-600 space-y-2.5 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-rose-500 shrink-0 mt-0.5" />
                <span><strong>Penyelenggara:</strong> PT. Rumah Sakit Ibu dan Anak Kirana</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-rose-500 shrink-0 mt-0.5" />
                <span><strong>Status Akreditasi:</strong> Paripurna (LAFKI)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-rose-500 shrink-0 mt-0.5" />
                <span><strong>Luas Bangunan:</strong> 2.685,56 m² (Luas Tanah: 1.122 m²)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-rose-500 shrink-0 mt-0.5" />
                <span><strong>NIB:</strong> 91201047526640001</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-rose-500 shrink-0 mt-0.5" />
                <span><strong>Izin Operasional:</strong> 354/514/I/IORSA/DPMPTSP/II/2020</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Sejarah & Perjalanan RSIA Kirana */}
      <section className="max-w-5xl mx-auto px-4 mt-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Revisi & Sejarah Perkembangan</h2>
          <p className="text-slate-600 text-sm mt-1">Perjalanan RSIA Kirana dari masa ke masa dalam melayani masyarakat</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { year: '1994', title: 'Klinik Bersalin', desc: 'Berdiri awal sebagai Klinik Bersalin Kirana di bawah Yayasan Kirana.' },
            { year: '2007', title: 'RS Bersalin', desc: 'Resmi menjadi Rumah Sakit Bersalin Kirana (KepMenKes HK.07.06/III/596/07).' },
            { year: '2015', title: 'RSKIA Kelas C', desc: 'Memenuhi syarat sebagai Rumah Sakit Khusus Ibu dan Anak Kelas C.' },
            { year: '2018', title: 'PT RSIA Kirana', desc: 'Perubahan kepemilikan menjadi PT Rumah Sakit Ibu dan Anak Kirana.' },
            { year: '2020', title: 'Izin Operasional', desc: 'Penerbitan Izin Operasional RS Khusus resmi dari DPMPTSP.' },
            { year: '2023', title: 'Akreditasi Paripurna', desc: 'Meraih predikat Akreditasi Paripurna dari LAFKI.' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">{item.year}</span>
                <h4 className="font-bold text-slate-900 text-sm mt-3 mb-1">{item.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="max-w-5xl mx-auto px-4 mt-12">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Visi */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-4">
                <Eye size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Visi Kami</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                "Terwujudnya Rumah Sakit Ibu dan Anak Kirana Yang Unggul dan Menjadi Pilihan Masyarakat."
              </p>
            </div>
          </div>

          {/* Misi */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-4">
              <Target size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Misi Kami</h3>
            <ul className="text-slate-600 text-sm space-y-2.5 list-disc list-inside leading-relaxed">
              <li>Menyelenggarakan pelayanan yang maju, dan profesional berdasarkan standar prosedur operasional yang ditetapkan.</li>
              <li>Mengembangkan kualitas sumber daya manusia melalui pendidikan dan pelatihan untuk meningkatkan mutu pelayanan.</li>
              <li>Mengembangkan kemitraan dengan berbagai pihak untuk menjalin jaringan kerjasama yang saling menguntungkan.</li>
              <li>Menjadi rumah sakit ibu dan anak yang unggul dalam pelayanan kesehatan ibu dan anak.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Nilai-Nilai Utama (Moto KIRANA) */}
      <section className="max-w-5xl mx-auto px-4 mt-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Moto Kami: K.I.R.A.N.A</h2>
          <p className="text-slate-600 text-sm mt-1">Nilai utama yang menjiwai setiap insan dan pelayanan medis di RSIA Kirana</p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { letter: 'K', title: 'Komunikatif', desc: 'Membangun komunikasi terbuka, ramah, dan solutif dengan pasien dan keluarga.' },
            { letter: 'I', title: 'Informatif', desc: 'Memberikan informasi medis yang jelas, jujur, akurat, dan transparan.' },
            { letter: 'R', title: 'Responsif', desc: 'Cepat tanggap dan sigap memberikan tindakan dan pendampingan medis.' },
            { letter: 'A', title: 'Akuntabel', desc: 'Bertanggung jawab atas setiap tindakan dan pelayanan sesuai standar SPO.' },
            { letter: 'N', title: 'Nyaman', desc: 'Menciptakan suasana pelayanan dan ruang perawatan yang bersih, asri, dan hangat.' },
            { letter: 'A', title: 'Aman', desc: 'Mengutamakan prinsip keselamatan pasien (patient safety) dan pencegahan risiko.' },
          ].map((item, index) => (
            <div key={index} className="bg-white p-5 rounded-2xl border border-slate-100 text-center shadow-sm">
              <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mx-auto mb-3 font-extrabold text-lg">
                {item.letter}
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h4>
              <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Layanan Utama & Fasilitas Modern */}
      <section className="max-w-5xl mx-auto px-4 mt-16">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Lingkup Pelayanan Kesehatan</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-slate-100 p-5 rounded-2xl bg-slate-50/50">
              <h3 className="font-bold text-rose-600 text-sm mb-3 flex items-center gap-2">
                <Activity size={18} /> Rawat Jalan & Klinik
              </h3>
              <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
                <li>Klinik Spesialis Obsgyn (Kebidanan & Kandungan)</li>
                <li>Klinik Spesialis Anak</li>
                <li>Klinik Spesialis Penyakit Dalam (Interna)</li>
                <li>Klinik Spesialis Jantung & Pembuluh Darah</li>
                <li>Klinik Rehabilitasi Medik</li>
              </ul>
            </div>

            <div className="border border-slate-100 p-5 rounded-2xl bg-slate-50/50">
              <h3 className="font-bold text-rose-600 text-sm mb-3 flex items-center gap-2">
                <Building2 size={18} /> Rawat Inap & Ruang Khusus
              </h3>
              <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
                <li>Ruang Rawat (VIP Utama, VIP, Kelas I, II, III)</li>
                <li>Ruang Bersalin (VK) & Perinatologi</li>
                <li>Ruang Intensif (ICU & NICU)</li>
                <li>Ruang Isolasi & Recovery Room</li>
                <li>UGD & PONEK 24 Jam</li>
              </ul>
            </div>

            <div className="border border-slate-100 p-5 rounded-2xl bg-slate-50/50">
              <h3 className="font-bold text-rose-600 text-sm mb-3 flex items-center gap-2">
                <Stethoscope size={18} /> Penunjang Diagnostik Modern
              </h3>
              <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
                <li>USG 2D & 4D, EKG, CTG</li>
                <li>Echocardiografi & Holter Monitoring</li>
                <li>Treadmill Test & EECP</li>
                <li>Instalasi Bedah (Operasi Elektif & Cito)</li>
                <li>Laboratorium, Farmasi, Gizi, Rekam Medis</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Kontak Informasi */}
      <section className="max-w-5xl mx-auto px-4 mt-12">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 grid md:grid-cols-3 gap-6 items-center">
          <div className="flex items-start gap-3">
            <MapPin className="text-rose-400 shrink-0 mt-1" size={20} />
            <div>
              <h4 className="font-bold text-sm">Alamat Lengkap</h4>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                Jl. Jend. Sudirman No. 78, Kel. Lawangirung, Kec. Wenang, Kota Manado
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <PhoneCall className="text-rose-400 shrink-0 mt-1" size={20} />
            <div>
              <h4 className="font-bold text-sm">Telepon / Kontak</h4>
              <p className="text-slate-400 text-xs mt-1">0813-8888-8898</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="text-rose-400 shrink-0 mt-1" size={20} />
            <div>
              <h4 className="font-bold text-sm">Email Resmi</h4>
              <p className="text-slate-400 text-xs mt-1">rskirana94@gmail.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-5xl mx-auto px-4 mt-12">
        <div className="bg-linear-to-r from-rose-500 to-rose-600 rounded-3xl p-8 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div>
            <h3 className="text-xl font-bold">Butuh Layanan Kesehatan atau Konsultasi?</h3>
            <p className="text-rose-100 text-xs sm:text-sm mt-1">
              Buat janji temu dengan dokter spesialis kami secara cepat dan praktis.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/janji-temu"
              className="bg-white text-rose-600 hover:bg-rose-50 px-5 py-2.5 rounded-xl text-xs font-bold transition-colors"
            >
              Buat Janji Temu
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}