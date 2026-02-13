# Quick Start Guide

## 5-Minute Setup

### For Local Development

1. **Clone and Install**
   ```bash
   cd smart-bookmark
   npm install
   ```

2. **Set Up Environment Variables**
   - Copy `.env.local.example` to `.env.local`
   - You need:
     - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
   
   See `SETUP.md` for how to get these values.

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

4. **Sign In**
   - Click "Sign in with Google"
   - Authorize your Google account
   - You're ready to use the app!

### For Production (Vercel Deployment)

See `DEPLOYMENT.md` for step-by-step instructions to:
1. Create a Supabase project
2. Set up Google OAuth
3. Deploy to Vercel
4. Configure real-time updates

## Features

✅ **Google OAuth** - Sign in with your Google account (no password needed)
✅ **Add Bookmarks** - Save URLs with titles
✅ **Real-time Sync** - Changes appear instantly across all tabs
✅ **Private Bookmarks** - Only you can see your bookmarks
✅ **Delete Bookmarks** - Remove bookmarks you no longer need
✅ **Responsive Design** - Works on desktop and mobile

## Testing Real-Time Sync

1. Open the app in two browser tabs (same account)
2. Add a bookmark in Tab 1
3. Watch it appear instantly in Tab 2 without refreshing
4. Delete a bookmark in Tab 2
5. Watch it disappear instantly in Tab 1

## Project Structure

```
smart-bookmark/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Landing/login page
│   │   ├── layout.tsx         # Root layout with auth
│   │   ├── auth/callback/page.tsx  # OAuth callback handler
│   │   └── dashboard/page.tsx  # Main dashboard
│   ├── components/
│   │   ├── AddBookmarkForm.tsx    # Add bookmark form
│   │   └── BookmarkItem.tsx       # Bookmark card
│   ├── contexts/
│   │   └── auth.tsx              # Auth state management
│   ├── hooks/
│   │   └── useBookmarks.ts       # Bookmark management with real-time
│   └── lib/
│       └── supabase.ts          # Supabase client
├── DEPLOYMENT.md               # Deployment guide
├── SETUP.md                    # Local setup guide
└── README.md                   # Full documentation
```

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Supabase** - Backend, Auth, Database, Real-time
- **Tailwind CSS** - Styling
- **React Context API** - State management

## Common Issues

**"Sign in with Google" button doesn't work**
- Make sure you've configured Google OAuth in Supabase
- Check that your redirect URI is correct

**Bookmarks don't update in real-time**
- Verify replication is enabled in Supabase for the bookmarks table
- Check browser console for errors
- Refresh the page

**"Supabase is not configured" error**
- Make sure your `.env.local` file has the correct credentials
- Restart the dev server after updating `.env.local`

## Next Steps

1. Read `README.md` for full documentation
2. Check `DEPLOYMENT.md` to deploy to Vercel
3. Set up Google OAuth and Supabase as described
4. Customize the design with Tailwind CSS
5. Add more features as needed

## Getting Help

- **Supabase Issues**: https://supabase.com/docs
- **Next.js Issues**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Google OAuth**: https://developers.google.com/identity/protocols/oauth2

## Live Example

Check the `DEPLOYMENT.md` file for the live Vercel URL once deployed.

---

Happy bookmarking! 🚀

