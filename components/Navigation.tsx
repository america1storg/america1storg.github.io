'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import { ThemeToggleIcon } from './ThemeToggleIcon';

export function Navigation() {
  const pathname = usePathname();
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <nav
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 rounded-full shadow-2xl"
      style={{
        background: isDark ? 'rgba(0, 10, 35, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
        color: isDark ? '#fff' : '#000',
        width: 'auto',
        maxWidth: '95vw',
      }}
    >
      <div className="px-6">
        <div className="flex justify-between items-center h-14 gap-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src={isDark ? "/logo-dark.png" : "/logo-light.png"}
              alt="America First"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <span className="text-lg font-bold" style={{ color: isDark ? '#fff' : '#000' }}>
              America First
            </span>
          </Link>
          <div className="flex gap-6 items-center">
            <Link
              href="/articles"
              className="transition-colors text-sm font-medium hover:opacity-80"
              style={{
                color: pathname === '/articles' || pathname?.startsWith('/articles/')
                  ? '#3b82f6'
                  : isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
              }}
            >
              Articles
            </Link>
            <Link
              href="/about"
              className="transition-colors text-sm font-medium hover:opacity-80"
              style={{
                color: pathname === '/about' ? '#3b82f6' : isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
              }}
            >
              About
            </Link>
            <Link
              href="/admin"
              className="px-5 py-2 rounded-full hover:opacity-90 transition-all text-sm font-semibold"
              style={{
                background: isDark ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.9)',
                color: isDark ? '#000' : '#fff',
              }}
            >
              Admin
            </Link>
            <ThemeToggleIcon />
          </div>
        </div>
      </div>
    </nav>
  );
}
