'use client';

import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, User, Phone, Mail, ShieldAlert, CheckCircle2, Heart } from 'lucide-react';
import Link from 'next/link';

export default function JanjiTemuPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    namaPasien: '',
    nik: '',
    noHp: '',
    email: '',
    poli: 'kebidanan',
    dokter: 'dr. Jane Doe, Sp.OG',
    tanggal: '',
    jam: '09:00',
    tipePembayaran: 'umum',
    catatan: ''
  });

  const doctorsByPoli: Record<string, string[]> = {
    kebidanan: ['dr. Jane Doe, Sp.OG', 'dr. Alice, Sp.OG'],
    anak: ['dr. John Doe, Sp.A', 'dr. Bob, Sp.A'],
    tumbuhKembang: ['dr. Bob, Sp.A'],
  };

  const handlePoliChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPoli = e.target.value;
    const availableDocs = doctorsByPoli[selectedPoli] || [];
    setFormData({
      ...formData,
      poli: selectedPoli,
      dokter: availableDocs[0] || ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      {/* Top Header Navigation */}
      <header className="bg-white border-b border-rose-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-rose-600 font-medium text-sm transition-colors">
            <ArrowLeft size={18} /> Kembalikan ke Beranda
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white font-bold">
              <Heart className="fill-current" size={16} />
            </div>
            <span className="font-bold text-slate-900 tracking-tight text-sm">RSIA KIRANA</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 pt-10">
        {/* Title */}
        <div className="text-center mb-10">
          <span className="bg-rose-100 text-rose-700 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
            Layanan Pendaftaran Online
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-3">Buat Janji Temu Dokter</h1>
          <p className="text-slate-600 text-sm mt-2">Isi formulir di bawah untuk reservasi antrean konsultasi secara praktis.</p>
        </div>

        {submitted ? (
          /* Confirmation Screen */
          <div className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-xl text-center max-w-xl mx-auto animate-fade-in">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Pendaftaran Berhasil!</h2>
            <p className="text-slate-600 text-sm mt-2">
              Kode Booking Anda: <span className="font-mono font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded border border-rose-200">KRN-{Math.floor(100000 + Math.random() * 900000)}</span>
            </p>
            
            <div className="bg-slate-50 rounded-2xl p-4 mt-6 text-left text-xs space-y-2 border border-slate-100">
              <p><strong>Nama Pasien:</strong> {formData.namaPasien}</p>
              <p><strong>Dokter Tujuan:</strong> {formData.dokter}</p>
              <p><strong>Tanggal & Jam:</strong> {formData.tanggal} | Pukul {formData.jam} WIB</p>
              <p><strong>Metode Pembayaran:</strong> {formData.tipePembayaran.toUpperCase()}</p>
            </div>

            <p className="text-xs text-slate-500 mt-6">
              *Konfirmasi reservasi dan tiket antrean digital telah dikirimkan via WhatsApp ke nomor <strong className="text-slate-700">{formData.noHp}</strong>.
            </p>

            <div className="mt-8 flex gap-3 justify-center">
              <button 
                onClick={() => setSubmitted(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all"
              >
                Buat Janji Lagi
              </button>
              <Link 
                href="/" 
                className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition-all"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        ) : (
          /* Form Screen */
          <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-8">
            
            {/* Form Fields (2 Columns) */}
            <div className="md:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
              
              {/* Section 1: Data Pasien */}
              <div>
                <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2 border-b pb-2">
                  <User size={18} className="text-rose-500" /> Data Pasien
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap Pasien *</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Contoh: Budi Pratama"
                      value={formData.namaPasien}
                      onChange={(e) => setFormData({...formData, namaPasien: e.target.value})}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">NIK (KTP/KIA) *</label>
                    <input 
                      required
                      type="text" 
                      placeholder="16 digit NIK"
                      value={formData.nik}
                      onChange={(e) => setFormData({...formData, nik: e.target.value})}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor WhatsApp *</label>
                    <input 
                      required
                      type="tel" 
                      placeholder="0812xxxxxxx"
                      value={formData.noHp}
                      onChange={(e) => setFormData({...formData, noHp: e.target.value})}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      placeholder="email@contoh.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Jadwal & Dokter */}
              <div>
                <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2 border-b pb-2">
                  <Calendar size={18} className="text-rose-500" /> Pilih Layanan & Jadwal
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Poli Tujuan *</label>
                    <select 
                      value={formData.poli} 
                      onChange={handlePoliChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
                    >
                      <option value="kebidanan">Poli Kebidanan & Kandungan</option>
                      <option value="anak">Poli Kesehatan Anak</option>
                      <option value="tumbuhKembang">Klinik Tumbuh Kembang</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Dokter Spesialis *</label>
                    <select 
                      value={formData.dokter} 
                      onChange={(e) => setFormData({...formData, dokter: e.target.value})}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
                    >
                      {(doctorsByPoli[formData.poli] || []).map((doc, idx) => (
                        <option key={idx} value={doc}>{doc}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Kunjungan *</label>
                    <input 
                      required
                      type="date" 
                      value={formData.tanggal}
                      onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Sesi Jam Konsultasi *</label>
                    <select 
                      value={formData.jam} 
                      onChange={(e) => setFormData({...formData, jam: e.target.value})}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
                    >
                      <option value="09:00">Pagi (09:00 - 11:00 WIB)</option>
                      <option value="13:00">Siang (13:00 - 15:00 WIB)</option>
                      <option value="16:00">Sore (16:00 - 18:00 WIB)</option>
                      <option value="19:00">Malam (19:00 - 21:00 WIB)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Pembayaran */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Metode Pembayaran</label>
                <div className="grid grid-cols-3 gap-3">
                  {['umum', 'bpjs', 'asuransi'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({...formData, tipePembayaran: type})}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition-all ${
                        formData.tipePembayaran === type 
                          ? 'border-rose-500 bg-rose-50 text-rose-600' 
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 rounded-xl text-sm shadow-md transition-all mt-4"
              >
                Konfirmasi Pendaftaran
              </button>

            </div>

            {/* Information Card (1 Column Side) */}
            <div className="space-y-6">
              <div className="bg-rose-50 rounded-3xl p-6 border border-rose-100">
                <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                  <ShieldAlert size={16} className="text-rose-500" /> Petunjuk Pendaftaran
                </h4>
                <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
                  <li>Pendaftaran online dilakukan maksimal **H-1** sebelum jadwal kunjungan.</li>
                  <li>Harap datang **15 menit lebih awal** untuk verifikasi ulang berkas di loket pendaftaran.</li>
                  <li>Bawa Kartu Identitas (KTP/KIA) & Kartu Asuransi/BPJS (jika ada).</li>
                </ul>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <h4 className="font-bold text-slate-900 text-sm mb-2">Butuh Bantuan Cepat?</h4>
                <p className="text-xs text-slate-500 mb-4">Tim CS RSIA Kirana siap melayani pertanyaan Anda via WhatsApp.</p>
                <a 
                  href="https://wa.me/6281234567890" 
                  target="_blank" 
                  rel="noreferrer"
                  className="block w-full text-center bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-xl text-xs transition-colors"
                >
                  Chat WhatsApp CS
                </a>
              </div>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}