# 🚀 RefNet Deployment Guide: Supabase + Vercel

## Quick Overview
- **Database**: Supabase (PostgreSQL managed)
- **Backend**: Vercel (Node.js/Express on Serverless Functions)
- **Frontend**: Vercel (React/Vite Static)
- **File Storage**: Cloudinary (Images & Resumes)

---

## 📋 Prerequisites

1. **GitHub Account** - for connecting to Vercel
2. **Supabase Account** - for PostgreSQL database
3. **Vercel Account** - for deploying frontend & backend
4. **Cloudinary Account** - for file uploads
5. **Google Cloud Console** - for OAuth credentials

---

## 🗄️ Step 1: Set Up Supabase Database

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click **"New Project"**
3. Choose organization and enter project details:
   - **Name**: RefNet
   - **Database Password**: Generate strong password (save it!)
   - **Region**: Choose closest to your users
4. Click **"Create new project"** (wait 1-2 mins)

### 1.2 Get Connection String
1. Go to **Settings → Database**
2. Copy the connection string under **"Connection pooling"**
   - Format: `postgresql://postgres.xxxxx:password@db.xxxxx.supabase.co:5432/postgres`
3. **Update your `.env` file**:
   ```
   PG_URI=postgresql://postgres.xxxxx:password@db.xxxxx.supabase.co:5432/postgres
   ```

### 1.3 Initialize Database Schema
1. Go to **SQL Editor** in Supabase
2. Copy content from `database/init.sql`
3. Run the SQL script
4. Verify tables are created: Users, Jobs, Referrals, Experiences, Projects

---

## 🔐 Step 2: Set Up Google OAuth

### 2.1 Create OAuth Credentials
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create new project: **RefNet**
3. Go to **APIs & Services → Credentials**
4. Click **"Create Credentials" → "OAuth client ID"**
5. Choose **"Web application"**
6. Add **Authorized redirect URIs**:
   ```
   http://localhost:5000/api/auth/google/callback        (local dev)
   https://your-backend.vercel.app/api/auth/google/callback  (production)
   ```
7. Copy **Client ID** and **Client Secret**

### 2.2 Update Environment Variables
Add to your `.env` file:
```
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
```

---

## 📦 Step 3: Set Up File Storage (Cloudinary)

### 3.1 Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up (free account available)
3. Go to **Dashboard**
4. Copy your **API Environment Variable** (looks like: `cloudinary://key:secret@cloudname`)

### 3.2 Update Environment Variables
```
CLOUDINARY_URL=cloudinary://your_key:your_secret@your_cloud_name
```

---

## 🔐 Step 4: Generate Strong Secrets

Run this command to generate secure secrets:
```bash
node -e "
const secrets = {
  JWT_SECRET: require('crypto').randomBytes(32).toString('hex'),
  JWT_REFRESH_SECRET: require('crypto').randomBytes(32).toString('hex'),
  SESSION_SECRET: require('crypto').randomBytes(32).toString('hex'),
};
console.log(JSON.stringify(secrets, null, 2));
"
```

Add these to your `.env` file:
```
JWT_SECRET=<generated_value>
JWT_REFRESH_SECRET=<generated_value>
SESSION_SECRET=<generated_value>
```

---

## 🌐 Step 5: Deploy Backend to Vercel

### 5.1 Push Code to GitHub
```bash
git add .
git commit -m "Deployment ready: fixed env validation, added rate limiting, configured for production"
git push origin deploy/vercel-backend
```

### 5.2 Create Vercel Project (Backend)
1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New..." → "Project"**
3. **Import Git Repository** (select your repo)
4. Select **Root Directory**: `server`
5. Click **"Deploy"**

### 5.3 Add Environment Variables in Vercel
1. Go to Project **Settings → Environment Variables**
2. Add all variables from your `.env` file:
   - `PG_URI`
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - `SESSION_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_CALLBACK_URL=https://your-backend-url.vercel.app/api/auth/google/callback`
   - `CLOUDINARY_URL`
   - `CLIENT_URL=https://your-frontend-url.vercel.app`
   - `NODE_ENV=production`

3. Redeploy from **Deployments → Last Deployment → Redeploy**

