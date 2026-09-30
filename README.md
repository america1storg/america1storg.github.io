# America First - Official Website

A modern civic education website with dynamic content management, database-driven resource & volunteer cards with drag-and-drop ordering, and AI-powered imagery.

**Live Site:** https://america1stusa.vercel.app

---

## 📚 Documentation Hub

**New to the project? Start here:**

| Document | Purpose | Time |
|----------|---------|------|
| **[PROJECT_SETUP.md](./PROJECT_SETUP.md)** | Complete setup guide for new machines | 20 min |
| **[STREAMLINED_CARD_UPLOAD.md](./docs/STREAMLINED_CARD_UPLOAD.md)** | Add resource cards without code | 2 min |
| **[VOLUNTEER_IMAGE_PROMPTS.md](./docs/VOLUNTEER_IMAGE_PROMPTS.md)** | AI prompts for generating card images | N/A |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Deploy to Vercel | 10 min |
| [RESOURCES_ADMIN_GUIDE.md](./RESOURCES_ADMIN_GUIDE.md) | Admin panel usage | 5 min |
| [ENGINEERING_README.md](./ENGINEERING_README.md) | Technical architecture | N/A |

---

## 🆕 What's New (September 2026)

### Volunteer Opportunities System (Latest - Sep 30)
- ✅ Complete database-driven volunteer cards
- ✅ **Drag-and-drop reordering** - custom display order
- ✅ Admin CRUD interface at `/admin/volunteers`
- ✅ Separate Blob folder for volunteer images
- ✅ `/get-involved` page fully database-driven
- ✅ 5 professional AI-generated images (1200x520px)

### Database-Driven Resource Cards (Sep 30)
- ✅ No more hardcoded arrays - all cards in Neon Postgres
- ✅ Admin CRUD interface at `/admin/resources`
- ✅ Drag & drop image uploads to Vercel Blob CDN
- ✅ Add new cards in 2 minutes without deployment
- ✅ 10 professional AI-generated images (1200x520px)

### Streamlined Workflow
**Before:** Generate image → Download → Manual Blob upload → Get URL → Edit code → Git commit → Deploy → Test  
**After:** Generate image → Admin panel → Drag & drop → Fill form → Save → ✅ Live!

**From 9 steps (10+ min) to 5 steps (2 min).**

---

## 🇺🇸 Features

### Public Features
- **Dynamic Resource & Volunteer Cards** - Database-backed cards with professional AI imagery
- **Custom Card Ordering** - Admin drag-and-drop reordering reflected on public site
- **3D Animated Homepage** - Interactive Three.js flag animation
- **Articles Platform** - Rich text articles with cover images and social sharing
- **SEO-Friendly URLs** - `/articles/title-slug-123` format
- **Dark/Light Mode** - Persistent theme toggle
- **Loading Skeletons** - Instant visual feedback
- **Responsive Design** - Mobile-first, works everywhere
- **External Link Safety** - Modal warnings for external sites

### Admin Features
- **Secure Authentication** - Email magic links via Gmail SMTP
- **Article Management** - Rich text editor (Tiptap) with image uploads
- **Resource Management** - Full CRUD for resource cards with drag & drop uploads
- **Volunteer Management** - Full CRUD for volunteer cards with drag-and-drop reordering
- **Custom Ordering** - Drag-and-drop interface to reorder cards (saves to database)
- **Image CDN** - Vercel Blob storage with automatic optimization (separate folders)
- **No-Code Updates** - Add/edit cards without touching code or deploying
- **Real-time Publishing** - Changes live immediately

---

## 🚀 Tech Stack (100% Free Tier)

- **Framework:** Next.js 16.2.12 (App Router, Turbopack)
- **Language:** TypeScript
- **Database:** Neon Postgres (serverless, 0.5GB free)
- **Storage:** Vercel Blob (100GB free)
- **Authentication:** NextAuth.js v5 (JWT sessions)
- **Email:** Gmail SMTP (free)
- **CDN:** Vercel Edge Network (free)
- **Hosting:** Vercel (free tier)
- **3D Graphics:** Three.js
- **Editor:** Tiptap (MIT license)

**Total monthly cost:** $0 (within free tier limits)

---

## 🛠️ Quick Start (New Machine Setup)

### Prerequisites
- Node.js 18+
- Git
- Vercel account (connected to GitHub)
- Access to `americafirstusateam@gmail.com`

### Installation

