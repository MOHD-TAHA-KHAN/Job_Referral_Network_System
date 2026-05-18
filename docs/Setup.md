# Setup

Prerequisites
- Node.js 18+ and npm (or yarn)
- Docker & docker-compose (for Postgres & optional services)
- Git and GitHub access for push/PR
- Create a GitHub repo secret store for credentials

Local development (quick)
1. git clone https://github.com/MOHD-TAHA-KHAN/Job_Referral_Network_System.git
2. cp .env.example .env and fill values
3. cd server && npm install
4. cd ../client && npm install
5. docker-compose up --build (starts Postgres and other services)
6. In server: npm run dev
7. In client: npm start

Database
- Migrations: see database/ (describe migration tool and commands)
- To reset locally: docker-compose down -v && docker-compose up --build

Testing
- Backend: cd server && npm test
- Frontend: cd client && npm test

CI / Deployment
- See .github/workflows for automated checks
- Use pinned action SHAs (repo enforces pinning)

Security
- Do not commit secrets. Use GitHub Secrets and env vars.
