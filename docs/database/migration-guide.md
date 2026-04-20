# Database Migration Guide

This guide covers the migration from the hybrid PostgreSQL+MongoDB+Redis architecture to a PostgreSQL-only system.

## Migration Overview

### Before Migration
- **PostgreSQL**: Users, Jobs, Referrals (structured data)
- **MongoDB**: Messages, Activity logs, Profiles (flexible data)
- **Redis**: Sessions, Caching, Rate limiting

### After Migration
- **PostgreSQL**: All data (structured + flexible + caching)

## Migration Strategy

### Phase 1: Data Assessment
```sql
-- Analyze existing data structure
SELECT 
  schemaname,
  tablename,
  n_tup_ins as inserts,
  n_tup_upd as updates,
  n_tup_del as deletes,
  n_live_tup as live_tuples,
  n_dead_tup as dead_tuples
FROM pg_stat_user_tables;
```

### Phase 2: Schema Enhancement
```sql
-- Add cache tables to replace Redis
CREATE TABLE cache_sessions (
  id VARCHAR(255) PRIMARY KEY,
  data JSONB,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE cache_rate_limits (
  key VARCHAR(255) PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL
);

-- Add message tables to replace MongoDB
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES Users(id),
  receiver_id UUID NOT NULL REFERENCES Users(id),
  referral_id UUID REFERENCES Referrals(id),
  content TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'TEXT',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add activity logs table
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES Users(id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Phase 3: Data Migration

#### MongoDB to PostgreSQL Migration
```sql
-- Convert MongoDB documents to JSONB
CREATE TABLE migrated_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES Users(id),
  profile_data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Example migration script
INSERT INTO migrated_profiles (user_id, profile_data)
SELECT 
  u.id,
  jsonb_build_object(
    'education', jsonb_build_array(
      jsonb_build_object('institution', 'University', 'degree', 'BS', 'year', 2020)
    ),
    'experience', jsonb_build_array(
      jsonb_build_object('company', 'Tech Corp', 'position', 'Developer', 'years', 2)
    ),
    'projects', jsonb_build_array(
      jsonb_build_object('name', 'Project X', 'description', 'Web application', 'tech', ARRAY['React', 'Node.js'])
    )
  )
FROM Users u WHERE u.role IN ('PROFESSIONAL', 'FRESHER');
```

#### Redis to PostgreSQL Migration
```sql
-- Migrate session data
INSERT INTO cache_sessions (id, data, expires_at)
SELECT 
  session_key,
  jsonb_build_object('user_id', user_id, 'role', role, 'permissions', permissions),
  NOW() + INTERVAL '7 days'
FROM redis_sessions_table;

-- Migrate rate limit data
INSERT INTO cache_rate_limits (key, count, window_start, expires_at)
SELECT 
  rate_limit_key,
  request_count,
  window_timestamp,
  NOW() + INTERVAL '1 hour'
FROM redis_rate_limits_table;
```

## Migration Scripts

### Complete Migration Script
```sql
-- Step 1: Backup existing data
CREATE TABLE users_backup AS SELECT * FROM Users;
CREATE TABLE jobs_backup AS SELECT * FROM Jobs;
CREATE TABLE referrals_backup AS SELECT * FROM Referrals;

-- Step 2: Add new tables
-- (Cache tables, message tables, activity logs as shown above)

-- Step 3: Migrate data
-- (Migration queries as shown above)

-- Step 4: Update application configuration
-- Update .env file to remove MongoDB and Redis references

-- Step 5: Verify migration
SELECT 
  'Users' as table_name, COUNT(*) as count FROM Users
UNION ALL
SELECT 'Jobs', COUNT(*) FROM Jobs
UNION ALL
SELECT 'Referrals', COUNT(*) FROM Referrals
UNION ALL
SELECT 'Messages', COUNT(*) FROM messages
UNION ALL
SELECT 'Activity Logs', COUNT(*) FROM activity_logs
UNION ALL
SELECT 'Cache Sessions', COUNT(*) FROM cache_sessions;
```

## Rollback Plan

### Rollback Script
```sql
-- Step 1: Backup new data
CREATE TABLE messages_rollback AS SELECT * FROM messages;
CREATE TABLE activity_logs_rollback AS SELECT * FROM activity_logs;
CREATE TABLE cache_sessions_rollback AS SELECT * FROM cache_sessions;

-- Step 2: Restore original data
TRUNCATE TABLE Users, Jobs, Referrals;
INSERT INTO Users SELECT * FROM users_backup;
INSERT INTO Jobs SELECT * FROM jobs_backup;
INSERT INTO Referrals SELECT * FROM referrals_backup;

-- Step 3: Drop new tables
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS activity_logs;
DROP TABLE IF EXISTS cache_sessions;
DROP TABLE IF EXISTS cache_rate_limits;

