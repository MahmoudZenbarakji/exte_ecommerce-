# 🔧 Environment Variables for Vercel Deployment

## Required Environment Variables

Set these in your Vercel Dashboard → Settings → Environment Variables:

### **Database Configuration**
```
DATABASE_URL=postgresql://username:password@host:port/database
```
**Options:**
- Vercel Postgres (Recommended)
- Railway Postgres
- Supabase
- Neon

### **JWT Configuration**
```
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
```

### **Frontend Environment Variables**
```
VITE_API_URL=https://your-domain.vercel.app/api
VITE_APP_NAME=EXTE E-commerce
VITE_APP_VERSION=1.0.0
```

### **Backend Configuration**
```
NODE_ENV=production
PORT=3000
```

### **Optional: Redis Configuration**
```
REDIS_URL=redis://username:password@host:port
```
**Options:**
- Upstash Redis (Vercel compatible)
- Railway Redis

### **Optional: Email Configuration**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 🗄️ Database Setup Options

### **Option 1: Vercel Postgres (Recommended)**
1. Go to Vercel Dashboard
2. Create new Postgres database
3. Copy connection string
4. Add to environment variables

### **Option 2: Railway Postgres**
1. Go to [Railway.app](https://railway.app)
2. Create new project
3. Add Postgres service
4. Copy connection string

### **Option 3: Supabase**
1. Go to [Supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings → Database

## 🚀 Deployment Steps

1. **Set Environment Variables** in Vercel Dashboard
2. **Deploy Frontend** from `exte_frontend` folder
3. **Deploy Backend** from `backend_exte` folder
4. **Run Database Migrations**:
   ```bash
   npx prisma migrate deploy
   ```

## 🔍 Verification

After deployment, verify:
- ✅ Frontend loads at `https://your-domain.vercel.app`
- ✅ API endpoints work at `https://your-domain.vercel.app/api`
- ✅ Database connection successful
- ✅ No CORS errors in browser console