### 5.4 Verify Backend Health
```bash
curl https://your-backend-url.vercel.app/health
```
Should return: `{"status":"ok","timestamp":"2026-05-26T..."}`

---

## 🎨 Step 6: Deploy Frontend to Vercel

### 6.1 Create Vercel Project (Frontend)
1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New..." → "Project"**
3. **Import Git Repository**
4. Select **Root Directory**: `client`
5. Framework: **Vite** (auto-detected)

### 6.2 Add Frontend Environment Variables
1. Go to Project **Settings → Environment Variables**
2. Add:
   - `VITE_API_URL=https://your-backend-url.vercel.app/api`
   - `VITE_GOOGLE_CLIENT_ID=<your-client-id>`

3. Redeploy

### 6.3 Verify Frontend
Open `https://your-frontend-url.vercel.app` in browser
- ✅ Should see landing page
- ✅ Navigation works
- ✅ Login button redirects to Google OAuth

---

## ✅ Testing Checklist

### Backend API Tests
```bash
# Health check
curl https://your-backend-url.vercel.app/health

# API availability
curl https://your-backend-url.vercel.app

# Database connection
curl -X GET https://your-backend-url.vercel.app/api/jobs
```

### Frontend Tests
1. Visit frontend URL
2. Click **"Log In"** → Google OAuth flow
3. Create account → Redirects to dashboard
4. Navigate to Jobs, Referrals, Profile

### Security Tests
- [ ] CORS only allows frontend domain
- [ ] OAuth redirect URIs match Vercel backend URL
- [ ] No hardcoded localhost URLs in production
- [ ] Environment variables not exposed in git
- [ ] Rate limiting works (5 login attempts in 15 mins)

---

## 🐛 Troubleshooting

### Issue: "CORS blocked" error
**Fix**: Update `CLIENT_URL` in Vercel backend settings
```
CLIENT_URL=https://your-frontend-url.vercel.app
```

### Issue: "Google OAuth callback mismatch"
**Fix**: Update `GOOGLE_CALLBACK_URL` in Vercel backend settings
```
GOOGLE_CALLBACK_URL=https://your-backend-url.vercel.app/api/auth/google/callback
```

### Issue: "Database connection timeout"
**Fix**: Check Supabase connection string in `PG_URI`
- Verify password is correct
- Check if IP whitelist needs updating (Supabase → Settings → Network)

### Issue: "Cloudinary upload fails"
**Fix**: Verify `CLOUDINARY_URL` is correct format
```
cloudinary://api_key:api_secret@cloud_name
```

### Issue: "Rate limit errors in production"
**Fix**: These are normal for login endpoints
- Implement exponential backoff in frontend
- Contact support if legitimate users are blocked

---

## 📊 Monitoring & Maintenance

### Monitor Backend
- Vercel Dashboard → Analytics
- Check Function runtime and Serverless execution

### Monitor Database
- Supabase Dashboard → Database Stats
- Check connection count (max 100 for free tier)

### Monitor Errors
- Vercel Logs: `vercel logs` in CLI
- Supabase Logs: Dashboard → Logs

---

## 🔄 Continuous Deployment

Every git push to main branch triggers:
1. Backend redeploy to Vercel
2. Frontend redeploy to Vercel
3. Environment variables automatically applied

To disable auto-deploy:
- Go to Project Settings → Git
- Uncheck "Automatically deploy on push"

---

## 🚀 Scaling Tips

When you grow beyond free tier:

### Supabase
- Upgrade to **Pro plan** for larger databases
- Enable **Point-in-time Recovery** for backups
- Set up **Read Replicas** for better performance

### Vercel
- Upgrade to **Pro plan** for faster deployments
- Use **Edge Functions** for low-latency API calls
- Set up **Observability** for detailed logs

### Cloudinary
- Upload **100+ files/month**? Upgrade to paid plan
- Set **Auto upload presets** for scalability

---

## 📚 Additional Resources

- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Cloudinary Upload Guide](https://cloudinary.com/documentation/upload_video)
- [Express.js Production Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [React Security Best Practices](https://react.dev/learn/security)

---

Last Updated: May 26, 2026
