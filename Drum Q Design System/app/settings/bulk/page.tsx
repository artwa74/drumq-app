'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDB, actions, DAYS_TH, EventStatus } from '@/lib/store';
import clsx from 'clsx';
import { todayISO } from '@/lib/date';

export default function BulkPage() {
  const db = useDB();
  const router = useRouter();
  const today = todayISO();
  const defaultTo = new Date(Date.now() + 30*86400000).toISOString().slice(0,10);

  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(defaultTo);
  const [days, setDays] = useState<string[]>([...DAYS_TH]);
  const [type, setType] = useState<EventStatus>('งานวง');
  const [skip, setSkip] = useState(true);

  const plan = useMemo(() => {
    if (!from || !to) return [];
    const out: any[] = [];
    const start = new Date(from), end = new Date(to);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate()+1)) {
      const iso = d.toISOString().slice(0,10);
      const day = DAYS_TH[d.getDay()];
      if (!days.includes(day)) continue;
      const rosterRows = db.roster.filter(r => r.dayOfWeek === day);
      if (!rosterRows.length) continue;
      const concert = db.events.find(e => e.date === iso && e.status === 'ติดคอนเสิร์ต');
      if (skip && concert) continue;
      rosterRows.forEach(r => {
        const dup = db.events.find(e => e.date === iso && e.venueName === r.venueName && (e.actualStart || '') === (r.standardStart || ''));
        if (dup) return;
        const venue = db.venues.find(v => v.name === r.venueName);
        out.push({
          date: iso, venueName: r.venueName, status: type,
          actualSub: '', actualStart: '', actualEnd: '',
          fee: venue?.defaultFee || '', paid: false,
        });
      });
    }
    return out;
  }, [db, from, to, days, type, skip]);

  const toggleDay = (d: string) => setDays(days.includes(d) ? days.filter(x => x !== d) : [...days, d]);

  return (
    <div className="pb-8">
      <Link href="/settings" className="text-ink-mute text-sm font-semibold">← กลับ</Link>
      <h1 className="font-display text-[28px] font-bold tracking-tight mt-2">สร้างงานจากผัง</h1>
      <p className="text-ink-mute text-sm mt-1 mb-5">ดึง Roster แต่ละวัน → สร้าง events อัตโนมัติ</p>

      <div className="grid grid-cols-2 gap-3">
        <L label="จากวันที่"><input type="date" className="input" value={from} onChange={e => setFrom(e.target.value)} /></L>
        <L label="ถึงวันที่"><input type="date" className="input" value={to} onChange={e => setTo(e.target.value)} /></L>
      </div>

      <L label="เลือกวัน">
        <div className="flex gap-2 flex-wrap">
          {DAYS_TH.map(d => (
            <button key={d} onClick={() => toggleDay(d)}
                    className={clsx('chip', days.includes(d) && 'chip-active')}>
              {d.slice(0,2)}
            </button>
          ))}
        </div>
      </L>

      <L label="ประเภทเริ่มต้น">
        <div className="flex gap-2">
          {(['งานวง','จ้างคนแทน'] as EventStatus[]).map(s => (
            <button key={s} onClick={() => setType(s)} className={clsx('chip', type === s && 'chip-active')}>
              {s === 'งานวง' ? '🥁 งานวง' : '👤 จ้างแทน'}
            </button>
          ))}
        </div>
      </L>

      <label className="flex items-center gap-2 text-sm mb-5 cursor-pointer">
        <input type="checkbox" checked={skip} onChange={e => setSkip(e.target.checked)} className="w-4 h-4 accent-[#ff5a1f]" />
        ข้ามวันที่มี "ติดคอนเสิร์ต"
      </label>

      <div className="text-sm text-ink-mute mb-3">
        {plan.length > 0
          ? <>จะสร้าง <b className="text-brand">{plan.length}</b> งาน (ข้ามงานที่มีอยู่แล้ว)</>
          : 'ไม่มีงานจะสร้าง ตรวจ Roster/ช่วงวันที่'}
      </div>

      <button disabled={plan.length === 0}
              onClick={() => { if (confirm(`สร้าง ${plan.length} งาน?`)) { actions.bulkAddEvents(plan); router.push('/calendar'); } }}
              className={clsx('btn-brand w-full', plan.length === 0 && 'opacity-40')}>
        สร้างลงปฏิทิน
      </button>
    </div>
  );
}

const L = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="mb-4">
    <label className="block text-xs font-semibold text-ink-mute mb-2">{label}</label>
    {children}
  </div>
);