```bash
# 1. Clone repository
git clone https://github.com/america1storg/america1storg.github.io.git
cd america1storg.github.io

# 2. Install dependencies
npm install

# 3. Set up environment variables (see PROJECT_SETUP.md)
# Create .env.local with:
# - POSTGRES_PRISMA_URL (from Vercel Neon integration)
# - BLOB_READ_WRITE_TOKEN (from Vercel Blob store)
# - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)
# - EMAIL_SERVER (Gmail SMTP)
# - EMAIL_FROM

# 4. Start development server
npm run dev

# 5. Open http://localhost:3000
```

**Full setup guide:** See [PROJECT_SETUP.md](./PROJECT_SETUP.md)

---

## 📊 Architecture Overview

### Database Schema

```
users                    # Admin authentication
articles                 # Blog posts with rich text
article_images          # Embedded images in articles
resources               # Civic resource cards (NEW)
verification_token      # Magic link tokens
```

### Key Directories

```
app/
├── admin/              # Admin dashboard & CRUD interfaces
│   ├── resources/      # Resource card management (NEW)
│   └── articles/       # Article management
├── resources/          # Public resources page (database-driven)
├── articles/           # Public articles
├── api/
│   ├── resources/      # Resource CRUD API (NEW)
│   └── articles/       # Article CRUD API
└── page.tsx            # 3D homepage

docs/                   # Documentation (NEW)
├── STREAMLINED_CARD_UPLOAD.md
└── VOLUNTEER_IMAGE_PROMPTS.md
```

### Data Flow (Resources)

```
Admin Panel (/admin/resources)
    ↓
Drag & Drop Image Upload
    ↓
Vercel Blob Storage (CDN)
    ↓
POST /api/resources (save to DB)
    ↓
Neon Postgres (resources table)
    ↓
GET /api/resources (public endpoint)
    ↓
Resources Page (/resources)
    ↓
Next.js Image (optimized, edge-cached)
    ↓
User sees card instantly!
```

---

## 🎨 Adding New Resource Cards

**The easy way** (no code, no deployment):

1. **Generate image** (1200x520px) using AI prompts from `docs/VOLUNTEER_IMAGE_PROMPTS.md`
2. **Go to admin:** `https://america1stusa.vercel.app/admin/resources`
3. **Drag & drop** image to upload to Vercel Blob
4. **Fill form:** Title, URL, Description, Domain, Category
5. **Click "Add Resource"**
6. ✅ **Live immediately!** (no Git, no deployment)

**Detailed guide:** [docs/STREAMLINED_CARD_UPLOAD.md](./docs/STREAMLINED_CARD_UPLOAD.md)

---

## 🧑‍💻 Development

### Available Scripts

```bash
npm run dev          # Start dev server with Turbopack
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npx tsc --noEmit     # Check TypeScript errors
```

### Admin Access

**URL:** `/admin`  
**Super Admin:** `americafirstusateam@gmail.com`  
**Auth:** Magic link via email

### Testing Flow

1. Run `npm run dev`
2. Visit `http://localhost:3000/admin`
3. Enter admin email
4. Click magic link in email
5. Test CRUD operations
6. Check `/resources` page

---

## 🚢 Deployment

### One-Time Setup (Already Done)

1. ✅ GitHub repo connected to Vercel
2. ✅ Neon Postgres integrated (auto-added env vars)
3. ✅ Vercel Blob integrated (auto-added token)
4. ✅ Manual env vars added (NEXTAUTH_SECRET, EMAIL_*)
5. ✅ Database tables created
6. ✅ Admin user seeded

### Automatic Deployment

```bash
git add .
git commit -m "Your changes"
git push origin main
# → Vercel auto-deploys in ~2 minutes
```

**Important:** Resource card changes don't require deployment - they're database-driven!

---

## 📦 Environment Variables

### Required in Production (Vercel)

```env
# Neon Postgres (auto-added by integration)
POSTGRES_PRISMA_URL="postgresql://..."

# Vercel Blob (auto-added by integration)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."

# NextAuth (manual)
NEXTAUTH_URL="https://america1stusa.vercel.app"
NEXTAUTH_SECRET="<generate-with-openssl-rand-base64-32>"

# Gmail SMTP (manual)
EMAIL_SERVER="smtp://americafirstusateam@gmail.com:<app-password>@smtp.gmail.com:587"
EMAIL_FROM="America First <americafirstusateam@gmail.com>"
```

