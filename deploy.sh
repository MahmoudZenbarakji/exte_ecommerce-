#!/bin/bash

# 🚀 EXTE E-commerce Deployment Script
echo "🚀 Starting EXTE E-commerce deployment to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Deploy Frontend
echo "📦 Deploying Frontend..."
cd exte_frontend

# Check if .env.production exists, if not create it
if [ ! -f .env.production ]; then
    echo "📝 Creating production environment file..."
    cat > .env.production << EOF
VITE_API_URL=https://your-backend-url.vercel.app/api
VITE_APP_NAME=EXTE E-commerce
VITE_APP_VERSION=1.0.0
NODE_ENV=production
EOF
    echo "⚠️  Please update .env.production with your actual backend URL"
fi

# Build and deploy
echo "🔨 Building frontend..."
npm run build

echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Frontend deployment complete!"
echo "📝 Next steps:"
echo "1. Update your backend URL in Vercel environment variables"
echo "2. Deploy your backend (see DEPLOYMENT_GUIDE.md)"
echo "3. Set up your database"
echo "4. Run database migrations"

echo "🎉 Deployment process initiated!"
