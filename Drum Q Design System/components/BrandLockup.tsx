export default function BrandLockup() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative w-8 h-8 rounded-lg bg-brand grid place-items-center">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="white" strokeWidth="1.5"/>
          <path d="M5 7h6M5 10h4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-brand-hot ring-2 ring-white" />
      </div>
      <div className="font-display text-[17px] font-bold tracking-[-0.02em] text-ink">
        Drum<span className="text-brand-hot">Q</span>
      </div>
    </div>
  );
}
