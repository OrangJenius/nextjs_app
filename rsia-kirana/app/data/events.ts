export interface EventImage {
  url: string;
  caption: string;
}

export interface EventItem {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  description: string;
  images: EventImage[]; // first image is used as the card thumbnail
}

export const eventsData: EventItem[] = [
  {
    id: '1',
    title: 'Festival Sulut Sehat Mantos 2025',
    category: 'Booth Promosi',
    date: '24 Agustus 2025',
    time: '09:00 - 12:00 WITA',
    location: 'MANTOS 3',
    description:
      'Booth pameran di festival Sulut sehat Mantos',
    images: [
      {
        url: '/images/festivalSulutSehat.jpg',
        caption: 'Foto tim RS di festival Sulut sehat Mantos.',
      },
      {
        url: '/images/festivalSulutSehat2.jpg',
        caption: 'Foto tim RS di festival Sulut sehat Mantos.',
      },
      {
        url: '/images/festivalSulutSehat3.jpg',
        caption: 'Foto tim RS di festival Sulut sehat Mantos.',
      },
      {
        url: '/images/festivalSulutSehat4.jpg',
        caption: 'Foto tim RS di festival Sulut sehat Mantos.',
      },
      {
        url: '/images/festivalSulutSehat5.jpg',
        caption: 'Foto tim RS di festival Sulut sehat Mantos.',
      },
    ],
  },
  {
    id: '2',
    title: 'Baksos Peluk Desa Pulu',
    category: 'Bakti Sosial',
    date: '05 September 2025',
    time: '10:00 - 12:30 WITA',
    location: 'Desa Pulu',
    description:
      'Kegiatan Bakti Sosial di Desa Pulu',
    images: [
      {
        url: '/images/baksosDesaPulu.jpg',
        caption: 'Foto tim RS.',
      },
      {
        url: '/images/baksosDesaPulu2.jpg',
        caption: 'Foto tim RS.',
      },
      {
        url: '/images/baksosDesaPulu3.jpg',
        caption: 'Foto tim RS.',
      },
      {
        url: '/images/baksosDesaPulu4.jpg',
        caption: 'Foto tim RS.',
      },
      {
        url: '/images/baksosDesaPulu5.jpg',
        caption: 'Foto tim RS.',
      },
    ],
  },
  {
    id: '3',
    title: 'Kegiatan Natal 2025',
    category: 'Acara Natal',
    date: '25 Desember 2025',
    time: '08:00 - 15:00 WITA',
    location: 'Office RSIA Kirana',
    description:
      'Kegiatan perayaan natal RSIA Kirana.',
    images: [
      {
        url: '/images/natal.jpeg',
        caption: 'Foto Bersama.',
      },
      {
        url: '/images/natal2.jpeg',
        caption: 'Foto Bersama.',
      },
      {
        url: '/images/natal3.jpeg',
        caption: 'Foto Bersama.',
      },
      {
        url: '/images/natal4.jpeg',
        caption: 'Foto Bersama.',
      },
      {
        url: '/images/natal5.jpeg',
        caption: 'Foto Bersama.',
      },
    ],
  },
  {
    id: '4',
    title: 'Family Gathering 2026',
    category: 'Family Gathering',
    date: '02 Juni 2026',
    time: '07:30 - 17:00 WITA',
    location: 'Bunaken',
    description:
      'Kegiatan family gathering tim RSIA Kirana.',
    images: [
      {
        url: '/images/fmg.jpg',
        caption: 'Foto Bersama Family Gathering RSIA Kirana',
      },
      {
        url: '/images/fmg2.jpg',
        caption: 'Foto Bersama Family Gathering RSIA Kirana',
      },
      {
        url: '/images/fmg3.jpg',
        caption: 'Foto Bersama Family Gathering RSIA Kirana',
      },
      {
        url: '/images/fmg4.jpg',
        caption: 'Foto Bersama Family Gathering RSIA Kirana',
      },
    ],
  },
];