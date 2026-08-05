'use client';

import { useState } from 'react';
import { useTheme } from './ThemeProvider';

interface NewsletterSubscribeProps {
  variant?: 'inline' | 'card';
  className?: string;
}

export function NewsletterSubscribe({ variant = 'card', className = '' }: NewsletterSubscribeProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Successfully subscribed! Check your email for confirmation.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again later.');
    }
  };

  if (variant === 'inline') {
    return (
      <div className={className}>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={status === 'loading'}
            className="flex-1 px-4 py-2 rounded-lg text-sm"
            style={{
              background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
              color: isDark ? '#fff' : '#000',
            }}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
        {message && (
          <p
            className="text-xs mt-2"
            style={{
              color: status === 'success' ? '#10b981' : '#ef4444',
            }}
          >
            {message}
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      className={`p-8 rounded-2xl ${className}`}
      style={{
        background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
        backdropFilter: 'blur(12px)',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.08)',
      }}
    >
      <h3 className="text-2xl font-bold mb-2" style={{ color: '#3b82f6' }}>
        Stay Informed
      </h3>
      <p className="text-sm mb-6" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}>
        Subscribe to receive updates on new articles, resources, and our weekly newsletter.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          required
          disabled={status === 'loading'}
          className="w-full px-4 py-3 rounded-lg"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
            color: isDark ? '#fff' : '#000',
          }}
        />

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe to Newsletter'}
        </button>
      </form>

      {message && (
        <p
          className="text-sm mt-4 text-center"
          style={{
            color: status === 'success' ? '#10b981' : '#ef4444',
          }}
        >
          {message}
        </p>
      )}

      <p className="text-xs mt-4 text-center" style={{ color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}>
        We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  );
}
