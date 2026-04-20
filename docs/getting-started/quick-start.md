# Quick Start Guide

Get your Job Referral Network System running in minutes with this streamlined guide.

## One-Command Setup

If you have Docker and Node.js installed, you can start the entire system with:

```bash
# Clone and start everything
git clone https://github.com/YOUR_USERNAME/Job_Referral_Network_System.git
cd Job_Referral_Network_System
docker-compose up postgres pgadmin -d
cd server && npm install && npm run dev &
cd ../client && npm install && npm run dev
```

## Step-by-Step Quick Start

### 1. Start Database (2 minutes)
```bash
docker-compose up postgres pgadmin -d
```

### 2. Start Backend (1 minute)
```bash
cd server
npm install
npm run dev
```
Server runs on: `http://localhost:5000`

### 3. Start Frontend (1 minute)
```bash
cd ../client
npm install
npm run dev
```
Frontend runs on: `http://localhost:5173`

### 4. Access the System
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Database Admin**: http://localhost:5050

## Test the System

### Create Test Users

1. **Register an HR User**:
   - Email: `hr@test.com`
   - Role: HR
   - Company: `Test Corp`

2. **Register a Professional**:
   - Email: `pro@test.com`
   - Role: PROFESSIONAL
   - Company: `Tech Solutions`
   - Skills: `React, Node.js, PostgreSQL`

3. **Register a Fresher**:
   - Email: `fresher@test.com`
   - Role: FRESHER
   - Skills: `JavaScript, React, CSS`

### Create a Test Job

1. Login as HR user
2. Navigate to Jobs section
3. Create a job with:
   - Title: `Frontend Developer`
   - Company: `Test Corp`
   - Required Skills: `React, TypeScript, CSS`
   - Location: `Remote`

### Test Referral Flow

1. Login as Fresher
2. Find the Frontend Developer job
3. Click "Request Referral"
4. Select the Professional user
5. Add a message and submit

6. Login as Professional
7. Check "My Referrals" section
8. Accept or reject the referral request

## Load Sample Data

For a complete demo experience, load the seed data:

```bash
# Load comprehensive sample data
docker exec -i refnet_postgres psql -U postgres -d referraldb < database/seed_data.sql
```

This creates:
- 15 users (3 HR, 6 Professionals, 6 Freshers)
- 10 job postings
- 11 referral requests in various statuses

## Default Credentials

### Database Access
- **pgAdmin**: http://localhost:5050
- **Email**: admin@refnet.com
- **Password**: admin
- **Database**: referraldb
- **Username**: postgres
- **Password**: password

### Sample Users (after loading seed data)
| Role | Email | Password | Company |
|------|-------|----------|---------|
| HR | sarah.j@techcorp.com | password123 | TechCorp Solutions |
| Professional | david.k@techcorp.com | password123 | TechCorp Solutions |
| Fresher | alex.t@university.edu | password123 | University |

## Verify Everything Works

### Health Checks
```bash
# Backend health
curl http://localhost:5000/
# Response: {"message":"RefNet API is running!"}

# Jobs endpoint
curl http://localhost:5000/api/jobs
# Response: List of jobs (empty if no seed data)

# Database connection
docker exec refnet_postgres pg_isready -U postgres
# Response: accepting connections
```

### Frontend Tests
1. Open http://localhost:5173
2. Register a new user
3. Login successfully
4. Navigate to different pages
5. Test job search functionality

## Common Quick Fixes

### Port Conflicts
If ports are already in use:
```bash
# Kill processes on ports 5000, 5173, 5433
netstat -tulpn | grep :5000
kill -9 <PID>

# Or use different ports
export PORT=5001
```

### Database Issues
```bash
# Restart database
docker-compose restart postgres

# Check logs
docker logs refnet_postgres
```

### Module Issues
```bash
# Clear and reinstall
cd server && rm -rf node_modules && npm install
cd ../client && rm -rf node_modules && npm install
```

## What's Next?

### For Development
- [Architecture Overview](../architecture/system-architecture.md)
- [Database Schema](../database/er-diagram.md)
- [API Documentation](../api/README.md)

### For Features
- [User Guide](../user-guide/features.md)
- [Troubleshooting](../user-guide/troubleshooting.md)

### For Deployment
- [Deployment Guide](../deployment/deployment-guide.md)
- [Production Setup](../deployment/production.md)

## Need Help?

1. **Check Installation Issues** - [Installation Guide](./installation.md)
2. **Review Troubleshooting** - [Troubleshooting Guide](../user-guide/troubleshooting.md)
3. **Search Documentation** - [Documentation Index](../README.md)

---

**In 5 minutes, you should have a fully functional Job Referral Network System running locally!** 

The system includes user authentication, job management, referral workflows, and real-time communication - all ready for development and testing.
