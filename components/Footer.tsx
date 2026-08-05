'use client';

import { useTheme } from './ThemeProvider';
import { ThemeToggle } from './ThemeToggle';
import { SocialLinks } from './SocialLinks';

export function Footer() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <footer
      className="px-[6vw] py-12 max-w-[1400px] mx-auto border-t"
      style={{
        color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
      }}
    >
      <div className="flex justify-between items-center flex-wrap gap-6 text-sm">
        <div className="flex items-center gap-6">
          <span>
            © {new Date().getFullYear()} <strong style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.8)' }}>America First</strong>
          </span>
          <SocialLinks size="sm" />
        </div>
        <div className="flex items-center gap-4">
          <span>Truth · Data · Constitution</span>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
