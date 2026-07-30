# Logo Integration Guide

This document shows where and how the America First logos are used throughout the website.

---

## 📁 Logo Assets

All logos are stored in the `public/` directory:

| File | Description | Size | Usage |
|------|-------------|------|-------|
| `logo-icon.png` | Icon only (A1F symbol) | 958KB | Navigation, favicon, small spaces |
| `logo-full.jpg` | Full logo with text (white bg) | 75KB | Marketing materials |
| `logo-full-transparent.png` | Full logo with text (transparent) | 123KB | Hero section, overlays |

---

## 🎨 Logo Placement Map

### 1. **Navigation Bar** (All Pages)

**Location:** Top of every page  
**Logo Used:** `logo-icon.png` (40x40px) + "America First" text  
**Files:**
- `app/page.tsx` - Homepage navigation
- `app/admin/layout.tsx` - Admin panel navigation

```tsx
<Image src="/logo-icon.png" alt="America First" width={40} height={40} />
```

**Appearance:**
```
┌────────────────────────────────────────────────┐
│ [🗽] America First    Articles | About | Admin │
└────────────────────────────────────────────────┘
```

---

### 2. **Homepage Hero Section**

**Location:** Center of landing page (above title)  
**Logo Used:** `logo-full-transparent.png` (400x200px → responsive h-32/h-48)  
**File:** `app/page.tsx`

```tsx
<Image 
  src="/logo-full-transparent.png" 
  alt="America First" 
  width={400} 
  height={200}
  className="w-auto h-32 md:h-48"
  priority
/>
```

**Appearance:**
```
┌──────────────────────────────────────┐
│                                      │
│         [LARGE LOGO IMAGE]           │
│                                      │
│   Civic Education • Constitutional   │
│        Principles • Truth & Data     │
│                                      │
└──────────────────────────────────────┘
```

---

### 3. **Footer** (Homepage)

**Location:** Bottom of homepage  
**Logo Used:** `logo-icon.png` (40x40px) + "America First" text  
**File:** `app/page.tsx`

```tsx
<Image src="/logo-icon.png" alt="America First" width={40} height={40} />
<h3>America First</h3>
```

**Appearance:**
```
┌────────────────────────────────────────────────┐
│ [🗽] America First                             │
│ Nonpartisan civic education for informed       │
│ citizenship                                    │
└────────────────────────────────────────────────┘
```

---

### 4. **Articles Page Header**

**Location:** Top left, back navigation  
**Logo Used:** `logo-icon.png` (24x24px)  
**File:** `app/articles/page.tsx`

```tsx
<Image src="/logo-icon.png" alt="America First" width={24} height={24} />
← Back to Home
```

**Appearance:**
```
┌────────────────────────────────────────────────┐
│ [🗽] ← Back to Home                            │
│                                                │
│ Articles                                       │
└────────────────────────────────────────────────┘
```

---

### 5. **Individual Article Page**

**Location:** Top left, back navigation  
**Logo Used:** `logo-icon.png` (24x24px)  
**File:** `app/articles/[slug]/page.tsx`

```tsx
<Image src="/logo-icon.png" alt="America First" width={24} height={24} />
← Back to Articles
```

**Appearance:**
```
┌────────────────────────────────────────────────┐
│ [🗽] ← Back to Articles                        │
└────────────────────────────────────────────────┘
```

---

### 6. **About Page**

**Location:** Top left, back navigation  
**Logo Used:** `logo-icon.png` (24x24px)  
**File:** `app/about/page.tsx`

```tsx
<Image src="/logo-icon.png" alt="America First" width={24} height={24} />
← Back to Home
```

**Appearance:**
```
┌────────────────────────────────────────────────┐
│ [🗽] ← Back to Home                            │
│                                                │
│ About America First                            │
└────────────────────────────────────────────────┘
```

---

### 7. **Admin Panel**

**Location:** Top left navigation bar  
**Logo Used:** `logo-icon.png` (32x32px) + text  
**File:** `app/admin/layout.tsx`

```tsx
<Image src="/logo-icon.png" alt="America First" width={32} height={32} />
<span>America First</span>
<span>Admin Panel</span>
```

**Appearance:**
```
┌────────────────────────────────────────────────┐
│ [🗽] America First | Admin Panel    Sign Out   │
└────────────────────────────────────────────────┘
```

---

### 8. **Browser Tab (Favicon)**

**Location:** Browser tab/bookmark  
**Logo Used:** `logo-icon.png` (as favicon.ico)  
**File:** `app/favicon.ico`

**Appearance:**
```
Browser Tab:
┌─────────────────────────────┐
│ [🗽] America First - Civic... │
└─────────────────────────────┘
```

---

