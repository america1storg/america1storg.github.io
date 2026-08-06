# Social Share Preview Fix

## Problem
Social media platforms (Facebook, Twitter/X, LinkedIn, Pinterest) weren't showing proper preview images when sharing links from the site because:
1. Open Graph image URLs were relative paths (`/logo-dark.png`) instead of absolute URLs
2. No proper 1200x630px OG image was configured
3. Twitter card metadata was incomplete

## Solution

### 1. Created Dynamic OG Image API Route
**File:** `app/api/og/route.tsx`

- Uses Next.js `ImageResponse` API (edge runtime)
- Generates 1200x630px images on-demand
- Beautiful gradient background with "America First" branding
- No external dependencies needed

**URL:** `https://america1stusa.com/api/og`

### 2. Updated All Page Metadata

Fixed Open Graph and Twitter metadata on:

- **Homepage** (`app/layout.tsx`)
- **Articles List** (`app/articles/page.tsx`)
- **Individual Articles** (`app/articles/[slug]/page.tsx`)
- **About** (`app/about/layout.tsx`)
- **Resources** (`app/resources/layout.tsx`)
- **Get Involved** (`app/get-involved/layout.tsx`)

All now include:
```typescript
openGraph: {
  images: [{
    url: 'https://america1stusa.com/api/og',  // Absolute URL
    width: 1200,
    height: 630,
    alt: 'Page Title'
  }]
},
twitter: {
  card: 'summary_large_image',
  images: ['https://america1stusa.com/api/og']
}
```

### 3. Article Pages Enhanced

Individual articles now:
- Use their cover_image if available (converted to absolute URL)
- Fall back to `/api/og` if no cover image
- Properly configured for both OpenGraph and Twitter cards

### 4. Updated Structured Data

Fixed `components/StructuredData.tsx`:
- Changed logo references from `/logo.png` to absolute URL
- Organization schema now points to `https://america1stusa.com/logo-transparent.png`
- Article publisher logo also uses absolute URL

## Testing

### Before Deployment:
1. **Local test**: `npm run build` ✅ (completed successfully)
2. **OG route**: Visit `/api/og` after deployment to see the image

### After Deployment:
Test social share previews:

1. **Facebook Debugger**: https://developers.facebook.com/tools/debug/
   - Enter: `https://america1stusa.com`
   - Should show 1200x630 image with "America First" branding

2. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
   - Enter: `https://america1stusa.com`
   - Should show summary_large_image card

3. **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/
   - Enter: `https://america1stusa.com`
   - Should show proper preview

4. **Test URLs**:
   - Homepage: `https://america1stusa.com`
   - Articles: `https://america1stusa.com/articles`
   - About: `https://america1stusa.com/about`
   - Resources: `https://america1stusa.com/resources`
   - Get Involved: `https://america1stusa.com/get-involved`
   - Any article page

## What Users Will See

When sharing any page from the site on social media:

### Facebook / LinkedIn
- **Image**: Beautiful blue gradient with "America First" title
- **Title**: Page-specific (e.g., "About America First")
- **Description**: Page-specific meta description

### Twitter/X
- **Card Type**: Large image (summary_large_image)
- **Image**: Same as Facebook
- **Title**: Page-specific
- **Description**: Page-specific

### Article Pages
- If article has a cover image: Uses that image
- If no cover image: Falls back to default OG image
- Always shows article title and excerpt

## Technical Details

### Why Edge Runtime?
The OG image route uses `export const runtime = 'edge'` because:
- Faster cold starts
- Global distribution on Vercel's edge network
- Lower cost than serverless functions
- Perfect for image generation

### Image Generation
Next.js 13+ includes built-in OG image generation:
- No puppeteer/canvas dependencies
- Pure React/JSX syntax
- Automatic caching
- Vercel optimizes delivery

### Fallback Strategy
Articles with covers → Custom image (user's cover)
Articles without covers → Default OG image (`/api/og`)
Static pages → Default OG image (`/api/og`)

## Files Changed

### New Files:
- `app/api/og/route.tsx` - Dynamic OG image generator
- `SOCIAL_SHARE_FIX.md` - This file

### Modified Files:
- `app/layout.tsx` - Fixed OG/Twitter metadata
- `app/articles/page.tsx` - Added OG images
- `app/articles/[slug]/page.tsx` - Fixed cover image URLs + fallback
- `app/about/layout.tsx` - Added OG/Twitter cards
- `app/resources/layout.tsx` - Added OG/Twitter cards
- `app/get-involved/layout.tsx` - Added OG/Twitter cards
- `components/StructuredData.tsx` - Fixed logo URLs

## Expected Result

✅ Facebook shares show proper preview
✅ Twitter/X shares show large image card
✅ LinkedIn shares show proper preview
✅ Pinterest pins work correctly
✅ All platforms show 1200x630 optimized image
✅ Article cover images display when available
✅ Fallback to branded image when no cover

## Cache Clearing

After deployment, if old previews still appear:

1. **Facebook**: Use Debug Tool to scrape new data
2. **Twitter**: Card updates automatically within ~7 days
3. **LinkedIn**: Use Post Inspector to refresh

## Future Enhancements

Potential improvements:
- Generate dynamic images per article (with article title overlay)
- Custom OG images per page section
- Add subtle logo watermark to generated images
- A/B test different gradient colors

---

*Fixed: August 6, 2026*
