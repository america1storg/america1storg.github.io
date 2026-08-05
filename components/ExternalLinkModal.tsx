'use client';

import { useTheme } from './ThemeProvider';

interface ExternalLinkModalProps {
  isOpen: boolean;
  url: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ExternalLinkModal({ isOpen, url, onConfirm, onCancel }: ExternalLinkModalProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)' }}
        onClick={onCancel}
      >
        {/* Modal */}
        <div
          className="max-w-lg w-full rounded-2xl p-8 shadow-2xl"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, rgba(0, 10, 35, 0.98) 0%, rgba(0, 15, 50, 0.98) 100%)'
              : 'rgba(255, 255, 255, 0.98)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(0, 0, 0, 0.1)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                border: '2px solid #3b82f6',
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2
            className="text-2xl font-bold text-center mb-4"
            style={{ color: isDark ? '#fff' : '#000' }}
          >
            External Resource
          </h2>

          {/* Message */}
          <p
            className="text-center mb-6 leading-relaxed"
            style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)' }}
          >
            You are about to visit an external website. This site is not affiliated with or
            endorsed by America First. We are not responsible for the content, accuracy, or
            availability of external sites.
          </p>

          {/* URL Preview */}
          <div
            className="mb-6 p-4 rounded-lg text-sm text-center break-all"
            style={{
              background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
              color: '#3b82f6',
              fontFamily: 'monospace',
            }}
          >
            {url}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-80"
              style={{
                background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.2)',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
              style={{ cursor: 'pointer' }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
