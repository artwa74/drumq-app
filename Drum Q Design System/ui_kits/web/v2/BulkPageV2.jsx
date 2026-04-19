function BulkPageV2() {
  const months = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
  const thisMonth = new Date().getMonth();
  const [month, setMonth] = useState(thisMonth + 1);
  const [skips, setSkips] = useState(new Set());

  const activeRoster = ROSTER_V2.filter(r => r.active);
  // count weekday occurrences in chosen month
  const year = new Date().getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dowCount = [0,0,0,0,0,0,0]; // Sun..Sat
  const gigs = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(year, month, d);
    dowCount[dt.getDay()]++;
    const dowName = ['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'][dt.getDay()];
    const r = activeRoster.find(x => x.day === dowName);
    if (r) gigs.push({ date: d, dow: dowName, venue: r.venue, start: r.start, end: r.end, fee: r.fee, key: `${d}-${r.id}` });
  }
  const kept = gigs.filter(g => !skips.has(g.key));
  const total = kept.reduce((s, g) => s + g.fee, 0);
  const toggleSkip = (k) => { const n = new Set(skips); n.has(k) ? n.delete(k) : n.add(k); setSkips(n); };

  return (
    <div>
      <PageHeaderV2 eyebrow="สร้างงานทั้งเดือนใน 3 คลิก" title="Bulk Generate"/>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
        <div>
          {/* Step 1 */}
          <StepCardV2 num={1} title="เลือกเดือน">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {months.map((m, i) => (
                <button key={i} onClick={() => setMonth(i)}
                  style={{
                    padding: '8px 14px', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', cursor: 'pointer',
                    border: `1px solid ${i === month ? 'var(--app-brand)' : 'var(--app-line)'}`,
                    background: i === month ? 'var(--app-brand)' : 'var(--app-surface)',
                    color: i === month ? '#fff' : 'var(--app-ink)',
                    fontWeight: i === month ? 600 : 500,
                    transition: 'all 120ms',
                  }}>
                  {m}
                </button>
              ))}
            </div>
          </StepCardV2>

          {/* Step 2 */}
          <StepCardV2 num={2} title={`จะสร้าง ${gigs.length} งาน (ตาม ผังประจำ)`} sub={`จาก ${activeRoster.length} วัน/สัปดาห์ที่เปิดอยู่`}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 14 }}>
              {['อา','จ','อ','พ','พฤ','ศ','ส'].map((d, i) => (
                <div key={i} style={{ background: 'var(--app-surface-2)', borderRadius: 6, padding: '6px 4px', textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: 'var(--app-ink-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{d}</div>
                  <div className="num" style={{ fontSize: 15, color: 'var(--app-ink)', marginTop: 2 }}>{dowCount[i]}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 380, overflowY: 'auto', paddingRight: 4 }}>
              {gigs.map(g => {
                const skipped = skips.has(g.key);
                return (
                  <div key={g.key} onClick={() => toggleSkip(g.key)}
                       style={{
                         display: 'grid', gridTemplateColumns: '48px 1fr 120px 90px 24px',
                         alignItems: 'center', gap: 10,
                         padding: '8px 12px', borderRadius: 8,
                         background: skipped ? 'var(--app-bg)' : 'var(--app-surface)',
                         border: `1px solid ${skipped ? 'var(--app-line)' : 'var(--app-line)'}`,
                         opacity: skipped ? 0.45 : 1,
                         cursor: 'pointer', textDecoration: skipped ? 'line-through' : 'none',
                         transition: 'opacity 100ms',
                       }}>
                    <div className="num" style={{ fontSize: 13, fontWeight: 600, color: 'var(--app-ink)' }}>{g.date}</div>
                    <div style={{ fontSize: 13, color: 'var(--app-ink)' }}>{g.venue}</div>
                    <div className="num" style={{ fontSize: 11.5, color: 'var(--app-ink-mute)' }}>{g.start}–{g.end}</div>
                    <div className="num" style={{ fontSize: 13, color: 'var(--app-ink)', fontWeight: 600, textAlign: 'right' }}>฿{g.fee.toLocaleString('th-TH')}</div>
                    <div style={{ color: skipped ? 'var(--app-ink-dim)' : 'var(--app-brand)', display: 'grid', placeItems: 'center' }}>
                      {skipped ? <X size={12}/> : <CheckC size={14}/>}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 10, fontSize: 11.5, color: 'var(--app-ink-dim)' }}>คลิกแถวเพื่อ skip วันนั้น (เช่น วันหยุด, ไปต่างจังหวัด)</div>
          </StepCardV2>

          {/* Step 3 */}
          <StepCardV2 num={3} title="ยืนยันและสร้าง">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              <DrawerStatV2 label="งานที่จะสร้าง" value={`${kept.length} ครั้ง`}/>
              <DrawerStatV2 label="รายได้รวม" value={`฿${total.toLocaleString('th-TH')}`}/>
            </div>
            <button className="btn-brand" style={{ width: '100%', justifyContent: 'center', height: 44, fontSize: 14 }} onClick={() => alert(`สร้าง ${kept.length} งาน (demo)`)}>
              <Zap size={16} strokeWidth={2.4}/> Generate ทั้งหมด ({kept.length})
            </button>
          </StepCardV2>
        </div>

        {/* Sidebar summary */}
        <aside>
          <div style={{ position: 'sticky', top: 80 }}>
            <div style={{ background: 'var(--app-invert-bg)', color: 'var(--app-invert-text)', borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 10.5, color: 'var(--app-accent)', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Zap size={12}/> Summary
              </div>
              <div className="display" style={{ fontSize: 32, lineHeight: 1, marginBottom: 4 }}>
                <span className="num">{kept.length}</span>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginLeft: 8 }}>งาน</span>
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginBottom: 20 }}>{months[month]} {year + 543}</div>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.15)', marginBottom: 16 }}/>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12 }}>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>ผังประจำ</span>
                <span className="num">{activeRoster.length} วัน/สัปดาห์</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12 }}>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>Skip</span>
                <span className="num">{skips.size} วัน</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                <span style={{ fontSize: 13 }}>รายได้รวม</span>
                <span className="num" style={{ fontSize: 17, color: 'var(--app-accent)', fontWeight: 700 }}>฿{total.toLocaleString('th-TH')}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function StepCardV2({ num, title, sub, children }) {
  return (
    <div style={{ background: 'var(--app-surface)', border: '1px solid var(--app-line)', borderRadius: 16, padding: 20, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
        <div className="display" style={{ flex: 'none', width: 30, height: 30, borderRadius: 999, background: 'var(--app-brand)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 700 }}>{num}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--app-ink)' }}>{title}</div>
          {sub && <div style={{ fontSize: 12, color: 'var(--app-ink-mute)', marginTop: 2 }}>{sub}</div>}
        </div>
      </div>
      {children}
    </div>
  );
}

window.BulkPageV2 = BulkPageV2;
