# Analytics Tracking Documentation

This document outlines all analytics tracking implemented on the America First website using Vercel Analytics.

## Overview

We use **Vercel Analytics** with custom event tracking to understand user behavior, engagement, and performance metrics across the site.

## Currently Tracked Events

### 1. **Article Engagement**
- **Article Views**: Tracked when an article page loads
  - Event: `article_view`
  - Data: `article_id`, `article_title`
  
- **Reading Time**: Tracks how long users spend reading articles (minimum 5 seconds)
  - Event: `article_read_time`
  - Data: `article_id`, `duration_seconds`

- **Article Shares**: Tracks when users share articles
  - Event: `article_share`
  - Data: `article_id`, `article_title`, `platform` (twitter, facebook, linkedin, copy)

### 2. **User Preferences**
- **Theme Toggle**: Tracks when users switch between dark/light mode
  - Event: `theme_toggle`
  - Data: `theme` (dark or light)

### 3. **Performance Monitoring**
- **Speed Insights**: Automatically tracks Core Web Vitals
  - First Contentful Paint (FCP)
  - Largest Contentful Paint (LCP)
  - Cumulative Layout Shift (CLS)
  - First Input Delay (FID)
  - Time to First Byte (TTFB)

## Available (Not Yet Implemented) Events

The following events are ready to implement in `lib/analytics.ts`:

### Newsletter
- `newsletter_subscribe` - Track newsletter signups with source location

### Navigation & CTA
- `cta_click` - Track clicks on Call-to-Action buttons (Get Involved, Donate, etc.)
- `external_link_click` - Track clicks on external links

### Search
- `search_performed` - Track search queries and result counts
- `search_result_click` - Track which search results users click

### Forms
- `contact_form_submit` - Track contact form submissions

### Engagement Metrics
- `scroll_depth` - Track how far users scroll on pages
- `time_on_page` - Track total time spent on specific pages

## How to View Analytics

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `america1storg.github.io`
3. Click on **Analytics** tab
4. View:
   - **Web Analytics**: Page views, unique visitors, top pages
   - **Speed Insights**: Performance metrics and Core Web Vitals
   - **Custom Events**: All tracked events with filters

## How to Add New Tracking

1. **Add event function to `lib/analytics.ts`**:
```typescript
export const analytics = {
  // ... existing events
  
  newEvent: (param1: string, param2: number) => {
    track('new_event_name', {
      param1,
      param2,
    });
  },
};
```

2. **Use in a component**:
```typescript
import { analytics } from '@/lib/analytics';

// In your component
analytics.newEvent('value1', 123);
```

## Best Practices

- ✅ Track meaningful user actions
- ✅ Use descriptive event names (snake_case)
- ✅ Include relevant context in event data
- ✅ Respect user privacy - don't track PII
- ❌ Don't over-track - focus on actionable metrics
- ❌ Don't track every single click

## Privacy Considerations

- All analytics are anonymous
- No personally identifiable information (PII) is tracked
- Complies with Vercel's privacy policy
- Users can opt-out through browser settings (Do Not Track)

## Performance Impact

- **Zero performance impact**: Analytics load asynchronously
- **Lightweight**: ~3KB total bundle size
- **Edge-optimized**: Runs on Vercel's Edge Network
