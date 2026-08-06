# Quick Start Guide - Role-Based Admin System

## 🚀 Get Started in 5 Minutes

### Step 1: Run the Migration (IMPORTANT - Do This First!)

Visit this URL once after deploying:
```
https://your-domain.vercel.app/api/migrate-roles
```

You should see:
```json
{
  "success": true,
  "message": "Database migrated successfully to support user roles and article workflow"
}
```

### Step 2: Sign In as God Mode

1. Go to `/admin`
2. Sign in with: `americafirstusateam@gmail.com`
3. Check the email for magic link (or console in development)
4. You should now see "God Mode" badge in the header

### Step 3: Create Your Team

1. Go to **Manage Users** in the sidebar
2. Add team members with appropriate roles:
   - **Soldier**: Writers who create content
   - **Captain**: Editors who review and publish
   - **King**: Managers who can also manage users

### Step 4: Test the Workflow

#### As a Soldier:
1. Create a new article
2. Write content
3. Click "Submit for Approval"
4. Notice you can no longer edit it

#### As a Captain/King/God:
1. Go to **Review Queue**
2. See the submitted article
3. Approve it OR request re-edit with feedback
4. If approved, click "Publish"
5. Watch the publishing progress indicator

#### Back as Soldier (if rejected):
1. See the feedback message
2. Edit the article again
3. Re-submit for approval

---

## 🎯 Role Quick Reference

| Role | Can Do |
|------|--------|
| **God Mode** | Everything (cannot be deleted) |
| **King** | Manage users + review + publish |
| **Captain** | Review + publish (no user management) |
| **Soldier** | Create articles + submit for approval |

---

## ✨ New Features Overview

### 1. Review Dashboard
- Access: God/King/Captain only
- Location: `/admin/review`
- Shows all pending articles
- One-click approve/reject/publish

### 2. Custom Notifications
- Beautiful toast messages
- Replace old browser alerts
- Auto-dismiss after 5 seconds

### 3. Publishing Progress
- Modal shows publication status
- Verifies article is actually live
- No more premature success messages

### 4. Status Badges
- Draft (Gray)
- Pending Review (Blue)
- Needs Re-edit (Yellow)
- Approved (Green)
- Published (Purple)

---

## 🔒 Important Security Notes

1. **God Mode user** (`americafirstusateam@gmail.com`) cannot be deleted or modified
2. **Kings** cannot delete or modify God Mode user
3. **Article editing** locked after submission (except for reviewers)
4. **Role changes** require King or God Mode permissions

---

## 📖 Article Workflow

```
CREATE → SUBMIT → REVIEW → APPROVE → PUBLISH
   ↓                ↓
 EDIT         REQUEST RE-EDIT
   ↑                ↓
   └───────────────┘
```

---

## 🆘 Common Issues

**Q: I can't edit my submitted article**
- **A**: That's expected! Ask a reviewer to approve or request re-edit

**Q: Where do I see articles waiting for review?**
- **A**: Go to **Review Queue** in sidebar (Captain/King/God only)

**Q: How do I make someone a King?**
- **A**: Go to **Manage Users**, click Edit next to their name, change role

**Q: Publishing shows success but article isn't live**
- **A**: The new system waits for actual publication before showing success

---

## 📋 Checklist After Setup

- [ ] Ran `/api/migrate-roles`
- [ ] Signed in as God Mode user
- [ ] Created test users with different roles
- [ ] Tested full article workflow
- [ ] Verified notifications work
- [ ] Checked review dashboard access
- [ ] Confirmed permissions work correctly

---

## 🎉 You're All Set!

Your admin system now has:
✅ Role-based access control
✅ Article approval workflow  
✅ Beautiful notifications
✅ Progress indicators
✅ Review dashboard
✅ Protected God Mode user

---

**Questions?** Email: americafirstusateam@gmail.com
