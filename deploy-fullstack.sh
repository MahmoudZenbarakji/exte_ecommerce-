#!/bin/bash

echo "🚀 Deploying EXTE Full-Stack E-commerce to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
echo "🔐 Checking Vercel authentication..."
vercel whoami > /dev/null 2>&1 || vercel login

# Deploy from root directory (handles both frontend and backend)
echo "📦 Deploying full-stack application..."
cd /Users/mahmoudalzenbarakji/Desktop/Exte

# Build backend first
echo "🔨 Building backend..."
cd backend_exte
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Backend build failed!"
    exit 1
fi

# Go back to root
cd ..

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Set environment variables in Vercel Dashboard"
    echo "2. Set up your database (Vercel Postgres recommended)"
    echo "3. Run database migrations: npx prisma migrate deploy"
    echo "4. Test your deployed application"
    echo ""
    echo "🔗 Your app will be available at:"
    echo "   Frontend: https://your-domain.vercel.app"
    echo "   API: https://your-domain.vercel.app/api"
    echo "   Admin: https://your-domain.vercel.app/dashboard"
else
    echo "❌ Deployment failed! Check the errors above."
fi
