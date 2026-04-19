const SEED_V2 = [
  { id: 1, date: '2026-04-18', venueName: 'Saxophone Pub', sub: 'ป้อง', start: '20:30', end: '00:30', fee: 1500, paid: false, status: 'จ้างคนแทน', today: true },
  { id: 2, date: '2026-04-18', venueName: 'The Rock Pub', sub: 'มิว', start: '21:00', end: '01:00', fee: 1800, paid: false, status: 'จ้างคนแทน', today: true },
  { id: 3, date: '2026-04-20', venueName: 'Brown Sugar', sub: 'ฉันเอง', start: '20:00', end: '23:00', fee: 2200, paid: true, status: 'งานวง' },
  { id: 4, date: '2026-04-22', venueName: "Maggie Choo's", sub: 'โอ๋', start: '21:30', end: '01:30', fee: 1500, paid: false, status: 'จ้างคนแทน' },
  { id: 5, date: '2026-04-24', venueName: 'Fungjai Studio', sub: 'ฉันเอง', start: '19:00', end: '22:00', fee: 2500, paid: true, status: 'งานวง' },
  { id: 6, date: '2026-04-25', venueName: 'The Living Room', sub: 'ป้อง', start: '20:30', end: '00:30', fee: 1500, paid: false, status: 'จ้างคนแทน' },
  { id: 7, date: '2026-04-27', venueName: 'Saxophone Pub', sub: 'ฉันเอง', start: '20:30', end: '00:30', fee: 2200, paid: true, status: 'งานวง' },
  { id: 8, date: '2026-04-30', venueName: 'Overtone', sub: 'มิว', start: '21:00', end: '01:00', fee: 1800, paid: false, status: 'จ้างคนแทน' },
  { id: 9, date: '2026-05-02', venueName: 'Mellow Pub', sub: 'ฉันเอง', start: '20:00', end: '23:30', fee: 2000, paid: false, status: 'งานวง' },
];

function splitVenue(name) {
  const parts = name.split(' ');
  return [parts[0], parts.slice(1).join(' ')];
}

function AppV2() {
  const [page, setPage] = useState('/');
  const [events, setEvents] = useState(SEED_V2);
  const [modal, setModal] = useState(null);

  const upcoming = events.filter(e => !e.today);
  const todays = events.filter(e => e.today);
  const unpaid = events.filter(e => !e.paid);
  const paid = events.filter(e => e.paid);
  const unpaidTotal = unpaid.reduce((s, e) => s + e.fee, 0);
  const paidMonth = paid.reduce((s, e) => s + e.fee, 0);
  const totalMonth = events.reduce((s, e) => s + e.fee, 0);
  const owedMap = {};
  unpaid.filter(e => e.status === 'จ้างคนแทน' && e.sub !== 'ฉันเอง').forEach(e => { owedMap[e.sub] = (owedMap[e.sub]||0) + e.fee; });
  const owed = Object.entries(owedMap).sort((a,b) => b[1]-a[1]);

  const togglePaid = (ev) => {
    setEvents(es => es.map(e => e.id === ev.id ? { ...e, paid: !e.paid } : e));
    setModal(m => m && m.id === ev.id ? { ...m, paid: !m.paid } : m);
  };

  const titles = { '/': 'Overview', '/calendar': 'Calendar', '/finance': 'Finance', '/venues': 'Venues', '/musicians': 'Musicians', '/roster': 'Roster', '/bulk': 'Bulk Generate' };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--app-bg)' }}>
      <SidebarV2 active={page} onNav={setPage}/>
      <div style={{ paddingLeft: 200 }}>
        <TopbarV2 title={titles[page] || ''}/>
        <main style={{ maxWidth: 1240, margin: '0 auto', padding: '24px 40px 64px' }}>
          {page === '/' && <OverviewPageV2 events={events} todays={todays} upcoming={upcoming} unpaidTotal={unpaidTotal} paidMonth={paidMonth} totalMonth={totalMonth} owed={owed} onOpen={setModal} onNav={setPage}/>}
          {page === '/calendar' && <CalendarPageV2 events={events} onOpen={setModal}/>}
          {page === '/finance' && <FinancePageV2 unpaid={unpaid} paid={paid} unpaidTotal={unpaidTotal} onOpen={setModal}/>}
          {page === '/venues' && <VenuesPageV2/>}
          {page === '/musicians' && <MusiciansPageV2/>}
          {page === '/roster' && <RosterPageV2/>}
          {page === '/bulk' && <BulkPageV2/>}
        </main>
      </div>
      {modal && <EventModalV2 ev={modal} onClose={() => setModal(null)} onTogglePaid={togglePaid}/>}
      {(page === '/' || page === '/calendar') && (
        <button
          onClick={() => alert('เพิ่มงานใหม่ (demo)')}
          style={{
            position: 'fixed', right: 28, bottom: 28, zIndex: 50,
            height: 60, padding: '0 24px', borderRadius: 999,
            fontSize: 15, fontWeight: 700,
            background: 'var(--app-accent)', color: '#fff',
            border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            display: 'inline-flex', alignItems: 'center', gap: 8,
            boxShadow: '0 10px 28px -6px color-mix(in srgb, var(--app-accent) 55%, transparent), 0 4px 12px rgba(0,0,0,0.1)',
            transition: 'transform 120ms, box-shadow 120ms',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)'; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}>
          <Plus size={20} strokeWidth={2.6}/> เพิ่มงาน
        </button>
      )}}
    </div>
  );
}

