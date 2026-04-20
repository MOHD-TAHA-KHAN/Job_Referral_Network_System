# Database Relationships & Constraints

This document provides detailed information about all relationships, constraints, and business rules implemented in the Job Referral Network System database.

## Entity Relationships

### 1. Users - Jobs Relationship

**Type**: One-to-Many (1:N)
**Direction**: Users (HR) creates Jobs

```sql
-- Foreign Key Constraint
ALTER TABLE Jobs 
ADD CONSTRAINT fk_jobs_created_by 
FOREIGN KEY (createdBy) REFERENCES Users(id) 
ON DELETE CASCADE;

-- Business Rule: Only HR users can create jobs
CREATE POLICY hr_only_create_jobs ON Jobs
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM Users 
    WHERE id = createdBy AND role = 'HR'
  )
);
```

**Constraints**:
- `createdBy` must reference a valid `Users.id`
- Referenced user must have `role = 'HR'`
- Deleting a user deletes all their created jobs

**Use Cases**:
- HR creates job postings
- System validates creator permissions
- Job listings show creator information

### 2. Users - Referrals Relationship (Requester)

**Type**: One-to-Many (1:N)
**Direction**: Users (Fresher) requests Referrals

```sql
-- Foreign Key Constraint
ALTER TABLE Referrals 
ADD CONSTRAINT fk_referrals_requester 
FOREIGN KEY (requesterId) REFERENCES Users(id) 
ON DELETE CASCADE;

-- Business Rule: Only FRESHER users can request referrals
CREATE POLICY fresher_only_request_referrals ON Referrals
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM Users 
    WHERE id = requesterId AND role = 'FRESHER'
  )
);
```

**Constraints**:
- `requesterId` must reference a valid `Users.id`
- Referenced user must have `role = 'FRESHER'`
- Deleting a user deletes all their referral requests

### 3. Users - Referrals Relationship (Referrer)

**Type**: One-to-Many (1:N)
**Direction**: Users (Professional) receives Referrals

```sql
-- Foreign Key Constraint
ALTER TABLE Referrals 
ADD CONSTRAINT fk_referrals_referrer 
FOREIGN KEY (referrerId) REFERENCES Users(id) 
ON DELETE CASCADE;

-- Business Rule: Only PROFESSIONAL users can receive referrals
CREATE POLICY professional_only_receive_referrals ON Referrals
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM Users 
    WHERE id = referrerId AND role = 'PROFESSIONAL'
  )
);
```

**Constraints**:
- `referrerId` must reference a valid `Users.id`
- Referenced user must have `role = 'PROFESSIONAL'`
- Deleting a user deletes all their received referrals

### 4. Jobs - Referrals Relationship

**Type**: One-to-Many (1:N)
**Direction**: Jobs have Referrals

```sql
-- Foreign Key Constraint
ALTER TABLE Referrals 
ADD CONSTRAINT fk_referrals_job 
FOREIGN KEY (jobId) REFERENCES Jobs(id) 
ON DELETE CASCADE;
```

**Constraints**:
- `jobId` must reference a valid `Jobs.id`
- Deleting a job deletes all related referrals
- Job must be `isActive = true` for new referrals

## Unique Constraints

### 1. Prevent Duplicate Referral Requests

```sql
-- Unique constraint to prevent duplicate requests
ALTER TABLE Referrals 
ADD CONSTRAINT unique_referral_request 
UNIQUE (jobId, requesterId, referrerId);
```

**Purpose**: Ensures a fresher cannot request the same referral from the same professional for the same job multiple times.

### 2. User Email Uniqueness

```sql
-- Unique constraint on user email
ALTER TABLE Users 
ADD CONSTRAINT unique_user_email 
UNIQUE (email);
```

**Purpose**: Ensures each email address can only be registered once.

## Check Constraints

### 1. User-Related Constraints

