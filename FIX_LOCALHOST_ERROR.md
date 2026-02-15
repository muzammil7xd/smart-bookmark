# 🔧 Fix for "localhost refused to connect" Error

## Problem
After Google OAuth sign-in on mobile, you get: "This site can't be reached - localhost refused to connect"

## Root Cause
The redirect URL configured in Supabase or Google doesn't match your actual Vercel URL.

## Solution - Step by Step

### **Step 1: Get Your Vercel URL**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click your project
3. Copy the live URL (looks like: `https://smart-bookmarks-app-xyz.vercel.app`)

### **Step 2: Update Supabase URL Configuration**
This is the MOST IMPORTANT step!

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **Settings** (bottom of sidebar) → **Configuration** → **API**
4. Find **Site URL** section and set it to your Vercel URL:
   ```
   https://your-vercel-url.vercel.app
   ```
5. In **Redirect URLs**, add:
   ```
   https://your-vercel-url.vercel.app/auth/callback
   ```
6. Click **Save**

### **Step 3: Update Google OAuth**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → **Credentials**
3. Click your OAuth 2.0 Client ID
4. In **Authorized redirect URIs**, make sure you have:
   ```
   https://your-vercel-url.vercel.app/auth/callback
   https://qgroqtisexkepqphdxzq.supabase.co/auth/v1/callback?provider=google
   ```
5. Click **Save**

### **Step 4: Test on Desktop First**
1. Open your Vercel URL on desktop
2. Sign in with Google
3. It should redirect to dashboard

### **Step 5: Test on Mobile**
1. Open your Vercel URL on mobile (same browser)
2. Sign in with Google
3. Should redirect to dashboard without "localhost" error

---

## Checklist

- [ ] I have my Vercel URL: `https://________________.vercel.app`
- [ ] Updated Supabase Site URL to my Vercel URL
- [ ] Added Vercel URL to Supabase Redirect URLs
- [ ] Updated Google OAuth Authorized redirect URIs
- [ ] Tested on desktop - works ✅
- [ ] Tested on mobile - works ✅

---

## If Still Not Working

### Check 1: Verify Supabase URL Configuration
In Supabase Dashboard → Settings → Configuration:
- **Site URL** should be: `https://your-vercel-url.vercel.app`
- **Redirect URLs** should include: `https://your-vercel-url.vercel.app/auth/callback`

### Check 2: Verify Google OAuth Redirect URIs
In Google Cloud Console → Credentials → Your OAuth app:
- Should have: `https://your-vercel-url.vercel.app/auth/callback`

### Check 3: Clear Browser Cache
On mobile:
1. Clear browser cache/cookies
2. Restart browser
3. Try signing in again

### Check 4: Check Browser Console
On desktop:
1. Press F12 to open Developer Tools
2. Go to **Console** tab
3. Look for any error messages
4. Share the errors with details

---

## Important Notes

⚠️ **Never use `localhost` on production URLs**
- Vercel URL must be `https://` (not `http://`)
- No trailing slashes in URLs
- URLs must be exact match in all 3 places:
  1. Supabase Site URL
  2. Supabase Redirect URLs
  3. Google OAuth Authorized redirect URIs

✅ **Expected Flow**
1. User clicks "Sign in with Google"
2. Redirected to Google login
3. After auth, redirected to `https://your-vercel-url/auth/callback`
4. App processes the callback
5. User redirected to `/dashboard`

---

## Your Vercel URL

Write down your Vercel URL here for reference:
```
https://_____________________.vercel.app
```

---

## Contact Info for Debugging

When asking for help, provide:
- Your Vercel URL
- Error message from browser console
- Screenshot of Supabase Site URL settings
- Screenshot of Google OAuth Redirect URIs


