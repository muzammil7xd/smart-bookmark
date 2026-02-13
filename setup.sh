#!/bin/bash

# Smart Bookmarks - Local Development Setup Script

echo "🚀 Smart Bookmarks - Setup Script"
echo "=================================="
echo ""

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "✓ .env.local already exists"
else
    echo "📝 Creating .env.local from template..."
    cp .env.local.example .env.local
    echo "✓ Created .env.local"
    echo ""
    echo "⚠️  Please edit .env.local and add your Supabase credentials:"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo ""
    echo "See SETUP.md for instructions on how to get these values."
fi

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo "✓ Dependencies already installed"
else
    echo "📦 Installing dependencies..."
    npm install
    echo "✓ Dependencies installed"
fi

echo ""
echo "✓ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your Supabase credentials"
echo "2. Run: npm run dev"
echo "3. Open http://localhost:3000"
echo ""
echo "For more info, see:"
echo "- QUICK_START.md - 5-minute setup guide"
echo "- SETUP.md - Environment variables"
echo "- DEPLOYMENT.md - Deploy to Vercel"

