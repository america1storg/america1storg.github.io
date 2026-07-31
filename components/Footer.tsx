'use client';

import { useTheme } from './ThemeProvider';
import { ThemeToggle } from './ThemeToggle';

export function Footer() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <footer
      className="px-[6vw] py-12 max-w-[1400px] mx-auto flex justify-between items-center flex-wrap gap-6 text-sm border-t"
      style={{
        color: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.4)',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.08)',
      }}
    >
      <span>
        © 2025 <strong style={{ color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.7)' }}>America First</strong>
      </span>
      <div className="flex items-center gap-4">
        <span>Truth · Data · Constitution</span>
        <ThemeToggle />
      </div>
    </footer>
  );
}
