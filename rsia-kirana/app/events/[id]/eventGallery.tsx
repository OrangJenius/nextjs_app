'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Calendar } from 'lucide-react';
import { isExternalImage } from '@/lib/events';

interface GalleryImage {
  url: string;
  caption: string;
}

export default function EventGallery({ images, title }: { images: GalleryImage[]; title: string }) {
  const [activeImage, setActiveImage] = useState(0);

  // Event tanpa gambar: tampilkan placeholder
  if (images.length === 0) {
    return (
      <div className="relative w-full h-64 sm:h-96 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-300">
        <Calendar size={48} />
      </div>
    );
  }

  const current = images[activeImage] ?? images[0];

  return (
    <>
      {/* Gambar Utama */}
      <div className="relative w-full h-64 sm:h-96 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200">
        <Image
          src={current.url}
          alt={current.caption || title}
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          unoptimized={isExternalImage(current.url)}
          priority
          className="object-cover"
        />
      </div>

      {/* Thumbnail selector, kalau lebih dari 1 gambar */}
      {images.length > 1 && (
        <div className="flex gap-3 mt-3 overflow-x-auto">
          {images.map((img, idx) => (
            <button
              key={`${img.url}-${idx}`}
              onClick={() => setActiveImage(idx)}
              aria-label={`Tampilkan gambar ${idx + 1}`}
              className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                idx === activeImage ? 'border-rose-500' : 'border-transparent opacity-70'
              }`}
            >
              <Image
                src={img.url}
                alt={img.caption || title}
                fill
                sizes="80px"
                unoptimized={isExternalImage(img.url)}
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Caption gambar aktif */}
      {current.caption && <p className="text-xs text-slate-500 mt-2 italic">{current.caption}</p>}
    </>
  );
}