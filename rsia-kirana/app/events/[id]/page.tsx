import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, MapPin } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { formatEventDate } from '@/lib/events';
import { safeImageSrc } from '@/lib/images';
import EventGallery from './eventGallery';

// Next.js 16: params adalah Promise
export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const eventId = Number(id);
  if (!Number.isInteger(eventId)) notFound();

  const event = await prisma.events.findUnique({
    where: { id: eventId },
    include: { event_images: { orderBy: { sort_order: 'asc' } } },
  });
  if (!event) notFound();

  const images = event.event_images.flatMap((img) => {
    const url = safeImageSrc(img.url);
    return url ? [{ url, caption: img.caption }] : [];
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      {/* --- NAVBAR SIMPLE --- */}
      <header className="bg-white border-b border-rose-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/events" className="flex items-center gap-2 text-slate-600 hover:text-rose-600 font-medium text-sm transition-colors">
            <ArrowLeft size={18} /> Kembali ke Event
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

      <section className="max-w-3xl mx-auto px-4 mt-10">
        {/* Gambar utama + thumbnail + caption (butuh state, jadi Client Component) */}
        <EventGallery images={images} title={event.title} />

        {/* Info Utama */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm mt-6">
          <span className="text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-rose-100 text-rose-700">
            {event.category}
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-4">
            {event.title}
          </h1>

          {(event.event_date || event.event_time || event.location) && (
            <div className="grid sm:grid-cols-3 gap-3 mt-5 pt-5 border-t border-slate-100 text-xs text-slate-600">
              {event.event_date && (
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-rose-500 shrink-0" />
                  <span>{formatEventDate(event.event_date, true)}</span>
                </div>
              )}
              {event.event_time && (
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-rose-500 shrink-0" />
                  <span>{event.event_time}</span>
                </div>
              )}
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-rose-500 shrink-0" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>
          )}

          <p className="text-slate-600 text-sm mt-6 leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        </div>
      </section>
    </div>
  );
}