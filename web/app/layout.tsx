import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk, IBM_Plex_Sans_Thai, Playfair_Display } from 'next/font/google';
import BottomTabs from '@/components/BottomTabs';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const thai = IBM_Plex_Sans_Thai({ subsets: ['thai','latin'], weight: ['400','500','600','700'], variable: '--font-thai', display: 'swap' });
const serif = Playfair_Display({ subsets: ['latin'], style: ['italic','normal'], weight: ['400','700'], variable: '--font-serif', display: 'swap' });

export const metadata: Metadata = {
  title: 'DrumQ · Queue Manager',
  description: 'จัดการคิวงานและคนแทนสำหรับมือกลอง',
  manifest: '/manifest.json',
};
export const viewport: Viewport = { themeColor: '#f6faff', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${inter.variable} ${display.variable} ${thai.variable} ${serif.variable}`}>
      <body className="font-sans min-h-screen">
        <div className="lg:flex">
          <Sidebar />
          <div className="flex-1 min-w-0 lg:pl-[200px]">
            <Topbar />
            <main className="mx-auto max-w-[1240px] px-5 lg:px-10 py-6 lg:py-10">
              {children}
            </main>
          </div>
        </div>
        <BottomTabs />
      </body>
    </html>
  );
}
