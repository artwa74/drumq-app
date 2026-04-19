function KPIV2({ icon, label, value, sub, tone, invert }) {
  const Icon = window[icon];
  const valColor = tone === 'red' ? 'var(--app-accent)' : invert ? '#fff' : 'var(--app-ink)';
  return (
    <div style={{
      borderRadius: 12, padding: 16,
      background: invert ? 'var(--app-invert-bg)' : 'var(--app-surface)',
      border: `1px solid ${invert ? 'var(--app-invert-bg)' : 'var(--app-line)'}`,
      color: invert ? 'var(--app-invert-text)' : 'var(--app-ink)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12, color: invert ? 'rgba(255,255,255,0.7)' : 'var(--app-ink-mute)' }}>
        <Icon size={13} strokeWidth={2}/> {label}
      </div>
      <div className="num" style={{ fontSize: 28, lineHeight: 1, color: valColor }}>{value}</div>
      <div style={{ fontSize: 11.5, marginTop: 8, color: invert ? 'rgba(255,255,255,0.6)' : 'var(--app-ink-dim)' }}>{sub}</div>
    </div>
  );
}

const MONTHS_V2 = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];

function EventCardV2({ ev, onClick }) {
  const d = new Date(ev.date);
  const [hover, setHover] = useState(false);
  return (
    <a href="#" onClick={(e) => { e.preventDefault(); onClick && onClick(ev); }}
       onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
       style={{
         display: 'block', background: 'var(--app-surface)',
         border: `1px solid ${hover ? 'var(--app-line-strong)' : 'var(--app-line)'}`,
         borderRadius: 10, padding: '12px 14px', transition: 'border-color 120ms', textDecoration: 'none', color: 'var(--app-ink)',
       }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          flex: 'none', width: 40, height: 46, borderRadius: 6,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: ev.today ? 'var(--app-brand)' : 'var(--app-surface-2)',
          color: ev.today ? '#fff' : 'var(--app-ink)',
        }}>
          <div className="num" style={{ fontSize: 15, lineHeight: 1 }}>{d.getDate()}</div>
          <div style={{ fontSize: 8.5, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginTop: 3, color: ev.today ? 'rgba(255,255,255,0.85)' : 'var(--app-ink-dim)' }}>{MONTHS_V2[d.getMonth()]}</div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
            <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0, flex: '0 1 auto' }}>{ev.venueName}</div>
            {ev.paid
              ? <span style={{ flex: 'none', fontSize: 9, padding: '1px 6px', borderRadius: 3, background: 'var(--app-brand)', color: '#fff', fontWeight: 700, letterSpacing: '0.04em' }}>PAID</span>
              : <span style={{ flex: 'none', fontSize: 9, padding: '1px 6px', borderRadius: 3, background: 'var(--app-accent)', color: '#fff', fontWeight: 700, letterSpacing: '0.04em' }}>UNPAID</span>}
          </div>
          <div style={{ display: 'flex', gap: 10, fontSize: 11.5, color: 'var(--app-ink-mute)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, whiteSpace: 'nowrap' }}><User size={11}/> {ev.sub || '—'}</span>
            <span className="num" style={{ display: 'inline-flex', alignItems: 'center', gap: 3, whiteSpace: 'nowrap' }}><Clock size={11}/> {ev.start}–{ev.end}</span>
          </div>
        </div>
        <div className="num" style={{ fontSize: 13.5, flex: 'none' }}>฿{Number(ev.fee).toLocaleString('th-TH')}</div>
      </div>
    </a>
  );
}

function TodayCardV2({ ev, extra, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <a href="#" onClick={(e) => { e.preventDefault(); onClick && onClick(ev); }}
       onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
       style={{
         display: 'block', background: 'var(--app-surface)',
         border: `1px solid ${hover ? 'var(--app-accent)' : 'var(--app-line)'}`,
         borderRadius: 12, padding: 20, transition: 'border-color 120ms', textDecoration: 'none', color: 'var(--app-ink)',
       }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8 }}>
          <span style={{ position: 'absolute', inset: 0, borderRadius: 999, background: 'var(--app-accent)', opacity: 0.6, animation: 'ping 1.8s cubic-bezier(0,0,0.2,1) infinite' }}/>
          <span style={{ position: 'relative', width: 8, height: 8, background: 'var(--app-accent)', borderRadius: 999 }}/>
        </span>
        <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--app-accent)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>วันนี้ · LIVE</span>
        {extra > 0 && <span style={{ fontSize: 11, color: 'var(--app-ink-mute)', marginLeft: 'auto' }}>+{extra} รอบ</span>}
      </div>
      <div className="display display-h1" style={{ fontSize: 28, lineHeight: 1.1, marginBottom: 8 }}>
        {ev.venueName.split(' ')[0]}<span className="italic-serif" style={{ color: 'var(--app-accent)' }}> {ev.venueName.split(' ').slice(1).join(' ') || '·'}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, color: 'var(--app-ink-mute)' }}>
        <span>{ev.sub || 'ยังไม่ระบุ'}</span>
        <span className="num">{ev.start}–{ev.end}</span>
        <span className="num" style={{ marginLeft: 'auto', color: 'var(--app-ink)' }}>฿{Number(ev.fee).toLocaleString('th-TH')}</span>
      </div>
    </a>
  );
}

function initialsV2(name) { const p = name.trim().split(/\s+/); return ((p[0]?.[0]||'')+(p[1]?.[0]||'')).toUpperCase(); }

function OwedWidgetV2({ rows, onSeeAll }) {
  return (
    <div style={{ background: 'var(--app-surface)', border: '1px solid var(--app-line)', borderRadius: 12, padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--app-ink-mute)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>ค้างจ่ายคนแทน</div>
        <a href="#" onClick={e => {e.preventDefault(); onSeeAll();}} style={{ fontSize: 11, color: 'var(--app-brand)', fontWeight: 500, textDecoration: 'none' }}>ดูทั้งหมด</a>
      </div>
      {rows.length === 0
        ? <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--app-ink-dim)', fontSize: 13 }}>ไม่มีค้างจ่าย 🎉</div>
        : <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {rows.map(([name, total]) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="display" style={{ width: 32, height: 32, borderRadius: 6, background: 'var(--app-brand)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 12 }}>{initialsV2(name)}</div>
                <div style={{ flex: 1, fontSize: 13, fontWeight: 500, color: 'var(--app-ink)' }}>{name}</div>
                <div className="num" style={{ fontSize: 13, color: 'var(--app-accent)' }}>฿{total.toLocaleString('th-TH')}</div>
              </div>
            ))}
          </div>}
    </div>
  );
}

function TipWidgetV2() {
  return (
    <div style={{ background: 'var(--app-invert-bg)', color: 'var(--app-invert-text)', borderRadius: 12, padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: 'var(--app-accent)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>
        <Sparkle size={12}/> PRO TIP
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.55, color: 'rgba(255,255,255,0.9)' }}>
        ตั้ง <b style={{ color: '#fff' }}>ผังประจำ</b> ให้ครบก่อน แล้วใช้ <a href="#" style={{ color: 'var(--app-accent)', fontWeight: 600, textDecoration: 'none' }}>Bulk Generate</a> สร้างงานทั้งเดือนใน 3 คลิก
      </div>
    </div>
  );
}

Object.assign(window, { KPIV2, EventCardV2, TodayCardV2, OwedWidgetV2, TipWidgetV2 });
