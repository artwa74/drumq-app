// Mini calendar + finance sections
function MiniCalendar({ events, onPick }) {
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
  events.forEach(e => {
    const d = new Date(e.date);
    if (d.getMonth() === cur.getMonth() && d.getFullYear() === cur.getFullYear()) {
      (evMap[d.getDate()] = evMap[d.getDate()] || []).push(e);
    }
  });

  return (
    <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>{monthNames[cur.getMonth()]}</div>
          <div className="num" style={{ fontSize: 13, color: '#5a5a66', marginTop: 2 }}>{cur.getFullYear() + 543}</div>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={() => setMonthOffset(m => m - 1)} style={{ width: 32, height: 32, border: '1px solid #e5e5e5', background: '#fff', borderRadius: 8, cursor: 'pointer', display: 'grid', placeItems: 'center' }}><ChL size={14}/></button>
          <button onClick={() => setMonthOffset(0)} style={{ padding: '0 12px', height: 32, border: '1px solid #e5e5e5', background: '#fff', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 500, fontFamily: 'inherit' }}>วันนี้</button>
          <button onClick={() => setMonthOffset(m => m + 1)} style={{ width: 32, height: 32, border: '1px solid #e5e5e5', background: '#fff', borderRadius: 8, cursor: 'pointer', display: 'grid', placeItems: 'center' }}><ChR size={14}/></button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {['อา','จ','อ','พ','พฤ','ศ','ส'].map(d => (
          <div key={d} style={{ fontSize: 10, fontWeight: 600, color: '#8e8e98', textAlign: 'center', padding: '6px 0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{d}</div>
        ))}
        {cells.map((d, i) => {
          if (d === null) return <div key={i}/>;
          const isToday = monthOffset === 0 && d === today.getDate();
          const evs = evMap[d] || [];
          return (
            <button key={i} onClick={() => evs[0] && onPick(evs[0])}
              style={{
                aspectRatio: '1', border: '1px solid ' + (isToday ? '#0a0a0a' : '#f4f4f5'),
                background: isToday ? '#0a0a0a' : '#fff',
                color: isToday ? '#fff' : '#0c0c10',
                borderRadius: 8, padding: 6, display: 'flex', flexDirection: 'column',
                alignItems: 'flex-start', justifyContent: 'space-between',
                cursor: evs.length ? 'pointer' : 'default',
                fontFamily: 'inherit', textAlign: 'left',
              }}>
              <span className="num" style={{ fontSize: 13, fontWeight: 600 }}>{d}</span>
              {evs.length > 0 && (
                <span style={{ display: 'flex', gap: 2 }}>
                  {evs.slice(0, 3).map((e, j) => (
                    <span key={j} style={{ width: 5, height: 5, borderRadius: 999, background: e.paid ? (isToday ? '#fff' : '#0a0a0a') : '#e11d48' }}/>
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

function FinanceHero({ total, count }) {
  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(135deg, #ff4d6d 0%, #ff2d55 100%)',
      color: '#fff', borderRadius: 24, padding: 24,
      boxShadow: '0 4px 12px -2px rgba(225,29,72,0.3)',
    }}>
      <div style={{ position: 'absolute', right: -32, top: -32, width: 128, height: 128, borderRadius: 999,
                    background: 'radial-gradient(circle, rgba(255,255,255,0.22), transparent 70%)' }}/>
      <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12, color: 'rgba(255,255,255,0.9)' }}>
        ❌ ค้างจ่ายคนแทน
      </div>
      <div className="num" style={{ fontSize: 40, fontWeight: 700, lineHeight: 1, letterSpacing: '-0.03em' }}>
        ฿{total.toLocaleString('th-TH')}
      </div>
      <div style={{ fontSize: 12, marginTop: 10, color: 'rgba(255,255,255,0.85)' }}>{count} รายการ รอโอน</div>
    </div>
  );
}

function SectionHeader({ emoji, title, count }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>{emoji} {title}</h2>
      {count !== undefined && <span style={{ fontSize: 11, color: '#8e8e98', fontWeight: 500 }}>{count}</span>}
    </div>
  );
}

function EventModal({ ev, onClose, onTogglePaid }) {
  if (!ev) return null;
  const d = new Date(ev.date);
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(15,15,25,0.35)', backdropFilter: 'blur(8px)' }}/>
      <div style={{ position: 'relative', background: '#fff', width: '100%', maxWidth: 480, borderRadius: 16, padding: 24, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: '#5a5a66', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, marginBottom: 6 }}>
              {d.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, letterSpacing: '-0.025em', marginBottom: 4 }}>{ev.venueName}</div>
            <div style={{ fontSize: 13, color: '#5a5a66' }}>{ev.status || 'งานวง'}</div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: '#fafafa', cursor: 'pointer', display: 'grid', placeItems: 'center' }}><X size={14}/></button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <Field label="🕐 เวลา" value={`${ev.start}–${ev.end}`} mono/>
          <Field label="💵 ค่าจ้าง" value={`฿${Number(ev.fee).toLocaleString('th-TH')}`} mono/>
          <Field label="👤 คนแทน" value={ev.sub || '—'}/>
          <Field label="สถานะ" value={ev.paid ? 'PAID' : 'UNPAID'} tone={ev.paid ? 'paid' : 'unpaid'}/>
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
function Field({ label, value, mono, tone }) {
  const color = tone === 'paid' ? '#0a0a0a' : tone === 'unpaid' ? '#e11d48' : '#0c0c10';
  return (
    <div style={{ background: '#fafafa', borderRadius: 8, padding: '10px 12px' }}>
      <div style={{ fontSize: 10, color: '#5a5a66', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{label}</div>
      <div className={mono ? 'num' : ''} style={{ fontSize: 14, fontWeight: 600, color }}>{value}</div>
    </div>
  );
}

Object.assign(window, { MiniCalendar, FinanceHero, SectionHeader, EventModal });
