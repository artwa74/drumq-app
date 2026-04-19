'use client';
import Link from 'next/link';
import { useDB, actions } from '@/lib/store';
import { Home as HomeIcon, Users, ListChecks, Calendar, Wallet, Download, Upload, Trash2, ChevronRight } from 'lucide-react';

export default function SettingsPage() {
  const db = useDB();

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `drumq-${new Date().toISOString().slice(0,10)}.json`; a.click();
    URL.revokeObjectURL(url);
  };
  const importJSON = () => {
    const i = document.createElement('input'); i.type = 'file'; i.accept = '.json';
    i.onchange = async () => {
      const f = i.files?.[0]; if (!f) return;
      try { const data = JSON.parse(await f.text()); if (confirm('แทนที่ข้อมูลปัจจุบัน?')) actions.importAll(data); }
      catch { alert('ไฟล์ไม่ถูกต้อง'); }
    };
    i.click();
  };
  const exportICS = () => {
    const pad = (n: number) => String(n).padStart(2, '0');
    const dt = (d: string, t: string) => d.replace(/-/g,'') + 'T' + ((t||'20:00').replace(':','')) + '00';
    const now = new Date();
    const stamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth()+1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;
    const esc = (s: string) => (s||'').replace(/[,;\\]/g,'\\$&').replace(/\n/g,'\\n');
    const lines = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//DrumQ//TH','CALSCALE:GREGORIAN'];
    db.events.forEach(ev => {
      const start = ev.actualStart || '20:00', end = ev.actualEnd || '22:00';
      lines.push('BEGIN:VEVENT',
        `UID:${ev.id}@drumq`, `DTSTAMP:${stamp}`,
        `DTSTART:${dt(ev.date,start)}`, `DTEND:${dt(ev.date,end)}`,
        `SUMMARY:${esc(ev.venueName+' — '+ev.status)}`,
        `LOCATION:${esc(ev.venueName)}`,
        'END:VEVENT');
    });
    lines.push('END:VCALENDAR');
    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `drumq-${new Date().toISOString().slice(0,10)}.ics`; a.click();
  };

  const Row = ({ href, onClick, icon: Icon, name, sub, danger }: any) => {
    const inner = (
      <>
        <div className={`icon-circle ${danger ? '!bg-rose-500/10 !border-rose-500/20 !text-rose-500' : ''}`}><Icon size={18}/></div>
        <div className="flex-1 min-w-0">
          <div className={`font-semibold ${danger ? 'text-rose-500' : ''}`}>{name}</div>
          <div className="text-xs text-ink-mute truncate">{sub}</div>
        </div>
        <ChevronRight size={18} className="text-ink-dim"/>
      </>
    );
    return href
      ? <Link href={href} className="list-row">{inner}</Link>
      : <button onClick={onClick} className="list-row w-full text-left">{inner}</button>;
  };

  return (
    <div className="pb-8">
      <div className="text-[12px] text-ink-mute mb-1.5">จัดการข้อมูลหลังบ้าน</div>
      <h1 className="display text-[36px] lg:text-[44px] leading-none mb-6">Set<span className="italic-serif text-brand-hot">tings</span></h1>

      <h3 className="text-[11px] font-bold text-ink-dim uppercase tracking-widest mb-2">ข้อมูลหลัก</h3>
      <Row href="/settings/venues" icon={HomeIcon} name="ร้าน" sub={`${db.venues.length} ร้าน`} />
      <Row href="/settings/musicians" icon={Users} name="นักดนตรี" sub={`${db.musicians.length} คน · คนแทน/เบอร์/บัญชี`} />
      <Row href="/settings/roster" icon={ListChecks} name="ผังคนแทนประจำ" sub={`${db.roster.length} แถว · ร้าน × วัน`} />

      <h3 className="text-[11px] font-bold text-ink-dim uppercase tracking-widest mt-6 mb-2">เครื่องมือ</h3>
      <Row href="/settings/bulk" icon={Calendar} name="สร้างงานจากผัง" sub="เลือกช่วงวัน → สร้างลงปฏิทินอัตโนมัติ" />
      <Row href="/finance" icon={Wallet} name="เช็คค่าจ้างคนแทน" sub="สรุปว่าค้างใครเท่าไหร่" />
      <Row onClick={exportICS} icon={Calendar} name="Sync Google Calendar" sub="Export .ics → import ได้ทุกปฏิทิน" />

      <h3 className="text-[11px] font-bold text-ink-dim uppercase tracking-widest mt-6 mb-2">ข้อมูล</h3>
      <Row onClick={exportJSON} icon={Download} name="Export ข้อมูล (JSON)" sub="สำรองข้อมูลทั้งหมด" />
      <Row onClick={importJSON} icon={Upload} name="Import ข้อมูล (JSON)" sub="กู้คืนจากไฟล์" />
      <Row onClick={() => { if (confirm('ลบข้อมูลทั้งหมด?')) actions.reset(); }} icon={Trash2} name="ล้างข้อมูลทั้งหมด" sub="ย้อนกลับไม่ได้" danger />
    </div>
  );
}
