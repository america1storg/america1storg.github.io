# America First Website - Complete Project Setup Guide

## Overview
A Next.js 16 civic education website with authentication, article management, dynamic resource cards, volunteer opportunity cards with drag-and-drop ordering, and a 3D interactive homepage.

**Live Site:** https://america1stusa.vercel.app  
**Repository:** https://github.com/america1storg/america1storg.github.io

---

## Tech Stack

- **Framework:** Next.js 16.2.12 (App Router, Turbopack)
- **Language:** TypeScript
- **Database:** Neon Postgres (serverless via Vercel integration)
- **File Storage:** Vercel Blob (for resource card images)
- **Authentication:** NextAuth.js v5 with magic links (Gmail SMTP)
- **Deployment:** Vercel
- **Styling:** Tailwind CSS + inline styles
- **3D Graphics:** Three.js (homepage flag animation)
- **Rich Text Editor:** Tiptap (LinkedIn-style article editor)
- **Image CDN:** Vercel Blob Storage with Next.js Image optimization

---

## Setting Up on a New Machine

### Prerequisites
- Node.js 18+ installed
- Git installed
- Access to Vercel account
- Access to `americafirstusateam@gmail.com` for admin

### Step 1: Clone the Repository

```bash
git clone https://github.com/america1storg/america1storg.github.io.git
cd america1storg.github.io
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Environment Variables

Create `.env.local` file:

```env
# Neon Postgres (get these from Vercel dashboard after connecting Neon)
POSTGRES_PRISMA_URL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."
DATABASE_URL="postgresql://..."  # Optional fallback for local dev

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<generate-with-openssl-rand-base64-32>"

# Gmail SMTP for Magic Links
EMAIL_SERVER="smtp://americafirstusateam@gmail.com:<app-password>@smtp.gmail.com:587"
EMAIL_FROM="America First <americafirstusateam@gmail.com>"

# Vercel Blob (get these from Vercel dashboard after creating Blob store)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

**Gmail App Password:**
1. Go to Google Account → Security → 2-Step Verification
2. Scroll to "App passwords"
3. Generate password for "Mail"
4. Use in EMAIL_SERVER

### Step 4: Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

### Step 5: Verify Database Connection

The database tables should already exist in production. To verify locally:

```bash
# Check if you can connect to Neon
node -e "const { neon } = require('@neondatabase/serverless'); const sql = neon(process.env.POSTGRES_PRISMA_URL); sql\`SELECT NOW()\`.then(console.log);"
```

### Step 6: Test Admin Access

1. Go to `http://localhost:3000/admin`
2. Sign in with `americafirstusateam@gmail.com`
3. Check email for magic link
4. Verify you can access admin dashboard

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

