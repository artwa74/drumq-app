function VenuesPageV2() {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(null);
  const rows = VENUES_V2.filter(v => v.name.toLowerCase().includes(q.toLowerCase()) || v.area.includes(q));
  return (
    <div>
      <PageHeaderV2 eyebrow={`${VENUES_V2.length} ร้าน`} title="ร้าน"
        action={<button className="btn-brand"><Plus size={16} strokeWidth={2.4}/> เพิ่มร้าน</button>}/>
      <ToolbarV2 search={q} onSearch={setQ} placeholder="ค้นหาร้าน, โซน…"
        right={<button className="btn-outline"><Filter size={14}/> ฟิลเตอร์</button>}/>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {rows.map(v => <VenueCardV2 key={v.id} v={v} onClick={() => setSel(v)}/>)}
      </div>
      {rows.length === 0 && <EmptyStateV2 title="ไม่พบร้าน" sub="ลองเปลี่ยนคำค้น"/>}
      <DrawerV2 open={!!sel} onClose={() => setSel(null)} title="รายละเอียดร้าน">
        {sel && <VenueDetailV2 v={sel}/>}
      </DrawerV2>
    </div>
  );
}

function VenueCardV2({ v, onClick }) {
  const [h, setH] = useState(false);
  return (
    <div onClick={onClick}
         onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
         style={{
           background: 'var(--app-surface)',
           border: `1px solid ${h ? 'var(--app-line-strong)' : 'var(--app-line)'}`,
           borderRadius: 12, padding: 16, cursor: 'pointer',
           transition: 'border-color 120ms, transform 120ms',
           transform: h ? 'translateY(-1px)' : 'none',
         }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
        <div style={{
          flex: 'none', width: 44, height: 44, borderRadius: 10,
          background: 'var(--app-surface-2)', color: 'var(--app-ink)',
          display: 'grid', placeItems: 'center',
        }}>
          <Building size={18}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14.5, color: 'var(--app-ink)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.name}</div>
          <div style={{ fontSize: 12, color: 'var(--app-ink-mute)' }}>{v.area}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--app-line)' }}>
        <div className="num" style={{ fontSize: 14, color: 'var(--app-ink)' }}>฿{v.rate.toLocaleString('th-TH')}<span style={{ fontSize: 11, color: 'var(--app-ink-dim)', fontWeight: 400 }}> / คืน</span></div>
        <div style={{ fontSize: 11.5, color: 'var(--app-ink-mute)' }}>{v.events} งาน</div>
      </div>
      {v.tags.length > 0 && (
        <div style={{ display: 'flex', gap: 4, marginTop: 10, flexWrap: 'wrap' }}>
          {v.tags.map((t, i) => <TagV2 key={i} tone={t === 'Main' ? 'brand' : 'mute'}>{t}</TagV2>)}
        </div>
      )}
    </div>
  );
}

function VenueDetailV2({ v }) {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        <div style={{ flex: 'none', width: 56, height: 56, borderRadius: 12, background: 'var(--app-surface-2)', display: 'grid', placeItems: 'center', color: 'var(--app-ink)' }}>
          <Building size={22}/>
        </div>
        <div>
          <div className="display display-h1" style={{ fontSize: 22, color: 'var(--app-ink)' }}>{v.name}</div>
          <div style={{ fontSize: 12, color: 'var(--app-ink-mute)', marginTop: 2 }}>{v.area}</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        <DrawerStatV2 label="ค่าจ้าง / คืน" value={`฿${v.rate.toLocaleString('th-TH')}`}/>
        <DrawerStatV2 label="งานทั้งหมด" value={`${v.events} ครั้ง`}/>
      </div>
      <DrawerSectionV2 title="แท็ก">
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {v.tags.map((t, i) => <TagV2 key={i} tone={t === 'Main' ? 'brand' : 'mute'}>{t}</TagV2>)}
        </div>
      </DrawerSectionV2>
      <DrawerSectionV2 title="ประวัติล่าสุด">
        <div style={{ fontSize: 13, color: 'var(--app-ink-mute)', lineHeight: 1.6 }}>งานล่าสุด 3 ครั้งที่ผ่านมา — คนแทนส่วนใหญ่ ป้อง, จ่ายครบทุกครั้ง</div>
      </DrawerSectionV2>
      <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
        <button className="btn-brand" style={{ flex: 1, justifyContent: 'center' }}>แก้ไข</button>
        <button className="btn-outline">สร้างงาน</button>
      </div>
    </>
  );
}

function DrawerStatV2({ label, value }) {
  return (
    <div style={{ background: 'var(--app-surface-2)', borderRadius: 8, padding: '10px 12px' }}>
      <div style={{ fontSize: 10, color: 'var(--app-ink-mute)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{label}</div>
      <div className="num" style={{ fontSize: 16, fontWeight: 700, color: 'var(--app-ink)' }}>{value}</div>
    </div>
  );
}
function DrawerSectionV2({ title, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 10.5, color: 'var(--app-ink-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}

Object.assign(window, { VenuesPageV2, DrawerStatV2, DrawerSectionV2 });
