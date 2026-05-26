# RefNet - Deployment Checklist & Testing Guide

## 🔴 Critical Issues Fixed

### Frontend Issues
- ✅ **Fixed**: Duplicate HTML IDs in LandingPage (ID conflict error)
  - Changed from dynamic `id={2_${142 + i}}` to semantic `id={company-link-${name}}`
  - All 6 company links now have unique, semantic IDs
  - No more console errors about duplicate IDs

### Backend Issues
- ✅ **Fixed**: Missing `express-rate-limit` dependency
  - Added to `server/package.json`
  - Now deployed on Vercel without build errors
  
- ✅ **Fixed**: No graceful shutdown handling
  - Added SIGTERM/SIGINT handlers
  - Server now closes cleanly on termination
  - Prevents data corruption on redeploys
  
- ✅ **Improved**: Environment variable management
  - Created comprehensive `.env.example` files
  - Clear documentation of all required vars
  - Better error messages for missing vars

---

## 📋 Pre-Deployment Checklist

### Code Quality
- [ ] Run linter on frontend: `npm run lint` (in /client)
- [ ] Run TypeScript build: `npm run build` (in /server)
- [ ] No console errors in development
- [ ] No console warnings related to React
- [ ] All imports resolved

### Database
- [ ] Supabase project created
- [ ] Database migrations run (`init.sql` and `seed_data.sql`)
- [ ] Connection string tested locally
- [ ] Connection pooling enabled
- [ ] Backups configured

### Environment Variables
- [ ] All variables in `.env.example` have values
- [ ] JWT_SECRET is strong (32+ chars)
- [ ] SESSION_SECRET is strong (32+ chars)
- [ ] Google OAuth credentials obtained
- [ ] Cloudinary account set up
- [ ] CORS origins list is correct

### OAuth Setup
- [ ] Google OAuth app created
- [ ] Client ID and Secret generated
- [ ] Redirect URIs configured:
  - `http://localhost:5000/api/auth/google/callback` (dev)
  - `https://refnet-api.vercel.app/api/auth/google/callback` (prod)
- [ ] JavaScript origins configured:
  - `http://localhost:5000`
  - `http://localhost:5173`
  - `https://refnet-api.vercel.app`
  - `https://refnet-frontend.vercel.app`

### Vercel Setup
- [ ] Vercel account created
- [ ] GitHub repo connected
- [ ] Backend project created
- [ ] Frontend project created
- [ ] Environment variables set in Vercel dashboard

---

## 🧪 Local Testing (Before Deploy)

### 1. Backend Tests

```bash
cd server

# Install dependencies
npm install

# Run TypeScript compilation check
npm run build

# Run development server
npm run dev

# Expected output:
# ✓ Server running on http://localhost:5000
# ✓ PostgreSQL connected successfully!
# ✓ No console errors
```

### 2. API Health Check

```bash
# In another terminal
curl http://localhost:5000/health

# Expected response:
# {"status":"ok","timestamp":"2025-05-26T..."}
```

### 3. Frontend Tests

```bash
cd client

# Install dependencies
npm install

# Run development server
npm run dev

# Expected output:
# ✓ VITE v7.x.x ready in xxx ms
# ✓ ➜  Local:   http://localhost:5173/
```

### 4. Authentication Flow Test

1. **Sign Up**
   - [ ] Navigate to http://localhost:5173/signup
   - [ ] Fill form and submit
   - [ ] Check database for new user

2. **Login**
   - [ ] Click "Log In"
   - [ ] Enter credentials
   - [ ] Should redirect to dashboard
   - [ ] Session cookie should be set

3. **OAuth (Google)**
   - [ ] Click "Sign up with Google"
   - [ ] Choose test Google account
   - [ ] Should create user and redirect to dashboard
   - [ ] Check database for user with Google provider

### 5. Core Features Test