-- Step 4: Update configuration back to hybrid mode
```

## Validation Procedures

### Data Integrity Checks
```sql
-- Check user data integrity
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN email IS NOT NULL THEN 1 END) as users_with_email,
  COUNT(CASE WHEN role IN ('HR', 'PROFESSIONAL', 'FRESHER') THEN 1 END) as valid_roles
FROM Users;

-- Check foreign key integrity
SELECT 
  COUNT(*) as orphaned_jobs
FROM Jobs j LEFT JOIN Users u ON j.createdBy = u.id WHERE u.id IS NULL;

SELECT 
  COUNT(*) as orphaned_referrals
FROM Referrals r 
LEFT JOIN Users u1 ON r.requesterId = u1.id
LEFT JOIN Users u2 ON r.referrerId = u2.id
LEFT JOIN Jobs j ON r.jobId = j.id
WHERE u1.id IS NULL OR u2.id IS NULL OR j.id IS NULL;
```

### Performance Validation
```sql
-- Test query performance
EXPLAIN ANALYZE 
SELECT u.name, j.title, r.status
FROM Users u
JOIN Jobs j ON u.id = j.createdBy
JOIN Referrals r ON j.id = r.jobId
WHERE u.role = 'HR'
LIMIT 10;

-- Test skill matching performance
EXPLAIN ANALYZE
SELECT j.* 
FROM Jobs j
WHERE j.requiredSkills && ARRAY['React', 'Node.js']
  AND j.isActive = true
ORDER BY j.createdAt DESC
LIMIT 20;
```

## Post-Migration Optimization

### Index Optimization
```sql
-- Add indexes for new tables
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_referral_id ON messages(referral_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

CREATE INDEX idx_cache_sessions_expires_at ON cache_sessions(expires_at);
CREATE INDEX idx_cache_rate_limits_expires_at ON cache_rate_limits(expires_at);
```

### Performance Tuning
```sql
-- Update table statistics
ANALYZE Users;
ANALYZE Jobs;
ANALYZE Referrals;
ANALYZE messages;
ANALYZE activity_logs;
ANALYZE cache_sessions;

-- Configure connection pooling
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
```

## Monitoring

### Migration Monitoring
```sql
-- Create monitoring view
CREATE VIEW migration_status AS
SELECT 
  'Users' as table_name, COUNT(*) as record_count, 'Migrated' as status FROM Users
UNION ALL
SELECT 'Jobs', COUNT(*), 'Migrated' FROM Jobs
UNION ALL
SELECT 'Referrals', COUNT(*), 'Migrated' FROM Referrals
UNION ALL
SELECT 'Messages', COUNT(*), 'New' FROM messages
UNION ALL
SELECT 'Activity Logs', COUNT(*), 'New' FROM activity_logs;

-- Monitor query performance
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  rows
FROM pg_stat_statements
WHERE query LIKE '%Users%' OR query LIKE '%Jobs%' OR query LIKE '%Referrals%'
ORDER BY mean_time DESC;
```

## Troubleshooting

### Common Issues

#### 1. Data Loss
```sql
-- Check for missing data
SELECT 
  (SELECT COUNT(*) FROM users_backup) - (SELECT COUNT(*) FROM Users) as users_lost,
  (SELECT COUNT(*) FROM jobs_backup) - (SELECT COUNT(*) FROM Jobs) as jobs_lost,
  (SELECT COUNT(*) FROM referrals_backup) - (SELECT COUNT(*) FROM Referrals) as referrals_lost;
```

#### 2. Performance Degradation
```sql
-- Check slow queries
SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;

-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

#### 3. Constraint Violations
```sql
-- Check for constraint violations
SELECT conname, conrelid::regclass AS table_name
FROM pg_constraint
WHERE contype = 'f' AND convalidated = false;
```

## Maintenance

### Regular Maintenance Tasks
```sql
-- Clean up expired cache entries
DELETE FROM cache_sessions WHERE expires_at < NOW();
DELETE FROM cache_rate_limits WHERE expires_at < NOW();

-- Archive old activity logs
CREATE TABLE activity_logs_archive AS SELECT * FROM activity_logs WHERE created_at < NOW() - INTERVAL '90 days';
DELETE FROM activity_logs WHERE created_at < NOW() - INTERVAL '90 days';

-- Update statistics
ANALYZE;

-- Rebuild indexes if needed
REINDEX DATABASE referraldb;
```

## Best Practices

### Migration Best Practices
1. **Always backup before migration**
2. **Test migration on staging environment first**
3. **Monitor performance during and after migration**
4. **Have rollback plan ready**
5. **Validate data integrity after migration**

### Performance Best Practices
1. **Use appropriate indexes**
2. **Monitor query performance regularly**
3. **Archive old data periodically**
4. **Optimize connection pooling**
5. **Regular maintenance tasks**

---

This migration guide provides a comprehensive approach to migrating from a hybrid database architecture to a PostgreSQL-only system while maintaining data integrity and performance.
