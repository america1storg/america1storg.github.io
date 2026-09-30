'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface FeatureFlag {
  id: number;
  name: string;
  flag_key: string;
  description: string | null;
  component_name: string | null;
  status: 'draft' | 'available' | 'permanent';
  pages: string[];
}

interface FeatureFlagContextType {
  flags: Record<string, boolean>;
  availableFlags: FeatureFlag[];
  toggleFlag: (flagKey: string) => void;
  isEnabled: (flagKey: string) => boolean;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

export function FeatureFlagProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [availableFlags, setAvailableFlags] = useState<FeatureFlag[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load flags from localStorage and fetch available flags
  useEffect(() => {
    setMounted(true);

    // Load toggle states from localStorage
    const savedFlags = localStorage.getItem('af_feature_flags');
    if (savedFlags) {
      try {
        setFlags(JSON.parse(savedFlags));
      } catch (e) {
        console.error('Failed to parse saved flags:', e);
      }
    }

    // Fetch available flags from API
    fetchAvailableFlags();
  }, []);

  const fetchAvailableFlags = async () => {
    try {
      const response = await fetch('/api/feature-flags');
      if (response.ok) {
        const data = await response.json();
        setAvailableFlags(data.flags);

        // Initialize flags state with permanent flags always on
        const initialFlags: Record<string, boolean> = {};
        data.flags.forEach((flag: FeatureFlag) => {
          if (flag.status === 'permanent') {
            initialFlags[flag.flag_key] = true;
          }
        });

        setFlags(prev => ({ ...initialFlags, ...prev }));
      }
    } catch (error) {
      console.error('Error fetching feature flags:', error);

      // Fallback: Use demo flag if API fails (for testing without database)
      setAvailableFlags([
        {
          id: 1,
          name: 'Homepage Carousel',
          flag_key: 'AF_carousel',
          description: 'Rotating carousel showcasing site features',
          component_name: 'HomeCarousel',
          status: 'available',
          pages: ['/'],
        },
      ]);
    }
  };

  const toggleFlag = (flagKey: string) => {
    setFlags(prev => {
      const newFlags = { ...prev, [flagKey]: !prev[flagKey] };

      // Save to localStorage
      localStorage.setItem('af_feature_flags', JSON.stringify(newFlags));

      return newFlags;
    });
  };

  const isEnabled = (flagKey: string): boolean => {
    const flag = availableFlags.find(f => f.flag_key === flagKey);

    // Permanent flags are always enabled
    if (flag?.status === 'permanent') {
      return true;
    }

    // Available and draft flags can be toggled
    return flags[flagKey] || false;
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <FeatureFlagContext.Provider value={{ flags, availableFlags, toggleFlag, isEnabled }}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function useFeatureFlags() {
  const context = useContext(FeatureFlagContext);
  if (context === undefined) {
    // Return safe defaults for SSR/SSG
    return {
      flags: {},
      availableFlags: [],
      toggleFlag: () => {},
      isEnabled: () => false,
    };
  }
  return context;
}
