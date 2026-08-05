'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    // Log error to console or error reporting service
    console.error('Application error:', error);
  }, [error]);

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
          {/* Error Icon */}
          <div className="mb-6">
            <svg
              width="100"
              height="100"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto"
              style={{ color: '#ef4444' }}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          {/* Error Message */}
          <h1
            className="text-4xl md:text-6xl font-extrabold mb-4"
            style={{ color: isDark ? '#fff' : '#000' }}
          >
            Something Went Wrong
          </h1>
          <p
            className="text-lg md:text-xl mb-8 leading-relaxed"
            style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}
          >
            We encountered an unexpected error. Don't worry, our team has been notified
            and we're working to fix it.
          </p>

          {/* Error Details (Development Only - NEVER in production) */}
          {typeof window !== 'undefined' && window.location.hostname === 'localhost' && (
            <div
              className="mb-8 p-4 rounded-lg text-left text-sm overflow-auto max-h-32"
              style={{
                background: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
              }}
            >
              <strong>Dev Only - Error:</strong> {error.message}
              {error.digest && (
                <div className="mt-2">
                  <strong>Digest:</strong> {error.digest}
                </div>
              )}
              <div className="mt-2 text-xs opacity-75">
                (This error detail is only visible on localhost)
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-lg"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105"
              style={{
                background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                color: isDark ? '#fff' : '#000',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.2)',
              }}
            >
              Go to Homepage
            </Link>
          </div>

          {/* Help Text */}
          <div className="mt-12 pt-8 border-t" style={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}>
            <p
              className="text-sm"
              style={{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }}
            >
              If this problem persists, please{' '}
              <Link href="/about#contact" className="underline" style={{ color: '#3b82f6' }}>
                contact us
              </Link>
              {' '}for assistance.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
