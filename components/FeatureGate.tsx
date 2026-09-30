'use client';

import { ReactNode } from 'react';
import { useFeatureFlags } from './FeatureFlagProvider';

interface FeatureGateProps {
  flag: string;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * FeatureGate component - conditionally renders children based on feature flag state
 *
 * Usage:
 * <FeatureGate flag="AF_carousel">
 *   <Carousel />
 * </FeatureGate>
 */
export function FeatureGate({ flag, children, fallback = null }: FeatureGateProps) {
  const { isEnabled } = useFeatureFlags();

  if (!isEnabled(flag)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
