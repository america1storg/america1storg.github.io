# Getting Started - New Engineer Onboarding

Welcome! This guide will get you from zero to productive in 15 minutes.

---

## 📋 Before You Start

Make sure you have:
- [ ] Access to this GitHub repository
- [ ] Node.js 18+ installed (`node --version`)
- [ ] A code editor (VS Code recommended)
- [ ] Terminal/command line access

---

## ⚡ 15-Minute Setup

### Step 1: Clone & Install (3 minutes)

```bash
# Clone the repo
git clone https://github.com/america1storg/america1storg.github.io.git
cd america1storg.github.io

# Install dependencies (takes 2-3 minutes)
npm install
```

### Step 2: Get Database Access (5 minutes)

**Option A: Use Existing Database (Ask Team Lead)**
- Request access to the shared Vercel Postgres instance
- Team lead will provide environment variables

**Option B: Create Your Own (For Local Development)**
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import this repository
3. Go to Storage → Create Database → Postgres → Hobby (free)
4. Copy the environment variables

### Step 3: Configure Environment (2 minutes)

```bash
# Copy the example file
cp .env.example .env.local

# Open in editor
code .env.local  # or use nano/vim
```

Paste your database credentials:
```env
POSTGRES_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://..."
POSTGRES_URL_NO_SSL="postgres://..."
POSTGRES_URL_NON_POOLING="postgres://..."
POSTGRES_USER="default"
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="verceldb"

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-this-next"
```

Generate the secret:
```bash
openssl rand -base64 32
# Copy the output and paste as NEXTAUTH_SECRET
```

### Step 4: Start Development (1 minute)

```bash
# Start the dev server
npm run dev

# You should see:
# ▲ Next.js 16.2.12
# - Local: http://localhost:3000
```

Open your browser: **http://localhost:3000**

### Step 5: Initialize Database (2 minutes)

**First time only:**

Visit: http://localhost:3000/api/init-db

You should see:
```json
{"success":true,"message":"Database initialized successfully"}
```

### Step 6: Access Admin Panel (2 minutes)

1. Go to: http://localhost:3000/admin
2. You'll be redirected to sign in
3. Enter: `americafirstusateam@gmail.com`
4. Click "Send Magic Link"
5. **Check your terminal** where `npm run dev` is running
6. Look for output like:
   ```
   =================================
   🔐 MAGIC LINK FOR: americafirstusateam@gmail.com
   🔗 LINK: http://localhost:3000/api/auth/callback/email?...
   =================================
   ```
7. Copy the full link and paste it in your browser
8. You're now logged in! 🎉

---

## ✅ Verify Everything Works

### Test 1: Homepage
- Visit http://localhost:3000
- You should see animated stars and 3D effects
- Scroll down to see parallax animations

### Test 2: Create an Article
1. Go to http://localhost:3000/admin
2. Click "New Article"
3. Type a title and some content
4. Click "Publish"
5. Go to http://localhost:3000/articles
6. Your article should appear!

### Test 3: Make a Code Change
1. Open `app/page.tsx`
2. Find the line with `"America First"`
3. Change it to `"America First - Test"`
4. Save the file
5. Browser should auto-reload with your change
6. Change it back and save

**If all tests pass, you're ready to develop! ✅**

---

## 📚 What to Read Next

### Essential Reading (30 minutes)
1. **[ENGINEERING_README.md](./ENGINEERING_README.md)** - Complete technical documentation
   - Architecture overview
   - Database schema
   - API routes
   - Components

### Quick References
- **Project Structure**: See ENGINEERING_README.md § "Project Structure"
- **Database Schema**: See ENGINEERING_README.md § "Database Schema"
- **API Routes**: See ENGINEERING_README.md § "API Routes"
- **Common Tasks**: See ENGINEERING_README.md § "Common Tasks"

### When You Need Help
- **Deployment**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Quick Setup**: [QUICKSTART.md](./QUICKSTART.md)
- **Features Overview**: [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)

---

## 🎯 Your First Task Suggestions

### Easy (Learn the Codebase)
- [ ] Change the homepage hero text color
- [ ] Add your name to the About page
- [ ] Update a button's styling
- [ ] Add a console.log to see when an article is created

### Medium (Add a Feature)
- [ ] Add a "Last Updated" timestamp to articles
- [ ] Add a character count to the article editor
- [ ] Create a new API endpoint
- [ ] Add a new page (e.g., Contact)

### Advanced (Real Features)
- [ ] Add article categories
- [ ] Implement search functionality
- [ ] Add image upload (not just URLs)
- [ ] Build a comment system

---

## 💡 Pro Tips

### Development Tips
```bash
# Clear cache if things are weird
rm -rf .next

# Check for TypeScript errors
npx tsc --noEmit

# Test production build
npm run build
npm start
```

### Editor Setup (VS Code)
Install these extensions:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

### Git Workflow
```bash
# Create a feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: Add my feature"

# Push and create PR
git push origin feature/my-feature
```

### Debugging
- **Check terminal**: Look for error messages where `npm run dev` runs
- **Check browser console**: F12 → Console tab
- **Check Network tab**: F12 → Network tab (for API errors)
- **Add console.logs**: Sprinkle them liberally while learning

---

## 🐛 Common Issues

### "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Database connection failed"
- Check `.env.local` has correct database credentials
- Make sure Vercel Postgres is created and running
- Try visiting `/api/init-db` again

### "Can't find magic link"
- Look in the terminal where `npm run dev` is running
- It prints the full URL to the console
- Must copy the ENTIRE URL (it's very long)

### "Port 3000 already in use"
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- --port 3001
```

### "Build fails"
```bash
# Check for TypeScript errors
npx tsc --noEmit

# Fix the errors shown, then try again
npm run build
```

---

## 🤝 Team Communication

### Before You Start Work
1. Check if someone else is working on it
2. Create a GitHub issue (optional but helpful)
3. Create your feature branch

### While You Work
- Commit often with clear messages
- Push your branch regularly (backup + visibility)
- Ask questions early (don't struggle alone)

### When You're Done
1. Test locally (all features work)
2. Run `npm run build` (builds successfully)
3. Push your branch
4. Create a Pull Request
5. Tag someone for review

---

## 📞 Need Help?

### Quick Questions
- Check [ENGINEERING_README.md](./ENGINEERING_README.md) first
- Search the codebase for similar patterns
- Google the error message

### Still Stuck?
- Email: americafirstusateam@gmail.com
- GitHub Issues: Create an issue with your question
- Tag team members in your PR if you need specific help

---

## 🎉 You're Ready!

You now have:
- ✅ A working local environment
- ✅ Access to the admin panel
- ✅ Understanding of the project structure
- ✅ Knowledge of where to find documentation
- ✅ Ideas for your first tasks

**Let's build something great!** 🇺🇸

---

**Questions?** Check [ENGINEERING_README.md](./ENGINEERING_README.md) for detailed technical docs.
