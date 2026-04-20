# Database Documentation

This section contains comprehensive documentation for the Job Referral Network System's PostgreSQL database architecture, design, and management.

## Table of Contents

### [ER Diagram & Schema](./er-diagram.md)
- Visual entity relationship diagram
- Complete table schemas with constraints
- Business rules and relationships
- Query patterns and performance considerations

### [Database Relationships](./relationships.md)
- Foreign key constraints and cascade rules
- Unique constraints and data integrity
- Check constraints and validation rules
- Triggers and automated data management

### [Seed Data](./seed-data.md)
- Comprehensive sample data for testing
- Realistic user, job, and referral data
- Data distribution and statistics
- Loading and management instructions

### [Migration Guide](./migration-guide.md)
- PostgreSQL-only migration strategy
- Schema evolution and versioning
- Data migration procedures
- Rollback and recovery plans

## Database Architecture Overview

The Job Referral Network System uses a **PostgreSQL-only architecture** that provides:

### Core Tables
- **Users** - User profiles, authentication, and role management
- **Jobs** - Job postings with detailed requirements and metadata
- **Referrals** - Referral requests and workflow tracking

### Advanced Features
- **Array Fields** - Skills and requirements using PostgreSQL arrays
- **Full-Text Search** - Built-in search capabilities
- **JSONB Support** - Flexible data storage for future enhancements
- **Advanced Indexing** - GIN indexes for array overlap queries
- **Constraint Validation** - Business rule enforcement at database level

### Performance Optimizations
- **Connection Pooling** - Efficient database connection management
- **Query Optimization** - Strategic indexing for common patterns
- **Caching Strategy** - PostgreSQL-based caching replacing Redis
- **Partitioning Ready** - Architecture supports future table partitioning

## Quick Database Stats

| Metric | Value |
|--------|-------|
| **Tables** | 3 core tables + cache tables |
| **Indexes** | 20+ optimized indexes |
| **Constraints** | 15+ business rule constraints |
| **Triggers** | 5 automated data management triggers |
| **Stored Procedures** | 3 utility functions |

## Database Access

### Development Access
```bash
# Connect via Docker
docker exec -it refnet_postgres psql -U postgres -d referraldb

# Connect via pgAdmin
# URL: http://localhost:5050
# Credentials: admin@refnet.com / admin
```

### Connection String
```
postgresql://postgres:password@localhost:5433/referraldb
```

## Schema Quick Reference

### Users Table
```sql
Users (id, name, email, password, role, company, domain, skills[], resumeUrl, 
       referralSuccessRate, isActive, lastLogin, profileCompleted, timestamps)
```

### Jobs Table
```sql
Jobs (id, title, description, company, location, requiredSkills[], domain, 
      salaryMin, salaryMax, experienceLevel, jobType, isActive, 
      applicationCount, viewCount, expiresAt, createdBy, timestamps)
```

### Referrals Table
```sql
Referrals (id, jobId, requesterId, referrerId, status, message, 
           responseMessage, priority, expiresAt, acceptedAt, completedAt, 
           rejectionReason, notes, isUrgent, followUpRequired, 
           followUpDate, timestamps)
```

## Key Relationships

```
Users (HR) 1:N Jobs (created_by)
Users 1:N Referrals (as requester)
Users 1:N Referrals (as referrer)
Jobs 1:N Referrals (for_job)
```

## Business Rules

### Role-Based Access
- **HR users** can create jobs
- **Fresher users** can request referrals
- **Professional users** can receive and respond to referrals

### Data Integrity
- Users cannot refer themselves
- No duplicate referral requests
- Salary validation (max >= min)
- Timeline validation (completed >= accepted)

### Workflow States
```
PENDING -> ACCEPTED -> COMPLETED
PENDING -> REJECTED
PENDING -> WITHDRAWN
```

## Performance Features

### Indexing Strategy
- **GIN indexes** on array fields for skill matching
- **Composite indexes** for multi-column queries
- **Partial indexes** for active data filtering
- **Time-based indexes** for chronological queries

### Query Optimization
- **Array overlap queries** for skill matching
- **Full-text search** on job descriptions
- **Pagination support** for large datasets
- **Aggregation queries** for analytics

## Data Management

### Backup Strategy
```bash
# Create backup
docker exec refnet_postgres pg_dump -U postgres referraldb > backup.sql

# Restore backup
docker exec -i refnet_postgres psql -U postgres referraldb < backup.sql
```

### Maintenance
```bash
# Analyze tables for query optimization
ANALYZE Users;
ANALYZE Jobs;
ANALYZE Referrals;

# Rebuild indexes
REINDEX DATABASE referraldb;
```

## Monitoring

### Performance Queries
```sql
-- Slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Table sizes
SELECT schemaname, tablename, 
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Index usage
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

## Development Tools

### Schema Visualization
- Use [ER Diagram](./er-diagram.md) for visual understanding
- Check [Relationships](./relationships.md) for constraint details
- Review [Seed Data](./seed-data.md) for testing scenarios

### Query Examples
```sql
-- Find jobs matching user skills
SELECT j.* FROM Jobs j
WHERE j.requiredSkills && ARRAY['React', 'Node.js']
  AND j.isActive = true;

-- Get user's referral statistics
SELECT 
  COUNT(*) as total,
  COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as completed,
  ROUND(COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) * 100.0 / COUNT(*), 2) as success_rate
FROM Referrals
WHERE referrerId = $1;
```

## Security Considerations

### Data Protection
- **Password hashing** with bcrypt
- **Email uniqueness** constraints
- **Role-based access** enforcement
- **Input validation** at database level

### Access Control
- **Row-level security** policies
- **Connection encryption** (SSL)
- **Audit logging** for sensitive operations
- **Backup encryption** for data protection

## Future Enhancements

### Planned Features
- **Read replicas** for reporting queries
- **Table partitioning** for large datasets
- **Materialized views** for analytics
- **Advanced search** with Elasticsearch integration

### Scalability
- **Connection pooling** optimization
- **Query caching** strategies
- **Database sharding** preparation
- **Performance monitoring** integration

---

For detailed implementation specifics, refer to the individual documentation sections linked above.
