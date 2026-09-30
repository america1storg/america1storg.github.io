# Quick Reference Card

## 🚀 Adding New Resource/Volunteer Cards (The Fast Way)

### Step 1: Generate AI Image
Use prompts from `docs/VOLUNTEER_IMAGE_PROMPTS.md`

**Requirements:**
- Size: **1200x520px** exactly
- Format: JPG or PNG
- Max: 5MB

**Tools:**
- Midjourney (best quality)
- DALL-E 3 (via ChatGPT Plus)
- Stable Diffusion
- Leonardo.ai

### Step 2: Upload to Admin Panel
1. Go to: `https://america1stusa.vercel.app/admin/resources`
2. Sign in with magic link
3. Drag & drop your 1200x520px image
4. Wait for upload confirmation (~2 seconds)

### Step 3: Fill Out Form
| Field | Example |
|-------|---------|
| Title | `GovTrack` |
| URL | `https://www.govtrack.us/congress/bills/` |
| Description | `Track Congress with clear visualizations...` |
| Domain | `govtrack.us` |
| Category | `Legislative` |

### Step 4: Save
Click **"Add Resource"** → Card is **live immediately!**

### Step 5: Reorder (Volunteers Only)
1. Go to `/admin/volunteers`
2. Drag cards by the **≡** handle
3. Drop in new position
4. Order saves automatically!

---

## 📁 AI Image Prompts (Volunteer Cards)

### 1. Join Advisory Boards
```
Professional 1200x520px image of civic advisory board meeting. 
Modern government chamber, diverse people collaborating. 
Navy blue, white, red patriotic colors. No text overlay.
```

### 2. JustServe
```
Community volunteers working together on local projects. 
People planting trees, organizing food banks, helping seniors.
Bright, optimistic with blue sky. Professional photography style.
1200x520px. No text.
```

### 3. Volunteers of America
```
Volunteers helping vulnerable populations - serving meals, 
housing support, healthcare outreach. Warm welcoming colors.
Shows compassion and professional service. 1200x520px. No text.
```

### 4. AmeriCorps
```
Young adults in AmeriCorps uniforms working on diverse projects:
teaching, disaster relief, environmental work. Patriotic red/white/blue.
Shows service across America. 1200x520px. No text.
```

### 5. Volunteer.gov
```
Volunteers in national parks maintaining trails, leading tours,
wildlife conservation. Spectacular American landscapes with rangers.
Natural greens and blues. Shows stewardship of public lands.
1200x520px. No text.
```

---

## 🔧 Common Commands

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Production build
npx tsc --noEmit              # Check TypeScript

# Git
git status                     # Check changes
git add .                      # Stage all
git commit -m "message"        # Commit
git push origin main           # Deploy

# Database (in Neon Console)
SELECT * FROM resources;       # View all cards
SELECT * FROM users;           # View admins
```

---

## 🌐 Important URLs

| Purpose | URL |
|---------|-----|
| Live Site | https://america1stusa.vercel.app |
| Admin Panel | https://america1stusa.vercel.app/admin |
| Resources Admin | https://america1stusa.vercel.app/admin/resources |
| Public Resources | https://america1stusa.vercel.app/resources |
| Vercel Dashboard | https://vercel.com/dashboard |
| Neon Console | https://console.neon.tech |

---

## 📊 Current Card Counts

- **Resources:** 10 cards (database-driven with AI images)
- **Volunteers:** 5 cards (database-driven with AI images + drag-and-drop ordering)
- **Articles:** Dynamic (varies)

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Images won't upload | Check file size < 5MB, format is JPG/PNG |
| Can't sign in | Check email for magic link, may take 1-2 min |
| Card doesn't appear | Hard refresh (Cmd+Shift+R) |
| Image broken | Verify 1200x520px, check Vercel logs |
| 500 API error | Check environment variables in Vercel |

---

## 📖 Full Documentation

- **Complete Setup:** [PROJECT_SETUP.md](../PROJECT_SETUP.md)
- **Card Upload Guide:** [STREAMLINED_CARD_UPLOAD.md](./STREAMLINED_CARD_UPLOAD.md)
- **AI Prompts:** [VOLUNTEER_IMAGE_PROMPTS.md](./VOLUNTEER_IMAGE_PROMPTS.md)
- **Project Overview:** [README.md](../README.md)

---

## ⏱️ Time Estimates

| Task | Time |
|------|------|
| Add 1 new card | 2 minutes |
| Generate AI image | 30 seconds - 2 minutes |
| Edit existing card | 1 minute |
| Full project setup (new machine) | 20 minutes |
| Deploy code changes | 2-3 minutes (automatic) |

---

## 🎯 Next Migration: Volunteer Cards

**Current state:** 5 hardcoded cards in `app/get-involved/page.tsx`

**To migrate:**
1. Generate 5 images using prompts in `VOLUNTEER_IMAGE_PROMPTS.md`
2. Create `volunteers` table (copy `resources` schema)
3. Create API routes (copy `app/api/resources/*`)
4. Create admin page (copy `app/admin/resources/page.tsx`)
5. Upload 5 cards via admin panel
6. Update `app/get-involved/page.tsx` to fetch from database

**Estimated time:** 2-3 hours total

---

## 💡 Pro Tips

1. **Batch generate images:** Create all 5 volunteer images at once in Midjourney
2. **Test locally first:** Use `npm run dev` before pushing
3. **Name images clearly:** `jointab-advisory.jpg`, `americorps-service.jpg`
4. **Compress images:** Use TinyPNG to reduce file sizes
5. **Check mobile:** Always test responsive layout
6. **Save prompts:** If AI generates good image, save the exact prompt

---

## 🔑 Environment Variables (Local .env.local)

```env
POSTGRES_PRISMA_URL="postgresql://..." # From Vercel/Neon
BLOB_READ_WRITE_TOKEN="vercel_blob_..." # From Vercel Blob
NEXTAUTH_SECRET="<openssl rand -base64 32>"
EMAIL_SERVER="smtp://email:app-password@smtp.gmail.com:587"
EMAIL_FROM="America First <email@gmail.com>"
NEXTAUTH_URL="http://localhost:3000"
```

---

**Last Updated:** September 30, 2026  
**Status:** Ready for volunteer card migration
