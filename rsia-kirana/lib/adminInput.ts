import { CATEGORY_KEYS } from '@/lib/categories';
import { HHMM_RE } from '@/lib/time';

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
const orNull = (v: unknown) => str(v) || null;

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Prisma error P2002 = pelanggaran unique (mis. slug sudah dipakai)
export function isUniqueViolation(err: unknown): boolean {
  return typeof err === 'object' && err !== null && (err as { code?: string }).code === 'P2002';
}

export interface ScheduleInput {
  dayOfWeek: number;
  start: string;
  end: string;
}

export function parseDoctorBody(body: unknown):
  | { error: string }
  | {
      data: {
        name: string;
        specialization: string;
        category: string | null;
        photo_url: string | null;
        bio: string | null;
        is_active: boolean;
      };
      schedules: ScheduleInput[];
    } {
  const b = (body ?? {}) as Record<string, unknown>;

  const name = str(b.name);
  const specialization = str(b.specialization);
  if (!name || !specialization) {
    return { error: 'Nama dan spesialisasi wajib diisi.' };
  }

  const category = str(b.category);
  if (category && !CATEGORY_KEYS.includes(category)) {
    return { error: 'Kategori poli tidak valid.' };
  }

  const schedules: ScheduleInput[] = [];
  const raw = Array.isArray(b.schedules) ? b.schedules : [];
  for (const item of raw) {
    const r = (item ?? {}) as Record<string, unknown>;
    const dayOfWeek = Number(r.dayOfWeek);
    const start = str(r.start);
    const end = str(r.end);

    if (!Number.isInteger(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
      return { error: 'Hari praktik tidak valid.' };
    }
    if (!HHMM_RE.test(start) || !HHMM_RE.test(end)) {
      return { error: 'Format jam praktik harus HH:MM.' };
    }
    if (start >= end) {
      return { error: 'Jam selesai harus lebih besar dari jam mulai.' };
    }
    schedules.push({ dayOfWeek, start, end });
  }

  return {
    data: {
      name,
      specialization,
      category: category || null,
      photo_url: orNull(b.photoUrl),
      bio: orNull(b.bio),
      is_active: b.isActive !== false,
    },
    schedules,
  };
}

export function parseArticleBody(body: unknown):
  | { error: string }
  | {
      data: {
        title: string;
        slug: string;
        content: string;
        cover_image_url: string | null;
        category: string;
        tag: string | null;
        excerpt: string | null;
        source: string | null;
        hashtag: string | null;
      };
      published: boolean;
    } {
  const b = (body ?? {}) as Record<string, unknown>;

  const title = str(b.title);
  const content = str(b.content);
  const excerpt = str(b.excerpt);
  if (!title || (!content && !excerpt)) {
    return { error: 'Judul wajib diisi, dan isi artikel atau ringkasan harus ada salah satunya.' };
  }

  const category = str(b.category) || 'berita';
  if (!['berita', 'update'].includes(category)) {
    return { error: 'Kategori artikel tidak valid.' };
  }

  const slug = slugify(str(b.slug) || title);
  if (!slug) {
    return { error: 'Slug tidak valid.' };
  }

  return {
    data: {
      title,
      slug,
      content, // boleh kosong jika ringkasan diisi
      cover_image_url: normalizeImageUrl(b.coverImageUrl),
      category,
      tag: orNull(b.tag),
      excerpt: excerpt || null,
      source: orNull(b.source),
      hashtag: orNull(b.hashtag),
    },
    published: b.published === true,
  };
}

export function parseServiceBody(body: unknown):
  | { error: string }
  | { data: { name: string; slug: string; description: string | null; icon_url: string | null } } {
  const b = (body ?? {}) as Record<string, unknown>;

  const name = str(b.name);
  if (!name) {
    return { error: 'Nama layanan wajib diisi.' };
  }

  const slug = slugify(str(b.slug) || name);
  if (!slug) {
    return { error: 'Slug tidak valid.' };
  }

  return {
    data: { name, slug, description: orNull(b.description), icon_url: orNull(b.iconUrl) },
  };
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

// Path gambar lokal harus diawali "/" (aturan next/image). URL penuh dibiarkan.
export function normalizeImageUrl(v: unknown): string | null {
  const s = str(v);
  if (!s) return null;
  if (/^https?:\/\//i.test(s) || s.startsWith('/')) return s;
  return `/${s}`;
}

export interface EventImageInput {
  url: string;
  caption: string;
}

export function parseEventBody(body: unknown):
  | { error: string }
  | {
      data: {
        title: string;
        category: string;
        description: string;
        event_date: Date;
        event_time: string;
        location: string;
      };
      images: EventImageInput[];
    } {
  const b = (body ?? {}) as Record<string, unknown>;

  const title = str(b.title);
  const category = str(b.category);
  const description = str(b.description);
  const eventTime = str(b.time);
  const location = str(b.location);
  const date = str(b.date);

  if (!title || !category || !description || !eventTime || !location) {
    return { error: 'Judul, kategori, deskripsi, jam, dan lokasi wajib diisi.' };
  }

  // Tanggal harus format YYYY-MM-DD dan benar-benar ada di kalender
  const eventDate = new Date(`${date}T00:00:00.000Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(eventDate.getTime()) || eventDate.toISOString().slice(0, 10) !== date) {
    return { error: 'Tanggal tidak valid.' };
  }

  const images: EventImageInput[] = [];
  const raw = Array.isArray(b.images) ? b.images : [];
  for (const item of raw) {
    const r = (item ?? {}) as Record<string, unknown>;
    const url = normalizeImageUrl(r.url);
    if (!url) continue; // baris gambar yang kosong diabaikan
    images.push({ url, caption: str(r.caption) });
  }
  if (images.length > 10) {
    return { error: 'Maksimal 10 gambar per event.' };
  }

  return {
    data: { title, category, description, event_date: eventDate, event_time: eventTime, location },
    images,
  };
}