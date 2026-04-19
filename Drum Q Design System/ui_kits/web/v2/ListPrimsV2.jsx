// Shared list/table primitives used across manage pages
function TableShellV2({ children }) {
  return (
    <div style={{ background: 'var(--app-surface)', border: '1px solid var(--app-line)', borderRadius: 12, overflow: 'hidden' }}>
      {children}
    </div>
  );
}

function TableRowV2({ children, onClick, accent }) {
  const [h, setH] = useState(false);
  return (
    <div onClick={onClick}
         onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
         style={{
           display: 'grid', gridTemplateColumns: 'inherit', alignItems: 'center',
           padding: '14px 20px', borderTop: '1px solid var(--app-line)',
           background: h ? 'var(--app-surface-2)' : 'transparent',
           cursor: onClick ? 'pointer' : 'default',
           transition: 'background 100ms', position: 'relative',
         }}>
      {accent && h && <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: 'var(--app-accent)' }}/>}
      {children}
    </div>
  );
}

function THeadV2({ cols }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'inherit',
      padding: '10px 20px', fontSize: 10.5, fontWeight: 700,
      color: 'var(--app-ink-dim)', textTransform: 'uppercase', letterSpacing: '0.12em',
      background: 'var(--app-surface-2)',
    }}>
      {cols.map((c, i) => <div key={i} style={{ textAlign: c.align || 'left' }}>{c.label}</div>)}
    </div>
  );
}

function TagV2({ children, tone }) {
  const palette = {
    brand: { bg: 'color-mix(in srgb, var(--app-brand) 14%, transparent)', fg: 'var(--app-brand)' },
    accent: { bg: 'color-mix(in srgb, var(--app-accent) 14%, transparent)', fg: 'var(--app-accent)' },
    mute: { bg: 'var(--app-surface-2)', fg: 'var(--app-ink-mute)' },
  };
  const t = palette[tone || 'mute'];
  return <span style={{ fontSize: 10.5, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: t.bg, color: t.fg, letterSpacing: '0.04em' }}>{children}</span>;
}

function InitialsV2({ name, color }) {
  const p = name.trim().split(/\s+/);
  const init = ((p[0]?.[0]||'')+(p[1]?.[0]||'')).toUpperCase() || name.slice(0, 2).toUpperCase();
  return (
    <div className="display" style={{
      flex: 'none', width: 36, height: 36, borderRadius: 8,
      background: color || 'var(--app-brand)', color: '#fff',
      display: 'grid', placeItems: 'center', fontSize: 13,
    }}>{init}</div>
  );
}

function ToolbarV2({ search, onSearch, right, placeholder }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: 'var(--app-surface)', border: '1px solid var(--app-line)', borderRadius: 10, padding: '8px 14px', maxWidth: 320 }}>
        <Search size={14} style={{ color: 'var(--app-ink-dim)' }}/>
        <input value={search} onChange={e => onSearch(e.target.value)} placeholder={placeholder || 'ค้นหา…'}
               style={{ background: 'transparent', outline: 'none', flex: 1, border: 'none', fontSize: 13, fontFamily: 'inherit', color: 'var(--app-ink)' }}/>
      </div>
      {right}
    </div>
  );
}

function EmptyStateV2({ title, sub }) {
  return (
    <div style={{ border: '1px dashed var(--app-line)', borderRadius: 12, padding: '40px 20px', textAlign: 'center' }}>
      <div className="display" style={{ fontSize: 18, color: 'var(--app-ink)', marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 13, color: 'var(--app-ink-dim)' }}>{sub}</div>
    </div>
  );
}

function DrawerV2({ open, onClose, children, title }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(15,15,25,0.35)', backdropFilter: 'blur(4px)' }}/>
      <div style={{ position: 'relative', width: 420, background: 'var(--app-surface)', color: 'var(--app-ink)', height: '100%', padding: 24, overflowY: 'auto', boxShadow: '-12px 0 40px rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: 'var(--app-ink-mute)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>{title}</div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'var(--app-surface-2)', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--app-ink)' }}><X size={14}/></button>
        </div>
        {children}
      </div>
    </div>
  );
}

Object.assign(window, { TableShellV2, TableRowV2, THeadV2, TagV2, InitialsV2, ToolbarV2, EmptyStateV2, DrawerV2 });
