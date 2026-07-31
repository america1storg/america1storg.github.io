# America First Website - Project Setup & Documentation

## Overview
A Next.js 16 civic education website with authentication, article management, and a 3D interactive homepage.

**Live Site:** https://america1stusa.vercel.app  
**Repository:** https://github.com/america1storg/america1storg.github.io

---

## Tech Stack

- **Framework:** Next.js 16.2.12 (App Router, Turbopack)
- **Language:** TypeScript
- **Database:** Neon Postgres (serverless, free tier)
- **Authentication:** NextAuth.js v5 with magic links (Gmail SMTP)
- **Deployment:** Vercel
- **Styling:** Tailwind CSS + inline styles
- **3D Graphics:** Three.js (homepage flag animation)
- **Rich Text Editor:** Tiptap (LinkedIn-style article editor)

---

## Database Schema

### Tables

#### `users`
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  is_super_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Super Admin:** americafirstusateam@gmail.com

#### `verification_token`
```sql
CREATE TABLE verification_token (
  identifier TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  token TEXT NOT NULL,
  PRIMARY KEY (identifier, token)
);
```

Used for magic link email authentication.

#### `articles`
```sql
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image TEXT,  -- Base64-encoded images
  slug VARCHAR(200) UNIQUE,  -- SEO-friendly URL slug
  author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Notes:** 
- `cover_image` changed from `VARCHAR(1000)` to `TEXT` to support base64-encoded images (~50KB+)
- `slug` added for SEO-friendly URLs (format: `title-slug-{id}`)

#### `article_images`
```sql
CREATE TABLE article_images (
  id SERIAL PRIMARY KEY,
  article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
  image_url VARCHAR(1000) NOT NULL,
  alt_text VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## Environment Variables

### Required in Vercel

```env
# Neon Postgres (auto-added by Vercel integration)
POSTGRES_URL="postgresql://..."
POSTGRES_PRISMA_URL="postgresql://..."
POSTGRES_URL_NO_SSL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."
POSTGRES_USER="default"
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="verceldb"

# NextAuth
NEXTAUTH_URL="https://america1stusa.vercel.app"
NEXTAUTH_SECRET="<generate-with-openssl-rand-base64-32>"

# Gmail SMTP for Magic Links
EMAIL_SERVER="smtp://americafirstusateam@gmail.com:<app-password>@smtp.gmail.com:587"
EMAIL_FROM="America First <americafirstusateam@gmail.com>"
```

### Gmail App Password Setup
1. Go to Google Account → Security → 2-Step Verification
2. Scroll to "App passwords"
3. Generate password for "Mail"
4. Use format: `smtp://EMAIL:APP_PASSWORD@smtp.gmail.com:587`

---

## Authentication System

### Flow
1. User enters email at `/admin` or `/admin/articles/new`
2. NextAuth sends magic link via Gmail SMTP
3. User clicks link → creates JWT session (no database sessions)
4. Custom email adapter checks if user exists in `users` table
5. Only users in `users` table can sign in

### Files
- **`lib/auth.ts`** - NextAuth configuration with JWT strategy
- **`lib/email-adapter.ts`** - Custom adapter implementing only needed methods
- **`app/api/auth/[...nextauth]/route.ts`** - NextAuth API handler

### Key Points
- **JWT sessions** (not database sessions) - no `sessions` or `accounts` tables needed
- Only users in `users` table can authenticate
- Magic links expire based on `verification_token.expires`

---

## Admin Panel

### Access
**URL:** `/admin`

**Authentication Required:** Yes (magic link)

### Features

#### Dashboard (`/admin`)
- Overview stats
- Quick links to article management

#### Articles Management (`/admin/articles`)
- **Grid view** with cover images
- Filter tabs: All / Published / Drafts
- Actions: Edit, Delete
- Card-based layout with:
  - Cover image (or gradient placeholder)
  - Title, excerpt, status badge
  - Author, publish/create date
  - Edit/Delete buttons

#### New Article (`/admin/articles/new`)
LinkedIn-style rich text editor with:
- **Cover image upload** (file picker or URL)
- **Title input**
- **Toolbar:**
  - Bold, Italic
  - H2, H3 headings
  - Bullet/numbered lists
  - Blockquote
  - Hyperlinks
  - Image insertion (file upload or URL)
  - Code blocks
  - Horizontal dividers
- **Active state tracking** (buttons highlight when active)
- **Save as Draft** or **Publish Now**

#### Edit Article (`/admin/articles/edit/[id]`)
Same editor as new article, pre-filled with existing content.

### Important Notes
- **Cover images:** Stored as base64 in database (no external file storage)
- **Image uploads:** Converted to base64 with FileReader API
- **Excerpt:** Auto-generated from first 200 chars of content (HTML stripped)
- **Published date:** Set on first publish, preserved on updates

---

## Public Pages

### Home (`/`)
- **3D animated flag** (Three.js)
- Floating particles (red, white, blue) - size: 0.015, very subtle
- Scroll-based camera movement
- Background: `#00164D` (navy blue) in dark mode
- Sections: Hero, Mission, Stance, Principles, Closing
- Floating pill navigation bar (centered, rounded-full)

### Articles (`/articles`)
- Card grid (3 columns on desktop)
- Cover images with "ARTICLE" badge
- Hover effects (translate up, image scale)
- Shows only published articles
- Skeleton loading states
- **Share button** on each card (bottom-left)
- Optimized with ISR caching (60s revalidation)

### Article Detail (`/articles/[slug]`)
- **SEO-friendly URLs:** `/articles/title-slug-123` instead of `/articles/123`
- Full-width cover image at top
- **Balanced typography:**
  - Title: 2xl/3xl/4xl (responsive, not overwhelming)
  - Body: 1.125rem with 1.75 line-height
  - Proper paragraph spacing (1.5em between paragraphs)
- Title, author, publish date
- Rich text content (HTML rendered with preserved formatting)
- Back to articles link
- **Share button** next to author/date
- Open Graph meta tags for social media
- Twitter Card support
- Pre-rendered with `generateStaticParams`
- **Backward compatible:** Old `/articles/123` URLs still work

### About (`/about`)
- Mission statement
- Organization principles
- Core values
- Skeleton loading state

### Theme Toggle
- Floating pill switch (gradient background)
- Dark mode: Blue gradient (`#60A5FA` to `#3B82F6`) with moon 🌙
- Light mode: Orange-red gradient (`#FB923C` to `#F87171`) with sun ☀️
- Smooth sliding animation (duration-300)
- Persists across sessions
- Gradient shadows matching theme

---

## API Routes

### `GET /api/articles`
Returns all articles (authenticated: all, public: published only).

### `POST /api/articles`
Create new article (authenticated only).

**Body:**
```json
{
  "title": "string",
  "content": "string (HTML)",
  "cover_image": "string (base64 or URL)",
  "status": "draft | published",
  "author_id": "number"
}
```

### `GET /api/articles/[id]`
Get single article by ID.

### `PUT /api/articles/[id]`
Update article (authenticated only).

**Body:**
```json
{
  "title": "string",
  "content": "string (HTML)",
  "cover_image": "string (base64 or URL)",
  "status": "draft | published"
}
```

### `DELETE /api/articles/[id]`
Delete article (authenticated only).

### `GET /api/migrate-cover-image`
One-time migration to change `cover_image` column from `VARCHAR(1000)` to `TEXT`.

### `GET /api/migrate-slugs`
One-time migration to:
- Add `slug` column to articles table
- Generate slugs for all existing articles
- Format: `{title-slug}-{id}` (e.g., `america-first-economic-policy-123`)

---

## Database Migrations

### Initial Setup
Run once on first deployment:

```bash
# Access from Vercel Functions or local with POSTGRES_URL
npm run db:init
```

Or visit: `https://america1stusa.vercel.app/api/init-db`

### Cover Image Column Fix
If articles lose cover images, run:

`https://america1stusa.vercel.app/api/migrate-cover-image`

This changes `articles.cover_image` from `VARCHAR(1000)` to `TEXT`.

### Add Slugs to Existing Articles
After deployment, run once:

`https://america1stusa.vercel.app/api/migrate-slugs`

This:
1. Adds `slug` column to articles table (if not exists)
2. Generates SEO-friendly slugs for all existing articles
3. Format: `title-kebab-case-{id}`

---

## Deployment (Vercel)

### First-Time Setup

1. **Connect GitHub repo** to Vercel
2. **Add Neon Postgres:**
   - Dashboard → Storage → Create Database → Neon
   - Auto-adds `POSTGRES_*` env vars
3. **Add env vars** (see Environment Variables section)
4. **Deploy** (auto-triggers on push to `main`)
5. **Initialize database:**
   - Visit `/api/init-db` after first deployment
6. **Test authentication:**
   - Go to `/admin` → enter `americafirstusateam@gmail.com`
   - Check email for magic link

### Subsequent Deploys
Push to `main` branch → auto-deploys.

### Build Commands
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start"
  }
}
```

---

## File Structure

```
app/
├── admin/
│   └── articles/
│       ├── page.tsx          # Article list (grid view)
│       ├── loading.tsx        # Skeleton
│       ├── new/page.tsx       # Create article
│       └── edit/[id]/page.tsx # Edit article
├── articles/
│   ├── page.tsx               # Public article list
│   ├── loading.tsx            # Skeleton
│   └── [slug]/
│       ├── page.tsx           # Article detail
│       └── loading.tsx        # Skeleton
├── about/
│   ├── page.tsx
│   └── loading.tsx
├── api/
│   ├── auth/[...nextauth]/route.ts
│   ├── articles/
│   │   ├── route.ts           # GET, POST
│   │   └── [id]/route.ts      # GET, PUT, DELETE
│   ├── init-db/route.ts
│   └── migrate-cover-image/route.ts
└── page.tsx                   # Homepage (3D flag)

