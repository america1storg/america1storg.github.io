# Feature Flags System Documentation

A sophisticated feature flag system for testing and deploying components in production without affecting users.

## Quick Start

### 1. Create a Feature Flag

1. Go to **Admin Panel** → **Feature Flags** (`/admin/flags`)
2. Click **"Create Flag"**
3. Fill in details:
   - **Flag Key**: Must start with `AF_` (e.g., `AF_carousel`)
   - **Name**: Descriptive name (e.g., "Homepage Carousel")
   - **Description**: What the flag controls
   - **Component Name**: Optional reference (e.g., "HomeCarousel")
   - **Status**:
     - `draft` - Hidden from debugger, for development only
     - `available` - Visible in ?showFlags debugger for testing
     - `permanent` - Always ON for everyone (public release)
   - **Pages**: Where flag can be used (e.g., `/`, `/articles`)

### 2. Wrap Component in FeatureGate

```tsx
import { FeatureGate } from '@/components/FeatureGate';
import { MyComponent } from '@/components/MyComponent';

export function Page() {
  return (
    <div>
      <h1>My Page</h1>
      
      {/* Component behind feature flag */}
      <FeatureGate flag="AF_my_feature">
        <MyComponent />
      </FeatureGate>
      
      {/* Rest of page */}
    </div>
  );
}
```

### 3. Test with Debug UI

1. Visit your page with `?showFlags` query parameter:
   - `https://yourdomain.com/?showFlags`
   - `https://yourdomain.com/articles?showFlags`

2. A **debug panel appears in bottom-left corner**:
   - Lists all available/draft flags
   - Toggle switches to enable/disable
   - Shows flag status and description
   - Changes persist in browser session

### 4. Deploy to Production

1. Go back to **Admin** → **Feature Flags**
2. Edit your flag
3. Change status to **"permanent"**
4. Component is now always visible to everyone
5. Optional: Remove `<FeatureGate>` wrapper in future refactor

---

## System Architecture

### Database Schema

```sql
CREATE TABLE feature_flags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  flag_key VARCHAR(100) UNIQUE NOT NULL,  -- e.g., AF_carousel
  description TEXT,
  component_name VARCHAR(255),
  status VARCHAR(20) DEFAULT 'draft',     -- draft | available | permanent
  pages TEXT[],                           -- ['/home', '/articles']
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Flag Statuses

| Status | Visibility | Use Case |
|--------|-----------|----------|
| **draft** | Hidden | Early development, not ready for testing |
| **available** | In ?showFlags debugger | Ready for QA/testing |
| **permanent** | Always ON | Released to production for everyone |

### Components

#### **FeatureFlagProvider**
- Wraps entire app in `app/layout.tsx`
- Loads flags from API
- Manages flag state in localStorage
- Provides `useFeatureFlags()` hook

#### **FlagDebugger**
- Appears when `?showFlags` in URL
- Bottom-left corner panel
- Lists toggleable flags
- Shows real-time status

#### **FeatureGate**
- Conditional rendering wrapper
- Checks if flag is enabled
- Supports fallback content

```tsx
<FeatureGate flag="AF_banner" fallback={<DefaultBanner />}>
  <NewBanner />
</FeatureGate>
```

#### **useFeatureFlags() Hook**

```tsx
import { useFeatureFlags } from '@/components/FeatureFlagProvider';

