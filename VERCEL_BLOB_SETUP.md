# Vercel Blob Storage Setup Guide

This guide explains how to set up Vercel Blob storage for image hosting to fix bandwidth consumption issues.

## Why Vercel Blob?

- **Fixes bandwidth issues**: Images served from CDN instead of app responses
- **Faster page loads**: Images optimized and cached globally
- **Free tier**: 500GB storage + 500GB bandwidth per month
- **No ISR limits**: Database stays small, no more 1MB page size errors

## Setup Steps

### 1. Add Environment Variable

1. Go to [Vercel Dashboard](https://vercel.com/rembrandpardo/america1stusa)
2. Navigate to **Settings** → **Environment Variables**
3. Add new variable:
   - **Name**: `BLOB_READ_WRITE_TOKEN`
   - **Value**: (leave blank - Vercel auto-generates)
   - **Environment**: Production, Preview, Development
4. Click **Save**

### 2. Redeploy

After adding the environment variable:

1. Go to **Deployments** tab
2. Find the latest deployment
3. Click **•••** menu → **Redeploy**
4. Wait for deployment to complete

### 3. Migrate Existing Images

Once deployed, migrate existing base64 images:

1. Log in as **god_mode** user
2. Go to `/admin/migrate-images`
3. Click **Start Migration**
4. Wait for completion (may take a few minutes)

The migration will:
- Find all articles with base64 cover images
- Upload them to Vercel Blob
- Update database with new CDN URLs
- Show detailed results

### 4. Test New Uploads

After migration:

1. Go to `/admin/articles/new`
2. Upload a cover image
3. Verify it displays correctly
4. Check that the URL is a Vercel Blob URL (starts with `https://`)

## How It Works

### Before (Base64 in Database)
```
User uploads image → Convert to base64 → Store in PostgreSQL → 
Fetch entire base64 string with article → Decode → Display
```

**Problems:**
- Large database records
- High bandwidth usage
- Slow page loads
- ISR page size limits exceeded

### After (Vercel Blob)
```
User uploads image → Upload to Vercel Blob → Store URL in PostgreSQL → 
Fetch URL with article → Browser loads from CDN → Display
```

**Benefits:**
- Small database records (just URLs)
- Low bandwidth usage (CDN serves images)
- Fast page loads (global CDN caching)
- No ISR size limits

## API Endpoints

### POST /api/upload
Uploads an image to Vercel Blob.

**Request:**
- Method: POST
- Body: multipart/form-data with 'file' field
- Auth: Required (any logged-in user)

**Response:**
```json
{
  "url": "https://blob.vercel-storage.com/...",
  "pathname": "articles/123456-abc.jpg",
  "contentType": "image/jpeg"
}
```

**Validations:**
- File type: image/jpeg, image/png, image/webp, image/gif
- Max size: 5MB

### POST /api/migrate-images
Migrates existing base64 images to Vercel Blob.

**Request:**
- Method: POST
- Auth: god_mode only

**Response:**
```json
{
  "success": true,
  "results": {
    "total": 3,
    "migrated": 3,
    "failed": 0,
    "errors": []
  }
}
```

## Free Tier Limits

**Vercel Blob (Hobby):**
- 500 GB storage/month
- 500 GB bandwidth/month

**Estimated Usage:**
- Average image: 500KB
- ~1,000 images = 500MB storage
- ~1 million views = ~500GB bandwidth

You would need to create **1,000+ articles** to hit storage limits, and get **millions of views** to hit bandwidth limits.

## Troubleshooting

### Images not uploading
- Check that `BLOB_READ_WRITE_TOKEN` env var is set in Vercel
- Verify you're logged in (uploads require authentication)
- Check browser console for errors

### Migration failing
- Only god_mode users can run migrations
- Check Vercel logs for specific errors
- Verify `BLOB_READ_WRITE_TOKEN` is configured

### Old images still showing file icons
- Run the migration: `/admin/migrate-images`
- Check that articles have `cover_image` field populated
- Verify database query includes `cover_image` field

## Code Changes

Files modified for Blob storage:
- `app/api/upload/route.ts` - Upload endpoint
- `app/api/migrate-images/route.ts` - Migration endpoint
- `components/ArticleEditor.tsx` - Upload to Blob instead of base64
- `app/admin/migrate-images/page.tsx` - Admin UI for migration
- `app/admin/layout.tsx` - Added migration link

## Next Steps

1. ✅ Add `BLOB_READ_WRITE_TOKEN` env var
2. ✅ Deploy to production
3. ✅ Run migration via `/admin/migrate-images`
4. ✅ Test new article uploads
5. ✅ Monitor Vercel dashboard for bandwidth usage

## Questions?

- Check Vercel Blob docs: https://vercel.com/docs/storage/vercel-blob
- View usage dashboard: https://vercel.com/rembrandpardo/america1stusa/stores
