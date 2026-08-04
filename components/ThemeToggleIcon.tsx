'use client';

import Image from 'next/image';
import { useTheme } from './ThemeProvider';

export function ThemeToggleIcon() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="rounded-full transition-all duration-200 hover:opacity-70 overflow-hidden"
      style={{
        width: '32px',
        height: '32px',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
      }}
      aria-label="Toggle theme"
    >
      <Image
        src={isDark ? "/theme-toggle-dark.jpg" : "/theme-toggle-light.jpg"}
        alt="Toggle theme"
        width={32}
        height={32}
        className="w-full h-full object-cover"
      />
    </button>
  );
}
