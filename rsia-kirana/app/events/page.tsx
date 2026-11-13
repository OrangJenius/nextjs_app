import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { formatEventDate, isExternalImage } from '@/lib/events';
import { safeImageSrc } from '@/lib/images';

export default async function EventsPage() {
  const events = await prisma.events.findMany({
    include: { event_images: { orderBy: { sort_order: 'asc' }, take: 1 } },
    orderBy: [{ event_date: 'desc' }, { id: 'desc' }],
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      {/* --- NAVBAR SIMPLE --- */}
      <header className="bg-white border-b border-rose-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-rose-600 font-medium text-sm transition-colors">
            <ArrowLeft size={18} /> Kembali ke Beranda
          </Link>
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Logo RSIA Kirana"
              width={32}
              height={32}
              className="object-contain"
              priority
            />
            <span className="font-bold text-slate-900 tracking-tight text-sm">RSIA KIRANA</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-linear-to-b from-rose-50 via-white to-slate-50 pt-10 pb-12 border-b border-rose-100/60">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="bg-rose-100 text-rose-700 text-xs px-3.5 py-1.5 rounded-full font-semibold uppercase tracking-wider inline-flex items-center gap-1.5">
            <Sparkles size={14} /> Agenda & Kegiatan
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4">
            Kegiatan & Program Komunitas
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto mt-3">
            Lihat kegiatan-kegiatan RSIA Kirana
          </p>
        </div>
      </section>

      {/* List Event */}
      <section className="max-w-4xl mx-auto px-4 mt-10">
        {events.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-100">
            <Calendar className="mx-auto text-slate-300 mb-3" size={40} />
            <p className="text-slate-500 font-medium text-sm">Belum ada agenda saat ini.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {events.map((item) => {
              const cover = safeImageSrc(item.event_images[0]?.url);
              return (
                <Link
                  href={`/events/${item.id}`}
                  key={item.id}
                  className="block bg-white rounded-3xl overflow-hidden border border-rose-100 shadow-sm transition-all hover:shadow-md"
                >
                  {/* Thumbnail */}
                  <div className="relative w-full h-48 sm:h-56 bg-slate-100">
                    {cover ? (
                      <Image
                        src={cover}
                        alt={item.title}
                        fill
                        sizes="(max-width: 896px) 100vw, 896px"
                        unoptimized={isExternalImage(cover)}
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                        <Calendar size={40} />
                      </div>
                    )}
                  </div>

                  <div className="p-6 sm:p-8">
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-rose-100 text-rose-700">
                      {item.category}
                    </span>

                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-3">{item.title}</h3>
                    <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>

                    {/* Detail Informasi */}
                    {(item.event_date || item.event_time || item.location) && (
                      <div className="grid sm:grid-cols-3 gap-3 mt-5 pt-5 border-t border-slate-100 text-xs text-slate-600">
                        {item.event_date && (
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-rose-500 shrink-0" />
                            <span>{formatEventDate(item.event_date)}</span>
                          </div>
                        )}
                        {item.event_time && (
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-rose-500 shrink-0" />
                            <span>{item.event_time}</span>
                          </div>
                        )}
                        {item.location && (
                          <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-rose-500 shrink-0" />
                            <span className="truncate">{item.location}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Aksi */}
                    <div className="mt-6">
                      <span className="inline-flex items-center gap-2 bg-rose-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-sm">
                        Lihat Detail <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}