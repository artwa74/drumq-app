'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDB, actions, DAYS_TH, EventStatus } from '@/lib/store';
import clsx from 'clsx';
import { todayISO } from '@/lib/date';
import { Zap, Sparkles, CheckCircle2 } from 'lucide-react';

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

  const total = plan.reduce((s, e) => s + Number(e.fee||0), 0);
  const toggleDay = (d: string) => setDays(days.includes(d) ? days.filter(x => x !== d) : [...days, d]);

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/settings" className="text-ink-mute text-[13px] font-medium hover:text-ink">← กลับ</Link>
        <div className="text-[12px] text-ink-mute mt-3 mb-1.5">สร้างงานทั้งเดือนใน 3 คลิก</div>
        <h1 className="display text-[36px] lg:text-[44px] leading-none">
          Bulk <span className="italic-serif text-brand-hot">Generate</span>
        </h1>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div>
          <Step num={1} title="เลือกช่วงวันและวันในสัปดาห์">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-[11px] font-semibold text-ink-mute mb-1.5">จาก</label>
                <input type="date" className="input" value={from} onChange={e => setFrom(e.target.value)} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-ink-mute mb-1.5">ถึง</label>
                <input type="date" className="input" value={to} onChange={e => setTo(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {DAYS_TH.map(d => (
                <button key={d} onClick={() => toggleDay(d)}
                        className={clsx('chip', days.includes(d) && 'chip-active')}>
                  {d.slice(0,2)}
                </button>
              ))}
            </div>
          </Step>

          <Step num={2} title="ประเภทงานเริ่มต้น" sub="ใช้กับงานที่สร้างทุกอัน (แก้รายงานทีหลังได้)">
            <div className="flex gap-2">
              {(['งานวง','จ้างคนแทน'] as EventStatus[]).map(s => (
                <button key={s} onClick={() => setType(s)} className={clsx('chip', type === s && 'chip-active')}>
                  {s === 'งานวง' ? '🥁 งานวง' : '👤 จ้างแทน'}
                </button>
              ))}
            </div>
          </Step>

          <Step num={3} title="ตัวเลือกเพิ่มเติม">
            <label className="flex items-center gap-2.5 text-[13.5px] cursor-pointer">
              <input type="checkbox" checked={skip} onChange={e => setSkip(e.target.checked)}
                     className="w-4 h-4 accent-[#e11d48]" />
              <span>ข้ามวันที่มี <b>"ติดคอนเสิร์ต"</b> อยู่แล้ว</span>
            </label>
          </Step>
        </div>

        {/* Summary card */}
        <aside>
          <div className="sticky top-20 bg-ink text-white rounded-2xl p-5">
            <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-brand-hot mb-3">
              <Sparkles size={12}/> Preview
            </div>
            <div className="display text-[28px] leading-none mb-1 text-white">
              {plan.length} <span className="italic-serif text-brand-hot">งาน</span>
            </div>
            <div className="text-[12px] text-white/60 mb-5">จะถูกสร้างในช่วงที่เลือก</div>

            <div className="space-y-2 pb-4 border-b border-white/10">
              <Row label="รวมทั้งหมด" value={`${plan.length} งาน`} />
              <Row label="ประเภท" value={type} />
              <Row label="รายรับรวม" value={`฿${total.toLocaleString('th-TH')}`} accent />
            </div>

            <button disabled={plan.length === 0}
                    onClick={() => { if (confirm(`สร้าง ${plan.length} งาน?`)) { actions.bulkAddEvents(plan); router.push('/calendar'); } }}
                    className={clsx(
                      'w-full mt-4 py-3 rounded-lg font-semibold text-[14px] inline-flex items-center justify-center gap-2 transition',
                      plan.length === 0
                        ? 'bg-white/10 text-white/40 cursor-not-allowed'
                        : 'bg-brand-hot text-white hover:bg-rose-700 active:scale-[0.98]'
                    )}>
              <Zap size={15}/> สร้างลงปฏิทิน
            </button>

            {plan.length === 0 && (
              <div className="mt-3 text-[11px] text-white/50 leading-relaxed">
                ตรวจ Roster หรือช่วงวันที่ — อาจยังไม่มีงานจะสร้าง
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Step({ num, title, sub, children }: { num: number; title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-line rounded-2xl p-5 mb-4">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-none w-7 h-7 rounded-full bg-brand text-white grid place-items-center display text-[13px]">{num}</div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-[15px]">{title}</div>
          {sub && <div className="text-[12px] text-ink-mute mt-0.5">{sub}</div>}
        </div>
      </div>
      {children}
    </div>
  );
}

function Row({ label, value, accent }: any) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12.5px] text-white/70">{label}</span>
      <span className={clsx('num text-[14px] font-semibold', accent ? 'text-brand-hot' : 'text-white')}>{value}</span>
    </div>
  );
}
