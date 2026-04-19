function RosterPageV2() {
  const [rows, setRows] = useState(ROSTER_V2);
  const toggle = (id) => setRows(rs => rs.map(r => r.id === id ? { ...r, active: !r.active } : r));
  const active = rows.filter(r => r.active);
  const weekTotal = active.reduce((s, r) => s + r.fee, 0);
  return (
    <div>
      <PageHeaderV2 eyebrow={`${active.length} วัน/สัปดาห์ · ประมาณ ฿${weekTotal.toLocaleString('th-TH')}/สัปดาห์`} title="ผังประจำ"
        action={<button className="btn-brand"><Plus size={16} strokeWidth={2.4}/> เพิ่มผัง</button>}/>
      <div style={{ background: 'var(--app-surface)', border: '1px solid var(--app-line)', borderRadius: 12, padding: 4 }}>
        {DAYS_V2.map((d) => {
          const r = rows.find(x => x.day === d);
          return <RosterRowV2 key={d} day={d} row={r} onToggle={toggle}/>;
        })}
      </div>
      <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <RosterStatV2 label="วันประจำ" value={`${active.length} / 7`} sub="เปอร์เซ็นต์เต็มสัปดาห์"/>
        <RosterStatV2 label="ค่าจ้างเฉลี่ย" value={`฿${Math.round(weekTotal/Math.max(active.length,1)).toLocaleString('th-TH')}`} sub="ต่อคืน"/>
        <RosterStatV2 label="ต่อเดือน (~4 สัปดาห์)" value={`฿${(weekTotal*4).toLocaleString('th-TH')}`} sub="ถ้าเล่นเอง ไม่มีคนแทน"/>
      </div>
    </div>
  );
}

function RosterRowV2({ day, row, onToggle }) {
  const [h, setH] = useState(false);
  const hasRow = !!row;
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
         style={{
           display: 'grid', gridTemplateColumns: '80px 1fr 120px 100px 80px',
           alignItems: 'center', gap: 12,
           padding: '14px 16px', borderRadius: 8,
           background: h && hasRow ? 'var(--app-surface-2)' : 'transparent',
           opacity: hasRow && !row.active ? 0.55 : 1,
           transition: 'background 100ms',
         }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: hasRow ? 'var(--app-ink)' : 'var(--app-ink-dim)' }}>{day}</div>
      {hasRow ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 6, background: 'var(--app-surface-2)', display: 'grid', placeItems: 'center' }}>
              <Building size={14} style={{ color: 'var(--app-ink-mute)' }}/>
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--app-ink)' }}>{row.venue}</div>
          </div>
          <div className="num" style={{ fontSize: 12.5, color: 'var(--app-ink-mute)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Clock size={12}/> {row.start}–{row.end}
          </div>
          <div className="num" style={{ fontSize: 14, color: 'var(--app-ink)', fontWeight: 600 }}>฿{row.fee.toLocaleString('th-TH')}</div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <ToggleV2 on={row.active} onChange={() => onToggle(row.id)}/>
          </div>
        </>
      ) : (
        <div style={{ gridColumn: '2 / -1', fontSize: 12.5, color: 'var(--app-ink-dim)' }}>ว่าง — <a href="#" onClick={e => e.preventDefault()} style={{ color: 'var(--app-brand)', textDecoration: 'none', fontWeight: 500 }}>+ เพิ่มร้าน</a></div>
      )}
    </div>
  );
}

function ToggleV2({ on, onChange }) {
  return (
    <button onClick={onChange}
      style={{
        width: 36, height: 20, borderRadius: 999,
        border: 'none', cursor: 'pointer', padding: 0,
        background: on ? 'var(--app-brand)' : 'var(--app-line-strong)',
        position: 'relative', transition: 'background 150ms',
      }}>
      <span style={{
        position: 'absolute', top: 2, left: on ? 18 : 2, width: 16, height: 16,
        borderRadius: 999, background: '#fff', transition: 'left 150ms',
        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
      }}/>
    </button>
  );
}

function RosterStatV2({ label, value, sub }) {
  return (
    <div style={{ background: 'var(--app-surface)', border: '1px solid var(--app-line)', borderRadius: 12, padding: 16 }}>
      <div style={{ fontSize: 10.5, color: 'var(--app-ink-mute)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 8 }}>{label}</div>
      <div className="display" style={{ fontSize: 22, color: 'var(--app-ink)', marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 11.5, color: 'var(--app-ink-dim)' }}>{sub}</div>
    </div>
  );
}

window.RosterPageV2 = RosterPageV2;
