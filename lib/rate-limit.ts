import { NextRequest } from 'next/server';

interface RateLimitStore {
  count: number;
  resetTime: number;
}

// In-memory store (for serverless, consider Redis in production)
const rateLimitMap = new Map<string, RateLimitStore>();

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  maxRequests: number; // Max requests per interval
}

export class RateLimiter {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  /**
   * Get client identifier (IP address)
   */
  private getClientId(request: NextRequest): string {
    // Try to get real IP from headers (for proxies/load balancers)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');

    if (forwardedFor) {
      return forwardedFor.split(',')[0].trim();
    }

    if (realIp) {
      return realIp;
    }

    // Fallback to a default identifier
    return 'unknown';
  }

  /**
   * Check if request should be rate limited
   * Returns true if rate limit exceeded, false otherwise
   */
  check(request: NextRequest): { limited: boolean; remaining: number; resetTime: number } {
    const clientId = this.getClientId(request);
    const now = Date.now();

    let store = rateLimitMap.get(clientId);

    // If no store exists or reset time has passed, create new store
    if (!store || now > store.resetTime) {
      store = {
        count: 1,
        resetTime: now + this.config.interval,
      };
      rateLimitMap.set(clientId, store);

      return {
        limited: false,
        remaining: this.config.maxRequests - 1,
        resetTime: store.resetTime,
      };
    }

    // Increment count
    store.count++;

    // Check if limit exceeded
    if (store.count > this.config.maxRequests) {
      return {
        limited: true,
        remaining: 0,
        resetTime: store.resetTime,
      };
    }

    return {
      limited: false,
      remaining: this.config.maxRequests - store.count,
      resetTime: store.resetTime,
    };
  }

  /**
   * Clean up old entries (call periodically)
   */
  static cleanup() {
    const now = Date.now();
    for (const [key, store] of rateLimitMap.entries()) {
      if (now > store.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }
}

// Cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => RateLimiter.cleanup(), 5 * 60 * 1000);
}

// Pre-configured rate limiters for different endpoints
export const searchRateLimiter = new RateLimiter({
  interval: 60 * 1000, // 1 minute
  maxRequests: 20, // 20 searches per minute
});

export const newsletterRateLimiter = new RateLimiter({
  interval: 60 * 60 * 1000, // 1 hour
  maxRequests: 3, // 3 subscriptions per hour
});

export const apiRateLimiter = new RateLimiter({
  interval: 60 * 1000, // 1 minute
  maxRequests: 60, // 60 requests per minute
});
