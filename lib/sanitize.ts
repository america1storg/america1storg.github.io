/**
 * Input sanitization utilities to prevent XSS and injection attacks
 */

/**
 * Sanitize HTML - strips all HTML tags and dangerous characters
 */
export function sanitizeHtml(input: string): string {
  if (!input) return '';

  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitize email - validates and normalizes email addresses
 */
export function sanitizeEmail(email: string): { valid: boolean; sanitized: string } {
  if (!email) {
    return { valid: false, sanitized: '' };
  }

  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmed = email.trim().toLowerCase();

  // Check for dangerous characters
  const hasDangerousChars = /[<>'"`;\\]/.test(trimmed);

  return {
    valid: emailRegex.test(trimmed) && !hasDangerousChars && trimmed.length <= 254,
    sanitized: trimmed,
  };
}

/**
 * Sanitize search query - removes dangerous characters but preserves spaces
 */
export function sanitizeSearchQuery(query: string): string {
  if (!query) return '';

  return query
    .trim()
    // Remove SQL injection attempts
    .replace(/['";\\]/g, '')
    // Remove script tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Limit length
    .slice(0, 200);
}

/**
 * Sanitize URL - ensures URL is safe and well-formed
 */
export function sanitizeUrl(url: string): { valid: boolean; sanitized: string } {
  if (!url) {
    return { valid: false, sanitized: '' };
  }

  try {
    const trimmed = url.trim();

    // Only allow http and https protocols
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      return { valid: false, sanitized: '' };
    }

    const parsedUrl = new URL(trimmed);

    // Block javascript: and data: protocols
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return { valid: false, sanitized: '' };
    }

    return { valid: true, sanitized: parsedUrl.toString() };
  } catch {
    return { valid: false, sanitized: '' };
  }
}

/**
 * Sanitize filename - removes path traversal attempts and dangerous characters
 */
export function sanitizeFilename(filename: string): string {
  if (!filename) return '';

  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Only allow safe characters
    .replace(/\.\./g, '') // Remove parent directory references
    .slice(0, 255); // Limit length
}

/**
 * Validate and sanitize integer input
 */
export function sanitizeInteger(input: string | number, min?: number, max?: number): number | null {
  const num = typeof input === 'string' ? parseInt(input, 10) : input;

  if (isNaN(num) || !isFinite(num)) {
    return null;
  }

  if (min !== undefined && num < min) {
    return null;
  }

  if (max !== undefined && num > max) {
    return null;
  }

  return num;
}

/**
 * Sanitize user-generated text content (for articles, comments, etc.)
 * Allows basic formatting but removes dangerous content
 */
export function sanitizeUserContent(content: string): string {
  if (!content) return '';

  // Remove script tags
  let sanitized = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove event handlers (onclick, onerror, etc.)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');

  // Remove data: protocol
  sanitized = sanitized.replace(/data:text\/html/gi, '');

  return sanitized.trim();
}

/**
 * Rate limit key generation - creates a safe key for rate limiting
 */
export function generateRateLimitKey(ip: string, endpoint: string): string {
  return `ratelimit:${sanitizeHtml(ip)}:${sanitizeHtml(endpoint)}`;
}

/**
 * Validate and sanitize pagination parameters
 */
export function sanitizePagination(page?: string | number, limit?: string | number): {
  page: number;
  limit: number;
} {
  const sanitizedPage = sanitizeInteger(page || 1, 1, 1000) || 1;
  const sanitizedLimit = sanitizeInteger(limit || 10, 1, 100) || 10;

  return {
    page: sanitizedPage,
    limit: sanitizedLimit,
  };
}
