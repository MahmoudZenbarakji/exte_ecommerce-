# Vercel Environment Variables Configuration

## Required Environment Variables

Set these in your Vercel dashboard under Project Settings → Environment Variables:

### API Configuration
```
VITE_API_URL=https://your-backend-domain.vercel.app/api
```

### App Configuration
```
VITE_APP_NAME=Exte E-commerce
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=production
```

## How to Set Environment Variables in Vercel:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable with its value
5. Make sure to set them for Production, Preview, and Development environments

## Backend URL Examples:
- Railway: `https://your-app-name.railway.app/api`
- Render: `https://your-app-name.onrender.com/api`
- Vercel: `https://your-backend.vercel.app/api`
- Custom domain: `https://api.yourdomain.com/api`

## Important Notes:
- Replace `your-backend-domain` with your actual backend URL
- Make sure your backend is deployed and accessible
- Test the API URL in your browser before setting it
- The frontend will use these variables at build time