```sql
-- Email format validation
ALTER TABLE Users 
ADD CONSTRAINT valid_email_format 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Name length validation
ALTER TABLE Users 
ADD CONSTRAINT valid_name_length 
CHECK (LENGTH(name) >= 2 AND LENGTH(name) <= 255);

-- Password length validation
ALTER TABLE Users 
ADD CONSTRAINT valid_password_length 
CHECK (LENGTH(password) >= 6);

-- Referral success rate range
ALTER TABLE Users 
ADD CONSTRAINT valid_success_rate 
CHECK (referralSuccessRate >= 0 AND referralSuccessRate <= 100);
```

### 2. Job-Related Constraints

```sql
-- Title length validation
ALTER TABLE Jobs 
ADD CONSTRAINT valid_title_length 
CHECK (LENGTH(title) >= 5 AND LENGTH(title) <= 255);

-- Description length validation
ALTER TABLE Jobs 
ADD CONSTRAINT valid_description_length 
CHECK (LENGTH(description) >= 20 AND LENGTH(description) <= 5000);

-- Salary range validation
ALTER TABLE Jobs 
ADD CONSTRAINT valid_salary_range 
CHECK (
  salaryMin IS NULL OR 
  salaryMax IS NULL OR 
  salaryMax >= salaryMin
);

-- Salary value validation
ALTER TABLE Jobs 
ADD CONSTRAINT valid_salary_values 
CHECK (
  (salaryMin >= 0 AND salaryMin <= 10000000) OR salaryMin IS NULL
);

ALTER TABLE Jobs 
ADD CONSTRAINT valid_salary_max_values 
CHECK (
  (salaryMax >= 0 AND salaryMax <= 10000000) OR salaryMax IS NULL
);
```

### 3. Referral-Related Constraints

```sql
-- Self-referral prevention
ALTER TABLE Referrals 
ADD CONSTRAINT no_self_referral 
CHECK (requesterId != referrerId);

-- Referral status validation
ALTER TABLE Referrals 
ADD CONSTRAINT valid_referral_status 
CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'WITHDRAWN'));

-- Priority validation
ALTER TABLE Referrals 
ADD CONSTRAINT valid_priority 
CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT'));

-- Timeline validation
ALTER TABLE Referrals 
ADD CONSTRAINT valid_timeline 
CHECK (
  status != 'COMPLETED' OR 
  (acceptedAt IS NOT NULL AND completedAt IS NOT NULL AND completedAt >= acceptedAt)
);

-- Message length validation
ALTER TABLE Referrals 
ADD CONSTRAINT valid_message_length 
CHECK (LENGTH(message) <= 2000);

ALTER TABLE Referrals 
ADD CONSTRAINT valid_response_length 
CHECK (LENGTH(responseMessage) <= 2000);
```

## Triggers

### 1. Update Timestamps

```sql
-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for all tables
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON Users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at 
    BEFORE UPDATE ON Jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_referrals_updated_at 
    BEFORE UPDATE ON Referrals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 2. Referral Status Timeline

```sql
-- Function to validate referral status transitions
CREATE OR REPLACE FUNCTION validate_referral_status_transition()
RETURNS TRIGGER AS $$
BEGIN
    -- PENDING -> ACCEPTED
    IF OLD.status = 'PENDING' AND NEW.status = 'ACCEPTED' THEN
        NEW.acceptedAt = CURRENT_TIMESTAMP;
    END IF;
    
    -- ACCEPTED -> COMPLETED
    IF OLD.status = 'ACCEPTED' AND NEW.status = 'COMPLETED' THEN
        IF NEW.acceptedAt IS NULL THEN
            RAISE EXCEPTION 'Cannot complete referral without acceptance date';
        END IF;
        NEW.completedAt = CURRENT_TIMESTAMP;
    END IF;
    
    -- PENDING -> REJECTED or WITHDRAWN
    IF OLD.status = 'PENDING' AND NEW.status IN ('REJECTED', 'WITHDRAWN') THEN
        -- No timestamp changes needed
        NULL;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER validate_referral_status_transition_trigger
    BEFORE UPDATE ON Referrals
    FOR EACH ROW EXECUTE FUNCTION validate_referral_status_transition();