#### `resources` (NEW - September 2026)
```sql
CREATE TABLE IF NOT EXISTS resources (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  description TEXT NOT NULL,
  domain VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  image_url TEXT NOT NULL,  -- Vercel Blob URLs
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Stores:** Civic resource cards (GovTrack, Congress.gov, etc.)  
**Images:** Professional AI-generated images at 1200x520px stored in Vercel Blob  
**Admin URL:** `/admin/resources`

#### `volunteers` (NEW - September 2026)
```sql
CREATE TABLE IF NOT EXISTS volunteers (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  description TEXT NOT NULL,
  domain VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  image_url TEXT NOT NULL,  -- Vercel Blob URLs
  display_order INTEGER DEFAULT 0,  -- For custom drag-and-drop ordering
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_volunteers_display_order ON volunteers(display_order);
```

**Stores:** Volunteer opportunity cards (AmeriCorps, JustServe, etc.)  
**Images:** Professional AI-generated images at 1200x520px stored in Vercel Blob  
**Admin URL:** `/admin/volunteers`  
**Features:** Drag-and-drop reordering, custom display order, separate Blob folder

---

## Environment Variables

### Required in Vercel (Production)

```env
# Neon Postgres (auto-added by Vercel Neon integration)
POSTGRES_URL="postgresql://..."
POSTGRES_PRISMA_URL="postgresql://..."  # Used by app
POSTGRES_URL_NO_SSL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."
POSTGRES_USER="default"
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="verceldb"

# NextAuth
NEXTAUTH_URL="https://america1stusa.vercel.app"
NEXTAUTH_SECRET="<your-secret>"

# Gmail SMTP for Magic Links
EMAIL_SERVER="smtp://americafirstusateam@gmail.com:<app-password>@smtp.gmail.com:587"
EMAIL_FROM="America First <americafirstusateam@gmail.com>"

# Vercel Blob Storage (auto-added when creating Blob store)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
```

### How to Get Vercel Environment Variables

1. **Neon Postgres:**
   - Vercel Dashboard → Your Project → Storage tab
   - Click "Create Database" → Select "Neon Postgres"
   - All `POSTGRES_*` variables auto-populate

2. **Vercel Blob:**
   - Vercel Dashboard → Your Project → Storage tab
   - Click "Create Database" → Select "Blob"
   - `BLOB_READ_WRITE_TOKEN` auto-populates

3. **Manual Variables:**
   - Settings → Environment Variables
   - Add `NEXTAUTH_SECRET`, `EMAIL_SERVER`, `EMAIL_FROM`

---

## Architecture Overview

### Resource Card System (NEW)

**Problem Solved:** Previously, resource cards were hardcoded in the component. Adding new cards required code changes, git commits, and deployments.

**Solution:** Database-driven resource cards with admin CRUD interface and Vercel Blob image storage.

**Flow:**
1. Admin uploads AI-generated image (1200x520px) via drag & drop
2. Image uploaded to Vercel Blob CDN (instant, public URLs)
3. Card details saved to Neon Postgres `resources` table
4. Public page fetches from `/api/resources` (database-backed)
5. Next.js Image component optimizes images with CDN caching
6. **Result:** New cards live immediately, no code deployment needed

**Files:**
- **Frontend:** `app/resources/page.tsx` (public page)
- **Admin:** `app/admin/resources/page.tsx` (CRUD interface)
- **API:** `app/api/resources/route.ts` (GET all, POST new)
- **API:** `app/api/resources/[id]/route.ts` (PUT update, DELETE)
- **API:** `app/api/resources/upload-image/route.ts` (Blob upload)
- **Config:** `next.config.ts` (Blob domain in remotePatterns)

---

## Authentication System

### Flow
1. User enters email at `/admin` or protected route
2. NextAuth sends magic link via Gmail SMTP
3. User clicks link → creates JWT session
4. Custom email adapter verifies user exists in `users` table
5. Only users in `users` table can sign in

### Files
- **`lib/auth.ts`** - NextAuth configuration with JWT strategy
- **`lib/email-adapter.ts`** - Custom adapter for email-only auth
- **`app/api/auth/[...nextauth]/route.ts`** - NextAuth API handler

### Key Points
- **JWT sessions** (not database sessions)
- No `sessions` or `accounts` tables needed
- Magic links expire based on `verification_token.expires`
- Only whitelisted users can authenticate

---

## Admin Panel

### Access
**URL:** `/admin`

**Authentication Required:** Yes (magic link)

### Features

#### Dashboard (`/admin`)
- Overview stats
- Quick links to articles and resources
- Navigation to articles, resources

#### Articles Management (`/admin/articles`)
- Grid view with cover images
- Filter: All / Published / Drafts
- Create, edit, delete articles
- Rich text editor (Tiptap)

#### Resources Management (`/admin/resources`) - NEW
- **Full CRUD interface** for resource cards
- **Drag & drop image upload** to Vercel Blob
- **Form fields:**
  - Title (e.g., "GovTrack")
  - URL (external link)
  - Description (2-3 sentences)
  - Domain (for favicon)
  - Category (e.g., "Legislative")
  - Image URL (auto-filled from upload)
- **Live preview** of uploaded images
- **Edit/Delete** buttons for each card
- **No deployment required** - changes live immediately

---

## Public Pages

### Home (`/`)
- 3D animated flag (Three.js)
- Floating particles (red, white, blue)
- Scroll-based camera movement
- Sections: Hero, Mission, Stance, Principles, Closing

### Articles (`/articles`)
- Card grid (3 columns on desktop)
- Cover images with "ARTICLE" badge
- Hover effects
- Shows only published articles
- Share buttons
- ISR caching (60s revalidation)

### Article Detail (`/articles/[slug]`)
- SEO-friendly URLs: `/articles/title-slug-123`
- Full-width cover image
- Rich text content
- Social share buttons
- Open Graph meta tags

### Resources (`/resources`) - UPDATED
- **Database-driven cards** (10+ resources)
- **Professional AI-generated images** (1200x520px from Vercel Blob)
- **Category badges** (Executive, Legislative, Elections, etc.)
- **Skeleton loading** while fetching
- **Progressive image loading** with gradients
- **External link modal** for safety
- **Responsive grid** (1/2/3 columns)

### Get Involved (`/get-involved`)
- Volunteer opportunity cards
- Currently uses external OG images
- **To be migrated** to database-driven system (see VOLUNTEER_IMAGE_PROMPTS.md)

### About (`/about`)
- Mission statement
- Organization principles
- Contact information

---

## API Routes

### Articles

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/articles` | GET | Public (published) / Admin (all) | Get all articles |
| `/api/articles` | POST | Admin | Create article |
| `/api/articles/[id]` | GET | Public | Get single article |
| `/api/articles/[id]` | PUT | Admin | Update article |
| `/api/articles/[id]` | DELETE | Admin | Delete article |

### Resources (NEW)

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/resources` | GET | Public | Get all resources |
| `/api/resources` | POST | Admin | Create resource |
| `/api/resources/[id]` | PUT | Admin | Update resource |
| `/api/resources/[id]` | DELETE | Admin | Delete resource |
| `/api/resources/upload-image` | POST | Admin | Upload image to Vercel Blob |

**Example POST /api/resources:**
```json
{
  "title": "GovTrack",
  "url": "https://www.govtrack.us/congress/bills/",
  "description": "Track Congress with clear visualizations...",
  "domain": "govtrack.us",
  "category": "Legislative",
  "image_url": "https://zvlofasbk97vnlui.public.blob.vercel-storage.com/resources/govtrack.jpg"
}
```

### Volunteers (NEW - September 2026)

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/volunteers` | GET | Public | Get all volunteers (ordered by display_order) |
| `/api/volunteers` | POST | Admin | Create volunteer opportunity |
| `/api/volunteers/[id]` | PUT | Admin | Update volunteer opportunity |
| `/api/volunteers/[id]` | DELETE | Admin | Delete volunteer opportunity |
| `/api/volunteers/upload-image` | POST | Admin | Upload image to Vercel Blob (volunteers folder) |
| `/api/volunteers/reorder` | POST | Admin | Update display order (drag-and-drop) |

**Example POST /api/volunteers:**
```json
{
  "title": "AmeriCorps",
  "url": "https://www.americorps.gov/join/find-volunteer-opportunity#/",
  "description": "Huge national database with 100,000+ volunteer opportunities...",
  "domain": "americorps.gov",
  "category": "National Service",
  "image_url": "https://zvlofasbk97vnlui.public.blob.vercel-storage.com/volunteers/americorps.jpg"
}
```

**Example POST /api/volunteers/reorder:**
```json
{
  "orderedIds": [3, 1, 5, 2, 4]
}
```

---

## File Structure

```
app/
├── admin/
│   ├── layout.tsx              # Admin navigation
│   ├── page.tsx                # Dashboard
│   ├── articles/
│   │   ├── page.tsx            # Article list
│   │   ├── new/page.tsx        # Create article
│   │   └── edit/[id]/page.tsx  # Edit article
│   ├── resources/              # Resource CRUD
│   │   └── page.tsx            # Resource management with uploads
│   └── volunteers/             # NEW - Volunteer CRUD
│       └── page.tsx            # Volunteer management with drag-and-drop
├── articles/
│   ├── page.tsx                # Public article list
│   └── [slug]/page.tsx         # Article detail
├── resources/                  # Database-driven resources
│   └── page.tsx                # Civic resource cards
├── get-involved/               # UPDATED - Database-driven
│   └── page.tsx                # Volunteer opportunities (from DB)
├── about/
│   └── page.tsx                # About page
├── api/
│   ├── auth/[...nextauth]/route.ts
│   ├── articles/
│   │   ├── route.ts            # GET, POST
│   │   └── [id]/route.ts       # GET, PUT, DELETE
│   ├── resources/              # Resource management
│   │   ├── route.ts            # GET all, POST new
│   │   ├── [id]/route.ts       # PUT, DELETE
│   │   └── upload-image/route.ts  # Blob upload (resources/ folder)
│   └── volunteers/             # NEW - Volunteer management
│       ├── route.ts            # GET all (ordered), POST new
│       ├── [id]/route.ts       # PUT, DELETE
│       ├── reorder/route.ts    # POST reorder (drag-and-drop)
│       └── upload-image/route.ts  # Blob upload (volunteers/ folder)
└── page.tsx                    # Homepage (3D flag)

components/
├── ArticleClient.tsx
├── ArticleEditor.tsx
├── ArticlesClient.tsx
├── ShareButton.tsx
├── CachedSocialImage.tsx
├── ExternalLinkModal.tsx       # NEW
├── Footer.tsx
├── Navigation.tsx
├── ThemeProvider.tsx
└── ThemeToggle.tsx

lib/
├── auth.ts                     # NextAuth config
├── email-adapter.ts            # Custom adapter
├── db.ts                       # Database utilities
└── slug.ts                     # URL slug utilities

docs/                           # NEW
├── STREAMLINED_CARD_UPLOAD.md  # How to add cards (no code)
└── VOLUNTEER_IMAGE_PROMPTS.md  # AI prompts for images

next.config.ts                  # UPDATED - Blob domain
```

---

## Next.js Configuration

### Image Optimization

`next.config.ts` includes Vercel Blob domain for Next.js Image component:

```typescript
export default {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.google.com',
        pathname: '/s2/favicons/**',
      },
      {
        protocol: 'https',
        hostname: 'zvlofasbk97vnlui.public.blob.vercel-storage.com',
        pathname: '/resources/**',
      },
    ],
  },
}
```

**Why:** Allows Next.js to optimize images from Vercel Blob CDN.

---

## Deployment (Vercel)

### First-Time Setup

1. **Connect GitHub repo** to Vercel

2. **Add Neon Postgres:**
   - Dashboard → Storage → Create Database → Neon
   - Auto-adds all `POSTGRES_*` env vars

3. **Add Vercel Blob:**
   - Dashboard → Storage → Create Database → Blob
   - Auto-adds `BLOB_READ_WRITE_TOKEN`

4. **Add manual env vars:**
   - `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
   - `EMAIL_SERVER` (Gmail SMTP)
   - `EMAIL_FROM`

5. **Deploy** (auto-triggers on push to `main`)

6. **Initialize database:**
   - Run SQL from `lib/db/resources.sql` in Neon console
   - Or visit `/api/init-db` if it exists

7. **Test authentication:**
   - Go to `/admin` → enter `americafirstusateam@gmail.com`
   - Check email for magic link

8. **Add first resource card:**
   - Sign in to `/admin/resources`
   - Upload an image
   - Fill out form
   - Save → card is live!

### Subsequent Deploys

Push to `main` branch → auto-deploys.

**Important:** Resource cards and images are stored in database/Blob, so you can add new cards **without** deployments!

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

## Common Tasks

### Adding a New Resource Card (The Easy Way)

**See:** `docs/STREAMLINED_CARD_UPLOAD.md` for full guide.

**Quick Steps:**
1. Generate 1200x520px image with AI (use prompts from `VOLUNTEER_IMAGE_PROMPTS.md`)
2. Go to `https://america1stusa.vercel.app/admin/resources`
3. Drag & drop image to upload
4. Fill out form (title, URL, description, domain, category)
5. Click "Add Resource"
6. **Done!** Live immediately, no code deployment.

### Editing an Existing Resource Card

1. Go to `/admin/resources`
2. Find the card
3. Click "Edit"
4. Make changes (upload new image if needed)
5. Click "Save Changes"
6. Live immediately!

### Migrating Hardcoded Cards to Database

If you have hardcoded cards (like volunteer opportunities), see `docs/STREAMLINED_CARD_UPLOAD.md` section "Converting Hardcoded Cards to Database-Driven".

---

## Key Design Decisions

### Why Vercel Blob Instead of Base64?

**Old approach (articles):** Base64-encoded images in database  
**New approach (resources):** Vercel Blob CDN

**Reasons:**
- **Performance:** CDN is faster than database blobs
- **Scalability:** No database size bloat
- **Caching:** Automatic edge caching
- **Image optimization:** Next.js Image component works better
- **Simplicity:** Direct upload with `@vercel/blob` package
- **Cost:** Free tier includes 100GB storage

### Why Neon Instead of Vercel Postgres?

- Vercel Postgres deprecated/unavailable in some regions
- Neon is free, serverless, and integrates seamlessly
- Auto-adds env vars to Vercel
- Better connection pooling for serverless functions

### Why Lazy Database Initialization?

```typescript
// ❌ Bad - runs at build time (no DATABASE_URL available)
const sql = neon(process.env.POSTGRES_PRISMA_URL!);

// ✅ Good - runs at request time (DATABASE_URL available)
const getSql = () => neon(process.env.POSTGRES_PRISMA_URL!);
```

**Reason:** Environment variables aren't available at build time in Vercel, only at runtime.

### Why JWT Sessions?

- Simpler than database sessions
- No `sessions` or `accounts` tables needed
- Scales better (stateless)
- Works seamlessly with magic links

---

## Common Issues & Solutions

### Issue: "missing_connection_string" error in production

**Cause:** Using `DATABASE_URL` but Neon provides `POSTGRES_PRISMA_URL`  
**Fix:** Update code to use `process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL`

### Issue: Images not showing in resource cards

**Cause:** Blob domain not in `next.config.ts` remotePatterns  
**Fix:** Add Blob hostname to `images.remotePatterns` array

### Issue: Cover images not saving (articles)

**Cause:** `VARCHAR(1000)` too small for base64 images  
**Fix:** Visit `/api/migrate-cover-image` to change to `TEXT`

### Issue: Magic link doesn't work

**Cause:** Gmail App Password incorrect or EMAIL_SERVER malformed  
**Fix:** Regenerate App Password, ensure format: `smtp://email:password@smtp.gmail.com:587`

### Issue: Build fails with Next.js 16 params error

**Cause:** Next.js 16 changed route params to Promise-wrapped  
**Fix:** Change `{ params }: { params: { id: string } }` to `{ params }: { params: Promise<{ id: string }> }` and await: `const { id } = await params;`

---

## Performance Optimizations

1. **ISR Caching:** 60-second revalidation on API fetches
2. **Vercel Blob CDN:** Edge-cached images with automatic optimization
3. **Next.js Image:** Automatic WebP conversion, responsive sizing
4. **Loading Skeletons:** Instant visual feedback on all pages
5. **Progressive Image Loading:** Show gradient while images load
6. **Lazy Database Init:** Avoid build-time database calls
7. **Three.js Optimization:** 800 particles, size 0.015, opacity 0.3
8. **Code Splitting:** Automatic per-route splitting

---

## Recent Updates (September 2026)

✅ **Volunteer Opportunities System (Latest - Sep 30)**
- Complete database-driven volunteer cards with drag-and-drop ordering
- `volunteers` table with `display_order` column for custom sorting
- Full CRUD admin interface at `/admin/volunteers`
- Drag-and-drop reordering with @dnd-kit library
- Separate Blob folder (`volunteers/`) for images
- `/get-involved` page migrated from hardcoded to database
- Real-time order saving with visual feedback
- 5 professional AI-generated images (1200x520px)

✅ **Database-Driven Resource Cards (Sep 30)**
- Migrated from hardcoded array to Neon Postgres
- 10 initial resources with professional AI-generated images
- Full CRUD admin interface at `/admin/resources`
- Instant updates without deployment

✅ **Vercel Blob Integration (Sep 30)**
- Image uploads directly to Vercel Blob CDN
- Separate folders for resources and volunteers
- Drag & drop interface in admin panel
- 1200x520px professional images
- Next.js Image optimization with edge caching

✅ **Streamlined Card Upload Process (Sep 30)**
- No manual code editing
- No git commits for new cards
- No deployments for content updates
- From 9 steps to 5 steps, 10+ minutes to 2 minutes

✅ **Neon Database Migration (Sep 30)**
- Migrated from deprecated `@vercel/postgres` to `@neondatabase/serverless`
- Lazy initialization pattern for serverless functions
- Fixed environment variable issues (`POSTGRES_PRISMA_URL`)

✅ **Next.js 16 Compatibility (Sep 30)**
- Fixed Promise-wrapped route params
- Updated all API routes to await params
- No TypeScript errors, clean build

---

## Documentation Files

| File | Purpose |
|------|---------|
| `PROJECT_SETUP.md` | This file - complete setup guide |
| `README.md` | Project overview and quick start |
| `docs/STREAMLINED_CARD_UPLOAD.md` | Step-by-step: add cards without code |
| `docs/VOLUNTEER_IMAGE_PROMPTS.md` | AI prompts for generating images |
| `RESOURCES_ADMIN_GUIDE.md` | Admin panel usage guide |
| `DEPLOYMENT.md` | Deployment checklist |
| `SECURITY.md` | Security best practices |

---

## Future Enhancements

### For Resources
- [ ] Bulk CSV/JSON upload for multiple cards
- [ ] Image cropping tool in admin
- [ ] Draft mode for resources
- [ ] Analytics on card clicks
- [ ] Search and filter in admin

### For Volunteers
- [x] ✅ Create `volunteers` table (COMPLETE)
- [x] ✅ Migrate hardcoded volunteer opportunities to database (COMPLETE)
- [x] ✅ Create `/admin/volunteers` CRUD interface (COMPLETE)
- [x] ✅ Generate AI images for 5 volunteer cards (COMPLETE)
- [x] ✅ Update `/get-involved` page to fetch from database (COMPLETE)
- [x] ✅ Add drag-and-drop reordering (COMPLETE)
- [ ] Add category-based filtering on public page

### For Articles
- [ ] Add categories/tags
- [ ] Add comments system
- [ ] Switch to Vercel Blob for cover images (currently base64)
- [ ] Add search functionality
- [ ] Add view counter

---

## Troubleshooting Commands

```bash
# Check build locally
npm run build

# Check TypeScript errors
npx tsc --noEmit

# View Vercel deployment logs
vercel logs <deployment-url>

# Test database connection
node -e "const { neon } = require('@neondatabase/serverless'); const sql = neon(process.env.POSTGRES_PRISMA_URL); sql\`SELECT NOW()\`.then(console.log);"

# Test authentication locally
npm run dev
# Visit: http://localhost:3000/admin

# Check resources in database (Neon Console)
SELECT * FROM resources ORDER BY created_at DESC;

# Check Blob files (Vercel Dashboard)
# Dashboard → Storage → Blob → browse files
```

---

## Contact & Admin Access

**Super Admin Email:** americafirstusateam@gmail.com  
**GitHub:** https://github.com/america1storg  
**Deployed Site:** https://america1stusa.vercel.app  
**Admin Panel:** https://america1stusa.vercel.app/admin

---

## Last Updated
September 30, 2026

## Project Status
✅ **Production Ready & Feature-Rich**

### Working Features
- ✅ Authentication (Gmail magic links)
- ✅ Article CRUD with rich text editor
- ✅ **Resource cards (database-driven, Blob images)**
- ✅ **Admin resource management (drag & drop uploads)**
- ✅ **Streamlined content workflow (no deployments)**
- ✅ Social media sharing
- ✅ SEO-friendly URLs
- ✅ Theme toggle (dark/light)
- ✅ Loading skeletons
- ✅ 3D homepage animation
- ✅ Responsive design
- ✅ ISR caching
- ✅ Next.js 16 compatible

### New in September 2026
- 🎉 Database-driven resource cards
- 🎉 Vercel Blob image CDN
- 🎉 Admin CRUD interface for resources
- 🎉 Drag & drop image uploads
- 🎉 No-code content management
- 🎉 Professional AI-generated card images

---

## Quick Start Checklist

For setting up on a new machine:

- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Create `.env.local` with all variables
- [ ] Get Neon credentials from Vercel
- [ ] Get Blob token from Vercel
- [ ] Generate NEXTAUTH_SECRET
- [ ] Set up Gmail App Password
- [ ] Run `npm run dev`
- [ ] Test `/admin` sign-in
- [ ] Test `/admin/resources` upload
- [ ] Verify `/resources` page loads
- [ ] Push to main → auto-deploy
- [ ] Done!

**Estimated Setup Time:** 15-20 minutes (if all credentials are available)

---

## Need Help?

1. Check `docs/STREAMLINED_CARD_UPLOAD.md` for adding cards
2. Check `RESOURCES_ADMIN_GUIDE.md` for admin usage
3. Check Vercel logs for deployment errors
4. Check browser console for runtime errors
5. Check Neon console for database queries
6. Review this file for architecture decisions

**Most common issue:** Environment variable missing or incorrect → Check Vercel dashboard → Environment Variables