components/
├── ArticleClient.tsx          # Client-side article display
├── ArticleEditor.tsx          # Tiptap rich text editor
├── ArticlesClient.tsx         # Client-side articles grid
├── ShareButton.tsx            # Social media share popup
├── Footer.tsx
├── Navigation.tsx             # Floating pill navbar
├── ThemeProvider.tsx          # Dark/light mode context
└── ThemeToggle.tsx            # Gradient pill switch

lib/
├── auth.ts                    # NextAuth config
├── email-adapter.ts           # Custom email adapter
├── db.ts                      # Database init script
└── slug.ts                    # URL slug generation utilities

public/
├── logo-transparent.png       # AFAmerica1st_no_background (used in navbar)
├── logo-icon.png              # Old logo
├── logo-full-transparent.png  # Full logo variant
└── file.svg, globe.svg, etc.  # Next.js default assets
```

---

## Key Design Decisions

### Why JWT Sessions?
- Simpler than database sessions
- No need for `sessions` or `accounts` tables
- Scales better (stateless)
- Magic links work without complex adapter

### Why Custom Email Adapter?
- `PostgresAdapter` required standard NextAuth schema
- Our schema is custom (`users` table without `emailVerified`, etc.)
- Only needed 6 methods: `createUser`, `getUser`, `getUserByEmail`, `updateUser`, `createVerificationToken`, `useVerificationToken`

### Why Base64 Images?
- No external storage (S3, Cloudinary) needed
- Simple file upload flow
- Works with free Neon Postgres
- **Caveat:** Large images increase database size
- **Note:** Requires TEXT column (not VARCHAR) for full base64 strings

### Why Neon Instead of Vercel Postgres?
- User couldn't find Vercel Postgres in marketplace
- Neon is free, serverless, and integrates seamlessly
- Auto-adds env vars to Vercel

### Why Loading Skeletons?
- Instant visual feedback (perceived performance)
- Better UX than blank screens or spinners
- Matches final layout (reduces layout shift)
- Theme-aware (dark/light mode)

---

## Common Issues & Solutions

### Issue: Cover images not saving
**Cause:** `VARCHAR(1000)` too small for base64 images  
**Fix:** Visit `/api/migrate-cover-image` to change to `TEXT`

### Issue: Magic link doesn't work
**Cause:** Gmail App Password incorrect or EMAIL_SERVER malformed  
**Fix:** Regenerate App Password, ensure format: `smtp://email:password@smtp.gmail.com:587`

