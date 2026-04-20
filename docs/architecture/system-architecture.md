# System Architecture

This document provides a comprehensive overview of the Job Referral Network System's architecture, including component interactions, data flow, and design decisions.

## High-Level Architecture

### System Overview

```
                    +-------------------+
                    |   Frontend (React) |
                    |   Port: 5173       |
                    +-------------------+
                              |
                              | HTTP/WebSocket
                              v
                    +-------------------+
                    |   Backend API      |
                    |   Port: 5000       |
                    +-------------------+
                              |
                              | SQL
                              v
                    +-------------------+
                    |   PostgreSQL      |
                    |   Port: 5433       |
                    +-------------------+
```

### Component Interactions

```
Frontend Components:
    +-------------------+     +-------------------+     +-------------------+
    |   Auth Module     |     |   Jobs Module     |     | Referrals Module  |
    +-------------------+     +-------------------+     +-------------------+
            |                       |                       |
            v                       v                       v
    +-------------------+     +-------------------+     +-------------------+
    |   API Gateway     |---->|   Business Logic  |<----|   Real-time Hub    |
    +-------------------+     +-------------------+     +-------------------+
            |                       |                       |
            v                       v                       v
    +-------------------+     +-------------------+     +-------------------+
    |   Auth Service    |     |   Job Service     |     |  Message Service   |
    +-------------------+     +-------------------+     +-------------------+
            |                       |                       |
            +-----------------------+-----------------------+
                                    |
                                    v
                    +-------------------+
                    |   Data Layer       |
                    +-------------------+
```

## Technology Stack Architecture

### Frontend Architecture

```
React Application Structure:
    +-------------------+
    |      App.jsx      |
    +-------------------+
            |
            v
    +-------------------+
    |   Router Setup    |
    +-------------------+
            |
            v
    +-------------------+     +-------------------+
    |  Protected Routes |     |  Public Routes    |
    +-------------------+     +-------------------+
            |                       |
            v                       v
    +-------------------+     +-------------------+
    |   Pages/Views     |     |   Auth Pages      |
    +-------------------+     +-------------------+
            |
            v
    +-------------------+
    |   Components      |
    +-------------------+
            |
            v
    +-------------------+
    |   Services/API    |
    +-------------------+
```

**Frontend Technologies:**
- **React 18**: Modern UI with concurrent features
- **Vite**: Fast development server and build tool
- **React Router v6**: Client-side routing with lazy loading
- **Zustand**: Lightweight state management
- **TailwindCSS**: Utility-first CSS framework
- **Socket.io-client**: Real-time communication

### Backend Architecture

```
Express.js Application Structure:
    +-------------------+
    |      app.js       |
    +-------------------+
            |
            v
    +-------------------+
    |   Middleware      |
    +-------------------+
            |
            v
    +-------------------+
    |   Routes          |
    +-------------------+
            |
            v
    +-------------------+
    |   Controllers     |
    +-------------------+
            |
            v
    +-------------------+
    |   Services        |
    +-------------------+
            |
            v
    +-------------------+
    |   Models/ORM      |
    +-------------------+
            |
            v
    +-------------------+
    |   Database        |
    +-------------------+
```

**Backend Technologies:**
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **Sequelize**: ORM for PostgreSQL
- **Socket.io**: Real-time communication
- **JWT**: Authentication
- **bcryptjs**: Password hashing

### Database Architecture

```
PostgreSQL Database Structure:
    +-------------------+
    |   Connection Pool |
    +-------------------+
            |
            v
    +-------------------+
    |   Query Engine    |
    +-------------------+
            |
            v
    +-------------------+
    |   Tables          |
    +-------------------+
            |
            v
    +-------------------+
    |   Indexes         |
    +-------------------+
            |
            v
    +-------------------+
    |   Constraints     |
    +-------------------+
```

**Database Features:**
- **Connection Pooling**: 20 max connections
- **GIN Indexes**: Array and full-text search
- **Foreign Keys**: Referential integrity
- **Triggers**: Automated data validation
- **JSONB Support**: Flexible data storage

## Data Flow Architecture

### Authentication Flow

