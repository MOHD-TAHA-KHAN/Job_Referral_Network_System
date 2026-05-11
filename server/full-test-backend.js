// Load environment variables from .env file
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

console.log('🔧 Environment Check:');
console.log('🔑 JWT_SECRET:', process.env.JWT_SECRET ? '✅ SET' : '❌ NOT SET');
console.log('🔑 JWT_REFRESH_SECRET:', process.env.JWT_REFRESH_SECRET ? '✅ SET' : '❌ NOT SET');
console.log('🌍 GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✅ SET' : '❌ NOT SET');
console.log('🗄️  PG_URI:', process.env.PG_URI ? '✅ SET' : '❌ NOT SET');

// Mock database with realistic data
const users = [
  { 
    id: '1', 
    name: 'Test User', 
    email: 'test@example.com', 
    role: 'FRESHER',
    company: '',
    skills: ['JavaScript', 'React', 'Node.js'],
    bio: 'Passionate fresher looking for opportunities'
  },
  { 
    id: '2', 
    name: 'HR Manager', 
    email: 'hr@techcompany.com', 
    role: 'HR',
    company: 'Tech Company',
    skills: ['Recruitment', 'Management'],
    bio: 'Experienced HR professional'
  },
  { 
    id: '3', 
    name: 'Senior Developer', 
    email: 'dev@techcompany.com', 
    role: 'PROFESSIONAL',
    company: 'Tech Company',
    skills: ['JavaScript', 'React', 'Node.js', 'Python'],
    bio: 'Senior developer with 5+ years experience'
  }
];

const jobs = [
  {
    id: '1',
    title: 'Software Engineer',
    company: 'Tech Company',
    location: 'Bangalore',
    description: 'Great opportunity for freshers to join our team',
    requirements: 'JavaScript, React, Node.js',
    experienceLevel: 'Entry Level',
    salary: '8-12 LPA',
    type: 'Full-time',
    postedBy: '2'
  },
  {
    id: '2',
    title: 'Frontend Developer',
    company: 'Startup',
    location: 'Remote',
    description: 'React developer needed for exciting startup',
    requirements: 'React, TypeScript, CSS',
    experienceLevel: 'Mid Level',
    salary: '12-18 LPA',
    type: 'Full-time',
    postedBy: '2'
  },
  {
    id: '3',
    title: 'Full Stack Developer',
    company: 'Tech Company',
    location: 'Hybrid',
    description: 'Full stack position with both frontend and backend work',
    requirements: 'JavaScript, React, Node.js, MongoDB',
    experienceLevel: 'Mid Level',
    salary: '15-20 LPA',
    type: 'Full-time',
    postedBy: '2'
  }
];

const referrals = [
  {
    id: '1',
    jobId: '1',
    requesterId: '1',
    referrerId: '3',
    status: 'pending',
    message: 'I am very interested in this Software Engineer position. I have the required skills and would love to learn from your team.',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    jobId: '2',
    requesterId: '1',
    referrerId: '3',
    status: 'accepted',
    message: 'Great opportunity! Would appreciate your referral.',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

// JWT generation
const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not configured');
  }
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

// Authentication middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }
  
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'JWT_SECRET not configured' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 RefNet API is running!',
    timestamp: new Date().toISOString(),
    jwt_configured: !!process.env.JWT_SECRET,
    oauth_configured: !!process.env.GOOGLE_CLIENT_ID,
    database_configured: !!process.env.PG_URI,
    endpoints: {
      auth: ['/api/auth/login', '/api/auth/register', '/api/auth/me', '/api/auth/google'],
      jobs: ['/api/jobs', '/api/jobs/:id'],
      profile: ['/api/profile'],
      referrals: ['/api/referrals/my-referrals', '/api/referrals']
    }
  });
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
  try {
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
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password, role = 'FRESHER' } = req.body;
    
    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const newUser = { 
      id: String(users.length + 1), 
      name, 
      email, 
      role: role.toUpperCase(),
      company: '',
      skills: [],
      bio: ''
    };
    users.push(newUser);
    
    const token = generateToken(newUser);
    console.log(`✅ Registration successful: ${email}`);
    res.json({ user: newUser, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json({ success: true, user });
});

app.post('/api/auth/logout', (req, res) => {
  console.log('✅ User logged out');
  res.json({ message: 'Logged out successfully' });
});

// Job routes
app.get('/api/jobs', (req, res) => {
  console.log('✅ Jobs requested');
  res.json(jobs);
});

app.get('/api/jobs/:id', (req, res) => {
  const job = jobs.find(j => j.id === req.params.id);
  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }
  console.log(`✅ Job requested: ${job.title}`);
  res.json(job);
});

// Profile routes
app.get('/api/profile', authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  console.log(`✅ Profile requested: ${user.email}`);
  res.json(user);
});

app.patch('/api/profile', authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  // Update user data
  Object.assign(user, req.body);
  console.log(`✅ Profile updated: ${user.email}`);
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
  
  console.log(`✅ Referrals requested: ${enrichedReferrals.length} found`);
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

// Google OAuth routes
app.get('/api/auth/google', (req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(500).json({ message: 'Google OAuth not configured' });
  }
  
  const googleAuthUrl = `https://accounts.google.com/oauth/authorize?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=http://localhost:5000/api/auth/google/callback&scope=profile email&response_type=code`;
  console.log('🌐 Redirecting to Google OAuth');
  res.redirect(googleAuthUrl);
});

app.get('/api/auth/google/callback', (req, res) => {
  console.log('🌐 Google OAuth callback received');
  
  // Mock successful OAuth (in real implementation, exchange code for tokens)
  const mockGoogleUser = { 
    id: '4', 
    name: 'Google User', 
    email: 'google.user@gmail.com', 
    role: 'FRESHER',
    company: '',
    skills: [],
    bio: 'User from Google OAuth'
  };
  
  const token = generateToken(mockGoogleUser);
  console.log('✅ Google OAuth successful, redirecting to frontend');
  res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 RefNet API Server running on http://localhost:${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`  - GET  /                    - Server status`);
  console.log(`  - POST /api/auth/login     - User login`);
  console.log(`  - POST /api/auth/register  - User registration`);
  console.log(`  - GET  /api/auth/me        - Get current user`);
  console.log(`  - POST /api/auth/logout    - User logout`);
  console.log(`  - GET  /api/jobs           - Get all jobs`);
  console.log(`  - GET  /api/jobs/:id       - Get job by ID`);
  console.log(`  - GET  /api/profile        - Get user profile`);
  console.log(`  - PATCH /api/profile      - Update profile`);
  console.log(`  - GET  /api/referrals/my-referrals - Get user referrals`);
  console.log(`  - POST /api/referrals     - Create referral`);
  console.log(`  - GET  /api/auth/google    - Google OAuth`);
  console.log(`  - GET  /api/auth/google/callback - OAuth callback`);
  console.log(`\n🔐 JWT: ${process.env.JWT_SECRET ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`🌐 OAuth: ${process.env.GOOGLE_CLIENT_ID ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`🗄️  Database: ${process.env.PG_URI ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`\n🎯 Ready for full system testing!`);
});
