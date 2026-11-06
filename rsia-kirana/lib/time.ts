// Kolom TIME di Prisma dibaca/ditulis sebagai Date pada 1970-01-01 dalam UTC.
// Semua konversi jam jadwal dokter lewat dua fungsi ini supaya konsisten.

export const HHMM_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export function dateToHHMM(d: Date): string {
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

export function hhmmToDate(hhmm: string): Date {
  return new Date(`1970-01-01T${hhmm}:00.000Z`);
}