### Issue: "Column emailVerified does not exist"
**Cause:** Using PostgresAdapter with custom schema  
**Fix:** Already fixed - using custom `EmailAdapter()` instead

### Issue: Build fails on TypeScript errors
**Cause:** Missing type definitions (usually `cover_image` in interfaces)  
**Fix:** Add `cover_image: string | null` to all Article interfaces

### Issue: Articles page loads slowly
**Fix:** Already optimized with:
- `next: { revalidate: 60 }` caching
- `generateStaticParams` for pre-rendering
- Loading skeletons for perceived performance

---

## Performance Optimizations

1. **ISR Caching:** 60-second revalidation on article fetches (`next: { revalidate: 60 }`)
2. **Static Generation:** `generateStaticParams` pre-renders article pages at build time
3. **Loading Skeletons:** Instant visual feedback on all pages (articles, article detail, admin, about)
4. **Image Optimization:** Next.js `<Image>` component for logo
5. **Three.js:** Optimized particle count (800 particles at 0.015 size, opacity 0.3)
6. **Code Splitting:** Next.js automatic code splitting per route
7. **Client Components:** Only interactive components use 'use client' directive

---

## Recent Updates (July 31, 2026)

✅ **Typography & Readability (Latest)**
- Reduced article title size for better balance (text-3xl/4xl instead of text-6xl)
- Improved paragraph spacing (1.5em between paragraphs)
- Larger body text (1.125rem with 1.75 line-height)
- Preserved blank lines and formatting from editor
- Responsive typography across all devices