```
User Login Request:
    Client (React)
        |
        | POST /api/auth/login
        v
    Backend (Express)
        |
        | Validate Credentials
        v
    Database (PostgreSQL)
        |
        | User Verification
        v
    Backend
        |
        | Generate JWT Tokens
        v
    Client
        |
        | Store Access Token (memory)
        | Store Refresh Token (cookie)
```

### Job Search Flow

```
Job Search Request:
    Client
        |
        | GET /api/jobs?skills=React&location=SF
        v
    Backend
        |
        | Parse Query Parameters
        v
    Database
        |
        | SELECT * FROM Jobs 
        | WHERE requiredSkills && ARRAY['React']
        |   AND location = 'SF'
        v
    Backend
        |
        | Format Response
        v
    Client
        |
        | Display Job Listings
```

### Referral Request Flow

```
Referral Request:
    Client (Fresher)
        |
        | POST /api/referrals
        v
    Backend
        |
        | Validate Request
        | Check Business Rules
        v
    Database
        |
        | INSERT INTO Referrals
        v
    Backend
        |
        | Send Real-time Notification
        v
    Client (Professional)
        |
        | WebSocket Event: new_referral
```

## Security Architecture

### Authentication Layers

```
Security Layers:
    +-------------------+
    |   Network Layer   |  - TLS/SSL Encryption
    +-------------------+
            |
            v
    +-------------------+
    |   Application Layer| - JWT Authentication
    +-------------------+
            |
            v
    +-------------------+
    |   Authorization    | - Role-Based Access
    +-------------------+
            |
            v
    +-------------------+
    |   Data Layer       | - Row-Level Security
    +-------------------+
```

### JWT Token Strategy

```
JWT Authentication:
    +-------------------+
    |   Access Token    |  - 15 minutes
    |   (Memory)        |  - API requests
    +-------------------+
            |
            v
    +-------------------+
    |   Refresh Token   |  - 7 days
    |   (HTTP-only)     |  - Token renewal
    +-------------------+
            |
            v
    +-------------------+
    |   Blacklist Table |  - Logout tracking
    +-------------------+
```

## Performance Architecture

### Database Optimization

```
Performance Strategy:
    +-------------------+
    |   Indexing        |  - GIN for arrays
    +-------------------+
            |
            v
    +-------------------+
    |   Query Cache     |  - PostgreSQL cache
    +-------------------+
            |
            v
    +-------------------+
    | Connection Pool   |  - 20 max connections
    +-------------------+
            |
            v
    +-------------------+
    |   Pagination      |  - Efficient data loading
    +-------------------+
```

### Frontend Optimization

```
Frontend Performance:
    +-------------------+
    |   Code Splitting  |  - Lazy loading
    +-------------------+
            |
            v
    +-------------------+
    |   Bundle Size     |  - Tree shaking
    +-------------------+
            |
            v
    +-------------------+
    |   Caching         |  - Browser cache
    +-------------------+
            |
            v
    +-------------------+
    |   Debouncing      |  - Search optimization
    +-------------------+
```

## Real-time Architecture

### WebSocket Communication

```
Real-time Events:
    +-------------------+
    |   Client Event     |  - User connects
    +-------------------+
            |
            v
    +-------------------+
    |   Socket.io Hub   |  - Event routing
    +-------------------+
            |
            v
    +-------------------+
    |   Event Handlers  |  - Business logic
    +-------------------+
            |
            v
    +-------------------+
    |   Database Update |  - Persist changes
    +-------------------+
            |
            v
    +-------------------+
    |   Broadcast Event |  - Notify clients
    +-------------------+
```

### Event Types

```javascript
// Real-time Events
const Events = {
  // User Events
  USER_CONNECTED: 'user_connected',
  USER_DISCONNECTED: 'user_disconnected',
  
  // Referral Events
  REFERRAL_REQUESTED: 'referral_requested',
  REFERRAL_ACCEPTED: 'referral_accepted',
  REFERRAL_REJECTED: 'referral_rejected',
  REFERRAL_COMPLETED: 'referral_completed',
  
  // Job Events
  JOB_CREATED: 'job_created',
  JOB_UPDATED: 'job_updated',
  JOB_EXPIRED: 'job_expired',
  
  // Message Events
  MESSAGE_SENT: 'message_sent',
  MESSAGE_READ: 'message_read'
};
```

