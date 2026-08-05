'use client';

import Link from 'next/link';
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
      <div className="space-y-6">
        {/* Main footer content */}
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

        {/* Disclaimers */}
        <div className="space-y-3 text-center text-xs max-w-[900px] mx-auto" style={{ color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}>
          <p>
            We are not affiliated with any candidate, campaign, or political party. We evaluate all leaders, policies, and parties based on America-First principles, logic, and the rule of law.
          </p>
          <p>
            America First is a civic-education and social-welfare advocacy project in formation and is not yet recognized by the IRS as a tax-exempt organization.
          </p>
        </div>

        {/* Legal links */}
        <div className="flex justify-center items-center gap-4 text-xs">
          <Link
            href="/privacy"
            className="hover:underline transition-all"
            style={{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }}
          >
            Privacy Policy
          </Link>
          <span style={{ color: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)' }}>·</span>
          <Link
            href="/terms"
            className="hover:underline transition-all"
            style={{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }}
          >
            Terms of Use
          </Link>
        </div>
      </div>
    </footer>
  );
}
