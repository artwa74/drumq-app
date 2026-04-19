'use client';
import Link from 'next/link';
import { ArrowUpRight, Calendar, Wallet, CheckCircle2, TrendingUp, AlertCircle, Plus, Sparkles } from 'lucide-react';
import EventCard from '@/components/EventCard';
import { useDB, finalSub, finalStart, finalEnd } from '@/lib/store';
import { todayISO, dayOfWeek } from '@/lib/date';
import { useMemo } from 'react';
import clsx from 'clsx';

export default function HomePage() {
  const db = useDB();
  const today = todayISO();

  const m = useMemo(() => {
    const nowDate = new Date();
    const ym = `${nowDate.getFullYear()}-${String(nowDate.getMonth()+1).padStart(2,'0')}`;
    const unpaid = db.events.filter(e => !e.paid);
    const upcoming = db.events.filter(e => e.date >= today).sort((a,b) => a.date.localeCompare(b.date));
    const thisMonth = db.events.filter(e => e.date.startsWith(ym));
    const paidMonth = thisMonth.filter(e => e.paid).reduce((s,e)=>s+Number(e.fee||0),0);
    const totalMonth = thisMonth.reduce((s,e)=>s+Number(e.fee||0),0);
    const owed: Record<string, number> = {};
    unpaid.filter(e => e.status === 'จ้างคนแทน').forEach(e => {
      const n = finalSub(db, e); if (!n) return;
      owed[n] = (owed[n]||0) + Number(e.fee||0);
    });
    return {
      todays: upcoming.filter(e => e.date === today),
      upcoming: upcoming.filter(e => e.date !== today),
      unpaidTotal: unpaid.reduce((s,e) => s+Number(e.fee||0), 0),
      unpaidCount: unpaid.length,
      paidMonth, totalMonth, monthCount: thisMonth.length,
      topOwed: Object.entries(owed).sort((a,b)=>b[1]-a[1]).slice(0,3),
    };
  }, [db, today]);

  const nowDate = new Date();

  return (
    <div>
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="text-[12px] text-ink-mute mb-1.5">
            {dayOfWeek(today)} · {nowDate.toLocaleDateString('th-TH',{day:'numeric',month:'long',year:'numeric'})}
          </div>
          <h1 className="font-display text-[32px] lg:text-[36px] font-bold tracking-[-0.025em] leading-none">
            Overview
          </h1>
        </div>
        <Link href="/events/new" className="btn-brand hidden lg:inline-flex">
          <Plus size={15}/> เพิ่มงาน
        </Link>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <KPI icon={Calendar} label="งานวันนี้" value={m.todays.length} sub={m.todays[0]?.venueName || 'ไม่มีงาน'} invert />
        <KPI icon={AlertCircle} label="ค้างจ่าย" value={`฿${m.unpaidTotal.toLocaleString('th-TH')}`} sub={`${m.unpaidCount} รายการ`} tone="red" />
        <KPI icon={CheckCircle2} label="จ่ายเดือนนี้" value={`฿${m.paidMonth.toLocaleString('th-TH')}`} sub={`จาก ฿${m.totalMonth.toLocaleString('th-TH')}`} />
        <KPI icon={TrendingUp} label="งานทั้งเดือน" value={m.monthCount} sub="รวมทุกสถานะ" />
      </div>

      {/* Split */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div>
          {/* Today */}
          {m.todays.length > 0
            ? <TodayCard ev={m.todays[0]} extra={m.todays.length-1} sub={finalSub(db, m.todays[0])} start={finalStart(db, m.todays[0])} end={finalEnd(db, m.todays[0])} />
            : <NoToday />}

          {/* Upcoming */}
          <div className="flex items-center justify-between mt-8 mb-3">
            <h2 className="font-display text-[18px] font-bold tracking-tight">งานที่จะถึง</h2>
            {m.upcoming.length > 0 && (
              <Link href="/calendar" className="text-brand text-[13px] font-medium inline-flex items-center gap-0.5 hover:gap-1 transition-all">
                ดูทั้งหมด <ArrowUpRight size={13}/>
              </Link>
            )}
          </div>

          {m.upcoming.length === 0 ? (
            <div className="border border-line border-dashed rounded-xl py-10 text-center text-ink-dim text-[13px]">
              ไม่มีคิวในอนาคต
            </div>
          ) : (
            <div className="space-y-2">
              {m.upcoming.slice(0, 8).map(e => (
                <EventCard key={e.id} ev={{
                  ...e, fee: Number(e.fee || 0),
                  final_sub_name: finalSub(db, e),
                  final_start: finalStart(db, e),
                  final_end: finalEnd(db, e),
                } as any} />
              ))}
            </div>
          )}
        </div>

        {/* Right */}
        <aside className="space-y-4">
          <OwedWidget rows={m.topOwed} />
          <ShortcutWidget />
          <TipWidget />
        </aside>
      </div>
    </div>
  );
}

function KPI({ icon: Icon, label, value, sub, tone, invert }: any) {
  const isRed = tone === 'red';
  const isInvert = invert;
  return (
    <div className={clsx(
      'rounded-xl p-4 border transition',
      isInvert ? 'bg-ink border-ink text-white' :
      'bg-white border-line'
    )}>
      <div className={clsx(
        'flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider mb-3',
        isInvert ? 'text-white/70' : 'text-ink-mute'
      )}>
        <Icon size={13} strokeWidth={2}/> {label}
      </div>
      <div className={clsx(
        'num text-[24px] font-bold leading-none',
        isRed ? 'text-brand-hot' : isInvert ? 'text-white' : 'text-ink'
      )}>{value}</div>
      <div className={clsx(
        'text-[11.5px] mt-2 truncate',
        isInvert ? 'text-white/60' : 'text-ink-dim'
      )}>{sub}</div>
    </div>
  );
}

function TodayCard({ ev, extra, sub, start, end }: any) {
  return (
    <Link href={`/events/${ev.id}`} className="block bg-white border border-line rounded-xl p-5 hover:border-brand-hot/40 transition group">
      <div className="flex items-center gap-2 mb-3">
        <span className="relative flex w-2 h-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-brand-hot opacity-60 animate-ping"/>
          <span className="relative inline-flex w-2 h-2 bg-brand-hot rounded-full"/>
        </span>
        <span className="text-[10.5px] font-semibold text-brand-hot uppercase tracking-wider">วันนี้ · LIVE</span>
        {extra > 0 && <span className="text-[11px] text-ink-mute ml-auto">+{extra} รอบ</span>}
      </div>
      <div className="font-display text-[22px] lg:text-[26px] font-bold tracking-[-0.02em] leading-tight mb-2">{ev.venueName}</div>
      <div className="flex items-center gap-4 text-[13px] text-ink-mute">
        <span>{sub || 'ยังไม่ระบุ'}</span>
        <span className="num">{start}–{end}</span>
        <span className="num text-ink ml-auto font-semibold">฿{Number(ev.fee||0).toLocaleString('th-TH')}</span>
      </div>
    </Link>
  );
}

function NoToday() {
  return (
    <Link href="/events/new" className="block bg-white border border-line rounded-xl p-5 hover:border-brand/40 transition">
      <div className="text-[10.5px] font-semibold text-ink-mute uppercase tracking-wider mb-3">วันนี้</div>
      <div className="font-display text-[22px] font-bold tracking-[-0.02em] leading-tight mb-1">ไม่มีคิว</div>
      <div className="text-[13px] text-ink-mute">แตะเพื่อเพิ่มงาน</div>
    </Link>
  );
}

function OwedWidget({ rows }: { rows: [string, number][] }) {
  return (
    <div className="bg-white border border-line rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[11px] font-semibold text-ink-mute uppercase tracking-wider">ค้างจ่ายคนแทน</div>
        <Link href="/finance" className="text-[11px] text-brand font-medium">ดูทั้งหมด</Link>
      </div>
      {rows.length === 0 ? (
        <div className="text-center py-4 text-ink-dim text-[13px]">ไม่มีค้างจ่าย</div>
      ) : (
        <div className="space-y-2">
          {rows.map(([name, total]) => (
            <div key={name} className="flex items-center gap-2.5 py-1">
              <div className="avatar-init !w-8 !h-8 text-[11px]">{initials(name)}</div>
              <div className="flex-1 text-[13px] font-medium truncate">{name}</div>
              <div className="num text-[13px] font-semibold text-rose-600">฿{total.toLocaleString('th-TH')}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ShortcutWidget() {
  const items = [
    { href: '/settings/bulk', label: 'สร้างจากผัง', desc: 'กระจายงานทั้งเดือน' },
    { href: '/settings/venues', label: 'เพิ่มร้าน', desc: 'ร้านประจำ + ราคา' },
    { href: '/settings/musicians', label: 'เพิ่มคนแทน', desc: 'ชื่อ + LINE + บัญชี' },
  ];
  return (
    <div className="bg-white border border-line rounded-xl p-4">
      <div className="text-[11px] font-semibold text-ink-mute uppercase tracking-wider mb-3">ทางลัด</div>
      <div className="space-y-1">
        {items.map(a => (
          <Link key={a.href} href={a.href} className="flex items-center gap-3 p-2 rounded-md hover:bg-surface-2 transition group -mx-1">
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium truncate">{a.label}</div>
              <div className="text-[11px] text-ink-mute truncate">{a.desc}</div>
            </div>
            <ArrowUpRight size={13} className="text-ink-dim group-hover:text-brand transition"/>
          </Link>
        ))}
      </div>
    </div>
  );
}

function TipWidget() {
  return (
    <div className="bg-ink text-white rounded-xl p-4">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-brand-hot uppercase tracking-wider mb-2">
        <Sparkles size={12}/> PRO TIP
      </div>
      <div className="text-[13px] leading-relaxed text-white/90">
        ตั้ง <b className="text-white">ผังประจำ</b> ให้ครบก่อน แล้วใช้ <Link href="/settings/bulk" className="text-brand-hot font-semibold hover:underline">Bulk Generate</Link> สร้างงานทั้งเดือนใน 3 คลิก
      </div>
    </div>
  );
}

function initials(name: string) {
  const p = name.trim().split(/\s+/);
  return ((p[0]?.[0]||'')+(p[1]?.[0]||'')).toUpperCase();
}
