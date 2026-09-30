# Streamlined Card Upload Process

This guide shows you how to add new resource or volunteer cards **without** touching code, database, or deployments manually.

## Quick Overview

1. **Generate AI images** (using prompts from `VOLUNTEER_IMAGE_PROMPTS.md` or create your own)
2. **Access admin panel** at `https://america1stusa.vercel.app/admin/resources`
3. **Drag & drop images** to upload to Vercel Blob
4. **Fill out the form** with card details
5. **Save** - live immediately!

No Git commits, no database migrations, no manual file uploads required.

---

## Step-by-Step: Adding a New Resource Card

### Step 1: Generate the Image

1. Use AI image generator (Midjourney, DALL-E 3, etc.)
2. Use prompts from `VOLUNTEER_IMAGE_PROMPTS.md` or create custom prompts
3. **Required specs:**
   - Dimensions: **1200x520px**
   - Format: JPG or PNG (JPG recommended for smaller size)
   - Max size: 5MB

### Step 2: Access the Admin Panel

1. Go to: `https://america1stusa.vercel.app/admin`
2. Sign in with your authorized account
3. Click **"Resources"** in the admin navigation

You should see the Resources admin page with:
- A form at the top for adding new cards
- A list of existing cards below

### Step 3: Upload Your Image

1. In the **"Upload Image"** section, either:
   - **Drag and drop** your image file onto the upload box
   - **Click** "Browse files" to select from your computer

