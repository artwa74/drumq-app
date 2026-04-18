'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useDB, actions, RosterRow, DayOfWeek, DAYS_TH } from '@/lib/store';
import { ChevronRight, Trash2 } from 'lucide-react';

const empty: Omit<RosterRow,'id'> = { venueName: '', dayOfWeek: 'จันทร์', regularSub: '', standardStart: '', standardEnd: '' };

export default function RosterPage() {
  const db = useDB();
  const [editing, setEditing] = useState<RosterRow | 'new' | null>(null);

  if (editing !== null) {
    const r = editing === 'new' ? null : editing;
    return <Form initial={r} db={db} onSave={(data) => {
      if (r) actions.updateRoster(r.id, data); else actions.addRoster(data);
      setEditing(null);
    }} onDelete={r ? () => { if (confirm('ลบ?')) { actions.removeRoster(r.id); setEditing(null); } } : undefined}
    onCancel={() => setEditing(null)} />;
  }

  return (
    <div className="pb-8">
      <Link href="/settings" className="text-ink-mute text-sm font-semibold">← กลับ</Link>
      <h1 className="font-display text-[28px] font-bold tracking-tight mt-2">ผังคนแทนประจำ</h1>
      <p className="text-ink-mute text-sm mt-1 mb-4">แต่ละวันเล่นร้านไหนบ้าง (หลายรอบ/วันได้)</p>
      <button onClick={() => setEditing('new')} className="btn-brand w-full">+ เพิ่มรอบ</button>

      <div className="mt-5">
        {db.roster.length === 0 ? <div className="text-center text-ink-dim py-10">ยังไม่มีข้อมูล</div>
          : DAYS_TH.map(day => {
            const rows = db.roster.filter(r => r.dayOfWeek === day)
                                  .sort((a,b) => (a.standardStart||'').localeCompare(b.standardStart||''));
            if (!rows.length) return null;
            return (
              <div key={day}>
                <h3 className="text-[11px] font-bold text-ink-dim uppercase tracking-widest mt-5 mb-2">
                  {day} · {rows.length} รอบ
                </h3>
                {rows.map(r => (
                  <button key={r.id} onClick={() => setEditing(r)} className="list-row w-full text-left">
                    <div className="icon-circle">🏠</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold">{r.venueName}</div>
                      <div className="text-xs text-ink-mute truncate">
                        {r.standardStart||'?'}–{r.standardEnd||'?'} · {r.regularSub || 'ยังไม่ระบุคนแทน'}
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-ink-dim"/>
                  </button>
                ))}
              </div>
            );
          })}
      </div>
    </div>
  );
}

function Form({ initial, db, onSave, onDelete, onCancel }: {
  initial: RosterRow | null; db: any;
  onSave: (v: Omit<RosterRow,'id'>) => void; onDelete?: () => void; onCancel: () => void;
}) {
  const [f, setF] = useState<Omit<RosterRow,'id'>>(initial || empty);
  const up = (p: Partial<Omit<RosterRow,'id'>>) => setF({ ...f, ...p });
  return (
    <div className="pb-8">
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-display text-[26px] font-bold tracking-tight">{initial ? 'แก้ไขผัง' : 'เพิ่มผัง'}</h1>
        <button onClick={onCancel} className="text-ink-mute text-sm font-semibold">ยกเลิก</button>
      </div>
      <L label="ร้าน">
        <select className="input" value={f.venueName} onChange={e => up({venueName: e.target.value})}>
          <option value="">-- เลือก --</option>
          {db.venues.map((v: any) => <option key={v.id}>{v.name}</option>)}
        </select>
      </L>
      <L label="วันในสัปดาห์">
        <select className="input" value={f.dayOfWeek} onChange={e => up({dayOfWeek: e.target.value as DayOfWeek})}>
          {DAYS_TH.map(d => <option key={d}>{d}</option>)}
        </select>
      </L>
      <L label="คนแทนประจำ">
        <select className="input" value={f.regularSub} onChange={e => up({regularSub: e.target.value})}>
          <option value="">-- เลือก --</option>
          {db.musicians.map((m: any) => <option key={m.id}>{m.name}</option>)}
        </select>
      </L>
      <div className="grid grid-cols-2 gap-3">
        <L label="เวลาเริ่มปกติ"><input type="time" className="input" value={f.standardStart} onChange={e => up({standardStart: e.target.value})} /></L>
        <L label="เวลาเลิกปกติ"><input type="time" className="input" value={f.standardEnd} onChange={e => up({standardEnd: e.target.value})} /></L>
      </div>
      <button onClick={() => f.venueName && f.dayOfWeek && onSave(f)} className="btn-brand w-full mt-2">บันทึก</button>
      {onDelete && <button onClick={onDelete} className="mt-3 w-full py-3.5 rounded-2xl border border-rose-500/30 bg-rose-500/5 text-rose-500 font-semibold flex items-center justify-center gap-2"><Trash2 size={16}/> ลบ</button>}
    </div>
  );
}

const L = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="mb-4">
    <label className="block text-xs font-semibold text-ink-mute mb-2">{label}</label>
    {children}
  </div>
);
