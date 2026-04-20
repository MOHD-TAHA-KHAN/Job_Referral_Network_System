# Project Overview

## What is the Job Referral Network System?

The Job Referral Network System is a comprehensive platform that bridges the gap between freshers and IT professionals/HRs by enabling direct referral requests, smart matching, and real-time communication.

## Problem Statement

In India, most job referrals happen through personal connections - freshers without a network are left out. **RefNet** solves this by creating a structured platform where freshers can discover and request referrals from verified IT professionals and HRs at their target companies.

## Key Features

| Feature | Description |
|---|---|
| **Role-Based Access** | Three distinct roles: Fresher, Professional, HR |
| **Smart Matching** | AI-powered algorithm matches freshers with suitable professionals |
| **Job Listings** | Comprehensive job board with advanced search and filtering |
| **Referral Workflow** | Complete referral request lifecycle (PENDING ACCEPTED COMPLETED) |
| **Real-time Communication** | In-app messaging between requesters and referrers |
| **Profile Management** | Detailed profiles with skills, experience, and resume uploads |
| **Analytics Dashboard** | Personalized statistics and activity tracking |

## System Architecture

### Technology Stack

#### Frontend
- **React 18** with Vite for fast development
- **React Router v6** for navigation
- **Zustand** for state management
- **TailwindCSS** for styling
- **Socket.io-client** for real-time features

#### Backend
- **Node.js + Express.js** REST API
- **Socket.io** for real-time messaging
- **JWT** for authentication (access + refresh tokens)
- **bcryptjs** for password hashing
- **Sequelize** for PostgreSQL ORM

#### Database
- **PostgreSQL** as the single database solution
- **Full-text search** capabilities
- **Array fields** for skills and requirements
- **Advanced indexing** for performance

#### Infrastructure
- **Docker** for containerization
- **pgAdmin** for database management
- **Environment-based configuration**

## User Roles & Permissions

### HR Users
- Create and manage job postings
- View referral analytics
- Manage company profiles

### Professional Users
- Receive referral requests
- Respond to requests (Accept/Reject)
- Track referral success rates
- Message with requesters

### Fresher Users
- Browse and search job listings
- Request referrals from professionals
- Track referral status
- Manage profile and resume

## Key Workflows

### 1. Job Creation Workflow
```
HR User -> Create Job -> Job Posted -> Available for Referrals
```

### 2. Referral Request Workflow
```
Fresher -> Find Job -> Request Referral -> Professional Responds -> Status Update
```

### 3. Smart Matching Algorithm
```
Fresher Skills + Job Requirements -> Score Professionals -> Top Matches Displayed
```

## Database Overview

The system uses a **PostgreSQL-only architecture** with three main tables:

### Users Table
- Stores user information and authentication data
- Supports three user roles with different permissions
- Includes skills arrays and profile completion tracking

### Jobs Table
- Contains job postings with detailed requirements
- Supports advanced search and filtering
- Tracks application and view counts

### Referrals Table
- Manages referral requests and responses
- Tracks complete workflow lifecycle
- Includes priority levels and follow-up tracking

## Performance Features

### Database Optimizations
- **GIN indexes** on array fields for fast skill matching
- **Composite indexes** for common query patterns
- **Full-text search** for job descriptions
- **Connection pooling** for optimal performance

### Application Features
- **Lazy loading** for large datasets
- **Caching strategies** for frequently accessed data
- **Pagination** for job listings
- **Debounced search** for better UX

## Security Features

### Authentication & Authorization
- **JWT tokens** with refresh token rotation
- **Role-based access control** (RBAC)
- **Password hashing** with bcrypt
- **Session management** with PostgreSQL

### Data Protection
- **Input validation** and sanitization
- **SQL injection prevention** with parameterized queries
- **XSS protection** with content security policy
- **Rate limiting** for API endpoints

## Development Philosophy

### Code Quality
- **Clean code principles** with proper separation of concerns
- **TypeScript-style validation** in JavaScript
- **Comprehensive error handling** and logging
- **Unit and integration testing**

### Maintainability
- **Modular architecture** for easy feature additions
- **Comprehensive documentation** for onboarding
- **Environment-based configuration** management
- **Automated testing** and CI/CD readiness

## Scalability Considerations

### Database Scaling
- **Connection pooling** for concurrent users
- **Read replicas** for reporting (future enhancement)
- **Partitioning strategy** for large datasets
- **Archive policies** for historical data

### Application Scaling
- **Horizontal scaling** with load balancers
- **Microservices-ready** architecture
- **Caching layers** for performance
- **CDN integration** for static assets

## Success Metrics

### User Engagement
- **Active user ratio** (target: 70%+)
- **Referral completion rate** (target: 60%+)
- **Job application conversion** (target: 25%+)

### System Performance
- **API response time** (target: <200ms)
- **Database query time** (target: <50ms)
- **Page load time** (target: <2s)

### Business Impact
- **Referral success rate** improvement
- **Time-to-hire reduction**
- **Candidate quality improvement**

## Future Enhancements

### Planned Features
- **AI-powered recommendations**
- **Video introductions**
- **Company culture insights**
- **Salary benchmarking**
- **Interview preparation tools**

### Technical Improvements
- **Microservices migration**
- **GraphQL API**
- **Mobile applications**
- **Advanced analytics**
- **Machine learning integration**

---

This overview provides a comprehensive understanding of the Job Referral Network System's purpose, architecture, and capabilities. For implementation details, refer to the specific documentation sections.
