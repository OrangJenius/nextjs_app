'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ArrowLeft, Calendar, User, ShieldAlert, CheckCircle2, AlertCircle, MessageCircle, Plus, LogOut } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { BookableDoctor } from '@/lib/services/doctor.service';

const CATEGORY_LABELS: Record<string, string> = {
  kebidanan: 'Poli Kebidanan & Kandungan',
  anak: 'Poli Kesehatan Anak',
  penyakitDalam: 'Poli Penyakit Dalam',
  endokrin: 'Poli Endokrin',
  jantung: 'Poli Jantung',
  saraf: 'Poli Saraf',
  rehabMedik: 'Kedokteran Fisik & Rehabilitasi',
  bedah: 'Poli Bedah',
};
const CATEGORY_ORDER = Object.keys(CATEGORY_LABELS);

// TODO: ganti dengan nomor WhatsApp resmi rumah sakit (format internasional, tanpa "+" atau "0" di depan)
const HOSPITAL_WA_NUMBER = '6281388888898';

interface Patient {
  id: number;
  nama_pasien: string;
  nik: string;
  no_hp: string;
  email: string | null;
}

function getTodayYYYYMMDD(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export default function JanjiTemuClient({ doctors }: { doctors: BookableDoctor[] }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [bookingCode, setBookingCode] = useState('');

  // Pasien tersimpan milik akun yang sedang login
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [newPatient, setNewPatient] = useState({ namaPasien: '', nik: '', noHp: '', email: '' });
  const [addPatientError, setAddPatientError] = useState('');
  const [addingPatient, setAddingPatient] = useState(false);

  const todayStr = getTodayYYYYMMDD();

  // Halaman ini juga dilindungi middleware, tapi redirect di client tetap
  // dipasang sebagai lapisan cadangan.
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/janji-temu');
    }
  }, [status, router]);

  const fetchPatients = useCallback(async () => {
    setLoadingPatients(true);
    try {
      const res = await fetch('/api/patients');
      if (res.ok) {
        const data: Patient[] = await res.json();
        // console.log(data);
        setPatients(data);
        setFormData((prev) => ({ ...prev, patientId: prev.patientId || (data[0]?.id ?? '') }));
      }
    } finally {
      setLoadingPatients(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchPatients();
    }
  }, [status, fetchPatients]);

  const availableCategories = useMemo(
    () => CATEGORY_ORDER.filter((cat) => doctors.some((d) => d.category === cat)),
    [doctors]
  );

  const defaultPoli = availableCategories[0] ?? '';
  const defaultDoctors = doctors.filter((d) => d.category === defaultPoli);
  const defaultDoctor = defaultDoctors[0];

  const [formData, setFormData] = useState({
    patientId: '' as number | '',
    poli: defaultPoli,
    dokterId: defaultDoctor?.id ?? '',
    tanggal: todayStr,
    jam: '',
    tipePembayaran: 'umum',
    catatan: '',
  });

  const selectedPatient = patients.find((p) => p.id === formData.patientId);

  const currentDoctors = doctors.filter((d) => d.category === formData.poli);
  const selectedDoctorObj = currentDoctors.find((d) => d.id === formData.dokterId) || currentDoctors[0];

  const selectedDayOfWeek = useMemo(() => {
    if (!formData.tanggal) return null;
    const [year, month, day] = formData.tanggal.split('-').map(Number);
    return new Date(year, month - 1, day).getDay();
  }, [formData.tanggal]);

  const selectedDayName = selectedDayOfWeek !== null ? DAY_NAMES[selectedDayOfWeek] : '';

  const availableHourOptions = useMemo(() => {
    if (!selectedDoctorObj || selectedDayOfWeek === null) return [];
    return selectedDoctorObj.schedules
      .filter((s) => s.dayOfWeek === selectedDayOfWeek)
      .map((s) => s.hours);
  }, [selectedDoctorObj, selectedDayOfWeek]);

  useMemo(() => {
    if (availableHourOptions.length > 0 && !availableHourOptions.includes(formData.jam)) {
      setFormData((prev) => ({ ...prev, jam: availableHourOptions[0] }));
    } else if (availableHourOptions.length === 0 && formData.jam !== '') {
      setFormData((prev) => ({ ...prev, jam: '' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableHourOptions]);

  const handleTanggalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, tanggal: e.target.value }));
  };

  const handlePoliChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPoli = e.target.value;
    const firstDoc = doctors.find((d) => d.category === selectedPoli);
    setFormData((prev) => ({
      ...prev,
      poli: selectedPoli,
      dokterId: firstDoc ? firstDoc.id : '',
    }));
  };

  const handleDokterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, dokterId: e.target.value }));
  };

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddPatientError('');

    if (!/^\d{16}$/.test(newPatient.nik)) {
      setAddPatientError('NIK harus tepat 16 digit angka.');
      return;
    }

    setAddingPatient(true);
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPatient),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menambahkan pasien.');
      }

      setPatients((prev) => [data, ...prev]);
      setFormData((prev) => ({ ...prev, patientId: data.id }));
      setNewPatient({ namaPasien: '', nik: '', noHp: '', email: '' });
      setShowAddPatient(false);
    } catch (err) {
      setAddPatientError(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    } finally {
      setAddingPatient(false);
    }
  };

  const buildWhatsAppLink = (code: string, patient: Patient) => {
    const lines = [
      'Halo Admin RSIA Kirana, saya ingin konfirmasi janji temu berikut:',
      '',
      `Kode Booking: ${code}`,
      `Nama Pasien: ${patient.nama_pasien}`,
      `Poli: ${CATEGORY_LABELS[formData.poli] ?? formData.poli}`,
      `Dokter: ${selectedDoctorObj?.name ?? '-'}`,
      `Tanggal: ${formData.tanggal} (${selectedDayName})`,
      `Jam Praktik: ${formData.jam}`,
      `Metode Pembayaran: ${formData.tipePembayaran.toUpperCase()}`,
      `No. WhatsApp Pasien: ${patient.no_hp}`,
      '',
      'Mohon konfirmasinya, terima kasih.',
    ];
    const message = encodeURIComponent(lines.join('\n'));
    return `https://wa.me/${HOSPITAL_WA_NUMBER}?text=${message}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientId) {
      alert('Silakan pilih atau tambahkan data pasien terlebih dahulu.');
      return;
    }
    if (!formData.jam) {
      alert('Dokter tidak memiliki jadwal praktik pada hari yang dipilih. Silakan ubah tanggal atau dokter.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Gagal menyimpan janji temu.');
      }

      const data = await res.json();
      const code = `KRN-${String(data.id).padStart(6, '0')}`;
      setBookingCode(code);
      setSubmitted(true);

      if (selectedPatient) {
        window.open(buildWhatsAppLink(code, selectedPatient), '_blank');
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm text-slate-500">
        Memeriksa sesi login...
      </div>
    );
  }

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
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center gap-1.5 text-slate-500 hover:text-rose-600 text-xs font-semibold"
          >
            <LogOut size={14} /> Keluar
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 pt-10">
        <div className="text-center mb-10">
          <span className="bg-rose-100 text-rose-700 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
            Layanan Pendaftaran Online
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-3">Buat Janji Temu Dokter</h1>
          <p className="text-slate-600 text-sm mt-2">
            Masuk sebagai <strong>{session?.user?.name}</strong> pilih pasien dan tanggal untuk melihat jadwal praktik.
          </p>
        </div>

        {submitted ? (
          /* Layar Konfirmasi */
          <div className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-xl text-center max-w-xl mx-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Pendaftaran Berhasil!</h2>
            <p className="text-slate-600 text-sm mt-2">
              Kode Booking: <span className="font-mono font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded border border-rose-200">{bookingCode}</span>
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 mt-6 text-left text-xs space-y-2 border border-slate-100">
              <p><strong>Nama Pasien:</strong> {selectedPatient?.nama_pasien}</p>
              <p><strong>Dokter Tujuan:</strong> {selectedDoctorObj?.name}</p>
              <p><strong>Tanggal Kunjungan:</strong> {formData.tanggal} ({selectedDayName})</p>
              <p><strong>Jam Praktik:</strong> {formData.jam}</p>
              <p><strong>Metode Pembayaran:</strong> {formData.tipePembayaran.toUpperCase()}</p>
            </div>

            {selectedPatient && (
              <p className="text-xs text-slate-500 mt-6">
                *Konfirmasi reservasi telah dikirimkan via WhatsApp ke nomor <strong className="text-slate-700">{selectedPatient.no_hp}</strong>.
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              {selectedPatient && (
                <a
                  href={buildWhatsAppLink(bookingCode, selectedPatient)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-semibold"
                >
                  <MessageCircle size={16} /> Kirim via WhatsApp
                </a>
              )}
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

              {/* Pilih Pasien */}
              <div>
                <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2 border-b pb-2">
                  <User size={18} className="text-rose-500" /> Data Pasien
                </h3>

                {loadingPatients ? (
                  <p className="text-xs text-slate-500">Memuat data pasien...</p>
                ) : patients.length === 0 && !showAddPatient ? (
                  <div className="text-center py-4">
                    <p className="text-xs text-slate-500 mb-3">Belum ada data pasien tersimpan di akun Anda.</p>
                    <button
                      type="button"
                      onClick={() => setShowAddPatient(true)}
                      className="inline-flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl text-xs font-semibold"
                    >
                      <Plus size={14} /> Tambah Pasien
                    </button>
                  </div>
                ) : !showAddPatient ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Pasien *</label>
                    <select
                      value={formData.patientId}
                      onChange={(e) => setFormData({ ...formData, patientId: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
                    >
                      {patients.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nama_pasien} &mdash; {p.no_hp}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowAddPatient(true)}
                      className="mt-2 inline-flex items-center gap-1.5 text-rose-600 hover:text-rose-700 text-xs font-semibold"
                    >
                      <Plus size={14} /> Tambah pasien baru
                    </button>
                  </div>
                ) : (
                  <div className="bg-rose-50/50 rounded-2xl p-4 border border-rose-100 space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap Pasien *</label>
                        <input
                          required
                          type="text"
                          value={newPatient.namaPasien}
                          onChange={(e) => setNewPatient({ ...newPatient, namaPasien: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">NIK (KTP/KIA) *</label>
                        <input
                          required
                          type="text"
                          inputMode="numeric"
                          maxLength={16}
                          value={newPatient.nik}
                          onChange={(e) => setNewPatient({ ...newPatient, nik: e.target.value.replace(/\D/g, '').slice(0, 16) })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor WhatsApp *</label>
                        <input
                          required
                          type="tel"
                          value={newPatient.noHp}
                          onChange={(e) => setNewPatient({ ...newPatient, noHp: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={newPatient.email}
                          onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                        />
                      </div>
                    </div>

                    {addPatientError && <p className="text-xs text-red-600 font-medium">{addPatientError}</p>}

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleAddPatient}
                        disabled={addingPatient}
                        className="bg-rose-500 hover:bg-rose-600 disabled:bg-slate-300 text-white px-4 py-2 rounded-xl text-xs font-semibold"
                      >
                        {addingPatient ? 'Menyimpan...' : 'Simpan Pasien'}
                      </button>
                      {patients.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setShowAddPatient(false)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold"
                        >
                          Batal
                        </button>
                      )}
                    </div>
                  </div>
                )}
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
                      {availableCategories.map((cat) => (
                        <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Dokter Spesialis *</label>
                    <select
                      value={formData.dokterId}
                      onChange={handleDokterChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
                    >
                      {currentDoctors.map((doc) => (
                        <option key={doc.id} value={doc.id}>{doc.name}</option>
                      ))}
                    </select>
                  </div>

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

                {selectedDayName && availableHourOptions.length === 0 && (
                  <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-amber-800 text-xs">
                    <AlertCircle size={18} className="shrink-0 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-bold">{selectedDoctorObj?.name} tidak praktik pada hari {selectedDayName}.</p>
                      <p className="text-[11px] text-amber-700 mt-0.5">
                        Silakan ganti tanggal atau pilih dokter lain.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Pembayaran */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Metode Pembayaran</label>
                <div className="grid grid-cols-3 gap-3">
                  {['umum', 'asuransi'].map((type) => (
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

              {submitError && (
                <p className="text-xs text-red-600 font-medium">{submitError}</p>
              )}

              <button
                type="submit"
                disabled={availableHourOptions.length === 0 || submitting || !formData.patientId}
                className={`w-full font-bold py-3.5 rounded-xl text-sm shadow-md transition-all ${
                  availableHourOptions.length === 0 || submitting || !formData.patientId
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-rose-500 hover:bg-rose-600 text-white'
                }`}
              >
                {submitting ? 'Menyimpan...' : 'Konfirmasi Pendaftaran'}
              </button>

            </div>

            {/* Side Info */}
            <div className="space-y-6">
              <div className="bg-rose-50 rounded-3xl p-6 border border-rose-100">
                <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                  <ShieldAlert size={16} className="text-rose-500" /> Petunjuk Pendaftaran
                </h4>
                <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
                  <li>Data pasien tersimpan di akun Anda, bisa dipakai lagi untuk booking berikutnya.</li>
                  <li>Tanggal kunjungan secara default diatur ke hari ini.</li>
                  <li>Tanggal sebelum hari ini tidak dapat dipilih.</li>
                  <li>Opsi jam praktik akan otomatis menyesuaikan hari pada tanggal kunjungan.</li>
                  <li>Harap datang 15 menit lebih awal untuk verifikasi antrean.</li>
                </ul>
              </div>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}