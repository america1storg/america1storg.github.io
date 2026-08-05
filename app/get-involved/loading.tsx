'use client';

import { useTheme } from '@/components/ThemeProvider';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export default function GetInvolvedLoading() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className="min-h-screen"
      style={{
        background: isDark ? '#000a2e' : '#f8f9fa',
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      }}
    >
      <Navigation />

      {/* Header Skeleton */}
      <header className="pt-32 pb-16 px-[6vw] max-w-[1400px] mx-auto">
        <div
          className="h-4 w-32 rounded mb-4 animate-pulse"
          style={{ background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
        />
        <div
          className="h-20 w-96 max-w-full rounded mb-6 animate-pulse"
          style={{ background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
        />
        <div
          className="h-16 w-full max-w-[750px] rounded animate-pulse"
          style={{ background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
        />
      </header>

      {/* CTA Cards Skeleton */}
      <section className="px-[6vw] max-w-[1400px] mx-auto pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl p-8 animate-pulse"
              style={{
                background: isDark
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(0, 0, 0, 0.05)',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
              }}
            >
              <div
                className="w-12 h-12 rounded mb-4"
                style={{ background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
              />
              <div
                className="h-8 w-3/4 rounded mb-3"
                style={{ background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
              />
              <div
                className="h-20 w-full rounded"
                style={{ background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Grid Skeleton */}
      <main className="px-[6vw] max-w-[1400px] mx-auto pb-24">
        <div
          className="h-12 w-96 max-w-full rounded mb-8 animate-pulse"
          style={{ background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden animate-pulse"
              style={{
                background: isDark
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(255, 255, 255, 0.9)',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
              }}
            >
              <div
                className="h-48"
                style={{
                  background: isDark
                    ? 'rgba(59, 130, 246, 0.2)'
                    : 'rgba(59, 130, 246, 0.1)',
                }}
              />
              <div className="p-6">
                <div
                  className="h-6 w-24 rounded-full mb-3"
                  style={{ background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
                />
                <div
                  className="h-7 w-3/4 rounded mb-3"
                  style={{ background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
                />
                <div
                  className="h-20 w-full rounded mb-4"
                  style={{ background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
                />
                <div
                  className="h-6 w-32 rounded"
                  style={{ background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
                />
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
