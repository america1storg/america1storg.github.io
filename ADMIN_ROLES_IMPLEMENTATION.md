# Admin Page Update - User Roles & Article Workflow

## Overview

This document describes the major updates to the America First admin system implementing role-based permissions and an enhanced article workflow with approval process.

## Implementation Date

2026-08-06

---

## 1. User Roles & Permissions

### Role Hierarchy

#### God Mode (americafirstusateam@gmail.com)
- **Full unrestricted access** to all features
- Cannot be deleted or modified by anyone
- Can manage all users and assign any role
- Can create, edit, approve, publish, and delete any article
- Can access all admin features

#### King
- Similar to God Mode but cannot delete/modify God Mode user
- Can manage users (create, edit roles, delete non-God users)
- Can review, approve, reject, and publish articles
- Can edit any article regardless of status
- Full access to review dashboard

#### Captain
- Can review and manage articles
- Can approve, reject, and publish articles
- Can edit any article
- Access to review dashboard
- **Cannot** manage users

#### Soldier
- Can create new articles only
- Can edit own articles when status is **Draft** or **Needs Re-edit**
- Must submit articles for approval (cannot publish directly)
- **Cannot** edit articles after submission until re-edit is requested
- **Cannot** manage users or access review features

---

## 2. Article Workflow States

### Status Definitions

1. **Draft** - Initial state, author can edit freely
2. **Submitted** - Article submitted for review, locked for editing by author
3. **Needs Re-edit** - Rejected with feedback, author can edit again
4. **Approved** - Approved by reviewer, ready to publish
5. **Published** - Live on public site

### Workflow Flow

```
Draft → Submit for Approval → Submitted
                                  ↓
                    ┌─────────────┴──────────────┐
                    ↓                             ↓
              Needs Re-edit                   Approved
                    ↓                             ↓
              (Author edits)                  Published
                    ↓
              Submit Again
```

### Permissions by Status

| Status | Soldier (Author) | Captain/King/God |
|--------|------------------|------------------|
| Draft | ✓ Edit, Submit | ✓ Edit, Publish |
| Submitted | ✗ Locked | ✓ Approve, Reject, Edit |
| Needs Re-edit | ✓ Edit, Submit | ✓ Approve, Reject, Edit |
| Approved | ✗ Locked | ✓ Publish, Edit |
| Published | ✗ Locked | ✓ Edit |

---

## 3. New Features

### A. Review Dashboard (`/admin/review`)
- **Access**: God Mode, King, Captain only
- **Features**:
  - View all articles pending review
  - Filter by status (Submitted, Needs Re-edit, Approved)
  - Approve articles with one click
  - Request re-edits with custom feedback messages
  - Publish approved articles
  - View article details and history

### B. Custom Notification System
- Replaced all browser `alert()` calls with custom toast notifications
- Types: success, error, warning, info
- Auto-dismisses after 5 seconds
- Matches admin design aesthetic
- Positioned in top-right corner
- Smooth slide-in animations

### C. Publishing Progress Indicator
- Modal overlay during publication process
- Real-time status updates:
  1. Publishing article...
  2. Verifying publication...
  3. Success/Error
- Polls backend to verify article is actually live
- Progress bar visualization
- Prevents premature success messages

### D. Enhanced Articles List
- Status badges with color coding:
  - Draft: Gray
  - Submitted: Blue
  - Needs Re-edit: Yellow
  - Approved: Green
  - Published: Purple
- Filter by all workflow statuses
- Shows author name on each article
- Role-based action buttons

### E. Role Management
- User management page shows role badges
- Can edit user roles (except God Mode)
- Role selector with descriptions:
  - Soldier: Can create articles
  - Captain: Can review and publish articles
  - King: Can manage users and publish
- God Mode user is protected and cannot be modified

---

## 4. Database Changes

### Users Table
```sql
ALTER TABLE users
  ADD COLUMN role VARCHAR(20) DEFAULT 'soldier'
  CHECK (role IN ('god_mode', 'king', 'captain', 'soldier'));
```

### Articles Table
```sql
ALTER TABLE articles
  -- Expanded status values
  ALTER COLUMN status TYPE VARCHAR(30);
  
  DROP CONSTRAINT IF EXISTS articles_status_check;
  ADD CONSTRAINT articles_status_check
    CHECK (status IN ('draft', 'submitted', 'needs_re_edit', 'approved', 'published'));
  
  -- New workflow tracking fields
  ADD COLUMN submitted_at TIMESTAMP WITH TIME ZONE;
  ADD COLUMN approved_at TIMESTAMP WITH TIME ZONE;
  ADD COLUMN rejected_at TIMESTAMP WITH TIME ZONE;
  ADD COLUMN rejection_reason TEXT;
```

---

## 5. New API Endpoints

### Article Workflow
- `POST /api/articles/[id]/submit` - Submit article for approval (Soldier)
- `POST /api/articles/[id]/approve` - Approve article (God/King/Captain)
- `POST /api/articles/[id]/reject` - Request re-edit with reason (God/King/Captain)
- `POST /api/articles/[id]/publish-verified` - Publish with verification (God/King/Captain)
- `GET /api/articles/[id]/verify-published` - Check if article is live (Public)

### User Management
- `PUT /api/admin/users` - Update user role (God/King)

### Database Migration
- `GET /api/migrate-roles` - Run once to update existing database

---

## 6. Files Modified

### Database & Authentication
- `lib/db.ts` - Added role types and permission helpers
- `lib/auth.ts` - Extended JWT and session with role field
- `types/next-auth.d.ts` - Added role to TypeScript types

