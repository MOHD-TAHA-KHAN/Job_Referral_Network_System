# 🚀 RefNet Setup Guide

Complete setup instructions for the RefNet Job Referral Network System.

## 📋 Quick Start

### **Prerequisites Checklist:**
- [ ] Node.js 18+ installed
- [ ] npm 9+ installed
- [ ] Docker 20+ installed
- [ ] Git installed
- [ ] Google OAuth credentials (optional)

### **One-Command Setup:**
```bash
git clone https://github.com/MOHD-TAHA-KHAN/Job_Referral_Network_System.git
cd Job_Referral_Network_System
docker-compose up -d
cd server && npm install && cp .env.example .env
cd ../client && npm install && cp .env.example .env
```

---

## 🔧 Step-by-Step Setup

### **Step 1: Clone Repository**
```bash
git clone https://github.com/MOHD-TAHA-KHAN/Job_Referral_Network_System.git
cd Job_Referral_Network_System
```

### **Step 2: Start Database**
```bash
# Start PostgreSQL and pgAdmin
docker-compose up -d

# Verify containers are running
docker-compose ps

# Access database:
# PostgreSQL: localhost:5433 (postgres/password)
# pgAdmin: http://localhost:5050 (admin@refnet.com/admin)
```

### **Step 3: Backend Setup**
```bash
cd server

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Edit .env file (required):
# - Generate JWT secrets: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# - Add Google OAuth credentials (optional)
# - Configure database URI

# Start backend server
npm run dev
```

### **Step 4: Frontend Setup**
```bash
cd client

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Edit .env file:
# VITE_API_URL=http://localhost:5000/api
# VITE_GOOGLE_CLIENT_ID=your_google_client_id

# Start frontend server
npm run dev
```

---

## 🌍 Environment Configuration

### **Backend Environment (.env):**
```bash
# Database
PG_URI=postgresql://postgres:password@localhost:5433/referraldb

# JWT (Generate secure secrets)
JWT_SECRET=your_generated_jwt_secret_here
JWT_REFRESH_SECRET=your_generated_refresh_secret_here

# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary (optional)
CLOUDINARY_URL=your_cloudinary_url
```

### **Frontend Environment (.env):**
```bash
# Backend API
VITE_API_URL=http://localhost:5000/api

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id

# Application
VITE_APP_NAME=RefNet
VITE_APP_VERSION=1.0.0
```

---

## 🔐 Google OAuth Setup (Optional)

### **1. Create Google OAuth Credentials:**
1. Go to: https://console.cloud.google.com/apis/credentials
2. Select your project or create new one
3. Click "Create Credentials" → "OAuth 2.0 Client ID"
4. Select "Web application"
5. Add redirect URIs:
   - `http://localhost:5000/api/auth/google/callback`
   - `http://localhost:5173/auth/callback`
6. Copy Client ID and Client Secret

### **2. Update Environment Variables:**
```bash
# Backend .env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here

# Frontend .env
VITE_GOOGLE_CLIENT_ID=your_client_id_here
```

---

## 🗄️ Database Setup

### **Option 1: Docker (Recommended)**
```bash
# Start PostgreSQL container
docker-compose up -d postgres

# Database is automatically initialized with schema
# Access: localhost:5433 (postgres/password)
```

### **Option 2: Local PostgreSQL**
```bash
# Create database
createdb referraldb

# Run initialization script
psql -U postgres -d referraldb -f database/init.sql

# Run seed data (optional)
psql -U postgres -d referraldb -f database/seed_data.sql
```

### **Database Access:**
- **pgAdmin**: http://localhost:5050
  - Email: `admin@refnet.com`
  - Password: `admin`
- **Connection**: `localhost:5433`
  - Username: `postgres`
  - Password: `password`
  - Database: `referraldb`

---

## 🚀 Running the Application

### **Development Mode:**
```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
cd client
npm run dev

# Terminal 3: Database (if not using Docker)
docker-compose up -d
```

### **Access Points:**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000
- **Database**: localhost:5433
- **pgAdmin**: http://localhost:5050

---

## 🧪 Testing the Setup

### **1. Test Backend API:**
```bash
# Test server status
curl http://localhost:5000/

# Test authentication
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### **2. Test Frontend:**
1. Open http://localhost:5173
2. Navigate to login page
3. Test login with: `test@example.com` / any password
4. Verify dashboard loads correctly

### **3. Test Google OAuth:**
1. Click "Continue with Google"
2. Complete OAuth flow (if configured)
3. Verify redirect to dashboard

---

## 📱 Test Credentials

### **Pre-configured Test Users:**
```bash
# Fresher Account
Email: test@example.com
Password: any password
Role: FRESHER

# HR Account
Email: hr@techcompany.com
Password: any password
Role: HR

# Professional Account
Email: dev@techcompany.com
Password: any password
Role: PROFESSIONAL
```

---

## 🐛 Troubleshooting

### **Common Issues & Solutions:**

#### **1. Port Already in Use:**
```bash
# Check what's using port 5000
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F

# Or use different port
PORT=3001 npm run dev
```

#### **2. Database Connection Failed:**
```bash
# Check PostgreSQL container
docker-compose ps postgres

# Restart database
docker-compose restart postgres

# Test connection
psql -h localhost -p 5433 -U postgres -d referraldb
```

#### **3. Environment Variables Not Loading:**
```bash
# Check .env file exists
ls -la .env

# Verify variables
node -e "require('dotenv').config(); console.log(process.env.JWT_SECRET)"

# Restart server after changing .env
```

#### **4. Node Modules Issues:**
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### **5. TypeScript Compilation Errors:**
```bash
# Check TypeScript errors
npx tsc --noEmit

# Clear build cache
rm -rf dist
npm run build
```

#### **6. CORS Issues:**
```bash
# Verify CLIENT_URL in backend .env
echo $CLIENT_URL

# Check frontend API URL
echo $VITE_API_URL
```

---

## 🔧 Development Tools

### **Recommended VS Code Extensions:**
- TypeScript and JavaScript Language Features
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Docker
- PostgreSQL
- Thunder Client (for API testing)

### **Useful Commands:**
```bash
# Backend development
cd server
npm run dev          # Start with auto-reload
npm run build        # Build TypeScript
npm start            # Start production server

# Frontend development
cd client
npm run dev          # Start with hot reload
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint          # Run ESLint

# Database operations
docker-compose up -d postgres    # Start database
docker-compose logs postgres      # View logs
docker-compose down postgres      # Stop database
```

---

## 📚 Additional Resources

### **Documentation:**
- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Frontend Components](./docs/FRONTEND.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

### **Requirements:**
- [Main Requirements](./REQUIREMENTS.md)
- [Backend Requirements](./server/REQUIREMENTS.md)
- [Frontend Requirements](./client/REQUIREMENTS.md)

### **Support:**
- **Issues**: Create GitHub issue
- **Discussions**: GitHub Discussions
- **Email**: support@refnet.com

---

## ✅ Setup Verification Checklist

After completing setup, verify:

- [ ] Backend server running on http://localhost:5000
- [ ] Frontend running on http://localhost:5173
- [ ] Database accessible on localhost:5433
- [ ] pgAdmin accessible on http://localhost:5050
- [ ] Can login with test credentials
- [ ] Dashboard loads correctly
- [ ] API endpoints responding
- [ ] Environment variables configured
- [ ] JWT secrets generated
- [ ] Google OAuth configured (optional)

---

**🎉 Setup Complete!** 

If you followed all steps successfully, your RefNet application should be fully operational. Start exploring the features and begin development!

**Need Help?** Check the troubleshooting section or create an issue on GitHub.