## Scalability Architecture

### Horizontal Scaling

```
Scaling Strategy:
    +-------------------+
    |   Load Balancer   |  - nginx/HAProxy
    +-------------------+
            |
            v
    +-------------------+
    |   API Servers     |  - Multiple instances
    +-------------------+
            |
            v
    +-------------------+
    |   Database Pool   |  - Connection sharing
    +-------------------+
            |
            v
    +-------------------+
    |   Read Replicas   |  - Query distribution
    +-------------------+
```

### Microservices Readiness

```
Service Boundaries:
    +-------------------+
    |   Auth Service    |  - User management
    +-------------------+
            |
            v
    +-------------------+
    |   Job Service     |  - Job management
    +-------------------+
            |
            v
    +-------------------+
    |   Referral Service|  - Referral workflow
    +-------------------+
            |
            v
    +-------------------+
    |   Message Service |  - Real-time chat
    +-------------------+
```

## Monitoring Architecture

### Application Monitoring

```
Monitoring Stack:
    +-------------------+
    |   Health Checks   |  - API endpoints
    +-------------------+
            |
            v
    +-------------------+
    |   Metrics         |  - Performance data
    +-------------------+
            |
            v
    +-------------------+
    |   Logging         |  - Error tracking
    +-------------------+
            |
            v
    +-------------------+
    |   Alerts          |  - Notification system
    +-------------------+
```

### Database Monitoring

```
Database Monitoring:
    +-------------------+
    |   Query Stats     |  - Slow queries
    +-------------------+
            |
            v
    +-------------------+
    |   Connection Pool |  - Pool usage
    +-------------------+
            |
            v
    +-------------------+
    |   Resource Usage  |  - CPU/Memory/Disk
    +-------------------+
            |
            v
    +-------------------+
    |   Backup Status   |  - Backup verification
    +-------------------+
```

## Development Architecture

### Code Organization

```
Project Structure:
    Job_Referral_Network_System/
    |
    +-- client/                 # Frontend React app
    |   |
    |   +-- src/
    |   |   |
    |   |   +-- components/     # Reusable components
    |   |   +-- pages/         # Page components
    |   |   +-- services/      # API services
    |   |   +-- store/         # State management
    |   |   +-- utils/         # Utility functions
    |   |
    |   +-- public/             # Static assets
    |
    +-- server/                 # Backend Node.js app
    |   |
    |   +-- src/
    |   |   |
    |   |   +-- controllers/   # Request handlers
    |   |   +-- services/      # Business logic
    |   |   +-- models/        # Database models
    |   |   +-- middleware/    # Express middleware
    |   |   +-- utils/         # Utility functions
    |   |   +-- config/        # Configuration
    |   |
    |   +-- database/           # Database scripts
    |
    +-- docs/                   # Documentation
    |
    +-- docker-compose.yml      # Container orchestration
```

### Development Workflow

```
Development Process:
    +-------------------+
    |   Feature Branch  |  - Git flow
    +-------------------+
            |
            v
    +-------------------+
    |   Local Dev       |  - Docker Compose
    +-------------------+
            |
            v
    +-------------------+
    |   Code Review     |  - Pull requests
    +-------------------+
            |
            v
    +-------------------+
    |   CI/CD Pipeline  |  - Automated testing
    +-------------------+
            |
            v
    +-------------------+
    |   Deployment      |  - Staging/Production
    +-------------------+
```

## Future Architecture Enhancements

### Planned Improvements

1. **Microservices Migration**
   - Service decomposition
   - API Gateway implementation
   - Service discovery

2. **Advanced Caching**
   - Redis cluster
   - CDN integration
   - Application-level caching

3. **Event Sourcing**
   - Complete audit trail
   - Event replay capabilities
   - CQRS pattern

4. **GraphQL API**
   - Flexible data fetching
   - Single endpoint
   - Real-time subscriptions

This system architecture provides a solid foundation for the Job Referral Network System with clear separation of concerns, scalability considerations, and modern development practices.
