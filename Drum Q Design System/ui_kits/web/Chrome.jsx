const sideMain = [
  { id: '/', icon: 'Home', label: 'Overview' },
  { id: '/calendar', icon: 'Calendar', label: 'ปฏิทิน' },
  { id: '/finance', icon: 'Wallet', label: 'การเงิน' },
];
const sideManage = [
  { id: '/venues', icon: 'Building', label: 'ร้าน' },
  { id: '/musicians', icon: 'Users', label: 'นักดนตรี' },
  { id: '/roster', icon: 'Calendar', label: 'ผังประจำ' },
  { id: '/bulk', icon: 'Zap', label: 'Bulk Generate' },
];

function Sidebar({ active, onNav, onNew }) {
  const Item = ({ id, icon, label }) => {
    const Icon = window[icon];
    const isActive = active === id;
    return (
      <a onClick={(e) => { e.preventDefault(); onNav(id); }}
         href="#"
         style={{
           display: 'flex', alignItems: 'center', gap: 12,
           padding: '8px 12px', borderRadius: 6,
           fontSize: 13.5, fontWeight: 500, textDecoration: 'none',
           position: 'relative', transition: 'background 120ms, color 120ms',
           background: isActive ? '#fafafa' : 'transparent',
           color: isActive ? '#0c0c10' : '#5a5a66',
         }}
         onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = '#fafafa'; e.currentTarget.style.color = '#0c0c10'; } }}
         onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#5a5a66'; } }}>
        {isActive && <span style={{ position: 'absolute', left: 0, top: 6, bottom: 6, width: 3, background: '#e11d48', borderRadius: '0 2px 2px 0' }}/>}
        <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8}/>
        <span style={{ letterSpacing: '-0.01em' }}>{label}</span>
      </a>
    );
  };
  const SectionLabel = ({ children }) => (
    <div style={{ fontSize: 10, fontWeight: 600, color: '#8e8e98', textTransform: 'uppercase', letterSpacing: '0.12em', padding: '0 12px', marginBottom: 8 }}>{children}</div>
  );
  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0, bottom: 0, width: 240,
      display: 'flex', flexDirection: 'column', borderRight: '1px solid #e5e5e5',
      background: '#fff', zIndex: 40,
    }}>
      <div style={{ padding: '20px', borderBottom: '1px solid #e5e5e5' }}><BrandLockup/></div>
      <div style={{ padding: '16px 12px', flex: 1 }}>
        <button className="btn-brand" style={{ width: '100%', marginBottom: 20, justifyContent: 'center' }} onClick={onNew}>
          <Plus size={15}/> เพิ่มงานใหม่
        </button>
        <SectionLabel>Menu</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>{sideMain.map(i => <Item key={i.id} {...i}/>)}</div>
        <div style={{ height: 20 }}/>
        <SectionLabel>Manage</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>{sideManage.map(i => <Item key={i.id} {...i}/>)}</div>
      </div>
      <div style={{ padding: 12, borderTop: '1px solid #e5e5e5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 8, borderRadius: 6, cursor: 'pointer' }}>
          <div style={{ width: 32, height: 32, borderRadius: 6, background: '#0a0a0a', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 12, fontFamily: 'var(--font-display)' }}>A</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>You</div>
            <div style={{ fontSize: 11, color: '#5a5a66' }}>Personal</div>
          </div>
          <Settings size={14} style={{ color: '#8e8e98' }}/>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ title }) {
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 30, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e5e5e5' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 40px', height: 56, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#5a5a66' }}>{title}</div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: 8, padding: '6px 12px', width: 300 }}>
          <Search size={14} style={{ color: '#8e8e98' }}/>
          <input placeholder="ค้นหาร้าน, คนแทน..." style={{ background: 'transparent', outline: 'none', flex: 1, fontSize: 13, border: 'none', fontFamily: 'inherit' }}/>
          <kbd style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 10, fontWeight: 500, color: '#8e8e98', background: '#fff', border: '1px solid #e5e5e5', borderRadius: 3, padding: '2px 6px' }}>⌘K</kbd>
        </div>
        <button style={{ width: 36, height: 36, display: 'grid', placeItems: 'center', borderRadius: 8, color: '#5a5a66', background: 'transparent', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 120ms' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <Bell size={15}/>
          <span style={{ position: 'absolute', top: 8, right: 10, width: 6, height: 6, borderRadius: 999, background: '#f43f5e' }}/>
        </button>
      </div>
    </header>
  );
}

Object.assign(window, { Sidebar, Topbar });
