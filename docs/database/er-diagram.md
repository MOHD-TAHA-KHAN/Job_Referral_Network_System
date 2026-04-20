# ER Diagram & Database Schema

## Entity Relationship Diagram

```mermaid
erDiagram
    Users {
        uuid id PK
        varchar name
        varchar email UK
        varchar password
        enum role
        varchar company
        varchar domain
        array skills
        varchar resumeUrl
        float referralSuccessRate
        boolean isActive
        timestamp lastLogin
        boolean profileCompleted
        timestamp createdAt
        timestamp updatedAt
    }

    Jobs {
        uuid id PK
        varchar title
        text description
        varchar company
        varchar location
        array requiredSkills
        varchar domain
        integer salaryMin
        integer salaryMax
        enum experienceLevel
        enum jobType
        boolean isActive
        integer applicationCount
        integer viewCount
        timestamp expiresAt
        uuid createdBy FK
        timestamp createdAt
        timestamp updatedAt
    }

    Referrals {
        uuid id PK
        uuid jobId FK
        uuid requesterId FK
        uuid referrerId FK
        enum status
        text message
        text responseMessage
        enum priority
        timestamp expiresAt
        timestamp acceptedAt
        timestamp completedAt
        text rejectionReason
        text notes
        boolean isUrgent
        boolean followUpRequired
        timestamp followUpDate
        timestamp createdAt
        timestamp updatedAt
    }

    Users ||--o{ Jobs : "creates"
    Users ||--o{ Referrals : "requests"
    Users ||--o{ Referrals : "receives"
    Jobs ||--o{ Referrals : "for"

    Users {
        enum role: "FRESHER", "PROFESSIONAL", "HR"
    }

    Jobs {
        enum experienceLevel: "ENTRY", "MID", "SENIOR", "LEAD"
        enum jobType: "FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "REMOTE"
    }

    Referrals {
        enum status: "PENDING", "ACCEPTED", "REJECTED", "COMPLETED", "WITHDRAWN"
        enum priority: "LOW", "NORMAL", "HIGH", "URGENT"
    }
```

## Database Schema Details

### 1. Users Table

**Purpose**: Stores user information and authentication data

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `name` | VARCHAR(255) | NOT NULL, LEN(2-255) | User's full name |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE, EMAIL | User's email address |
| `password` | VARCHAR(255) | NOT NULL, LEN(6-255) | Hashed password |
| `role` | ENUM | NOT NULL, DEFAULT 'FRESHER' | User role in system |
| `company` | VARCHAR(255) | NULL, LEN(2-255) | Current company |
| `domain` | VARCHAR(100) | NULL, LEN(2-100) | Professional domain |
| `skills` | TEXT[] | DEFAULT '{}' | Array of skills |
| `resumeUrl` | VARCHAR(500) | NULL, URL | Resume file URL |
| `referralSuccessRate` | FLOAT | DEFAULT 0, RANGE(0-100) | Success percentage |
| `isActive` | BOOLEAN | NOT NULL, DEFAULT true | Account status |
| `lastLogin` | TIMESTAMP | NULL | Last login timestamp |
| `profileCompleted` | BOOLEAN | NOT NULL, DEFAULT false | Profile completion status |
| `createdAt` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |
| `updatedAt` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Indexes**:
- `email` (unique)
- `role`
- `domain`
- `company`
- `isActive`
- `skills` (GIN)

**Business Rules**:
- Email must be unique and valid format
- Password must be at least 6 characters
- Role must be one of: FRESHER, PROFESSIONAL, HR
- Referral success rate must be between 0-100

### 2. Jobs Table

**Purpose**: Stores job postings created by HR users

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `title` | VARCHAR(255) | NOT NULL, LEN(5-255) | Job title |
| `description` | TEXT | NOT NULL, LEN(20-5000) | Job description |
| `company` | VARCHAR(255) | NOT NULL, LEN(2-255) | Company name |
| `location` | VARCHAR(255) | NOT NULL, LEN(2-255) | Job location |
| `requiredSkills` | TEXT[] | NOT NULL, DEFAULT '{}' | Required skills array |
| `domain` | VARCHAR(100) | NOT NULL, LEN(2-100) | Job domain |
| `salaryMin` | INTEGER | NULL, RANGE(0-10M) | Minimum salary |
| `salaryMax` | INTEGER | NULL, RANGE(0-10M) | Maximum salary |
| `experienceLevel` | ENUM | NOT NULL, DEFAULT 'ENTRY' | Experience required |
| `jobType` | ENUM | NOT NULL, DEFAULT 'FULL_TIME' | Employment type |
| `isActive` | BOOLEAN | NOT NULL, DEFAULT true | Job status |
| `applicationCount` | INTEGER | NOT NULL, DEFAULT 0 | Application counter |
| `viewCount` | INTEGER | NOT NULL, DEFAULT 0 | View counter |
| `expiresAt` | TIMESTAMP | NULL | Job expiration |
| `createdBy` | UUID | NOT NULL, FK(Users.id) | HR who created job |
| `createdAt` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |
| `updatedAt` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Constraints**:
- `salaryMax >= salaryMin` (if both specified)

**Indexes**:
- `company`
- `domain`
- `location`
- `createdBy`
- `isActive`
- `experienceLevel`
- `jobType`
- `salaryMin, salaryMax`
- `expiresAt`
- `requiredSkills` (GIN)
- `createdAt`

**Business Rules**:
- Only HR users can create jobs
- Required skills array cannot be empty
- Salary max must be >= min if both specified
- Experience level: ENTRY, MID, SENIOR, LEAD
- Job type: FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, REMOTE

### 3. Referrals Table

