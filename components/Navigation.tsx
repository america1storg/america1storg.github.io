'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import { ThemeToggle } from './ThemeToggle';

export function Navigation() {
  const pathname = usePathname();
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: isDark ? 'rgba(2, 2, 8, 0.85)' : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.04)' : '1px solid rgba(0, 0, 0, 0.08)',
        color: isDark ? '#fff' : '#000',
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo-icon.png" alt="America First" width={32} height={32} className="w-8 h-8" />
            <span className="text-xl font-bold" style={{ color: isDark ? '#fff' : '#000' }}>
              America First
            </span>
          </Link>
          <div className="flex gap-6 items-center">
            <Link
              href="/articles"
              className="transition-colors"
              style={{
                color: pathname === '/articles' || pathname?.startsWith('/articles/')
                  ? '#3b82f6'
                  : isDark ? '#fff' : '#000',
              }}
            >
              Articles
            </Link>
            <Link
              href="/about"
              className="transition-colors"
              style={{
                color: pathname === '/about' ? '#3b82f6' : isDark ? '#fff' : '#000',
              }}
            >
              About
            </Link>
            <Link
              href="/admin"
              className="px-4 py-2 backdrop-blur-sm rounded-lg hover:bg-opacity-20 transition-all text-sm font-semibold"
              style={{
                background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
                color: isDark ? '#fff' : '#000',
              }}
            >
              Admin
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
