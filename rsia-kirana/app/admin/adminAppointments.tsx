'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { Calendar, Clock, Stethoscope, FileText, Phone, Search, LogOut, MessageCircle } from 'lucide-react';

export interface AdminAppointment {
  id: number;
  patientName: string;
  phone: string;
  email: string | null;
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

// 0812... -> https://wa.me/62812...
function waLink(phone: string) {
  const digits = phone.replace(/\D/g, '');
  const intl = digits.startsWith('62') ? digits : digits.startsWith('0') ? `62${digits.slice(1)}` : `62${digits}`;
  return `https://wa.me/${intl}`;
}

export default function AdminAppointments({
  appointments: initial,
  adminName,
}: {
  appointments: AdminAppointment[];
  adminName: string;
}) {
  const [appointments, setAppointments] = useState(initial);
  const [filter, setFilter] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState('');

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
        (a.doctorName ?? '').toLowerCase().includes(q) ||
        `apt-${String(a.id).padStart(6, '0')}`.includes(q)
      );
    });
  }, [appointments, filter, query]);

  const handleStatusChange = async (id: number, status: string) => {
    setError('');
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Gagal mengubah status.');
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    } finally {
      setUpdatingId(null);
    }
  };

  const tabs = [{ value: 'all', label: 'Semua' }, ...STATUSES];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      <header className="bg-white border-b border-rose-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="Logo RSIA Kirana" width={32} height={32} className="object-contain" priority />
            <span className="font-bold text-slate-900 tracking-tight text-sm">RSIA KIRANA</span>
            <span className="bg-rose-100 text-rose-700 text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-xs text-slate-500">
              Masuk sebagai <strong className="text-slate-700">{adminName}</strong>
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="flex items-center gap-1.5 text-slate-500 hover:text-rose-600 text-xs font-semibold"
            >
              <LogOut size={14} /> Keluar
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
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
            placeholder="Cari nama pasien, nomor HP, dokter, atau kode APT..."
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
                      <span className="text-[11px] text-slate-400">APT-{String(a.id).padStart(6, '0')}</span>
                    </div>

                    <select
                      value={a.status}
                      disabled={updatingId === a.id}
                      onChange={(e) => handleStatusChange(a.id, e.target.value)}
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

                  <h3 className="font-bold text-slate-900 text-base mt-3">{a.patientName}</h3>

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
                    {a.email && <div className="text-slate-500">{a.email}</div>}
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
    </div>
  );
}