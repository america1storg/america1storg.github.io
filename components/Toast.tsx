'use client';

import { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const typeStyles = {
    success: {
      bg: 'bg-green-600',
      text: 'text-white',
      indicator: 'bg-green-400',
    },
    error: {
      bg: 'bg-red-600',
      text: 'text-white',
      indicator: 'bg-red-400',
    },
    warning: {
      bg: 'bg-yellow-600',
      text: 'text-white',
      indicator: 'bg-yellow-400',
    },
    info: {
      bg: 'bg-blue-600',
      text: 'text-white',
      indicator: 'bg-blue-400',
    },
  };

  const style = typeStyles[type];

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-md w-full shadow-2xl rounded-xl overflow-hidden animate-slide-in ${style.bg}`}
      role="alert"
    >
      <div className="flex items-center gap-3 p-4">
        <div className={`flex-shrink-0 w-2 h-2 rounded-full ${style.indicator}`} />
        <div className="flex-1">
          <p className={`font-medium text-base ${style.text}`}>{message}</p>
        </div>
        <button
          onClick={onClose}
          className={`flex-shrink-0 ${style.text} hover:opacity-70 transition-opacity text-xl leading-none`}
          aria-label="Close"
        >
          ×
        </button>
      </div>
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
