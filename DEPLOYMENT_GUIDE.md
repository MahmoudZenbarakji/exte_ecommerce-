# 🚀 Vercel Deployment Guide

## Frontend Deployment (React + Vite)

### Step 1: Prepare Frontend for Deployment

1. **Install Vercel CLI** (if not already installed):
```bash
npm i -g vercel
```

2. **Navigate to frontend directory**:
```bash
cd exte_frontend
```

3. **Create environment variables file**:
Create `.env.production` file with:
```env
VITE_API_URL=https://your-backend-url.vercel.app/api
VITE_APP_NAME=EXTE E-commerce
VITE_APP_VERSION=1.0.0
NODE_ENV=production
```

### Step 2: Deploy Frontend to Vercel

1. **Login to Vercel**:
```bash
vercel login
```

2. **Deploy the frontend**:
```bash
vercel --prod
```

3. **Follow the prompts**:
   - Set up and deploy? `Y`
   - Which scope? (Choose your account)
   - Link to existing project? `N`
   - Project name: `exte-frontend`
   - Directory: `./`
   - Override settings? `N`

### Step 3: Backend Deployment (NestJS)

For the backend, you have several options:

#### Option A: Deploy Backend to Vercel (Recommended)

1. **Navigate to backend directory**:
```bash
cd ../backend_exte
```

2. **Create vercel.json for backend**:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/main.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/main.js"
    }
  ]
}
```

3. **Deploy backend**:
```bash
vercel --prod
```

#### Option B: Deploy Backend to Railway/Render

1. **Railway** (Recommended for databases):
   - Connect your GitHub repository
   - Add PostgreSQL database
   - Set environment variables
   - Deploy automatically

2. **Render**:
   - Connect GitHub repository
   - Choose "Web Service"
   - Set build command: `npm run build`
   - Set start command: `npm run start:prod`

### Step 4: Database Setup

#### Option A: Vercel Postgres (Recommended)
1. Go to Vercel Dashboard
2. Create new Postgres database
3. Get connection string
4. Update backend environment variables

#### Option B: Railway Postgres
1. Create new Railway project
2. Add Postgres service
3. Get connection string
4. Update backend environment variables

### Step 5: Environment Variables

#### Frontend Environment Variables (Vercel Dashboard):
```
VITE_API_URL=https://your-backend-url.vercel.app/api
VITE_APP_NAME=EXTE E-commerce
VITE_APP_VERSION=1.0.0
```

#### Backend Environment Variables (Vercel Dashboard):
```
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-jwt-secret
REDIS_URL=redis://username:password@host:port
NODE_ENV=production
PORT=3000
```

### Step 6: Update API URLs

1. **Update frontend API configuration**:
   - Update `src/services/api.js` base URL
   - Update environment variables

2. **Test the deployment**:
   - Check if frontend loads
   - Test API endpoints
   - Verify database connection

### Step 7: Custom Domain (Optional)

1. **Add custom domain in Vercel**:
   - Go to project settings
   - Add domain
   - Configure DNS

2. **Update environment variables**:
   - Update API URLs with new domain

## 🎯 Deployment Checklist

### Frontend Checklist:
- [ ] Vite build works locally
- [ ] Environment variables set
- [ ] Vercel deployment successful
- [ ] API calls working
- [ ] Images loading correctly

### Backend Checklist:
- [ ] NestJS build works locally
- [ ] Database connection working
- [ ] Environment variables set
- [ ] API endpoints responding
- [ ] CORS configured correctly

### Database Checklist:
- [ ] Database created
- [ ] Prisma migrations run
- [ ] Connection string working
- [ ] Data seeding (if needed)

## 🚨 Common Issues & Solutions

### Issue 1: CORS Errors
**Solution**: Update CORS configuration in backend:
```typescript
app.enableCors({
  origin: ['https://your-frontend-domain.vercel.app'],
  credentials: true,
});
```

### Issue 2: Environment Variables Not Loading
**Solution**: 
- Check variable names start with `VITE_` for frontend
- Restart deployment after adding variables
- Use Vercel CLI: `vercel env add`

### Issue 3: Database Connection Issues
**Solution**: 
- Check connection string format
- Verify database is accessible
- Run migrations: `npx prisma migrate deploy`

### Issue 4: Build Failures
**Solution**:
- Check Node.js version compatibility
- Update dependencies
- Check build logs in Vercel dashboard

## 📊 Performance Optimization

### Frontend Optimizations:
- ✅ Code splitting implemented
- ✅ Image optimization enabled
- ✅ Compression configured
- ✅ Caching headers set

### Backend Optimizations:
- ✅ Redis caching implemented
- ✅ Database indexes added
- ✅ Compression enabled
- ✅ Security headers configured

## 🔧 Monitoring & Maintenance

### Vercel Analytics:
1. Enable Vercel Analytics
2. Monitor performance metrics
3. Set up alerts for errors

### Database Monitoring:
1. Monitor connection usage
2. Set up query performance alerts
3. Regular backup schedules

## 📱 Mobile Optimization

The app is already optimized for mobile with:
- ✅ Responsive design
- ✅ Touch-friendly interfaces
- ✅ Fast loading on mobile networks
- ✅ Progressive Web App features

## 🎉 Success!

Once deployed, your e-commerce app will be available at:
- **Frontend**: `https://your-app-name.vercel.app`
- **Backend**: `https://your-backend-name.vercel.app`
- **Admin Dashboard**: `https://your-app-name.vercel.app/dashboard`

Your EXTE e-commerce platform is now live! 🚀
