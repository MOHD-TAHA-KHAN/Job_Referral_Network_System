# Vercel Deployment Guide - RefNet

## Overview
This guide helps you deploy RefNet (Frontend + Backend) on Vercel and Supabase.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend (Vercel)   │  Backend (Vercel)   │  DB (Supabase)  │
│  React + Vite        │  Express + Node.js  │  PostgreSQL     │
└─────────────────────────────────────────────────────────────┘
```

## Prerequisites
- [ ] Vercel account (https://vercel.com)
- [ ] Supabase account (https://supabase.com)
- [ ] GitHub repository (private recommended)
- [ ] Google OAuth credentials (https://console.cloud.google.com)
- [ ] Cloudinary account (https://cloudinary.com)

---

## Step 1: Database Setup (Supabase)

### 1.1 Create Supabase Project
1. Go to https://supabase.com
2. Click "New Project"
3. Fill in:
   - **Project name**: `refnet`
   - **Database password**: Strong password (save this!)
   - **Region**: Choose closest to your users
4. Wait for project to initialize (~2 min)

### 1.2 Get Database Connection String
1. Go to **Settings** → **Database**
2. Under "Connection string", select **Connection pooling** (URI format)
3. Copy the connection string
4. Replace `[YOUR-PASSWORD]` with your database password
5. Test the connection

### 1.3 Run Migrations
1. In your local machine, install postgres client:
   ```bash
   # macOS
   brew install postgresql
   
   # Windows (or use pgAdmin)
   # Download: https://www.pgadmin.org/
   ```

2. Connect to Supabase:
   ```bash
   psql "postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"
   ```

3. Run migrations:
   ```bash
   psql -d "your-connection-string" -f database/init.sql
   psql -d "your-connection-string" -f database/seed_data.sql
   ```

---

## Step 2: Backend Deployment (Vercel)

### 2.1 Prepare Backend for Vercel

**Update `server/vercel.json`:**
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "env": {
    "NODE_ENV": "production"
  },
  "routes": [
    {
      "src": "/(.*)",
      "dest": "app.ts"
    }
  ]
}
```

**Update `server/package.json` scripts:**
```json
{
  "scripts": {
    "start": "node dist/app.js",
    "dev": "nodemon --exec ts-node app.ts",
    "build": "tsc",
    "vercel-build": "npm run build"
  }
}
```

### 2.2 Deploy Backend to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# From /server directory
cd server
vercel

# Follow prompts:
# - Link to existing project? → No (create new)
# - Project name? → refnet-api
# - Framework? → Other
# - Build command? → npm run build
# - Output directory? → dist
```

### 2.3 Set Environment Variables
1. Go to https://vercel.com/dashboard
2. Select your backend project
3. **Settings** → **Environment Variables**
4. Add:

```bash
NODE_ENV=production
PG_URI=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
JWT_SECRET=generate-random-32-char-secret
SESSION_SECRET=generate-random-32-char-secret
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx
GOOGLE_CALLBACK_URL=https://refnet-api.vercel.app/api/auth/google/callback
API_URL=https://refnet-api.vercel.app
CLIENT_URL=https://refnet-frontend.vercel.app
CLOUDINARY_CLOUD_NAME=xxxxx
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx
CORS_ORIGIN=https://refnet-frontend.vercel.app,https://yourdomain.com
```

**⚠️ IMPORTANT: For production, add Redis support:**
```bash
# Install Redis adapter (optional but recommended for Vercel)
npm install redis connect-redis
```

---

## Step 3: Frontend Deployment (Vercel)

### 3.1 Update Frontend Config

**Update `client/vite.config.ts`:**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})
```

**Update `client/.env.example`:**
```bash
VITE_API_URL=https://refnet-api.vercel.app/api
```

### 3.2 Deploy Frontend to Vercel
```bash
# From /client directory
cd client
vercel

# Follow prompts:
# - Link to existing project? → No (create new)
# - Project name? → refnet-frontend
# - Framework? → Vite
# - Build command? → npm run build
# - Output directory? → dist
```

### 3.3 Set Environment Variables
1. Go to your frontend project on Vercel
2. **Settings** → **Environment Variables**
3. Add:

```bash
VITE_API_URL=https://refnet-api.vercel.app/api
```

---

## Step 4: Update Google OAuth

### 4.1 Update Redirect URIs
1. Go to https://console.cloud.google.com
2. Navigate to **APIs & Services** → **Credentials**
3. Click your OAuth app
4. Update **Authorized redirect URIs**:
   ```
   http://localhost:5000/api/auth/google/callback
   https://refnet-api.vercel.app/api/auth/google/callback
   ```

