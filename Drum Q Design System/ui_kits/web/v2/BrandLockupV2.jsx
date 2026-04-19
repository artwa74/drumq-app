function BrandLockupV2() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ position: 'relative', width: 32, height: 32, borderRadius: 8, background: 'var(--app-brand)', display: 'grid', placeItems: 'center' }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="white" strokeWidth="1.5"/>
          <path d="M5 7h6M5 10h4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: 999, background: 'var(--app-accent)', boxShadow: '0 0 0 2px var(--app-surface)' }} />
      </div>
      <div className="display" style={{ fontSize: 18, color: 'var(--app-ink)' }}>
        Drum<span style={{ color: 'var(--app-accent)' }} className="italic-serif">Q</span>
      </div>
    </div>
  );
}
window.BrandLockupV2 = BrandLockupV2;
