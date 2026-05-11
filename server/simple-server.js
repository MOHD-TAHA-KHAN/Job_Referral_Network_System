const http = require('http');

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Basic routes
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'RefNet API is running!' }));
    return;
  }

  // Auth routes
  if (req.url === '/api/auth/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { email, password } = JSON.parse(body);
        if (email && password) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            user: { id: '1', name: 'Test User', email, role: 'fresher' },
            token: 'mock-jwt-token'
          }));
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Invalid credentials' }));
        }
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid JSON' }));
      }
    });
    return;
  }

  if (req.url === '/api/auth/me' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      user: { id: '1', name: 'Test User', email: 'test@example.com', role: 'fresher' }
    }));
    return;
  }

  // Jobs routes
  if (req.url === '/api/jobs' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify([
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
    ]));
    return;
  }

  // Profile routes
  if (req.url === '/api/profile' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'fresher',
      bio: 'Passionate developer',
      skills: ['JavaScript', 'React', 'Node.js']
    }));
    return;
  }

  // Referral routes
  if (req.url === '/api/referrals/my-referrals' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify([
      {
        id: '1',
        jobId: '1',
        status: 'pending',
        job: { title: 'Software Engineer', company: 'Tech Company' },
        requester: { name: 'Test User', email: 'test@example.com' }
      }
    ]));
    return;
  }

  // 404 for other routes
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Route not found' }));
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('- GET /');
  console.log('- POST /api/auth/login');
  console.log('- GET /api/auth/me');
  console.log('- GET /api/jobs');
  console.log('- GET /api/profile');
  console.log('- GET /api/referrals/my-referrals');
});
