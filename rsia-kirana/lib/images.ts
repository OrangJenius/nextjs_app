// Mengubah nilai gambar dari database menjadi src yang aman untuk next/image.
// Data yang salah (mis. "images/foto.png" tanpa "/" di depan) diperbaiki,
// dan nilai yang tidak bisa dipakai menghasilkan null agar halaman tidak error.
export function safeImageSrc(url: string | null | undefined): string | null {
  const s = (url ?? '').trim();
  if (!s) return null;

  // "//host/path" ditolak next/image
  if (s.startsWith('//')) return null;

  if (s.startsWith('/')) return s;

  if (/^https?:\/\//i.test(s)) {
    try {
      new URL(s);
      return s;
    } catch {
      return null;
    }
  }

  // Path lokal tanpa "/" di depan
  return `/${s}`;
}