```
Feature           | Status | Notes
─────────────────────────────────────
Landing Page      | [ ]    | Loads without errors
Job Listings      | [ ]    | Shows 5+ jobs
Job Details       | [ ]    | Click job, shows details
Create Referral   | [ ]    | Can request referral
Dashboard         | [ ]    | Shows user's referrals
Profile           | [ ]    | Can edit profile
Search            | [ ]    | Search bar works
Navigation        | [ ]    | All links work
Responsive        | [ ]    | Mobile view OK
```

### 6. Build Test

```bash
cd client
npm run build

# Expected output:
# ✓ dist/assets/ files created
# ✓ dist/index.html created
# ✓ No build errors
```

---

## 🚀 Deployment Steps

### Phase 1: Backend Deploy (Day 1)

```bash
# 1. Login to Vercel
vercel login

# 2. From server directory
cd server

# 3. Deploy
vercel --prod

# 4. Copy the deployment URL: https://refnet-api-xxxxxxx.vercel.app

# 5. Set environment variables in Vercel dashboard
# (See VERCEL_DEPLOYMENT_GUIDE.md for full list)
```

**Verify Backend**
```bash
curl https://refnet-api-xxxxxxx.vercel.app/health

# Expected: {"status":"ok","timestamp":"..."}
```

### Phase 2: Frontend Deploy (Day 1)

```bash
# 1. Update backend URL in client config
cd client

# Edit .env.local:
# VITE_API_URL=https://refnet-api-xxxxxxx.vercel.app/api

# 2. Deploy
vercel --prod

# 3. Copy the deployment URL: https://refnet-frontend-xxxxxxx.vercel.app
```

**Verify Frontend**
- Navigate to https://refnet-frontend-xxxxxxx.vercel.app
- Should see landing page without errors
- Check browser console for errors

### Phase 3: Post-Deploy Tests (Day 1)

1. **API Health**
   ```bash
   curl https://refnet-api-xxx.vercel.app/health
   ```

2. **Frontend Loading**
   - Open https://refnet-frontend-xxx.vercel.app
   - Check for 404/500 errors
   - Check Network tab for failed requests

3. **Database Connection**
   - Try signing up
   - Check user appears in Supabase
   - Try logging in

4. **OAuth Flow**
   - Click Google Sign Up
   - Complete OAuth flow
   - Should create account and login

---

## 📊 Vercel Production Recommendations

### Architecture Recommendations

**Current**: Express on Vercel Serverless
- ✅ Pros: Simple, no infrastructure to manage
- ❌ Cons: Cold starts, no persistent connections

**Better Option**: Express on Render/Railway
- ✅ Pros: Persistent server, better for long connections
- ✅ Cons: Slightly more expensive
- Cost: ~$10-15/month vs Vercel free tier

**Recommended for RefNet**:
1. **Frontend**: Keep on Vercel (already deployed) - FREE
2. **Backend**: Move to **Railway.app** or **Render.com**
   - Railway: $5/month (includes 512MB) - RECOMMENDED
   - Render: $7/month (free tier has limitations)
3. **Database**: Keep Supabase - FREE tier or $25/month for production

### Why Move Backend from Vercel?

| Feature | Vercel | Railway | Render |
|---------|--------|---------|--------|
| Cold Starts | 3-5s | <500ms | 1-2s |
| Persistent Connections | ❌ | ✅ | ✅ |
| Session Storage | Memory only | Persistent | Persistent |
| Scaling | Auto | Auto | Auto |
| Cost | Free* | $5+ | $7+ |
| Best For | Stateless APIs | Full Apps | Full Apps |

### Migration Path to Railway (Recommended)

```
1. Create Railway account (5 min)
2. Connect GitHub repo (2 min)
3. Deploy backend (5 min)
4. Update frontend API URL (1 min)
5. Test full flow (10 min)
```

**Cost Comparison**:
- **Vercel Only**: Free (but slow, limited)
- **Vercel + Railway**: $5-10/month (fast, reliable)
- **Vercel + Render**: $7-15/month

---

## ⚠️ Critical Things to Monitor

