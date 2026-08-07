'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface CachedFaviconProps {
  domain: string;
  title: string;
  size?: number;
  isDark?: boolean;
}

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds

export function CachedFavicon({ domain, title, size = 96, isDark = false }: CachedFaviconProps) {
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const cacheKey = `favicon_${domain}`;
    const timestampKey = `favicon_timestamp_${domain}`;

    // Check if we have a cached favicon
    const cachedFavicon = localStorage.getItem(cacheKey);
    const cachedTimestamp = localStorage.getItem(timestampKey);

    if (cachedFavicon && cachedTimestamp) {
      const timestamp = parseInt(cachedTimestamp, 10);
      const now = Date.now();

      // If cache is still valid (less than 1 week old), use it
      if (now - timestamp < CACHE_DURATION) {
        setFaviconUrl(cachedFavicon);
        return;
      }
    }

    // Fetch new favicon
    const fetchFavicon = async () => {
      const url = `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;

      try {
        // Fetch the favicon
        const response = await fetch(url);
        if (response.ok) {
          const blob = await response.blob();
          const reader = new FileReader();

          reader.onloadend = () => {
            const base64data = reader.result as string;
            // Store in localStorage
            localStorage.setItem(cacheKey, base64data);
            localStorage.setItem(timestampKey, Date.now().toString());
            setFaviconUrl(base64data);
          };

          reader.readAsDataURL(blob);
        } else {
          setShowFallback(true);
        }
      } catch (error) {
        console.error(`Error fetching favicon for ${domain}:`, error);
        setShowFallback(true);
      }
    };

    fetchFavicon();
  }, [domain]);

  if (showFallback || (!faviconUrl && typeof window !== 'undefined')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
    );
  }

  if (!faviconUrl) {
    // Initial loading state - show placeholder
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '8px',
          background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }}
      />
    );
  }

  return (
    <Image
      src={faviconUrl}
      alt={`${title} logo`}
      width={size}
      height={size}
      className="w-24 h-24 object-contain"
      unoptimized
      onError={() => setShowFallback(true)}
    />
  );
}
