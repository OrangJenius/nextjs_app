'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { ArrowLeft, Heart, Calendar, Clock, MapPin } from 'lucide-react';
import { eventsData } from '../../data/events';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const event = eventsData.find((e) => e.id === id);
  const [activeImage, setActiveImage] = useState(0);

  if (!event) return notFound();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      {/* Header */}
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
        {/* Gambar Utama */}
        <div className="relative w-full h-64 sm:h-96 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200">
          <Image
            src={event.images[activeImage].url}
            alt={event.images[activeImage].caption}
            fill
            className="object-cover"
          />
        </div>

        {/* Thumbnail selector, kalau lebih dari 1 gambar */}
        {event.images.length > 1 && (
          <div className="flex gap-3 mt-3">
            {event.images.map((img, idx) => (
              <button
                key={img.url}
                onClick={() => setActiveImage(idx)}
                className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                  idx === activeImage ? 'border-rose-500' : 'border-transparent opacity-70'
                }`}
              >
                <Image src={img.url} alt={img.caption} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Caption gambar aktif */}
        <p className="text-xs text-slate-500 mt-2 italic">{event.images[activeImage].caption}</p>

        {/* Info Utama */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm mt-6">
          <span className="text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-rose-100 text-rose-700">
            {event.category}
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-4">
            {event.title}
          </h1>

          <div className="grid sm:grid-cols-3 gap-3 mt-5 pt-5 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-rose-500 shrink-0" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-rose-500 shrink-0" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-rose-500 shrink-0" />
              <span>{event.location}</span>
            </div>
          </div>

          <p className="text-slate-600 text-sm mt-6 leading-relaxed">{event.description}</p>
        </div>
      </section>
    </div>
  );
}