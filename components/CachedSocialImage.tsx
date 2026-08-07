'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface CachedSocialImageProps {
  url: string;
  title: string;
  domain: string;
  isDark?: boolean;
}

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
const FALLBACK_CACHE_KEY_PREFIX = 'fallback_';

// Multi-tier fallback URLs for each attempt
const getFallbackUrls = (domain: string, url: string) => [
  // Tier 1: High-res favicon from Google
  `https://www.google.com/s2/favicons?domain=${domain}&sz=256`,
  // Tier 2: Apple touch icon (usually high quality)
  `${new URL(url).origin}/apple-touch-icon.png`,
  // Tier 3: Standard favicon
  `${new URL(url).origin}/favicon.ico`,
];

export function CachedSocialImage({ url, title, domain, isDark = false }: CachedSocialImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showFallback, setShowFallback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cacheKey = `social_image_${domain}`;
    const timestampKey = `social_image_timestamp_${domain}`;
    const fallbackCacheKey = `${FALLBACK_CACHE_KEY_PREFIX}${domain}`;

    // Check if we have a cached image (either social or fallback)
    const cachedImage = localStorage.getItem(cacheKey);
    const cachedFallback = localStorage.getItem(fallbackCacheKey);
    const cachedTimestamp = localStorage.getItem(timestampKey);

    if ((cachedImage || cachedFallback) && cachedTimestamp) {
      const timestamp = parseInt(cachedTimestamp, 10);
      const now = Date.now();

      // If cache is still valid (less than 1 week old), use it
      if (now - timestamp < CACHE_DURATION) {
        setImageUrl(cachedImage || cachedFallback);
        setIsLoading(false);
        return;
      }
    }

    // Try fetching image with fallback cascade
    const fetchImageWithFallback = async () => {
      try {
        // Attempt 1: Try social share image (OG/Twitter)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

        const response = await fetch(`/api/og-image?url=${encodeURIComponent(url)}`, {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();

          if (data.imageUrl) {
            // Try to fetch and cache the social image
            try {
              const imageResponse = await fetch(data.imageUrl);

              if (imageResponse.ok && imageResponse.headers.get('content-type')?.startsWith('image/')) {
                const blob = await imageResponse.blob();

                // Check if image is reasonable size (< 2MB to avoid localStorage quota)
                if (blob.size < 2 * 1024 * 1024) {
                  const reader = new FileReader();

                  reader.onloadend = () => {
                    const base64data = reader.result as string;
                    localStorage.setItem(cacheKey, base64data);
                    localStorage.setItem(timestampKey, Date.now().toString());
                    setImageUrl(base64data);
                    setIsLoading(false);
                  };

                  reader.readAsDataURL(blob);
                  return; // Success!
                }
              }
            } catch (imgError) {
              console.log(`Social image fetch failed for ${domain}, trying fallback`);
            }
          }
        }
      } catch (error) {
        // Timeout or fetch error - continue to fallback
        console.log(`OG image timeout/error for ${domain}, using fallback`);
      }

      // Attempt 2: Try high-res favicon fallbacks
      const fallbackUrls = getFallbackUrls(domain, url);

      for (const fallbackUrl of fallbackUrls) {
        try {
          const imgResponse = await fetch(fallbackUrl);

          if (imgResponse.ok && imgResponse.headers.get('content-type')?.startsWith('image/')) {
            const blob = await imgResponse.blob();

            if (blob.size > 100 && blob.size < 500 * 1024) { // Between 100 bytes and 500KB
              const reader = new FileReader();

              reader.onloadend = () => {
                const base64data = reader.result as string;
                // Cache as fallback
                localStorage.setItem(fallbackCacheKey, base64data);
                localStorage.setItem(timestampKey, Date.now().toString());
                setImageUrl(base64data);
                setIsLoading(false);
              };

              reader.readAsDataURL(blob);
              return; // Success with fallback!
            }
          }
        } catch (fallbackError) {
          // Try next fallback
          continue;
        }
      }

      // All attempts failed - show SVG fallback
      setShowFallback(true);
      setIsLoading(false);
    };

    fetchImageWithFallback();
  }, [url, domain]);

  if (showFallback) {
    // Enhanced SVG fallback with site initial
    const initial = title.charAt(0).toUpperCase();
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl font-bold"
          style={{
            background: isDark
              ? 'rgba(255, 255, 255, 0.15)'
              : 'rgba(255, 255, 255, 0.9)',
            color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.7)',
            boxShadow: isDark
              ? '0 4px 20px rgba(0, 0, 0, 0.3)'
              : '0 4px 20px rgba(0, 0, 0, 0.1)',
          }}
        >
          {initial}
        </div>
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            color: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
          }}
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      </div>
    );
  }

  if (isLoading || !imageUrl) {
    // Loading state - show shimmer
    return (
      <div
        className="w-full h-full animate-pulse"
        style={{
          background: isDark
            ? 'linear-gradient(90deg, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.05) 75%)'
            : 'linear-gradient(90deg, rgba(0, 0, 0, 0.05) 25%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.05) 75%)',
          backgroundSize: '200% 100%',
        }}
      />
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={`${title} preview`}
      fill
      className="object-cover"
      unoptimized
      onError={() => {
        setShowFallback(true);
        setIsLoading(false);
      }}
    />
  );
}
