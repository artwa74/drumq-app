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
          className="block bg-white border border-line rounded-[10px] px-3.5 py-3 hover:border-line-strong transition">
      <div className="flex items-center gap-3">
        <div className={clsx(
          'flex-none w-10 h-[46px] rounded-md flex flex-col items-center justify-center text-center',
          today ? 'bg-brand text-white' : 'bg-surface-2 text-ink'
        )}>
          <div className="num text-[15px] leading-none">{d.getDate()}</div>
          <div className={clsx('text-[8.5px] uppercase tracking-wider font-semibold mt-0.5',
            today ? 'text-white/85' : 'text-ink-dim')}>{MONTHS[d.getMonth()]}</div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <div className="font-semibold text-[14px] truncate">{ev.venueName}</div>
            {ev.paid
              ? <span className="flex-none text-[9px] px-1.5 py-px rounded bg-brand text-white font-bold tracking-wider">PAID</span>
              : <span className="flex-none text-[9px] px-1.5 py-px rounded bg-brand-hot text-white font-bold tracking-wider">UNPAID</span>
            }
          </div>
          <div className="flex items-center gap-2.5 text-[11.5px] text-ink-mute">
            <span className="inline-flex items-center gap-1"><User size={11}/> {ev.final_sub_name || '—'}</span>
            <span className="inline-flex items-center gap-1 num"><Clock size={11}/> {ev.final_start || '?'}–{ev.final_end || '?'}</span>
          </div>
        </div>

        <div className="num text-[13.5px] font-semibold text-ink flex-none">
          ฿{Number(ev.fee || 0).toLocaleString('th-TH')}
        </div>
      </div>
    </Link>
  );
}
