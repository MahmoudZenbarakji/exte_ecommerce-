# 🚀 Full-Stack Vercel Deployment Guide

## 📋 Overview

This guide will help you deploy your EXTE e-commerce platform (React + NestJS) to Vercel as a full-stack application.

## 🏗️ Architecture

- **Frontend**: React with Vite (Static Site)
- **Backend**: NestJS (Serverless Functions)
- **Database**: PostgreSQL (Vercel Postgres/Railway/Supabase)
- **Caching**: Redis (Upstash/Redis Cloud)

## 🚀 Quick Deployment

### **Option 1: One-Command Deployment**
```bash
# Run the automated deployment script
./deploy-fullstack.sh
```

### **Option 2: Manual Deployment**
```bash
# 1. Install dependencies
npm run install:all

# 2. Build both frontend and backend
npm run build

# 3. Deploy to Vercel
vercel --prod
```

## 🔧 Step-by-Step Setup

### **Step 1: Prerequisites**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login
```

### **Step 2: Environment Variables**

Set these in Vercel Dashboard → Settings → Environment Variables:

#### **Required Variables:**
```
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key
VITE_API_URL=https://your-domain.vercel.app/api
NODE_ENV=production
```

#### **Optional Variables:**
```
REDIS_URL=redis://username:password@host:port
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### **Step 3: Database Setup**

#### **Option A: Vercel Postgres (Recommended)**
1. Go to Vercel Dashboard
2. Create new Postgres database
3. Copy connection string
4. Add to environment variables

#### **Option B: Railway Postgres**
1. Go to [Railway.app](https://railway.app)
2. Create new project
3. Add Postgres service
4. Copy connection string

#### **Option C: Supabase**
1. Go to [Supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings → Database

### **Step 4: Deploy Application**

#### **Deploy from Root Directory:**
```bash
# This will deploy both frontend and backend
vercel --prod
```

#### **Or Deploy Separately:**
```bash
# Deploy frontend only
cd exte_frontend
vercel --prod

# Deploy backend only
cd ../backend_exte
vercel --prod
```

### **Step 5: Run Database Migrations**
```bash
# Connect to your deployed backend
npx prisma migrate deploy
```

## 📁 Project Structure

```
exte-fullstack-ecommerce/
├── exte_frontend/          # React frontend
│   ├── src/
│   ├── dist/              # Built frontend
│   ├── vercel.json        # Frontend Vercel config
│   └── package.json
├── backend_exte/          # NestJS backend
│   ├── src/
│   ├── dist/              # Built backend
│   ├── api/               # Serverless functions
│   ├── vercel.json        # Backend Vercel config
│   └── package.json
├── vercel.json            # Root Vercel config
├── package.json           # Root package.json
└── deploy-fullstack.sh    # Deployment script
```

## 🔄 Build Process

### **Frontend Build:**
- Framework: Vite
- Output: `exte_frontend/dist/`
- Commands: `npm run build`

### **Backend Build:**
- Framework: NestJS
- Output: `backend_exte/dist/`
- Commands: `npm run build`

### **Serverless Functions:**
- Entry: `backend_exte/api/index.js`
- Runtime: Node.js
- Routes: `/api/*`

## 🌐 Routing Configuration

### **Frontend Routes:**
- `/` → Home page
- `/products` → Product listing
- `/dashboard` → Admin dashboard
- All other routes → React Router

### **Backend Routes:**
- `/api/*` → NestJS serverless functions
- `/api/docs` → Swagger documentation

## 🔒 Security Configuration

### **CORS Settings:**
- Frontend domains: `*.vercel.app`
- Methods: `GET, POST, PUT, DELETE, OPTIONS`
- Credentials: `true`

### **Security Headers:**
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- HSTS

## 📊 Performance Optimizations

### **Frontend:**
- ✅ Code splitting with React.lazy
- ✅ Image optimization
- ✅ Static asset caching
- ✅ Gzip compression

### **Backend:**
- ✅ Serverless functions (auto-scaling)
- ✅ Redis caching
- ✅ Database indexing
- ✅ Request validation

## 🔍 Verification Checklist

After deployment, verify:

### **Frontend:**
- [ ] App loads at `https://your-domain.vercel.app`
- [ ] Navigation works correctly
- [ ] Images load properly
- [ ] No console errors

### **Backend:**
- [ ] API endpoints respond at `https://your-domain.vercel.app/api`
- [ ] Database connection works
- [ ] Authentication works
- [ ] CORS configured correctly

### **Integration:**
- [ ] Frontend can call backend APIs
- [ ] No CORS errors in browser
- [ ] Admin dashboard accessible
- [ ] All features work end-to-end

## 🚨 Troubleshooting

### **Common Issues:**

#### **White Screen:**
- Check environment variables
- Verify API URL configuration
- Check browser console for errors

#### **API Connection Issues:**
- Verify backend deployment
- Check CORS configuration
- Test API endpoints directly

#### **Database Issues:**
- Verify DATABASE_URL
- Check database accessibility
- Run migrations: `npx prisma migrate deploy`

#### **Build Failures:**
- Check Node.js version compatibility
- Verify all dependencies installed
- Review build logs in Vercel dashboard

## 📈 Monitoring

### **Vercel Analytics:**
- Enable in Vercel Dashboard
- Monitor performance metrics
- Track user behavior

### **Error Tracking:**
- Check Vercel function logs
- Monitor API response times
- Set up alerts for failures

## 🎯 Success!

Your EXTE e-commerce platform is now live at:
- **Frontend**: `https://your-domain.vercel.app`
- **API**: `https://your-domain.vercel.app/api`
- **Admin**: `https://your-domain.vercel.app/dashboard`
- **Docs**: `https://your-domain.vercel.app/api/docs`

## 🆘 Need Help?

1. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Review Vercel deployment logs
3. Test each component separately
4. Verify environment variables

Your full-stack e-commerce platform is ready for production! 🚀