### 9. **Metadata (SEO)**

**Location:** HTML head, search results, social shares  
**Logo Used:** `logo-icon.png`  
**File:** `app/layout.tsx`

```tsx
export const metadata = {
  icons: {
    icon: '/logo-icon.png',
    apple: '/logo-icon.png',
  },
};
```

**Appearance:**
- Shows in search engine results
- Shows when shared on social media
- Shows as app icon on mobile devices

---

## 🎯 Logo Usage Guidelines

### Size Guidelines

| Location | Recommended Size | Actual Implementation |
|----------|------------------|----------------------|
| Hero Section | Large (150-400px height) | `h-32 md:h-48` (128-192px) |
| Navigation | Medium (32-40px) | `w-10 h-10` (40px) |
| Footer | Medium (40px) | `w-10 h-10` (40px) |
| Admin Nav | Small-Medium (32px) | `w-8 h-8` (32px) |
| Back Links | Small (24px) | `w-6 h-6` (24px) |
| Favicon | Icon (16x16, 32x32, etc.) | PNG converted to ICO |

### When to Use Each Logo

**Use `logo-icon.png` (icon only) when:**
- Space is limited (navigation bars)
- Need compact branding
- Alongside text that says "America First"
- In favicons

**Use `logo-full-transparent.png` (full logo) when:**
- Hero sections
- Large displays
- No accompanying text needed
- Over colored/image backgrounds

**Use `logo-full.jpg` (full logo, white bg) when:**
- Printing materials
- Email signatures
- Documents
- White backgrounds

---

## 🔧 Technical Implementation

### Next.js Image Component

All logos use the Next.js `Image` component for optimization:

```tsx
import Image from 'next/image';

<Image
  src="/logo-icon.png"
  alt="America First"
  width={40}
  height={40}
  className="w-10 h-10"
  priority // Only for above-fold images
/>
```

**Benefits:**
- Automatic image optimization
- Lazy loading (except `priority` images)
- Responsive image serving
- Better performance

### Responsive Sizing

Using Tailwind CSS classes for responsive logos:

```tsx
// Small on mobile, larger on desktop
className="w-8 h-8 md:w-10 md:h-10"

// Auto-sizing
className="w-auto h-32 md:h-48"
```

---

## 📊 Logo Impact

### Before vs After

**Before (No Logos):**
- Generic text-only branding
- Less professional appearance
- Harder brand recognition
- Plain navigation

**After (With Logos):**
- ✅ Professional branded appearance
- ✅ Instant brand recognition
- ✅ Consistent visual identity
- ✅ Enhanced user experience
- ✅ Better SEO (favicon, metadata)
- ✅ Improved trust and credibility

---

## 🔄 Updating Logos

If logos need to be updated in the future:

1. **Add new logo files to `public/`**
   ```bash
   cp new-logo.png public/logo-icon.png
   ```

2. **Clear Next.js cache**
   ```bash
   rm -rf .next
   ```

3. **Rebuild**
   ```bash
   npm run build
   ```

4. **Test all pages**
   - Homepage
   - Articles
   - About
   - Admin panel
   - Check favicon in browser

5. **Commit and deploy**
   ```bash
   git add public/
   git commit -m "Update logos"
   git push
   ```

---

## 🎨 Brand Consistency

### Logo Colors

The logos use official American flag colors:
- **Navy Blue:** #1e3a8a (RGB: 30, 58, 138)
- **Red:** #b91c1c (RGB: 185, 28, 28)
- **White:** #ffffff (RGB: 255, 255, 255)

These match the website's color scheme perfectly:
- `blue-900` in Tailwind = #1e3a8a
- `red-700` in Tailwind = #b91c1c

### Logo Spacing

Maintain proper spacing around logos:
- **Gap with text:** `gap-2` or `gap-3` (8-12px)
- **Margin around logo:** Minimum 8px clear space
- **Never crop the logo**
- **Never distort aspect ratio**

---

## ✅ Checklist: Logo Integration Complete

- [x] Logo files added to `public/`
- [x] Homepage navigation updated
- [x] Homepage hero updated
- [x] Homepage footer updated
- [x] Articles page updated
- [x] Individual article pages updated
- [x] About page updated
- [x] Admin panel updated
- [x] Favicon updated
- [x] Metadata updated
- [x] Build tested and passing
- [x] All images using Next.js Image component
- [x] Responsive sizing implemented
- [x] Alt text provided for accessibility
- [x] Changes committed and pushed

---

## 📞 Questions?

For logo usage questions or brand guidelines, contact:
- Email: americafirstusateam@gmail.com

---

**Last Updated:** 2024-07-30  
**Version:** 1.0  
**Status:** ✅ Complete
