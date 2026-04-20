-- Job Referral Network System - Seed Data
-- This file contains sample data for testing and demonstration purposes

-- Clear existing data (in correct order due to foreign key constraints)
DELETE FROM Referrals;
DELETE FROM Jobs;
DELETE FROM Users;

-- Reset sequences
ALTER SEQUENCE Users_id_seq RESTART WITH 1;
ALTER SEQUENCE Jobs_id_seq RESTART WITH 1;
ALTER SEQUENCE Referrals_id_seq RESTART WITH 1;

-- Insert HR Users (who can create jobs)
INSERT INTO Users (id, name, email, password, role, company, domain, skills, referralSuccessRate, isActive, profileCompleted, createdAt, updatedAt) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Sarah Johnson', 'sarah.j@techcorp.com', '$2b$10$rQZ8kHWmQvZ0K8QzQZQZQuQZ8kHWmQvZ0K8QzQZQZQu', 'HR', 'TechCorp Solutions', 'Technology', ARRAY['Recruitment', 'HR Management', 'Team Building'], 85.5, true, true, NOW() - INTERVAL '6 months', NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'Michael Chen', 'michael.c@innovate.io', '$2b$10$rQZ8kHWmQvZ0K8QzQZQZQuQZ8kHWmQvZ0K8QzQZQZQu', 'HR', 'InnovateTech', 'Software Development', ARRAY['Technical Recruitment', 'Sourcing', 'Interviewing'], 78.2, true, true, NOW() - INTERVAL '4 months', NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Emily Rodriguez', 'emily.r@datasync.com', '$2b$10$rQZ8kHWmQvZ0K8QzQZQZQuQZ8kHWmQvZ0K8QzQZQZQu', 'HR', 'DataSync Systems', 'Data Engineering', ARRAY['Data Science Recruitment', 'Analytics'], 92.1, true, true, NOW() - INTERVAL '8 months', NOW());

