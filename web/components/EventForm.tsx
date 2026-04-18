'use client';
import { useState, useMemo } from 'react';
import clsx from 'clsx';
import { DB, Event, EventStatus, rosterLookup } from '@/lib/store';
import { dayOfWeek } from '@/lib/date';
import { Trash2 } from 'lucide-react';

type FormData = Omit<Event, 'id'> & { id?: string };

export default function EventForm({
  title, initial, db, onSave, onDelete, onCancel,
}: {
  title: string;
  initial: FormData;
  db: DB;
  onSave: (data: FormData) => void;
  onDelete?: () => void;
  onCancel: () => void;
}) {
  const [f, setF] = useState<FormData>(initial);
  const set = (patch: Partial<FormData>) => setF(prev => ({ ...prev, ...patch }));

  const roster = useMemo(() => rosterLookup(db, f.venueName, f.date), [db, f.venueName, f.date]);
  const clashes = useMemo(
    () => db.events.filter(x => x.date === f.date && x.id !== initial.id),
    [db.events, f.date, initial.id]
  );
  const concertClash = clashes.find(x => x.status === 'ติดคอนเสิร์ต');
  const venue = db.venues.find(v => v.name === f.venueName);

  return (
    <div className="pb-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-[26px] font-bold tracking-tight">{title}</h1>
        <button onClick={onCancel} className="text-ink-mute text-sm font-semibold">ยกเลิก</button>
      </div>

      <Field label="📅 วันที่"
             hint={
               f.date
                 ? `วัน${dayOfWeek(f.date)}${concertClash ? ` · ⚠️ มีคอนเสิร์ตที่ ${concertClash.venueName}` : clashes.length ? ` · มีงานแล้ว ${clashes.length} รอบ` : ''}`
                 : undefined
             }>
        <input type="date" value={f.date} onChange={e => set({ date: e.target.value })} className="input" />
      </Field>

      <Field label="🏠 ร้าน">
        <input list="venues" value={f.venueName} onChange={e => set({ venueName: e.target.value })}
               placeholder="พิมพ์หรือเลือกร้าน" className="input" />
        <datalist id="venues">
          {db.venues.map(v => <option key={v.id} value={v.name} />)}
        </datalist>
      </Field>

      <Field label="🎯 ประเภทงาน">
        <div className="flex gap-2 flex-wrap">
          {(['งานวง','จ้างคนแทน','ติดคอนเสิร์ต'] as EventStatus[]).map(s => (
            <button key={s} type="button"
                    onClick={() => set({ status: s })}
                    className={clsx('chip', f.status === s && 'chip-active')}>
              {s === 'งานวง' ? '🥁 งานวง' : s === 'จ้างคนแทน' ? '👤 จ้างแทน' : '🎤 ติดคอนเสิร์ต'}
            </button>
          ))}
        </div>
      </Field>

      <Field label="👤 คนแทน"
             inlineHint={roster?.regularSub ? `ประจำ: ${roster.regularSub}` : undefined}>
        <input list="musicians" value={f.actualSub || ''} onChange={e => set({ actualSub: e.target.value })}
               placeholder="เว้นว่าง = ใช้คนประจำ" className="input" />
        <datalist id="musicians">
          {db.musicians.map(m => <option key={m.id} value={m.name} />)}
        </datalist>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="🕐 เริ่ม" inlineHint={roster?.standardStart ? `ปกติ ${roster.standardStart}` : undefined}>
          <input type="time" value={f.actualStart || ''} onChange={e => set({ actualStart: e.target.value })} className="input" />
        </Field>
        <Field label="🕐 เลิก" inlineHint={roster?.standardEnd ? `ปกติ ${roster.standardEnd}` : undefined}>
          <input type="time" value={f.actualEnd || ''} onChange={e => set({ actualEnd: e.target.value })} className="input" />
        </Field>
      </div>

      <Field label="💵 ค่าจ้าง (บาท)">
        <input type="number" inputMode="numeric" value={f.fee?.toString() || ''}
               onChange={e => set({ fee: e.target.value })}
               placeholder={venue?.defaultFee ? `ราคาประจำ: ${venue.defaultFee}` : 'เช่น 1500'} className="input" />
      </Field>

      <Field label="📝 หมายเหตุ">
        <textarea value={f.notes || ''} onChange={e => set({ notes: e.target.value })} className="input min-h-[80px]" />
      </Field>

      <button onClick={() => { if (!f.date || !f.venueName) return; onSave(f); }} className="btn-brand w-full mt-2">
        บันทึกงาน
      </button>
      {onDelete && (
        <button onClick={onDelete} className="mt-3 w-full py-3.5 rounded-2xl border border-rose-500/30 bg-rose-500/5 text-rose-500 font-semibold flex items-center justify-center gap-2">
          <Trash2 size={16}/> ลบงานนี้
        </button>
      )}
    </div>
  );
}

function Field({ label, hint, inlineHint, children }: { label: string; hint?: string; inlineHint?: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="flex items-center justify-between text-xs font-semibold text-ink-mute mb-2">
        <span>{label}</span>
        {inlineHint && <span className="text-brand text-[11px]">({inlineHint})</span>}
      </label>
      {children}
      {hint && <div className="text-[11px] text-ink-dim mt-1.5">{hint}</div>}
    </div>
  );
}
