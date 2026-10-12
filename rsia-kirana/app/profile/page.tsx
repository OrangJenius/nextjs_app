'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Pencil, Trash2, User, Phone, Mail, IdCard } from 'lucide-react';

interface Patient {
  id: number;
  namaPasien: string;
  nik: string;
  noHp: string;
  email: string | null;
}

const emptyForm = { namaPasien: '', nik: '', noHp: '', email: '' };

// Tampilkan NIK tersamarkan, hanya 4 digit terakhir
function maskNik(nik: string) {
  return nik.length > 4 ? `${'•'.repeat(nik.length - 4)}${nik.slice(-4)}` : nik;
}

export default function ProfilPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | 'new' | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/profil');
    }
  }, [status, router]);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/patients');
      if (res.ok) setPatients(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') fetchPatients();
  }, [status, fetchPatients]);

  const startAdd = () => {
    setForm(emptyForm);
    setError('');
    setEditingId('new');
  };

  const startEdit = (p: Patient) => {
    setForm({ namaPasien: p.namaPasien, nik: p.nik, noHp: p.noHp, email: p.email ?? '' });
    setError('');
    setEditingId(p.id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setError('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!/^\d{16}$/.test(form.nik)) {
      setError('NIK harus tepat 16 digit angka.');
      return;
    }

    setSaving(true);
    try {
      const isNew = editingId === 'new';
      const res = await fetch(isNew ? '/api/patients' : `/api/patients/${editingId}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan data pasien.');

      setEditingId(null);
      await fetchPatients();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p: Patient) => {
    if (!confirm(`Hapus data pasien "${p.namaPasien}"? Riwayat janji temu yang sudah ada tetap tersimpan.`)) {
      return;
    }
    const res = await fetch(`/api/patients/${p.id}`, { method: 'DELETE' });
    if (res.ok) {
      await fetchPatients();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || 'Gagal menghapus pasien.');
    }
  };

  const inputClass =
    'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400';

  const renderForm = () => (
    <form onSubmit={handleSave} className="bg-rose-50/50 rounded-2xl p-5 border border-rose-100 space-y-4">
      <h3 className="text-sm font-bold text-slate-900">
        {editingId === 'new' ? 'Tambah Pasien Baru' : 'Ubah Data Pasien'}
      </h3>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap Pasien *</label>
          <input
            required
            type="text"
            value={form.namaPasien}
            onChange={(e) => setForm({ ...form, namaPasien: e.target.value })}
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
            value={form.nik}
            onChange={(e) => setForm({ ...form, nik: e.target.value.replace(/\D/g, '').slice(0, 16) })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor WhatsApp *</label>
          <input
            required
            type="tel"
            value={form.noHp}
            onChange={(e) => setForm({ ...form, noHp: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-rose-500 hover:bg-rose-600 disabled:bg-slate-300 text-white px-4 py-2 rounded-xl text-xs font-semibold"
        >
          {saving ? 'Menyimpan...' : 'Simpan'}
        </button>
        <button
          type="button"
          onClick={cancelEdit}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold"
        >
          Batal
        </button>
      </div>
    </form>
  );

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm text-slate-500">
        Memeriksa sesi login...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      <header className="bg-white border-b border-rose-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-rose-600 font-medium text-sm transition-colors">
            <ArrowLeft size={18} /> Kembali ke Beranda
          </Link>
          <div className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="Logo RSIA Kirana" width={32} height={32} className="object-contain" priority />
            <span className="font-bold text-slate-900 tracking-tight text-sm">RSIA KIRANA</span>
          </div>
          <Link href="/riwayat" className="text-rose-600 hover:text-rose-700 text-xs font-semibold">
            Riwayat
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 pt-10">
        <div className="text-center mb-10">
          <span className="bg-rose-100 text-rose-700 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
            Profil Pasien
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-3">Data Pasien Saya</h1>
          <p className="text-slate-600 text-sm mt-2">
            Akun: <strong>{session?.user?.name}</strong> &mdash; kelola pasien yang bisa Anda daftarkan janji temu.
          </p>
        </div>

        <div className="space-y-4">
          {editingId === 'new' && renderForm()}

          {loading ? (
            <p className="text-sm text-slate-500 text-center">Memuat data pasien...</p>
          ) : patients.length === 0 && editingId !== 'new' ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center">
              <p className="text-sm text-slate-500 mb-4">Belum ada data pasien tersimpan.</p>
              <button
                onClick={startAdd}
                className="inline-flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-xl text-xs font-semibold"
              >
                <Plus size={14} /> Tambah Pasien
              </button>
            </div>
          ) : (
            <>
              {patients.map((p) =>
                editingId === p.id ? (
                  <div key={p.id}>{renderForm()}</div>
                ) : (
                  <div key={p.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                          <User size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 text-sm truncate">{p.namaPasien}</p>
                          <p className="text-[11px] text-slate-400">ID Pasien #{p.id}</p>
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => startEdit(p)}
                          aria-label={`Ubah ${p.namaPasien}`}
                          className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
                          aria-label={`Hapus ${p.namaPasien}`}
                          className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-2 mt-4 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <IdCard size={14} className="text-rose-500 shrink-0" /> NIK: {maskNik(p.nik)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-rose-500 shrink-0" /> {p.noHp}
                      </div>
                      {p.email && (
                        <div className="flex items-center gap-2 sm:col-span-2">
                          <Mail size={14} className="text-rose-500 shrink-0" /> {p.email}
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}

              {editingId === null && patients.length > 0 && (
                <button
                  onClick={startAdd}
                  className="w-full flex items-center justify-center gap-1.5 border-2 border-dashed border-rose-200 hover:border-rose-400 hover:bg-rose-50 text-rose-600 py-3 rounded-2xl text-xs font-semibold transition-colors"
                >
                  <Plus size={14} /> Tambah pasien baru
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}