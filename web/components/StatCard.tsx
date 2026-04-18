import { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

type Props = {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subLabel?: string;
  variant?: 'default' | 'hero' | 'danger';
  accentColor?: string;
};

export default function StatCard({ icon: Icon, label, value, subLabel, variant = 'default', accentColor }: Props) {
  const hero = variant === 'hero';
  return (
    <div className={clsx(
      'relative overflow-hidden rounded-3xl p-5 transition active:scale-[0.98]',
      hero
        ? 'bg-brand-grad text-white shadow-glow border-0'
        : 'bg-white dark:bg-ink-soft border border-line shadow-soft'
    )}>
      {hero && (
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full
                        bg-[radial-gradient(circle,rgba(255,255,255,0.22),transparent_70%)]" />
      )}
      <div className={clsx('flex items-center gap-1.5 text-xs font-semibold mb-2.5',
        hero ? 'text-white/90' : 'text-ink-mute')}>
        <Icon size={14} strokeWidth={1.8} />
        {label}
      </div>
      <div className={clsx('num text-[34px] font-bold leading-none',
        variant === 'danger' && 'text-[#ff3b5c]')} style={accentColor ? { color: accentColor } : {}}>
        {value}
      </div>
      {subLabel && (
        <div className={clsx('text-[11px] mt-2 font-medium',
          hero ? 'text-white/80' : 'text-ink-dim')}>{subLabel}</div>
      )}
    </div>
  );
}
