'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { useDB, finalSub, finalStart, finalEnd, actions } from '@/lib/store';
import { todayISO } from '@/lib/date';
import { ChevronLeft, ChevronRight, Plus, CalendarDays, ArrowUpRight, Circle, Trash2 } from 'lucide-react';

const MONTHS = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
const DOW_LONG = ['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'];
const DOW = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function CalendarPage() {
  const db = useDB();
  const now = new Date();
  const today = todayISO();
  const [y, setY] = useState(now.getFullYear());
  const [m, setM] = useState(now.getMonth());
  const [selected, setSelected] = useState(today);

  const monthEvents = useMemo(
    () => db.events.filter(e => { const d = new Date(e.date); return d.getFullYear() === y && d.getMonth() === m; })
                   .sort((a,b) => a.date.localeCompare(b.date)),
    [db.events, y, m]
  );
  const selectedEvents = useMemo(
    () => db.events.filter(e => e.date === selected).sort((a,b) => (a.actualStart||'').localeCompare(b.actualStart||'')),
    [db.events, selected]
  );

  const first = new Date(y, m, 1);
  const daysInMonth = new Date(y, m+1, 0).getDate();
  const startDow = first.getDay();
  const prevDays = new Date(y, m, 0).getDate();

  // Build 42 cells (6 weeks)
  const cells: { iso: string; day: number; other: boolean }[] = [];
  for (let i = startDow - 1; i >= 0; i--) {
    const d = prevDays - i;
    const pm = m === 0 ? 11 : m-1, py = m === 0 ? y-1 : y;
    cells.push({ iso: `${py}-${String(pm+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`, day: d, other: true });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ iso: `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`, day: d, other: false });
  }
  while (cells.length < 42) {
    const d = cells.length - (startDow + daysInMonth) + 1;
    const nm = m === 11 ? 0 : m+1, ny = m === 11 ? y+1 : y;
    cells.push({ iso: `${ny}-${String(nm+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`, day: d, other: true });
  }

  const jumpToday = () => { setY(now.getFullYear()); setM(now.getMonth()); setSelected(today); };
  const prevMonth = () => { if (m === 0) { setM(11); setY(y-1); } else setM(m-1); };
  const nextMonth = () => { if (m === 11) { setM(0); setY(y+1); } else setM(m+1); };

  return (
    <div>
      {/* Header */}
      <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <div>
          <div className="text-[12px] text-ink-mute mb-1.5">
            {monthEvents.length} งานในเดือนนี้
          </div>
          <h1 className="display text-[36px] lg:text-[44px] leading-none">
            <span className="italic-serif text-brand-hot">{MONTHS[m]}</span> <span className="text-ink-mute num font-normal">{y+543}</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={jumpToday} className="btn-outline !py-2 !px-3 !text-[13px]">
            วันนี้
          </button>
          <div className="flex border border-line rounded-lg overflow-hidden">
            <button onClick={prevMonth} className="w-9 h-9 grid place-items-center hover:bg-surface-2 transition border-r border-line">
              <ChevronLeft size={16}/>
            </button>
            <button onClick={nextMonth} className="w-9 h-9 grid place-items-center hover:bg-surface-2 transition">
              <ChevronRight size={16}/>
            </button>
          </div>
          <Link href="/events/new" className="btn-brand">
            <Plus size={15}/> เพิ่มงาน
          </Link>
        </div>
      </div>

      {/* Main split */}
      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        {/* Grid */}
        <div className="bg-white border border-line rounded-xl overflow-hidden">
          <div className="grid grid-cols-7 border-b border-line">
            {DOW.map((d, i) => (
              <div key={d} className={clsx(
                'text-center py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.12em]',
                i === 0 || i === 6 ? 'text-brand-hot/70' : 'text-ink-mute'
              )}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 grid-rows-6">
            {cells.map((c, i) => {
              const evs = monthEvents.filter(e => e.date === c.iso);
              const isToday = c.iso === today;
              const isSelected = c.iso === selected;
              const col = i % 7;
              const row = Math.floor(i / 7);
              const isWeekend = col === 0 || col === 6;
              return (
                <button key={c.iso + i}
                  onClick={() => setSelected(c.iso)}
                  className={clsx(
                    'relative text-left p-2 min-h-[88px] lg:min-h-[108px] border-line transition group',
                    col < 6 && 'border-r',
                    row < 5 && 'border-b',
                    c.other ? 'bg-surface-2/40' : 'bg-white hover:bg-surface-2/60',
                    isSelected && !c.other && 'bg-surface-2 !border-ink',
                  )}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={clsx(
                      'num text-[13px] font-semibold inline-flex items-center justify-center w-6 h-6 rounded-md',
                      c.other && 'text-ink-dim',
                      !c.other && isWeekend && !isToday && 'text-brand-hot/80',
                      !c.other && !isWeekend && !isToday && 'text-ink',
                      isToday && 'bg-brand-hot text-white',
                    )}>{c.day}</span>
                    {evs.length > 1 && <span className="text-[9.5px] font-semibold text-ink-mute bg-surface-3 rounded px-1">{evs.length}</span>}
                  </div>

                  <div className="space-y-0.5">
                    {evs.slice(0, 3).map(e => (
                      <div key={e.id} className={clsx(
                        'text-[10.5px] font-medium truncate px-1.5 py-0.5 rounded border',
                        e.status === 'ติดคอนเสิร์ต' ? 'bg-white border-brand-hot text-brand-hot' :
                        e.status === 'จ้างคนแทน' ? 'bg-brand-hot border-brand-hot text-white' :
                        !e.paid ? 'bg-ink border-ink text-white' : 'bg-white border-line text-ink'
                      )}>
                        <span className="num mr-1">{(e.actualStart||'').slice(0,5) || '•'}</span>
                        {e.venueName}
                      </div>
                    ))}
                    {evs.length > 3 && (
                      <div className="text-[10px] text-ink-mute px-1.5">+ {evs.length - 3} งาน</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="px-4 py-3 border-t border-line flex items-center gap-4 flex-wrap text-[11px] text-ink-mute">
            <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-ink"/>งานวง (ค้าง)</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-brand-hot"/>จ้างแทน</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-white border border-brand-hot"/>คอนเสิร์ต</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-white border border-line"/>จ่ายแล้ว</span>
          </div>
        </div>

        {/* Side panel */}
        <aside className="space-y-4">
          <div className="bg-white border border-line rounded-xl p-5">
            <div className="flex items-center gap-2 text-[10.5px] font-semibold text-ink-mute uppercase tracking-wider mb-2">
              <CalendarDays size={12}/>
              {selected === today && <span className="text-brand-hot">วันนี้</span>}
              {selected !== today && DOW_LONG[new Date(selected).getDay()]}
            </div>
            <div className="font-display text-[22px] font-bold tracking-[-0.02em] leading-tight mb-4">
              {new Date(selected).getDate()} {MONTHS[new Date(selected).getMonth()]}
            </div>

            {selectedEvents.length === 0 ? (
              <div className="py-6 text-center text-ink-dim text-[13px] border border-dashed border-line rounded-lg">
                <Circle size={22} className="mx-auto text-ink-dim/50 mb-2" />
                ไม่มีงานในวันนี้
                <div className="mt-3">
                  <Link href="/events/new" className="btn-outline !text-[12px] !py-1.5 !px-3">
                    <Plus size={12}/> เพิ่มงาน
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedEvents.map(e => (
                  <div key={e.id} className="relative group rounded-lg border border-line hover:border-ink transition">
                    <Link href={`/events/${e.id}`} className="block p-3 pr-11">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={clsx('w-1.5 h-1.5 rounded-full',
                          e.status === 'จ้างคนแทน' ? 'bg-brand-hot' :
                          e.status === 'ติดคอนเสิร์ต' ? 'bg-brand-hot' :
                          'bg-ink'
                        )}/>
                        <span className="text-[10px] font-semibold text-ink-mute uppercase tracking-wider">{e.status}</span>
                        <ArrowUpRight size={12} className="ml-auto text-ink-dim group-hover:text-ink transition"/>
                      </div>
                      <div className="font-semibold text-[14px] mb-0.5">{e.venueName}</div>
                      <div className="flex items-center gap-3 text-[12px] text-ink-mute">
                        <span className="num">{finalStart(db, e) || '?'}–{finalEnd(db, e) || '?'}</span>
                        <span className="truncate">{finalSub(db, e) || '—'}</span>
                        <span className="num font-semibold text-ink ml-auto">฿{Number(e.fee||0).toLocaleString('th-TH')}</span>
                      </div>
                    </Link>
                    <button
                      onClick={(ev) => {
                        ev.preventDefault(); ev.stopPropagation();
                        if (confirm(`ลบงาน "${e.venueName}"?`)) actions.removeEvent(e.id);
                      }}
                      className="absolute top-2 right-2 w-7 h-7 grid place-items-center rounded-md text-ink-dim opacity-60 lg:opacity-0 group-hover:opacity-100 hover:!opacity-100 hover:bg-brand-hot hover:text-white transition"
                      aria-label="ลบ">
                      <Trash2 size={13}/>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Month summary */}
          <div className="bg-white border border-line rounded-xl p-5">
            <div className="text-[10.5px] font-semibold text-ink-mute uppercase tracking-wider mb-3">สรุปเดือนนี้</div>
            <SummaryRow label="งานทั้งหมด" value={monthEvents.length} />
            <SummaryRow label="งานวง" value={monthEvents.filter(e=>e.status==='งานวง').length} />
            <SummaryRow label="จ้างแทน" value={monthEvents.filter(e=>e.status==='จ้างคนแทน').length} />
            <SummaryRow label="ติดคอนเสิร์ต" value={monthEvents.filter(e=>e.status==='ติดคอนเสิร์ต').length} />
            <div className="border-t border-line mt-3 pt-3">
              <SummaryRow label="รายรับรวม" value={`฿${monthEvents.reduce((s,e)=>s+Number(e.fee||0),0).toLocaleString('th-TH')}`} bold />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, bold }: any) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-[13px] text-ink-mute">{label}</span>
      <span className={clsx('num text-[13px]', bold ? 'font-bold text-ink' : 'font-semibold text-ink')}>{value}</span>
    </div>
  );
}
