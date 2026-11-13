export function formatEventDate(d: Date, withWeekday = false): string {
  return d.toLocaleDateString('id-ID', {
    ...(withWeekday ? { weekday: 'long' as const } : {}),
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

// URL penuh (http/https) tidak perlu didaftarkan di next.config jika
// next/image dipakai dengan prop unoptimized.
export function isExternalImage(url: string): boolean {
  return /^https?:\/\//i.test(url);
}