const SEED = [
  { id: 1, date: '2026-04-18', venueName: 'Saxophone Pub', sub: 'ป้อง', start: '20:30', end: '00:30', fee: 1500, paid: false, status: 'จ้างคนแทน', today: true },
  { id: 2, date: '2026-04-18', venueName: 'The Rock Pub', sub: 'มิว', start: '21:00', end: '01:00', fee: 1800, paid: false, status: 'จ้างคนแทน', today: true },
  { id: 3, date: '2026-04-20', venueName: 'Brown Sugar', sub: 'ฉันเอง', start: '20:00', end: '23:00', fee: 2200, paid: true, status: 'งานวง' },
  { id: 4, date: '2026-04-22', venueName: 'Maggie Choo\'s', sub: 'โอ๋', start: '21:30', end: '01:30', fee: 1500, paid: false, status: 'จ้างคนแทน' },
  { id: 5, date: '2026-04-24', venueName: 'Fungjai Studio', sub: 'ฉันเอง', start: '19:00', end: '22:00', fee: 2500, paid: true, status: 'งานวง' },
  { id: 6, date: '2026-04-25', venueName: 'The Living Room', sub: 'ป้อง', start: '20:30', end: '00:30', fee: 1500, paid: false, status: 'จ้างคนแทน' },
  { id: 7, date: '2026-04-27', venueName: 'Saxophone Pub', sub: 'ฉันเอง', start: '20:30', end: '00:30', fee: 2200, paid: true, status: 'งานวง' },
  { id: 8, date: '2026-04-30', venueName: 'Overtone', sub: 'มิว', start: '21:00', end: '01:00', fee: 1800, paid: false, status: 'จ้างคนแทน' },
  { id: 9, date: '2026-05-02', venueName: 'Mellow Pub', sub: 'ฉันเอง', start: '20:00', end: '23:30', fee: 2000, paid: false, status: 'งานวง' },
];

function App() {
  const [page, setPage] = useState('/');
  const [events, setEvents] = useState(SEED);
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

  const titles = { '/': 'Overview', '/calendar': 'Calendar', '/finance': 'Finance' };

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Sidebar active={page} onNav={setPage} onNew={() => alert('เพิ่มงานใหม่ (demo)')}/>
      <div style={{ paddingLeft: 240 }}>
        <Topbar title={titles[page] || ''}/>
        <main style={{ maxWidth: 1240, margin: '0 auto', padding: '24px 40px 64px' }}>
          {page === '/' && <OverviewPage events={events} todays={todays} upcoming={upcoming} unpaidTotal={unpaidTotal} paidMonth={paidMonth} totalMonth={totalMonth} owed={owed} onOpen={setModal} onNav={setPage}/>}
          {page === '/calendar' && <CalendarPage events={events} onOpen={setModal}/>}
          {page === '/finance' && <FinancePage unpaid={unpaid} paid={paid} unpaidTotal={unpaidTotal} onOpen={setModal}/>}
          {(page !== '/' && page !== '/calendar' && page !== '/finance') && <Stub page={page}/>}
        </main>
      </div>
      {modal && <EventModal ev={modal} onClose={() => setModal(null)} onTogglePaid={togglePaid}/>}
    </div>
  );
}

function PageHeader({ eyebrow, title, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
      <div>
        <div style={{ fontSize: 12, color: '#5a5a66', marginBottom: 6 }}>{eyebrow}</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1, margin: 0 }}>{title}</h1>
      </div>
      {action}
    </div>
  );
}