```

### 3. Job Application Counter

```sql
-- Function to increment job application count
CREATE OR REPLACE FUNCTION increment_job_application_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'PENDING' THEN
        UPDATE Jobs 
        SET applicationCount = applicationCount + 1 
        WHERE id = NEW.jobId;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER increment_job_application_count_trigger
    AFTER INSERT ON Referrals
    FOR EACH ROW EXECUTE FUNCTION increment_job_application_count();
```

## Indexes for Performance

### 1. Users Table Indexes

```sql
-- Primary index (automatically created)
CREATE INDEX pk_users ON Users(id);

-- Unique index for email
CREATE UNIQUE INDEX idx_users_email ON Users(email);

-- Performance indexes
CREATE INDEX idx_users_role ON Users(role);
CREATE INDEX idx_users_domain ON Users(domain);
CREATE INDEX idx_users_company ON Users(company);
CREATE INDEX idx_users_active ON Users(isActive);

-- GIN index for array field
CREATE INDEX idx_users_skills_gin ON Users USING GIN(skills);
```

### 2. Jobs Table Indexes

```sql
-- Primary index (automatically created)
CREATE INDEX pk_jobs ON Jobs(id);

-- Performance indexes
CREATE INDEX idx_jobs_company ON Jobs(company);
CREATE INDEX idx_jobs_domain ON Jobs(domain);
CREATE INDEX idx_jobs_location ON Jobs(location);
CREATE INDEX idx_jobs_created_by ON Jobs(createdBy);
CREATE INDEX idx_jobs_active ON Jobs(isActive);
CREATE INDEX idx_jobs_experience_level ON Jobs(experienceLevel);
CREATE INDEX idx_jobs_job_type ON Jobs(jobType);
CREATE INDEX idx_jobs_expires_at ON Jobs(expiresAt);

-- Composite indexes
CREATE INDEX idx_jobs_salary_range ON Jobs(salaryMin, salaryMax);

-- GIN index for array field
CREATE INDEX idx_jobs_required_skills_gin ON Jobs USING GIN(requiredSkills);

-- Time-based index
CREATE INDEX idx_jobs_created_at ON Jobs(createdAt);
```

### 3. Referrals Table Indexes

```sql
-- Primary index (automatically created)
CREATE INDEX pk_referrals ON Referrals(id);

-- Foreign key indexes
CREATE INDEX idx_referrals_job_id ON Referrals(jobId);
CREATE INDEX idx_referrals_requester_id ON Referrals(requesterId);
CREATE INDEX idx_referrals_referrer_id ON Referrals(referrerId);

-- Performance indexes
CREATE INDEX idx_referrals_status ON Referrals(status);
CREATE INDEX idx_referrals_priority ON Referrals(priority);
CREATE INDEX idx_referrals_expires_at ON Referrals(expiresAt);
CREATE INDEX idx_referrals_urgent ON Referrals(isUrgent);
CREATE INDEX idx_referrals_follow_up ON Referrals(followUpRequired);
CREATE INDEX idx_referrals_follow_up_date ON Referrals(followUpDate);

-- Timeline indexes
CREATE INDEX idx_referrals_accepted_at ON Referrals(acceptedAt);
CREATE INDEX idx_referrals_completed_at ON Referrals(completedAt);

-- Time-based index
CREATE INDEX idx_referrals_created_at ON Referrals(createdAt);

-- Unique constraint index (automatically created)
CREATE INDEX idx_referrals_unique_request ON Referrals(jobId, requesterId, referrerId);
```

## Business Rules Implementation

### 1. Role-Based Access Control

```sql
-- Row Level Security Policies
ALTER TABLE Jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE Referrals ENABLE ROW LEVEL SECURITY;

-- Users can see their own data
CREATE POLICY users_own_data ON Users
FOR ALL USING (id = current_setting('app.current_user_id')::uuid);

-- HR can manage their own jobs
CREATE POLICY hr_manage_jobs ON Jobs
FOR ALL USING (
  createdBy = current_setting('app.current_user_id')::uuid
);

