function BrandLockup() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ position: 'relative', width: 32, height: 32, borderRadius: 8, background: '#0a0a0a', display: 'grid', placeItems: 'center' }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="white" strokeWidth="1.5"/>
          <path d="M5 7h6M5 10h4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: 999, background: '#e11d48', boxShadow: '0 0 0 2px #fff' }} />
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em', color: '#0c0c10' }}>
        Drum<span style={{ color: '#e11d48' }}>Q</span>
      </div>
    </div>
  );
}
window.BrandLockup = BrandLockup;
