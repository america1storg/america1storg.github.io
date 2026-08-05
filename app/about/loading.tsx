'use client';

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useTheme } from '@/components/ThemeProvider';

export default function AboutLoading() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen" style={{ background: isDark ? '#000a2e' : '#f8f9fa', color: isDark ? '#fff' : '#000', fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      <Navigation />

      <div className="pt-32 px-[6vw] max-w-[1400px] mx-auto pb-24">
        {/* Header Skeleton */}
        <div className="mb-16 animate-pulse">
          <div className="h-3 w-24 rounded mb-4" style={{ background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }} />
          <div className="h-16 w-64 rounded-lg mb-6" style={{ background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }} />
          <div className="space-y-3 max-w-[650px]">
            <div className="h-6 w-full rounded" style={{ background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)' }} />
            <div className="h-6 w-5/6 rounded" style={{ background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)' }} />
          </div>
        </div>

        {/* Content Sections Skeleton */}
        <div className="space-y-24">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-8 w-48 rounded-lg mb-6" style={{ background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }} />
              <div className="space-y-4 max-w-[800px]">
                <div className="h-5 w-full rounded" style={{ background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)' }} />
                <div className="h-5 w-full rounded" style={{ background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)' }} />
                <div className="h-5 w-4/5 rounded" style={{ background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
