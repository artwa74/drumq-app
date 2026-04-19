function MiniCalendarV2({ events, onPick }) {
  const [monthOffset, setMonthOffset] = useState(0);
  const today = new Date();
  const cur = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const monthNames = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
  const daysInMonth = new Date(cur.getFullYear(), cur.getMonth() + 1, 0).getDate();
  const startDow = cur.getDay();
  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  const evMap = {};
  events.forEach(e => { const d = new Date(e.date); if (d.getMonth() === cur.getMonth() && d.getFullYear() === cur.getFullYear()) (evMap[d.getDate()] = evMap[d.getDate()] || []).push(e); });

  return (
    <div style={{ background: 'var(--app-surface)', border: '1px solid var(--app-line)', borderRadius: 12, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div className="display" style={{ fontSize: 24 }}>
            {monthNames[cur.getMonth()]}<span className="italic-serif" style={{ color: 'var(--app-accent)' }}>.</span>
          </div>
          <div className="num" style={{ fontSize: 13, color: 'var(--app-ink-mute)', marginTop: 2 }}>{cur.getFullYear() + 543}</div>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={() => setMonthOffset(m => m - 1)} style={{ width: 32, height: 32, border: '1px solid var(--app-line)', background: 'var(--app-surface)', borderRadius: 8, cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--app-ink)' }}><ChL size={14}/></button>
          <button onClick={() => setMonthOffset(0)} style={{ padding: '0 12px', height: 32, border: '1px solid var(--app-line)', background: 'var(--app-surface)', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 500, fontFamily: 'inherit', color: 'var(--app-ink)' }}>วันนี้</button>
          <button onClick={() => setMonthOffset(m => m + 1)} style={{ width: 32, height: 32, border: '1px solid var(--app-line)', background: 'var(--app-surface)', borderRadius: 8, cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--app-ink)' }}><ChR size={14}/></button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {['อา','จ','อ','พ','พฤ','ศ','ส'].map(d => (
          <div key={d} style={{ fontSize: 10, fontWeight: 600, color: 'var(--app-ink-dim)', textAlign: 'center', padding: '6px 0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{d}</div>
        ))}
        {cells.map((d, i) => {
          if (d === null) return <div key={i}/>;
          const isToday = monthOffset === 0 && d === today.getDate();
          const evs = evMap[d] || [];
          return (
            <button key={i} onClick={() => evs[0] && onPick(evs[0])}
              style={{
                aspectRatio: '1', border: '1px solid ' + (isToday ? 'var(--app-brand)' : 'var(--app-surface-2)'),
                background: isToday ? 'var(--app-brand)' : 'var(--app-surface)',
                color: isToday ? '#fff' : 'var(--app-ink)',
                borderRadius: 8, padding: 6, display: 'flex', flexDirection: 'column',
                alignItems: 'flex-start', justifyContent: 'space-between',
                cursor: evs.length ? 'pointer' : 'default', fontFamily: 'inherit', textAlign: 'left',
              }}>
              <span className="num" style={{ fontSize: 13 }}>{d}</span>
              {evs.length > 0 && (
                <span style={{ display: 'flex', gap: 2 }}>
                  {evs.slice(0, 3).map((e, j) => (
                    <span key={j} style={{ width: 5, height: 5, borderRadius: 999, background: e.paid ? (isToday ? '#fff' : 'var(--app-brand)') : 'var(--app-accent)' }}/>
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FinanceHeroV2({ total, count }) {
  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      background: 'var(--app-hero-grad)',
      color: '#fff', borderRadius: 24, padding: 28,
      boxShadow: '0 4px 12px -2px rgba(0,0,0,0.18)',
    }}>
      <div style={{ position: 'absolute', right: -32, top: -32, width: 140, height: 140, borderRadius: 999, background: 'radial-gradient(circle, rgba(255,255,255,0.22), transparent 70%)' }}/>
      <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14, color: 'rgba(255,255,255,0.9)' }}>❌ ค้างจ่ายคนแทน</div>
      <div className="display" style={{ fontSize: 48, lineHeight: 1 }}>
        <span className="num">฿{total.toLocaleString('th-TH')}</span>
      </div>
      <div style={{ fontSize: 12, marginTop: 10, color: 'rgba(255,255,255,0.85)' }}>{count} รายการ รอโอน</div>
    </div>
  );
}

function SectionHeaderV2({ emoji, title, count }) {
  const parts = title.split(' ');
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10 }}>
      <h2 className="display display-h1" style={{ fontSize: 16, margin: 0, color: 'var(--app-ink)', letterSpacing: '0.02em' }}>
        {parts[0]}<span className="italic-serif" style={{ color: 'var(--app-accent)' }}>{parts[1] ? ' ' + parts.slice(1).join(' ') : ''}</span>
      </h2>
      {count !== undefined && <span style={{ fontSize: 11, color: 'var(--app-ink-dim)', fontWeight: 500, marginLeft: 'auto' }}>{count}</span>}
    </div>
  );
}

function EventModalV2({ ev, onClose, onTogglePaid }) {
  if (!ev) return null;
  const d = new Date(ev.date);
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(15,15,25,0.45)', backdropFilter: 'blur(8px)' }}/>
      <div style={{ position: 'relative', background: 'var(--app-surface)', color: 'var(--app-ink)', width: '100%', maxWidth: 480, borderRadius: 16, padding: 24, boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: 'var(--app-ink-mute)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, marginBottom: 6 }}>
              {d.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
            <div className="display display-h1" style={{ fontSize: 26, marginBottom: 4 }}>
              {ev.venueName.split(' ')[0]}<span className="italic-serif" style={{ color: 'var(--app-accent)' }}>{ev.venueName.split(' ').slice(1).length ? ' ' + ev.venueName.split(' ').slice(1).join(' ') : ''}</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--app-ink-mute)' }}>{ev.status || 'งานวง'}</div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'var(--app-surface-2)', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--app-ink)' }}><X size={14}/></button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <FieldV2 label="🕐 เวลา" value={`${ev.start}–${ev.end}`} mono/>
          <FieldV2 label="💵 ค่าจ้าง" value={`฿${Number(ev.fee).toLocaleString('th-TH')}`} mono/>
          <FieldV2 label="👤 คนแทน" value={ev.sub || '—'}/>
          <FieldV2 label="สถานะ" value={ev.paid ? 'PAID' : 'UNPAID'} tone={ev.paid ? 'paid' : 'unpaid'}/>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-brand" style={{ flex: 1, justifyContent: 'center' }} onClick={() => onTogglePaid(ev)}>
            {ev.paid ? 'ยกเลิก Paid' : 'ทำเครื่องหมาย Paid'}
          </button>
          <button className="btn-outline" onClick={onClose}>ปิด</button>
        </div>
      </div>
    </div>
  );
}
function FieldV2({ label, value, mono, tone }) {
  const color = tone === 'paid' ? 'var(--app-brand)' : tone === 'unpaid' ? 'var(--app-accent)' : 'var(--app-ink)';
  return (
    <div style={{ background: 'var(--app-surface-2)', borderRadius: 8, padding: '10px 12px' }}>
      <div style={{ fontSize: 10, color: 'var(--app-ink-mute)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{label}</div>
      <div className={mono ? 'num' : ''} style={{ fontSize: 14, fontWeight: 600, color }}>{value}</div>
    </div>
  );
}

Object.assign(window, { MiniCalendarV2, FinanceHeroV2, SectionHeaderV2, EventModalV2 });