**Purpose**: Tracks referral requests between users

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `jobId` | UUID | NOT NULL, FK(Jobs.id) | Target job |
| `requesterId` | UUID | NOT NULL, FK(Users.id) | Fresher requesting |
| `referrerId` | UUID | NOT NULL, FK(Users.id) | Professional referring |
| `status` | ENUM | NOT NULL, DEFAULT 'PENDING' | Request status |
| `message` | TEXT | NULL, LEN(0-2000) | Request message |
| `responseMessage` | TEXT | NULL, LEN(0-2000) | Response message |
| `priority` | ENUM | NOT NULL, DEFAULT 'NORMAL' | Request priority |
| `expiresAt` | TIMESTAMP | NULL | Request expiration |
| `acceptedAt` | TIMESTAMP | NULL | Acceptance timestamp |
| `completedAt` | TIMESTAMP | NULL | Completion timestamp |
| `rejectionReason` | TEXT | NULL, LEN(0-500) | Rejection reason |
| `notes` | TEXT | NULL, LEN(0-1000) | Internal notes |
| `isUrgent` | BOOLEAN | NOT NULL, DEFAULT false | Urgent flag |
| `followUpRequired` | BOOLEAN | NOT NULL, DEFAULT false | Follow-up needed |
| `followUpDate` | TIMESTAMP | NULL | Follow-up date |
| `createdAt` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |
| `updatedAt` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Constraints**:
- `requesterId != referrerId` (can't refer self)
- `UNIQUE(jobId, requesterId, referrerId)` (no duplicate requests)
- `completedAt >= acceptedAt` (if status is COMPLETED)

**Indexes**:
- `jobId`
- `requesterId`
- `referrerId`
- `status`
- `priority`
- `expiresAt`
- `acceptedAt`
- `completedAt`
- `createdAt`
- `isUrgent`
- `followUpRequired`
- `followUpDate`

**Business Rules**:
- Users cannot refer themselves
- No duplicate referral requests for same job/user combination
- Status flow: PENDING -> ACCEPTED -> COMPLETED or PENDING -> REJECTED/WITHDRAWN
- Priority levels: LOW, NORMAL, HIGH, URGENT

## Relationships

### User-User Relationships
- **Self-referential**: Users can be both requesters and referrers

### User-Job Relationships
- **One-to-Many**: HR users create multiple jobs
- **Many-to-Many**: Users can request referrals for multiple jobs

### User-Referral Relationships
- **One-to-Many**: Users can send multiple referral requests
- **One-to-Many**: Users can receive multiple referral requests

### Job-Referral Relationships
- **One-to-Many**: Jobs can have multiple referral requests

## Business Rules

### Role-Based Access
1. **HR users** can create jobs
2. **FRESHER users** can request referrals
3. **PROFESSIONAL users** can receive and respond to referrals

### Referral Flow
1. PENDING -> ACCEPTED -> COMPLETED
2. PENDING -> REJECTED
3. PENDING -> WITHDRAWN

### Data Integrity
1. Users cannot refer themselves
2. No duplicate referral requests
3. Salary max must be >= min
4. Completion date must be after acceptance date

## Query Patterns

### Common Queries

#### Find Jobs by Skills
```sql
SELECT j.* FROM Jobs j
WHERE j.requiredSkills && ARRAY['React','Node.js']
  AND j.isActive = true
  AND j.expiresAt > NOW();
```

#### Get User's Referral Activity
```sql
SELECT 
  r.*,
  j.title as job_title,
  j.company,
  requester.name as requester_name,
  referrer.name as referrer_name
FROM Referrals r
JOIN Jobs j ON r.jobId = j.id
JOIN Users requester ON r.requesterId = requester.id
JOIN Users referrer ON r.referrerId = referrer.id
WHERE r.requesterId = $1 OR r.referrerId = $1;
```

#### Professional's Referral Statistics
```sql
SELECT 
  COUNT(*) as total_requests,
  COUNT(CASE WHEN status = 'ACCEPTED' THEN 1 END) as accepted,
  COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as completed,
  ROUND(
    COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) * 100.0 / 
    NULLIF(COUNT(*), 0), 2
  ) as success_rate
FROM Referrals
WHERE referrerId = $1;
```

#### Smart Matching Algorithm
```sql
SELECT 
  u.*,
  COUNT(*) as skill_matches,
  (CASE WHEN u.company = j.company THEN 40 ELSE 0 END) +
  (CASE WHEN u.domain = j.domain THEN 20 ELSE 0 END) +
  (COUNT(*) * 20) +
  (u.referralSuccessRate * 10) as match_score
FROM Users u
JOIN Jobs j ON j.id = $1
WHERE u.role = 'PROFESSIONAL'
  AND u.skills && j.requiredSkills
GROUP BY u.id, u.name, u.company, u.domain, u.referralSuccessRate
ORDER BY match_score DESC
LIMIT 5;
```

## Performance Considerations

### Indexing Strategy
- **GIN indexes** on array fields for fast overlap queries
- **Composite indexes** for multi-column filtering
- **Partial indexes** for active data only
- **Time-based indexes** for chronological queries

### Query Optimization
- Use array overlap operator (`&&`) for skill matching
- Implement pagination for large result sets
- Cache frequently accessed data
- Use materialized views for complex analytics

### Data Volume Considerations
- Archive old completed referrals
- Partition tables by date if needed
- Implement data retention policies
- Monitor query performance regularly

## Security Considerations

### Data Protection
- Passwords hashed with bcrypt
- Email addresses kept private
- Resume URLs validated and secured
- Audit trail for sensitive operations

### Access Control
- Row-level security policies
- Role-based query restrictions
- Connection encryption
- Input validation at database level

---

This ER diagram and schema documentation provides the foundation for understanding the Job Referral Network System's database structure and relationships. For implementation details, see the [Relationships](./relationships.md) and [Seed Data](./seed-data.md) sections.
