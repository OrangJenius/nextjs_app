'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ArrowLeft, Calendar, User, ShieldAlert, CheckCircle2, AlertCircle, MessageCircle, Plus, LogOut } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
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
  namaPasien: string;
  nik: string;
  noHp: string;
  email: string | null;
}

// Data pasien yang dipakai untuk booking (pasien tersimpan ATAU data tamu)
interface BookedPatient {
  namaPasien: string;
  noHp: string;
}

type Slot = BookableDoctor['schedules'][number];

const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400';

const PHONE_RE = /^(\+?62|0)8\d{7,12}$/;

// ---------- Helper tanggal & jam (semua berbasis WITA) ----------

const WITA_TZ = 'Asia/Makassar';

// Tanggal (YYYY-MM-DD) dan menit sejak tengah malam saat ini di WITA,
// tidak tergantung zona waktu perangkat pengguna.
function getWitaNow() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: WITA_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '00';
  return {
    dateStr: `${get('year')}-${get('month')}-${get('day')}`,
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
  };
}

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function addDays(dateStr: string, days: number) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function dayOfWeekOf(dateStr: string) {
  return new Date(`${dateStr}T00:00:00Z`).getUTCDay();
}

// Slot praktik dokter pada tanggal tertentu. Untuk hari ini, slot yang
// jam selesainya sudah lewat tidak dihitung.
function slotsOn(
  doctor: BookableDoctor | undefined,
  dateStr: string,
  now: { dateStr: string; minutes: number }
): Slot[] {
  if (!doctor) return [];
  const dow = dayOfWeekOf(dateStr);
  return doctor.schedules.filter(
    (s) => s.dayOfWeek === dow && (dateStr !== now.dateStr || toMinutes(s.end) > now.minutes)
  );
}

// Tanggal terdekat (mulai dari `fromDate`, minimal hari ini) yang punya jadwal tersedia.
function findNextAvailableDate(doctor: BookableDoctor | undefined, fromDate: string): string | null {
  if (!doctor) return null;
  const now = getWitaNow();
  const start = fromDate < now.dateStr ? now.dateStr : fromDate;
  for (let i = 0; i <= 60; i++) {
    const date = addDays(start, i);
    if (slotsOn(doctor, date, now).length > 0) return date;
  }
  return null;
}

