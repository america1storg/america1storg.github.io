'use client';

import { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = 'success', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: '#10b981',
    error: '#ef4444',
    info: '#3b82f6',
    warning: '#f59e0b',
  }[type];

  const icon = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  }[type];

  return (
    <div
      className="fixed top-8 right-8 z-50 animate-slide-in"
      style={{
        animation: 'slideIn 0.3s ease-out',
      }}
    >
      <div
        className="rounded-xl shadow-2xl px-6 py-4 flex items-center gap-4 min-w-[320px]"
        style={{
          background: bgColor,
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold"
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
          }}
        >
          {icon}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-lg">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:opacity-70 transition-opacity text-xl font-bold w-8 h-8 flex items-center justify-center"
        >
          ×
        </button>
      </div>
      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateY(-100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

// Named export for compatibility
export { Toast };
