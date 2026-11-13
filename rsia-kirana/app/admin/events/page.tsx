import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin';
import { prisma } from '@/lib/prisma';
import EventsManager, { type AdminEvent } from './eventsManager';

export default async function AdminEventsPage() {
  if (!(await getAdminSession())) {
    redirect('/admin/login');
  }

  const rows = await prisma.events.findMany({
    include: { event_images: { orderBy: { sort_order: 'asc' } } },
    orderBy: [{ event_date: 'desc' }, { id: 'desc' }],
  });

  const events: AdminEvent[] = rows.map((e) => ({
    id: e.id,
    title: e.title,
    category: e.category,
    description: e.description,
    date: e.event_date ? e.event_date.toISOString().slice(0, 10) : '',
    time: e.event_time ?? '',
    location: e.location ?? '',
    images: e.event_images.map((img) => ({ url: img.url, caption: img.caption })),
  }));

  return <EventsManager events={events} />;
}