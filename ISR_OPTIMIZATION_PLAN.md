# ISR Optimization Plan - America First Website

## Current ISR Usage Analysis

### Critical Issues Found:

1. **Homepage (`app/page.tsx`)**: Uses `force-dynamic` - regenerates on EVERY request ❌
2. **About Page (`app/about/page.tsx`)**: Uses `force-dynamic` - regenerates on EVERY request ❌
3. **Articles List (`app/articles/page.tsx`)**: 60-second revalidation ⚠️
4. **Individual Articles (`app/articles/[slug]/page.tsx`)**: 60-second revalidation ⚠️

### Estimated ISR Writes:

**Before Optimization:**
- Homepage: ~40,000-60,000/month (with crawlers)
- About: ~40,000-60,000/month  
- Articles list: ~43,200/month
- Each article: ~43,200/month
- **Total with 10 articles:** ~500,000+ ISR writes/month 🔥

**After Optimization:**
- Homepage: Static (0 ISR writes)
- About: Static (0 ISR writes)
- Articles list: ~720/month (1x per day)
- Each article: ~720/month (1x per day)
- **Total with 10 articles:** ~8,640 ISR writes/month ✅

## Optimization Strategy:

### 1. Remove `force-dynamic` from static pages
- Homepage and About don't need dynamic rendering
- Theme is client-side only

### 2. Increase revalidation times dramatically
- Articles list: 60s → 86400s (24 hours)
- Individual articles: 60s → 86400s (24 hours)
- generateStaticParams: 3600s → 86400s (24 hours)

### 3. Add on-demand revalidation
- When articles are created/edited/deleted, use `revalidatePath()`
- Only regenerate when content actually changes

### 4. Set proper caching headers
- Add cache control for API routes

## Implementation:

See the code changes below...
