# America First - Engineering Documentation

> **Welcome Engineer!** This document will help you understand the codebase, architecture, and how to continue building on top of what's already here.

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Architecture Overview](#architecture-overview)
3. [Project Structure](#project-structure)
4. [Tech Stack Deep Dive](#tech-stack-deep-dive)
5. [Database Schema](#database-schema)
6. [Authentication Flow](#authentication-flow)
7. [API Routes](#api-routes)
8. [Components](#components)
9. [Styling & Theming](#styling--theming)
10. [Development Workflow](#development-workflow)
11. [Common Tasks](#common-tasks)
12. [Deployment](#deployment)
13. [Troubleshooting](#troubleshooting)
14. [Contributing](#contributing)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- Git
- A code editor (VS Code recommended)

### Installation

```bash
# 1. Clone the repository (if you haven't already)
git clone https://github.com/america1storg/america1storg.github.io.git
cd america1storg.github.io

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your actual credentials

# 4. Run development server
npm run dev

# 5. Open browser
# Visit: http://localhost:3000

# 6. Initialize database (first time only)
# Visit: http://localhost:3000/api/init-db
```

### Environment Variables

Create `.env.local` with these variables:

```env
# Vercel Postgres (get from Vercel dashboard)
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
NEXTAUTH_SECRET="your-secret-here"  # Generate: openssl rand -base64 32
```

---

## 🏗️ Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT SIDE                          │
├─────────────────────────────────────────────────────────────┤
│  • Next.js Pages (React Components)                         │
│  • Framer Motion (Animations)                               │
│  • Tailwind CSS (Styling)                                   │
│  • NextAuth Session Provider                                │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────┐
│                        SERVER SIDE                           │
├─────────────────────────────────────────────────────────────┤
│  • Next.js API Routes (Serverless Functions)                │
│  • NextAuth.js (Authentication)                             │
│  • Middleware (Route Protection)                            │
└─────────────────────────────────────────────────────────────┘
                            ↕ SQL
┌─────────────────────────────────────────────────────────────┐
│                      VERCEL POSTGRES                         │
├─────────────────────────────────────────────────────────────┤
│  • users (admins)                                           │
│  • articles (content)                                       │
│  • article_images (media)                                   │
└─────────────────────────────────────────────────────────────┘
```

### Technology Decisions

| Technology | Why We Chose It |
|------------|-----------------|
| **Next.js 14** | SSR, SSG, API routes in one framework. App Router for modern patterns. |
| **TypeScript** | Type safety reduces bugs, better DX with autocomplete. |
| **Vercel Postgres** | Free tier, zero-config, integrated with Vercel deployment. |
| **NextAuth.js** | Industry standard, supports email magic links, extensible. |
| **Tailwind CSS** | Rapid development, consistent design, small bundle size. |
| **Framer Motion** | Best React animation library, declarative API, performant. |
| **Tiptap** | Modern, extensible rich text editor. Better than Draft.js/Slate. |

---

## 📁 Project Structure

```
america1storg.github.io/
│
├── app/                          # Next.js 14 App Router
│   ├── api/                      # API Routes (Backend)
│   │   ├── admin/
│   │   │   ├── stats/           # Dashboard statistics
│   │   │   │   └── route.ts
│   │   │   └── users/           # User management CRUD
│   │   │       └── route.ts
│   │   ├── articles/            # Article CRUD
│   │   │   ├── [id]/           # Single article operations
│   │   │   │   └── route.ts    # GET, PUT, DELETE
│   │   │   └── route.ts        # GET (list), POST (create)
│   │   ├── auth/
│   │   │   └── [...nextauth]/  # NextAuth.js handlers
│   │   │       └── route.ts
│   │   └── init-db/            # Database initialization
│   │       └── route.ts
│   │
│   ├── admin/                   # Admin Panel Pages
│   │   ├── articles/
│   │   │   ├── edit/[id]/      # Edit article page
│   │   │   │   └── page.tsx
│   │   │   ├── new/            # Create new article
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx        # Articles list
│   │   ├── users/              # User management (super admin)
│   │   │   └── page.tsx
│   │   ├── layout.tsx          # Admin layout with sidebar
│   │   └── page.tsx            # Dashboard
│   │
│   ├── articles/               # Public Article Pages
│   │   ├── [slug]/            # Individual article view
│   │   │   └── page.tsx
│   │   └── page.tsx           # Articles listing
│   │
│   ├── auth/                   # Authentication Pages
│   │   ├── signin/
│   │   │   └── page.tsx
│   │   └── verify/
│   │       └── page.tsx
│   │
│   ├── about/                  # About page
│   │   └── page.tsx
│   │
│   ├── layout.tsx             # Root layout (SessionProvider)
│   ├── page.tsx               # Homepage (3D effects)
│   └── globals.css            # Global styles
│
├── components/                 # Reusable React Components
│   ├── ArticleEditor.tsx      # Tiptap rich text editor
│   └── SessionProvider.tsx    # NextAuth client wrapper
│
├── lib/                        # Utilities & Configuration
│   ├── auth.ts                # NextAuth configuration
│   └── db.ts                  # Database utilities & schema
│
├── types/                      # TypeScript Type Definitions
│   └── next-auth.d.ts         # Extend NextAuth types
│
├── public/                     # Static Assets
│   ├── favicon.ico
│   └── *.svg                  # Icons
│
├── middleware.ts              # Route protection
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS config
├── tsconfig.json              # TypeScript config
├── package.json               # Dependencies
├── vercel.json                # Vercel deployment config
│
└── Documentation/
    ├── README.md              # User-facing docs
    ├── ENGINEERING_README.md  # This file
    ├── DEPLOYMENT.md          # Deployment guide
    ├── QUICKSTART.md          # Quick setup
    └── PROJECT_SUMMARY.md     # Feature overview
```

---

## 🔧 Tech Stack Deep Dive

### Frontend

#### Next.js 14 (App Router)
- **Version**: 16.2.12 (Turbopack enabled)
- **Pattern**: App Router (not Pages Router)
- **Rendering**: 
  - Server Components by default
  - Client Components marked with `'use client'`
  - Server-side rendering for SEO
- **Key Files**: `app/**/*.tsx`

#### React 19
- Latest React with Server Components support
- Suspense boundaries for loading states
- Server Actions ready (not currently used)

#### TypeScript
- Strict mode enabled
- Custom type definitions in `types/`
- Type-safe API routes and components

#### Tailwind CSS
- **Version**: 4.x
- **Config**: `tailwind.config.ts`
- **Custom Colors**: 
  - `blue-900`: #1e3a8a (primary)
  - `red-700`: #b91c1c (accent)
- **Responsive**: Mobile-first approach
- **Dark Mode**: Not implemented (easy to add)

#### Framer Motion
- **Version**: Latest
- **Used For**:
  - Parallax scrolling (`useScroll`, `useTransform`)
  - Fade-in animations (`whileInView`)
  - Hover effects (`whileHover`)
  - Scroll-triggered animations
- **Key File**: `app/page.tsx`

### Backend

#### Next.js API Routes
- Serverless functions
- RESTful design
- JSON responses
- Error handling with try/catch

#### NextAuth.js
- **Provider**: Email (magic links)
- **Session**: JWT-based
- **Callbacks**: Custom `signIn` and `session`
- **Config**: `lib/auth.ts`

#### Vercel Postgres
- **Client**: `@vercel/postgres`
- **Connection**: Pooled (pgbouncer)
- **Queries**: Tagged template literals (prevents SQL injection)
- **Schema**: See [Database Schema](#database-schema)

---

## 💾 Database Schema

### Tables

#### 1. `users`
Stores admin user accounts.

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

**Indexes:**
- Primary key on `id`
- Unique index on `email`

**Relationships:**
- One-to-many with `articles` (author)

**Notes:**
- `is_super_admin`: Grants user management permissions
- Initial super admin: `americafirstusateam@gmail.com`

#### 2. `articles`
Stores article content and metadata.

```sql
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image VARCHAR(1000),
  author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes:**
- Primary key on `id`
- Foreign key on `author_id`

**Relationships:**
- Many-to-one with `users` (author)
- One-to-many with `article_images`

**Notes:**
- `status`: 'draft' or 'published'
- `published_at`: Set when first published
- `excerpt`: Auto-generated from content (first 200 chars)

#### 3. `article_images`
Stores images within articles (for future use).

```sql
CREATE TABLE article_images (
  id SERIAL PRIMARY KEY,
  article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
  image_url VARCHAR(1000) NOT NULL,
  alt_text VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes:**
- Primary key on `id`
- Foreign key on `article_id` with CASCADE delete

**Relationships:**
- Many-to-one with `articles`

**Notes:**
- Currently not actively used
- Ready for future image management features

### Entity Relationship Diagram

```
┌─────────────┐         ┌──────────────┐         ┌──────────────────┐
│    users    │         │   articles   │         │ article_images   │
├─────────────┤         ├──────────────┤         ├──────────────────┤
│ id (PK)     │────┐    │ id (PK)      │────┐    │ id (PK)          │
│ email       │    └───→│ author_id FK │    └───→│ article_id FK    │
│ name        │         │ title        │         │ image_url        │
│ is_super... │         │ content      │         │ alt_text         │
│ created_at  │         │ excerpt      │         │ created_at       │
│ updated_at  │         │ cover_image  │         └──────────────────┘
└─────────────┘         │ status       │
                        │ published_at │
                        │ created_at   │
                        │ updated_at   │
                        └──────────────┘
```

### Database Operations

#### Initialization
```typescript
// Run once: /api/init-db
await initializeDatabase();
```

#### Common Queries

**Get all published articles:**
```typescript
const articles = await sql`
  SELECT a.*, u.name as author_name
  FROM articles a
  LEFT JOIN users u ON a.author_id = u.id
  WHERE a.status = 'published'
  ORDER BY a.published_at DESC
`;
```

**Create article:**
```typescript
const result = await sql`
  INSERT INTO articles (title, content, excerpt, status, author_id, published_at)
  VALUES (${title}, ${content}, ${excerpt}, ${status}, ${authorId}, ${publishedAt})
  RETURNING *
`;
```

**Check if user is admin:**
```typescript
const result = await sql`
  SELECT id FROM users WHERE email = ${email}
`;
const isAdmin = result.rows.length > 0;
```

---

## 🔐 Authentication Flow

### How It Works

1. **User visits `/admin`**
   - Middleware checks for session
   - No session → redirect to `/auth/signin`

2. **User enters email**
   - Form submits to NextAuth
   - Email provider generates magic link
   - **Development**: Link logged to console
   - **Production**: Link sent via email

3. **User clicks magic link**
   - NextAuth validates token
   - Runs `signIn` callback
   - Checks if email exists in `users` table
   - If yes → create session
   - If no → show error

4. **Session created**
   - JWT stored in cookie
   - Custom session data from DB
   - User redirected to `/admin`

5. **Subsequent requests**
   - Middleware checks session
   - Session valid → allow access
   - Session invalid → redirect to signin

### Code Flow

```typescript
// 1. Middleware (middleware.ts)
export default withAuth({
  pages: { signIn: '/auth/signin' }
});
export const config = { matcher: ['/admin/:path*'] };

// 2. Auth Config (lib/auth.ts)
export const authOptions: NextAuthOptions = {
  providers: [EmailProvider({ ... })],
  callbacks: {
    async signIn({ user }) {
      // Check if user exists in DB
      const result = await sql`SELECT id FROM users WHERE email = ${user.email}`;
      return result.rows.length > 0;
    },
    async session({ session, token }) {
      // Add custom user data to session
      const user = await sql`SELECT * FROM users WHERE email = ${token.email}`;
      session.user = { ...user, isSuperAdmin: user.is_super_admin };
      return session;
    }
  }
};

// 3. Client-side (any component)
import { useSession } from 'next-auth/react';
const { data: session } = useSession();
if (session?.user?.isSuperAdmin) { /* show admin features */ }
```

### Security Considerations

- ✅ Magic links expire after 24 hours
- ✅ Email must exist in DB to authenticate
- ✅ JWT secrets should be random and secure
- ✅ Middleware protects all `/admin` routes
- ✅ API routes check session server-side
- ⚠️ No rate limiting (add if needed)
- ⚠️ No account lockout (add if needed)

---

## 🛣️ API Routes

### Convention
- **GET**: Retrieve data
- **POST**: Create new resource
- **PUT**: Update existing resource
- **DELETE**: Remove resource

### Routes Overview

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/init-db` | Initialize database tables | No |
| GET | `/api/articles` | List all articles | Optional* |
| POST | `/api/articles` | Create new article | Yes |
| GET | `/api/articles/[id]` | Get single article | Optional* |
| PUT | `/api/articles/[id]` | Update article | Yes |
| DELETE | `/api/articles/[id]` | Delete article | Yes |
| GET | `/api/admin/stats` | Dashboard statistics | Yes |
| GET | `/api/admin/users` | List all admin users | Yes (Super Admin) |
| POST | `/api/admin/users` | Add new admin user | Yes (Super Admin) |
| DELETE | `/api/admin/users` | Remove admin user | Yes (Super Admin) |

*If authenticated, returns all articles. If not, returns only published articles.

### Example: Article CRUD

#### Create Article
```typescript
// POST /api/articles
const response = await fetch('/api/articles', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'My Article',
    content: '<p>Content here</p>',
    status: 'published',
    author_id: userId
  })
});
const { article } = await response.json();
```

#### Update Article
```typescript
// PUT /api/articles/123
const response = await fetch('/api/articles/123', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Updated Title',
    content: '<p>Updated content</p>',
    status: 'published'
  })
});
```

#### Delete Article
```typescript
// DELETE /api/articles/123
await fetch('/api/articles/123', { method: 'DELETE' });
```

### Error Handling

All API routes return consistent error format:

```json
{
  "error": "Description of error",
  "details": "Additional info (optional)"
}
```

HTTP Status Codes:
- `200` - Success
- `400` - Bad request (validation error)
- `403` - Forbidden (not authorized)
- `404` - Not found
- `500` - Server error

---

## 🧩 Components

### ArticleEditor

**Location**: `components/ArticleEditor.tsx`

**Purpose**: LinkedIn-style rich text editor for creating/editing articles.

**Props**:
```typescript
interface ArticleEditorProps {
  initialContent?: string;      // HTML string
  initialTitle?: string;         // Article title
  onSave: (title, content, status) => Promise<void>;
  isSaving: boolean;            // Show loading state
}
```

**Features**:
- ✅ Rich text formatting (bold, italic, headings, lists)
- ✅ Image insertion via URL
- ✅ Link creation
- ✅ Blockquotes
- ✅ Horizontal rules
- ✅ Draft/publish workflow

**Tiptap Extensions Used**:
```typescript
[
  StarterKit,              // Basic formatting
  Image,                   // Image support
  Link,                    // Hyperlinks
  Placeholder              // Empty state text
]
```

**Usage**:
```tsx
<ArticleEditor
  initialTitle="My Article"
  initialContent="<p>Hello</p>"
  onSave={async (title, content, status) => {
    await fetch('/api/articles', {
      method: 'POST',
      body: JSON.stringify({ title, content, status })
    });
  }}
  isSaving={false}
/>
```

**Customization**:
- Add more toolbar buttons in the toolbar section
- Add new Tiptap extensions (e.g., Tables, Code blocks)
- Customize styling in the `EditorContent` className

### SessionProvider

**Location**: `components/SessionProvider.tsx`

**Purpose**: Wraps NextAuth's SessionProvider for client components.

**Usage**:
```tsx
// In layout.tsx
<SessionProvider>
  {children}
</SessionProvider>
```

**Why Needed**: NextAuth's SessionProvider is a client component, but we want to use it in the root layout (server component). This wrapper bridges the gap.

---

## 🎨 Styling & Theming

### Tailwind Configuration

**File**: `tailwind.config.ts`

```typescript
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Add custom colors, fonts, etc. here
    },
  },
  plugins: [],
};
```

### Color Palette

| Color | Tailwind Class | Hex | Usage |
|-------|----------------|-----|-------|
| Primary Blue | `blue-900` | #1e3a8a | Navigation, buttons, headings |
| Accent Red | `red-700` | #b91c1c | Accents, bullets |
| White | `white` | #ffffff | Background, text on dark |
| Gray | `gray-50` to `gray-900` | Various | Text, borders, backgrounds |

### Typography

```css
/* Default font */
font-family: var(--font-geist-sans);

/* Headings */
.text-5xl { font-size: 3rem; }    /* Page titles */
.text-3xl { font-size: 1.875rem; } /* Section titles */
.text-xl { font-size: 1.25rem; }   /* Body large */

/* Weights */
.font-bold { font-weight: 700; }
.font-semibold { font-weight: 600; }
.font-medium { font-weight: 500; }
```

### Responsive Design

```typescript
// Breakpoints
sm: '640px'   // Tablet
md: '768px'   // Tablet landscape
lg: '1024px'  // Desktop
xl: '1280px'  // Large desktop

// Usage
<div className="text-base md:text-lg lg:text-xl">
  // Mobile: text-base, Tablet: text-lg, Desktop: text-xl
</div>
```

### Adding Custom Styles

1. **Global styles**: Edit `app/globals.css`
2. **Component styles**: Use Tailwind classes
3. **One-off styles**: Use `style={{}}` prop (avoid if possible)

### Dark Mode (Not Implemented)

To add dark mode:

```typescript
// tailwind.config.ts
export default {
  darkMode: 'class', // or 'media'
  // ...
};

// Add dark: variants
<div className="bg-white dark:bg-gray-900">
```

---

## 🛠️ Development Workflow

### Daily Development

```bash
# 1. Start dev server
npm run dev

# 2. Open browser
http://localhost:3000

# 3. Make changes
# Files auto-reload on save

# 4. Check for errors
# Look at terminal and browser console
```

### Before Committing

```bash
# 1. Type check
npm run type-check  # If script exists
# OR
npx tsc --noEmit

# 2. Build test
npm run build

# 3. Format code (if Prettier configured)
npm run format

# 4. Commit
git add .
git commit -m "feat: Add new feature"
git push
```

### Git Workflow

We use conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructure
- `test:` Adding tests
- `chore:` Tooling changes

Example:
```bash
git commit -m "feat: Add article categories"
git commit -m "fix: Fix image upload bug"
git commit -m "docs: Update README"
```

### Branch Strategy

```
main              Production-ready code
├─ dev            Development branch (if needed)
└─ feature/xyz    Feature branches
```

**Process**:
1. Create feature branch from `main`
2. Make changes
3. Test locally
4. Push and create PR
5. Review and merge to `main`
6. Vercel auto-deploys from `main`

---

## 📝 Common Tasks

### Adding a New Page

```bash
# 1. Create page file
touch app/new-page/page.tsx

# 2. Add content
```

```tsx
export default function NewPage() {
  return (
    <div>
      <h1>New Page</h1>
    </div>
  );
}
```

```bash
# 3. Add to navigation (if needed)
# Edit app/page.tsx or components/Navigation.tsx
```

### Adding a New API Route

```bash
# 1. Create route file
mkdir -p app/api/new-endpoint
touch app/api/new-endpoint/route.ts

# 2. Add handler
```

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Hello' });
}
```

### Adding a Database Field

```typescript
// 1. Modify lib/db.ts - add field to CREATE TABLE
await sql`
  ALTER TABLE articles
  ADD COLUMN new_field VARCHAR(255)
`;

// 2. Update TypeScript interfaces
interface Article {
  // ...existing fields
  new_field: string;
}

// 3. Update API routes to handle new field

// 4. Update components to display/edit new field
```

### Adding Authentication to an API Route

```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  
  // Proceed with authenticated request
}
```

### Adding a New Tiptap Extension

```bash
# 1. Install extension
npm install @tiptap/extension-table @tiptap/extension-table-row @tiptap/extension-table-cell

# 2. Add to ArticleEditor.tsx
```

```typescript
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';

const editor = useEditor({
  extensions: [
    StarterKit,
    Image,
    Link,
    Table,
    TableRow,
    TableCell,
  ],
  // ...
});

// 3. Add toolbar button
<button onClick={() => editor.chain().focus().insertTable().run()}>
  Add Table
</button>
```

### Modifying 3D Effects

```typescript
// File: app/page.tsx

// Change parallax speed
const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -200]); // Increase for faster

// Change fade timing
const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]); // Fade sooner

// Add new parallax element
const newY = useTransform(scrollYProgress, [0, 1], [0, -100]);

<motion.div style={{ y: newY }}>
  New parallax content
</motion.div>
```

---

## 🚀 Deployment

### Vercel (Recommended)

**Step 1: Push to GitHub**
```bash
git push origin main
```

**Step 2: Import to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import `america1storg/america1storg.github.io`
4. Click "Deploy"

**Step 3: Add Vercel Postgres**
1. In project dashboard → "Storage" tab
2. Click "Create Database" → "Postgres"
3. Choose "Hobby" (free)
4. Click "Create"

**Step 4: Add Environment Variables**
1. Settings → Environment Variables
2. Add all variables from `.env.local`
3. Click "Save"

**Step 5: Redeploy**
1. Deployments → Latest → Click "Redeploy"

**Step 6: Initialize Database**
1. Visit: `https://your-domain.vercel.app/api/init-db`
2. Should see success message

**Done!** Your site is live.

### Manual Deployment (Other Platforms)

```bash
# Build for production
npm run build

# Output in .next folder
# Deploy .next to your hosting platform
```

**Requirements**:
- Node.js 18+ runtime
- Environment variables set on platform
- PostgreSQL database (provide connection string)

---

## 🐛 Troubleshooting

### Common Issues

#### "Module not found" errors

```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Build fails with type errors

```bash
# Solution: Check TypeScript errors
npx tsc --noEmit

# Fix errors in code, then rebuild
npm run build
```

#### Database connection fails

```
Error: unable to connect to database
```

**Solution**:
1. Check `.env.local` has correct `POSTGRES_*` variables
2. Ensure Vercel Postgres is created
3. Run `/api/init-db` to initialize tables

#### Magic link not working

**In Development**:
- Check terminal console for link
- Copy and paste full URL into browser

**In Production**:
- Check Vercel Function logs
- Ensure `NEXTAUTH_URL` matches your domain exactly
- Verify `NEXTAUTH_SECRET` is set

#### Session not persisting

```bash
# Solution: Clear cookies and try again
# In browser: DevTools → Application → Cookies → Delete all

# Check NEXTAUTH_SECRET is set and consistent
```

#### 3D animations laggy

```typescript
// Solution: Reduce animation complexity
// In app/page.tsx

// Before
{[...Array(50)].map(...)}  // 50 stars

// After
{[...Array(20)].map(...)}  // 20 stars (faster)
```

#### Images in editor not showing

**Check**:
1. Image URL is valid and accessible
2. URL is https (not http)
3. Image host allows hotlinking

---

## 🤝 Contributing

### Adding New Features

1. **Check if it fits the mission**
   - Does it support civic education?
   - Is it aligned with the organization's values?

2. **Plan the feature**
   - Sketch UI if frontend
   - Design API if backend
   - Consider database changes

3. **Implement**
   - Follow existing patterns
   - Use TypeScript
   - Write clean, commented code

4. **Test**
   - Test locally
   - Test edge cases
   - Check mobile responsiveness

5. **Document**
   - Update this README if architecture changes
   - Add inline comments for complex logic

6. **Submit PR**
   - Clear description
   - Screenshots for UI changes
   - Tag reviewers

### Code Style

- **Indent**: 2 spaces
- **Quotes**: Single quotes for strings
- **Semicolons**: Use them
- **Naming**:
  - Components: PascalCase (`ArticleEditor`)
  - Functions: camelCase (`fetchArticles`)
  - Files: kebab-case (`article-editor.tsx`) or PascalCase for components
- **Comments**: Explain why, not what

```typescript
// Good ✅
// Fetch only published articles to avoid showing drafts to public
const articles = await sql`SELECT * FROM articles WHERE status = 'published'`;

// Bad ❌
// Get articles from database
const articles = await sql`SELECT * FROM articles WHERE status = 'published'`;
```

### Testing

Currently no automated tests. To add:

```bash
# Install testing libraries
npm install -D @testing-library/react @testing-library/jest-dom jest

# Add test script to package.json
"scripts": {
  "test": "jest"
}

# Create tests
# __tests__/components/ArticleEditor.test.tsx
```

---

## 📚 Additional Resources

### Documentation Links

- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion
- **NextAuth.js**: https://next-auth.js.org
- **Tiptap**: https://tiptap.dev
- **Vercel Postgres**: https://vercel.com/docs/storage/vercel-postgres

### Helpful Commands

```bash
# Check Next.js version
npx next --version

# Clear Next.js cache
rm -rf .next

# Check for outdated packages
npm outdated

# Update dependencies
npm update

# Check bundle size
npm run build
# Look at the output table

# Find unused dependencies
npx depcheck
```

---

## 🎯 Roadmap Ideas

Future enhancements you could add:

### High Priority
- [ ] Email provider for production (SendGrid, AWS SES)
- [ ] Article categories/tags
- [ ] Search functionality
- [ ] SEO metadata per article
- [ ] Image upload to Vercel Blob (not just URLs)

### Medium Priority
- [ ] Comment system
- [ ] Social sharing buttons
- [ ] Newsletter signup
- [ ] RSS feed
- [ ] Article drafts auto-save
- [ ] Rich text editor improvements (tables, code blocks)

### Low Priority
- [ ] Dark mode
- [ ] Internationalization (i18n)
- [ ] Analytics dashboard
- [ ] User roles beyond super admin/admin
- [ ] Article scheduling
- [ ] Related articles
- [ ] Reading time estimate

---

## 📞 Support

### Getting Help

1. **Check documentation**:
   - This file
   - `README.md`
   - `DEPLOYMENT.md`

2. **Search for errors**:
   - Google the error message
   - Check Next.js docs
   - Check GitHub issues for similar problems

3. **Ask the team**:
   - Email: americafirstusateam@gmail.com
   - GitHub Issues: [Create an issue](https://github.com/america1storg/america1storg.github.io/issues)

### Reporting Bugs

When reporting a bug, include:

1. **What you expected to happen**
2. **What actually happened**
3. **Steps to reproduce**
4. **Error messages** (screenshots or copy-paste)
5. **Environment**: Browser, OS, Node version
6. **Code samples** (if relevant)

---

## 🎉 Conclusion

You now have everything you need to:

- ✅ Understand the architecture
- ✅ Set up your development environment
- ✅ Make changes confidently
- ✅ Add new features
- ✅ Deploy to production
- ✅ Troubleshoot issues

**Welcome to the team!** 🇺🇸

Let's build something great for civic education together.

---

**Last Updated**: 2024-07-30  
**Maintained By**: America First Engineering Team  
**Questions?** Contact: americafirstusateam@gmail.com
