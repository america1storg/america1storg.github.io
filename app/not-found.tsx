'use client';

import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export default function NotFound() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: isDark ? '#000a2e' : '#f8f9fa',
        color: isDark ? '#fff' : '#000',
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      }}
    >
      <Navigation />

      <main className="flex-1 flex items-center justify-center px-[6vw] pt-32 pb-24">
        <div className="text-center max-w-[600px]">
          {/* 404 Large Number */}
          <h1
            className="text-9xl md:text-[180px] font-extrabold leading-none mb-4"
            style={{
              background: isDark
                ? 'linear-gradient(135deg, #3b82f6 0%, #ef4444 100%)'
                : 'linear-gradient(135deg, #2563eb 0%, #dc2626 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            404
          </h1>

          {/* Icon */}
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto mb-6"
            style={{ color: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)' }}
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>

          {/* Message */}
          <h2
            className="text-3xl md:text-5xl font-bold mb-4"
            style={{ color: isDark ? '#fff' : '#000' }}
          >
            Page Not Found
          </h2>
          <p
            className="text-lg md:text-xl mb-8 leading-relaxed"
            style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}
          >
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-lg"
            >
              Go to Homepage
            </Link>
            <Link
              href="/search"
              className="px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105"
              style={{
                background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                color: isDark ? '#fff' : '#000',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.2)',
              }}
            >
              Search Site
            </Link>
          </div>

          {/* Quick Links */}
          <div className="mt-12 pt-8 border-t" style={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}>
            <p
              className="text-sm uppercase tracking-wider mb-4"
              style={{ color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}
            >
              Quick Links
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <Link
                href="/articles"
                className="hover:underline"
                style={{ color: '#3b82f6' }}
              >
                Articles
              </Link>
              <span style={{ color: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)' }}>•</span>
              <Link
                href="/resources"
                className="hover:underline"
                style={{ color: '#3b82f6' }}
              >
                Resources
              </Link>
              <span style={{ color: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)' }}>•</span>
              <Link
                href="/get-involved"
                className="hover:underline"
                style={{ color: '#3b82f6' }}
              >
                Volunteer
              </Link>
              <span style={{ color: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)' }}>•</span>
              <Link
                href="/about"
                className="hover:underline"
                style={{ color: '#3b82f6' }}
              >
                About
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
