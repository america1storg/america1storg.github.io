'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import { ThemeToggleIcon } from './ThemeToggleIcon';

export function Navigation() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDark = theme === 'dark';

  return (
    <>
      {/* Desktop Navbar */}
      <nav
        className="hidden lg:flex fixed top-4 left-1/2 transform -translate-x-1/2 z-50 rounded-full shadow-2xl"
        style={{
          background: isDark ? 'rgba(0, 10, 35, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
          color: isDark ? '#fff' : '#000',
          width: 'auto',
          maxWidth: '95vw',
        }}
      >
        <div className="pl-6 pr-12">
          <div className="flex justify-between items-center h-14 gap-8">
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <Image
                src={isDark ? "/logo-dark.png" : "/logo-light.png"}
                alt="America First"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <span className="text-lg font-bold whitespace-nowrap" style={{ color: isDark ? '#fff' : '#000' }}>
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
                href="/resources"
                className="transition-colors text-sm font-medium hover:opacity-80"
                style={{
                  color: pathname === '/resources' ? '#3b82f6' : isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                }}
              >
                Resources
              </Link>
              <Link
                href="/get-involved"
                className="transition-colors text-sm font-medium hover:opacity-80"
                style={{
                  color: pathname === '/get-involved' ? '#3b82f6' : isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                }}
              >
                Volunteer
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
                href="/search"
                className="transition-colors hover:opacity-80"
                title="Search"
                style={{
                  color: pathname === '/search' ? '#3b82f6' : isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </Link>
              <ThemeToggleIcon />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile & Tablet Navbar */}
      <nav
        className="lg:hidden fixed top-4 left-4 right-4 z-50 rounded-2xl shadow-2xl"
        style={{
          background: isDark ? 'rgba(0, 10, 35, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
          color: isDark ? '#fff' : '#000',
        }}
      >
        <div className="px-4">
          <div className="flex justify-between items-center h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={isDark ? "/logo-dark.png" : "/logo-light.png"}
                alt="America First"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="text-base font-bold" style={{ color: isDark ? '#fff' : '#000' }}>
                America First
              </span>
            </Link>

            {/* Right Side: Theme + Hamburger */}
            <div className="flex items-center gap-3">
              <ThemeToggleIcon />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2"
                style={{ cursor: 'pointer', color: isDark ? '#fff' : '#000' }}
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  // Close Icon
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                ) : (
                  // Hamburger Icon
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="pb-4 pt-2 space-y-2">
              <Link
                href="/search"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium"
                style={{
                  background: pathname === '/search'
                    ? isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'
                    : 'transparent',
                  color: pathname === '/search' ? '#3b82f6' : isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                Search
              </Link>
              <Link
                href="/articles"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg transition-all font-medium"
                style={{
                  background: pathname === '/articles' || pathname?.startsWith('/articles/')
                    ? isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'
                    : 'transparent',
                  color: pathname === '/articles' || pathname?.startsWith('/articles/')
                    ? '#3b82f6'
                    : isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                }}
              >
                Articles
              </Link>
              <Link
                href="/resources"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg transition-all font-medium"
                style={{
                  background: pathname === '/resources'
                    ? isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'
                    : 'transparent',
                  color: pathname === '/resources' ? '#3b82f6' : isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                }}
              >
                Resources
              </Link>
              <Link
                href="/get-involved"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg transition-all font-medium"
                style={{
                  background: pathname === '/get-involved'
                    ? isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'
                    : 'transparent',
                  color: pathname === '/get-involved' ? '#3b82f6' : isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                }}
              >
                Volunteer
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg transition-all font-medium"
                style={{
                  background: pathname === '/about'
                    ? isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'
                    : 'transparent',
                  color: pathname === '/about' ? '#3b82f6' : isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                }}
              >
                About
              </Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
