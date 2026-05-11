const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Basic test route
app.get('/', (req, res) => {
  res.json({ message: 'RefNet API is running!' });
});

// Mock auth routes for testing
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    res.json({
      user: { id: '1', name: 'Test User', email, role: 'fresher' },
      token: 'mock-jwt-token'
    });
  } else {
    res.status(400).json({ message: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role } = req.body;
  if (name && email && password) {
    res.json({
      user: { id: '1', name, email, role: role || 'fresher' },
      token: 'mock-jwt-token'
    });
  } else {
    res.status(400).json({ message: 'Invalid data' });
  }
});

app.get('/api/auth/me', (req, res) => {
  res.json({ 
    success: true, 
    user: { id: '1', name: 'Test User', email: 'test@example.com', role: 'fresher' }
  });
});

// Mock jobs routes
app.get('/api/jobs', (req, res) => {
  res.json([
    {
      id: '1',
      title: 'Software Engineer',
      company: 'Tech Company',
      location: 'Bangalore',
      description: 'Great opportunity for freshers',
      experienceLevel: 'Entry Level'
    },
    {
      id: '2',
      title: 'Frontend Developer',
      company: 'Startup',
      location: 'Remote',
      description: 'React developer needed',
      experienceLevel: 'Mid Level'
    }
  ]);
});

app.get('/api/jobs/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    id,
    title: 'Software Engineer',
    company: 'Tech Company',
    location: 'Bangalore',
    description: 'Great opportunity for freshers',
    experienceLevel: 'Entry Level',
    requirements: 'JavaScript, React, Node.js'
  });
});

// Mock profile routes
app.get('/api/profile', (req, res) => {
  res.json({
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'fresher',
    bio: 'Passionate developer',
    skills: ['JavaScript', 'React', 'Node.js']
  });
});

// Mock referral routes
app.get('/api/referrals/my-referrals', (req, res) => {
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
  console.log('Test endpoints:');
  console.log('- GET /');
  console.log('- POST /api/auth/login');
  console.log('- GET /api/jobs');
  console.log('- GET /api/profile');
});
