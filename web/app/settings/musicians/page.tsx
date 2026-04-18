'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { useDB, actions, Musician } from '@/lib/store';
import { ChevronRight, Trash2, Camera, X } from 'lucide-react';

const empty: Omit<Musician,'id'> = { name: '', phone: '', bankName: '', bankAccount: '', lineURL: '', messengerURL: '', notes: '', photo: '' };
const initials = (n: string) => { const p = n.trim().split(/\s+/); return ((p[0]?.[0]||'')+(p[1]?.[0]||'')).toUpperCase(); };

export default function MusiciansPage() {
  const db = useDB();
  const [editing, setEditing] = useState<Musician | 'new' | null>(null);

  if (editing !== null) {
    const m = editing === 'new' ? null : editing;
    return <Form initial={m} onSave={(data) => {
      if (m) actions.updateMusician(m.id, data); else actions.addMusician(data);
      setEditing(null);
    }} onDelete={m ? () => { if (confirm('ลบ?')) { actions.removeMusician(m.id); setEditing(null); } } : undefined}
    onCancel={() => setEditing(null)} />;
  }

  return (
    <div className="pb-8">
      <Link href="/settings" className="text-ink-mute text-sm font-semibold">← กลับ</Link>
      <h1 className="font-display text-[28px] font-bold tracking-tight mt-2">นักดนตรี</h1>
      <button onClick={() => setEditing('new')} className="btn-brand w-full mt-5">+ เพิ่มนักดนตรี</button>
      <div className="mt-5">
        {db.musicians.length === 0 ? <div className="text-center text-ink-dim py-10">ยังไม่มีรายชื่อ</div>
          : db.musicians.map(m => (
            <button key={m.id} onClick={() => setEditing(m)} className="list-row w-full text-left">
              {m.photo
                ? <img src={m.photo} alt={m.name} className="flex-none w-10 h-10 rounded-lg object-cover border border-line"/>
                : <div className="avatar-init">{initials(m.name)}</div>}
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{m.name}</div>
                <div className="text-xs text-ink-mute truncate">{m.phone || 'ไม่มีเบอร์'} · {m.bankName||''} {m.bankAccount||''}</div>
              </div>
              <ChevronRight size={18} className="text-ink-dim"/>
            </button>
          ))}
      </div>
    </div>
  );
}

function Form({ initial, onSave, onDelete, onCancel }: {
  initial: Musician | null; onSave: (v: Omit<Musician,'id'>) => void; onDelete?: () => void; onCancel: () => void;
}) {
  const [f, setF] = useState<Omit<Musician,'id'>>(initial || empty);
  const up = (p: Partial<Omit<Musician,'id'>>) => setF({ ...f, ...p });
  const fileRef = useRef<HTMLInputElement>(null);

  const onPickPhoto = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => up({ photo: reader.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div className="pb-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-[26px] font-bold tracking-tight">{initial ? 'แก้ไข' : 'เพิ่มนักดนตรี'}</h1>
        <button onClick={onCancel} className="text-ink-mute text-sm font-semibold">ยกเลิก</button>
      </div>

      {/* Photo picker */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative group">
          {f.photo ? (
            <img src={f.photo} alt="" className="w-20 h-20 rounded-xl object-cover border border-line" />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-surface-2 border border-line grid place-items-center text-ink-dim">
              <Camera size={22}/>
            </div>
          )}
          {f.photo && (
            <button onClick={() => up({ photo: '' })}
                    className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-brand-hot text-white grid place-items-center shadow">
              <X size={12} strokeWidth={2.5}/>
            </button>
          )}
        </div>
        <div className="flex-1">
          <div className="text-[13px] font-semibold mb-0.5">รูปโปรไฟล์</div>
          <div className="text-[11.5px] text-ink-mute mb-2">JPG, PNG · สูงสุด ~2MB</div>
          <button onClick={() => fileRef.current?.click()} className="btn-outline !py-1.5 !px-3 !text-[12px]">
            {f.photo ? 'เปลี่ยนรูป' : 'อัปโหลด'}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
                 onChange={e => e.target.files?.[0] && onPickPhoto(e.target.files[0])} />
        </div>
      </div>

      <L label="ชื่อ"><input className="input" value={f.name} onChange={e => up({name: e.target.value})} /></L>
      <L label="เบอร์โทร"><input type="tel" className="input" value={f.phone||''} onChange={e => up({phone: e.target.value})} /></L>
      <div className="grid grid-cols-2 gap-3">
        <L label="ธนาคาร"><input className="input" value={f.bankName||''} onChange={e => up({bankName: e.target.value})} placeholder="SCB / KBANK..." /></L>
        <L label="เลขบัญชี"><input className="input" value={f.bankAccount||''} onChange={e => up({bankAccount: e.target.value})} /></L>
      </div>
      <L label="LINE URL"><input className="input" value={f.lineURL||''} onChange={e => up({lineURL: e.target.value})} placeholder="https://line.me/ti/p/~lineid" /></L>
      <L label="Messenger URL"><input className="input" value={f.messengerURL||''} onChange={e => up({messengerURL: e.target.value})} placeholder="https://m.me/username" /></L>
      <L label="หมายเหตุ"><textarea className="input min-h-[72px]" value={f.notes||''} onChange={e => up({notes: e.target.value})} /></L>
      <button onClick={() => f.name && onSave(f)} className="btn-brand w-full mt-2">บันทึก</button>
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
