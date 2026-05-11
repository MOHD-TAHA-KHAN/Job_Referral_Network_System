<p align="center">
  <img src="screenshots/01-landing.png" alt="RefNet Landing Page" width="100%" />
</p>

<h1 align="center">RefNet — India's #1 Referral Network for Freshers</h1>

<p align="center">
  Connect with IT professionals at your dream companies. Request referrals, track your status, and land your first job faster.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite" />
  <img src="https://img.shields.io/badge/Zustand-5-orange?style=flat-square" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
</p>

---

## Screenshots

### 01 · Landing Page
<img src="screenshots/01-landing.png" alt="Landing Page" width="100%" />

> Public home page with hero section, search bar, "How RefNet Works" steps, company logos bar, and footer.

---

### 02 · Login / Register
<img src="screenshots/02-login.png" alt="Login Page" width="100%" />

> Two-column layout — brand pitch on the left, sign-in form on the right. Supports Fresher / Professional / HR roles and Google OAuth.

---

### 03 · Fresher Dashboard
<img src="screenshots/03-dashboard.png" alt="Fresher Dashboard" width="100%" />

> Stat cards (Referrals Sent, Pending, Referred, Profile Views), Active Referrals list, and Recommended Jobs with "Get Referred" CTAs.

---

### 04 · Browse Jobs + Detail
<img src="screenshots/04-jobs.png" alt="Browse Jobs" width="100%" />

> Three-panel layout: filter sidebar (Experience / Location / Job Type), job list with salary and referrer count, and inline job detail with Request Referral + Save Job buttons.

---

### 05 · Match / Suggested Referrers
<img src="screenshots/05-referrers.png" alt="Suggested Referrers" width="100%" />

> AI-matched referrer cards with compatibility score, skill chips, years at company, and referrals given. Top Match highlighted with a banner.

---

### 06 · Referral Detail + Status Timeline
<img src="screenshots/06-referral-detail.png" alt="Referral Detail" width="100%" />

> Breadcrumb navigation, referral timeline (Request Sent → Accepted → Referred to HR → Interview), Your Referrer card, and Application Note.

---

### 07 · Messages / Chat
<img src="screenshots/07-chat.png" alt="Messages" width="100%" />

> Conversation list with search, active chat window with blue (sent) / white (received) bubbles, and message input with send button.

---

### 08 · Professional Inbox
<img src="screenshots/08-professional-inbox.png" alt="Professional Inbox" width="100%" />

> Professional role view — incoming referral requests with requester details, skill tags, and Accept / Decline / View Profile actions.

---

### 09 · Create Job Posting (HR)
<img src="screenshots/09-create-job.png" alt="Create Job Posting" width="100%" />

> HR / Company dashboard for creating job postings with live preview, required skills tags, experience level, and deadline fields.

---

### 10 · Profile + Resume
<img src="screenshots/10-profile.png" alt="Profile" width="100%" />

> Profile completeness bar, contact & links, skills chips, resume upload card, and experience / projects timeline.

---

### 11 · Notifications
<img src="screenshots/11-notifications.png" alt="Notifications" width="100%" />

> Full notifications page grouped by Today / Yesterday with colored icons, unread blue dot, and action buttons.

---

### 11b · Notification Bell Dropdown
<img src="screenshots/11b-notif-dropdown.png" alt="Notification Dropdown" width="50%" />

> Compact dropdown from the bell icon in the header — shows top 3 notifications with Mark all read and View all link.

---

## Features

| Feature | Description |
|---------|-------------|
| 🔍 **Job Discovery** | Browse jobs with filters for experience level, location, and job type |
| 🤝 **AI Referrer Matching** | Get matched with professionals based on company, domain, seniority & connections |
| 📤 **One-Click Referral Request** | Send your profile to a referrer with a single click |
| 📊 **Referral Timeline** | Track status from Request Sent → Accepted → Referred to HR → Interview |
| 💬 **In-App Messaging** | Chat directly with referrers about your application |
| 🔔 **Notifications** | Real-time alerts for referral updates, new matches, and messages |
| 👤 **Profile & Resume** | Manage your profile, skills, projects, and resume upload |
| 🏢 **HR Dashboard** | Companies can post jobs and manage referral pipelines |
| 🔐 **Google OAuth** | Sign in with Google in addition to email/password |
| 🎨 **Pixel-perfect UI** | Matches the Pixso design system exactly |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript 5.8 |
| Build tool | Vite 7 |
| Routing | React Router 7 |
| State | Zustand 5 |
| HTTP | Axios |
| Styling | CSS3 (design-system.css) |
| Animations | Motion |

---

## Quick Start

