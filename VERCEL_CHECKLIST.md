# Vercel Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Local Testing
- [ ] `npm run dev` works
- [ ] Google OAuth sign-in works
- [ ] Can add bookmarks
- [ ] Can delete bookmarks
- [ ] Real-time sync works in multiple tabs
- [ ] No errors in console

### 2. Environment Variables
- [ ] `.env.local` has correct values:
  - `NEXT_PUBLIC_SUPABASE_URL=https://qgroqtisexkepqphdxzq.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_b0fFh0XR9p7rBRVDASB2JA_KrnRBDIn`
  - `NEXT_PUBLIC_GOOGLE_CLIENT_ID=589572108135-2oign1b2duhstltnfv0p9bap4nnvdb58.apps.googleusercontent.com`

### 3. Git Repository
- [ ] Code pushed to GitHub
- [ ] Repository is public
- [ ] `.env.local` is in `.gitignore` (DO NOT commit!)

### 4. Supabase Setup
- [ ] Bookmarks table created with RLS policies
- [ ] Real-time replication enabled
- [ ] Google OAuth configured

---

## 🚀 Deployment Steps

### Step 1: Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/smart-bookmark.git
git branch -M main
git push -u origin main
```

**Status**: [ ] Done

### Step 2: Create Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **Add New** → **Project**
4. Select `smart-bookmark` repository
5. Click **Import**

**Status**: [ ] Done

### Step 3: Configure Project

In Vercel:
- Framework: Next.js (auto-selected)
- Build Command: `npm run build`
- Output Directory: `.next`

**Status**: [ ] Done

### Step 4: Add Environment Variables

In Vercel project settings:

```
NEXT_PUBLIC_SUPABASE_URL=https://qgroqtisexkepqphdxzq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_b0fFh0XR9p7rBRVDASB2JA_KrnRBDIn
NEXT_PUBLIC_GOOGLE_CLIENT_ID=589572108135-2oign1b2duhstltnfv0p9bap4nnvdb58.apps.googleusercontent.com
```

**Status**: [ ] Done

### Step 5: Deploy

Click **Deploy** button and wait for completion.

Expected: ✅ Deployment successful
Your Vercel URL: `https://smart-bookmark-xxx.vercel.app`

**Status**: [ ] Done

### Step 6: Update Google OAuth

In [Google Cloud Console](https://console.cloud.google.com/):

1. **Credentials** → Your OAuth app
2. **Authorized redirect URIs** → Add:
   ```
   https://smart-bookmark-xxx.vercel.app/auth/callback
   ```
   (Replace `xxx` with your actual Vercel project name)
3. Save

**Status**: [ ] Done

### Step 7: Update Supabase

In [Supabase Dashboard](https://app.supabase.com/):

1. **Authentication** → **URL Configuration**
2. **Site URL**: `https://smart-bookmark-xxx.vercel.app`
3. **Redirect URLs**: `https://smart-bookmark-xxx.vercel.app/auth/callback`
4. Save

**Status**: [ ] Done

### Step 8: Test Live URL

1. Visit your Vercel URL: `https://smart-bookmark-xxx.vercel.app`
2. Sign in with Google
3. Add a bookmark
4. Delete a bookmark
5. Open in another tab and verify real-time sync

**Status**: [ ] All working!

---

## 🎉 Done!

Your app is now live on Vercel with a working URL!

**Share this URL with reviewers**: `https://smart-bookmark-xxx.vercel.app`

---

## 📝 Your Live URLs

**GitHub Repository**: https://github.com/YOUR_USERNAME/smart-bookmark
**Vercel Live URL**: https://smart-bookmark-xxx.vercel.app
**Supabase Project**: https://app.supabase.com/

---

## 🆘 Troubleshooting

### OAuth Error: redirect_uri_mismatch
- Verify URLs match exactly in Google Console and Supabase
- No trailing slashes
- Use `https://` for production

### Bookmarks not showing
- Check Supabase RLS policies
- Verify user is authenticated
- Check browser console for errors

### Real-time not syncing
- Verify replication enabled in Supabase
- Check browser's Network tab for WebSocket connections
- Try refreshing the page

---

## 📞 Next Steps

1. Follow this checklist step-by-step
2. Share your live Vercel URL
3. Test with your Google account
4. Share GitHub repository link

You're almost there! 🚀

