'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useDB, actions, Venue } from '@/lib/store';
import { Home, ChevronRight, Trash2 } from 'lucide-react';

const empty: Omit<Venue,'id'> = { name: '', address: '', mapURL: '', contact: '', defaultFee: undefined };

export default function VenuesPage() {
  const db = useDB();
  const [editing, setEditing] = useState<Venue | 'new' | null>(null);

  if (editing !== null) {
    const v = editing === 'new' ? null : editing;
    return <Form initial={v} onSave={(data) => {
      if (v) actions.updateVenue(v.id, data); else actions.addVenue(data);
      setEditing(null);
    }} onDelete={v ? () => { if (confirm('ลบร้านนี้?')) { actions.removeVenue(v.id); setEditing(null); } } : undefined}
    onCancel={() => setEditing(null)} />;
  }

  return (
    <div className="pb-8">
      <Link href="/settings" className="text-ink-mute text-sm font-semibold">← กลับ</Link>
      <h1 className="font-display text-[28px] font-bold tracking-tight mt-2">ร้าน</h1>
      <button onClick={() => setEditing('new')} className="btn-brand w-full mt-5">+ เพิ่มร้านใหม่</button>
      <div className="mt-5">
        {db.venues.length === 0 ? <div className="text-center text-ink-dim py-10">ยังไม่มีร้าน</div>
          : db.venues.map(v => (
            <button key={v.id} onClick={() => setEditing(v)} className="list-row w-full text-left">
              <div className="icon-circle"><Home size={18}/></div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{v.name}</div>
                <div className="text-xs text-ink-mute truncate">{v.address || '—'}{v.defaultFee ? ` · ฿${v.defaultFee}/รอบ` : ''}</div>
              </div>
              <ChevronRight size={18} className="text-ink-dim"/>
            </button>
          ))}
      </div>
    </div>
  );
}

function Form({ initial, onSave, onDelete, onCancel }: {
  initial: Venue | null; onSave: (v: Omit<Venue,'id'>) => void; onDelete?: () => void; onCancel: () => void;
}) {
  const [f, setF] = useState<Omit<Venue,'id'>>(initial || empty);
  return (
    <div className="pb-8">
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-display text-[26px] font-bold tracking-tight">{initial ? 'แก้ไขร้าน' : 'เพิ่มร้าน'}</h1>
        <button onClick={onCancel} className="text-ink-mute text-sm font-semibold">ยกเลิก</button>
      </div>
      <L label="ชื่อร้าน"><input className="input" value={f.name} onChange={e => setF({...f, name: e.target.value})} /></L>
      <L label="ที่อยู่"><input className="input" value={f.address||''} onChange={e => setF({...f, address: e.target.value})} /></L>
      <L label="ราคาประจำ (บาท/รอบ)" hint="ใช้เติมอัตโนมัติเมื่อเพิ่มงาน">
        <input type="number" className="input" value={f.defaultFee||''} onChange={e => setF({...f, defaultFee: e.target.value ? Number(e.target.value) : undefined})} placeholder="เช่น 1500" />
      </L>
      <L label="ลิงก์ Google Maps"><input className="input" value={f.mapURL||''} onChange={e => setF({...f, mapURL: e.target.value})} placeholder="https://maps.app.goo.gl/..." /></L>
      <L label="ผู้ติดต่อ"><input className="input" value={f.contact||''} onChange={e => setF({...f, contact: e.target.value})} /></L>
      <button onClick={() => f.name && onSave(f)} className="btn-brand w-full mt-2">บันทึก</button>
      {onDelete && <button onClick={onDelete} className="mt-3 w-full py-3.5 rounded-2xl border border-rose-500/30 bg-rose-500/5 text-rose-500 font-semibold flex items-center justify-center gap-2"><Trash2 size={16}/> ลบ</button>}
    </div>
  );
}

const L = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <div className="mb-4">
    <label className="block text-xs font-semibold text-ink-mute mb-2">{label}</label>
    {children}
    {hint && <div className="text-[11px] text-ink-dim mt-1.5">{hint}</div>}
  </div>
);
