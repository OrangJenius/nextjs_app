'use client';

import React, { useState, useMemo } from 'react';
import { ArrowLeft, Calendar, User, ShieldAlert, CheckCircle2, Heart, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Data Dokter beserta Jadwal & Jam Praktik (WITA)
interface DoctorInfo {
  name: string;
  schedules: {
    days: string;
    hours: string;
  }[];
}

const doctorsByPoliData: Record<string, DoctorInfo[]> = {
  kebidanan: [
    {
      name: 'dr. Meiske Runkat, Sp.OG',
      schedules: [{ days: 'Senin - Jumat', hours: '10:00 - 12:00 WITA' }],
    },
    {
      name: 'Prof. dr. Hermie Tendean, Sp.OG (K)',
      schedules: [
        { days: 'Senin, Selasa, & Jumat', hours: '16:00 - 18:00 WITA' },
        { days: 'Rabu', hours: '17:00 - 19:00 WITA' },
        { days: 'Sabtu', hours: '14:00 - 16:00 WITA' },
      ],
    },
    {
      name: 'dr. Royke M.L. Rattu, Sp.OG',
      schedules: [{ days: 'Senin - Rabu', hours: '08:00 - 10:00 WITA' }],
    },
  ],
  anak: [
    {
      name: 'Dr. dr. Novie H. Rampengan, Sp.A(K)',
      schedules: [
        { days: 'Jumat', hours: '15:00 - 17:00 WITA' },
        { days: 'Sabtu', hours: '14:30 - 17:30 WITA' },
      ],
    },
    {
      name: 'dr. Jane Metusala, Sp.A',
      schedules: [
        { days: 'Selasa', hours: '12:15 - 14:15 WITA' },
        { days: 'Kamis', hours: '12:30 - 14:30 WITA' },
      ],
    },
    {
      name: 'dr. Irene Maryauw, Sp.A',
      schedules: [
        { days: 'Selasa', hours: '10:05 - 12:00 WITA' },
        { days: 'Rabu', hours: '08:00 - 10:00 WITA' },
      ],
    },
  ],
  penyakitDalam: [
    {
      name: 'dr. Arthur H. Rampengan, Sp.PD',
      schedules: [
        { days: 'Kamis', hours: '12:00 - 14:00 WITA' },
        { days: 'Jumat', hours: '12:00 - 15:00 WITA & 16:30 - 18:00 WITA' },
        { days: 'Sabtu', hours: '10:00 - 14:00 WITA & 16:30 - 18:00 WITA' },
      ],
    },
    {
      name: 'dr. Novita Tanasal, Sp.PD',
      schedules: [{ days: 'Rabu', hours: '14:00 - 16:00 WITA' }],
    },
    {
      name: 'dr. Joel Imanuel Kekenusa, Sp.PD',
      schedules: [{ days: 'Senin - Selasa', hours: '16:00 - 17:00 WITA' }],
    },
  ],
  endokrin: [
    {
      name: 'dr. Bisuk P. Sedli, Sp.PD-KEMD',
      schedules: [{ days: 'Senin & Kamis', hours: '16:00 - 17:30 WITA' }],
    },
  ],
  jantung: [
    {
      name: 'Prof. Dr. dr. Starry H. Rampengan, Sp.JP(K)',
      schedules: [
        { days: 'Senin - Jumat', hours: '20:00 - 22:00 WITA' },
        { days: 'Sabtu', hours: '19:00 - 21:00 WITA' },
      ],
    },
  ],
  saraf: [
    {
      name: 'Dr. dr. Sekplin A. S. Sekeon, Sp.N(K), FMIN, MPH',
      schedules: [{ days: 'Selasa & Jumat', hours: '15:00 - 17:00 WITA' }],
    },
  ],
  rehabMedik: [
    {
      name: 'dr. Florensia B. Tewal, Sp.KFR',
      schedules: [{ days: 'Selasa & Kamis', hours: '16:00 - 17:00 WITA' }],
    },
  ],
  bedah: [
    {
      name: 'dr. Leonardo Verdy Sagay, Sp.B',
      schedules: [{ days: 'Selasa & Jumat', hours: '08:00 - 10:00 WITA' }],
    },
    {
      name: 'dr. Pinkan Johana Lintong, Sp.B',
      schedules: [{ days: 'Senin & Rabu', hours: '08:00 - 10:00 WITA' }],
    },
  ],
};

const daysOrder = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];

