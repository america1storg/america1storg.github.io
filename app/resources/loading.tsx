'use client';

import { useTheme } from '@/components/ThemeProvider';

export default function ResourcesLoading() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen" style={{ background: isDark ? '#020208' : '#f8f9fa', color: isDark ? '#fff' : '#000', fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      <div className="pt-32 pb-16 px-[6vw] max-w-[1400px] mx-auto">
        <div className="h-4 w-32 rounded mb-4" style={{ background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}></div>
        <div className="h-16 w-64 rounded mb-6" style={{ background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}></div>
        <div className="h-6 w-96 rounded" style={{ background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}></div>
      </div>
    </div>
  );
}