### Prerequisites
- Node.js v18+
- npm v9+
- Backend running at `http://localhost:3001` ([Job_Referral_Network_System](https://github.com/MOHD-TAHA-KHAN/Job_Referral_Network_System))

### 1. Install

```bash
cd "react-Design file/react"
npm install
```

### 2. Configure environment

```bash
# .env (already created)
VITE_API_URL=http://localhost:3001/api
```

### 3. Run

```bash
npm run dev
# → http://localhost:5173
```

### 4. Build

```bash
npm run build
# output → dist/
```

---

## Project Structure

```
src/
├── components/
│   ├── AppSidebar.tsx        # Shared dark navy sidebar
│   ├── NotificationBell.tsx  # Bell icon + dropdown
│   ├── ProtectedRoute.tsx    # Auth guard
│   └── Layout.tsx            # Page wrapper
│
├── pages/
│   ├── LandingPage.tsx       # 01 - Public home
│   ├── LoginPage.tsx         # 02 - Sign in
│   ├── SignUpPage.tsx        # 02 - Register
│   ├── Dashboard.tsx         # 03 - Fresher dashboard
│   ├── JobListings.tsx       # 04 - Browse jobs
│   ├── JobDetails.tsx        # 05 - Suggested referrers
│   ├── ReferralsPage.tsx     # 06 + 08 - Timeline & inbox
│   ├── Chat.tsx              # 07 - Messages
│   ├── SettingsPage.tsx      # 09 - HR job posting
│   ├── Profile.tsx           # 10 - Profile + resume
│   ├── NotificationsPage.tsx # 11 - Notifications
│   ├── OnboardingPage.tsx    # Post-signup onboarding
│   ├── AboutPage.tsx         # How it works
│   └── ContactPage.tsx       # Contact / for companies
│
├── services/
│   ├── api.ts                # Axios instance + interceptors
│   ├── authService.ts        # Login, register, OAuth
│   ├── jobService.ts         # Jobs CRUD
│   ├── referralService.ts    # Referrals + matching
│   └── profileService.ts     # Profile + resume upload
│
├── store/
│   └── useAuthStore.ts       # Zustand auth state
│
├── router/
│   ├── routes.ts             # Route definitions
│   └── components/
│       └── StaticWrapper.tsx # Route renderer
│
└── styles/
    ├── design-system.css     # Shared tokens, sidebar, cards, buttons
    ├── landing.css           # Landing page extras
    └── ...                   # Pixso-exported page styles
```

---

## Routes

| Path | Page | Auth |
|------|------|------|
| `/` | Landing | Public |
| `/login` | Login | Public |
| `/signup` | Sign Up | Public |
| `/auth/callback` | OAuth Callback | Public |
| `/dashboard` | Fresher Dashboard | ✅ |
| `/jobs` | Browse Jobs | ✅ |
| `/jobs/:id` | Suggested Referrers | ✅ |
| `/referrals` | My Referrals / Timeline | ✅ |
| `/chat` | Messages | ✅ |
| `/notifications` | Notifications | ✅ |
| `/profile` | Profile + Resume | ✅ |
| `/settings` | HR Job Posting | ✅ |
| `/onboarding` | Onboarding | ✅ |
| `/about` | How it Works | Public |
| `/contact` | For Companies | Public |

---

## Backend Integration

This frontend connects to the [Job_Referral_Network_System](https://github.com/MOHD-TAHA-KHAN/Job_Referral_Network_System) backend.

| Endpoint | Used by |
|----------|---------|
| `POST /auth/login` | LoginPage |
| `POST /auth/register` | SignUpPage |
| `GET /auth/me` | App startup (token validation) |
| `GET /auth/google` | Google OAuth |
| `GET /jobs` | JobListings |
| `GET /jobs/:id` | JobDetails |
| `POST /jobs` | SettingsPage (HR) |
| `GET /referrals` | ReferralsPage, Dashboard |
| `POST /referrals` | JobDetails (request referral) |
| `PATCH /referrals/:id/status` | ReferralsPage (accept/decline) |
| `GET /matching/:jobId` | JobDetails (suggested referrers) |
| `GET /profile` | Profile |
| `PUT /profile` | Profile (edit) |
| `POST /files/resume` | Profile (upload) |

> **Dev mode:** `DEV_BYPASS_AUTH = true` in `ProtectedRoute.tsx` lets you browse all pages without logging in. Set to `false` before deploying.

---

## Design System

All app pages share a consistent design system defined in `src/styles/design-system.css`:

- **Navy sidebar** `#1e2a45` with active state in accent blue `#4f6ef7`
- **Light page background** `#f0f2f8`
- **White cards** with `1px solid #e8eaf0` border and `12px` radius
- **Status badges** — Pending (amber), Accepted (green), Rejected (red), Referred (blue)
- **Typography** — Inter font, 13–22px scale

---

## Contributing

```bash
git checkout -b feature/your-feature
# make changes
git commit -m "feat: describe your change"
git push origin feature/your-feature
# open a Pull Request
```

---

## License

MIT © 2025 RefNet

---

<p align="center">Built for India's tech freshers 🇮🇳</p>
