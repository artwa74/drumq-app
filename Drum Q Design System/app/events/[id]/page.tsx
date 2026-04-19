'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDB, actions, finalSub, finalStart, finalEnd } from '@/lib/store';
import { dayOfWeek } from '@/lib/date';
import { MessageCircle, Phone, MapPin, Copy, Calendar, Upload, Edit3 } from 'lucide-react';
import clsx from 'clsx';
import EventForm from '@/components/EventForm';

const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()+543}`;
};
const fmtDateShort = (iso: string) => {
  const d = new Date(iso);
  return `${d.getDate()} ${['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'][d.getMonth()]}`;
};
const money = (n: any) => Number(n || 0).toLocaleString('th-TH');

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const db = useDB();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const ev = db.events.find(e => e.id === params.id);

  if (!ev) return <div className="py-16 text-center text-ink-dim">ไม่พบงาน</div>;

  const sub = finalSub(db, ev), start = finalStart(db, ev), end = finalEnd(db, ev);
  const musician = db.musicians.find(m => m.name === sub);
  const venue = db.venues.find(v => v.name === ev.venueName);
  const chatMsg = `หวัดดีครับพี่ ${sub} วันที่ ${fmtDate(ev.date)} (${dayOfWeek(ev.date)}) เวลา ${start}-${end} ว่างแทนที่ร้าน ${ev.venueName} มั้ยครับ?`;
  const slipMsg = `โอนค่าจ้างวันที่ ${fmtDate(ev.date)} ร้าน ${ev.venueName} จำนวน ${money(ev.fee)} บาท เรียบร้อยครับ 🙏`;

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 1800); };

  const gcalURL = () => {
    const fmt = (d: string, t: string) => d.replace(/-/g,'') + 'T' + ((t || '20:00').replace(':','')) + '00';
    const title = encodeURIComponent(`${ev.venueName} — ${ev.status}${sub ? ' ('+sub+')' : ''}`);
    const dates = `${fmt(ev.date, start || '20:00')}/${fmt(ev.date, end || '22:00')}`;
    const details = encodeURIComponent(`คนแทน: ${sub||'—'}\nค่าจ้าง: ${money(ev.fee)} บาท\n${ev.notes||''}`);
    const loc = encodeURIComponent(ev.venueName);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${loc}`;
  };

  if (editing) {
    return (
      <EventForm title="แก้ไขงาน" initial={ev} db={db}
        onSave={(data) => { actions.updateEvent(ev.id, data); setEditing(false); }}
        onDelete={() => { if (confirm('ลบงานนี้?')) { actions.removeEvent(ev.id); router.push('/'); } }}
        onCancel={() => setEditing(false)} />
    );
  }

  const uploadSlip = (f: File) => {
    const r = new FileReader();
    r.onload = () => { actions.updateEvent(ev.id, { slip: r.result as string }); showToast('อัปโหลดแล้ว'); };
    r.readAsDataURL(f);
  };

  return (
    <div className="pb-8 relative">
      <button onClick={() => router.back()} className="text-ink-mute text-sm font-semibold mb-4">← กลับ</button>

      <div className="relative overflow-hidden rounded-3xl p-6 mb-4 bg-brand-grad text-white shadow-glow">
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full
                        bg-[radial-gradient(circle,rgba(255,255,255,0.2),transparent_70%)]" />
        <div className="text-xs font-bold uppercase tracking-[0.12em] opacity-90 mb-1.5">
          {fmtDateShort(ev.date)} · {dayOfWeek(ev.date)}
        </div>
        <div className="font-display text-[30px] font-bold tracking-[-0.035em] leading-tight">{ev.venueName}</div>
        <div className="mt-3 text-sm opacity-90">{ev.status} · ฿{money(ev.fee)}</div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <Info k="คนแทน" v={sub || '—'} />
        <Info k="ค่าจ้าง" v={`฿${money(ev.fee)}`} />
        <Info k="เริ่ม" v={start || '—'} />
        <Info k="เลิก" v={end || '—'} />
        {ev.notes && <Info k="หมายเหตุ" v={ev.notes} full />}
      </div>

      <div className="flex gap-2 mb-3 flex-wrap">
        {musician?.lineURL && (
          <BtnSmall onClick={() => { navigator.clipboard.writeText(chatMsg); showToast('คัดลอก - เปิด LINE'); setTimeout(() => window.open(musician.lineURL, '_blank'), 300); }}>
            <MessageCircle size={16}/> LINE
          </BtnSmall>
        )}
        {musician?.messengerURL && (
          <BtnSmall onClick={() => { navigator.clipboard.writeText(chatMsg); setTimeout(() => window.open(musician.messengerURL, '_blank'), 300); }}>
            <MessageCircle size={16}/> Messenger
          </BtnSmall>
        )}
        {musician?.phone && (
          <BtnSmall ghost onClick={() => window.location.href = `tel:${musician.phone}`}>
            <Phone size={16}/> โทร
          </BtnSmall>
        )}
      </div>

      <button onClick={() => { navigator.clipboard.writeText(chatMsg); showToast('คัดลอกข้อความแล้ว'); }} className="btn-ghost w-full mb-2">
        <Copy size={16}/> คัดลอกข้อความทักแชท
      </button>
      {venue?.mapURL && (
        <a href={venue.mapURL} target="_blank" className="btn-ghost w-full mb-2"><MapPin size={16}/> เปิดแผนที่ร้าน</a>
      )}
      <a href={gcalURL()} target="_blank" className="btn-ghost w-full mb-2"><Calendar size={16}/> เพิ่มใน Google Calendar</a>

      <h3 className="text-[11px] font-bold text-ink-dim uppercase tracking-widest mt-6 mb-2">สถานะการจ่าย</h3>
      <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-line shadow-soft mb-3">
        <div>
          <div className="font-semibold">โอนเงินให้คนแทนแล้ว</div>
          <div className="text-xs text-ink-mute mt-0.5">
            {musician?.bankAccount ? `${musician.bankName || ''} ${musician.bankAccount}` : 'ยังไม่มีข้อมูลบัญชี'}
          </div>
        </div>
        <button onClick={() => actions.updateEvent(ev.id, { paid: !ev.paid })}
                className={clsx('relative w-[52px] h-[30px] rounded-full transition',
                  ev.paid ? 'bg-emerald-500' : 'bg-surface-3')}>
          <span className={clsx('absolute top-[3px] w-6 h-6 rounded-full bg-white shadow transition-all',
            ev.paid ? 'left-[25px]' : 'left-[3px]')} />
        </button>
      </div>

      <h3 className="text-[11px] font-bold text-ink-dim uppercase tracking-widest mb-2">หลักฐานการโอน</h3>
      {ev.slip && <img src={ev.slip} className="w-full rounded-2xl border border-line mb-2" />}
      <label className="flex items-center justify-center gap-2 border-2 border-dashed border-line-strong rounded-2xl py-5 text-ink-mute font-semibold text-sm cursor-pointer">
        <Upload size={16}/>
        {ev.slip ? 'แตะเพื่อเปลี่ยนรูปสลิป' : 'อัปโหลดรูปสลิป'}
        <input type="file" accept="image/*" className="hidden"
               onChange={e => e.target.files?.[0] && uploadSlip(e.target.files[0])} />
      </label>
      {ev.slip && musician?.lineURL && (
        <button onClick={() => { navigator.clipboard.writeText(slipMsg); setTimeout(() => window.open(musician.lineURL, '_blank'), 300); }}
                className="btn-brand w-full mt-3">
          <MessageCircle size={16}/> ส่งสลิปทาง LINE
        </button>
      )}

      <button onClick={() => setEditing(true)} className="btn-ghost w-full mt-5">
        <Edit3 size={16}/> แก้ไขงาน
      </button>

      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-black/90 text-white px-5 py-3 rounded-full text-sm font-semibold shadow-float z-[300]">
          {toast}
        </div>
      )}
    </div>
  );
}

function Info({ k, v, full }: { k: string; v: string; full?: boolean }) {
  return (
    <div className={clsx('card-soft p-3.5', full && 'col-span-2')}>
      <div className="text-[11px] font-semibold text-ink-dim uppercase tracking-wider mb-1.5">{k}</div>
      <div className="font-display text-[17px] font-semibold tracking-[-0.02em]">{v}</div>
    </div>
  );
}
function BtnSmall({ children, onClick, ghost }: { children: React.ReactNode; onClick: () => void; ghost?: boolean }) {
  return (
    <button onClick={onClick} className={clsx(
      'flex-1 min-w-[100px] px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition active:scale-95',
      ghost ? 'bg-surface-2 border border-line text-ink' : 'bg-brand-grad text-white shadow-glow',
    )}>{children}</button>
  );
}
