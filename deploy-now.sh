#!/bin/bash

echo "🚀 DEPLOYING YOUR EXTE E-COMMERCE WEBSITE TO VERCEL..."
echo ""

# Check if we're in the right directory
if [ ! -f "vercel.json" ]; then
    echo "❌ Error: Please run this from the project root directory"
    exit 1
fi

# Check if Vercel CLI is available
if ! command -v npx &> /dev/null; then
    echo "❌ Error: npx not found. Please install Node.js"
    exit 1
fi

echo "📦 Step 1: Building frontend..."
cd exte_frontend
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed!"
    exit 1
fi
echo "✅ Frontend built successfully!"

echo ""
echo "📦 Step 2: Building backend..."
cd ../backend_exte
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Backend build failed!"
    exit 1
fi
echo "✅ Backend built successfully!"

echo ""
echo "🚀 Step 3: Deploying to Vercel..."
cd ..

# Try to deploy
echo "Attempting deployment..."
npx vercel --prod --yes

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! Your website is now live!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Go to Vercel Dashboard"
    echo "2. Set environment variables:"
    echo "   - DATABASE_URL"
    echo "   - JWT_SECRET"
    echo "   - VITE_API_URL"
    echo "3. Set up your database"
    echo "4. Run: npx prisma migrate deploy"
    echo ""
    echo "🌐 Your website will be available at:"
    echo "   https://your-domain.vercel.app"
else
    echo ""
    echo "⚠️  Deployment needs manual authentication"
    echo ""
    echo "Please run these commands manually:"
    echo "1. npx vercel login"
    echo "2. npx vercel --prod"
    echo ""
    echo "Follow the browser authentication process"
fi