function OverviewPage({ events, todays, upcoming, unpaidTotal, paidMonth, totalMonth, owed, onOpen, onNav }) {
  const now = new Date();
  const dow = ['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'][now.getDay()];
  return (
    <div>
      <PageHeader
        eyebrow={`${dow} · ${now.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}`}
        title="Overview"
        action={<button className="btn-brand" onClick={() => alert('เพิ่มงาน (demo)')}><Plus size={15}/> เพิ่มงาน</button>}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
        <KPI icon="Calendar" label="งานวันนี้" value={todays.length} sub={todays[0]?.venueName || 'ไม่มีงาน'} invert/>
        <KPI icon="AlertC" label="ค้างจ่าย" value={`฿${unpaidTotal.toLocaleString('th-TH')}`} sub={`${events.filter(e=>!e.paid).length} รายการ`} tone="red"/>
        <KPI icon="CheckC" label="จ่ายเดือนนี้" value={`฿${paidMonth.toLocaleString('th-TH')}`} sub={`จาก ฿${totalMonth.toLocaleString('th-TH')}`}/>
        <KPI icon="Trend" label="งานทั้งเดือน" value={events.length} sub="รวมทุกสถานะ"/>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        <div>
          {todays.length > 0
            ? <TodayCard ev={todays[0]} extra={todays.length - 1} onClick={onOpen}/>
            : <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: 20 }}><div style={{ fontSize: 10.5, fontWeight: 600, color: '#5a5a66', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>วันนี้</div><div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>ไม่มีคิว</div></div>}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 32, marginBottom: 12 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>งานที่จะถึง</h2>
            <a href="#" onClick={e => {e.preventDefault(); onNav('/calendar');}} style={{ color: '#0a0a0a', fontSize: 13, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 2, textDecoration: 'none' }}>ดูทั้งหมด <ArrowUR size={13}/></a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {upcoming.slice(0, 6).map(e => <EventCard key={e.id} ev={e} onClick={onOpen}/>)}
          </div>
        </div>
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <OwedWidget rows={owed.slice(0,3)} onSeeAll={() => onNav('/finance')}/>
          <ShortcutWidget onGo={() => {}}/>
          <TipWidget/>
        </aside>
      </div>
    </div>
  );
}

function CalendarPage({ events, onOpen }) {
  return (
    <div>
      <PageHeader eyebrow="เมษายน · 2568" title="ปฏิทิน"
                  action={<button className="btn-brand" onClick={() => alert('เพิ่มงาน')}><Plus size={15}/> เพิ่มงาน</button>}/>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        <MiniCalendar events={events} onPick={onOpen}/>
        <aside>
          <SectionHeader emoji="📅" title="งานในเดือนนี้" count={events.length}/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {events.slice(0, 5).map(e => <EventCard key={e.id} ev={e} onClick={onOpen}/>)}
          </div>
        </aside>
      </div>
    </div>
  );
}

function FinancePage({ unpaid, paid, unpaidTotal, onOpen }) {
  return (
    <div>
      <PageHeader eyebrow="เมษายน 2568" title="การเงิน"/>
      <div style={{ marginBottom: 32 }}>
        <FinanceHero total={unpaidTotal} count={unpaid.length}/>
      </div>
      <div style={{ marginBottom: 32 }}>
        <SectionHeader emoji="❌" title="ค้างจ่าย" count={unpaid.length}/>
        {unpaid.length === 0
          ? <div style={{ border: '1px dashed #e5e5e5', borderRadius: 12, padding: '40px 20px', textAlign: 'center', color: '#8e8e98', fontSize: 13 }}>ไม่มีค้างจ่ายคนแทน 🎉</div>
          : <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{unpaid.map(e => <EventCard key={e.id} ev={e} onClick={onOpen}/>)}</div>}
      </div>
      <div>
        <SectionHeader emoji="✅" title="จ่ายแล้ว" count={paid.length}/>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{paid.map(e => <EventCard key={e.id} ev={e} onClick={onOpen}/>)}</div>
      </div>
    </div>
  );
}

function Stub({ page }) {
  return (
    <div style={{ paddingTop: 100, textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, marginBottom: 8 }}>{page}</div>
      <div style={{ color: '#8e8e98', fontSize: 14 }}>หน้านี้ยังไม่ได้สร้างใน kit นี้</div>
    </div>
  );
}

window.App = App;
