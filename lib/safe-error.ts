/**
 * Safe error message utilities
 * Ensures internal error details are never exposed to clients
 */

/**
 * Get a safe, user-friendly error message
 * Never exposes internal error details in production
 */
export function getSafeErrorMessage(error: unknown, fallback = 'An error occurred'): string {
  // In development on localhost, show more details
  if (
    typeof process !== 'undefined' &&
    process.env.NODE_ENV === 'development'
  ) {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
  }

  // In production, always return generic message
  return fallback;
}

/**
 * Log error for debugging without exposing to client
 */
export function logError(context: string, error: unknown): void {
  // Server-side logging
  if (typeof console !== 'undefined') {
    console.error(`[${context}]`, error);

    // In production, you might want to send to error tracking service
    // Example: Sentry.captureException(error);
  }
}

/**
 * Create a safe error response for APIs
 */
export function createSafeErrorResponse(
  error: unknown,
  context: string,
  userMessage = 'An error occurred. Please try again later.'
): {
  error: string;
  message: string;
  timestamp: string;
} {
  // Log the real error server-side
  logError(context, error);

  // Return safe error to client
  return {
    error: 'Internal error',
    message: userMessage,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Common safe error messages
 */
export const SafeErrorMessages = {
  SEARCH_FAILED: 'Search failed. Please try again.',
  DATABASE_ERROR: 'Database error. Please try again later.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  VALIDATION_ERROR: 'Invalid input. Please check your data.',
  AUTHENTICATION_ERROR: 'Authentication failed. Please sign in again.',
  AUTHORIZATION_ERROR: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  RATE_LIMIT: 'Too many requests. Please slow down.',
  GENERIC: 'An error occurred. Please try again later.',
} as const;

/**
 * Check if error contains sensitive information
 */
export function containsSensitiveInfo(message: string): boolean {
  const sensitivePatterns = [
    /password/i,
    /token/i,
    /secret/i,
    /key/i,
    /connection.*string/i,
    /database.*host/i,
    /api.*key/i,
    /credentials/i,
    /postgres/i,
    /mongodb/i,
    /redis/i,
    /vercel/i,
    /env/i,
    /\.env/i,
  ];

  return sensitivePatterns.some((pattern) => pattern.test(message));
}

/**
 * Sanitize error message by removing sensitive information
 */
export function sanitizeErrorMessage(message: string): string {
  if (containsSensitiveInfo(message)) {
    return 'An error occurred. Please contact support if this persists.';
  }
  return message;
}
