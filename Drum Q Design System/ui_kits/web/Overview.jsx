function KPI({ icon, label, value, sub, tone, invert }) {
  const Icon = window[icon];
  const isRed = tone === 'red';
  const valColor = isRed ? '#e11d48' : invert ? '#fff' : '#0c0c10';
  return (
    <div style={{
      borderRadius: 12, padding: 16,
      background: invert ? '#0a0a0a' : '#fff',
      border: `1px solid ${invert ? '#0a0a0a' : '#e5e5e5'}`,
      color: invert ? '#fff' : '#0c0c10',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12, color: invert ? 'rgba(255,255,255,0.7)' : '#5a5a66' }}>
        <Icon size={13} strokeWidth={2}/> {label}
      </div>
      <div className="num" style={{ fontSize: 24, fontWeight: 700, lineHeight: 1, color: valColor }}>{value}</div>
      <div style={{ fontSize: 11.5, marginTop: 8, color: invert ? 'rgba(255,255,255,0.6)' : '#8e8e98' }}>{sub}</div>
    </div>
  );
}

const MONTHS = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];

function EventCard({ ev, onClick }) {
  const d = new Date(ev.date);
  const [hover, setHover] = useState(false);
  return (
    <a href="#" onClick={(e) => { e.preventDefault(); onClick && onClick(ev); }}
       onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
       style={{
         display: 'block', background: '#fff',
         border: `1px solid ${hover ? '#d4d4d4' : '#e5e5e5'}`,
         borderRadius: 12, padding: 16, transition: 'border-color 120ms', textDecoration: 'none', color: '#0c0c10',
       }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          flex: 'none', width: 48, height: 56, borderRadius: 8,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: ev.today ? '#0a0a0a' : '#fafafa',
          color: ev.today ? '#fff' : '#0c0c10',
        }}>
          <div className="num" style={{ fontSize: 18, fontWeight: 700, lineHeight: 1 }}>{d.getDate()}</div>
          <div style={{ fontSize: 9.5, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginTop: 4, color: ev.today ? 'rgba(255,255,255,0.85)' : '#8e8e98' }}>{MONTHS[d.getMonth()]}</div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{ev.venueName}</div>
            {ev.paid
              ? <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: '#0a0a0a', color: '#fff', fontWeight: 600 }}>PAID</span>
              : <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: '#e11d48', color: '#fff', fontWeight: 600 }}>UNPAID</span>}
          </div>
          <div style={{ display: 'flex', gap: 12, fontSize: 12.5, color: '#5a5a66' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><User size={12}/> {ev.sub || '—'}</span>
            <span className="num" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Clock size={12}/> {ev.start}–{ev.end}</span>
          </div>
        </div>
        <div className="num" style={{ fontSize: 15, fontWeight: 600 }}>฿{Number(ev.fee).toLocaleString('th-TH')}</div>
      </div>
    </a>
  );
}

function TodayCard({ ev, extra, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <a href="#" onClick={(e) => { e.preventDefault(); onClick && onClick(ev); }}
       onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
       style={{
         display: 'block', background: '#fff',
         border: `1px solid ${hover ? 'rgba(225,29,72,0.4)' : '#e5e5e5'}`,
         borderRadius: 12, padding: 20, transition: 'border-color 120ms', textDecoration: 'none', color: '#0c0c10',
       }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8 }}>
          <span style={{ position: 'absolute', inset: 0, borderRadius: 999, background: '#e11d48', opacity: 0.6, animation: 'ping 1.8s cubic-bezier(0,0,0.2,1) infinite' }}/>
          <span style={{ position: 'relative', width: 8, height: 8, background: '#e11d48', borderRadius: 999 }}/>
        </span>
        <span style={{ fontSize: 10.5, fontWeight: 600, color: '#e11d48', textTransform: 'uppercase', letterSpacing: '0.12em' }}>วันนี้ · LIVE</span>
        {extra > 0 && <span style={{ fontSize: 11, color: '#5a5a66', marginLeft: 'auto' }}>+{extra} รอบ</span>}
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 8 }}>{ev.venueName}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, color: '#5a5a66' }}>
        <span>{ev.sub || 'ยังไม่ระบุ'}</span>
        <span className="num">{ev.start}–{ev.end}</span>
        <span className="num" style={{ marginLeft: 'auto', color: '#0c0c10', fontWeight: 600 }}>฿{Number(ev.fee).toLocaleString('th-TH')}</span>
      </div>
    </a>
  );
}

function initials(name) {
  const p = name.trim().split(/\s+/);
  return ((p[0]?.[0]||'')+(p[1]?.[0]||'')).toUpperCase();
}

function OwedWidget({ rows, onSeeAll }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#5a5a66', textTransform: 'uppercase', letterSpacing: '0.12em' }}>ค้างจ่ายคนแทน</div>
        <a href="#" onClick={e => {e.preventDefault(); onSeeAll();}} style={{ fontSize: 11, color: '#0a0a0a', fontWeight: 500, textDecoration: 'none' }}>ดูทั้งหมด</a>
      </div>
      {rows.length === 0
        ? <div style={{ textAlign: 'center', padding: '16px 0', color: '#8e8e98', fontSize: 13 }}>ไม่มีค้างจ่าย 🎉</div>
        : <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {rows.map(([name, total]) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0' }}>
                <div style={{ width: 32, height: 32, borderRadius: 6, background: '#0a0a0a', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700 }}>{initials(name)}</div>
                <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{name}</div>
                <div className="num" style={{ fontSize: 13, fontWeight: 600, color: '#e11d48' }}>฿{total.toLocaleString('th-TH')}</div>
              </div>
            ))}
          </div>}
    </div>
  );
}

function ShortcutWidget({ onGo }) {
  const items = [
    { id: 'bulk', label: 'สร้างจากผัง', desc: 'กระจายงานทั้งเดือน' },
    { id: 'venues', label: 'เพิ่มร้าน', desc: 'ร้านประจำ + ราคา' },
    { id: 'musicians', label: 'เพิ่มคนแทน', desc: 'ชื่อ + LINE + บัญชี' },
  ];
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#5a5a66', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>ทางลัด</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map(a => (
          <a key={a.id} href="#" onClick={e => {e.preventDefault(); onGo(a.id);}}
             style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 8, borderRadius: 6, textDecoration: 'none', color: '#0c0c10', transition: 'background 120ms' }}
             onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
             onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{a.label}</div>
              <div style={{ fontSize: 11, color: '#5a5a66' }}>{a.desc}</div>
            </div>
            <ArrowUR size={13} style={{ color: '#8e8e98' }}/>
          </a>
        ))}
      </div>
    </div>
  );
}

function TipWidget() {
  return (
    <div style={{ background: '#0a0a0a', color: '#fff', borderRadius: 12, padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: '#e11d48', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>
        <Sparkle size={12}/> PRO TIP
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.55, color: 'rgba(255,255,255,0.9)' }}>
        ตั้ง <b style={{ color: '#fff' }}>ผังประจำ</b> ให้ครบก่อน แล้วใช้ <a href="#" style={{ color: '#e11d48', fontWeight: 600, textDecoration: 'none' }}>Bulk Generate</a> สร้างงานทั้งเดือนใน 3 คลิก
      </div>
    </div>
  );
}

Object.assign(window, { KPI, EventCard, TodayCard, OwedWidget, ShortcutWidget, TipWidget });
