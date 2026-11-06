// Kategori poli untuk dokter. Dipakai oleh form admin dan validasi API.
export const CATEGORY_LABELS: Record<string, string> = {
  kebidanan: 'Poli Kebidanan & Kandungan',
  anak: 'Poli Kesehatan Anak',
  penyakitDalam: 'Poli Penyakit Dalam',
  endokrin: 'Poli Endokrin',
  jantung: 'Poli Jantung',
  saraf: 'Poli Saraf',
  rehabMedik: 'Kedokteran Fisik & Rehabilitasi',
  bedah: 'Poli Bedah',
};

export const CATEGORY_KEYS = Object.keys(CATEGORY_LABELS);