function formatDateLabel(dateStr: string) {
  return new Date(`${dateStr}T00:00:00Z`).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export default function JanjiTemuClient({ doctors }: { doctors: BookableDoctor[] }) {
  const { data: session, status } = useSession();
  const isAuthed = status === 'authenticated';
  const searchParams = useSearchParams();
  const doctorParam = searchParams.get('dokter');

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [bookingCode, setBookingCode] = useState('');
  const [bookedPatient, setBookedPatient] = useState<BookedPatient | null>(null);

  // Pasien tersimpan milik akun yang sedang login
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [newPatient, setNewPatient] = useState({ namaPasien: '', nik: '', noHp: '', email: '' });
  const [addPatientError, setAddPatientError] = useState('');
  const [addingPatient, setAddingPatient] = useState(false);

  // Data pasien untuk tamu (tanpa login)
  const [guest, setGuest] = useState({ namaPasien: '', nik: '', noHp: '', email: '' });

  const todayStr = getWitaNow().dateStr;

  const availableCategories = useMemo(
    () => CATEGORY_ORDER.filter((cat) => doctors.some((d) => d.category === cat)),
    [doctors]
  );

  // Dokter awal: dari ?dokter=<id> jika ada, kalau tidak dokter pertama dari poli pertama
  const defaultPoli = availableCategories[0] ?? '';
  const initialDoctor =
    doctors.find((d) => String(d.id) === doctorParam) ??
    doctors.find((d) => d.category === defaultPoli);
  const initialPoli = initialDoctor?.category ?? defaultPoli;
  const initialDate = findNextAvailableDate(initialDoctor, todayStr) ?? todayStr;

  const [dateAdjusted, setDateAdjusted] = useState(initialDate !== todayStr);

  const [formData, setFormData] = useState({
    patientId: '' as number | '',
    poli: initialPoli,
    dokterId: initialDoctor?.id ?? '',
    tanggal: initialDate,
    jam: '',
    tipePembayaran: 'umum',
    catatan: '',
  });

  const fetchPatients = useCallback(async () => {
    setLoadingPatients(true);
    try {
      const res = await fetch('/api/patients');
      if (res.ok) {
        const data: Patient[] = await res.json();
        setPatients(data);
        setFormData((prev) => ({ ...prev, patientId: prev.patientId || (data[0]?.id ?? '') }));
      }
    } finally {
      setLoadingPatients(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthed) {
      fetchPatients();
    }
  }, [isAuthed, fetchPatients]);

  const selectedPatient = patients.find((p) => p.id === formData.patientId);

  const currentDoctors = doctors.filter((d) => d.category === formData.poli);
  const selectedDoctorObj = currentDoctors.find((d) => d.id === formData.dokterId) || currentDoctors[0];

  const selectedDayOfWeek = formData.tanggal ? dayOfWeekOf(formData.tanggal) : null;
  const selectedDayName = selectedDayOfWeek !== null ? DAY_NAMES[selectedDayOfWeek] : '';

  const availableHourOptions = useMemo(() => {
    if (!selectedDoctorObj || !formData.tanggal) return [];
    return slotsOn(selectedDoctorObj, formData.tanggal, getWitaNow()).map((s) => s.hours);
  }, [selectedDoctorObj, formData.tanggal]);

  // Jaga agar jam yang dipilih selalu salah satu opsi yang tersedia
  useEffect(() => {
    setFormData((prev) => {
      if (availableHourOptions.length === 0) {
        return prev.jam === '' ? prev : { ...prev, jam: '' };
      }
      return availableHourOptions.includes(prev.jam) ? prev : { ...prev, jam: availableHourOptions[0] };
    });
  }, [availableHourOptions]);

  // Jadwal terdekat jika tanggal terpilih tidak punya slot
  const hasSlots = availableHourOptions.length > 0;
  const nextAvailableDate = useMemo(
    () => (hasSlots ? null : findNextAvailableDate(selectedDoctorObj, formData.tanggal)),
    [hasSlots, selectedDoctorObj, formData.tanggal]
  );

  const handleTanggalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateAdjusted(false);
    setFormData((prev) => ({ ...prev, tanggal: e.target.value }));
  };

  // Ganti dokter/poli: pertahankan tanggal jika dokter praktik hari itu,
  // kalau tidak, geser ke jadwal terdekat dokter tersebut.
  const applyDoctor = (poli: string, doctor: BookableDoctor | undefined) => {
    const wanted = formData.tanggal < todayStr ? todayStr : formData.tanggal;
    const next = findNextAvailableDate(doctor, wanted) ?? wanted;
    setDateAdjusted(next !== wanted);
    setFormData((prev) => ({ ...prev, poli, dokterId: doctor?.id ?? '', tanggal: next }));
  };

  const handlePoliChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPoli = e.target.value;
    applyDoctor(selectedPoli, doctors.find((d) => d.category === selectedPoli));
  };

  const handleDokterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    applyDoctor(formData.poli, currentDoctors.find((d) => String(d.id) === e.target.value));
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

  const buildWhatsAppLink = (code: string, patient: BookedPatient) => {
    const lines = [
      'Halo Admin RSIA Kirana, saya ingin konfirmasi janji temu berikut:',
      '',
      `Kode Booking: ${code}`,
      `Nama Pasien: ${patient.namaPasien}`,
      `Poli: ${CATEGORY_LABELS[formData.poli] ?? formData.poli}`,
      `Dokter: ${selectedDoctorObj?.name ?? '-'}`,
      `Tanggal: ${formData.tanggal} (${selectedDayName})`,
      `Jam Praktik: ${formData.jam}`,
      `Metode Pembayaran: ${formData.tipePembayaran.toUpperCase()}`,
      `No. WhatsApp Pasien: ${patient.noHp}`,
      '',
      'Mohon konfirmasinya, terima kasih.',
    ];
    const message = encodeURIComponent(lines.join('\n'));
    return `https://wa.me/${HOSPITAL_WA_NUMBER}?text=${message}`;
  };

  const patientReady = isAuthed
    ? !!formData.patientId
    : guest.namaPasien.trim().length >= 2 &&
      /^\d{16}$/.test(guest.nik) &&
      PHONE_RE.test(guest.noHp.replace(/[\s-]/g, ''));
  const canSubmit = hasSlots && !submitting && patientReady;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientReady) {
      alert(
        isAuthed
          ? 'Silakan pilih atau tambahkan data pasien terlebih dahulu.'
          : 'Silakan lengkapi nama, NIK (16 digit), dan nomor WhatsApp pasien dengan benar.'
      );
      return;
    }
    if (!formData.jam) {
      alert('Dokter tidak memiliki jadwal praktik pada hari yang dipilih. Silakan ubah tanggal atau dokter.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    const payload = isAuthed
      ? formData
      : {
          ...formData,
          patientId: undefined,
          namaPasien: guest.namaPasien.trim(),
          nik: guest.nik,
          noHp: guest.noHp.trim(),
          email: guest.email.trim(),
        };

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Gagal menyimpan janji temu.');
      }

      const data = await res.json();
      const code = `KRN-${String(data.id).padStart(6, '0')}`;

      const patientInfo: BookedPatient | null = isAuthed
        ? selectedPatient
          ? { namaPasien: selectedPatient.namaPasien, noHp: selectedPatient.noHp }
          : null
        : { namaPasien: guest.namaPasien.trim(), noHp: guest.noHp.trim() };

      setBookingCode(code);
      setBookedPatient(patientInfo);
      setSubmitted(true);

      if (patientInfo) {
        window.open(buildWhatsAppLink(code, patientInfo), '_blank');
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    } finally {
      setSubmitting(false);
    }
  };

  // Tunggu status sesi supaya form tamu tidak sempat berkedip untuk user yang login
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm text-slate-500">
        Memuat...
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
          {isAuthed ? (
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-1.5 text-slate-500 hover:text-rose-600 text-xs font-semibold"
            >
              <LogOut size={14} /> Keluar
            </button>
          ) : (
            <Link
              href="/login?callbackUrl=/janji-temu"
              className="text-slate-500 hover:text-rose-600 text-xs font-semibold"
            >
              Masuk
            </Link>
          )}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 pt-10">
        <div className="text-center mb-10">
          <span className="bg-rose-100 text-rose-700 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
            Layanan Pendaftaran Online
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-3">Buat Janji Temu Dokter</h1>
          <p className="text-slate-600 text-sm mt-2">
            {isAuthed ? (
              <>
                Masuk sebagai <strong>{session?.user?.name}</strong>, pilih pasien dan tanggal untuk melihat jadwal praktik.
              </>
            ) : (
              <>
                Isi data pasien dan pilih tanggal untuk melihat jadwal praktik.{' '}
                <Link href="/login?callbackUrl=/janji-temu" className="text-rose-600 font-semibold hover:underline">
                  Masuk
                </Link>{' '}
                untuk menyimpan data pasien.
              </>
            )}
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
            {!isAuthed && (
              <p className="text-[11px] text-slate-500 mt-2">
                Simpan kode booking ini untuk dirujuk saat menghubungi kami.
              </p>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 mt-6 text-left text-xs space-y-2 border border-slate-100">
              <p><strong>Nama Pasien:</strong> {bookedPatient?.namaPasien}</p>
              <p><strong>Dokter Tujuan:</strong> {selectedDoctorObj?.name}</p>
              <p><strong>Tanggal Kunjungan:</strong> {formData.tanggal} ({selectedDayName})</p>
              <p><strong>Jam Praktik:</strong> {formData.jam}</p>
              <p><strong>Metode Pembayaran:</strong> {formData.tipePembayaran.toUpperCase()}</p>
            </div>

            {bookedPatient && (
              <p className="text-xs text-slate-500 mt-6">
                *Konfirmasi reservasi telah dikirimkan via WhatsApp ke nomor <strong className="text-slate-700">{bookedPatient.noHp}</strong>.
              </p>
            )}

            {!isAuthed && (
              <div className="mt-6 bg-rose-50 border border-rose-100 rounded-2xl p-4 text-xs text-slate-600">
                Ingin booking berikutnya lebih cepat?{' '}
                <Link href="/login?callbackUrl=/janji-temu" className="text-rose-600 font-semibold hover:underline">
                  Masuk atau daftar
                </Link>{' '}
                untuk menyimpan data pasien.
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              {bookedPatient && (
                <a
                  href={buildWhatsAppLink(bookingCode, bookedPatient)}
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

              {/* Data Pasien */}
              <div>
                <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2 border-b pb-2">
                  <User size={18} className="text-rose-500" /> Data Pasien
                </h3>

                {!isAuthed ? (
                  /* --- TAMU: isi data langsung --- */
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap Pasien *</label>
                      <input
                        required
                        type="text"
                        maxLength={100}
                        value={guest.namaPasien}
                        onChange={(e) => setGuest({ ...guest, namaPasien: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">NIK (KTP/KIA) *</label>
                      <input
                        required
                        type="text"
                        inputMode="numeric"
                        maxLength={16}
                        pattern="\d{16}"
                        title="NIK harus 16 digit angka"
                        value={guest.nik}
                        onChange={(e) => setGuest({ ...guest, nik: e.target.value.replace(/\D/g, '').slice(0, 16) })}
                        className={inputClass}
                      />
                      {guest.nik.length > 0 && guest.nik.length < 16 && (
                        <p className="text-[11px] text-amber-600 mt-1">{guest.nik.length}/16 digit</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor WhatsApp *</label>
                      <input
                        required
                        type="tel"
                        inputMode="tel"
                        placeholder="08xxxxxxxxxx"
                        value={guest.noHp}
                        onChange={(e) => setGuest({ ...guest, noHp: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Email (opsional)</label>
                      <input
                        type="email"
                        value={guest.email}
                        onChange={(e) => setGuest({ ...guest, email: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                  </div>
                ) : loadingPatients ? (
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
                          {p.namaPasien} &mdash; {p.noHp}
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
                          className={inputClass}
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
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor WhatsApp *</label>
                        <input
                          required
                          type="tel"
                          value={newPatient.noHp}
                          onChange={(e) => setNewPatient({ ...newPatient, noHp: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={newPatient.email}
                          onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                          className={inputClass}
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
                      className={inputClass}
                    />
                    {selectedDayName && (
                      <p className="text-[11px] font-medium text-rose-600 mt-1">
                        Hari terpilih: <strong>{selectedDayName}</strong>
                      </p>
                    )}
                    {dateAdjusted && hasSlots && (
                      <p className="text-[11px] text-slate-500 mt-1">
                        Tanggal otomatis diatur ke jadwal terdekat dokter ini.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Jam *</label>
                    <select
                      required
                      value={formData.jam}
                      onChange={(e) => setFormData({ ...formData, jam: e.target.value })}
                      disabled={!hasSlots}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white font-medium ${
                        !hasSlots ? 'border-amber-300 bg-amber-50 text-amber-800' : 'border-slate-200'
                      }`}
                    >
                      {!hasSlots ? (
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

                {selectedDayName && !hasSlots && (
                  <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-amber-800 text-xs">
                    <AlertCircle size={18} className="shrink-0 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-bold">
                        {selectedDoctorObj?.name} tidak memiliki jadwal tersedia pada {formatDateLabel(formData.tanggal)}.
                      </p>
                      <p className="text-[11px] text-amber-700 mt-0.5">
                        Jadwal hari ini mungkin sudah lewat, atau dokter tidak praktik di hari tersebut.
                      </p>
                      {nextAvailableDate ? (
                        <button
                          type="button"
                          onClick={() => {
                            setDateAdjusted(true);
                            setFormData((prev) => ({ ...prev, tanggal: nextAvailableDate }));
                          }}
                          className="mt-2 bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-[11px] font-semibold"
                        >
                          Pilih jadwal terdekat: {formatDateLabel(nextAvailableDate)}
                        </button>
                      ) : (
                        <p className="text-[11px] text-amber-700 mt-1">
                          Silakan pilih dokter lain.
                        </p>
                      )}
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
                disabled={!canSubmit}
                className={`w-full font-bold py-3.5 rounded-xl text-sm shadow-md transition-all ${
                  !canSubmit
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
                  {isAuthed ? (
                    <li>Data pasien tersimpan di akun Anda, bisa dipakai lagi untuk booking berikutnya.</li>
                  ) : (
                    <li>Anda bisa membuat janji tanpa akun. Masuk jika ingin menyimpan data pasien untuk booking berikutnya.</li>
                  )}
                  <li>Tanggal kunjungan otomatis diatur ke jadwal terdekat dokter yang dipilih.</li>
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