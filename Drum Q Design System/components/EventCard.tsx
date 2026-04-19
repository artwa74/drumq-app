'use client';
import Link from 'next/link';
import clsx from 'clsx';
import { Event as LocalEvent } from '@/lib/store';
import { isToday } from '@/lib/date';
import { Clock, User } from 'lucide-react';

type Props = {
  ev: LocalEvent & { final_sub_name?: string; final_start?: string; final_end?: string; };
};

const MONTHS = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];

export default function EventCard({ ev }: Props) {
  const d = new Date(ev.date);
  const today = isToday(ev.date);
  return (
    <Link href={`/events/${ev.id}`}
          className="block bg-white border border-line rounded-xl p-4 hover:border-line-strong transition group">
      <div className="flex items-center gap-4">
        <div className={clsx(
          'flex-none w-12 h-14 rounded-lg flex flex-col items-center justify-center text-center',
          today ? 'bg-brand text-white' : 'bg-surface-2 text-ink'
        )}>
          <div className="num text-[18px] font-bold leading-none">{d.getDate()}</div>
          <div className={clsx('text-[9.5px] uppercase tracking-wider font-semibold mt-1',
            today ? 'text-white/85' : 'text-ink-dim')}>{MONTHS[d.getMonth()]}</div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="font-semibold text-[15px] truncate">{ev.venueName}</div>
            {ev.paid
              ? <span className="text-[10px] px-1.5 py-0.5 rounded bg-ink text-white font-medium">PAID</span>
              : <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-hot text-white font-medium">UNPAID</span>
            }
          </div>
          <div className="flex items-center gap-3 text-[12.5px] text-ink-mute">
            <span className="inline-flex items-center gap-1"><User size={12}/> {ev.final_sub_name || '—'}</span>
            <span className="inline-flex items-center gap-1 num"><Clock size={12}/> {ev.final_start || '?'}–{ev.final_end || '?'}</span>
          </div>
        </div>

        <div className="num text-[15px] font-semibold text-ink">
          ฿{Number(ev.fee || 0).toLocaleString('th-TH')}
        </div>
      </div>
    </Link>
  );
}
