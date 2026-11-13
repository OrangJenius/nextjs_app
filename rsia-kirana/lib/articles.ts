export type ArticleCategory = 'berita' | 'update';

// Label bawaan di pojok gambar jika kolom "tag" dikosongkan
export const DEFAULT_TAGS: Record<ArticleCategory, string> = {
  berita: '#KiranaNews',
  update: '#KiranaUpdate',
};

// Ringkasan otomatis dari isi artikel (dipakai jika "excerpt" kosong)
export function makeExcerpt(content: string, max = 180): string {
  const text = content.replace(/\s+/g, ' ').trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

// RSIA Kirana di Manado (WITA), jadi tanggal ditampilkan dalam zona waktu itu
export function formatArticleDate(d: Date): string {
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Makassar',
  });
}