### Components
- `components/ArticleEditorWorkflow.tsx` - New role-aware editor (NEW)
- `components/Toast.tsx` - Custom notification component (NEW)
- `components/ToastProvider.tsx` - Toast context provider (NEW)
- `components/PublishingModal.tsx` - Publication progress modal (NEW)

### Admin Pages
- `app/admin/layout.tsx` - Added ToastProvider, role badge, Review link
- `app/admin/page.tsx` - Dashboard (unchanged)
- `app/admin/review/page.tsx` - Review dashboard (NEW)
- `app/admin/articles/page.tsx` - Updated with status badges and toasts
- `app/admin/articles/new/page.tsx` - Updated to use toasts
- `app/admin/articles/edit/[id]/page.tsx` - Updated to use ArticleEditorWorkflow
- `app/admin/users/page.tsx` - Complete overhaul for role management

### API Routes
- `app/api/articles/[id]/route.ts` - Extended for new statuses
- `app/api/articles/[id]/submit/route.ts` - Submit for approval (NEW)
- `app/api/articles/[id]/approve/route.ts` - Approve article (NEW)
- `app/api/articles/[id]/reject/route.ts` - Request re-edit (NEW)
- `app/api/articles/[id]/publish-verified/route.ts` - Verified publish (NEW)
- `app/api/articles/[id]/verify-published/route.ts` - Check if live (NEW)
- `app/api/admin/users/route.ts` - Added PUT for role updates
- `app/api/migrate-roles/route.ts` - Database migration endpoint (NEW)

---

## 7. Setup Instructions

### Step 1: Run Database Migration
Visit the migration endpoint once:
```
https://your-domain.vercel.app/api/migrate-roles
```

This will:
- Add `role` column to users table
- Add workflow fields to articles table
- Update God Mode user
- Set existing admins to appropriate roles

### Step 2: Verify God Mode User
The user `americafirstusateam@gmail.com` should now have:
- Role: `god_mode`
- Is Super Admin: `true`
- Cannot be deleted or modified

### Step 3: Assign Roles
1. Sign in as God Mode user
2. Go to **Manage Users**
3. Edit existing users to assign appropriate roles
4. Add new users with their roles

### Step 4: Test Workflow
1. Create a test Soldier user
2. Sign in as Soldier
3. Create an article and submit for approval
4. Sign in as Captain/King/God
5. Go to **Review Queue**
6. Approve or request re-edit
7. Publish approved articles

---

## 8. Permission Reference

### Quick Reference Matrix

| Action | Soldier | Captain | King | God Mode |
|--------|---------|---------|------|----------|
| Create article | ✓ | ✓ | ✓ | ✓ |
| Edit own draft | ✓ | ✓ | ✓ | ✓ |
| Edit any article | ✗ | ✓ | ✓ | ✓ |
| Submit for approval | ✓ | ✓ | ✓ | ✓ |
| Approve article | ✗ | ✓ | ✓ | ✓ |
| Reject/request re-edit | ✗ | ✓ | ✓ | ✓ |
| Publish article | ✗ | ✓ | ✓ | ✓ |
| Delete article | ✗ | ✓ | ✓ | ✓ |
| View review dashboard | ✗ | ✓ | ✓ | ✓ |
| Manage users | ✗ | ✗ | ✓ | ✓ |
| Delete God Mode | ✗ | ✗ | ✗ | ✗ |

---

## 9. Security Considerations

### Protected Actions
1. **God Mode user** cannot be deleted or modified by anyone
2. Role-based API authorization on all endpoints
3. Article edit permissions checked server-side
4. Session validation on every API call
5. God Mode email hardcoded: `americafirstusateam@gmail.com`

### Validation
- User role validated in JWT token
- Permission helpers prevent unauthorized actions
- API returns 403 Forbidden for invalid permissions
- Frontend hides unavailable features based on role

---

## 10. User Experience Improvements

### For Soldiers
- Clear status indicators on articles
- Feedback messages when article needs revision
- Edit access restored when re-edit requested
- Cannot accidentally publish without approval

### For Reviewers (Captain/King/God)
- Dedicated review dashboard
- Filter articles by status
- Quick approve/reject actions
- Custom feedback for rejections
- Batch review capability

### All Users
- Custom notifications replace browser alerts
- Progress indicators for long operations
- Real-time publication verification
- Role badge visible in header
- Intuitive navigation based on permissions

---

## 11. Troubleshooting

### Issue: Articles stuck in "Submitted" status
**Solution**: Captain/King/God user needs to approve or reject them from Review Queue

### Issue: Soldier cannot edit article
**Check**: Article status - can only edit when status is `draft` or `needs_re_edit`

### Issue: God Mode user not showing
**Solution**: Run `/api/migrate-roles` to update database

### Issue: Notifications not appearing
**Check**: ToastProvider is wrapped around admin layout (should be automatic)

### Issue: Publishing hangs
**Check**: Verify article is actually published by visiting public URL directly

---

## 12. Future Enhancements (Not Implemented)

- Email notifications when articles need review
- Article version history
- Bulk approve/reject actions
- Advanced filtering and search in review dashboard
- Article assignment to specific reviewers
- Commenting system on articles
- Analytics dashboard for article performance

---

## 13. Backwards Compatibility

### Existing Data
- Old articles with `draft` or `published` status work as-is
- Existing users default to `soldier` role (can be changed)
- Super admin flag still works alongside role system
- Old API endpoints continue to function

### Breaking Changes
- None - all changes are additive
- Migration is non-destructive
- Existing functionality preserved

---

## Support

For questions or issues:
- Email: americafirstusateam@gmail.com
- GitHub Issues: [Create an issue](https://github.com/america1storg/america1storg.github.io/issues)

---

**Implementation completed by Claude Code on 2026-08-06**
