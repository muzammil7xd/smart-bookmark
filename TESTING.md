# Testing Guide

## Local Testing

### Prerequisites
- Node.js 18+
- npm or yarn
- A Supabase project with proper configuration
- Google OAuth credentials configured

### Setup for Testing

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## Test Cases

### Test 1: Google OAuth Sign-in
**Steps:**
1. Navigate to http://localhost:3000
2. Click "Sign in with Google"
3. Authorize with your Google account
4. Should redirect to dashboard

**Expected Result:**
- ✓ Logged in successfully
- ✓ User email displayed in header
- ✓ Redirected to /dashboard

---

### Test 2: Add Bookmark
**Steps:**
1. Sign in to the application
2. Enter a title (e.g., "GitHub")
3. Enter a URL (e.g., "https://github.com")
4. Click "Add Bookmark"

**Expected Result:**
- ✓ Bookmark appears in the list immediately
- ✓ No page refresh needed
- ✓ Title and URL are displayed correctly
- ✓ Timestamp shows current date/time

---

### Test 3: Real-time Sync (Multiple Tabs)
**Steps:**
1. Sign in and open dashboard in Tab 1
2. Open the same URL in Tab 2 (same browser, same account)
3. In Tab 1, add a new bookmark
4. Observe Tab 2

**Expected Result:**
- ✓ New bookmark appears in Tab 2 instantly
- ✓ No page refresh needed in Tab 2
- ✓ Both tabs show the same bookmark list

---

### Test 4: Delete Bookmark
**Steps:**
1. In Tab 1, add a bookmark
2. Watch it appear in Tab 2 (from Test 3)
3. In Tab 2, click "Delete" on the bookmark
4. Confirm deletion
5. Observe Tab 1

**Expected Result:**
- ✓ Bookmark deleted from Tab 2
- ✓ Bookmark disappears from Tab 1 instantly
- ✓ No page refresh in Tab 1
- ✓ Confirmation dialog shown before delete

---

### Test 5: Privacy - User Isolation
**Steps:**
1. Sign in as User A
2. Add 2-3 bookmarks
3. Sign out
4. Sign in as User B (different Google account)
5. Check dashboard

**Expected Result:**
- ✓ User B sees empty bookmark list
- ✓ User B's bookmarks are empty
- ✓ User A's bookmarks are not visible
- ✓ No cross-contamination of data

---

### Test 6: Sign Out
**Steps:**
1. Sign in to the application
2. Click "Sign Out" button
3. Try to access /dashboard directly

**Expected Result:**
- ✓ Redirected to home page
- ✓ Not logged in anymore
- ✓ Must sign in again to access dashboard

---

### Test 7: URL Validation
**Steps:**
1. Try to add bookmark with:
   - Empty title
   - Empty URL
   - Invalid URL format

**Expected Result:**
- ✓ Shows error message for empty fields
- ✓ Shows validation errors
- ✓ Form cannot be submitted with invalid data

---

### Test 8: Responsive Design
**Steps:**
1. Open app on desktop (1920px+)
2. Resize to tablet (768px)
3. Resize to mobile (375px)

**Expected Result:**
- ✓ Layout adapts to screen size
- ✓ Buttons are clickable on all sizes
- ✓ Text is readable on mobile
- ✓ Bookmarks grid adjusts to screen width

---

### Test 9: Loading States
**Steps:**
1. Sign in
2. Watch for loading indicators while:
   - Signing in
   - Loading bookmarks
   - Adding bookmark
   - Deleting bookmark

**Expected Result:**
- ✓ Loading spinner shows during operations
- ✓ Buttons are disabled while loading
- ✓ Spinner disappears after operation completes

---

### Test 10: Error Handling
**Steps:**
1. Try to access without Supabase credentials configured
2. Try operations with invalid data
3. Check browser console for errors

**Expected Result:**
- ✓ User-friendly error messages shown
- ✓ No crashes or blank screens
- ✓ Console shows detailed error information
- ✓ App remains usable

---

## Performance Testing

### Load Testing
```bash
# Build and start production server
npm run build
npm start

# Use Chrome DevTools Lighthouse to test:
# - Performance
# - Accessibility
# - Best Practices
# - SEO
```

### Real-time Performance
- Add 10+ bookmarks quickly
- Open multiple tabs
- Verify no lag in real-time updates
- Check network requests in DevTools

---

## Browser Compatibility

**Tested and Working:**
- ✓ Chrome/Chromium (latest)
- ✓ Firefox (latest)
- ✓ Safari (latest)
- ✓ Edge (latest)
- ✓ Mobile Safari (iOS)
- ✓ Chrome Mobile (Android)

---

## Production Testing (After Deployment)

### Vercel Deployment Tests
1. Access Vercel URL
2. Sign in with Google
3. Add/delete bookmarks
4. Test real-time sync in multiple tabs
5. Check analytics in Vercel Dashboard

### Supabase Monitoring
1. Check database usage
2. Monitor real-time connections
3. Review logs for errors
4. Check RLS policy violations

---

## Debugging

### Enable Console Logging
The app logs to browser console:
- Auth state changes
- Bookmark operations
- Real-time subscription events
- Errors

View with: `F12` → Console

### Check Network Requests
- Open DevTools → Network tab
- Look for:
  - POST requests to Supabase auth
  - WebSocket connections for real-time
  - Any failed requests

### Environment Variables
- Verify credentials are correct
- Check that URLs are proper HTTPS
- Ensure keys are not typo'd

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Sign in with Google" doesn't work | Check OAuth credentials in Supabase & Google Cloud |
| Real-time not syncing | Enable replication in Supabase for bookmarks table |
| "Supabase is not configured" | Fill in .env.local with credentials |
| Bookmarks don't show | Check RLS policies in Supabase |
| Can't delete bookmark | Check user_id matches in database |

---

## Test Results Template

```
Date: ___________
Tester: ___________
Browser: ___________
Environment: [Local / Vercel]

Test Case | Status | Notes
----------|--------|------
Google OAuth | [ ] Pass [ ] Fail | 
Add Bookmark | [ ] Pass [ ] Fail |
Real-time Sync | [ ] Pass [ ] Fail |
Delete Bookmark | [ ] Pass [ ] Fail |
User Privacy | [ ] Pass [ ] Fail |
Sign Out | [ ] Pass [ ] Fail |
Validation | [ ] Pass [ ] Fail |
Responsive | [ ] Pass [ ] Fail |
Loading States | [ ] Pass [ ] Fail |
Error Handling | [ ] Pass [ ] Fail |

Overall Result: [ ] PASS [ ] FAIL

Issues Found:
_______________________
_______________________
```

---

## Next Steps

After testing:
1. Fix any identified issues
2. Test again with fixes
3. Deploy to production
4. Monitor for errors
5. Get user feedback

Happy testing! 🧪