function PageHeaderV2({ eyebrow, title, action }) {
  const [first, ...rest] = title.split(' ');
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
      <div>
        <div style={{ fontSize: 12, color: 'var(--app-ink-mute)', marginBottom: 6 }}>{eyebrow}</div>
        <h1 className="display display-h1" style={{ fontSize: 44, lineHeight: 1, margin: 0, color: 'var(--app-ink)' }}>
          {first}<span className="italic-serif" style={{ color: 'var(--app-accent)' }}>{rest.length ? ' ' + rest.join(' ') : '.'}</span>
        </h1>
      </div>
      {action}
    </div>
  );
}

function OverviewPageV2({ events, todays, upcoming, unpaidTotal, paidMonth, totalMonth, owed, onOpen, onNav }) {
  const now = new Date();
  const dow = ['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'][now.getDay()];
  return (
    <div>
      <PageHeaderV2
        eyebrow={`${dow} · ${now.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}`}
        title="Overview"
        action={<button className="btn-brand" onClick={() => alert('เพิ่มงานใหม่ (demo)')}><Plus size={16} strokeWidth={2.4}/> เพิ่มงาน</button>}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
        <KPIV2 icon="Calendar" label="งานวันนี้" value={todays.length} sub={todays[0]?.venueName || 'ไม่มีงาน'} invert/>
        <KPIV2 icon="AlertC" label="ค้างจ่าย" value={`฿${unpaidTotal.toLocaleString('th-TH')}`} sub={`${events.filter(e=>!e.paid).length} รายการ`} tone="red"/>
        <KPIV2 icon="CheckC" label="จ่ายเดือนนี้" value={`฿${paidMonth.toLocaleString('th-TH')}`} sub={`จาก ฿${totalMonth.toLocaleString('th-TH')}`}/>
        <KPIV2 icon="Trend" label="งานทั้งเดือน" value={events.length} sub="รวมทุกสถานะ"/>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        <div>
          {todays.length > 0
            ? <TodayCardV2 ev={todays[0]} extra={todays.length - 1} onClick={onOpen}/>
            : <div style={{ background: 'var(--app-surface)', border: '1px solid var(--app-line)', borderRadius: 12, padding: 20 }}><div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--app-ink-mute)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>วันนี้</div><div className="display" style={{ fontSize: 24, color: 'var(--app-ink)' }}>ไม่มีคิว</div></div>}

          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 32, marginBottom: 12 }}>
            <h2 className="display display-h1" style={{ fontSize: 20, margin: 0, color: 'var(--app-ink)' }}>งานที่<span className="italic-serif" style={{ color: 'var(--app-accent)' }}>จะถึง</span></h2>
            <a href="#" onClick={e => {e.preventDefault(); onNav('/calendar');}} style={{ color: 'var(--app-brand)', fontSize: 13, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 2, textDecoration: 'none' }}>ดูทั้งหมด <ArrowUR size={13}/></a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {upcoming.slice(0, 6).map(e => <EventCardV2 key={e.id} ev={e} onClick={onOpen}/>)}
          </div>
        </div>
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <OwedWidgetV2 rows={owed.slice(0,3)} onSeeAll={() => onNav('/finance')}/>
          <TipWidgetV2/>
        </aside>
      </div>
    </div>
  );
}

function CalendarPageV2({ events, onOpen }) {
  return (
    <div>
      <PageHeaderV2 eyebrow="เมษายน · 2568" title="ปฏิทิน"
                    action={<button className="btn-brand" onClick={() => alert('เพิ่มงานใหม่ (demo)')}><Plus size={16} strokeWidth={2.4}/> เพิ่มงาน</button>}/>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        <MiniCalendarV2 events={events} onPick={onOpen}/>
        <aside>
          <SectionHeaderV2 emoji="📅" title="งาน เดือนนี้" count={events.length}/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {events.slice(0, 5).map(e => <EventCardV2 key={e.id} ev={e} onClick={onOpen}/>)}
          </div>
        </aside>
      </div>
    </div>
  );
}

function FinancePageV2({ unpaid, paid, unpaidTotal, onOpen }) {
  return (
    <div>
      <PageHeaderV2 eyebrow="เมษายน 2568" title="การเงิน"/>
      <div style={{ marginBottom: 32 }}>
        <FinanceHeroV2 total={unpaidTotal} count={unpaid.length}/>
      </div>
      <div style={{ marginBottom: 32 }}>
        <SectionHeaderV2 emoji="❌" title="ค้างจ่าย รอโอน" count={unpaid.length}/>
        {unpaid.length === 0
          ? <div style={{ border: '1px dashed var(--app-line)', borderRadius: 12, padding: '40px 20px', textAlign: 'center', color: 'var(--app-ink-dim)', fontSize: 13 }}>ไม่มีค้างจ่ายคนแทน 🎉</div>
          : <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{unpaid.map(e => <EventCardV2 key={e.id} ev={e} onClick={onOpen}/>)}</div>}
      </div>
      <div>
        <SectionHeaderV2 emoji="✅" title="จ่ายแล้ว เรียบร้อย" count={paid.length}/>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{paid.map(e => <EventCardV2 key={e.id} ev={e} onClick={onOpen}/>)}</div>
      </div>
    </div>
  );
}

window.AppV2 = AppV2;
