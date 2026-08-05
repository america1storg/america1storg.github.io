# Security Policy

## Overview

America First takes security seriously. This document outlines the security measures implemented in the application.

---

## Security Headers

The following security headers are automatically applied to all routes:

### HTTP Strict Transport Security (HSTS)
- **Header**: `Strict-Transport-Security`
- **Value**: `max-age=63072000; includeSubDomains; preload`
- **Purpose**: Forces HTTPS connections and prevents downgrade attacks

### Frame Options
- **Header**: `X-Frame-Options`
- **Value**: `SAMEORIGIN`
- **Purpose**: Prevents clickjacking attacks by controlling iframe embedding

### Content Type Options
- **Header**: `X-Content-Type-Options`
- **Value**: `nosniff`
- **Purpose**: Prevents MIME-type sniffing attacks

### XSS Protection
- **Header**: `X-XSS-Protection`
- **Value**: `1; mode=block`
- **Purpose**: Enables browser's built-in XSS protection

### Referrer Policy
- **Header**: `Referrer-Policy`
- **Value**: `strict-origin-when-cross-origin`
- **Purpose**: Controls referrer information sent with requests

### Permissions Policy
- **Header**: `Permissions-Policy`
- **Value**: `camera=(), microphone=(), geolocation=(), interest-cohort=()`
- **Purpose**: Disables unnecessary browser features

---

## Rate Limiting

### Implementation
- In-memory rate limiting for all API endpoints
- Automatic cleanup of expired rate limit entries
- Returns HTTP 429 (Too Many Requests) when limits exceeded

### Limits by Endpoint

**Search API** (`/api/search`)
- **Limit**: 20 requests per minute per IP
- **Window**: 60 seconds
- **Purpose**: Prevent search abuse and database overload

**Newsletter API** (`/api/newsletter/subscribe`)
- **Limit**: 3 requests per hour per IP
- **Window**: 60 minutes
- **Purpose**: Prevent spam subscriptions

**General API Routes**
- **Limit**: 60 requests per minute per IP
- **Window**: 60 seconds
- **Purpose**: General abuse prevention

### Rate Limit Headers
When rate limited, responses include:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining in current window
- `X-RateLimit-Reset`: Timestamp when limit resets
- `Retry-After`: Seconds to wait before retrying

---

## Input Sanitization

All user inputs are sanitized to prevent injection attacks:

