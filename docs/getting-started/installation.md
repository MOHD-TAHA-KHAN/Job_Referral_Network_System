# Installation & Setup Guide

This guide will help you set up the Job Referral Network System on your local machine for development and testing.

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js** v20+ - [Download Node.js](https://nodejs.org/)
- **Docker Desktop** - [Download Docker](https://www.docker.com/products/docker-desktop)
- **Git** - [Download Git](https://git-scm.com/)
- **VS Code** (recommended) - [Download VS Code](https://code.visualstudio.com/)

### Optional Tools
- **PostgreSQL Client** (pgAdmin, DBeaver, or psql)
- **Postman** or similar API testing tool
- **React Developer Tools** browser extension

## System Requirements

- **RAM**: 4GB minimum (8GB recommended)
- **Storage**: 2GB free space
- **Operating System**: Windows 10+, macOS 10.15+, or Ubuntu 18.04+

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Job_Referral_Network_System.git
cd Job_Referral_Network_System
```

### 2. Start PostgreSQL Database

The system uses PostgreSQL as its database. Start it using Docker:

```bash
# Start PostgreSQL and pgAdmin
docker-compose up postgres pgadmin -d
```

**Verify Database is Running:**
```bash
# Check if PostgreSQL is ready
docker exec refnet_postgres pg_isready -U postgres

# Expected output: /var/run/postgresql:5432 - accepting connections
```

### 3. Database Initialization

The database will be automatically initialized with the enhanced schema when you start the server. If you need to manually initialize:

```bash
# Load the initialization script
docker exec -i refnet_postgres psql -U postgres -d referraldb < database/init.sql

# Load seed data (optional)
docker exec -i refnet_postgres psql -U postgres -d referraldb < database/seed_data.sql
```

### 4. Backend Setup

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

#### Environment Configuration

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (PostgreSQL Only)
PG_URI=postgresql://postgres:password@localhost:5433/referraldb

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here

# External Services
CLOUDINARY_URL=your_cloudinary_url
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Client Configuration
CLIENT_URL=http://localhost:5173
```

#### Start the Backend Server

```bash
# Development mode with auto-restart
npm run dev

# Or production mode
npm start
```

**Verify Backend is Running:**
```bash
# Test the health endpoint
curl http://localhost:5000/

# Expected response: {"message":"RefNet API is running!"}
```

### 5. Frontend Setup

Navigate to the client directory and install dependencies:

```bash
cd ../client
npm install
```

#### Start the Frontend Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 6. Verify Complete Setup

Access all services:

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | React application |
| Backend API | http://localhost:5000 | Express API server |
| Database Admin | http://localhost:5050 | pgAdmin interface |
| Database | localhost:5433 | PostgreSQL database |

## Database Access

### pgAdmin Web Interface
1. Open http://localhost:5050
2. Login with:
   - Email: `admin@refnet.com`
   - Password: `admin`
3. Add a new server:
   - Host: `localhost`
   - Port: `5433`
   - Username: `postgres`
   - Password: `password`
   - Database: `referraldb`

### Command Line Access
```bash
# Connect to PostgreSQL
docker exec -it refnet_postgres psql -U postgres -d referraldb

# View all tables
\dt

# Exit
\q
```

## Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Find process using the port
netstat -tulpn | grep :5000

# Kill the process (replace PID)
kill -9 <PID>

# Or use a different port in .env
PORT=5001
```

#### 2. Database Connection Failed
```bash
# Check PostgreSQL container status
docker ps | grep postgres

# Restart PostgreSQL
docker-compose restart postgres

# Check database logs
docker logs refnet_postgres
```

#### 3. Node.js Version Issues
```bash
# Check Node.js version
node --version

# Update to required version
nvm install 20
nvm use 20
```

#### 4. Docker Issues
```bash
# Check Docker status
docker --version
docker-compose --version

# Restart Docker Desktop
# (Use Docker Desktop application)

# Clean up Docker
docker system prune -f
```

#### 5. Permission Issues (Linux/macOS)
```bash
# Fix Docker permissions
sudo usermod -aG docker $USER

# Log out and log back in
```

### Development Environment Issues

#### 1. Module Not Found
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 2. CORS Errors
Ensure the backend CORS configuration includes your frontend URL:
```javascript
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}));
```

#### 3. Environment Variables Not Loading
```bash
# Verify .env file exists and is readable
ls -la .env

# Check for syntax errors
cat .env

# Restart the server after changes
```

## IDE Setup (VS Code)

### Recommended Extensions
```json
{
  "recommendations": [
    "ms-vscode.vscode-json",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "ms-vscode-remote.remote-containers",
    "ms-vscode.vscode-docker"
  ]
}
```

### Workspace Settings
Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  }
}
```

## Next Steps

After successful installation:

1. **Read the Quick Start Guide** - [Quick Start](./quick-start.md)
2. **Explore the Architecture** - [System Architecture](../architecture/system-architecture.md)
3. **Understand the Database** - [ER Diagram](../database/er-diagram.md)
4. **Review API Documentation** - [API Reference](../api/README.md)

## Production Deployment

For production deployment, refer to:
- [Deployment Guide](../deployment/deployment-guide.md)
- [Environment Setup](../deployment/environment.md)
- [Production Best Practices](../deployment/production.md)

## Support

If you encounter issues:

1. Check the [Troubleshooting Guide](../user-guide/troubleshooting.md)
2. Search existing [GitHub Issues](../../issues)
3. Create a new issue with:
   - System information (OS, Node.js version)
   - Error messages
   - Steps to reproduce
   - Expected vs actual behavior

---

**Happy coding!** Your Job Referral Network System is now ready for development.
