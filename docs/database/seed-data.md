# Database Seed Data

This section contains comprehensive seed data for testing and demonstration purposes in the Job Referral Network System.

## Overview

The seed data provides a realistic testing environment with:
- **15 Users**: 3 HR, 6 Professionals, 6 Freshers
- **10 Job Postings**: Various roles, companies, and experience levels
- **11 Referral Requests**: Complete workflow representation
- **Realistic Relationships**: Proper foreign key relationships and business rules

## Loading Seed Data

### Quick Load
```bash
# Load all seed data
docker exec -i refnet_postgres psql -U postgres -d referraldb < database/seed_data.sql
```

### Manual Load
```bash
# Connect to database
docker exec -it refnet_postgres psql -U postgres -d referraldb

# Load specific sections
\i database/seed_data.sql
```

## Data Summary

### Users Distribution
| Role | Count | Example Users |
|------|-------|---------------|
| **HR** | 3 | Sarah Johnson, Michael Chen, Emily Rodriguez |
| **Professional** | 6 | David Kim, Lisa Wang, James Miller, Anna Patel, Robert Taylor, Sophie Garcia |
| **Fresher** | 6 | Alex Thompson, Maria Fernandez, Kevin Lee, Rachel Brown, Daniel Wilson, Jessica Martinez |

### Jobs Distribution
| Company | Count | Roles |
|---------|-------|-------|
| **TechCorp Solutions** | 4 | Frontend Dev, Mobile Dev, Jr Frontend Dev, DevOps |
| **InnovateTech** | 3 | Backend Eng, UI/UX Designer, ML Engineer |
| **DataSync Systems** | 2 | Data Engineer, Full Stack Dev, QA Engineer |
| **CloudTech Solutions** | 1 | DevOps Engineer |

### Referrals by Status
| Status | Count | Description |
|--------|-------|-------------|
| **PENDING** | 3 | Awaiting professional response |
| **ACCEPTED** | 2 | Accepted, awaiting completion |
| **COMPLETED** | 2 | Successfully completed referrals |
| **REJECTED** | 2 | Rejected with reasons |
| **WITHDRAWN** | 2 | Withdrawn by requesters |

## Sample Data Details

### HR Users
These users can create and manage job postings:

```sql
-- Sarah Johnson - TechCorp Solutions HR
('550e8400-e29b-41d4-a716-446655440001', 'Sarah Johnson', 'sarah.j@techcorp.com', 
 '$2b$10$rQZ8kHWmQvZ0K8QzQZQZQu', 'HR', 'TechCorp Solutions', 'Technology', 
 ARRAY['Recruitment', 'HR Management', 'Team Building'], 85.5, true, true)

-- Michael Chen - InnovateTech HR  
('550e8400-e29b-41d4-a716-446655440002', 'Michael Chen', 'michael.c@innovate.io',
 '$2b$10$rQZ8kHWmQvZ0K8QzQZQZQu', 'HR', 'InnovateTech', 'Software Development',
 ARRAY['Technical Recruitment', 'Sourcing', 'Interviewing'], 78.2, true, true)

-- Emily Rodriguez - DataSync Systems HR
('550e8400-e29b-41d4-a716-446655440003', 'Emily Rodriguez', 'emily.r@datasync.com',
 '$2b$10$rQZ8kHWmQvZ0K8QzQZQZQu', 'HR', 'DataSync Systems', 'Data Engineering',
 ARRAY['Data Science Recruitment', 'Analytics'], 92.1, true, true)
```

### Professional Users
These users can receive and respond to referral requests:

```sql
-- David Kim - Frontend Developer at TechCorp
('550e8400-e29b-41d4-a716-446655440004', 'David Kim', 'david.k@techcorp.com',
 '$2b$10$rQZ8kHWmQvZ0K8QzQZQZQu', 'PROFESSIONAL', 'TechCorp Solutions', 'Frontend Development',
 ARRAY['React', 'TypeScript', 'CSS', 'JavaScript', 'Vue.js'], 88.7, true, true)

-- Lisa Wang - Backend Developer at InnovateTech
('550e8400-e29b-41d4-a716-446655440005', 'Lisa Wang', 'lisa.w@innovate.io',
 '$2b$10$rQZ8kHWmQvZ0K8QzQZQZQu', 'PROFESSIONAL', 'InnovateTech', 'Backend Development',
 ARRAY['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'Redis'], 91.3, true, true)

-- James Miller - Data Engineer at DataSync
('550e8400-e29b-41d4-a716-446655440006', 'James Miller', 'james.m@datasync.com',
 '$2b$10$rQZ8kHWmQvZ0K8QzQZQZQu', 'PROFESSIONAL', 'DataSync Systems', 'Data Engineering',
 ARRAY['Python', 'Apache Spark', 'AWS', 'Data Warehousing', 'Machine Learning'], 85.9, true, true)
```

