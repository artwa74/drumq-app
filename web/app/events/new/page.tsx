'use client';
import { useRouter } from 'next/navigation';
import EventForm from '@/components/EventForm';
import { useDB, actions } from '@/lib/store';
import { todayISO } from '@/lib/date';

export default function NewEventPage() {
  const db = useDB();
  const router = useRouter();
  return (
    <EventForm
      title="เพิ่มงานใหม่"
      initial={{ date: todayISO(), venueName: '', status: 'งานวง', actualSub: '', actualStart: '', actualEnd: '', fee: '', paid: false, notes: '' }}
      db={db}
      onSave={(data) => {
        const fee = data.fee || db.venues.find(v => v.name === data.venueName)?.defaultFee || '';
        actions.addEvent({ ...data, fee });
        router.push('/');
      }}
      onCancel={() => router.back()}
    />
  );
}
