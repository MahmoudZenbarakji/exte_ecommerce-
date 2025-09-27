# Frontend Environment Variables Setup

## 🔧 **Environment Variables Configuration**

### **Required Environment Variables**

Set these in your deployment platform (Vercel, Netlify, etc.) or create `.env.local` for local development:

#### **API Configuration**
```bash
# Production (Railway backend)
VITE_API_URL=https://your-backend.up.railway.app/api

# Development (local backend)
VITE_API_URL=http://localhost:3000/api

# Alternative backends
VITE_API_URL=https://your-backend.herokuapp.com/api
VITE_API_URL=https://your-backend.onrender.com/api
VITE_API_URL=https://api.yourdomain.com/api
```

#### **App Configuration**
```bash
VITE_APP_NAME=Exte E-commerce
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=production
```

#### **Optional Debug Configuration**
```bash
VITE_DEBUG=false
VITE_LOG_LEVEL=info
```

## 🚀 **How to Set Environment Variables**

### **For Vercel Deployment:**

1. **Go to Vercel Dashboard**
   - Select your project
   - Go to Settings → Environment Variables

2. **Add Variables:**
   ```
   VITE_API_URL = https://your-backend.up.railway.app/api
   VITE_APP_NAME = Exte E-commerce
   VITE_NODE_ENV = production
   ```

3. **Redeploy** your application

### **For Local Development:**

1. **Create `.env.local` file:**
   ```bash
   # exte_frontend/.env.local
   VITE_API_URL=http://localhost:3000/api
   VITE_APP_NAME=Exte E-commerce (Dev)
   VITE_NODE_ENV=development
   VITE_DEBUG=true
   ```

2. **Restart your development server:**
   ```bash
   npm run dev
   ```

## 🔍 **Backend URL Examples**

### **Railway (Recommended)**
```
https://your-app-name.up.railway.app/api
```

### **Render**
```
https://your-app-name.onrender.com/api
```

### **Heroku**
```
https://your-app-name.herokuapp.com/api
```

### **Custom Domain**
```
https://api.yourdomain.com/api
```

## 🧪 **Testing Your Configuration**

### **1. Check Environment Variables**
Open browser console and look for:
```
🌐 API Configuration: {
  baseURL: "https://your-backend.up.railway.app/api",
  environment: "production",
  apiUrl: "https://your-backend.up.railway.app/api"
}
```

### **2. Test API Connection**
- Open Network tab in browser dev tools
- Make an API call (login, fetch products, etc.)
- Verify requests go to correct backend URL

### **3. Common Issues & Solutions**

#### **Issue: API calls still go to localhost**
- **Solution**: Check if `.env.local` exists and has correct values
- **Solution**: Restart development server
- **Solution**: Clear browser cache

#### **Issue: CORS errors**
- **Solution**: Update backend CORS configuration
- **Solution**: Check backend is running and accessible

#### **Issue: Environment variables not loading**
- **Solution**: Ensure variables start with `VITE_`
- **Solution**: Check for typos in variable names
- **Solution**: Redeploy application

## 📝 **Environment File Priority**

Vite loads environment variables in this order:
1. `.env.local` (highest priority)
2. `.env.development` / `.env.production`
3. `.env`

## 🔒 **Security Notes**

- **Never commit `.env.local`** to version control
- **Use strong, unique values** for production
- **Rotate secrets regularly**
- **Use different values** for development and production

## ✅ **Quick Setup Checklist**

- [ ] Backend deployed and accessible
- [ ] Environment variables set in deployment platform
- [ ] `.env.local` created for local development
- [ ] API calls working in browser dev tools
- [ ] No CORS errors
- [ ] Application deployed successfully

Your frontend is now configured to use environment-based API URLs! 🎉



