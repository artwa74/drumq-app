'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Plus, Wallet, Settings } from 'lucide-react';
import clsx from 'clsx';

const tabs = [
  { href: '/', icon: Home, label: 'หน้าแรก' },
  { href: '/calendar', icon: Calendar, label: 'ปฏิทิน' },
  { href: '/events/new', icon: Plus, label: 'เพิ่ม' },
  { href: '/finance', icon: Wallet, label: 'การเงิน' },
  { href: '/settings', icon: Settings, label: 'ตั้งค่า' },
];

export default function BottomTabs() {
  const pathname = usePathname();
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-line flex"
         style={{ paddingBottom: 'var(--safe-bottom)' }}>
      {tabs.map(t => {
        const Icon = t.icon;
        const active = t.href === pathname || (t.href !== '/' && pathname.startsWith(t.href));
        return (
          <Link key={t.href} href={t.href}
                className={clsx(
                  'flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[10.5px] font-medium transition',
                  active ? 'text-brand' : 'text-ink-mute'
                )}>
            <Icon size={20} strokeWidth={active ? 2 : 1.7} />
            <span>{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
