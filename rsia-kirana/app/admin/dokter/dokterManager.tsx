'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, Stethoscope, X } from 'lucide-react';
import { CATEGORY_LABELS } from '@/lib/categories';
import { Field, inputClass } from '../ui';

export interface AdminDoctor {
  id: string;
  name: string;
  specialization: string;
  category: string | null;
  photoUrl: string | null;
  bio: string | null;
  isActive: boolean;
  schedules: { dayOfWeek: number; start: string; end: string }[];
}

interface ScheduleRow {
  dayOfWeek: number;
  start: string;
  end: string;
}

interface FormState {
  name: string;
  specialization: string;
  category: string;
  photoUrl: string;
  bio: string;
  isActive: boolean;
  schedules: ScheduleRow[];
}

const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0]; // tampilan dimulai dari Senin

const emptyForm: FormState = {
  name: '',
  specialization: '',
  category: '',
  photoUrl: '',
  bio: '',
  isActive: true,
  schedules: [],
};

// Foto dokter. Jika tidak ada URL atau gambar gagal dimuat (path salah, file
// belum ada), tampilkan ikon sebagai pengganti. Pakai <img> biasa agar URL
// eksternal tidak butuh konfigurasi remotePatterns di next.config.
function DoctorAvatar({ src, size = 'md' }: { src: string | null; size?: 'md' | 'lg' }) {
  const [failed, setFailed] = useState(false);
  const dim = size === 'lg' ? 'w-20 h-20' : 'w-12 h-12';

  if (!src || failed) {
    return (
      <div className={`${dim} rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0`}>
        <Stethoscope size={size === 'lg' ? 32 : 22} />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      onError={() => setFailed(true)}
      className={`${dim} rounded-full object-cover object-top shrink-0 bg-slate-100`}
    />
  );
}

export default function DokterManager({ doctors }: { doctors: AdminDoctor[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null); // 'new' atau id dokter
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const startNew = () => {
    setForm(emptyForm);
    setError('');
    setEditingId('new');
  };

  const startEdit = (d: AdminDoctor) => {
    setForm({
      name: d.name,
      specialization: d.specialization,
      category: d.category ?? '',
      photoUrl: d.photoUrl ?? '',
      bio: d.bio ?? '',
      isActive: d.isActive,
      schedules: d.schedules.map((s) => ({ ...s })),
    });
    setError('');
    setEditingId(d.id);
  };

  const cancel = () => {
    setEditingId(null);
    setError('');
  };

  const addSchedule = () =>
    setForm((f) => ({ ...f, schedules: [...f.schedules, { dayOfWeek: 1, start: '08:00', end: '10:00' }] }));

  const updateSchedule = (i: number, patch: Partial<ScheduleRow>) =>
    setForm((f) => ({
      ...f,
      schedules: f.schedules.map((s, idx) => (idx === i ? { ...s, ...patch } : s)),
    }));

  const removeSchedule = (i: number) =>
    setForm((f) => ({ ...f, schedules: f.schedules.filter((_, idx) => idx !== i) }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const isNew = editingId === 'new';
      const res = await fetch(isNew ? '/api/admin/doctors' : `/api/admin/doctors/${editingId}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan dokter.');

      setEditingId(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (d: AdminDoctor) => {
    if (!confirm(`Hapus dokter "${d.name}" beserta jadwalnya?`)) return;
    const res = await fetch(`/api/admin/doctors/${d.id}`, { method: 'DELETE' });
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || 'Gagal menghapus dokter.');
    }
  };

  const renderForm = () => (
    <form onSubmit={handleSave} className="bg-rose-50/50 rounded-2xl p-5 border border-rose-100 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">
          {editingId === 'new' ? 'Tambah Dokter Baru' : 'Ubah Data Dokter'}
        </h3>
        <button type="button" onClick={cancel} aria-label="Tutup form" className="text-slate-400 hover:text-slate-700">
          <X size={18} />
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Nama Dokter" required>
          <input
            required
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="dr. Nama Lengkap, Sp.OG"
            className={inputClass}
          />
        </Field>
        <Field label="Spesialisasi" required>
          <input
            required
            type="text"
            value={form.specialization}
            onChange={(e) => setForm({ ...form, specialization: e.target.value })}
            placeholder="Spesialis Kebidanan & Kandungan"
            className={inputClass}
          />
        </Field>
        <Field label="Poli (kategori booking)" hint="Dokter hanya muncul di form janji temu jika poli dipilih dan jadwal diisi.">
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className={inputClass}
          >
            <option value="">— Belum dipilih —</option>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Foto (path atau URL)" hint="Contoh: /images/dokter/nama-dokter.png">
          <input
            type="text"
            value={form.photoUrl}
            onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
            className={inputClass}
          />
          {form.photoUrl.trim() && (
            <div className="mt-2">
              <DoctorAvatar key={form.photoUrl.trim()} src={form.photoUrl.trim()} size="lg" />
            </div>
          )}
        </Field>
      </div>

      <Field label="Bio singkat">
        <textarea
          rows={3}
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          className={inputClass}
        />
      </Field>

      <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          className="accent-rose-500"
        />
        Aktif (tampil di website dan bisa dibooking)
      </label>

      {/* Jadwal praktik */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900">Jadwal Praktik Mingguan</h4>
          <button
            type="button"
            onClick={addSchedule}
            className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700 text-xs font-semibold"
          >
            <Plus size={14} /> Tambah jadwal
          </button>
        </div>

        {form.schedules.length === 0 && (
          <p className="text-[11px] text-slate-400">Belum ada jadwal. Klik &quot;Tambah jadwal&quot;.</p>
        )}

        {form.schedules.map((s, i) => (
          <div key={i} className="flex flex-wrap items-center gap-2">
            <select
              value={s.dayOfWeek}
              onChange={(e) => updateSchedule(i, { dayOfWeek: Number(e.target.value) })}
              aria-label="Hari praktik"
              className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
            >
              {DAY_ORDER.map((d) => (
                <option key={d} value={d}>
                  {DAY_NAMES[d]}
                </option>
              ))}
            </select>
            <input
              type="time"
              value={s.start}
              onChange={(e) => updateSchedule(i, { start: e.target.value })}
              aria-label="Jam mulai"
              className="px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
            <span className="text-xs text-slate-400">–</span>
            <input
              type="time"
              value={s.end}
              onChange={(e) => updateSchedule(i, { end: e.target.value })}
              aria-label="Jam selesai"
              className="px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
            <button
              type="button"
              onClick={() => removeSchedule(i)}
              aria-label="Hapus jadwal"
              className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
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
          onClick={cancel}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold"
        >
          Batal
        </button>
      </div>
    </form>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Dokter &amp; Jadwal</h1>
          <p className="text-slate-600 text-sm mt-1">{doctors.length} dokter terdaftar.</p>
        </div>
        {editingId === null && (
          <button
            onClick={startNew}
            className="inline-flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2.5 rounded-xl text-xs font-semibold"
          >
            <Plus size={14} /> Tambah Dokter
          </button>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {editingId === 'new' && renderForm()}

        {doctors.length === 0 && editingId !== 'new' && (
          <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center text-sm text-slate-500">
            Belum ada dokter.
          </div>
        )}

        {doctors.map((d) =>
          editingId === d.id ? (
            <div key={d.id}>{renderForm()}</div>
          ) : (
            <div key={d.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <DoctorAvatar key={d.photoUrl ?? 'none'} src={d.photoUrl} />
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 text-sm">{d.name}</p>
                    <p className="text-xs text-slate-500">{d.specialization}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                          d.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {d.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {d.category ? CATEGORY_LABELS[d.category] ?? d.category : 'Poli belum dipilih'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => startEdit(d)}
                    disabled={editingId !== null}
                    aria-label={`Ubah ${d.name}`}
                    className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-40"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(d)}
                    disabled={editingId !== null}
                    aria-label={`Hapus ${d.name}`}
                    className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 disabled:opacity-40"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-600 space-y-1">
                {d.schedules.length === 0 ? (
                  <p className="text-amber-600">Belum ada jadwal praktik.</p>
                ) : (
                  DAY_ORDER.map((day) => {
                    const slots = d.schedules.filter((s) => s.dayOfWeek === day);
                    if (slots.length === 0) return null;
                    return (
                      <p key={day}>
                        <strong className="inline-block w-16 text-slate-700">{DAY_NAMES[day]}</strong>
                        {slots.map((s) => `${s.start} – ${s.end}`).join(', ')}
                      </p>
                    );
                  })
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}