✅ **SEO-Friendly URLs (Latest)**
- Article URLs now use slugs: `/articles/title-slug-123`
- Auto-generated from article titles
- Backward compatible with old `/articles/123` URLs
- Unique slug generation with ID suffix
- Migration API: `/api/migrate-slugs`

✅ **Social Media Sharing**
- Share button component with X, Facebook, LinkedIn
- Copy link functionality
- Open Graph meta tags for article previews
- Twitter Card support (summary_large_image)
- Cover images appear in social media shares

✅ **UI/UX Improvements**
- Floating pill navigation bar (centered, rounded-full)
- Gradient pill theme toggle with smooth animations
- Loading skeletons on all pages
- Transparent logo (AFAmerica1st_no_background)
- Modern card-based article grids

✅ **Performance**
- ISR caching (60s revalidation)
- `generateStaticParams` for article pre-rendering
- Optimized Three.js particles (smaller, more subtle)
- Background color changed to navy blue (#00164D)

✅ **Database**
- Cover image column migrated from VARCHAR(1000) to TEXT
- Base64 image support (up to ~1MB per image)
- Slug column added (VARCHAR 200, UNIQUE)

## Future Enhancements (Suggestions)

- [ ] Add search functionality for articles
- [ ] Add categories/tags for articles
- [ ] Add comments system
- [ ] Switch to external image storage (S3/Cloudinary) for better performance
- [ ] Add analytics (Vercel Analytics or Google Analytics)
- [ ] Add sitemap generation
- [ ] Add RSS feed
- [ ] Add article preview before publishing
- [ ] Add markdown support as alternative to HTML editor
- [ ] Add user roles (admin, editor, viewer)
- [ ] Add article scheduling (publish at future date)
- [ ] Add article view counter
- [ ] Add related articles section

---

## Troubleshooting Commands

```bash
# Check build locally
npm run build

# Check TypeScript errors
npx tsc --noEmit

# View Vercel deployment logs
vercel logs <deployment-url>

# Reinitialize database (destructive!)
# Visit: https://america1stusa.vercel.app/api/init-db

# Test authentication locally
npm run dev
# Visit: http://localhost:3000/admin
```

---

## Contact & Admin Access

**Super Admin Email:** americafirstusateam@gmail.com  
**GitHub:** https://github.com/america1storg  
**Deployed Site:** https://america1stusa.vercel.app

---

## Last Updated
July 31, 2026 (Evening)

## Project Status
✅ **Production Ready & Actively Enhanced**
- ✅ Authentication working (Gmail magic links)
- ✅ Article CRUD with cover images
- ✅ Cover images persistent (TEXT column)
- ✅ Loading skeletons on all pages
- ✅ Social media sharing (X, Facebook, LinkedIn)
- ✅ Open Graph meta tags
- ✅ Theme toggle (gradient pill)
- ✅ 3D homepage optimized (navy blue background)
- ✅ Transparent logo in floating navbar
- ✅ ISR caching for fast page loads
- ✅ Card-based article grids with share buttons

## Known Working Features
- Magic link authentication via Gmail SMTP
- Article creation with cover images and rich text
- Draft/publish workflow
- Article editing with persistent cover images
- Social sharing with cover image previews
- Dark/light theme with persistence
- Loading skeletons across all routes
- Responsive design (mobile, tablet, desktop)
- Three.js 3D flag animation
- Admin dashboard and article management
