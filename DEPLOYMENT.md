# Deployment Guide

## Prerequisites

- GitHub account
- Vercel account (linked to GitHub)
- Supabase account
- Google Cloud Project for OAuth

## Step 1: Set Up Supabase Project

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose your organization and enter a project name
4. Set a strong database password
5. Choose a region close to your users
6. Click "Create new project" and wait for it to initialize

### 1.2 Get Your API Keys

1. Once the project is ready, go to **Settings → API**
2. Copy the following:
   - `Project URL` (NEXT_PUBLIC_SUPABASE_URL)
   - `anon public` key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
3. Save these securely - you'll need them for environment variables

### 1.3 Create Database Tables

1. Go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the following SQL:

```sql
-- Create bookmarks table
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_created_at ON bookmarks(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies - users can only see their own bookmarks
CREATE POLICY "Users can view their own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookmarks"
  ON bookmarks FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

4. Click **Run**
5. Verify the table is created by going to **Database → Tables** and checking for "bookmarks"

### 1.4 Enable Real-time

1. Go to **Database → Replication**
2. Find the "bookmarks" table
3. Toggle the switch to enable replication
4. Ensure all operations (INSERT, UPDATE, DELETE) are selected

## Step 2: Set Up Google OAuth

### 2.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Go to **APIs & Services → OAuth consent screen**
4. Choose "External" and click "Create"
5. Fill in the app information:
   - App name: "Smart Bookmarks"
   - User support email: your email
   - Developer contact: your email
6. Click "Save and Continue"
7. On Scopes page, click "Save and Continue" (optional scopes)
8. Add test users (optional) and click "Save and Continue"
9. Go back to **OAuth consent screen** and note your Client ID (you may need it later)

### 2.2 Create OAuth 2.0 Credentials

1. Go to **APIs & Services → Credentials**
2. Click **Create Credentials → OAuth 2.0 Client IDs**
3. Choose "Web application"
4. Name it "Smart Bookmarks Web"
5. Under "Authorized JavaScript origins", add:
   - `http://localhost:3000` (for local development)
6. Under "Authorized redirect URIs", add:
   - `http://localhost:3000/auth/callback`
   - `https://<your-vercel-domain>.vercel.app/auth/callback`
   
   *(You can update this later with your actual Vercel domain)*

7. Click "Create"
8. Copy your **Client ID** and **Client Secret** - you'll need them for Supabase

### 2.3 Configure Google OAuth in Supabase

1. Go to your Supabase project
2. **Authentication → Providers → Google**
3. Enable Google provider
4. Paste your Google OAuth credentials:
   - Client ID
   - Client Secret
5. Click "Save"

## Step 3: Deploy to Vercel

### 3.1 Prepare for Deployment

1. Push your code to GitHub if you haven't already
2. Make sure you have a GitHub account connected to Vercel

### 3.2 Create Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New → Project**
3. Import your GitHub repository
4. Configure the project:
   - Framework: Next.js (should be auto-detected)
   - Root Directory: ./smart-bookmark
5. Click **Environment Variables**
6. Add your environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
7. Click **Deploy**

### 3.3 Get Your Vercel Domain

1. Once deployed, you'll see your live URL (something like `https://smart-bookmark-xyz.vercel.app`)
2. Copy this URL

### 3.4 Update OAuth Redirect URI

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services → Credentials**
3. Click on your OAuth 2.0 Client ID
4. Add your Vercel URL to "Authorized redirect URIs":
   - `https://your-vercel-domain.vercel.app/auth/callback`
5. Click "Save"

## Step 4: Testing

1. Go to your Vercel URL
2. Click "Sign in with Google"
3. Authorize with your Google account
4. Add a bookmark
5. Open the URL in another tab or incognito window
6. Verify real-time sync - bookmarks should appear instantly
7. Test delete functionality

## Troubleshooting

### "Supabase is not configured" error
- Ensure your environment variables are set correctly in Vercel
- Check that `NEXT_PUBLIC_` prefix is included (these are public)
- Redeploy after updating environment variables

### OAuth redirect not working
- Ensure your redirect URI in Google Cloud Console matches exactly with your Vercel URL
- Check that the redirect URI ends with `/auth/callback`
- Clear browser cache and try again

### Real-time not working
- Verify that replication is enabled for the bookmarks table in Supabase
- Check that Row Level Security (RLS) policies are correctly configured
- Check browser console for any errors

### "Invalid supabaseUrl" during build
- This should be fixed now, but if you see this, check that your environment variables are properly set

## Monitoring

1. Monitor your Supabase database usage in **Settings → Billing**
2. Check Vercel deployment logs in your project dashboard
3. Monitor real-time connections in Supabase **Logs → Edge Functions**

## Additional Configuration

### Custom Domain
To use a custom domain instead of `vercel.app`:

1. Go to your Vercel project settings
2. **Domains**
3. Add your domain
4. Follow the DNS configuration instructions
5. Update your Google OAuth redirect URI to include your custom domain

### Database Backups
Supabase automatically creates backups. To manage backups:

1. Go to **Settings → Backups**
2. You can restore from any previous backup if needed

## Security Notes

- Never commit your `.env.local` file to Git
- Always use `NEXT_PUBLIC_` prefix only for public values
- Supabase RLS policies ensure users can only access their own bookmarks
- Google OAuth ensures secure authentication

## Support

For issues:
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- Vercel Docs: https://vercel.com/docs

