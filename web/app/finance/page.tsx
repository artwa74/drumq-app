'use client';
import { useMemo, useState } from 'react';
import { useDB, finalSub, finalStart, finalEnd } from '@/lib/store';
import EventCard from '@/components/EventCard';
import StatCard from '@/components/StatCard';
import { Wallet, CheckCircle2, Users } from 'lucide-react';

const money = (n: any) => Number(n || 0).toLocaleString('th-TH');

export default function FinancePage() {
  const db = useDB();
  const [owedOpen, setOwedOpen] = useState(false);

  const { unpaid, paid, unpaidTotal, paidTotal } = useMemo(() => {
    const unpaid = db.events.filter(e => !e.paid).sort((a,b) => a.date.localeCompare(b.date));
    const paid = db.events.filter(e => e.paid).sort((a,b) => b.date.localeCompare(a.date));
    return {
      unpaid, paid,
      unpaidTotal: unpaid.reduce((s,e) => s+Number(e.fee||0), 0),
      paidTotal: paid.reduce((s,e) => s+Number(e.fee||0), 0),
    };
  }, [db.events]);

  const owedByMusician = useMemo(() => {
    const byName: Record<string, { name: string; total: number; events: typeof unpaid }> = {};
    unpaid.filter(e => e.status === 'จ้างคนแทน').forEach(e => {
      const n = finalSub(db, e); if (!n) return;
      if (!byName[n]) byName[n] = { name: n, total: 0, events: [] };
      byName[n].total += Number(e.fee || 0);
      byName[n].events.push(e);
    });
    return Object.values(byName).sort((a,b) => b.total - a.total);
  }, [db, unpaid]);

  const toCard = (e: any) => ({ ...e, fee: Number(e.fee||0), final_sub_name: finalSub(db, e), final_start: finalStart(db, e), final_end: finalEnd(db, e) });

  return (
    <div className="pb-8">
      <h1 className="font-display text-[30px] font-bold tracking-[-0.035em]">การเงิน</h1>
      <p className="text-ink-mute text-sm mt-1 mb-5">ติดตามยอดจ่าย/ค้างจ่าย</p>

      <div className="grid grid-cols-[1.25fr_1fr] gap-3 mb-3">
        <div className="relative overflow-hidden rounded-3xl p-5 text-white shadow-glow"
             style={{ background: 'linear-gradient(135deg,#ff4d6d 0%,#ff2d55 100%)' }}>
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.22),transparent_70%)]" />
          <div className="flex items-center gap-1.5 text-xs font-semibold mb-2.5 text-white/90">
            <Wallet size={14}/> ค้างจ่าย
          </div>
          <div className="num text-[34px] font-bold leading-none">฿{money(unpaidTotal)}</div>
          <div className="text-[11px] mt-2 text-white/80 font-medium">{unpaid.length} รายการ</div>
        </div>
        <StatCard icon={CheckCircle2} label="จ่ายแล้ว" value={`฿${money(paidTotal)}`} subLabel={`${paid.length} รายการ`} accentColor="#12b981" />
      </div>

      <button onClick={() => setOwedOpen(!owedOpen)} className="btn-ghost w-full mb-5">
        <Users size={16}/> {owedOpen ? 'ซ่อน' : 'เช็ค'}ค่าจ้างแยกตามคนแทน
      </button>

      {owedOpen && (
        <div className="mb-6">
          {owedByMusician.length === 0 ? (
            <div className="text-center text-ink-dim py-6">ไม่มีค้างจ่ายคนแทน 🎉</div>
          ) : owedByMusician.map(row => {
            const m = db.musicians.find(x => x.name === row.name);
            return (
              <div key={row.name} className="card-soft p-4 mb-2.5">
                <div className="flex items-center gap-3 mb-2.5">
                  {m?.photo
                    ? <img src={m.photo} alt={row.name} className="flex-none w-10 h-10 rounded-full object-cover border border-line"/>
                    : <div className="avatar-init !rounded-full">{initials(row.name)}</div>}
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-base">{row.name}</div>
                    <div className="text-xs text-ink-mute truncate">{row.events.length} งาน · {m?.bankName||''} {m?.bankAccount||''}</div>
                  </div>
                  <div className="num text-xl font-bold text-rose-500">฿{money(row.total)}</div>
                </div>
                <div className="border-t border-line pt-2 space-y-1">
                  {row.events.map(e => (
                    <div key={e.id} className="flex justify-between text-[13px]">
                      <span className="text-ink-mute">{new Date(e.date).getDate()}/{new Date(e.date).getMonth()+1} · {e.venueName}</span>
                      <span className="num font-semibold">฿{money(e.fee)}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <h3 className="text-[11px] font-bold text-ink-dim uppercase tracking-widest mb-2">❌ ค้างจ่าย</h3>
      {unpaid.length === 0 ? <div className="text-center text-ink-dim py-6 text-sm">ไม่มีรายการค้างจ่าย 🎉</div>
        : unpaid.map(e => <EventCard key={e.id} ev={toCard(e)} />)}

      <h3 className="text-[11px] font-bold text-ink-dim uppercase tracking-widest mt-5 mb-2">✅ จ่ายแล้ว</h3>
      {paid.length === 0 ? <div className="text-center text-ink-dim py-6 text-sm">—</div>
        : paid.map(e => <EventCard key={e.id} ev={toCard(e)} />)}
    </div>
  );
}

function initials(name: string) {
  const p = name.trim().split(/\s+/);
  return ((p[0]?.[0] || '') + (p[1]?.[0] || '')).toUpperCase();
}
