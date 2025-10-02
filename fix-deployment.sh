#!/bin/bash

echo "🔧 Fixing Vercel deployment..."

# Navigate to frontend directory
cd exte_frontend

# Create environment file for production
echo "📝 Creating environment configuration..."
cat > .env.production << EOF
VITE_API_URL=https://your-backend-url.vercel.app/api
VITE_APP_NAME=EXTE E-commerce
VITE_APP_VERSION=1.0.0
NODE_ENV=production
EOF

echo "⚠️  IMPORTANT: Update .env.production with your actual backend URL!"

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "🚀 Ready to deploy to Vercel"
    echo ""
    echo "Next steps:"
    echo "1. Update .env.production with your backend URL"
    echo "2. Run: vercel --prod"
    echo "3. Set environment variables in Vercel dashboard"
else
    echo "❌ Build failed! Check the errors above."
fi
