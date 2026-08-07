import { useEffect } from 'react';

interface Resource {
  url: string;
  domain: string;
}

export function usePreloadImages(resources: Resource[]) {
  useEffect(() => {
    // Preload images in the background with low priority
    const preloadImage = async (url: string, domain: string) => {
      const cacheKey = `social_image_${domain}`;
      const fallbackCacheKey = `fallback_${domain}`;
      const timestampKey = `social_image_timestamp_${domain}`;

      // Check if already cached
      const cached = localStorage.getItem(cacheKey) || localStorage.getItem(fallbackCacheKey);
      const timestamp = localStorage.getItem(timestampKey);

      if (cached && timestamp) {
        const age = Date.now() - parseInt(timestamp, 10);
        if (age < 7 * 24 * 60 * 60 * 1000) {
          return; // Still valid, skip
        }
      }

      // Fetch in background with low priority
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        await fetch(`/api/og-image?url=${encodeURIComponent(url)}`, {
          signal: controller.signal,
          priority: 'low',
        } as RequestInit);

        clearTimeout(timeoutId);
      } catch (error) {
        // Silent fail - component will handle it when it renders
      }
    };

    // Stagger preloading to avoid overwhelming the browser
    resources.forEach((resource, index) => {
      setTimeout(() => {
        preloadImage(resource.url, resource.domain);
      }, index * 200); // 200ms between each preload
    });
  }, [resources]);
}
