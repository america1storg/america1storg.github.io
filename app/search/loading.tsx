'use client';

import { useTheme } from '@/components/ThemeProvider';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export default function SearchLoading() {
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
          className="h-4 w-24 rounded mb-4 animate-pulse"
          style={{ background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
        />
        <div
          className="h-20 w-full max-w-[500px] rounded mb-8 animate-pulse"
          style={{ background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
        />
        <div
          className="h-14 w-full max-w-[700px] rounded-xl animate-pulse"
          style={{ background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
        />
      </header>

      <Footer />
    </div>
  );
}