### Email Validation
- Format validation (RFC 5322)
- Length validation (max 254 characters)
- Dangerous character removal (`<`, `>`, `'`, `"`, `;`, `` ` ``, `\\`)
- Lowercase normalization

### Search Query Sanitization
- SQL injection prevention (removes `'`, `"`, `;`, `\\`)
- Script tag removal
- Length limit (200 characters)
- XSS prevention

### HTML Sanitization
- HTML tag escaping
- Special character encoding
- Script injection prevention

### URL Validation
- Protocol whitelist (http, https only)
- JavaScript protocol blocking
- Data URI blocking
- URL parsing validation

---

## SQL Injection Prevention

### Parameterized Queries
All database queries use parameterized statements via `@vercel/postgres`:

```typescript
// ✅ SAFE - Uses parameterized query
await sql`SELECT * FROM articles WHERE title ILIKE ${'%' + searchTerm + '%'}`;

// ❌ UNSAFE - String concatenation (NOT USED)
await sql`SELECT * FROM articles WHERE title ILIKE '%${searchTerm}%'`;
```

### Input Sanitization
Search queries are sanitized before being used in database queries to provide defense-in-depth.

---

## XSS Prevention

### React Automatic Escaping
React automatically escapes all content rendered in JSX, preventing XSS attacks.

### Content Security
- User-generated content is sanitized
- HTML rendering uses `dangerouslySetInnerHTML` only for trusted content (article content from admin)
- External links open with `rel="noopener noreferrer"`

---

## Authentication Security

### NextAuth.js Security Features
- Secure session handling with JWT
- HTTP-only cookies
- CSRF protection built-in
- Secure cookie settings in production

### Email Magic Links
- Time-limited tokens (24-hour expiration)
- One-time use tokens
- Database validation required
- No passwords to leak or crack

### Admin Authorization
- Database-backed user validation
- Role-based access control (super admin vs regular admin)
- Middleware route protection

---

## API Security

### Authentication
- All admin API routes verify session
- Public endpoints are read-only
- Write operations require authentication

### Error Handling
- **Generic error messages** in production (never expose internal errors)
- **Detailed errors only** on localhost in development
- **No sensitive data** in error responses (no stack traces, connection strings, etc.)
- **Safe error utility** (`lib/safe-error.ts`) for consistent error handling
- **Error logging** server-side only (console, never sent to client)
- **Sensitive pattern detection** (automatically filters connection strings, API keys, etc.)

### CORS
- Same-origin policy enforced
- No CORS headers (API is same-origin only)

---

## Environment Variables

### Required Security Variables
```env
NEXTAUTH_SECRET=<random-32-byte-string>
POSTGRES_PASSWORD=<strong-password>
BREVO_API_KEY=<api-key>
```

### Best Practices
- Never commit `.env.local` to Git
- Use different secrets for dev/staging/production
- Rotate secrets periodically
- Use long, random values

### Secret Generation
```bash
# Generate secure NEXTAUTH_SECRET
openssl rand -base64 32
```

---

## Third-Party Security

### Dependencies
- Regular dependency updates via `npm update`
- Security audits via `npm audit`
- Automated Dependabot alerts on GitHub

### External Services
- **Vercel**: SOC 2 Type II certified
- **Neon Postgres**: SOC 2 Type II certified, encrypted at rest
- **Brevo**: GDPR compliant, ISO 27001 certified

---

## Data Protection

### Personal Data
- Email addresses stored encrypted in Brevo
- No passwords stored (magic link authentication)
- No tracking cookies (Vercel Analytics is privacy-friendly)

### GDPR Compliance
- Privacy Policy page (`/privacy`)
- Terms of Use page (`/terms`)
- Newsletter unsubscribe links
- No unnecessary data collection

---

## Monitoring & Logging

### Error Logging
- Client-side errors logged to console
- Server-side errors logged to Vercel logs
- No sensitive data in logs

### Security Events
- Failed authentication attempts logged
- Rate limit violations logged
- Database errors logged

---

## Incident Response

### If You Find a Vulnerability

**DO NOT** create a public GitHub issue.

Instead:
1. Email: americafirstusateam@gmail.com
2. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)
3. We will respond within 48 hours
4. We will issue a fix within 7 days for critical issues

### Disclosure Policy
- Responsible disclosure appreciated
- Credit given to reporters (if desired)
- Public disclosure after fix is deployed

---

## Security Checklist

### ✅ Implemented

- [x] HTTPS enforcement (HSTS)
- [x] Security headers (CSP-lite, X-Frame-Options, etc.)
- [x] Rate limiting on API endpoints
- [x] Input sanitization (SQL injection, XSS prevention)
- [x] Parameterized database queries
- [x] Secure authentication (NextAuth.js)
- [x] Error boundaries with safe error messages
- [x] CSRF protection (built into NextAuth)
- [x] Secure session management
- [x] Email validation
- [x] URL validation
- [x] No sensitive data in client-side code
- [x] Environment variable protection

### 🔄 Future Enhancements

- [ ] Content Security Policy (CSP) with nonces
- [ ] Redis-based rate limiting (for multi-instance scaling)
- [ ] Automated security scanning (OWASP ZAP)
- [ ] DDoS protection (Cloudflare/AWS Shield)
- [ ] IP-based blocking for repeated violations
- [ ] Security audit logging to external service
- [ ] Honeypot fields for bot detection
- [ ] reCAPTCHA on forms (if spam becomes an issue)

---

## Security Updates

This document was last updated: **2024-08-05**

Security measures are reviewed quarterly and updated as needed.

---

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables#security)
- [Vercel Security](https://vercel.com/docs/security)
- [NextAuth.js Security](https://next-auth.js.org/configuration/options#security)
