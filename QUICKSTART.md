# Quick Start Guide

Get the America First website running locally in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Vercel Postgres (Free)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import this GitHub repository
3. **Don't deploy yet!**
4. Go to the "Storage" tab
5. Click "Create Database" → Select "Postgres" → Choose "Hobby" (Free)
6. Click "Connect" and copy all environment variables

## Step 3: Configure Environment

Create `.env.local` file (or edit the existing one):

```bash
# Paste the Vercel Postgres variables here
POSTGRES_URL="..."
POSTGRES_PRISMA_URL="..."
POSTGRES_URL_NO_SSL="..."
POSTGRES_URL_NON_POOLING="..."
POSTGRES_USER="default"
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="verceldb"

# Add these
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-this-below"
```

Generate the secret:
```bash
openssl rand -base64 32
```

## Step 4: Start Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

## Step 5: Initialize Database

Open in your browser: http://localhost:3000/api/init-db

You should see: `{"success":true,"message":"Database initialized successfully"}`

## Step 6: Access Admin Panel

1. Go to: http://localhost:3000/admin
2. Enter email: `americafirstusateam@gmail.com`
3. Click "Send Magic Link"
4. **Check your terminal console** for the magic link
5. Copy the URL and paste it in your browser
6. You're now logged in as super admin!

## Step 7: Create Your First Article

1. In the admin dashboard, click "New Article"
2. Write a title and content
3. Use the toolbar to format text, add images, etc.
4. Click "Publish" or "Save as Draft"
5. View it on the public site at http://localhost:3000/articles

## That's It!

You now have a fully functional website running locally.

### Next Steps

- Customize the homepage in `app/page.tsx`
- Edit the About page in `app/about/page.tsx`
- Create more articles
- Deploy to Vercel (see DEPLOYMENT.md)

### Common Issues

**Q: "Can't connect to database"**
A: Double-check your POSTGRES_* environment variables

**Q: "Magic link not showing"**
A: Look in your terminal where `npm run dev` is running

**Q: "Can't sign in"**
A: Make sure you ran `/api/init-db` first

Need help? Email: americafirstusateam@gmail.com
