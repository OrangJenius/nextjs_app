'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { Field, inputClass } from '../ui';

export interface AdminArticle {
  id: number;
  title: string;
  slug: string;
  content: string;
  coverImageUrl: string | null;
  category: string;
  tag: string | null;
  excerpt: string | null;
  source: string | null;
  hashtag: string | null;
  publishedAt: string | null;
  createdAt: string;
}

interface FormState {
  title: string;
  slug: string;
  coverImageUrl: string;
  category: string;
  tag: string;
  excerpt: string;
  source: string;
  hashtag: string;
  content: string;
}

const emptyForm: FormState = {
  title: '',
  slug: '',
  coverImageUrl: '',
  category: 'berita',
  tag: '',
  excerpt: '',
  source: '',
  hashtag: '',
  content: '',
};

const CATEGORY_LABELS: Record<string, string> = { berita: 'Berita', update: 'Update' };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export default function ArtikelManager({ articles }: { articles: AdminArticle[] }) {
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

  const startEdit = (a: AdminArticle) => {
    setForm({
      title: a.title,
      slug: a.slug,
      coverImageUrl: a.coverImageUrl ?? '',
      category: a.category === 'update' ? 'update' : 'berita',
      tag: a.tag ?? '',
      excerpt: a.excerpt ?? '',
      source: a.source ?? '',
      hashtag: a.hashtag ?? '',
      content: a.content,
    });
    setError('');
    setEditingId(a.id);
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
      const res = await fetch(isNew ? '/api/admin/articles' : `/api/admin/articles/${editingId}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan artikel.');

      setEditingId(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (a: AdminArticle) => {
    if (!confirm(`Hapus artikel "${a.title}"?`)) return;
    const res = await fetch(`/api/admin/articles/${a.id}`, { method: 'DELETE' });
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || 'Gagal menghapus artikel.');
    }
  };

  const renderForm = () => (
    <form onSubmit={handleSave} className="bg-rose-50/50 rounded-2xl p-5 border border-rose-100 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">
          {editingId === 'new' ? 'Tambah Artikel Baru' : 'Ubah Artikel'}
        </h3>
        <button type="button" onClick={cancel} aria-label="Tutup form" className="text-slate-400 hover:text-slate-700">
          <X size={18} />
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Judul" required>
          <input
            required
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={inputClass}
          />
        </Field>
        <Field label="Slug (alamat URL)" hint="Kosongkan agar dibuat otomatis dari judul.">
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="contoh-judul-artikel"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Gambar sampul (path atau URL)" hint="Contoh: /images/berita/sampul.jpg. Gambar tampil utuh, tidak dipotong.">
        <input
          type="text"
          value={form.coverImageUrl}
          onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
          className={inputClass}
        />
      </Field>

      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Kategori" required hint="Menentukan tab di halaman Berita.">
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className={inputClass}
          >
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Label di gambar" hint="Kosong = #KiranaNews (Berita) atau #KiranaUpdate (Update).">
          <input
            type="text"
            value={form.tag}
            onChange={(e) => setForm({ ...form, tag: e.target.value })}
            placeholder="#KiranaNews"
            className={inputClass}
          />
        </Field>
        <Field label="Sumber / mitra" hint="Tampil di bawah kartu, mis. Manado Post atau Alfagift.">
          <input
            type="text"
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
            className={inputClass}
          />
        </Field>
        <Field label="Hashtag">
          <input
            type="text"
            value={form.hashtag}
            onChange={(e) => setForm({ ...form, hashtag: e.target.value })}
            placeholder="#KeKIRANAjo"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Ringkasan (tampil di kartu)" hint="Kosongkan untuk mengambilnya otomatis dari awal isi artikel.">
        <textarea
          rows={3}
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          className={inputClass}
        />
      </Field>

      <Field label="Isi artikel lengkap" hint="Opsional jika ringkasan diisi. Isi lengkap belum ditampilkan di halaman Berita.">
        <textarea
          rows={10}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
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
          <h1 className="text-2xl font-extrabold text-slate-900">Artikel</h1>
          <p className="text-slate-600 text-sm mt-1">{articles.length} artikel.</p>
        </div>
        {editingId === null && (
          <button
            onClick={startNew}
            className="inline-flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2.5 rounded-xl text-xs font-semibold"
          >
            <Plus size={14} /> Tambah Artikel
          </button>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {editingId === 'new' && renderForm()}

        {articles.length === 0 && editingId !== 'new' && (
          <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center text-sm text-slate-500">
            Belum ada artikel.
          </div>
        )}

        {articles.map((a) =>
          editingId === a.id ? (
            <div key={a.id}>{renderForm()}</div>
          ) : (
            <div key={a.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 text-sm">{a.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">/{a.slug}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                        a.publishedAt ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {a.publishedAt ? `Terbit ${formatDate(a.publishedAt)}` : 'Draf'}
                    </span>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700">
                      {CATEGORY_LABELS[a.category] ?? a.category}
                    </span>
                    <span className="text-[11px] text-slate-400">Dibuat {formatDate(a.createdAt)}</span>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => startEdit(a)}
                    disabled={editingId !== null}
                    aria-label={`Ubah ${a.title}`}
                    className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-40"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(a)}
                    disabled={editingId !== null}
                    aria-label={`Hapus ${a.title}`}
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