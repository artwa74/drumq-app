const sideMainV2 = [
  { id: '/', icon: 'Home', label: 'Overview' },
  { id: '/calendar', icon: 'Calendar', label: 'ปฏิทิน' },
  { id: '/finance', icon: 'Wallet', label: 'การเงิน' },
];
const sideManageV2 = [
  { id: '/venues', icon: 'Building', label: 'ร้าน' },
  { id: '/musicians', icon: 'Users', label: 'นักดนตรี' },
  { id: '/roster', icon: 'Calendar', label: 'ผังประจำ' },
  { id: '/bulk', icon: 'Zap', label: 'Bulk Generate' },
];

function SidebarV2({ active, onNav }) {
  const Item = ({ id, icon, label }) => {
    const Icon = window[icon];
    const isActive = active === id;
    return (
      <a onClick={(e) => { e.preventDefault(); onNav(id); }} href="#"
         style={{
           display: 'flex', alignItems: 'center', gap: 12,
           padding: '8px 12px', borderRadius: 6,
           fontSize: 13.5, fontWeight: 500, textDecoration: 'none',
           position: 'relative', transition: 'background 120ms, color 120ms',
           background: isActive ? 'var(--app-surface-2)' : 'transparent',
           color: isActive ? 'var(--app-ink)' : 'var(--app-ink-mute)',
         }}
         onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = 'var(--app-surface-2)'; e.currentTarget.style.color = 'var(--app-ink)'; } }}
         onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--app-ink-mute)'; } }}>
        {isActive && <span style={{ position: 'absolute', left: 0, top: 6, bottom: 6, width: 3, background: 'var(--app-accent)', borderRadius: '0 2px 2px 0' }}/>}
        <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8}/>
        <span>{label}</span>
      </a>
    );
  };
  const SectionLabel = ({ children }) => (
    <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--app-ink-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', padding: '0 12px', marginBottom: 8 }}>{children}</div>
  );
  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0, bottom: 0, width: 200,
      display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--app-line)',
      background: 'var(--app-surface)', zIndex: 40,
    }}>
      <div style={{ padding: 20, borderBottom: '1px solid var(--app-line)' }}><BrandLockupV2/></div>
      <div style={{ padding: '20px 12px', flex: 1 }}>
        <SectionLabel>Menu</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>{sideMainV2.map(i => <Item key={i.id} {...i}/>)}</div>
        <div style={{ height: 20 }}/>
        <SectionLabel>Manage</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>{sideManageV2.map(i => <Item key={i.id} {...i}/>)}</div>
      </div>
      <div style={{ padding: 12, borderTop: '1px solid var(--app-line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 8, borderRadius: 6, cursor: 'pointer' }}>
          <div className="display" style={{ width: 32, height: 32, borderRadius: 6, background: 'var(--app-brand)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 13 }}>A</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--app-ink)' }}>You</div>
            <div style={{ fontSize: 11, color: 'var(--app-ink-mute)' }}>Personal</div>
          </div>
          <Settings size={14} style={{ color: 'var(--app-ink-dim)' }}/>
        </div>
      </div>
    </aside>
  );
}

function TopbarV2({ title }) {
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 30, background: 'color-mix(in srgb, var(--app-surface) 90%, transparent)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--app-line)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 40px', height: 56, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--app-ink-mute)' }}>{title}</div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, background: 'var(--app-surface-2)', border: '1px solid var(--app-line)', borderRadius: 8, padding: '6px 12px', width: 300 }}>
          <Search size={14} style={{ color: 'var(--app-ink-dim)' }}/>
          <input placeholder="ค้นหาร้าน, คนแทน..." style={{ background: 'transparent', outline: 'none', flex: 1, fontSize: 13, border: 'none', fontFamily: 'inherit', color: 'var(--app-ink)' }}/>
          <kbd style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 10, fontWeight: 500, color: 'var(--app-ink-dim)', background: 'var(--app-surface)', border: '1px solid var(--app-line)', borderRadius: 3, padding: '2px 6px' }}>⌘K</kbd>
        </div>
        <button style={{ width: 36, height: 36, display: 'grid', placeItems: 'center', borderRadius: 8, color: 'var(--app-ink-mute)', background: 'transparent', border: 'none', cursor: 'pointer', position: 'relative' }}>
          <Bell size={15}/>
          <span style={{ position: 'absolute', top: 8, right: 10, width: 6, height: 6, borderRadius: 999, background: 'var(--app-accent)' }}/>
        </button>
      </div>
    </header>
  );
}

Object.assign(window, { SidebarV2, TopbarV2 });
