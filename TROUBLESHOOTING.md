# 🔧 Vercel Deployment Troubleshooting

## 🚨 White Screen Issue - Common Causes & Solutions

### **Issue 1: Environment Variables Missing**

**Problem**: App loads but shows white screen because API calls fail.

**Solution**:
1. **Set Environment Variables in Vercel Dashboard**:
   ```
   VITE_API_URL=https://your-backend-url.vercel.app/api
   VITE_APP_NAME=EXTE E-commerce
   VITE_APP_VERSION=1.0.0
   ```

2. **Or create `.env.production` file**:
   ```bash
   cd exte_frontend
   echo "VITE_API_URL=https://your-backend-url.vercel.app/api" > .env.production
   ```

### **Issue 2: Build Failures**

**Problem**: Build fails during deployment.

**Solution**:
```bash
# Test build locally first
cd exte_frontend
npm run build

# If successful, redeploy
vercel --prod
```

### **Issue 3: Routing Issues**

**Problem**: App loads but navigation doesn't work.

**Solution**: Use the simplified `vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### **Issue 4: API Connection Issues**

**Problem**: Frontend can't connect to backend.

**Solutions**:

1. **Check Backend URL**:
   - Make sure backend is deployed
   - Verify the URL is correct
   - Test backend endpoints directly

2. **Check CORS Configuration**:
   ```typescript
   // In your backend main.ts
   app.enableCors({
     origin: ['https://your-frontend-domain.vercel.app'],
     credentials: true,
   });
   ```

### **Issue 5: Console Errors**

**Problem**: JavaScript errors in browser console.

**Debug Steps**:
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Check if all assets are loading

## 🛠️ Step-by-Step Fix

### **Step 1: Check Build Locally**
```bash
cd exte_frontend
npm run build
npm run preview
```

### **Step 2: Fix Environment Variables**
```bash
# Create production environment file
cat > .env.production << EOF
VITE_API_URL=https://your-backend-url.vercel.app/api
VITE_APP_NAME=EXTE E-commerce
VITE_APP_VERSION=1.0.0
NODE_ENV=production
EOF
```

### **Step 3: Redeploy**
```bash
# Deploy to Vercel
vercel --prod

# Or use the fix script
./fix-deployment.sh
```

### **Step 4: Set Vercel Environment Variables**
1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add:
   - `VITE_API_URL` = `https://your-backend-url.vercel.app/api`
   - `VITE_APP_NAME` = `EXTE E-commerce`
   - `VITE_APP_VERSION` = `1.0.0`

### **Step 5: Redeploy After Setting Variables**
```bash
vercel --prod
```

## 🔍 Debugging Checklist

### **Frontend Issues**:
- [ ] Build succeeds locally (`npm run build`)
- [ ] Preview works locally (`npm run preview`)
- [ ] Environment variables are set
- [ ] No console errors
- [ ] All assets load correctly

### **Backend Issues**:
- [ ] Backend is deployed and accessible
- [ ] API endpoints respond correctly
- [ ] CORS is configured properly
- [ ] Database connection works

### **Network Issues**:
- [ ] Check browser Network tab
- [ ] Verify API calls are reaching backend
- [ ] Check for CORS errors
- [ ] Verify SSL certificates

## 🚀 Quick Fix Commands

### **Complete Reset and Redeploy**:
```bash
# 1. Fix environment variables
cd exte_frontend
echo "VITE_API_URL=https://your-backend-url.vercel.app/api" > .env.production

# 2. Build and test locally
npm run build
npm run preview

# 3. Deploy to Vercel
vercel --prod

# 4. Set environment variables in Vercel dashboard
# 5. Redeploy
vercel --prod
```

### **Check Deployment Status**:
```bash
# Check Vercel deployment logs
vercel logs

# Check specific deployment
vercel logs [deployment-url]
```

## 📱 Common Error Messages

### **"Failed to fetch"**
- Backend not deployed or wrong URL
- CORS issues
- Network connectivity

### **"Module not found"**
- Build configuration issue
- Missing dependencies
- Import path problems

### **"White screen"**
- JavaScript errors
- Missing environment variables
- Routing issues

## 🎯 Success Indicators

Your deployment is working when:
- ✅ App loads without white screen
- ✅ Navigation works
- ✅ API calls succeed
- ✅ No console errors
- ✅ All features function correctly

## 🆘 Still Having Issues?

1. **Check Vercel Build Logs**:
   - Go to Vercel Dashboard
   - Click on your deployment
   - Check "Functions" and "Build Logs"

2. **Test Backend Separately**:
   - Visit your backend URL directly
   - Test API endpoints
   - Verify database connection

3. **Compare with Local**:
   - Does it work locally?
   - What's different in production?

4. **Check Browser Console**:
   - Any JavaScript errors?
   - Network request failures?
   - Missing assets?

## 📞 Need More Help?

1. Check the full [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
2. Review Vercel documentation
3. Check your specific error messages
4. Test each component separately
