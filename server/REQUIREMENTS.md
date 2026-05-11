# RefNet Backend Requirements

## 📋 Backend Dependencies

This document outlines all requirements for setting up the RefNet backend API server.

### 🔧 Prerequisites

#### **Required Software:**
- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher
- **PostgreSQL**: Version 15.x or higher
- **Docker**: Version 20.x or higher (for containerized database)

#### **Development Tools (Recommended):**
- **Postman**: For API testing
- **pgAdmin**: For database management
- **VS Code**: With Node.js and PostgreSQL extensions

---

## 📦 Package Dependencies

### **Core Dependencies:**
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
  }
}
```

#### **Dependency Details:**
- **express**: Web framework for Node.js
- **cors**: Cross-Origin Resource Sharing middleware
- **dotenv**: Environment variable management
- **jsonwebtoken**: JWT token generation and verification
- **bcryptjs**: Password hashing and comparison
- **passport**: Authentication middleware
- **passport-google-oauth20**: Google OAuth strategy
- **pg**: PostgreSQL client for Node.js
- **sequelize**: ORM for database operations
- **axios**: HTTP client for external API calls
- **cookie-parser**: Cookie parsing middleware
- **express-session**: Session management
- **helmet**: Security middleware
- **morgan**: HTTP request logger
- **multer**: File upload handling
- **cloudinary**: Cloud storage service
- **multer-storage-cloudinary**: Cloudinary storage engine
- **pg-hstore**: PostgreSQL hstore data type support

### **Development Dependencies:**
```json
{
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

#### **Development Tools Details:**
- **@types/***: TypeScript definitions for all dependencies
- **typescript**: TypeScript compiler
- **ts-node**: TypeScript execution in Node.js
- **nodemon**: Auto-restart server on file changes

---

## 🔧 Installation Commands

### **Quick Setup:**
```bash
# Navigate to server directory
cd server

# Install all dependencies
npm install

# Start development server
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start

# Run tests
npm test
```

### **Package Scripts:**
```json
{
  "scripts": {
    "start": "node dist/app.js",
    "dev": "nodemon --exec ts-node app.ts",
    "build": "tsc",
    "test": "jest"
  }
}
```

---

## 🌍 Environment Configuration

### **Required Environment Variables:**
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

### **Setup Steps:**
```bash
# Create environment file
cp .env.example .env

# Generate secure JWT secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Edit .env with your configuration
# Use your actual database URI and Google OAuth credentials
```

---

## 🗄️ Database Setup

### **PostgreSQL Configuration:**
```bash
# Option 1: Docker (Recommended)
docker-compose up -d postgres

# Option 2: Local PostgreSQL
createdb referraldb
psql -U postgres -d referraldb -f ../database/init.sql
```

### **Database Schema:**
```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('FRESHER', 'PROFESSIONAL', 'HR')),
    company VARCHAR(255),
    skills TEXT[],
    resume_url VARCHAR(500),
    referral_success_rate DECIMAL(5,2) DEFAULT 0.0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Jobs table
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    description TEXT,
    requirements TEXT,
    experience_level VARCHAR(50),
    salary VARCHAR(100),
    job_type VARCHAR(50),
    created_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Referrals table
CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id),
    requester_id UUID REFERENCES users(id),
    referrer_id UUID REFERENCES users(id),
    status VARCHAR(20) CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔐 Authentication System

### **JWT Implementation:**
```typescript
// Token generation
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};
```

### **Google OAuth Setup:**
```typescript
// Passport configuration
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  // Handle OAuth callback
}));
```

---

## 🛡️ Security Features

### **Middleware Configuration:**
```typescript
// CORS setup
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

// Security headers
app.use(helmet());

// Rate limiting
const rateLimit = require('express-rate-limit');
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));
```

### **Security Best Practices:**
- **Password Hashing**: bcryptjs with salt rounds
- **JWT Tokens**: Short-lived access tokens, long-lived refresh tokens
- **Input Validation**: Request body validation
- **SQL Injection Prevention**: Sequelize ORM
- **XSS Protection**: Helmet middleware
- **CSRF Protection**: CSRF tokens for state-changing operations

---

## 📊 API Endpoints

### **Authentication Routes:**
```typescript
POST /api/auth/login      // User login
POST /api/auth/register   // User registration
GET  /api/auth/me         // Get current user
POST /api/auth/logout     // User logout
GET  /api/auth/google     // Google OAuth
GET  /api/auth/google/callback // OAuth callback
```

### **Job Routes:**
```typescript
GET    /api/jobs           // Get all jobs
GET    /api/jobs/:id       // Get job by ID
POST   /api/jobs           // Create job (HR only)
PUT    /api/jobs/:id       // Update job (HR only)
DELETE /api/jobs/:id       // Delete job (HR only)
```

### **Profile Routes:**
```typescript
GET    /api/profile        // Get user profile
PATCH  /api/profile        // Update profile
GET    /api/profile/stats  // Get profile statistics
GET    /api/profile/users  // Get users by role
```

### **Referral Routes:**
```typescript
GET    /api/referrals/my-referrals // Get user referrals
POST   /api/referrals              // Create referral
GET    /api/referrals/:id          // Get referral by ID
PATCH  /api/referrals/:id/status   // Update referral status
GET    /api/referrals/job/:jobId   // Get referrals for job
```

---

## 🚀 Development Workflow

### **Local Development:**
```bash
# Start database
docker-compose up -d postgres

# Start backend server
cd server
npm run dev

# Access API documentation
# http://localhost:5000
```

### **Database Operations:**
```bash
# Connect to database
docker-compose exec postgres psql -U postgres -d referraldb

# View tables
\dt

# Run queries
SELECT * FROM users LIMIT 10;
```

---

## 🐛 Troubleshooting

### **Common Issues:**

#### **1. Database Connection:**
```bash
# Check PostgreSQL container
docker-compose ps postgres

# Test connection
psql -h localhost -p 5433 -U postgres -d referraldb

# Restart database
docker-compose restart postgres
```

#### **2. Environment Variables:**
```bash
# Check if .env file exists
ls -la .env

# Verify variables
node -e "require('dotenv').config(); console.log(process.env.JWT_SECRET)"
```

#### **3. Port Conflicts:**
```bash
# Check what's using port 5000
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F
```

#### **4. TypeScript Compilation:**
```bash
# Check TypeScript errors
npx tsc --noEmit

# Clear and rebuild
rm -rf dist
npm run build
```

---

## 📦 Deployment Configuration

### **Production Environment:**
```bash
# Build application
npm run build

# Start production server
npm start

# Environment variables for production
NODE_ENV=production
PORT=5000
PG_URI=postgresql://user:pass@host:5432/dbname
```

### **Docker Deployment:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

---

## 🔧 Configuration Files

### **TypeScript Configuration:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### **Nodemon Configuration:**
```json
// nodemon.json
{
  "watch": ["src"],
  "ext": "ts",
  "ignore": ["src/**/*.spec.ts"],
  "exec": "ts-node src/app.ts"
}
```

---

## 📚 Additional Resources

### **Documentation:**
- [Express.js Documentation](https://expressjs.com/)
- [Sequelize Documentation](https://sequelize.org/)
- [Passport.js Documentation](http://www.passportjs.org/)
- [JWT Documentation](https://jwt.io/)

### **Tools:**
- [Postman](https://www.postman.com/) - API testing
- [pgAdmin](https://www.pgadmin.org/) - Database management
- [Docker Hub](https://hub.docker.com/) - Container images

---

**Last Updated**: May 11, 2026  
**Version**: 1.0.0  
**Framework**: Express.js + TypeScript + PostgreSQL
