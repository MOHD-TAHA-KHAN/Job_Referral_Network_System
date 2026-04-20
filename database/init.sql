-- PostgreSQL Database Initialization Script
-- This script sets up the enhanced schema for the Job Referral Network System

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Users table with enhanced fields
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL CHECK (LENGTH(name) >= 2),
    email VARCHAR(255) UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    password VARCHAR(255) NOT NULL CHECK (LENGTH(password) >= 6),
    role VARCHAR(20) CHECK (role IN ('FRESHER', 'PROFESSIONAL', 'HR')) DEFAULT 'FRESHER' NOT NULL,
    company VARCHAR(255) CHECK (LENGTH(company) >= 2),
    domain VARCHAR(100) CHECK (LENGTH(domain) >= 2),
    skills TEXT[] DEFAULT '{}',
    resume_url VARCHAR(500) CHECK (resume_url ~* '^https?://'),
    referral_success_rate DECIMAL(5,2) DEFAULT 0.0 CHECK (referral_success_rate >= 0 AND referral_success_rate <= 100),
    is_active BOOLEAN DEFAULT true NOT NULL,
    last_login TIMESTAMP,
    profile_completed BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Jobs table with enhanced features
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL CHECK (LENGTH(title) >= 5),
    description TEXT NOT NULL CHECK (LENGTH(description) >= 20),
    company VARCHAR(255) NOT NULL CHECK (LENGTH(company) >= 2),
    location VARCHAR(255) NOT NULL CHECK (LENGTH(location) >= 2),
    required_skills TEXT[] NOT NULL DEFAULT '{}' CHECK (array_length(required_skills, 1) > 0),
    domain VARCHAR(100) NOT NULL CHECK (LENGTH(domain) >= 2),
    salary_min INTEGER CHECK (salary_min >= 0 AND salary_min <= 10000000),
    salary_max INTEGER CHECK (salary_max >= 0 AND salary_max <= 10000000),
    experience_level VARCHAR(20) CHECK (experience_level IN ('ENTRY', 'MID', 'SENIOR', 'LEAD')) DEFAULT 'ENTRY' NOT NULL,
    job_type VARCHAR(20) CHECK (job_type IN ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE')) DEFAULT 'FULL_TIME' NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    application_count INTEGER DEFAULT 0 NOT NULL CHECK (application_count >= 0),
    view_count INTEGER DEFAULT 0 NOT NULL CHECK (view_count >= 0),
    expires_at TIMESTAMP,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    CONSTRAINT valid_salary_range CHECK (salary_max IS NULL OR salary_min IS NULL OR salary_max >= salary_min)
);

-- Referrals table with comprehensive tracking
CREATE TABLE IF NOT EXISTS referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'WITHDRAWN')) DEFAULT 'PENDING' NOT NULL,
    message TEXT CHECK (LENGTH(message) <= 2000),
    response_message TEXT CHECK (LENGTH(response_message) <= 2000),
    priority VARCHAR(10) CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT')) DEFAULT 'NORMAL' NOT NULL,
    expires_at TIMESTAMP,
    accepted_at TIMESTAMP,
    completed_at TIMESTAMP,
    rejection_reason TEXT CHECK (LENGTH(rejection_reason) <= 500),
    notes TEXT CHECK (LENGTH(notes) <= 1000),
    is_urgent BOOLEAN DEFAULT false NOT NULL,
    follow_up_required BOOLEAN DEFAULT false NOT NULL,
    follow_up_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    UNIQUE(job_id, requester_id, referrer_id),
    CONSTRAINT valid_referrer_requester CHECK (requester_id != referrer_id),
    CONSTRAINT valid_completion_dates CHECK (
        (status != 'COMPLETED') OR 
        (completed_at IS NOT NULL AND accepted_at IS NOT NULL AND completed_at >= accepted_at)
    )
);

-- Cache tables (replacing Redis functionality)
CREATE UNLOGGED TABLE IF NOT EXISTS session_cache (
    session_id VARCHAR(255) PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    data JSONB,
    expires_at TIMESTAMP NOT NULL
);

