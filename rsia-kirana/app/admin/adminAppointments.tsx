'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  Clock,
  Stethoscope,
  FileText,
  Phone,
  Search,
  MessageCircle,
  CreditCard,
  MapPin,
  User,
  Mail,
  Eye,
  EyeOff,
} from 'lucide-react';

export interface AdminAppointment {
  id: number;
  patientName: string;
  phone: string;
  email: string | null;
  nik: string | null;
  isGuest: boolean;
  doctorName: string | null;
  specialization: string | null;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  notes: string | null;
  status: string;
  createdAt: string;
}

const STATUSES = [
  { value: 'pending', label: 'Menunggu', className: 'bg-amber-100 text-amber-700' },
  { value: 'confirmed', label: 'Terkonfirmasi', className: 'bg-emerald-100 text-emerald-700' },
  { value: 'completed', label: 'Selesai', className: 'bg-slate-200 text-slate-700' },
  { value: 'cancelled', label: 'Dibatalkan', className: 'bg-red-100 text-red-700' },
];

function statusInfo(value: string) {
  return STATUSES.find((s) => s.value === value) ?? { value, label: value, className: 'bg-slate-100 text-slate-600' };
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function formatBirthDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

// 0812... -> https://wa.me/62812...
function waLink(phone: string) {
  const digits = phone.replace(/\D/g, '');
  const intl = digits.startsWith('62') ? digits : digits.startsWith('0') ? `62${digits.slice(1)}` : `62${digits}`;
  return `https://wa.me/${intl}`;
}

function aptCode(id: number) {
  return `APT-${String(id).padStart(6, '0')}`;
}

// Show only the last 4 digits of the NIK until the admin chooses to reveal it
function maskNik(nik: string) {
  if (nik.length <= 4) return nik;
  return `${'•'.repeat(nik.length - 4)}${nik.slice(-4)}`;
}

function NikField({ nik }: { nik: string | null }) {
  const [shown, setShown] = useState(false);

  if (!nik) {
    return (
      <div className="flex items-center gap-2">
        <CreditCard size={14} className="text-rose-500 shrink-0" /> NIK: -
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <CreditCard size={14} className="text-rose-500 shrink-0" />
      <span>
        NIK: <span className="font-mono">{shown ? nik : maskNik(nik)}</span>
      </span>
      <button
        type="button"
        onClick={() => setShown((v) => !v)}
        aria-label={shown ? 'Sembunyikan NIK' : 'Tampilkan NIK'}
        className="text-slate-400 hover:text-slate-600"
      >
        {shown ? <EyeOff size={13} /> : <Eye size={13} />}
      </button>
    </div>
  );
}

// Aturan konfirmasi perubahan status:
// - dari Selesai / Dibatalkan ke status lain -> harus mengetik kode janji temu
// - dari status apa pun ke Menunggu          -> cukup klik konfirmasi
// (jika keduanya berlaku, misalnya Selesai -> Menunggu, yang dipakai adalah 'type')
// Aturan yang sama dicek ulang di API (PATCH /api/admin/appointments/[id]).
function confirmationLevel(from: string, to: string): 'none' | 'confirm' | 'type' {
  if (from === to) return 'none';
  if (from === 'completed' || from === 'cancelled') return 'type';
  if (to === 'pending') return 'confirm';
  return 'none';
}

interface PendingChange {
  appointment: AdminAppointment;
  status: string;
  level: 'confirm' | 'type';
}

export default function AdminAppointments({
  appointments: initial,
}: {
  appointments: AdminAppointment[];
}) {
  const [appointments, setAppointments] = useState(initial);
  const [filter, setFilter] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [pending, setPending] = useState<PendingChange | null>(null);
  const [typed, setTyped] = useState('');

  // Close the confirmation dialog with Escape (unless a save is in progress)
  useEffect(() => {
    if (!pending) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && updatingId === null) {
        setPending(null);
        setTyped('');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [pending, updatingId]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: appointments.length };
    for (const s of STATUSES) c[s.value] = 0;
    for (const a of appointments) c[a.status] = (c[a.status] ?? 0) + 1;
    return c;
  }, [appointments]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return appointments.filter((a) => {
      if (filter !== 'all' && a.status !== filter) return false;
      if (!q) return true;
      return (
        a.patientName.toLowerCase().includes(q) ||
        a.phone.toLowerCase().includes(q) ||
        (a.nik ?? '').includes(q) ||
        (a.doctorName ?? '').toLowerCase().includes(q) ||
        aptCode(a.id).toLowerCase().includes(q)
      );
    });
  }, [appointments, filter, query]);

  const applyStatus = async (id: number, status: string, confirmed: boolean): Promise<boolean> => {
    setError('');
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, confirmed }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Gagal mengubah status.');
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan.');
      return false;
    } finally {
      setUpdatingId(null);
    }
  };

  // Called when the status dropdown changes: save right away if safe,
  // or open the confirmation dialog for guarded changes.
  const requestStatusChange = (a: AdminAppointment, status: string) => {
    const level = confirmationLevel(a.status, status);
    if (level === 'none') {
      if (a.status !== status) applyStatus(a.id, status, false);
      return;
    }
    setError('');
    setTyped('');
    setPending({ appointment: a, status, level });
  };

  const closeDialog = () => {
    if (updatingId !== null) return;
    setPending(null);
    setTyped('');
  };

  const canConfirm =
    pending !== null &&
    (pending.level === 'confirm' || typed.trim().toUpperCase() === aptCode(pending.appointment.id));

  const handleConfirm = async () => {
    if (!pending || !canConfirm || updatingId !== null) return;
    const ok = await applyStatus(pending.appointment.id, pending.status, true);
    if (ok) {
      setPending(null);
      setTyped('');
    }
  };

  const tabs = [{ value: 'all', label: 'Semua' }, ...STATUSES];

  return (
    <div>
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Janji Temu Pasien</h1>
        <p className="text-slate-600 text-sm mt-1">Lihat semua pendaftaran dan ubah statusnya.</p>

        {/* Ringkasan */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
          {tabs.map((t) => (
            <button
              key={t.value}
              onClick={() => setFilter(t.value)}
              className={`text-left rounded-2xl p-4 border transition-all ${
                filter === t.value
                  ? 'bg-rose-500 border-rose-500 text-white shadow-md'
                  : 'bg-white border-slate-100 text-slate-700 hover:border-rose-200'
              }`}
            >
              <p className={`text-2xl font-extrabold ${filter === t.value ? 'text-white' : 'text-slate-900'}`}>
                {counts[t.value] ?? 0}
              </p>
              <p className={`text-xs font-semibold ${filter === t.value ? 'text-rose-100' : 'text-slate-500'}`}>
                {t.label}
              </p>
            </button>
          ))}
        </div>

        {/* Pencarian */}
        <div className="relative mt-6">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama pasien, NIK, nomor HP, dokter, atau kode APT..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
        </div>

        {error && <p className="text-xs text-red-600 font-medium mt-3">{error}</p>}

        {/* Daftar */}
        <div className="mt-6 space-y-3">
          {visible.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center text-sm text-slate-500">
              Tidak ada janji temu yang cocok.
            </div>
          ) : (
            visible.map((a) => {
              const info = statusInfo(a.status);
              return (
                <div key={a.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${info.className}`}>
                        {info.label}
                      </span>
                      <span className="text-[11px] text-slate-400">{aptCode(a.id)}</span>
                    </div>

                    <select
                      value={a.status}
                      disabled={updatingId === a.id}
                      onChange={(e) => requestStatusChange(a, e.target.value)}
                      aria-label={`Ubah status janji temu ${a.patientName}`}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-400 disabled:opacity-60"
                    >
                      {STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <h3 className="font-bold text-slate-900 text-base">{a.patientName}</h3>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        a.isGuest ? 'bg-slate-100 text-slate-600' : 'bg-sky-100 text-sky-700'
                      }`}
                    >
                      {a.isGuest ? 'Tamu' : 'Pasien terdaftar'}
                    </span>
                  </div>

                  {/* Data pasien */}
                  <div className="mt-3 rounded-xl bg-slate-50 border border-slate-100 p-3 grid sm:grid-cols-2 gap-x-6 gap-y-2 text-xs text-slate-600">
                    <p className="sm:col-span-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Data Pasien
                    </p>
                    <NikField nik={a.nik} />
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-rose-500 shrink-0" /> {a.phone}
                      <a
                        href={waLink(a.phone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-semibold"
                      >
                        <MessageCircle size={13} /> WhatsApp
                      </a>
                    </div>
                    {a.email && (
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-rose-500 shrink-0" /> {a.email}
                      </div>
                    )}
                  </div>

                  {/* Detail janji temu */}
                  <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 mt-3 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-rose-500 shrink-0" /> {formatDate(a.date)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-rose-500 shrink-0" /> {a.time} WITA
                    </div>
                    <div className="flex items-center gap-2 sm:col-span-2">
                      <Stethoscope size={14} className="text-rose-500 shrink-0" />
                      {a.doctorName ?? 'Dokter tidak diketahui'}
                      {a.specialization ? ` — ${a.specialization}` : ''}
                    </div>
                    {a.notes && (
                      <div className="flex items-start gap-2 sm:col-span-2">
                        <FileText size={14} className="text-rose-500 shrink-0 mt-0.5" />
                        <span>{a.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Dialog konfirmasi perubahan status */}
      {pending && (
        <div
          className="fixed inset-0 z-60 bg-slate-900/50 flex items-center justify-center px-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeDialog();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl"
          >
            <h2 id="confirm-title" className="text-base font-bold text-slate-900">
              Ubah status janji temu?
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              <strong>{pending.appointment.patientName}</strong> ({aptCode(pending.appointment.id)}) akan
              diubah dari <strong>{statusInfo(pending.appointment.status).label}</strong> menjadi{' '}
              <strong>{statusInfo(pending.status).label}</strong>.
            </p>

            {pending.level === 'type' ? (
              <div className="mt-4">
                <label htmlFor="confirm-input" className="block text-xs font-semibold text-slate-700 mb-1">
                  Status ini sudah final. Ketik{' '}
                  <span className="font-mono text-rose-600">{aptCode(pending.appointment.id)}</span> untuk
                  melanjutkan.
                </label>
                <input
                  id="confirm-input"
                  autoFocus
                  type="text"
                  autoComplete="off"
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleConfirm();
                    }
                  }}
                  placeholder={aptCode(pending.appointment.id)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>
            ) : (
              <p className="text-xs text-slate-500 mt-3">
                Janji temu ini akan kembali berstatus Menunggu. Pastikan perubahan ini memang diperlukan.
              </p>
            )}

            {error && <p className="text-xs text-red-600 font-medium mt-3">{error}</p>}

            <div className="flex justify-end gap-2 mt-5">
              <button
                type="button"
                onClick={closeDialog}
                disabled={updatingId !== null}
                className="bg-slate-100 hover:bg-slate-200 disabled:opacity-60 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!canConfirm || updatingId !== null}
                className="bg-rose-500 hover:bg-rose-600 disabled:bg-slate-300 disabled:text-slate-500 text-white px-4 py-2 rounded-xl text-xs font-semibold"
              >
                {updatingId !== null ? 'Menyimpan...' : 'Ya, ubah status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}