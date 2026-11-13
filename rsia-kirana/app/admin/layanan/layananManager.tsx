'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { Field, inputClass } from '../ui';

export interface AdminService {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  iconUrl: string | null;
}

interface FormState {
  name: string;
  slug: string;
  description: string;
  iconUrl: string;
}

const emptyForm: FormState = { name: '', slug: '', description: '', iconUrl: '' };

export default function LayananManager({ services }: { services: AdminService[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<number | 'new' | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const startNew = () => {
    setForm(emptyForm);
    setError('');
    setEditingId('new');
  };

  const startEdit = (s: AdminService) => {
    setForm({
      name: s.name,
      slug: s.slug,
      description: s.description ?? '',
      iconUrl: s.iconUrl ?? '',
    });
    setError('');
    setEditingId(s.id);
  };

  const cancel = () => {
    setEditingId(null);
    setError('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const isNew = editingId === 'new';
      const res = await fetch(isNew ? '/api/admin/services' : `/api/admin/services/${editingId}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan layanan.');

      setEditingId(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (s: AdminService) => {
    if (!confirm(`Hapus layanan "${s.name}"?`)) return;
    const res = await fetch(`/api/admin/services/${s.id}`, { method: 'DELETE' });
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || 'Gagal menghapus layanan.');
    }
  };

  const renderForm = () => (
    <form onSubmit={handleSave} className="bg-rose-50/50 rounded-2xl p-5 border border-rose-100 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">
          {editingId === 'new' ? 'Tambah Layanan Baru' : 'Ubah Layanan'}
        </h3>
        <button type="button" onClick={cancel} aria-label="Tutup form" className="text-slate-400 hover:text-slate-700">
          <X size={18} />
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Nama Layanan" required>
          <input
            required
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
          />
        </Field>
        <Field label="Slug (alamat URL)" hint="Kosongkan agar dibuat otomatis dari nama.">
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="contoh-nama-layanan"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Deskripsi">
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className={inputClass}
        />
      </Field>

      <Field label="Ikon (path atau URL)" hint="Contoh: /images/layanan/ikon.png">
        <input
          type="text"
          value={form.iconUrl}
          onChange={(e) => setForm({ ...form, iconUrl: e.target.value })}
          className={inputClass}
        />
      </Field>

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
          <h1 className="text-2xl font-extrabold text-slate-900">Layanan</h1>
          <p className="text-slate-600 text-sm mt-1">{services.length} layanan.</p>
        </div>
        {editingId === null && (
          <button
            onClick={startNew}
            className="inline-flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2.5 rounded-xl text-xs font-semibold"
          >
            <Plus size={14} /> Tambah Layanan
          </button>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {editingId === 'new' && renderForm()}

        {services.length === 0 && editingId !== 'new' && (
          <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center text-sm text-slate-500">
            Belum ada layanan.
          </div>
        )}

        {services.map((s) =>
          editingId === s.id ? (
            <div key={s.id}>{renderForm()}</div>
          ) : (
            <div key={s.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 text-sm">{s.name}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">/{s.slug}</p>
                  {s.description && (
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3">{s.description}</p>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => startEdit(s)}
                    disabled={editingId !== null}
                    aria-label={`Ubah ${s.name}`}
                    className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-40"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(s)}
                    disabled={editingId !== null}
                    aria-label={`Hapus ${s.name}`}
                    className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 disabled:opacity-40"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}