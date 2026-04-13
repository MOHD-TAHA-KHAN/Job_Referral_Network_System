# 🔧 Troubleshooting Guide

Real issues encountered while building and setting up this project — with exact fixes.

---

## Port Conflicts — What Happened & Why

### Problem 1 — PostgreSQL port 5432 conflict

**What happened:** Node.js kept saying `database "referraldb" does not exist` even though Docker showed it existed.

**Root cause:** Windows had two processes on port `5432` simultaneously — the Docker PostgreSQL container AND a PostgreSQL installation that came pre-installed on Windows. Node.js was connecting to the Windows PostgreSQL (which had no `referraldb`) instead of the Docker one.

**How we found it:**
```bash
netstat -ano | grep 5432
# Showed TWO different PIDs on port 5432
```

**Fix:** Changed Docker to use port `5433` instead of `5432` in `docker-compose.yml`:
```yaml
ports:
  - '5433:5432'
```

And updated `server/.env`:
```
PG_URI=postgresql://postgres:password@localhost:5433/referraldb
```

---

### Problem 2 — Express port 5000 conflict

**What happened:** After databases connected successfully, the server crashed with `EADDRINUSE: address already in use :::5000`.

**Root cause:** Another process (PID `4516`) was already occupying port 5000 on Windows.

**How we found it:**
```bash
netstat -ano | grep 5000
# Showed PID 4516 listening on 5000
```

**Fix:** Killed the process via PowerShell Admin (right-click Start → Terminal Admin):
```powershell
Stop-Process -Id 4516 -Force
```

If access is denied, change the port in `server/.env` instead:
```
PORT=8000
```

---

### Key lesson for future

Always run this before starting your server to check for port conflicts:
```bash
netstat -ano | grep 5432
netstat -ano | grep 5000
```

Always start Docker containers **before** running `npm run dev` — Docker must be fully running first or PostgreSQL connections will silently hit the wrong server.

---

### Final working ports

| Service     | Internal port | External port |
|-------------|--------------|---------------|
| PostgreSQL  | 5432         | **5433**      |
| MongoDB     | 27017        | 27017         |
| Redis       | 6379         | 6379          |
| Express API | —            | 5000          |

> PostgreSQL uses external port `5433` to avoid conflicts with any local PostgreSQL installation on Windows.

---

## Other Issues Encountered

### Problem 3 — Stale Docker volumes causing persistent DB errors

**What happened:** Even after creating the database manually, the error kept appearing on restart.

**Root cause:** Old Docker volumes from a previous run were persisting stale data, causing the container to ignore the `POSTGRES_DB` environment variable.

**Fix:** Wipe all volumes and start completely fresh:
```bash
docker-compose down -v --remove-orphans
docker volume prune -f
docker-compose up -d
sleep 20
```

> ⚠️ This deletes all local database data. Only do this in development.

---

### Problem 4 — `SyntaxError: Identifier has already been declared`

**What happened:** Server crashed with a duplicate declaration error in `config/db.js`.

**Root cause:** When pasting new code into `db.js`, the old code was not fully replaced — resulting in `const { Sequelize }` being declared twice in the same file.

**Fix:** In VS Code, press `Ctrl + A` to select ALL content in the file, delete it completely, then paste fresh code. Never append — always fully replace file contents.

---

### Problem 5 — `Cannot find module` crash on startup

**What happened:** Server crashed immediately with `MODULE_NOT_FOUND`.

**Root cause:** A `require()` path in one of the module files was pointing to a file that didn't exist yet — either a wrong relative path or the file simply hadn't been created.

**Fix:** Check the exact path in the error stack trace, then verify the file exists:
```bash
ls server/models/pg/
ls server/modules/auth/
```

Common path mistake — wrong number of `../` in relative paths:
```js
// Wrong — from modules/auth/ going up only one level
const User = require('../models/pg/User')

// Correct — go up two levels to reach server root
const User = require('../../models/pg/User')
```

---

### Problem 6 — `dotenv` not loading (env variables show as `undefined`)

**What happened:** `process.env.PG_URI` was printing `undefined` even though `.env` existed.

**Root cause:** `dotenv.config()` was only called in `app.js` but `config/db.js` was being required before dotenv had a chance to load the variables.

**Fix:** Add `require('dotenv').config()` as the **first line** of both `app.js` AND `config/db.js`:
```js
require('dotenv').config()  // must be line 1
const { Sequelize } = require('sequelize')
```

Verify it is working:
```bash
cd server
node -e "require('dotenv').config(); console.log(process.env.PG_URI)"
# Should print your full connection string, not undefined
```

---

### Problem 7 — Wrong folder structure (`srcpages` instead of `src/pages`)

**What happened:** Running `mkdir` on Windows Command Prompt created flat folders like `srcpages` instead of nested `src/pages`.

**Root cause:** Windows CMD does not support the `mkdir -p` flag or forward slash paths. Commands must be run in **Git Bash**.

**Fix:** Delete wrong folders and recreate in Git Bash:
```bash
rm -rf srcpages srccomponents srcstore srcservices

mkdir -p src/pages/Auth src/pages/Dashboard src/pages/Jobs src/pages/Profile src/pages/Chat
mkdir -p src/components src/store src/services
```

---

### Problem 8 — Git Bash `command not found`

**What happened:** Running commands in Git Bash returned `command not found` for basic tools.

**Root cause:** Git was not installed correctly — wrong shell type selected during installation, or PATH was not updated.

**Fix:** Reinstall Git from [git-scm.com](https://git-scm.com/download/win) as Administrator. On the PATH screen select:
> Git from the command line and also from 3rd-party software

Restart your PC completely before trying again.

---

## Pre-flight Checklist

Run this at the start of every development session:

```bash
# 1. Start Docker
docker-compose up -d

# 2. Verify all 3 containers are running
docker ps

# 3. Check for port conflicts
netstat -ano | grep 5432
netstat -ano | grep 5000

# 4. Start the server
cd server && npm run dev
```

Expected healthy output:
```
Connecting to PG: postgresql://postgres:password@localhost:5433/referraldb
Redis connected!
PostgreSQL connected!
MongoDB connected!
Server running on http://localhost:5000
```
