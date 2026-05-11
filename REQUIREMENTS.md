# RefNet - Job Referral Network System

## 📋 System Requirements

This document outlines all dependencies and requirements for setting up the RefNet project.

### 🔧 Prerequisites

#### **Required Software:**
- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (comes with Node.js)
- **PostgreSQL**: Version 15.x or higher
- **Docker**: Version 20.x or higher (for containerized database)
- **Git**: For cloning the repository

#### **Optional Tools:**
- **Docker Desktop**: For running PostgreSQL container
- **PostgreSQL Client**: For database management (pgAdmin, DBeaver, etc.)
- **VS Code**: Recommended IDE with extensions

---

## 🐳 Docker Setup (Recommended)

### **Database Services:**
```bash
# Start PostgreSQL and pgAdmin containers
docker-compose up -d

# Check container status
docker-compose ps

# View logs
docker-compose logs postgres
docker-compose logs pgadmin
```

#### **Database Access:**
- **PostgreSQL**: `localhost:5433`
  - Username: `postgres`
  - Password: `password`
  - Database: `referraldb`
- **pgAdmin**: `http://localhost:5050`
  - Email: `admin@refnet.com`
  - Password: `admin`

---

## 📦 Backend Requirements

### **Node.js Dependencies:**
```json
{
  "dependencies": {
    "express": "^4.22.1",
    "cors": "^2.8.6",
    "dotenv": "^16.6.1",
    "jsonwebtoken": "^9.0.3",
    "bcryptjs": "^3.0.3",
    "passport": "^0.7.0",
    "passport-google-oauth20": "^2.0.0",
    "pg": "^8.20.0",
    "sequelize": "^6.37.8",
    "axios": "^1.15.0",
    "cookie-parser": "^1.4.7",
    "express-session": "^1.19.0",
    "helmet": "^7.2.0",
    "morgan": "^1.10.1",
    "multer": "^2.1.1",
    "cloudinary": "^2.10.0",
    "multer-storage-cloudinary": "^4.0.0",
    "pg-hstore": "^2.3.4"
  },
  "devDependencies": {
    "@types/node": "^25.6.0",
    "@types/express": "^5.0.6",
    "@types/cors": "^2.8.19",
    "@types/jsonwebtoken": "^9.0.10",
    "@types/bcryptjs": "^2.4.6",
    "@types/passport": "^1.0.17",
    "@types/passport-google-oauth20": "^2.0.17",
    "@types/pg": "^8.20.0",
    "@types/cookie-parser": "^1.4.10",
    "@types/morgan": "^1.9.10",
    "@types/multer": "^2.1.0",
    "typescript": "^6.0.3",
    "ts-node": "^10.9.2",
    "nodemon": "^3.1.14"
  }
}
```

### **Installation Commands:**
```bash
cd server
npm install
```

### **Environment Variables Required:**
```bash
# Database Configuration
PG_URI=postgresql://postgres:password@localhost:5433/referraldb

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here

# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Cloudinary Configuration (optional)
CLOUDINARY_URL=your_cloudinary_url_here
```

---

## 🎨 Frontend Requirements

### **Node.js Dependencies:**
```json
{
  "dependencies": {
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-router": "^7.8.2",
    "zustand": "^5.0.13",
    "axios": "^1.16.0",
    "motion": "^12.23.12"
  },
  "devDependencies": {
    "@types/react": "^19.2.5",
    "@types/react-dom": "^19.2.3",
    "@types/node": "^25.6.2",
    "@vitejs/plugin-react": "^5.1.1",
    "vite": "^7.2.4",
    "typescript": "~5.8.3",
    "eslint": "^9.39.1",
    "@eslint/js": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "typescript-eslint": "^8.39.1",
    "globals": "^16.5.0"
  }
}
```

### **Installation Commands:**
```bash
cd client
npm install
```

### **Environment Variables Required:**
```bash
# Backend API Configuration
VITE_API_URL=http://localhost:5000/api

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# Application Configuration
VITE_APP_NAME=RefNet
VITE_APP_VERSION=1.0.0
```

---

## 🔑 Google OAuth Setup

### **Required Credentials:**
1. **Google Cloud Console**: https://console.cloud.google.com/apis/credentials
2. **OAuth 2.0 Client ID**: Create new credentials for web application
3. **Authorized Redirect URIs**:
   - `http://localhost:5000/api/auth/google/callback`
   - `http://localhost:5173/auth/callback`

### **Environment Setup:**
```bash
# Backend (.env)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Frontend (.env)
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 🗄️ Database Setup

### **Option 1: Docker (Recommended)**
```bash
# Start PostgreSQL container
docker-compose up -d postgres

# Run database initialization
docker-compose exec postgres psql -U postgres -d referraldb -f /docker-entrypoint-initdb.d/init.sql
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

### **Database Schema:**
- **users**: User accounts with roles and profiles
- **jobs**: Job postings with company details
- **referrals**: Referral requests and status tracking

---

## 🚀 Quick Start Commands

### **Complete Setup:**
```bash
# 1. Clone repository
git clone https://github.com/MOHD-TAHA-KHAN/Job_Referral_Network_System.git
cd Job_Referral_Network_System

# 2. Start database
docker-compose up -d

# 3. Install backend dependencies
cd server
npm install

# 4. Setup backend environment
cp .env.example .env
# Edit .env with your credentials

# 5. Install frontend dependencies
cd ../client
npm install

# 6. Setup frontend environment
cp .env.example .env
# Edit .env with your backend URL

# 7. Start both servers
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

---

## 📱 Access Points

### **Development Servers:**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Database**: localhost:5433
- **pgAdmin**: http://localhost:5050

### **Test Credentials:**
```bash
# Login with test account
Email: test@example.com
Password: any password

# Available test users:
- test@example.com (Fresher)
- hr@techcompany.com (HR)
- dev@techcompany.com (Professional)
```

---

## 🔧 Troubleshooting

### **Common Issues:**

#### **1. Port Conflicts:**
```bash
# Check what's using port 5000
netstat -ano | findstr :5000

# Kill process using port
taskkill /PID <PID> /F
```

#### **2. Database Connection:**
```bash
# Check PostgreSQL container
docker-compose ps postgres

# Restart database
docker-compose restart postgres
```

#### **3. Node Modules Issues:**
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### **4. Environment Variables:**
```bash
# Verify .env file exists
ls -la .env

# Check if variables are loaded
node -e "require('dotenv').config(); console.log(process.env.JWT_SECRET)"
```

---

## 📚 Additional Resources

### **Documentation:**
- [API Documentation](./docs/API.md)
- [Frontend Guide](./docs/FRONTEND.md)
- [Database Schema](./docs/DATABASE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

### **Support:**
- **Issues**: Create GitHub issue
- **Discussions**: GitHub Discussions
- **Email**: support@refnet.com

---

## 🎯 Version Compatibility

| Component | Minimum Version | Recommended Version |
|-----------|------------------|---------------------|
| Node.js   | 18.x            | 20.x                |
| npm       | 9.x             | 10.x                |
| PostgreSQL| 15.x            | 15.x                |
| Docker    | 20.x            | 24.x                |
| TypeScript| 5.x             | 5.8.x               |

---

**Last Updated**: May 11, 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✅