-- Insert Professional Users (who can receive referral requests)
INSERT INTO Users (id, name, email, password, role, company, domain, skills, referralSuccessRate, isActive, profileCompleted, createdAt, updatedAt) VALUES
('550e8400-e29b-41d4-a716-446655440004', 'David Kim', 'david.k@techcorp.com', '$2b$10$rQZ8kHWmQvZ0K8QzQZQZQuQZ8kHWmQvZ0K8QzQZQZQu', 'PROFESSIONAL', 'TechCorp Solutions', 'Frontend Development', ARRAY['React', 'TypeScript', 'CSS', 'JavaScript', 'Vue.js'], 88.7, true, true, NOW() - INTERVAL '2 years', NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'Lisa Wang', 'lisa.w@innovate.io', '$2b$10$rQZ8kHWmQvZ0K8QzQZQZQuQZ8kHWmQvZ0K8QzQZQZQu', 'PROFESSIONAL', 'InnovateTech', 'Backend Development', ARRAY['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'Redis'], 91.3, true, true, NOW() - INTERVAL '3 years', NOW()),
('550e8400-e29b-41d4-a716-446655440006', 'James Miller', 'james.m@datasync.com', '$2b$10$rQZ8kHWmQvZ0K8QzQZQZQuQZ8kHWmQvZ0K8QzQZQZQu', 'PROFESSIONAL', 'DataSync Systems', 'Data Engineering', ARRAY['Python', 'Apache Spark', 'AWS', 'Data Warehousing', 'Machine Learning'], 85.9, true, true, NOW() - INTERVAL '4 years', NOW()),
('550e8400-e29b-41d4-a716-446655440007', 'Anna Patel', 'anna.p@cloudtech.com', '$2b$10$rQZ8kHWmQvZ0K8QzQZQZQuQZ8kHWmQvZ0K8QzQZQZQu', 'PROFESSIONAL', 'CloudTech Solutions', 'DevOps', ARRAY['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform'], 94.2, true, true, NOW() - INTERVAL '5 years', NOW()),
('550e8400-e29b-41d4-a716-446655440008', 'Robert Taylor', 'robert.t@techcorp.com', '$2b$10$rQZ8kHWmQvZ0K8QzQZQZQuQZ8kHWmQvZ0K8QzQZQZQu', 'PROFESSIONAL', 'TechCorp Solutions', 'Mobile Development', ARRAY['React Native', 'Flutter', 'iOS', 'Android', 'TypeScript'], 79.8, true, true, NOW() - INTERVAL '3 years', NOW()),
('550e8400-e29b-41d4-a716-446655440009', 'Sophie Garcia', 'sophie.g@innovate.io', '$2b$10$rQZ8kHWmQvZ0K8QzQZQZQuQZ8kHWmQvZ0K8QzQZQZQu', 'PROFESSIONAL', 'InnovateTech', 'UI/UX Design', ARRAY['Figma', 'Adobe XD', 'Prototyping', 'User Research', 'Design Systems'], 87.4, true, true, NOW() - INTERVAL '2 years', NOW());

-- Insert Fresher Users (who can request referrals)
INSERT INTO Users (id, name, email, password, role, company, domain, skills, referralSuccessRate, isActive, profileCompleted, createdAt, updatedAt) VALUES
('550e8400-e29b-41d4-a716-446655440010', 'Alex Thompson', 'alex.t@university.edu', '$2b$10$rQZ8kHWmQvZ0K8QzQZQZQuQZ8kHWmQvZ0K8QzQZQZQu', 'FRESHER', NULL, 'Computer Science', ARRAY['JavaScript', 'React', 'Node.js', 'HTML', 'CSS'], 0.0, true, true, NOW() - INTERVAL '6 months', NOW()),
('550e8400-e29b-41d4-a716-446655440011', 'Maria Fernandez', 'maria.f@university.edu', '$2b$10$rQZ8kHWmQvZ0K8QzQZQZQuQZ8kHWmQvZ0K8QzQZQZQu', 'FRESHER', NULL, 'Data Science', ARRAY['Python', 'Machine Learning', 'SQL', 'Pandas', 'NumPy'], 0.0, true, true, NOW() - INTERVAL '4 months', NOW()),
('550e8400-e29b-41d4-a716-446655440012', 'Kevin Lee', 'kevin.l@university.edu', '$2b$10$rQZ8kHWmQvZ0K8QzQZQZQuQZ8kHWmQvZ0K8QzQZQZQu', 'FRESHER', NULL, 'Software Engineering', ARRAY['Java', 'Spring Boot', 'MySQL', 'REST APIs', 'Git'], 0.0, true, true, NOW() - INTERVAL '8 months', NOW()),
('550e8400-e29b-41d4-a716-446655440013', 'Rachel Brown', 'rachel.b@university.edu', '$2b$10$rQZ8kHWmQvZ0K8QzQZQZQuQZ8kHWmQvZ0K8QzQZQZQu', 'FRESHER', NULL, 'Information Technology', ARRAY['Python', 'Django', 'PostgreSQL', 'AWS', 'Linux'], 0.0, true, true, NOW() - INTERVAL '5 months', NOW()),
('550e8400-e29b-41d4-a716-446655440014', 'Daniel Wilson', 'daniel.w@university.edu', '$2b$10$rQZ8kHWmQvZ0K8QzQZQZQuQZ8kHWmQvZ0K8QzQZQZQu', 'FRESHER', NULL, 'Computer Engineering', ARRAY['C++', 'Embedded Systems', 'IoT', 'Arduino', 'Raspberry Pi'], 0.0, true, true, NOW() - INTERVAL '7 months', NOW()),
('550e8400-e29b-41d4-a716-446655440015', 'Jessica Martinez', 'jessica.m@university.edu', '$2b$10$rQZ8kHWmQvZ0K8QzQZQZQuQZ8kHWmQvZ0K8QzQZQZQu', 'FRESHER', NULL, 'Web Development', ARRAY['Vue.js', 'Nuxt.js', 'Tailwind CSS', 'Firebase', 'JavaScript'], 0.0, true, true, NOW() - INTERVAL '3 months', NOW());

-- Insert Job Postings
INSERT INTO Jobs (id, title, description, company, location, requiredSkills, domain, salaryMin, salaryMax, experienceLevel, jobType, isActive, applicationCount, viewCount, expiresAt, createdBy, createdAt, updatedAt) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Frontend Developer', 'We are looking for a talented Frontend Developer to join our growing team. You will be responsible for building responsive web applications using modern JavaScript frameworks.', 'TechCorp Solutions', 'San Francisco, CA', ARRAY['React', 'TypeScript', 'CSS', 'JavaScript', 'HTML5'], 'Frontend Development', 80000, 120000, 'MID', 'FULL_TIME', true, 45, 234, NOW() + INTERVAL '30 days', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '15 days', NOW()),

('660e8400-e29b-41d4-a716-446655440002', 'Backend Engineer', 'Join our backend team to build scalable APIs and services. Experience with Node.js and PostgreSQL required.', 'InnovateTech', 'New York, NY', ARRAY['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'REST APIs'], 'Backend Development', 90000, 140000, 'MID', 'FULL_TIME', true, 67, 312, NOW() + INTERVAL '45 days', '550e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '10 days', NOW()),

('660e8400-e29b-41d4-a716-446655440003', 'Data Engineer', 'We are seeking a Data Engineer to help build and maintain our data infrastructure. Experience with big data technologies is essential.', 'DataSync Systems', 'Austin, TX', ARRAY['Python', 'Apache Spark', 'AWS', 'Data Warehousing', 'SQL'], 'Data Engineering', 100000, 150000, 'SENIOR', 'FULL_TIME', true, 23, 156, NOW() + INTERVAL '60 days', '550e8400-e29b-41d4-a716-446655440003', NOW() - INTERVAL '20 days', NOW()),

('660e8400-e29b-41d4-a716-446655440004', 'DevOps Engineer', 'Looking for a DevOps Engineer to help streamline our deployment processes and maintain cloud infrastructure.', 'CloudTech Solutions', 'Seattle, WA', ARRAY['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform'], 'DevOps', 110000, 160000, 'SENIOR', 'FULL_TIME', true, 34, 198, NOW() + INTERVAL '40 days', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '5 days', NOW()),

('660e8400-e29b-41d4-a716-446655440005', 'Mobile Developer', 'Join our mobile team to create amazing iOS and Android applications using React Native.', 'TechCorp Solutions', 'Remote', ARRAY['React Native', 'Flutter', 'iOS', 'Android', 'TypeScript'], 'Mobile Development', 85000, 130000, 'MID', 'REMOTE', true, 56, 278, NOW() + INTERVAL '25 days', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '12 days', NOW()),

('660e8400-e29b-41d4-a716-446655440006', 'UI/UX Designer', 'We need a creative UI/UX Designer to help design beautiful and intuitive user interfaces for our products.', 'InnovateTech', 'Los Angeles, CA', ARRAY['Figma', 'Adobe XD', 'Prototyping', 'User Research', 'Design Systems'], 'UI/UX Design', 75000, 110000, 'ENTRY', 'FULL_TIME', true, 89, 423, NOW() + INTERVAL '20 days', '550e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '8 days', NOW()),

('660e8400-e29b-41d4-a716-446655440007', 'Full Stack Developer', 'Looking for versatile Full Stack Developers who can work on both frontend and backend technologies.', 'DataSync Systems', 'Boston, MA', ARRAY['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'AWS'], 'Software Development', 95000, 135000, 'MID', 'FULL_TIME', true, 78, 345, NOW() + INTERVAL '35 days', '550e8400-e29b-41d4-a716-446655440003', NOW() - INTERVAL '18 days', NOW()),

('660e8400-e29b-41d4-a716-446655440008', 'Junior Frontend Developer', 'Great opportunity for recent graduates to start their career in frontend development.', 'TechCorp Solutions', 'Chicago, IL', ARRAY['JavaScript', 'React', 'HTML', 'CSS', 'Git'], 'Frontend Development', 60000, 80000, 'ENTRY', 'FULL_TIME', true, 123, 567, NOW() + INTERVAL '15 days', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '3 days', NOW()),

('660e8400-e29b-41d4-a716-446655440009', 'Machine Learning Engineer', 'Join our ML team to build intelligent systems and work on cutting-edge AI projects.', 'InnovateTech', 'Palo Alto, CA', ARRAY['Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Data Science'], 'Machine Learning', 120000, 180000, 'SENIOR', 'FULL_TIME', true, 41, 234, NOW() + INTERVAL '50 days', '550e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '25 days', NOW()),

('660e8400-e29b-41d4-a716-446655440010', 'QA Engineer', 'We need a detail-oriented QA Engineer to ensure the quality of our software products.', 'DataSync Systems', 'Denver, CO', ARRAY['Testing', 'Automation', 'Selenium', 'Quality Assurance', 'Agile'], 'Quality Assurance', 70000, 95000, 'MID', 'FULL_TIME', true, 92, 456, NOW() + INTERVAL '30 days', '550e8400-e29b-41d4-a716-446655440003', NOW() - INTERVAL '14 days', NOW());

-- Insert Referral Requests with various statuses
INSERT INTO Referrals (id, jobId, requesterId, referrerId, status, message, responseMessage, priority, expiresAt, acceptedAt, completedAt, rejectionReason, notes, isUrgent, followUpRequired, followUpDate, createdAt, updatedAt) VALUES

-- Pending referrals
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440004', 'PENDING', 'Hi David, I saw the Frontend Developer position at TechCorp and I''m very interested. I have experience with React and TypeScript and would love to get a referral from you.', NULL, 'NORMAL', NOW() + INTERVAL '7 days', NULL, NULL, NULL, 'Recent CS graduate with strong React skills', false, false, NULL, NOW() - INTERVAL '2 days', NOW()),

('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440005', 'PENDING', 'Hello Lisa, I''m passionate about backend development and the Backend Engineer role at InnovateTech seems perfect for me. I have experience with Node.js and PostgreSQL.', NULL, 'HIGH', NOW() + INTERVAL '5 days', NULL, NULL, NULL, 'Strong backend skills, needs referral urgently', true, true, NOW() + INTERVAL '2 days', NOW() - INTERVAL '1 day', NOW()),

('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440006', 'PENDING', 'Hi James, I''m very interested in the Data Engineer position at DataSync. I have experience with Python and SQL, and I''m currently learning Apache Spark.', NULL, 'NORMAL', NOW() + INTERVAL '10 days', NULL, NULL, NULL, 'Java background transitioning to data engineering', false, false, NULL, NOW() - INTERVAL '3 days', NOW()),

-- Accepted referrals
('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440007', 'ACCEPTED', 'Hello Anna, I''m interested in the DevOps Engineer position. I have experience with Docker and Kubernetes from my personal projects.', 'Hi Rachel! I''d be happy to refer you. Your background looks great for this role. Let me connect you with the hiring manager.', 'NORMAL', NOW() + INTERVAL '14 days', NOW() - INTERVAL '1 day', NULL, NULL, 'Strong DevOps skills, good cultural fit', false, false, NULL, NOW() - INTERVAL '2 days', NOW()),

('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440008', 'ACCEPTED', 'Hi Robert, I''m excited about the Mobile Developer position. I have experience with React Native and have built several mobile apps.', 'Hi Daniel! Your experience looks perfect for this role. I''ll definitely refer you to the team.', 'NORMAL', NOW() + INTERVAL '12 days', NOW() - INTERVAL '3 days', NULL, NULL, 'Excellent mobile development portfolio', false, false, NULL, NOW() - INTERVAL '4 days', NOW()),

-- Completed referrals
('770e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440009', 'COMPLETED', 'Hi Sophie, I love design and I''m very interested in the UI/UX Designer position at InnovateTech.', 'Hi Jessica! I was happy to refer you. Great news - they want to schedule an interview!', 'NORMAL', NOW() + INTERVAL '10 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 day', NULL, 'Successfully submitted referral, interview scheduled', false, false, NULL, NOW() - INTERVAL '6 days', NOW()),

('770e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440004', 'COMPLETED', 'David, I wanted to follow up on the Frontend Developer position. Is there any update?', 'Hi Alex! Great news - they loved your profile and want to move forward with technical interviews!', 'NORMAL', NOW() + INTERVAL '8 days', NOW() - INTERVAL '4 days', NOW() - INTERVAL '2 days', NULL, 'Candidate advanced to final round', false, false, NULL, NOW() - INTERVAL '8 days', NOW()),

-- Rejected referrals
('770e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440005', 'REJECTED', 'Lisa, I think I would be a good fit for the Full Stack Developer role.', 'Hi Maria, I reviewed your profile and while you have good potential, this role requires more full-stack experience than you currently have. I''d recommend applying for junior roles first.', 'NORMAL', NOW() + INTERVAL '5 days', NULL, NULL, 'Insufficient full-stack experience', 'Candidate has potential but needs more experience', false, false, NULL, NOW() - INTERVAL '7 days', NOW()),

('770e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440006', 'REJECTED', 'James, I''m very interested in the Machine Learning Engineer position.', 'Hi Kevin, I appreciate your interest, but this ML role requires advanced experience with TensorFlow and PyTorch which isn''t reflected in your profile yet.', 'NORMAL', NOW() + INTERVAL '6 days', NULL, NULL, 'Lack of ML framework experience', 'Should focus on building ML portfolio first', false, false, NULL, NOW() - INTERVAL '5 days', NOW()),

-- Withdrawn referrals
('770e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440007', 'WITHDRAWN', 'Anna, I''m interested in the QA Engineer position but I found another opportunity.', NULL, 'NORMAL', NOW() + INTERVAL '3 days', NULL, NULL, NULL, 'Candidate found other opportunity', false, false, NULL, NOW() - INTERVAL '4 days', NOW()),

('770e8400-e29b-41d4-a716-446655440011', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440008', 'WITHDRAWN', 'Robert, I''d like to withdraw my application for the Frontend Developer role.', NULL, 'NORMAL', NOW() + INTERVAL '2 days', NULL, NULL, NULL, 'Withdrew to pursue different role', false, false, NULL, NOW() - INTERVAL '3 days', NOW());

-- Update user statistics based on referral activities
UPDATE Users SET referralSuccessRate = 88.7 WHERE id = '550e8400-e29b-41d4-a716-446655440004'; -- David Kim
UPDATE Users SET referralSuccessRate = 91.3 WHERE id = '550e8400-e29b-41d4-a716-446655440005'; -- Lisa Wang
UPDATE Users SET referralSuccessRate = 85.9 WHERE id = '550e8400-e29b-41d4-a716-446655440006'; -- James Miller
UPDATE Users SET referralSuccessRate = 94.2 WHERE id = '550e8400-e29b-41d4-a716-446655440007'; -- Anna Patel
UPDATE Users SET referralSuccessRate = 79.8 WHERE id = '550e8400-e29b-41d4-a716-446655440008'; -- Robert Taylor
UPDATE Users SET referralSuccessRate = 87.4 WHERE id = '550e8400-e29b-41d4-a716-446655440009'; -- Sophie Garcia

-- Update job application counts
UPDATE Jobs SET applicationCount = 45 WHERE id = '660e8400-e29b-41d4-a716-446655440001';
UPDATE Jobs SET applicationCount = 67 WHERE id = '660e8400-e29b-41d4-a716-446655440002';
UPDATE Jobs SET applicationCount = 23 WHERE id = '660e8400-e29b-41d4-a716-446655440003';
UPDATE Jobs SET applicationCount = 34 WHERE id = '660e8400-e29b-41d4-a716-446655440004';
UPDATE Jobs SET applicationCount = 56 WHERE id = '660e8400-e29b-41d4-a716-446655440005';
UPDATE Jobs SET applicationCount = 89 WHERE id = '660e8400-e29b-41d4-a716-446655440006';
UPDATE Jobs SET applicationCount = 78 WHERE id = '660e8400-e29b-41d4-a716-446655440007';
UPDATE Jobs SET applicationCount = 123 WHERE id = '660e8400-e29b-41d4-a716-446655440008';
UPDATE Jobs SET applicationCount = 41 WHERE id = '660e8400-e29b-41d4-a716-446655440009';
UPDATE Jobs SET applicationCount = 92 WHERE id = '660e8400-e29b-41d4-a716-446655440010';

-- Display summary of seeded data
SELECT 'Users' as table_name, COUNT(*) as record_count FROM Users
UNION ALL
SELECT 'Jobs', COUNT(*) FROM Jobs
UNION ALL
SELECT 'Referrals', COUNT(*) FROM Referrals;

-- Show distribution by role
SELECT role, COUNT(*) as count FROM Users GROUP BY role ORDER BY role;

-- Show referral status distribution
SELECT status, COUNT(*) as count FROM Referrals GROUP BY status ORDER BY status;

-- Show jobs by company
SELECT company, COUNT(*) as job_count FROM Jobs GROUP BY company ORDER BY job_count DESC;
