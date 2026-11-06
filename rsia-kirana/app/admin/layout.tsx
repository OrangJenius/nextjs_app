import React from 'react';
import { getAdminSession } from '@/lib/admin';
import AdminChrome from './adminChrome';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  const adminName = session ? session.user?.name ?? 'Admin' : null;

  return <AdminChrome adminName={adminName}>{children}</AdminChrome>;
}