function MyComponent() {
  const { isEnabled, flags, toggleFlag } = useFeatureFlags();
  
  if (isEnabled('AF_new_design')) {
    return <NewDesign />;
  }
  
  return <OldDesign />;
}
```

---

## API Routes

### GET /api/feature-flags
List all feature flags (admins see all, public sees only permanent)

**Query Parameters:**
- `?public=true` - Only return permanent flags

**Response:**
```json
{
  "flags": [
    {
      "id": 1,
      "name": "Homepage Carousel",
      "flag_key": "AF_carousel",
      "description": "Rotating carousel on homepage",
      "component_name": "HomeCarousel",
      "status": "available",
      "pages": ["/"],
      "created_at": "2026-09-29T...",
      "updated_at": "2026-09-29T..."
    }
  ]
}
```

### POST /api/feature-flags
Create new feature flag (admin only)

**Body:**
```json
{
  "name": "New Feature",
  "flag_key": "AF_new_feature",
  "description": "Description of feature",
  "component_name": "FeatureComponent",
  "status": "draft",
  "pages": ["/", "/about"]
}
```

### PUT /api/feature-flags/[id]
Update feature flag (admin only)

### DELETE /api/feature-flags/[id]
Delete feature flag (admin only)

---

## Best Practices

### Naming Convention
✅ **DO:**
- `AF_carousel` - Feature name
- `AF_new_banner` - Clear purpose
- `AF_dark_mode_v2` - Version suffix

❌ **DON'T:**
- `carousel` - Missing AF_ prefix
- `AF_test` - Too vague
- `AF_123` - Not descriptive

### Flag Lifecycle

1. **Development Phase**
   - Status: `draft`
   - Build component behind FeatureGate
   - Test locally

2. **QA/Testing Phase**
   - Status: `available`
   - QA team can toggle in ?showFlags
   - Gather feedback

3. **Production Release**
   - Status: `permanent`
   - Feature live for everyone
   - Monitor performance

4. **Cleanup (Optional)**
   - Remove FeatureGate wrapper
   - Delete flag from database
   - Simplify code

### Layout Considerations

When adding flagged components, ensure surrounding content adjusts gracefully:

```tsx
<div className="space-y-8">
  {/* Content above */}
  <ExistingContent />
  
  {/* Flagged component */}
  <FeatureGate flag="AF_carousel">
    <div className="my-8">  {/* Add spacing */}
      <Carousel />
    </div>
  </FeatureGate>
  
  {/* Content below */}
  <MoreContent />
</div>
```

### Bandwidth Considerations

- Feature flags themselves add minimal overhead (~3KB)
- Debug UI only loads when `?showFlags` is present
- Permanent flags have zero runtime check cost
- Components are lazy-loaded when flag is enabled

---

## Example: Carousel Implementation

See the homepage carousel for a complete example:

**Flag Configuration:**
- Key: `AF_carousel`
- Name: "Homepage Carousel"
- Status: `available` (for testing)
- Component: `HomeCarousel`

**Usage in Code:**
```tsx
// app/page.tsx
import { FeatureGate } from '@/components/FeatureGate';
import { HomeCarousel } from '@/components/HomeCarousel';

export default function Home() {
  return (
    <div>
      <Hero />
      
      {/* Carousel behind flag */}
      <FeatureGate flag="AF_carousel">
        <section className="py-20 px-[6vw] max-w-[1400px] mx-auto">
          <HomeCarousel />
        </section>
      </FeatureGate>
      
      <Mission />
    </div>
  );
}
```

**Testing:**
1. Visit `/?showFlags`
2. Toggle `AF_carousel` ON/OFF
3. See carousel appear/disappear smoothly
4. Verify layout doesn't break

---

## Troubleshooting

### Flag not appearing in debugger?
- Check flag status is `available` or `draft`
- Confirm you're using `?showFlags` in URL
- Refresh page after creating flag

### Component not rendering when flag is ON?
- Verify flag key matches exactly (case-sensitive)
- Check browser console for errors
- Ensure FeatureFlagProvider wraps your app

### Flag changes not persisting?
- Flags are stored in localStorage
- Clear browser cache if needed
- Check browser devtools → Application → Local Storage

### Production flag stuck ON/OFF?
- Change status to `permanent` to always enable
- Or delete flag entirely to always disable

---

## Security

- Only authenticated admins can create/modify flags
- Flag debugger has no production impact
- Permanent flags are optimized at runtime
- No sensitive data exposed in flag metadata

---

## Performance

- Initial load: ~3KB overhead (provider + context)
- Runtime checks: <0.1ms per flag
- No impact when `?showFlags` not present
- Permanent flags compiled away at runtime

---

## Future Enhancements

Potential additions to the flag system:

- [ ] User targeting (show to specific users/roles)
- [ ] A/B testing (show to % of users)
- [ ] Scheduled activation (auto-enable at date/time)
- [ ] Analytics integration (track flag engagement)
- [ ] Dependency management (flag A requires flag B)
- [ ] Bulk operations (enable/disable multiple flags)
