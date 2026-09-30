'use client';

import { useEffect, useState } from 'react';
import { useFeatureFlags } from './FeatureFlagProvider';
import { useTheme } from './ThemeProvider';

export function FlagDebugger() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const { availableFlags, flags, toggleFlag, isEnabled } = useFeatureFlags();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Check for ?showFlags in URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setIsVisible(searchParams.has('showFlags'));
  }, []);

  if (!isVisible) {
    return null;
  }

  // Filter to only show available and draft flags (not permanent)
  const toggleableFlags = availableFlags.filter(flag => flag.status !== 'permanent');

  return (
    <div
      className="fixed bottom-4 left-4 z-[9999] rounded-2xl shadow-2xl overflow-hidden"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, rgba(20, 20, 30, 0.98) 0%, rgba(30, 30, 50, 0.98) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 250, 255, 0.98) 100%)',
        backdropFilter: 'blur(20px)',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
        maxWidth: '320px',
        width: '100%',
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)'
            : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          color: '#fff',
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="font-bold text-sm">Feature Flags</span>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(255, 255, 255, 0.2)' }}
          >
            {toggleableFlags.filter(f => isEnabled(f.flag_key)).length}/{toggleableFlags.length}
          </span>
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {/* Flag List */}
      {isExpanded && (
        <div className="p-3 space-y-2 max-h-[400px] overflow-y-auto">
          {toggleableFlags.length === 0 ? (
            <div className="text-center py-8">
              <p
                className="text-sm mb-2"
                style={{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }}
              >
                No feature flags available
              </p>
              <p
                className="text-xs"
                style={{ color: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)' }}
              >
                Create flags in the admin panel
              </p>
            </div>
          ) : (
            toggleableFlags.map(flag => (
            <div
              key={flag.id}
              className="rounded-xl p-3 transition-all"
              style={{
                background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="font-mono text-xs font-bold truncate"
                      style={{ color: isDark ? '#fff' : '#000' }}
                    >
                      {flag.flag_key}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: flag.status === 'available'
                          ? isDark ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)'
                          : isDark ? 'rgba(156, 163, 175, 0.2)' : 'rgba(156, 163, 175, 0.1)',
                        color: flag.status === 'available'
                          ? isDark ? '#4ade80' : '#16a34a'
                          : isDark ? '#9ca3af' : '#6b7280',
                      }}
                    >
                      {flag.status}
                    </span>
                  </div>
                  <p
                    className="text-xs line-clamp-2"
                    style={{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }}
                  >
                    {flag.description || 'No description'}
                  </p>
                  {flag.component_name && (
                    <p
                      className="text-xs mt-1 font-mono"
                      style={{ color: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)' }}
                    >
                      Component: {flag.component_name}
                    </p>
                  )}
                </div>

                {/* Toggle Switch */}
                <button
                  onClick={() => toggleFlag(flag.flag_key)}
                  className="flex-shrink-0 relative rounded-full transition-all"
                  style={{
                    width: '44px',
                    height: '24px',
                    background: isEnabled(flag.flag_key)
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  }}
                  aria-label={`Toggle ${flag.flag_key}`}
                >
                  <div
                    className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-lg transition-all"
                    style={{
                      left: isEnabled(flag.flag_key) ? 'calc(100% - 22px)' : '2px',
                    }}
                  />
                </button>
              </div>
            </div>
          ))
          )}
        </div>
      )}

      {/* Footer */}
      <div
        className="px-3 py-2 text-xs text-center"
        style={{
          color: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
          borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
        }}
      >
        Debug Mode • Changes saved to session
      </div>
    </div>
  );
}
