require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Mock database users (for testing)
const users = [
  {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: '$2a$10$YQGzQZjZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZ', // 'password'
    role: 'FRESHER',
    company: 'Test Company',
    skills: ['JavaScript', 'React', 'Node.js']
  },
  {
    id: '2',
    name: 'HR User',
    email: 'hr@example.com',
    password: '$2a$10$YQGzQZjZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZ', // 'password'
    role: 'HR',
    company: 'Tech Company',
    skills: ['Recruitment', 'Management']
  }
];

// Mock jobs
const jobs = [
  {
    id: '1',
    title: 'Software Engineer',
    company: 'Tech Company',
    location: 'Bangalore',
    description: 'Great opportunity for freshers',
    requirements: 'JavaScript, React, Node.js',
    experienceLevel: 'Entry Level',
    createdBy: '2'
  },
  {
    id: '2',
    title: 'Frontend Developer',
    company: 'Startup',
    location: 'Remote',
    description: 'React developer needed',
    requirements: 'React, TypeScript, CSS',
    experienceLevel: 'Mid Level',
    createdBy: '2'
  }
];

// Mock referrals
const referrals = [
  {
    id: '1',
    jobId: '1',
    requesterId: '1',
    referrerId: '2',
    status: 'pending',
    message: 'Interested in this position',
    createdAt: new Date().toISOString()
  }
];

// Helper functions
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'RefNet API is running with JWT!' });
});

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // For simplicity, skip password verification in testing
    const { accessToken, refreshToken } = generateTokens(user);
    
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        skills: user.skills
      },
      token: accessToken
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role = 'FRESHER' } = req.body;
    
    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user (mock)
    const newUser = {
      id: (users.length + 1).toString(),
      name,
      email,
      password: 'hashed_password',
      role: role.toUpperCase(),
      company: '',
      skills: []
    };
    
    users.push(newUser);
    
    const { accessToken, refreshToken } = generateTokens(newUser);
    
    res.json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        company: newUser.company,
        skills: newUser.skills
      },
      token: accessToken
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company,
      skills: user.skills
    }
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Job routes
app.get('/api/jobs', (req, res) => {
  res.json(jobs);
});

app.get('/api/jobs/:id', (req, res) => {
  const job = jobs.find(j => j.id === req.params.id);
  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }
  res.json(job);
});

// Profile routes
app.get('/api/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    company: user.company,
    skills: user.skills,
    bio: 'Passionate developer',
    education: 'Bachelor of Engineering'
  });
});

app.patch('/api/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  // Update user data (mock)
  Object.assign(user, req.body);
  
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    company: user.company,
    skills: user.skills
  });
});

// Referral routes
app.get('/api/referrals/my-referrals', authenticateToken, (req, res) => {
  const userReferrals = referrals.filter(r => 
    r.requesterId === req.user.id || r.referrerId === req.user.id
  );
  
  res.json(userReferrals.map(referral => ({
    ...referral,
    job: jobs.find(j => j.id === referral.jobId),
    requester: users.find(u => u.id === referral.requesterId),
    referrer: users.find(u => u.id === referral.referrerId)
  })));
});

app.post('/api/referrals', authenticateToken, (req, res) => {
  const { jobId, referrerId, message } = req.body;
  
  const newReferral = {
    id: (referrals.length + 1).toString(),
    jobId,
    requesterId: req.user.id,
    referrerId,
    status: 'pending',
    message: message || 'Interested in this position',
    createdAt: new Date().toISOString()
  };
  
  referrals.push(newReferral);
  
  res.json(newReferral);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 RefNet API server running on http://localhost:${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`  - GET  /`);
  console.log(`  - POST /api/auth/login`);
  console.log(`  - POST /api/auth/register`);
  console.log(`  - GET  /api/auth/me`);
  console.log(`  - GET  /api/jobs`);
  console.log(`  - GET  /api/jobs/:id`);
  console.log(`  - GET  /api/profile`);
  console.log(`  - PATCH /api/profile`);
  console.log(`  - GET  /api/referrals/my-referrals`);
  console.log(`  - POST /api/referrals`);
  console.log(`🔑 JWT Secret configured: ${process.env.JWT_SECRET ? '✅' : '❌'}`);
  console.log(`🗄️  Database connected: Mock data (for testing)`);
});
