# Smart Bookmarks App

A real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS.

## Features

- 🔐 **Google OAuth Authentication** - Sign in with your Google account
- 📌 **Save Bookmarks** - Add URL and title for your favorite links
- 🔄 **Real-time Sync** - Bookmarks update instantly across tabs without page refresh
- 🔒 **Private Bookmarks** - Each user's bookmarks are private to their account
- 🗑️ **Delete Bookmarks** - Remove bookmarks you no longer need
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your **Project URL** and **Anon Key** from the API settings

### 2. Set Up Database Tables

In your Supabase project, go to SQL Editor and run:

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

### 3. Enable Real-time for Bookmarks Table

1. In Supabase, go to Database → Replication
2. Enable replication for the `bookmarks` table
3. Select all operations (INSERT, UPDATE, DELETE)

### 4. Set Up Google OAuth

1. Go to Google Cloud Console
2. Create a new OAuth 2.0 Application
3. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback` (for local development)
   - `https://your-vercel-app.vercel.app/auth/callback` (for production)

4. In Supabase, go to Authentication → Providers → Google
5. Enable Google OAuth and add your Client ID and Client Secret

### 5. Environment Setup

1. Clone the repository
2. Copy `.env.local.example` to `.env.local`
3. Add your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 6. Install Dependencies and Run

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:3000`

## Deployment on Vercel

### Prerequisites
- GitHub repository with your code pushed
- Vercel account connected to GitHub

### Steps

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project" and select your GitHub repository
3. In the Environment Variables section, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click "Deploy"
5. Once deployed, go to your Vercel project settings and update the redirect URI in Google OAuth and Supabase to your new Vercel URL

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with AuthProvider
│   ├── page.tsx                # Landing/login page
│   ├── dashboard/
│   │   └── page.tsx            # Main dashboard
│   └── auth/
│       └── callback/
│           └── page.tsx        # OAuth callback handler
├── components/
│   ├── AddBookmarkForm.tsx     # Form to add new bookmarks
│   └── BookmarkItem.tsx        # Individual bookmark card
├── contexts/
│   └── auth.tsx                # Auth context and useAuth hook
├── hooks/
│   └── useBookmarks.ts         # Hook for bookmark management with real-time
└── lib/
    └── supabase.ts             # Supabase client initialization
```

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Supabase** - Backend, Auth, Database, and Real-time
- **Tailwind CSS** - Styling
- **React Context API** - State management for auth

## Real-time Sync Implementation

The app uses Supabase's real-time subscriptions to automatically update bookmarks when:
- A bookmark is added in another tab
- A bookmark is deleted
- A bookmark is updated

This is handled by the `useBookmarks` hook which subscribes to database changes for the current user's bookmarks.

## Privacy & Security

- All bookmarks are protected by Supabase Row Level Security (RLS)
- Users can only view/edit/delete their own bookmarks
- Google OAuth ensures secure authentication
- No sensitive data is stored in the browser

## License

MIT

