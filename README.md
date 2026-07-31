# America First - Official Website

A state-of-the-art website for America First, a nonpartisan civic education organization committed to restoring logical reasoning, fairness, and principled decision-making in American civic life.

---

## 📚 Documentation Navigation

**Choose your path:**

- 🚀 **[GETTING_STARTED.md](./GETTING_STARTED.md)** - New engineer? Start here! (15-minute setup)
- 👨‍💻 **[ENGINEERING_README.md](./ENGINEERING_README.md)** - Complete technical documentation & architecture
- ⚡ **[QUICKSTART.md](./QUICKSTART.md)** - Fast local setup guide (5 minutes)
- 🌐 **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deploy to Vercel (step-by-step)
- 📊 **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Features, stats, and roadmap

---

## 🇺🇸 Features

### Public Features
- **3D Animated Homepage**: Interactive Three.js flag animation with floating particles
- **Articles Platform**: Card-based grid layout with cover images
- **Social Media Sharing**: Share articles on X, Facebook, LinkedIn with Open Graph support
- **Loading Skeletons**: Fast, responsive loading states on all pages
- **Dark/Light Mode**: Beautiful gradient pill toggle with theme persistence
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile
- **Modern Navigation**: Floating pill navbar with transparent logo

### Admin Features
- **Secure Authentication**: Email magic link authentication via Gmail SMTP
- **Article Management**: Create, edit, draft, and publish articles with card grid view
- **Rich Text Editor**: LinkedIn-style WYSIWYG editor powered by Tiptap
  - Bold, italic, headings, lists, quotes
  - Cover image upload (file picker or URL)
  - Content images with alt text
  - Hyperlinks and code blocks
  - Horizontal dividers
  - Real-time active state tracking
- **Image Handling**: Base64 encoding with TEXT column support
- **User Management**: Super admin access control
- **Dashboard**: Real-time statistics and quick actions

## 🚀 Tech Stack (100% Free)

- **Framework**: Next.js 16.2.12 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + inline styles
- **3D Graphics**: Three.js (homepage flag animation)
- **Database**: Neon Postgres (serverless, free tier)
- **Authentication**: NextAuth.js v5 with JWT sessions
- **Email**: Gmail SMTP for magic links
- **Editor**: Tiptap (rich text)
- **Hosting**: Vercel (Free tier)
- **Performance**: ISR caching (60s revalidation)

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Vercel account (free)
- GitHub account

## 🛠️ Local Development

### 1. Clone the repository

```bash
git clone https://github.com/america1storg/america1storg.github.io.git
cd america1storg.github.io
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# Database (get these from Vercel Postgres)
POSTGRES_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://..."
POSTGRES_URL_NO_SSL="postgres://..."
POSTGRES_URL_NON_POOLING="postgres://..."
POSTGRES_USER="default"
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="verceldb"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Generate secret with: openssl rand -base64 32
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Initialize the database

Visit: http://localhost:3000/api/init-db

You should see: `{"success":true,"message":"Database initialized successfully"}`

### 6. Access admin panel

1. Go to: http://localhost:3000/admin
2. Sign in with: `americafirstusateam@gmail.com`
3. Check your console logs for the magic link (in development mode)
4. Click the link to authenticate

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions to Vercel.

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/america1storg/america1storg.github.io)

## 📁 Project Structure

```
america1storg.github.io/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # NextAuth endpoints
│   │   ├── articles/     # Article CRUD
│   │   ├── admin/        # Admin operations
│   │   └── init-db/      # Database initialization
│   ├── admin/            # Admin dashboard pages
│   │   ├── articles/     # Article management
│   │   ├── users/        # User management
│   │   └── layout.tsx    # Admin layout
│   ├── articles/         # Public article pages
│   ├── auth/             # Authentication pages
│   ├── about/            # About page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage
├── components/
│   ├── ArticleEditor.tsx # Tiptap rich text editor
│   └── SessionProvider.tsx
├── lib/
│   ├── auth.ts           # NextAuth configuration
│   └── db.ts             # Database utilities
├── types/
│   └── next-auth.d.ts    # TypeScript types
├── public/               # Static assets
└── middleware.ts         # Route protection

```

## 🔐 Admin Access

The initial super admin is: `americafirstusateam@gmail.com`

Super admins can:
- Create, edit, and delete articles
- Grant admin access to other users
- Remove non-super admin users

Regular admins can:
- Create, edit, and delete articles
- View admin dashboard

## 📝 Creating Articles

1. Sign in to admin panel
2. Click "New Article" or go to `/admin/articles/new`
3. Write your article using the rich text editor
4. Add images by clicking the image button
5. Save as draft or publish immediately
6. Edit published articles anytime

## 🎨 Customization

### Colors
The patriotic color scheme is defined in Tailwind classes:
- Blue: `blue-900` (#1e3a8a)
- Red: `red-700` (#b91c1c)
- White: `white` (#ffffff)

### Fonts
Uses Next.js Geist font family for clean, modern typography.

### 3D Effects
Scroll animations powered by Framer Motion. Edit `app/page.tsx` to customize parallax effects.

## 🐛 Troubleshooting

### "Database connection failed"
- Verify all POSTGRES_* environment variables are set correctly
- Check Neon Postgres dashboard for database status
- Run `/api/init-db` to initialize tables

### "Authentication not working"
- Ensure NEXTAUTH_URL matches your domain exactly
- Verify NEXTAUTH_SECRET is generated and set
- Check Gmail App Password is correct in EMAIL_SERVER
- Verify user email exists in the users table

### "Cover images not saving"
- Run `/api/migrate-cover-image` to change column from VARCHAR to TEXT
- Base64 images require TEXT column type

### "Build errors"
- Clear `.next` folder: `rm -rf .next`
- Delete node_modules: `rm -rf node_modules`
- Reinstall: `npm install`
- Rebuild: `npm run build`

### "Articles loading slowly"
- Already optimized with 60-second ISR caching
- `generateStaticParams` pre-renders pages at build time
- Loading skeletons provide instant feedback

## 📄 License

Copyright © 2024 America First. All rights reserved.

## 📧 Contact

For questions or support:
- Email: americafirstusateam@gmail.com
- GitHub Issues: [Create an issue](https://github.com/america1storg/america1storg.github.io/issues)

---

**Built with ❤️ for America First**