2. Wait for upload confirmation (you'll see a preview)

3. The **Image URL** field auto-fills with the Vercel Blob URL

### Step 4: Fill Out the Card Details

Fill in the form fields:

| Field | Description | Example |
|-------|-------------|---------|
| **Title** | Resource name | `GovTrack` |
| **URL** | External website link | `https://www.govtrack.us/congress/bills/` |
| **Description** | Brief description (2-3 sentences) | `Good for federal bill tracking, voting records, and legislative history...` |
| **Domain** | Website domain (for favicon) | `govtrack.us` |
| **Category** | Type/category badge | `Legislative` |
| **Image URL** | Auto-filled from upload | `https://zvlofasbk97vnlui.public.blob.vercel-storage.com/resources/...` |

### Step 5: Save the Card

1. Click **"Add Resource"**
2. Card is instantly saved to database
3. Card appears in the list below
4. Card is **live on the site immediately** (no deployment needed!)

### Step 6: Verify It's Live

1. Open `https://america1stusa.vercel.app/resources` in a new tab
2. Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
3. Your new card should appear at the top

---

## Editing Existing Cards

1. Go to: `https://america1stusa.vercel.app/admin/resources`
2. Find the card in the list
3. Click **"Edit"**
4. Make changes in the form
5. Upload new image if needed
6. Click **"Save Changes"**
7. Changes are live immediately

---

## Deleting Cards

1. Go to: `https://america1stusa.vercel.app/admin/resources`
2. Find the card in the list
3. Click **"Delete"**
4. Confirm deletion
5. Card is removed from site immediately

---

## Converting Hardcoded Cards to Database-Driven

If you have hardcoded cards (like the volunteer opportunities currently in `app/get-involved/page.tsx`), follow this process to migrate them:

### Option A: Manual Entry (Recommended for Small Lists)

1. Go to admin panel
2. For each hardcoded card, manually enter via the form
3. Once all cards are in database, update the page component to fetch from API

### Option B: Bulk Migration Script

If you have many cards, create a migration script:

```javascript
// scripts/migrate-volunteer-cards.mjs
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.POSTGRES_PRISMA_URL);

const cards = [
  {
    title: 'Join Advisory Boards',
    url: 'https://www.jointab.us/find-your-seat',
    description: "There's an empty government seat near you...",
    domain: 'jointab.us',
    category: 'Civic Leadership',
    image_url: 'https://zvlofasbk97vnlui.public.blob.vercel-storage.com/volunteers/jointab.jpg'
  },
  // ... more cards
];

async function migrate() {
  for (const card of cards) {
    await sql`
      INSERT INTO volunteers (title, url, description, domain, category, image_url)
      VALUES (${card.title}, ${card.url}, ${card.description}, ${card.domain}, ${card.category}, ${card.image_url})
    `;
  }
  console.log(`✅ Migrated ${cards.length} cards`);
}

migrate();
```

Run with: `node scripts/migrate-volunteer-cards.mjs`

---

## Creating a New Card Type (e.g., Volunteers)

If you want volunteer cards separate from resource cards:

### 1. Create Database Table

```sql
-- lib/db/volunteers.sql
CREATE TABLE IF NOT EXISTS volunteers (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  description TEXT NOT NULL,
  domain VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

Run in Neon console or via migration script.

### 2. Create API Routes

Copy and modify `app/api/resources/` to `app/api/volunteers/`:
- `app/api/volunteers/route.ts` (GET all, POST new)
- `app/api/volunteers/[id]/route.ts` (PUT update, DELETE)
- `app/api/volunteers/upload-image/route.ts` (reuse existing)

### 3. Create Admin Page

Copy `app/admin/resources/page.tsx` to `app/admin/volunteers/page.tsx`
- Update API endpoints from `/api/resources` to `/api/volunteers`
- Update UI labels from "Resources" to "Volunteers"

### 4. Update Navigation

Add "Volunteers" link to `app/admin/layout.tsx` navigation.

### 5. Update Frontend Page

Modify `app/get-involved/page.tsx`:
- Remove hardcoded `opportunities` array
- Fetch from `/api/volunteers`
- Use database-driven cards

---

## Tips & Best Practices

### Image Optimization
- Always use **1200x520px** for consistency
- Use JPG for photos (smaller file size)
- Use PNG for illustrations with transparency
- Keep under 500KB per image (compress if needed)

### Writing Descriptions
- Keep to 2-3 sentences
- Focus on what users get from the resource
- Use action words: "Track", "Find", "Learn", "Connect"
- Avoid marketing fluff

### Categories
- Use consistent category names across cards
- Keep categories short (1-3 words)
- Examples: `Legislative`, `Executive`, `Elections`, `Education`, `National Service`

### Testing
- Always test on mobile after adding cards
- Check image loading performance
- Verify external links work
- Test dark mode appearance

---

## Troubleshooting

### Image won't upload
- Check file size (must be < 5MB)
- Verify file format (JPG, PNG, WEBP only)
- Try compressing the image

### Card doesn't appear
- Hard refresh the page (Cmd+Shift+R)
- Check browser console for errors
- Verify you're signed in as admin

### Image shows broken
- Verify the Blob URL is complete
- Check `next.config.ts` has Blob domain in `remotePatterns`
- Wait 1-2 minutes for CDN propagation

### Changes not saving
- Check browser console for API errors
- Verify database connection in Vercel logs
- Ensure you have admin permissions

---

## Future Enhancements

Potential improvements to the upload system:

1. **Bulk Upload** - Upload multiple cards via CSV/JSON
2. **Image Cropping** - Built-in image cropping tool
3. **Draft Mode** - Save cards as drafts before publishing
4. **Scheduling** - Schedule cards to go live at specific times
5. **Analytics** - Track which cards get the most clicks
6. **Categories** - Dynamic category management
7. **Tags** - Add tags for better organization
8. **Search** - Search and filter in admin panel

---

## Quick Reference

| Task | URL | Auth Required |
|------|-----|---------------|
| Add card | `/admin/resources` | Yes |
| Edit card | `/admin/resources` → Edit button | Yes |
| View live | `/resources` | No |
| Upload image | `/admin/resources` → Upload section | Yes |
| API endpoint | `/api/resources` | No (GET), Yes (POST/PUT/DELETE) |

---

## Summary

The new system eliminates 90% of the manual work:

❌ **Old Way:**
1. Generate image in AI tool
2. Download image
3. Upload to Vercel Blob manually
4. Get Blob URL
5. Update hardcoded array in code
6. Git commit
7. Git push
8. Wait for deployment
9. Test live site

✅ **New Way:**
1. Generate image in AI tool
2. Go to admin panel
3. Drag & drop image
4. Fill out form
5. Click "Add Resource"
6. ✅ Live immediately!

**From 9 steps to 5 steps. From 10+ minutes to 2 minutes.**
