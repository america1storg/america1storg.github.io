# America First - Deployment Guide

This guide will help you deploy the America First website to Vercel with all features working correctly.

## Prerequisites

1. A Vercel account (free tier is sufficient)
2. This GitHub repository pushed to GitHub
3. Access to `americafirstusateam@gmail.com`

## Step 1: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository: `america1storg/america1storg.github.io`
4. Vercel will auto-detect Next.js settings
5. **Do not deploy yet** - proceed to Step 2 first

### Option B: Via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

## Step 2: Set Up Vercel Postgres Database

1. In your Vercel project dashboard, go to the "Storage" tab
2. Click "Create Database"
3. Select "Postgres"
4. Choose the free "Hobby" plan
5. Click "Create"
6. Once created, click "Connect"
7. Copy all the environment variables shown (they start with `POSTGRES_`)

## Step 3: Configure Environment Variables

In your Vercel project:

1. Go to "Settings" → "Environment Variables"
2. Add the following variables:

### Database Variables (from Step 2)
```
POSTGRES_URL=<from Vercel Postgres>
POSTGRES_PRISMA_URL=<from Vercel Postgres>
POSTGRES_URL_NO_SSL=<from Vercel Postgres>
POSTGRES_URL_NON_POOLING=<from Vercel Postgres>
POSTGRES_USER=<from Vercel Postgres>
POSTGRES_HOST=<from Vercel Postgres>
POSTGRES_PASSWORD=<from Vercel Postgres>
POSTGRES_DATABASE=<from Vercel Postgres>
```

### Authentication Variables
```
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
```

To generate `NEXTAUTH_SECRET`, run in your terminal:
```bash
openssl rand -base64 32
```

### Email Configuration (Development Mode)
For now, the app uses console-based magic links in development. In production, you'll need to configure a real email provider. For testing, leave these empty and check your Vercel deployment logs for the magic links.

## Step 4: Deploy

1. Click "Deploy" in Vercel (if using dashboard)
2. Wait for the build to complete
3. Your site will be live at `https://your-project.vercel.app`

## Step 5: Initialize the Database

After your first deployment:

1. Visit: `https://your-project.vercel.app/api/init-db`
2. You should see: `{"success":true,"message":"Database initialized successfully"}`
3. This creates the database tables and adds `americafirstusateam@gmail.com` as the super admin

## Step 6: Test Admin Access

1. Go to: `https://your-project.vercel.app/admin`
2. You'll be redirected to the sign-in page
3. Enter: `americafirstusateam@gmail.com`
4. Check your Vercel deployment logs (Functions tab) for the magic link
5. Click the magic link to sign in
6. You should now have access to the admin dashboard

## Step 7: Set Up Custom Domain (Optional)

When you get a custom domain:

1. Go to Vercel project → "Settings" → "Domains"
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions
4. Update `NEXTAUTH_URL` environment variable to your custom domain
5. Redeploy the project

## Features Overview

### Admin Features
- **Dashboard**: Overview of articles and stats
- **Article Management**: Create, edit, draft, and publish articles
- **User Management**: Super admin can add/remove other admins
- **Rich Text Editor**: LinkedIn-style editor with images, formatting, and links

### Public Features
- **Homepage**: 3D parallax scrolling with patriotic design
- **Articles**: Public listing of all published articles
- **Individual Articles**: Full article reading experience
- **About Page**: Organization mission and values

## Troubleshooting

### Magic Links Not Working
- Check Vercel Function logs for the magic link URL
- Ensure `NEXTAUTH_URL` matches your deployment URL exactly
- Verify `NEXTAUTH_SECRET` is set

### Database Errors
- Ensure all `POSTGRES_*` environment variables are set correctly
- Run `/api/init-db` endpoint to initialize tables
- Check Vercel Postgres dashboard for connection status

### Build Failures
- Ensure all dependencies are in `package.json`
- Check build logs in Vercel dashboard
- Verify Node.js version compatibility (18.x or higher)

## Production Email Setup (Future)

To enable real email magic links in production, you'll need to:

1. Choose an email provider (SendGrid, AWS SES, etc.)
2. Add environment variables:
   ```
   EMAIL_SERVER_HOST=smtp.example.com
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER=your-smtp-username
   EMAIL_SERVER_PASSWORD=your-smtp-password
   EMAIL_FROM=noreply@yourdomain.com
   ```
3. Remove or modify the development-only `sendVerificationRequest` override in `lib/auth.ts`

## Support

For issues or questions:
- Email: americafirstusateam@gmail.com
- GitHub: [Create an issue](https://github.com/america1storg/america1storg.github.io/issues)

---

**Built with ❤️ for America First**
