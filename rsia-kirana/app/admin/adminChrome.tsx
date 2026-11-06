'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

const tabs = [
  { href: '/admin', label: 'Janji Temu' },
  { href: '/admin/dokter', label: 'Dokter & Jadwal' },
  { href: '/admin/artikel', label: 'Artikel' },
  { href: '/admin/layanan', label: 'Layanan' },
  { href: '/admin/events', label: 'Events' },
];

export default function AdminChrome({
  adminName,
  children,
}: {
  adminName: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Halaman login admin (atau belum login) tampil tanpa header/tab
  if (pathname === '/admin/login' || !adminName) {
    return <>{children}</>;
  }

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      <header className="bg-white border-b border-rose-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="Logo RSIA Kirana" width={32} height={32} className="object-contain" priority />
            <span className="font-bold text-slate-900 tracking-tight text-sm">RSIA KIRANA</span>
            <span className="bg-rose-100 text-rose-700 text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-xs text-slate-500">
              Masuk sebagai <strong className="text-slate-700">{adminName}</strong>
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="flex items-center gap-1.5 text-slate-500 hover:text-rose-600 text-xs font-semibold"
            >
              <LogOut size={14} /> Keluar
            </button>
          </div>
        </div>

        <nav className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
                isActive(t.href)
                  ? 'border-rose-500 text-rose-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">{children}</main>
    </div>
  );
}