'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Wallet, Settings, Plus, Users, Building2, Zap } from 'lucide-react';
import clsx from 'clsx';
import BrandLockup from './BrandLockup';

const main = [
  { href: '/', icon: Home, label: 'Overview' },
  { href: '/calendar', icon: Calendar, label: 'ปฏิทิน' },
  { href: '/finance', icon: Wallet, label: 'การเงิน' },
];
const manage = [
  { href: '/settings/venues', icon: Building2, label: 'ร้าน' },
  { href: '/settings/musicians', icon: Users, label: 'นักดนตรี' },
  { href: '/settings/roster', icon: Calendar, label: 'ผังประจำ' },
  { href: '/settings/bulk', icon: Zap, label: 'Bulk Generate' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const Item = ({ href, icon: Icon, label }: any) => {
    const active = pathname === href || (href !== '/' && pathname.startsWith(href));
    return (
      <Link href={href} className={clsx(
        'group flex items-center gap-3 px-3 py-2 rounded-md text-[13.5px] font-medium transition relative',
        active ? 'bg-surface-2 text-ink' : 'text-ink-mute hover:bg-surface-2 hover:text-ink'
      )}>
        {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-brand-hot rounded-r-full" />}
        <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
        <span className="tracking-tight">{label}</span>
      </Link>
    );
  };

  return (
    <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-[240px] flex-col border-r border-line bg-white z-40">
      <div className="px-5 py-5 border-b border-line">
        <BrandLockup />
      </div>

      <div className="px-3 py-4 flex-1">
        <Link href="/events/new" className="btn-brand w-full mb-5">
          <Plus size={15}/> เพิ่มงานใหม่
        </Link>

        <div className="text-[10px] font-semibold text-ink-dim uppercase tracking-[0.12em] px-3 mb-2">Menu</div>
        <div className="space-y-0.5">{main.map(i => <Item key={i.href} {...i} />)}</div>

        <div className="text-[10px] font-semibold text-ink-dim uppercase tracking-[0.12em] px-3 mt-5 mb-2">Manage</div>
        <div className="space-y-0.5">{manage.map(i => <Item key={i.href} {...i} />)}</div>
      </div>

      <div className="p-3 border-t border-line">
        <Link href="/settings" className="flex items-center gap-3 p-2 rounded-md hover:bg-surface-2 transition">
          <div className="w-8 h-8 rounded-md bg-brand grid place-items-center text-white font-bold text-[12px] font-display">A</div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold truncate">You</div>
            <div className="text-[11px] text-ink-mute">Personal</div>
          </div>
          <Settings size={14} className="text-ink-dim"/>
        </Link>
      </div>
    </aside>
  );
}