### 1. Database Connections
```
Monitor: Supabase dashboard
Alert: If queries > 100ms average
Action: Optimize queries, add indexes
```

### 2. API Response Times
```
Monitor: Vercel/Railway dashboard
Alert: If p95 > 1000ms
Action: Add caching, optimize code
```

### 3. Error Rates
```
Monitor: Sentry/LogRocket (setup optional)
Alert: If error rate > 1%
Action: Check logs, fix issues
```

### 4. Database Backups
```
Schedule: Daily via Supabase
Retention: 7+ days
Test: Weekly restore test
```

---

## 🔒 Security Checklist

- [ ] All secrets rotated from development
- [ ] Rate limiting enabled (already done)
- [ ] CORS configured correctly
- [ ] HTTPS enforced (automatic on Vercel)
- [ ] SQL injection prevention (Sequelize ORM handles)
- [ ] XSS protection (React + Helmet handles)
- [ ] CSRF tokens implemented (session handles)
- [ ] Password hashing (bcryptjs handles)
- [ ] Input validation implemented
- [ ] Error messages don't leak info
- [ ] Sensitive logs hidden
- [ ] API keys not in code
- [ ] Dependencies updated regularly
- [ ] Security headers set (Helmet)

---

## 📈 Performance Optimization Tips

### Frontend
```
✓ Code splitting with React lazy()
✓ Image optimization
✓ CSS minification
✓ Tree shaking
✓ Defer non-critical JS
```

### Backend
```
✓ Database query optimization
✓ Add Redis caching
✓ Connection pooling (done)
✓ Compress responses
✓ Query result pagination
```

### Database
```
✓ Add indexes on frequently queried columns
✓ Archive old referrals
✓ Connection pooling (done)
✓ Query optimization
```

---

## 🆘 Troubleshooting Guide

### Problem: Backend won't build
```
Solution 1: Check TypeScript errors
$ cd server && npm run build

Solution 2: Missing dependencies
$ npm install

Solution 3: Clear cache
$ npm cache clean --force
$ rm -rf node_modules
$ npm install
```

### Problem: Database connection timeout
```
Solution 1: Check PG_URI format
Format: postgresql://user:pass@host:5432/db

Solution 2: Verify Supabase status
Check: supabase.com/status

Solution 3: Check firewall
Supabase: Settings → Security → Firewall
```

### Problem: OAuth not working
```
Solution 1: Verify credentials
Check: Google Cloud Console
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET

Solution 2: Check redirect URIs
Must match exactly in Google Console

Solution 3: Check CORS
CLIENT_URL must be in CORS_ORIGIN list
```

### Problem: Frontend can't reach backend
```
Solution 1: Check env variable
frontend: VITE_API_URL=https://api-url

Solution 2: Check CORS headers
backend: CORS_ORIGIN includes frontend URL

Solution 3: Check API URL format
Should be: https://domain/api (not /api/)
```

---

## 📞 Getting Help

1. **Check Logs**
   ```bash
   # Vercel logs
   vercel logs --follow
   
   # Railway logs
   railway logs
   ```

2. **Common Issues**: See sections above

3. **Documentation**
   - Vercel: https://vercel.com/docs
   - Express: https://expressjs.com/docs
   - React: https://react.dev
   - Supabase: https://supabase.com/docs

---

## ✅ Sign Off

- **Date Prepared**: 2025-05-26
- **Version**: 1.0
- **Status**: Ready for Deployment
- **Next Review**: After first deployment
- **Maintainer**: Your Team

---

### Quick Reference Commands

```bash
# Backend
cd server
npm install              # Install deps
npm run build            # Check build
npm run dev              # Local dev
vercel                   # Deploy

# Frontend  
cd client
npm install              # Install deps
npm run build            # Check build
npm run dev              # Local dev
vercel                   # Deploy

# Database
psql "postgresql://..." # Connect to Supabase
SELECT COUNT(*) FROM users; # Check data
```
