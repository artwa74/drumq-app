'use client';
import { Search, Bell, Command } from 'lucide-react';
import { usePathname } from 'next/navigation';
import BrandLockup from './BrandLockup';

const titles: Record<string, string> = {
  '/': 'Overview',
  '/calendar': 'Calendar',
  '/finance': 'Finance',
  '/settings': 'Settings',
};

export default function Topbar() {
  const pathname = usePathname();
  const title = titles[pathname] || '';

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-line">
      <div className="max-w-[1240px] mx-auto px-5 lg:px-10 h-14 flex items-center gap-4">
        <div className="lg:hidden"><BrandLockup /></div>
        <div className="hidden lg:block text-[13px] font-semibold text-ink-mute">
          {title}
        </div>

        <div className="hidden md:flex items-center gap-2 ml-auto bg-surface-2 border border-line rounded-lg px-3 py-1.5 w-[300px]">
          <Search size={14} className="text-ink-dim"/>
          <input placeholder="ค้นหาร้าน, คนแทน..." className="bg-transparent outline-none flex-1 text-[13px] placeholder:text-ink-dim" />
          <kbd className="hidden lg:flex items-center gap-0.5 text-[10px] font-medium text-ink-dim bg-white border border-line rounded px-1.5 py-0.5">
            <Command size={10}/>K
          </kbd>
        </div>

        <button className="ml-auto md:ml-0 w-9 h-9 grid place-items-center rounded-lg text-ink-mute hover:bg-surface-2 transition relative">
          <Bell size={15}/>
          <span className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
        </button>
      </div>
    </header>
  );
}
