# Contributing to RefNet — Job Referral Network

First off, thank you for considering contributing to RefNet! This project was built by a fresher, for freshers — and every contribution, no matter how small, makes a real difference.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Who Can Contribute](#who-can-contribute)
- [How to Contribute](#how-to-contribute)
- [Getting Started Locally](#getting-started-locally)
- [Project Structure](#project-structure)
- [Contribution Types](#contribution-types)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Contact](#contact)

---

## Code of Conduct

This project follows a simple rule — **be kind, be helpful, be constructive.**

- Respect everyone regardless of experience level
- No gatekeeping — freshers and beginners are especially welcome
- Constructive criticism only — if something is wrong, explain why and suggest a fix
- No spam, self-promotion, or off-topic discussions

Violations will result in removal from the project. Simple as that.

---

## Who Can Contribute

**Everyone is welcome** — whether you are:

- An experienced developer who wants to help a fresher grow
- A fellow fresher who spotted a bug or wants to add a feature
- An HR or professional who wants to improve the platform you use
- Someone who just wants to improve documentation or fix a typo

No contribution is too small. Fixing a typo in the README counts.

---

## How to Contribute

### Step 1 — Fork the repository

Click the **Fork** button at the top right of this page. This creates your own copy of the repo.

### Step 2 — Clone your fork

```bash
git clone https://github.com/YOUR_USERNAME/Job_Referral_Network_System.git
cd Job_Referral_Network_System
```

### Step 3 — Create a new branch

Always create a new branch for your work. Never push directly to `main`.

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-you-are-fixing
```

Branch naming convention:
```
feature/smart-matching-improvement
fix/login-token-bug
docs/update-readme
refactor/auth-service-cleanup
```

### Step 4 — Set up the project locally

Follow the setup instructions in [README.md](./README.md).

Quick summary:
```bash
# Start databases
docker-compose up -d

# Setup server
cd server
npm install
cp .env.example .env
# Fill in your .env values
npm run dev

# Setup client (in separate terminal)
cd client
npm install
npm run dev
```

### Step 5 — Make your changes

- Write clean, readable code
- Follow the existing code style
- Add comments where the logic is not obvious
- Test your changes manually before submitting

### Step 6 — Commit your changes

Follow the commit message guidelines below.

```bash
git add .
git commit -m "feat: add skill-based filtering to job search"
git push origin feature/your-feature-name
```

### Step 7 — Open a Pull Request

- Go to your fork on GitHub
- Click **"Compare & pull request"**
- Fill in the PR template
- Submit and wait for review

---

## Getting Started Locally

### Prerequisites

```
Node.js v20+
Docker Desktop
Git
```

### Environment Variables

Copy `.env.example` to `.env` inside the `server/` folder and fill in:

```env
PORT=5000
JWT_SECRET=your_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
PG_URI=postgresql://postgres:password@localhost:5433/referraldb
MONGO_URI=mongodb://localhost:27017/referraldb
REDIS_URL=redis://localhost:6379
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:5173
```

### Port Configuration

> **Important for Windows users:** This project uses PostgreSQL on port `5433` (not default `5432`) to avoid conflicts with local PostgreSQL installations. See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for details.

---

## Project Structure

```
Job_Referral_Network_System/
├── client/                  # React frontend (Vite)
│   └── src/
│       ├── pages/           # Auth, Dashboard, Jobs, Chat, Profile
│       ├── components/      # Reusable UI components
│       ├── store/           # Zustand global state
│       └── services/        # Axios API calls
│
└── server/                  # Express + Node.js backend
    ├── config/              # DB, Redis, Passport config
    ├── middleware/          # JWT auth, error handler
    ├── modules/             # Feature modules (auth, jobs, referral...)
    │   ├── auth/            # routes + controller + service
    │   ├── jobs/
    │   ├── referral/
    │   ├── messaging/
    │   ├── matching/
    │   └── ...
    └── models/
        ├── pg/              # Sequelize models (PostgreSQL)
        └── mongo/           # Mongoose models (MongoDB)
```

Each module follows this pattern:
```
module/
├── module.routes.js      # URL definitions
├── module.controller.js  # Request/response handling
└── module.service.js     # Business logic
```

---

## Contribution Types

### Bug Fixes
- Check existing issues first to avoid duplicates
- Open an issue describing the bug before submitting a fix
- Include steps to reproduce the bug

### New Features
- Open an issue first to discuss the feature
- Wait for approval before building — saves everyone time
- Keep features focused and small — large PRs are hard to review

### Documentation
- Fix typos, improve clarity, add missing information
- Add code comments where logic is complex
- Improve the README, TROUBLESHOOTING, or this file

### Performance Improvements
- Profile before and after — include numbers in your PR
- Explain what you changed and why it is faster

### UI/UX Improvements (Frontend)
- Keep the design consistent with existing components
- Test on both mobile and desktop
- Include screenshots in your PR

---

## Commit Message Guidelines

Follow this format for all commits:

```
type: short description in present tense
```

**Types:**
```
feat     → new feature
fix      → bug fix
docs     → documentation changes
style    → formatting, no logic change
refactor → code restructure, no feature change
test     → adding or updating tests
chore    → build process, dependencies
perf     → performance improvement
```

**Good examples:**
```
feat: add skill-based filtering to job listings
fix: resolve JWT token expiry not being handled
docs: add Google OAuth setup steps to README
refactor: split auth service into smaller functions
chore: update sequelize to v6.37
```

**Bad examples:**
```
fixed stuff
update
WIP
asdfgh
```

---

## Pull Request Process

### Before submitting your PR

- [ ] Code runs without errors locally
- [ ] All existing features still work (no regressions)
- [ ] Code follows the existing style and structure
- [ ] Commit messages follow the guidelines above
- [ ] PR description clearly explains what changed and why

### PR description template

When opening a PR, include:

```
## What does this PR do?
Brief description of the change.

## Why is this change needed?
Context and motivation.

## How was it tested?
Steps you took to verify the change works.

## Screenshots (if UI change)
Before and after screenshots.

## Related issue
Closes #issue_number
```

### Review process

- PRs will be reviewed within 2-3 days
- Address all review comments before merging
- Once approved, the PR will be merged into `main`
- Your name will be added to the contributors list

---

## Reporting Bugs

Found a bug? Please open an issue with:

**Title:** `[Bug] Short description of the bug`

**Include:**
- What you expected to happen
- What actually happened
- Steps to reproduce
- Your OS and Node.js version
- Error message or screenshot if available

**Example:**
```
Title: [Bug] Login returns 500 when email has uppercase letters

Expected: Login succeeds
Actual: Server returns 500 Internal Server Error

Steps to reproduce:
1. Register with email: Test@gmail.com
2. Try to login with: TEST@gmail.com
3. Server crashes

OS: Windows 11
Node: v20.x
Error: ...
```

---

## Suggesting Features

Have an idea? Open an issue with:

**Title:** `[Feature] Short description of the feature`

**Include:**
- Problem this feature solves
- How you think it should work
- Any alternatives you considered

---

## Good First Issues

New to the project? Look for issues tagged:

```
good first issue    → beginner friendly
help wanted         → maintainer needs help
documentation       → no coding required
```

These are the best starting points if you are new to open source.

---

## Contact

Built and maintained by **MOHD-TAHA-KHAN**

- GitHub Discussions: [Start a discussion](../../discussions)
- GitHub Issues: [Open an issue](../../issues)

If you are a professional or HR who wants to contribute guidance, mentorship, or feedback — you are especially welcome. This project exists to help freshers like me break into the industry.

> "If you want to go fast, go alone. If you want to go far, go together."

---

## Thank You

Every star, fork, issue, and pull request motivates me to keep building. If this project helped you in any way — pay it forward by contributing or sharing it with someone who needs it.

**Together we can help more freshers get their first opportunity.** 🚀