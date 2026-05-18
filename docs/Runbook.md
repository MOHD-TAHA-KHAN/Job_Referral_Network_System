# Runbook

Quick operational tasks
- Restart services:
  - docker-compose restart
  - Or restart specific services (pm2 or systemd if used)
- Tail logs:
  - docker-compose logs -f
  - server stdout: check container or cloud logs

Common incidents
- DB connection errors:
  1. Check DB container status: docker ps
  2. Check env vars (DATABASE_URL)
  3. Restart DB container; run migrations

- High CPU or long-running matching jobs:
  - Inspect worker logs
  - Pause scheduled job or scale workers

Secrets rotation
- Update GitHub Secrets via repo Settings → Secrets
- Restart services after rotating critical secrets

Escalation
- Primary: @maintainer1
- Secondary: @maintainer2

Runbook maintenance
- Keep this page updated with exact commands and contact details.
- Add step-by-step rollback and recovery instructions for each critical service.