function isDayInSchedule(dayName: string, scheduleDaysStr: string): boolean {
  if (!dayName) return true;
  const day = dayName.toLowerCase();
  const str = scheduleDaysStr.toLowerCase();

  if (str.includes('-')) {
    const parts = str.split('-').map((s) => s.trim());
    if (parts.length === 2) {
      const startIdx = daysOrder.findIndex((d) => parts[0].includes(d));
      const endIdx = daysOrder.findIndex((d) => parts[1].includes(d));
      const targetIdx = daysOrder.indexOf(day);
      if (startIdx !== -1 && endIdx !== -1 && targetIdx !== -1) {
        return targetIdx >= startIdx && targetIdx <= endIdx;
      }
    }
  }
  return str.includes(day);
}

function parseHourOptions(scheduleHoursList: string[]): string[] {
  const options: string[] = [];
  scheduleHoursList.forEach((hoursStr) => {
    if (hoursStr.includes('&')) {
      const parts = hoursStr.split('&').map((h) => h.trim());
      parts.forEach((p) => {
        if (!p.toUpperCase().includes('WITA') && hoursStr.toUpperCase().includes('WITA')) {
          options.push(`${p} WITA`);
        } else {
          options.push(p);
        }
      });
    } else {
      options.push(hoursStr);
    }
  });
  return options;
}

