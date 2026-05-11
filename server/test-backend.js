// Load environment variables
require('dotenv').config();

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

console.log('🔑 JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
console.log('🔑 JWT_REFRESH_SECRET:', process.env.JWT_REFRESH_SECRET ? 'SET' : 'NOT SET');
console.log('🌍 GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET');

// Mock database
const users = [
  { id: '1', name: 'Test User', email: 'test@example.com', role: 'FRESHER' },
  { id: '2', name: 'HR User', email: 'hr@example.com', role: 'HR' }
];

const jobs = [
  { id: '1', title: 'Software Engineer', company: 'Tech Company', location: 'Bangalore' },
  { id: '2', title: 'Frontend Developer', company: 'Startup', location: 'Remote' }
];

// JWT generation
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

// Authentication middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'RefNet API is running!',
    timestamp: new Date().toISOString(),
    jwt_configured: !!process.env.JWT_SECRET
  });
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  
  if (user) {
    const token = generateToken(user);
    res.json({ user, token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role = 'FRESHER' } = req.body;
  const newUser = { id: String(users.length + 1), name, email, role };
  users.push(newUser);
  const token = generateToken(newUser);
  res.json({ user: newUser, token });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  res.json({ success: true, user });
});

// Job routes
app.get('/api/jobs', (req, res) => {
  res.json(jobs);
});

app.get('/api/jobs/:id', (req, res) => {
  const job = jobs.find(j => j.id === req.params.id);
  res.json(job || { message: 'Job not found' });
});

// Profile routes
app.get('/api/profile', authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  res.json({ ...user, skills: ['JavaScript', 'React'], bio: 'Test bio' });
});

// Referral routes
app.get('/api/referrals/my-referrals', authMiddleware, (req, res) => {
  res.json([
    {
      id: '1',
      jobId: '1',
      status: 'pending',
      job: { title: 'Software Engineer', company: 'Tech Company' },
      requester: { name: 'Test User', email: 'test@example.com' }
    }
  ]);
});

// Google OAuth routes (mock)
app.get('/api/auth/google', (req, res) => {
  const googleAuthUrl = `https://accounts.google.com/oauth/authorize?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=http://localhost:5000/api/auth/google/callback&scope=profile email&response_type=code`;
  res.redirect(googleAuthUrl);
});

app.get('/api/auth/google/callback', (req, res) => {
  // Mock successful OAuth
  const user = { id: '3', name: 'Google User', email: 'google@example.com', role: 'FRESHER' };
  const token = generateToken(user);
  res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 RefNet API Server running on http://localhost:${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`  - GET  /`);
  console.log(`  - POST /api/auth/login`);
  console.log(`  - POST /api/auth/register`);
  console.log(`  - GET  /api/auth/me`);
  console.log(`  - GET  /api/jobs`);
  console.log(`  - GET  /api/profile`);
  console.log(`  - GET  /api/referrals/my-referrals`);
  console.log(`  - GET  /api/auth/google`);
  console.log(`🔐 JWT: ${process.env.JWT_SECRET ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`🌐 OAuth: ${process.env.GOOGLE_CLIENT_ID ? '✅ Configured' : '❌ Not configured'}`);
});
