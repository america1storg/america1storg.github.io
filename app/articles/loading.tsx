'use client';

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useTheme } from '@/components/ThemeProvider';

export default function ArticlesLoading() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen" style={{ background: isDark ? '#000a2e' : '#f8f9fa', color: isDark ? '#fff' : '#000', fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      <Navigation />

      {/* Header Skeleton */}
      <header className="pt-32 pb-16 px-[6vw] max-w-[1400px] mx-auto">
        <div className="h-3 w-32 rounded mb-4 animate-pulse" style={{ background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }} />
        <div className="h-16 w-64 rounded-lg mb-6 animate-pulse" style={{ background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }} />
        <div className="h-6 w-96 max-w-full rounded mb-2 animate-pulse" style={{ background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }} />
      </header>

      {/* Articles Grid Skeleton */}
      <main className="px-[6vw] max-w-[1400px] mx-auto pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-3xl overflow-hidden animate-pulse"
              style={{
                background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.08)'
              }}
            >
              {/* Image skeleton */}
              <div className="h-48 w-full" style={{ background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)' }} />

              {/* Content skeleton */}
              <div className="p-6 space-y-4">
                <div className="h-6 w-3/4 rounded" style={{ background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)' }} />
                <div className="space-y-2">
                  <div className="h-4 w-full rounded" style={{ background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)' }} />
                  <div className="h-4 w-5/6 rounded" style={{ background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)' }} />
                </div>
                <div className="h-4 w-32 rounded" style={{ background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)' }} />
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