CREATE UNLOGGED TABLE IF NOT EXISTS general_cache (
    key VARCHAR(255) PRIMARY KEY,
    value JSONB,
    expires_at TIMESTAMP NOT NULL
);

-- Indexes for optimal performance
-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_domain ON users(domain);
CREATE INDEX IF NOT EXISTS idx_users_company ON users(company);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_skills_gin ON users USING GIN(skills);

-- Jobs indexes
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company);
CREATE INDEX IF NOT EXISTS idx_jobs_domain ON jobs(domain);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_created_by ON jobs(created_by);
CREATE INDEX IF NOT EXISTS idx_jobs_active ON jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_jobs_experience_level ON jobs(experience_level);
CREATE INDEX IF NOT EXISTS idx_jobs_job_type ON jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_jobs_salary_range ON jobs(salary_min, salary_max);
CREATE INDEX IF NOT EXISTS idx_jobs_expires_at ON jobs(expires_at);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at);
CREATE INDEX IF NOT EXISTS idx_jobs_skills_gin ON jobs USING GIN(required_skills);

-- Full-text search index for jobs
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS search_vector tsvector;
CREATE INDEX IF NOT EXISTS idx_jobs_search ON jobs USING GIN(search_vector);

-- Referrals indexes
CREATE INDEX IF NOT EXISTS idx_referrals_job_id ON referrals(job_id);
CREATE INDEX IF NOT EXISTS idx_referrals_requester_id ON referrals(requester_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);
CREATE INDEX IF NOT EXISTS idx_referrals_priority ON referrals(priority);
CREATE INDEX IF NOT EXISTS idx_referrals_expires_at ON referrals(expires_at);
CREATE INDEX IF NOT EXISTS idx_referrals_accepted_at ON referrals(accepted_at);
CREATE INDEX IF NOT EXISTS idx_referrals_completed_at ON referrals(completed_at);
CREATE INDEX IF NOT EXISTS idx_referrals_created_at ON referrals(created_at);
CREATE INDEX IF NOT EXISTS idx_referrals_urgent ON referrals(is_urgent);
CREATE INDEX IF NOT EXISTS idx_referrals_follow_up ON referrals(follow_up_required);
CREATE INDEX IF NOT EXISTS idx_referrals_follow_up_date ON referrals(follow_up_date);

-- Cache indexes
CREATE INDEX IF NOT EXISTS idx_session_expires ON session_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_cache_expires ON general_cache(expires_at);

-- Update triggers for timestamp management
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_referrals_updated_at BEFORE UPDATE ON referrals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Full-text search trigger for jobs
CREATE OR REPLACE FUNCTION update_job_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('english', 
        COALESCE(NEW.title, '') || ' ' || 
        COALESCE(NEW.description, '') || ' ' || 
        COALESCE(NEW.company, '') || ' ' ||
        COALESCE(NEW.location, '') || ' ' ||
        COALESCE(NEW.domain, '') || ' ' ||
        COALESCE(array_to_string(NEW.required_skills, ' '), '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_job_search_vector_trigger
    BEFORE INSERT OR UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION update_job_search_vector();

-- Cache cleanup function
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS void AS $$
BEGIN
    DELETE FROM session_cache WHERE expires_at < CURRENT_TIMESTAMP;
    DELETE FROM general_cache WHERE expires_at < CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Create a function to periodically clean up expired cache
-- This can be called by a cron job or scheduled task
SELECT cleanup_expired_cache();

-- Grant permissions (adjust as needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Sample data for testing (optional)
-- INSERT INTO users (name, email, password, role, company, domain, skills, profile_completed)
-- VALUES 
-- ('John Doe', 'john@example.com', '$2b$10$...', 'HR', 'Tech Corp', 'Technology', ARRAY['JavaScript', 'React'], true),
-- ('Jane Smith', 'jane@example.com', '$2b$10$...', 'PROFESSIONAL', 'Software Inc', 'Engineering', ARRAY['Node.js', 'PostgreSQL'], true),
-- ('Mike Johnson', 'mike@example.com', '$2b$10$...', 'FRESHER', NULL, 'Computer Science', ARRAY['Python', 'Django'], false)
-- ON CONFLICT (email) DO NOTHING;

COMMIT;
