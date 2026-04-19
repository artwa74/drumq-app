function MusiciansPageV2() {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(null);
  const rows = MUSICIANS_V2.filter(m => m.name.includes(q) || m.inst.includes(q));
  const totalOwed = MUSICIANS_V2.reduce((s, m) => s + m.owed, 0);
  return (
    <div>
      <PageHeaderV2 eyebrow={`${MUSICIANS_V2.length} คน · ค้างจ่ายรวม ฿${totalOwed.toLocaleString('th-TH')}`} title="นักดนตรี"
        action={<button className="btn-brand"><Plus size={16} strokeWidth={2.4}/> เพิ่มคน</button>}/>
      <ToolbarV2 search={q} onSearch={setQ} placeholder="ค้นหาชื่อ, เครื่องดนตรี…"/>
      <TableShellV2>
        <div style={{ gridTemplateColumns: '1.6fr 1.2fr 1fr 0.8fr 0.9fr 40px' }}>
          <THeadV2 cols={[
            { label: 'นักดนตรี' }, { label: 'เครื่อง' }, { label: 'เบอร์' },
            { label: 'งาน', align: 'right' }, { label: 'ค้างจ่าย', align: 'right' }, { label: '' },
          ]}/>
        </div>
        {rows.map(m => (
          <div key={m.id} style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.2fr 1fr 0.8fr 0.9fr 40px' }}>
            <TableRowV2 onClick={() => setSel(m)} accent>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <InitialsV2 name={m.name}/>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--app-ink)' }}>{m.name}</div>
                  <div className="num" style={{ fontSize: 11, color: 'var(--app-ink-dim)' }}>฿{m.rate.toLocaleString('th-TH')} / คืน</div>
                </div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--app-ink-mute)' }}>{m.inst}</div>
              <div className="num" style={{ fontSize: 12.5, color: 'var(--app-ink-mute)' }}>{m.phone}</div>
              <div className="num" style={{ fontSize: 14, color: 'var(--app-ink)', textAlign: 'right' }}>{m.gigs}</div>
              <div className="num" style={{ fontSize: 14, textAlign: 'right', color: m.owed > 0 ? 'var(--app-accent)' : 'var(--app-ink-dim)', fontWeight: m.owed > 0 ? 700 : 500 }}>
                {m.owed > 0 ? `฿${m.owed.toLocaleString('th-TH')}` : '—'}
              </div>
              <div style={{ color: 'var(--app-ink-dim)', display: 'grid', placeItems: 'center' }}><ChR size={14}/></div>
            </TableRowV2>
          </div>
        ))}
      </TableShellV2>
      <DrawerV2 open={!!sel} onClose={() => setSel(null)} title="นักดนตรี">
        {sel && <MusicianDetailV2 m={sel}/>}
      </DrawerV2>
    </div>
  );
}

function MusicianDetailV2({ m }) {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        <InitialsV2 name={m.name}/>
        <div>
          <div className="display display-h1" style={{ fontSize: 22, color: 'var(--app-ink)' }}>{m.name}</div>
          <div style={{ fontSize: 12, color: 'var(--app-ink-mute)', marginTop: 2 }}>{m.inst}</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        <DrawerStatV2 label="ค่าจ้าง ปกติ" value={`฿${m.rate.toLocaleString('th-TH')}`}/>
        <DrawerStatV2 label="งานทั้งหมด" value={`${m.gigs} ครั้ง`}/>
      </div>
      {m.owed > 0 && (
        <div style={{ background: 'color-mix(in srgb, var(--app-accent) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--app-accent) 30%, transparent)', borderRadius: 10, padding: 14, marginBottom: 18 }}>
          <div style={{ fontSize: 10.5, color: 'var(--app-accent)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 6 }}>ค้างจ่าย</div>
          <div className="num" style={{ fontSize: 22, color: 'var(--app-accent)', fontWeight: 700 }}>฿{m.owed.toLocaleString('th-TH')}</div>
        </div>
      )}
      <DrawerSectionV2 title="ติดต่อ">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13.5, color: 'var(--app-ink)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Phone size={13} style={{ color: 'var(--app-ink-dim)' }}/>
            <span className="num">{m.phone}</span>
          </div>
        </div>
      </DrawerSectionV2>
      <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
        <button className="btn-brand" style={{ flex: 1, justifyContent: 'center' }}>จ้างงาน</button>
        <button className="btn-outline">แก้ไข</button>
      </div>
    </>
  );
}

window.MusiciansPageV2 = MusiciansPageV2;
