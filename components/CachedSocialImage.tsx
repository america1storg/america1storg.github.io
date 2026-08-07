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

export function CachedSocialImage({ url, title, domain, isDark = false }: CachedSocialImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showFallback, setShowFallback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cacheKey = `social_image_${domain}`;
    const timestampKey = `social_image_timestamp_${domain}`;

    // Check if we have a cached image
    const cachedImage = localStorage.getItem(cacheKey);
    const cachedTimestamp = localStorage.getItem(timestampKey);

    if (cachedImage && cachedTimestamp) {
      const timestamp = parseInt(cachedTimestamp, 10);
      const now = Date.now();

      // If cache is still valid (less than 1 week old), use it
      if (now - timestamp < CACHE_DURATION) {
        setImageUrl(cachedImage);
        setIsLoading(false);
        return;
      }
    }

    // Fetch new social image via our API route
    const fetchSocialImage = async () => {
      try {
        const response = await fetch(`/api/og-image?url=${encodeURIComponent(url)}`);

        if (response.ok) {
          const data = await response.json();

          if (data.imageUrl) {
            // Fetch the actual image and convert to base64
            const imageResponse = await fetch(data.imageUrl);

            if (imageResponse.ok) {
              const blob = await imageResponse.blob();
              const reader = new FileReader();

              reader.onloadend = () => {
                const base64data = reader.result as string;
                // Store in localStorage
                localStorage.setItem(cacheKey, base64data);
                localStorage.setItem(timestampKey, Date.now().toString());
                setImageUrl(base64data);
                setIsLoading(false);
              };

              reader.readAsDataURL(blob);
            } else {
              setShowFallback(true);
              setIsLoading(false);
            }
          } else {
            setShowFallback(true);
            setIsLoading(false);
          }
        } else {
          setShowFallback(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error(`Error fetching social image for ${domain}:`, error);
        setShowFallback(true);
        setIsLoading(false);
      }
    };

    fetchSocialImage();
  }, [url, domain]);

  if (showFallback) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <svg
          width="96"
          height="96"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)',
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