### Fresher Users
These users can request referrals from professionals:

```sql
-- Alex Thompson - Computer Science Student
('550e8400-e29b-41d4-a716-446655440010', 'Alex Thompson', 'alex.t@university.edu',
 '$2b$10$rQZ8kHWmQvZ0K8QzQZQZQu', 'FRESHER', NULL, 'Computer Science',
 ARRAY['JavaScript', 'React', 'Node.js', 'HTML', 'CSS'], 0.0, true, true)

-- Maria Fernandez - Data Science Student
('550e8400-e29b-41d4-a716-446655440011', 'Maria Fernandez', 'maria.f@university.edu',
 '$2b$10$rQZ8kHWmQvZ0K8QzQZQZQu', 'FRESHER', NULL, 'Data Science',
 ARRAY['Python', 'Machine Learning', 'SQL', 'Pandas', 'NumPy'], 0.0, true, true)
```

### Job Postings
Sample job listings with various requirements and compensation:

```sql
-- Frontend Developer at TechCorp Solutions
('660e8400-e29b-41d4-a716-446655440001', 'Frontend Developer', 
 'We are looking for a talented Frontend Developer to join our growing team. You will be responsible for building responsive web applications using modern JavaScript frameworks.',
 'TechCorp Solutions', 'San Francisco, CA', 
 ARRAY['React', 'TypeScript', 'CSS', 'JavaScript', 'HTML5'], 'Frontend Development',
 80000, 120000, 'MID', 'FULL_TIME', true, 45, 234, 
 NOW() + INTERVAL '30 days', '550e8400-e29b-41d4-a716-446655440001')

-- Backend Engineer at InnovateTech
('660e8400-e29b-41d4-a716-446655440002', 'Backend Engineer',
 'Join our backend team to build scalable APIs and services. Experience with Node.js and PostgreSQL required.',
 'InnovateTech', 'New York, NY',
 ARRAY['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'REST APIs'], 'Backend Development',
 90000, 140000, 'MID', 'FULL_TIME', true, 67, 312,
 NOW() + INTERVAL '45 days', '550e8400-e29b-41d4-a716-446655440002')
```

### Referral Requests
Complete workflow examples with all status transitions:

```sql
-- Pending Referral Request
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 
 '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440004', 'PENDING',
 'Hi David, I saw the Frontend Developer position at TechCorp and I''m very interested. I have experience with React and TypeScript and would love to get a referral from you.',
 NULL, 'NORMAL', NOW() + INTERVAL '7 days', NULL, NULL, NULL, 
 'Recent CS graduate with strong React skills', false, false, NULL)

-- Completed Referral Request
('770e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440006',
 '550e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440009', 'COMPLETED',
 'Hi Sophie, I love design and I''m very interested in the UI/UX Designer position at InnovateTech.',
 'Hi Jessica! I was happy to refer you. Great news - they want to schedule an interview!',
 'NORMAL', NOW() + INTERVAL '10 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 day', NULL,
 'Successfully submitted referral, interview scheduled', false, false, NULL)
```

## Default Credentials

All users use the same hashed password for testing:
- **Email**: As listed in the seed data
- **Password**: `password123`

## Test Scenarios

### 1. HR User Workflow
```sql
-- Login as HR user (sarah.j@techcorp.com)
-- Create a new job posting
-- View job analytics
-- Manage job listings
```

### 2. Professional User Workflow
```sql
-- Login as Professional (david.k@techcorp.com)
-- View received referral requests
-- Respond to requests (Accept/Reject)
-- Track referral success rate
```

### 3. Fresher User Workflow
```sql
-- Login as Fresher (alex.t@university.edu)
-- Browse job listings
-- Search for jobs by skills
-- Request referrals
-- Track referral status
```

### 4. Smart Matching Test
```sql
-- Test skill matching algorithm
-- Verify company/domain matching
-- Check referral success rate scoring
```

## Data Validation

### Verify Data Loading
```sql
-- Check record counts
SELECT 'Users' as table_name, COUNT(*) as record_count FROM Users
UNION ALL
SELECT 'Jobs', COUNT(*) FROM Jobs
UNION ALL
SELECT 'Referrals', COUNT(*) FROM Referrals;

-- Verify role distribution
SELECT role, COUNT(*) as count FROM Users GROUP BY role ORDER BY role;

-- Check referral status distribution
SELECT status, COUNT(*) as count FROM Referrals GROUP BY status ORDER BY status;

-- Verify jobs by company
SELECT company, COUNT(*) as job_count FROM Jobs GROUP BY company ORDER BY job_count DESC;
```

