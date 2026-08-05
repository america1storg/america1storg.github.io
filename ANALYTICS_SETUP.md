# Vercel Analytics Setup

This project uses **Vercel Analytics** to track website traffic and user behavior.

## 📊 What's Tracked

Vercel Analytics automatically tracks:
- **Page views** - Which pages users visit
- **Unique visitors** - How many unique users visit your site
- **Top pages** - Most popular pages on your site
- **Referrers** - Where your traffic comes from (Google, social media, direct, etc.)
- **Countries** - Geographic location of your visitors
- **Devices** - Desktop vs mobile usage

## 🔒 Privacy-Friendly

- **No cookies** - Vercel Analytics doesn't use cookies
- **GDPR compliant** - No personal data is collected
- **Lightweight** - Minimal impact on page load speed
- **No cookie consent banner needed**

## 🚀 How It Works

The `@vercel/analytics` package is installed and imported in the root layout (`app/layout.tsx`):

```tsx
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

## 📈 Viewing Your Analytics

### On Vercel Dashboard:
1. Go to [vercel.com](https://vercel.com)
2. Select your project: **america1storg.github.io**
3. Click **Analytics** tab
4. View your traffic data!

### Free Tier Limits:
- **100,000 events per month** (more than enough for most sites)
- Data retention: 30 days
- Real-time updates

## 🎯 What You'll See

Your analytics dashboard shows:

### Overview
- Total page views
- Unique visitors
- Top pages
- Top referrers

### Pages
- Views per page
- Unique visitors per page
- Average time on page

### Locations
- Visitors by country
- Map visualization

### Devices
- Desktop vs mobile breakdown
- Browser types

## 💡 Tips

1. **Wait 24 hours** after deployment for initial data to populate
2. **Check daily** to understand your traffic patterns
3. **Monitor referrers** to see what marketing works
4. **Track top pages** to understand what content resonates

## 🔄 Upgrading (Optional)

If you exceed 100k events/month or need more features:
- Upgrade to **Vercel Pro** ($20/month)
- Get 1 million events/month
- Extended data retention (90 days)
- Advanced filtering and exports

## 📚 Documentation

- [Vercel Analytics Docs](https://vercel.com/docs/analytics)
- [Privacy Policy](https://vercel.com/legal/privacy-policy)

---

**Note**: Analytics only work in production. You won't see data from `localhost:3000` during development.