-- Users can see their own referrals
CREATE POLICY users_own_referrals ON Referrals
FOR ALL USING (
  requesterId = current_setting('app.current_user_id')::uuid OR
  referrerId = current_setting('app.current_user_id')::uuid
);
```

### 2. Data Validation Rules

```sql
-- Function to validate job posting rules
CREATE OR REPLACE FUNCTION validate_job_posting()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if creator is HR
    IF NOT EXISTS (
      SELECT 1 FROM Users 
      WHERE id = NEW.createdBy AND role = 'HR'
    ) THEN
        RAISE EXCEPTION 'Only HR users can create jobs';
    END IF;
    
    -- Validate required skills
    IF array_length(NEW.requiredSkills, 1) IS NULL OR array_length(NEW.requiredSkills, 1) = 0 THEN
        RAISE EXCEPTION 'Jobs must have at least one required skill';
    END IF;
    
    -- Validate expiration date
    IF NEW.expiresAt IS NOT NULL AND NEW.expiresAt <= CURRENT_TIMESTAMP THEN
        RAISE EXCEPTION 'Expiration date must be in the future';
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER validate_job_posting_trigger
    BEFORE INSERT ON Jobs
    FOR EACH ROW EXECUTE FUNCTION validate_job_posting();
```

### 3. Referral Workflow Validation

```sql
-- Function to validate referral request rules
CREATE OR REPLACE FUNCTION validate_referral_request()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if requester is fresher
    IF NOT EXISTS (
      SELECT 1 FROM Users 
      WHERE id = NEW.requesterId AND role = 'FRESHER'
    ) THEN
        RAISE EXCEPTION 'Only fresher users can request referrals';
    END IF;
    
    -- Check if referrer is professional
    IF NOT EXISTS (
      SELECT 1 FROM Users 
      WHERE id = NEW.referrerId AND role = 'PROFESSIONAL'
    ) THEN
        RAISE EXCEPTION 'Referrals can only be requested from professionals';
    END IF;
    
    -- Check if job is active
    IF NOT EXISTS (
      SELECT 1 FROM Jobs 
      WHERE id = NEW.jobId AND isActive = true
    ) THEN
        RAISE EXCEPTION 'Referrals can only be requested for active jobs';
    END IF;
    
    -- Set default expiration if not provided
    IF NEW.expiresAt IS NULL THEN
        NEW.expiresAt = CURRENT_TIMESTAMP + INTERVAL '7 days';
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER validate_referral_request_trigger
    BEFORE INSERT ON Referrals
    FOR EACH ROW EXECUTE FUNCTION validate_referral_request();
```

## Cascade Actions

### Delete Cascade Rules

1. **User Deletion**:
   - Deleting a user deletes all jobs they created
   - Deleting a user deletes all referral requests they sent
   - Deleting a user deletes all referral requests they received

2. **Job Deletion**:
   - Deleting a job deletes all related referral requests

### Update Cascade Rules

1. **User ID Updates**:
   - Not allowed (primary keys should not change)

2. **Job ID Updates**:
   - Not allowed (primary keys should not change)

## Data Integrity Summary

### Referential Integrity
- All foreign keys properly reference existing records
- Cascade deletes prevent orphaned records
- Unique constraints prevent duplicate data

### Domain Integrity
- Check constraints validate data ranges and formats
- Enum constraints limit valid values
- Length constraints prevent data overflow

### Entity Integrity
- Primary keys ensure unique identification
- NOT NULL constraints ensure required data
- Default values provide sensible defaults

## Performance Optimization

### Query Optimization
- Proper indexing strategy for common queries
- GIN indexes for array field operations
- Composite indexes for multi-column filters
- Partial indexes for active data only

### Maintenance Strategies
- Regular table analysis for query optimization
- Index rebuilding for performance maintenance
- Statistics updates for query planning
- Archive policies for historical data

This comprehensive relationship and constraint documentation ensures data consistency, business rule enforcement, and optimal performance for your Job Referral Network System.
