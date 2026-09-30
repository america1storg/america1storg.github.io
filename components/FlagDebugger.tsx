'use client';

import { useEffect, useState } from 'react';
import { useFeatureFlags } from './FeatureFlagProvider';
import { useTheme } from './ThemeProvider';

export function FlagDebugger() {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { availableFlags, flags, toggleFlag, isEnabled } = useFeatureFlags();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Check for ?showFlags in URL
  useEffect(() => {
    const checkURL = () => {
      if (typeof window === 'undefined') return;
      const searchParams = new URLSearchParams(window.location.search);
      const hasFlag = searchParams.has('showFlags');
      console.log('FlagDebugger: URL check - has showFlags:', hasFlag, 'Full URL:', window.location.href);
      setIsVisible(hasFlag);
    };

    // Check on mount
    checkURL();

    // Also check when URL changes (for client-side navigation)
    window.addEventListener('popstate', checkURL);
    window.addEventListener('hashchange', checkURL);

    return () => {
      window.removeEventListener('popstate', checkURL);
      window.removeEventListener('hashchange', checkURL);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  // Filter to only show available and draft flags (not permanent)
  const toggleableFlags = availableFlags.filter(flag => flag.status !== 'permanent');
  const enabledCount = toggleableFlags.filter(f => isEnabled(f.flag_key)).length;

  return (
    <>
      {/* Floating Button - Small and compact */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-4 left-4 z-[9999] rounded-full shadow-2xl transition-all hover:scale-110"
        style={{
          width: '56px',
          height: '56px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
        }}
        aria-label="Open feature flags debugger"
      >
        <div className="relative flex items-center justify-center">
          {/* Flag Icon */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <line x1="4" y1="22" x2="4" y2="15" />
          </svg>
          {/* Badge Count */}
          {toggleableFlags.length > 0 && (
            <div
              className="absolute -top-1 -right-1 rounded-full text-xs font-bold flex items-center justify-center"
              style={{
                width: '20px',
                height: '20px',
                background: enabledCount > 0 ? '#10b981' : '#ef4444',
                color: '#fff',
              }}
            >
              {enabledCount}
            </div>
          )}
        </div>
      </button>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: isDark ? 0.7 : 0.5 }}
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Content */}
          <div
            className="relative rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            style={{
              background: isDark
                ? 'linear-gradient(135deg, rgba(20, 20, 30, 0.98) 0%, rgba(30, 30, 50, 0.98) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 250, 255, 0.98) 100%)',
              backdropFilter: 'blur(20px)',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* Header */}
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{
                background: isDark
                  ? 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)'
                  : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: '#fff',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <h2 className="font-bold text-lg">Feature Flags</h2>
                <span
                  className="text-sm px-3 py-1 rounded-full"
                  style={{ background: 'rgba(255, 255, 255, 0.2)' }}
                >
                  {enabledCount}/{toggleableFlags.length} Active
                </span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
                aria-label="Close"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Flag List */}
            <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
              {toggleableFlags.length === 0 ? (
                <div className="text-center py-12">
                  <p
                    className="text-base mb-2"
                    style={{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }}
                  >
                    No feature flags available
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)' }}
                  >
                    Create flags in the admin panel to test components
                  </p>
                </div>
              ) : (
                toggleableFlags.map(flag => (
                  <div
                    key={flag.id}
                    className="rounded-xl p-4 transition-all"
                    style={{
                      background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className="font-mono text-sm font-bold"
                            style={{ color: isDark ? '#fff' : '#000' }}
                          >
                            {flag.flag_key}
                          </span>
                          <span
                            className="text-xs px-2 py-1 rounded-full font-medium"
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
                          className="text-sm mb-1"
                          style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}
                        >
                          {flag.name}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}
                        >
                          {flag.description || 'No description'}
                        </p>
                        {flag.component_name && (
                          <p
                            className="text-xs mt-2 font-mono"
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
                          width: '52px',
                          height: '28px',
                          background: isEnabled(flag.flag_key)
                            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                            : isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                        }}
                        aria-label={`Toggle ${flag.flag_key}`}
                      >
                        <div
                          className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all"
                          style={{
                            left: isEnabled(flag.flag_key) ? 'calc(100% - 28px)' : '4px',
                          }}
                        />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div
              className="px-6 py-3 text-sm text-center"
              style={{
                color: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
                borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
              }}
            >
              Debug Mode • Changes saved to browser session
            </div>
          </div>
        </div>
      )}
    </>
  );
}
