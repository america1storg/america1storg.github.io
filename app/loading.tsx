'use client';

import { useTheme } from '@/components/ThemeProvider';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export default function Loading() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: isDark ? '#000a2e' : '#f8f9fa',
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      }}
    >
      <Navigation />

      <main className="flex-1 flex items-center justify-center px-[6vw] pt-32 pb-24">
        <div className="text-center">
          {/* Spinner */}
          <div
            className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-current border-r-transparent mb-6"
            style={{ color: '#3b82f6' }}
          />
          <p
            className="text-lg"
            style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}
          >
            Loading...
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
