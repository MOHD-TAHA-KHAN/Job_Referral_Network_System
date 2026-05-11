// Load environment variables
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

console.log('🚀 Starting RefNet Backend Server...');
console.log('🔑 JWT_SECRET:', process.env.JWT_SECRET ? '✅ SET' : '❌ NOT SET');
console.log('🗄️  PG_URI:', process.env.PG_URI ? '✅ SET' : '❌ NOT SET');

// Mock database
const users = [
  { id: '1', name: 'Test User', email: 'test@example.com', role: 'FRESHER', skills: ['JavaScript', 'React'] },
  { id: '2', name: 'HR Manager', email: 'hr@techcompany.com', role: 'HR', skills: ['Recruitment', 'Management'] },
  { id: '3', name: 'Senior Developer', email: 'dev@techcompany.com', role: 'PROFESSIONAL', skills: ['JavaScript', 'React', 'Node.js'] }
];

const jobs = [
  { id: '1', title: 'Software Engineer', company: 'Tech Company', location: 'Bangalore', description: 'Great opportunity for freshers' },
  { id: '2', title: 'Frontend Developer', company: 'Startup', location: 'Remote', description: 'React developer needed' },
  { id: '3', title: 'Full Stack Developer', company: 'Tech Company', location: 'Hybrid', description: 'Full stack position' }
];

const referrals = [
  { id: '1', jobId: '1', requesterId: '1', referrerId: '3', status: 'pending', message: 'Interested in this position' }
];

// JWT generation
const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    console.log('❌ JWT_SECRET not found, using default');
    return 'mock-jwt-token-for-testing';
  }
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

// Auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }
  
  try {
    if (process.env.JWT_SECRET) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } else {
      // Mock authentication for testing
      req.user = { id: '1', email: 'test@example.com', role: 'FRESHER' };
    }
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 RefNet API is running!',
    timestamp: new Date().toISOString(),
    jwt_configured: !!process.env.JWT_SECRET,
    database_configured: !!process.env.PG_URI,
    users_count: users.length,
    jobs_count: jobs.length,
    referrals_count: referrals.length
  });
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  
  if (user) {
    const token = generateToken(user);
    console.log(`✅ Login successful: ${email}`);
    res.json({ user, token });
  } else {
    console.log(`❌ Login failed: ${email}`);
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role = 'FRESHER' } = req.body;
  
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }
  
  const newUser = { 
    id: String(users.length + 1), 
    name, 
    email, 
    role: role.toUpperCase(),
    skills: [],
    company: ''
  };
  users.push(newUser);
  
  const token = generateToken(newUser);
  console.log(`✅ Registration successful: ${email}`);
  res.json({ user: newUser, token });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  res.json({ success: true, user });
});

// Job routes
app.get('/api/jobs', (req, res) => {
  console.log('✅ Jobs requested');
  res.json(jobs);
});

app.get('/api/jobs/:id', (req, res) => {
  const job = jobs.find(j => j.id === req.params.id);
  res.json(job || { message: 'Job not found' });
});

// Profile routes
app.get('/api/profile', authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  res.json({ ...user, bio: 'Passionate developer', education: 'Bachelor of Engineering' });
});

app.patch('/api/profile', authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  Object.assign(user, req.body);
  res.json(user);
});

// Referral routes
app.get('/api/referrals/my-referrals', authMiddleware, (req, res) => {
  const userReferrals = referrals.filter(r => 
    r.requesterId === req.user.id || r.referrerId === req.user.id
  );
  
  const enrichedReferrals = userReferrals.map(referral => ({
    ...referral,
    job: jobs.find(j => j.id === referral.jobId),
    requester: users.find(u => u.id === referral.requesterId),
    referrer: users.find(u => u.id === referral.referrerId)
  }));
  
  res.json(enrichedReferrals);
});

app.post('/api/referrals', authMiddleware, (req, res) => {
  const { jobId, referrerId, message } = req.body;
  
  const newReferral = {
    id: String(referrals.length + 1),
    jobId,
    requesterId: req.user.id,
    referrerId,
    status: 'pending',
    message: message || 'Interested in this position',
    createdAt: new Date().toISOString()
  };
  
  referrals.push(newReferral);
  console.log(`✅ Referral created: Job ${jobId} by User ${req.user.id}`);
  res.json(newReferral);
});

// Google OAuth (mock)
app.get('/api/auth/google', (req, res) => {
  console.log('🌐 Mock Google OAuth redirect');
  const mockGoogleUser = { 
    id: '4', 
    name: 'Google User', 
    email: 'google.user@gmail.com', 
    role: 'FRESHER',
    skills: [],
    company: ''
  };
  
  const token = generateToken(mockGoogleUser);
  res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 RefNet Backend Server running on http://localhost:${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`  - GET  /                    - Server status`);
  console.log(`  - POST /api/auth/login     - User login`);
  console.log(`  - POST /api/auth/register  - User registration`);
  console.log(`  - GET  /api/auth/me        - Get current user`);
  console.log(`  - GET  /api/jobs           - Get all jobs`);
  console.log(`  - GET  /api/profile        - Get user profile`);
  console.log(`  - GET  /api/referrals/my-referrals - Get referrals`);
  console.log(`  - POST /api/referrals     - Create referral`);
  console.log(`  - GET  /api/auth/google    - Google OAuth`);
  console.log(`\n🔐 JWT: ${process.env.JWT_SECRET ? '✅ Configured' : '⚠️ Using mock'}`);
  console.log(`🗄️  Database: ${process.env.PG_URI ? '✅ Configured' : '⚠️ Using mock data'}`);
  console.log(`🎯 Ready for testing!`);
});