// Helper untuk format tanggal hari ini ke YYYY-MM-DD
function getTodayYYYYMMDD(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function JanjiTemuPage() {
  const [submitted, setSubmitted] = useState(false);

  // Set tanggal default ke hari ini
  const todayStr = getTodayYYYYMMDD();

  // Inisialisasi awal jam praktik berdasarkan hari ini & dokter pertama
  const defaultPoli = 'kebidanan';
  const defaultDoctor = doctorsByPoliData[defaultPoli][0];
  const initialDateObj = new Date();
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const initialDayName = days[initialDateObj.getDay()];

  const initialMatchingSch = defaultDoctor.schedules.filter((sch) =>
    isDayInSchedule(initialDayName, sch.days)
  );
  const initialHourOpts = parseHourOptions(initialMatchingSch.map((s) => s.hours));

  const [formData, setFormData] = useState({
    namaPasien: '',
    nik: '',
    noHp: '',
    email: '',
    poli: defaultPoli,
    dokter: defaultDoctor.name,
    tanggal: todayStr,
    jam: initialHourOpts.length > 0 ? initialHourOpts[0] : '',
    tipePembayaran: 'umum',
    catatan: '',
  });

  // Ambil daftar dokter berdasarkan poli aktif
  const currentDoctors = doctorsByPoliData[formData.poli] || [];

  // Objek dokter terpilih
  const selectedDoctorObj = currentDoctors.find((d) => d.name === formData.dokter) || currentDoctors[0];

  // Mendapatkan nama hari dari tanggal yang dipilih di kalender
  const selectedDayName = useMemo(() => {
    if (!formData.tanggal) return '';
    const [year, month, day] = formData.tanggal.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return days[date.getDay()];
  }, [formData.tanggal]);

  // List opsi jam praktik yang valid/tersedia untuk dokter terpilih pada HARI terpilih
  const availableHourOptions = useMemo(() => {
    if (!selectedDoctorObj) return [];

    let matchingSchedules = selectedDoctorObj.schedules;
    if (selectedDayName) {
      matchingSchedules = selectedDoctorObj.schedules.filter((sch) =>
        isDayInSchedule(selectedDayName, sch.days)
      );
    }

    const rawHours = matchingSchedules.map((s) => s.hours);
    return parseHourOptions(rawHours);
  }, [selectedDoctorObj, selectedDayName]);

  // Handler Tanggal
  const handleTanggalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTanggal = e.target.value;
    if (!newTanggal) {
      setFormData((prev) => ({ ...prev, tanggal: '', jam: '' }));
      return;
    }

    const [year, month, day] = newTanggal.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const dayName = days[date.getDay()];

    const matchingSchedules = selectedDoctorObj?.schedules.filter((sch) =>
      isDayInSchedule(dayName, sch.days)
    ) || [];

    const options = parseHourOptions(matchingSchedules.map((s) => s.hours));

    setFormData((prev) => ({
      ...prev,
      tanggal: newTanggal,
      jam: options.length > 0 ? options[0] : '',
    }));
  };

  // Handler Poli
  const handlePoliChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPoli = e.target.value;
    const availableDocs = doctorsByPoliData[selectedPoli] || [];
    const firstDoc = availableDocs[0];

    let defaultJam = '';
    if (firstDoc) {
      let matchingSchedules = firstDoc.schedules;
      if (selectedDayName) {
        matchingSchedules = firstDoc.schedules.filter((sch) =>
          isDayInSchedule(selectedDayName, sch.days)
        );
      }
      const options = parseHourOptions(matchingSchedules.map((s) => s.hours));
      if (options.length > 0) defaultJam = options[0];
    }

    setFormData((prev) => ({
      ...prev,
      poli: selectedPoli,
      dokter: firstDoc ? firstDoc.name : '',
      jam: defaultJam,
    }));
  };

  // Handler Dokter
  const handleDokterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDocName = e.target.value;
    const docObj = currentDoctors.find((d) => d.name === selectedDocName);

    let defaultJam = '';
    if (docObj) {
      let matchingSchedules = docObj.schedules;
      if (selectedDayName) {
        matchingSchedules = docObj.schedules.filter((sch) =>
          isDayInSchedule(selectedDayName, sch.days)
        );
      }
      const options = parseHourOptions(matchingSchedules.map((s) => s.hours));
      if (options.length > 0) defaultJam = options[0];
    }

    setFormData((prev) => ({
      ...prev,
      dokter: selectedDocName,
      jam: defaultJam,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.jam) {
      alert('Dokter tidak memiliki jadwal praktik pada hari yang dipilih. Silakan ubah tanggal atau dokter.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      {/* Header */}
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

      <div className="max-w-4xl mx-auto px-4 pt-10">
        <div className="text-center mb-10">
          <span className="bg-rose-100 text-rose-700 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
            Layanan Pendaftaran Online
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-3">Buat Janji Temu Dokter</h1>
          <p className="text-slate-600 text-sm mt-2">Pilih tanggal untuk melihat jadwal praktik yang tersedia.</p>
        </div>

        {submitted ? (
          /* Layar Konfirmasi */
          <div className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-xl text-center max-w-xl mx-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Pendaftaran Berhasil!</h2>
            <p className="text-slate-600 text-sm mt-2">
              Kode Booking: <span className="font-mono font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded border border-rose-200">KRN-{Math.floor(100000 + Math.random() * 900000)}</span>
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 mt-6 text-left text-xs space-y-2 border border-slate-100">
              <p><strong>Nama Pasien:</strong> {formData.namaPasien}</p>
              <p><strong>Dokter Tujuan:</strong> {formData.dokter}</p>
              <p><strong>Tanggal Kunjungan:</strong> {formData.tanggal} ({selectedDayName})</p>
              <p><strong>Jam Praktik:</strong> {formData.jam}</p>
              <p><strong>Metode Pembayaran:</strong> {formData.tipePembayaran.toUpperCase()}</p>
            </div>

            <p className="text-xs text-slate-500 mt-6">
              *Konfirmasi reservasi telah dikirimkan via WhatsApp ke nomor <strong className="text-slate-700">{formData.noHp}</strong>.
            </p>

            <div className="mt-8 flex gap-3 justify-center">
              <button onClick={() => setSubmitted(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-xs font-semibold">
                Buat Janji Lagi
              </button>
              <Link href="/" className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-xl text-xs font-semibold">
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        ) : (
          /* Form Pendaftaran */
          <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">

              {/* Data Pasien */}
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
                      onChange={(e) => setFormData({ ...formData, namaPasien: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="email@contoh.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                </div>
              </div>

              {/* Jadwal & Dokter */}
              <div>
                <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2 border-b pb-2">
                  <Calendar size={18} className="text-rose-500" /> Pilih Layanan & Tanggal Kunjungan
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
                      <option value="penyakitDalam">Poli Penyakit Dalam</option>
                      <option value="endokrin">Poli Endokrin</option>
                      <option value="jantung">Poli Jantung</option>
                      <option value="saraf">Poli Saraf</option>
                      <option value="rehabMedik">Kedokteran Fisik & Rehabilitasi</option>
                      <option value="bedah">Poli Bedah</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Dokter Spesialis *</label>
                    <select
                      value={formData.dokter}
                      onChange={handleDokterChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
                    >
                      {currentDoctors.map((doc, idx) => (
                        <option key={idx} value={doc.name}>{doc.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* KALENDER TANGGAL (DEFAULT HARI INI) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Kunjungan *</label>
                    <input
                      required
                      type="date"
                      min={todayStr}
                      value={formData.tanggal}
                      onChange={handleTanggalChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                    {selectedDayName && (
                      <p className="text-[11px] font-medium text-rose-600 mt-1">
                        Hari terpilih: <strong>{selectedDayName}</strong>
                      </p>
                    )}
                  </div>

                  {/* JAM PRAKTIK TERPILIH OTOMATIS */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Jam *</label>
                    <select
                      required
                      value={formData.jam}
                      onChange={(e) => setFormData({ ...formData, jam: e.target.value })}
                      disabled={availableHourOptions.length === 0}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white font-medium ${
                        availableHourOptions.length === 0 ? 'border-amber-300 bg-amber-50 text-amber-800' : 'border-slate-200'
                      }`}
                    >
                      {availableHourOptions.length === 0 ? (
                        <option value="">Tidak ada jadwal praktik</option>
                      ) : (
                        availableHourOptions.map((hourOpt, idx) => (
                          <option key={idx} value={hourOpt}>
                            {hourOpt}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                </div>

                {/* Warning Alert Jika Dokter Tidak Ada Jadwal Pada Hari Tersebut */}
                {selectedDayName && availableHourOptions.length === 0 && (
                  <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-amber-800 text-xs">
                    <AlertCircle size={18} className="shrink-0 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-bold">{selectedDoctorObj?.name} tidak praktik pada hari {selectedDayName}.</p>
                      <p className="text-[11px] text-amber-700 mt-0.5">
                        Jadwal rutin beliau: {selectedDoctorObj?.schedules.map(s => `${s.days} (${s.hours})`).join('; ')}. Silakan ganti tanggal atau pilih dokter lain.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Pembayaran */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Metode Pembayaran</label>
                <div className="grid grid-cols-3 gap-3">
                  {['umum', 'bpjs', 'asuransi'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, tipePembayaran: type })}
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
                disabled={availableHourOptions.length === 0}
                className={`w-full font-bold py-3.5 rounded-xl text-sm shadow-md transition-all ${
                  availableHourOptions.length === 0
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-rose-500 hover:bg-rose-600 text-white'
                }`}
              >
                Konfirmasi Pendaftaran
              </button>

            </div>

            {/* Side Info */}
            <div className="space-y-6">
              <div className="bg-rose-50 rounded-3xl p-6 border border-rose-100">
                <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                  <ShieldAlert size={16} className="text-rose-500" /> Petunjuk Pendaftaran
                </h4>
                <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
                  <li>Tanggal kunjungan secara default diatur ke **hari ini**.</li>
                  <li>Atribut `min={todayStr}` mencegah pemilihan tanggal sebelum hari ini.</li>
                  <li>Opsi jam praktik akan otomatis menyesuaikan hari pada tanggal kunjungan.</li>
                  <li>Harap datang **15 menit lebih awal** untuk verifikasi antrean.</li>
                </ul>
              </div>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}