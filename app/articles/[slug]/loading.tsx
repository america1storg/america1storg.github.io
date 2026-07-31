'use client';

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useTheme } from '@/components/ThemeProvider';

export default function ArticleLoading() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen" style={{ background: isDark ? '#020208' : '#f8f9fa', color: isDark ? '#fff' : '#000', fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      <Navigation />

      <article className="pt-32 px-[6vw] max-w-[900px] mx-auto pb-24">
        {/* Back link skeleton */}
        <div className="h-4 w-32 rounded mb-8 animate-pulse" style={{ background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }} />

        <div
          className="p-12 rounded-3xl mb-12 animate-pulse"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.08)'
          }}
        >
          {/* Cover image skeleton */}
          <div className="mb-8 -mt-12 -mx-12 rounded-t-3xl overflow-hidden h-64" style={{ background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)' }} />

          {/* Title skeleton */}
          <div className="space-y-4 mb-8">
            <div className="h-12 w-3/4 rounded-lg" style={{ background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)' }} />
            <div className="h-12 w-1/2 rounded-lg" style={{ background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)' }} />
          </div>

          {/* Meta info skeleton */}
          <div className="flex items-center gap-4 pb-8 mb-8" style={{ borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)' }}>
            <div className="h-5 w-32 rounded" style={{ background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)' }} />
            <div className="h-5 w-24 rounded" style={{ background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)' }} />
          </div>

          {/* Content skeleton */}
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-4 rounded" style={{
                background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
                width: i % 3 === 0 ? '90%' : '100%'
              }} />
            ))}
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
