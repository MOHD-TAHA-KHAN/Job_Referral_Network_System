# Architecture

Overview
This repository is split into major components:
- client/: React + TypeScript single-page app (UI, routing, forms)
- server/: Node.js + Express REST API (business logic, auth)
- database/: PostgreSQL schema, migrations, seeders
- realtime/: Socket.io (notifications, presence)
- auth: JWT-based tokens with refresh flow
- jobs/cron: scheduled matching and notification tasks

High-level data flow
1. Client → Server: API requests for reads/writes
2. Server → DB: transactional writes (referral, user, matches)
3. Matching engine: scores candidates periodically or on-demand
4. Notifications: events delivered via Socket.io to clients

Operational diagram
(Consider adding a Mermaid or image here)

Notes
- Keep heavy computation in worker processes (avoid blocking web requests).
- Document schema changes in database/ and update migrations.