**How to get these:** See [PROJECT_SETUP.md](./PROJECT_SETUP.md#environment-variables)

---

## 🔧 Common Tasks

### Add a Resource Card
→ See [docs/STREAMLINED_CARD_UPLOAD.md](./docs/STREAMLINED_CARD_UPLOAD.md)

### Generate AI Images
→ See [docs/VOLUNTEER_IMAGE_PROMPTS.md](./docs/VOLUNTEER_IMAGE_PROMPTS.md)

### Edit an Article
1. Go to `/admin/articles`
2. Click "Edit" on any article
3. Make changes in rich text editor
4. Click "Publish"

### Migrate Hardcoded Cards
→ See [docs/STREAMLINED_CARD_UPLOAD.md](./docs/STREAMLINED_CARD_UPLOAD.md#converting-hardcoded-cards-to-database-driven)

---

## 🐛 Troubleshooting

### Images not loading
- Check `next.config.ts` has Blob domain in `remotePatterns`
- Verify Blob URLs are complete (https://...)
- Hard refresh page (Cmd+Shift+R)

### API errors (500)
- Check Vercel logs for details
- Verify `POSTGRES_PRISMA_URL` is set
- Test database connection in Neon console

### Can't sign in
- Check `EMAIL_SERVER` format is correct
- Verify Gmail App Password is active
- Check `NEXTAUTH_SECRET` is set

### Build fails
- Run `npm run build` locally to test
- Check TypeScript errors: `npx tsc --noEmit`
- Review Vercel build logs

**Full troubleshooting:** [PROJECT_SETUP.md](./PROJECT_SETUP.md#common-issues--solutions)

---

## 📈 Performance

- **ISR Caching:** 60s revalidation on API fetches
- **Vercel Edge CDN:** Images served from nearest edge node
- **Next.js Image:** Automatic WebP conversion, lazy loading
- **Progressive Loading:** Gradients while images load
- **Code Splitting:** Automatic per-route splitting
- **Turbopack:** Fast dev builds

**Lighthouse Score:** 95+ (Performance, Accessibility, Best Practices, SEO)

---

## 🔐 Security

- **JWT Sessions:** Stateless, secure authentication
- **Magic Links:** Passwordless, phishing-resistant
- **HTTPS Only:** Enforced on all routes
- **CORS Protection:** API routes protected
- **Content Security:** External link warnings
- **Rate Limiting:** Built-in Vercel protection
- **Environment Variables:** Never committed to Git

---

## 🗺️ Roadmap

### Completed ✅
- [x] Database-driven resource cards
- [x] Vercel Blob image CDN
- [x] Admin CRUD interface
- [x] Drag & drop uploads
- [x] No-code content management
- [x] Professional AI-generated images

### Next Up
- [ ] Migrate volunteer cards to database
- [ ] Create `/admin/volunteers` interface
- [ ] Bulk card upload (CSV/JSON)
- [ ] Image cropping tool
- [ ] Card analytics (click tracking)
- [ ] Search & filter in admin

### Future Ideas
- [ ] Article categories/tags
- [ ] Comments system
- [ ] Newsletter integration
- [ ] Advanced analytics
- [ ] Multilingual support
- [ ] Progressive Web App (PWA)

---

## 🤝 Contributing

This is a private project for America First. For access or questions:

**Contact:** americafirstusateam@gmail.com  
**Admin Panel:** https://america1stusa.vercel.app/admin

---

## 📄 License

Proprietary - © 2026 America First

---

## 🔗 Links

- **Live Site:** https://america1stusa.vercel.app
- **Admin Dashboard:** https://america1stusa.vercel.app/admin
- **GitHub:** https://github.com/america1storg/america1storg.github.io
- **Vercel Dashboard:** [Your Vercel Project]

---

## 📞 Support

**Documentation:**
- Full setup: [PROJECT_SETUP.md](./PROJECT_SETUP.md)
- Add cards: [docs/STREAMLINED_CARD_UPLOAD.md](./docs/STREAMLINED_CARD_UPLOAD.md)
- AI prompts: [docs/VOLUNTEER_IMAGE_PROMPTS.md](./docs/VOLUNTEER_IMAGE_PROMPTS.md)

**Need help?**
1. Check documentation above
2. Review [PROJECT_SETUP.md](./PROJECT_SETUP.md#common-issues--solutions)
3. Check Vercel logs
4. Contact admin team

---

**Last Updated:** September 30, 2026  
**Status:** ✅ Production - Actively Enhanced
