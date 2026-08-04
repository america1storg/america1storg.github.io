'use client';

import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center rounded-full transition-all duration-300"
      style={{
        width: '60px',
        height: '32px',
        background: isDark
          ? 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)'
          : 'linear-gradient(135deg, #FB923C 0%, #F87171 100%)',
        border: isDark
          ? '2px solid rgba(96, 165, 250, 0.3)'
          : '2px solid rgba(251, 146, 60, 0.3)',
        boxShadow: isDark
          ? '0 4px 12px rgba(59, 130, 246, 0.3)'
          : '0 4px 12px rgba(248, 113, 113, 0.3)',
        cursor: 'pointer',
      }}
      aria-label="Toggle theme"
    >
      <div
        className="absolute top-1 rounded-full transition-all duration-300 flex items-center justify-center"
        style={{
          width: '24px',
          height: '24px',
          background: isDark
            ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
            : 'linear-gradient(135deg, #F87171 0%, #DC2626 100%)',
          left: isDark ? 'calc(100% - 28px)' : '4px',
          boxShadow: isDark
            ? '0 2px 8px rgba(37, 99, 235, 0.5)'
            : '0 2px 8px rgba(220, 38, 38, 0.5)',
        }}
      >
        <span className="text-xs">
          {isDark ? '🌙' : '☀️'}
        </span>
      </div>
    </button>
  );
}
