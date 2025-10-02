# 🚀 Vercel Deployment Guide (Free)

## **Deploy Your Backend to Vercel for FREE!**

### **Step 1: Prepare Your Backend**

1. **Build your backend**:
   ```bash
   cd backend_exte
   npm run build
   ```

2. **Test locally**:
   ```bash
   npm run start:prod
   ```

### **Step 2: Deploy to Vercel**

#### **Option A: Using Vercel CLI (Recommended)**

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from your backend directory**:
   ```bash
   cd backend_exte
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy? **Yes**
   - Which scope? **Your account**
   - Link to existing project? **No**
   - Project name: **exte-backend**
   - Directory: **./** (current directory)
   - Override settings? **No**

#### **Option B: Using Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Select the `backend_exte` folder
6. Configure settings:
   - **Framework Preset**: Other
   - **Root Directory**: `backend_exte`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### **Step 3: Environment Variables**

Add these environment variables in Vercel dashboard:

```
NODE_ENV=production
REDIS_ENABLED=false
DATABASE_URL=your_database_url_here
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-frontend.vercel.app
```

### **Step 4: Database Setup**

For a free database, you can use:

1. **Neon (Free PostgreSQL)**:
   - Go to [neon.tech](https://neon.tech)
   - Sign up for free
   - Create a new project
   - Copy the connection string
   - Add as `DATABASE_URL` in Vercel

2. **Supabase (Free PostgreSQL)**:
   - Go to [supabase.com](https://supabase.com)
   - Sign up for free
   - Create a new project
   - Copy the connection string
   - Add as `DATABASE_URL` in Vercel

### **Step 5: Deploy Frontend**

1. **Deploy frontend to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your frontend repository
   - Select the `exte_frontend` folder
   - Configure settings:
     - **Framework Preset**: Vite
     - **Root Directory**: `exte_frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`

2. **Set environment variables**:
   ```
   VITE_API_URL=https://your-backend.vercel.app/api
   VITE_APP_NAME=Exte E-commerce
   VITE_NODE_ENV=production
   ```

### **Step 6: Connect Frontend and Backend**

1. **Get your backend URL** from Vercel dashboard
2. **Update frontend environment variables** with your backend URL
3. **Redeploy frontend** if needed

## **🎉 You're Done!**

- ✅ **Backend**: `https://your-backend.vercel.app`
- ✅ **Frontend**: `https://your-frontend.vercel.app`
- ✅ **Database**: Free PostgreSQL
- ✅ **Total Cost**: $0 (Free!)

## **Troubleshooting**

### **Common Issues:**

1. **Build fails**: Check your `package.json` scripts
2. **Database connection**: Verify `DATABASE_URL` is correct
3. **CORS errors**: Update `CORS_ORIGIN` in backend
4. **Environment variables**: Make sure all are set in Vercel dashboard

### **Need Help?**

- Check Vercel logs in dashboard
- Test API endpoints with Postman
- Verify environment variables
- Check database connection

## **Free Alternatives to Railway:**

1. **Vercel** (Free) - ✅ Recommended
2. **Render** (Free tier)
3. **Fly.io** (Free tier)
4. **Heroku** (Free tier - limited)
5. **Netlify Functions** (Free tier)

**Vercel is the best choice for your NestJS backend!**








