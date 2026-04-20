# 🔗 RefNet — Job Referral Network

> A full-stack platform that bridges the gap between freshers and IT professionals/HRs by enabling direct referral requests, smart matching, and real-time communication.

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB.svg)](https://reactjs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

---

## 📌 The Problem

In India, most job referrals happen through personal connections — freshers without a network are left out. **RefNet** solves this by creating a structured platform where freshers can discover and request referrals from verified IT professionals and HRs at their target companies.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 Auth System | JWT-based login/register with Google OAuth, role-based access (Fresher / Professional / HR) |
| 👤 User Profiles | Detailed profiles with skills, experience, resume upload |
| 💼 Job Listings | Browse, search, and filter job postings by role, company, and location |
| 🤝 Referral Flow | Request referrals, track status (Pending → Accepted → Referred) |
| 🧠 Smart Matching | Skill-based scoring algorithm ranks best professionals for each job |
| 💬 Messaging | Real-time private chat between fresher and referrer via Socket.io |
| 📁 File Service | Resume upload and management via Cloudinary |
| 🔔 Notifications | In-app + email notifications for referral updates |
| 📊 Dashboard | Personalized stats — referrals sent/received, response rate, activity feed |

---

## 🏗️ Architecture

This project uses a **Monolithic Architecture** — a deliberate choice for a solo portfolio project that keeps the codebase simple, easy to run locally, and straightforward to deploy.

```
referral-network/
├── client/                  # React (Vite) frontend
│   └── src/
│       ├── pages/           # Auth, Dashboard, Jobs, Chat, Profile
│       ├── components/      # Reusable UI components
│       ├── store/           # Zustand global state
│       └── services/        # Axios API layer
│
└── server/                  # Express + Node.js backend
    ├── config/              # Database and environment configuration
    ├── middleware/          # JWT auth, rate limiter, error handler
    ├── modules/
    │   ├── auth/            # Register, login, OAuth
    │   ├── profile/         # User profiles
    │   ├── jobs/            # Job listings & search
    │   ├── referral/        # Referral request flow
    │   ├── messaging/       # Socket.io real-time chat
    │   ├── files/           # Resume upload (Multer + Cloudinary)
    │   ├── notifications/   # Email + in-app alerts
    │   ├── dashboard/       # Aggregated user stats
    │   └── matching/        # Smart matching algorithm
    └── models/
        └── pg/              # Sequelize models (PostgreSQL)
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **React Router v6** for navigation
- **Zustand** for global state management
- **Axios** for API calls
- **Socket.io-client** for real-time messaging

### Backend
- **Node.js + Express.js** — REST API
- **Socket.io** — WebSocket server for real-time chat
- **JWT** — Access + refresh token authentication
- **bcryptjs** — Password hashing

### Database
- **PostgreSQL** — Complete database solution with enhanced features (users, jobs, referrals, caching, full-text search)

### External Services
- **Cloudinary** — Resume & file storage
- **Nodemailer** — Email notifications
- **Google OAuth 2.0** — Social login

---

## 🧠 Smart Matching Algorithm

When a fresher requests a referral for a job, the system scores and ranks relevant professionals:

```js
function matchScore(fresher, professional, job) {
  let score = 0;

  // Skill overlap between fresher's skills and job requirements
  const skillMatch = fresher.skills.filter(s =>
    job.requiredSkills.includes(s)
  ).length;
  score += skillMatch * 20;

  // Professional works at the hiring company
  if (professional.company === job.company) score += 40;

  // Domain match
  if (professional.domain === job.domain) score += 20;

  // Past referral success rate
  score += professional.referralSuccessRate * 10;

  return score;
}
```

The top 5 ranked professionals are shown to the fresher, who can then choose who to request from.

---

## 🗄️ Database Design

**PostgreSQL-Only Architecture**

- **PostgreSQL** handles all data types with advanced features:
  - Structured relational data (users, jobs, referrals)
  - Array fields for skills and requirements
  - Full-text search capabilities
  - Cache tables for session management
  - JSONB fields for flexible data storage
  - Advanced indexing for optimal performance

---

## 🚀 Getting Started

### Prerequisites
- Node.js v20+
- Docker Desktop (for PostgreSQL)
- Git

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/referral-network.git
cd referral-network
```

### 2. Start PostgreSQL with Docker
```bash
docker-compose up postgres pgadmin -d
```

### 3. Setup the server
```bash
cd server
npm install
cp .env.example .env
# Fill in your .env values (see Environment Variables below)
npm run dev
```

### 4. Setup the client
```bash
cd ../client
npm install
npm run dev
```

The app will be running at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`
- Database Admin: `http://localhost:5050` (pgAdmin)

---

## ⚙️ Environment Variables

Create a `.env` file inside the `server/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (PostgreSQL Only)
PG_URI=postgresql://postgres:password@localhost:5433/referraldb

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here

# External Services
CLOUDINARY_URL=your_cloudinary_url
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Client Configuration
CLIENT_URL=http://localhost:5173
```

---

## 🔐 Auth Flow

This project uses a **dual-token JWT strategy**:

- **Access token** — short-lived (15 min), stored in memory, sent in `Authorization: Bearer` header
- **Refresh token** — long-lived (7 days), stored in `httpOnly` cookie
- On logout, refresh token is added to a **PostgreSQL blacklist table** (TTL = remaining token lifetime)

---

## 📡 API Overview

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | — |
| POST | `/api/auth/login` | Login, get tokens | — |
| POST | `/api/auth/refresh` | Refresh access token | Cookie |
| GET | `/api/jobs` | List all jobs | ✓ |
| POST | `/api/jobs` | Create job (HR only) | ✓ HR |
| POST | `/api/referrals` | Request a referral | ✓ Fresher |
| PATCH | `/api/referrals/:id` | Accept/reject referral | ✓ Pro |
| GET | `/api/match/:jobId` | Get matched professionals | ✓ |
| GET | `/api/messages/:referralId` | Get chat messages | ✓ |
| POST | `/api/files/resume` | Upload resume | ✓ |

---

## 🗺️ Roadmap

- [x] Project scaffold & Docker setup
- [x] Auth system (JWT + Google OAuth)
- [x] User profiles (Fresher & Professional)
- [ ] Job listings with search & filters
- [ ] Referral request flow
- [ ] Smart matching algorithm
- [ ] Real-time messaging (Socket.io)
- [ ] Notification system (email + in-app)
- [ ] Dashboard with analytics
- [ ] Resume upload (Cloudinary)
- [ ] Deployment (Render / Railway)

---

## 🤝 Contributing

This is a personal portfolio project but PRs and suggestions are welcome!

1. Fork the repo
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 👨‍💻 Author

Built with passion by a fresher, for freshers.

> Currently open to opportunities — feel free to connect on [LinkedIn](#) or reach out via [GitHub Issues](../../issues).

---

## 📄 License

This project is licensed under the **Apache License 2.0** — see the [LICENSE](LICENSE) file for details.
