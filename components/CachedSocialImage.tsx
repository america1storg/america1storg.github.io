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

      // Attempt 2: Try high-res favicon fallbacks with quality check
      const fallbackUrls = getFallbackUrls(domain, url);

      for (const fallbackUrl of fallbackUrls) {
        try {
          const imgResponse = await fetch(fallbackUrl);

          if (imgResponse.ok && imgResponse.headers.get('content-type')?.startsWith('image/')) {
            const blob = await imgResponse.blob();

            if (blob.size > 100 && blob.size < 500 * 1024) { // Between 100 bytes and 500KB
              // Check image dimensions to avoid tiny blurry icons
              const imageUrl = URL.createObjectURL(blob);
              const img = new Image();

              await new Promise<void>((resolve, reject) => {
                img.onload = () => {
                  URL.revokeObjectURL(imageUrl);

                  // Only use if at least 64x64 (avoids tiny blurry favicons)
                  if (img.width >= 64 && img.height >= 64) {
                    const reader = new FileReader();

                    reader.onloadend = () => {
                      const base64data = reader.result as string;
                      localStorage.setItem(fallbackCacheKey, base64data);
                      localStorage.setItem(timestampKey, Date.now().toString());
                      setImageUrl(base64data);
                      setIsLoading(false);
                    };

                    reader.readAsDataURL(blob);
                    resolve();
                  } else {
                    // Image too small, skip to next fallback
                    reject(new Error('Image too small'));
                  }
                };

                img.onerror = () => {
                  URL.revokeObjectURL(imageUrl);
                  reject(new Error('Failed to load image'));
                };

                img.src = imageUrl;
              });

              return; // Success with quality-checked fallback!
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
    // Generate vibrant color based on domain name
    const getColorFromString = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }

      // Vibrant, professional color palette
      const colors = [
        { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', text: '#fff' }, // Purple
        { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', text: '#fff' }, // Pink-Red
        { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', text: '#fff' }, // Cyan
        { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', text: '#fff' }, // Green-Cyan
        { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', text: '#fff' }, // Pink-Yellow
        { bg: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', text: '#fff' }, // Teal-Purple
        { bg: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', text: '#1f2937' }, // Pastel
        { bg: 'linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)', text: '#fff' }, // Orange-Pink
        { bg: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', text: '#1f2937' }, // Peach
        { bg: 'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)', text: '#1f2937' }, // Red-Blue
      ];

      return colors[Math.abs(hash) % colors.length];
    };

    const initial = title.charAt(0).toUpperCase();
    const colorScheme = getColorFromString(domain);

    return (
      <div className="w-full h-full flex items-center justify-center">
        <div
          className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl font-bold shadow-2xl"
          style={{
            background: colorScheme.bg,
            color: colorScheme.text,
          }}
        >
          {initial}
        </div>
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