### 4.2 Update Client Origins
1. In same Google Console
2. Add **Authorized JavaScript origins**:
   ```
   http://localhost:5173
   http://localhost:5000
   https://refnet-frontend.vercel.app
   https://refnet-api.vercel.app
   https://yourdomain.com
   ```

---

## Step 5: Testing

### Local Testing
```bash
# Terminal 1: Backend
cd server
npm install
npm run dev

# Terminal 2: Frontend
cd client
npm install
npm run dev

# Visit: http://localhost:5173
```

### Production Testing
1. Visit: https://refnet-frontend.vercel.app
2. Test features:
   - [ ] Landing page loads
   - [ ] Sign up works
   - [ ] Google OAuth works
   - [ ] Jobs load from DB
   - [ ] Referrals can be sent
   - [ ] Dashboard displays data

---

## Troubleshooting

### Backend won't start on Vercel
```bash
# Check logs
vercel logs --follow

# Common issues:
# 1. Missing env vars → Check Vercel dashboard
# 2. DB connection → Test PG_URI locally
# 3. Node modules → Run: vercel rebuild
```

### Frontend can't reach backend
```javascript
// Update in client/src/services/api.ts
const baseURL = import.meta.env.VITE_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://refnet-api.vercel.app/api'
    : 'http://localhost:5000/api');
```

### OAuth not working
1. Check redirect URI matches in Google Console
2. Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct
3. Test: `https://refnet-api.vercel.app/api/auth/google`

### Database connection times out
1. Check Supabase is running
2. Verify PG_URI has correct format
3. Test locally: `psql "your-connection-string"`
4. Whitelist Vercel IPs in Supabase firewall (if applicable)

---

## Best Practices for Production

### 1. Security
- [ ] Rotate all secrets monthly
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Set strong SESSION_SECRET and JWT_SECRET
- [ ] Use environment-specific configs
- [ ] Implement rate limiting (already done)

### 2. Performance
- [ ] Enable Vercel Analytics
- [ ] Use Redis for sessions
- [ ] Cache frontend with Vercel CDN (automatic)
- [ ] Optimize database queries
- [ ] Use connection pooling (Supabase handles this)

### 3. Monitoring
- [ ] Set up Vercel alerts
- [ ] Monitor Supabase performance
- [ ] Log errors to tracking service
- [ ] Set up health check: `https://refnet-api.vercel.app/health`

### 4. Backup & Disaster Recovery
- [ ] Enable automated Supabase backups
- [ ] Export data weekly
- [ ] Test restore procedure
- [ ] Keep database passwords in secure vault

---

## Deployment Checklist

### Before First Deploy
- [ ] Create Supabase project
- [ ] Run database migrations
- [ ] Set up Google OAuth
- [ ] Create Cloudinary account
- [ ] Have Vercel CLI installed

### Backend Deploy
- [ ] Fix all TypeScript errors (`npm run build`)
- [ ] Test locally with prod env vars
- [ ] Deploy to Vercel
- [ ] Set all env vars on Vercel
- [ ] Test API: `curl https://refnet-api.vercel.app/health`

### Frontend Deploy
- [ ] Update API URL in config
- [ ] Test build locally (`npm run build`)
- [ ] Deploy to Vercel
- [ ] Set VITE_API_URL env var
- [ ] Test frontend: https://refnet-frontend.vercel.app

### Post Deploy
- [ ] Test full login flow
- [ ] Verify database connection
- [ ] Check error logs
- [ ] Monitor performance
- [ ] Create status page

---

## Adding Custom Domain

### 1. Update DNS
1. Go to your domain registrar
2. Add CNAME record:
   ```
   yourdomain.com → cname.vercel-dns.com
   ```

### 2. Verify in Vercel
1. Go to project settings
2. **Domains** → **Add**
3. Enter your domain
4. Wait for verification (usually instant)

### 3. Update OAuth & CORS
Update Google OAuth redirect URIs:
```
https://yourdomain.com/api/auth/google/callback
```

Update backend env vars:
```bash
CLIENT_URL=https://yourdomain.com
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback
```

---

## CI/CD Pipeline

### GitHub Actions (Optional)
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy Backend
        run: |
          cd server
          npm install
          npm run build
      
      - name: Deploy Frontend
        run: |
          cd client
          npm install
          npm run build
      
      - name: Push to Vercel
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: vercel deploy --prod
```

---

## Support & Help

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Express.js**: https://expressjs.com
- **React**: https://react.dev

---

Generated: 2025-05-26
Last Updated: Version 1.0.0