### Test Business Rules
```sql
-- Test HR-only job creation
SELECT u.name, j.title FROM Users u JOIN Jobs j ON u.id = j.createdBy WHERE u.role = 'HR';

-- Test fresher-only referral requests
SELECT u.name, r.status FROM Users u JOIN Referrals r ON u.id = r.requesterId WHERE u.role = 'FRESHER';

-- Test professional-only referral responses
SELECT u.name, r.status FROM Users u JOIN Referrals r ON u.id = r.referrerId WHERE u.role = 'PROFESSIONAL';
```

## Performance Testing

### Query Performance
```sql
-- Test skill matching queries
EXPLAIN ANALYZE SELECT j.* FROM Jobs j 
WHERE j.requiredSkills && ARRAY['React', 'Node.js'] AND j.isActive = true;

-- Test referral statistics
EXPLAIN ANALYZE 
SELECT COUNT(*) as total, 
       COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as completed
FROM Referrals WHERE referrerId = '550e8400-e29b-41d4-a716-446655440004';
```

## Data Maintenance

### Reset Seed Data
```sql
-- Clear existing data
DELETE FROM Referrals;
DELETE FROM Jobs;
DELETE FROM Users;

-- Reset sequences
ALTER SEQUENCE Users_id_seq RESTART WITH 1;
ALTER SEQUENCE Jobs_id_seq RESTART WITH 1;
ALTER SEQUENCE Referrals_id_seq RESTART WITH 1;

-- Reload seed data
\i database/seed_data.sql
```

### Update Statistics
```sql
-- Update table statistics for query optimization
ANALYZE Users;
ANALYZE Jobs;
ANALYZE Referrals;

-- Rebuild indexes if needed
REINDEX DATABASE referraldb;
```

## Customization

### Adding More Data
```sql
-- Add additional users
INSERT INTO Users (id, name, email, password, role, company, domain, skills, referralSuccessRate, isActive, profileCompleted, createdAt, updatedAt)
VALUES ('new-user-id', 'New User', 'new@example.com', '$2b$10$rQZ8kHWmQvZ0K8QzQZQZQu', 'PROFESSIONAL', 'New Company', 'New Domain', ARRAY['Skill1', 'Skill2'], 75.0, true, true, NOW(), NOW());

-- Add additional jobs
INSERT INTO Jobs (id, title, description, company, location, requiredSkills, domain, salaryMin, salaryMax, experienceLevel, jobType, isActive, applicationCount, viewCount, expiresAt, createdBy, createdAt, updatedAt)
VALUES ('new-job-id', 'New Job', 'Job description', 'Company', 'Location', ARRAY['Skill1', 'Skill2'], 'Domain', 50000, 80000, 'ENTRY', 'FULL_TIME', true, 0, 0, NOW() + INTERVAL '30 days', 'hr-user-id', NOW(), NOW());
```

### Modifying Existing Data
```sql
-- Update user skills
UPDATE Users SET skills = ARRAY['React', 'Vue.js', 'Angular', 'TypeScript'] WHERE email = 'david.k@techcorp.com';

-- Update job requirements
UPDATE Jobs SET requiredSkills = ARRAY['React', 'TypeScript', 'Node.js', 'GraphQL'] WHERE title = 'Frontend Developer';

-- Update referral status
UPDATE Referrals SET status = 'ACCEPTED', acceptedAt = NOW() WHERE id = 'referral-id';
```

## Troubleshooting

### Common Issues

#### 1. Constraint Violations
```sql
-- Check for duplicate emails
SELECT email, COUNT(*) FROM Users GROUP BY email HAVING COUNT(*) > 1;

-- Check for invalid foreign keys
SELECT r.id, r.requesterId FROM Referrals r LEFT JOIN Users u ON r.requesterId = u.id WHERE u.id IS NULL;
```

#### 2. Data Inconsistencies
```sql
-- Check for orphaned records
SELECT j.id FROM Jobs j LEFT JOIN Users u ON j.createdBy = u.id WHERE u.id IS NULL;

-- Verify referral workflow integrity
SELECT r.id, r.status, r.acceptedAt, r.completedAt FROM Referrals r WHERE status = 'COMPLETED' AND (acceptedAt IS NULL OR completedAt IS NULL);
```

#### 3. Performance Issues
```sql
-- Check query performance
SELECT query, calls, total_time, mean_time FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;

-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan FROM pg_stat_user_indexes ORDER BY idx_scan DESC;
```

---

This comprehensive seed data provides a realistic testing environment for development, testing, and demonstration of the Job Referral Network System's capabilities.
