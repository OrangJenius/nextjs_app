'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, X, Calendar, Clock, MapPin, Image as ImageIcon } from 'lucide-react';
import { Field, inputClass } from '../ui';

export interface AdminEvent {
  id: number;
  title: string;
  category: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  images: { url: string; caption: string }[];
}

interface FormState {
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  description: string;
  images: { url: string; caption: string }[];
}

const emptyForm: FormState = {
  title: '',
  category: '',
  date: '',
  time: '',
  location: '',
  description: '',
  images: [{ url: '', caption: '' }],
};

function formatDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

// Path lokal tanpa "/" di depan otomatis diberi "/" (sama seperti di server)
function previewSrc(url: string) {
  const s = url.trim();
  if (!s) return '';
  return /^https?:\/\//i.test(s) || s.startsWith('/') ? s : `/${s}`;
}

function Thumb({ src, className = 'w-14 h-10' }: { src: string; className?: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`${className} rounded-lg bg-slate-100 text-slate-300 flex items-center justify-center shrink-0`}>
        <ImageIcon size={16} />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      onError={() => setFailed(true)}
      className={`${className} rounded-lg object-cover bg-slate-100 shrink-0`}
    />
  );
}

export default function EventsManager({ events }: { events: AdminEvent[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<number | 'new' | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Saran kategori dari event yang sudah ada
  const categories = useMemo(() => Array.from(new Set(events.map((e) => e.category))).sort(), [events]);

  const startNew = () => {
    setForm({ ...emptyForm, images: [{ url: '', caption: '' }] });
    setError('');
    setEditingId('new');
  };

  const startEdit = (e: AdminEvent) => {
    setForm({
      title: e.title,
      category: e.category,
      date: e.date,
      time: e.time,
      location: e.location,
      description: e.description,
      images: e.images.length > 0 ? e.images.map((i) => ({ ...i })) : [{ url: '', caption: '' }],
    });
    setError('');
    setEditingId(e.id);
  };

  const cancel = () => {
    setEditingId(null);
    setError('');
  };

  const addImage = () => setForm((f) => ({ ...f, images: [...f.images, { url: '', caption: '' }] }));

  const updateImage = (i: number, patch: Partial<{ url: string; caption: string }>) =>
    setForm((f) => ({
      ...f,
      images: f.images.map((img, idx) => (idx === i ? { ...img, ...patch } : img)),
    }));

  const removeImage = (i: number) =>
    setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const isNew = editingId === 'new';
      const res = await fetch(isNew ? '/api/admin/events' : `/api/admin/events/${editingId}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan event.');

      setEditingId(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (ev: AdminEvent) => {
    if (!confirm(`Hapus event "${ev.title}"?`)) return;
    const res = await fetch(`/api/admin/events/${ev.id}`, { method: 'DELETE' });
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || 'Gagal menghapus event.');
    }
  };

  const renderForm = () => (
    <form onSubmit={handleSave} className="bg-rose-50/50 rounded-2xl p-5 border border-rose-100 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">
          {editingId === 'new' ? 'Tambah Event Baru' : 'Ubah Event'}
        </h3>
        <button type="button" onClick={cancel} aria-label="Tutup form" className="text-slate-400 hover:text-slate-700">
          <X size={18} />
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Judul Event" required>
          <input
            required
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={inputClass}
          />
        </Field>
        <Field label="Kategori" required hint="Ketik baru, atau pilih dari kategori yang sudah dipakai.">
          <input
            required
            type="text"
            list="event-categories"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className={inputClass}
          />
          <datalist id="event-categories">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Field>
        <Field label="Tanggal" hint="Boleh dikosongkan.">
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className={inputClass}
          />
        </Field>
        <Field label="Jam" hint="Teks bebas, tampil apa adanya di website. Boleh dikosongkan.">
          <input
            type="text"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            placeholder="09.00 - 12.00 WITA"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Lokasi" hint="Boleh dikosongkan.">
        <input
          type="text"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className={inputClass}
        />
      </Field>

      <Field label="Deskripsi" required>
        <textarea
          required
          rows={6}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className={inputClass}
        />
      </Field>

      {/* Gambar */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-900">Gambar</h4>
            <p className="text-[11px] text-slate-400">
              Gambar pertama dipakai sebagai sampul. Path lokal contoh: /images/events/kegiatan.jpg
            </p>
          </div>
          <button
            type="button"
            onClick={addImage}
            disabled={form.images.length >= 10}
            className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700 disabled:opacity-40 text-xs font-semibold"
          >
            <Plus size={14} /> Tambah gambar
          </button>
        </div>

        {form.images.map((img, i) => (
          <div key={i} className="flex flex-wrap sm:flex-nowrap items-center gap-2">
            <Thumb key={previewSrc(img.url)} src={previewSrc(img.url)} />
            <input
              type="text"
              value={img.url}
              onChange={(e) => updateImage(i, { url: e.target.value })}
              placeholder="/images/events/gambar.jpg"
              aria-label={`URL gambar ${i + 1}`}
              className={`${inputClass} sm:flex-1`}
            />
            <input
              type="text"
              value={img.caption}
              onChange={(e) => updateImage(i, { caption: e.target.value })}
              placeholder="Keterangan gambar"
              aria-label={`Keterangan gambar ${i + 1}`}
              className={`${inputClass} sm:flex-1`}
            />
            <button
              type="button"
              onClick={() => removeImage(i)}
              aria-label={`Hapus gambar ${i + 1}`}
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
          <h1 className="text-2xl font-extrabold text-slate-900">Events</h1>
          <p className="text-slate-600 text-sm mt-1">{events.length} event.</p>
        </div>
        {editingId === null && (
          <button
            onClick={startNew}
            className="inline-flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2.5 rounded-xl text-xs font-semibold"
          >
            <Plus size={14} /> Tambah Event
          </button>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {editingId === 'new' && renderForm()}

        {events.length === 0 && editingId !== 'new' && (
          <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center text-sm text-slate-500">
            Belum ada event.
          </div>
        )}

        {events.map((ev) =>
          editingId === ev.id ? (
            <div key={ev.id}>{renderForm()}</div>
          ) : (
            <div key={ev.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <Thumb
                    key={previewSrc(ev.images[0]?.url ?? '')}
                    src={previewSrc(ev.images[0]?.url ?? '')}
                    className="w-24 h-16"
                  />
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-rose-100 text-rose-700">
                      {ev.category}
                    </span>
                    <p className="font-bold text-slate-900 text-sm mt-2">{ev.title}</p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => startEdit(ev)}
                    disabled={editingId !== null}
                    aria-label={`Ubah ${ev.title}`}
                    className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-40"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(ev)}
                    disabled={editingId !== null}
                    aria-label={`Hapus ${ev.title}`}
                    className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 disabled:opacity-40"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {(ev.date || ev.time || ev.location) && (
                <div className="grid sm:grid-cols-3 gap-2 mt-4 text-xs text-slate-600">
                  {ev.date && (
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-rose-500 shrink-0" /> {formatDate(ev.date)}
                    </div>
                  )}
                  {ev.time && (
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-rose-500 shrink-0" /> {ev.time}
                    </div>
                  )}
                  {ev.location && (
                    <div className="flex items-center gap-2 min-w-0">
                      <MapPin size={14} className="text-rose-500 shrink-0" />
                      <span className="truncate">{ev.location}</span>
                    </div>
                  )}
                </div>
              )}
              <p className="text-[11px] text-slate-400 mt-2">{ev.images.length} gambar</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}