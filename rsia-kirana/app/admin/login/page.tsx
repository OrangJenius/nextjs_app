'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await signIn('credentials', {
      email,
      password,
      admin: 'true', // server hanya meloloskan akun dengan role admin
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError('Email atau password salah, atau akun ini bukan admin.');
      return;
    }

    router.push('/admin');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-xl">
        <div className="flex flex-col items-center mb-6">
          <Image src="/images/logo.png" alt="Logo RSIA Kirana" width={40} height={40} className="object-contain mb-2" />
          <span className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-700 text-[11px] px-3 py-1 rounded-full font-semibold uppercase tracking-wider mb-3">
            <ShieldCheck size={12} /> Area Admin
          </span>
          <h1 className="text-xl font-bold text-slate-900">Login Admin</h1>
          <p className="text-xs text-slate-500 mt-1">Khusus pengelola RSIA Kirana.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 text-black"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 text-black"
            />
          </div>

          {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-slate-300 text-white font-bold py-2.5 rounded-xl text-sm shadow-md transition-all"
          >
            {loading ? 'Memproses...' : 'Masuk sebagai Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}