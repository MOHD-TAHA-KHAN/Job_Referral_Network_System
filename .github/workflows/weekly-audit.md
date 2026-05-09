---
name: Weekly Repo Audit
on:
  schedule:
    - cron: '0 0 * * 1' # Runs every Monday
  workflow_dispatch:
---

Analyze the Job_Referral_Network_System repository.
1. Scan the MERN stack code for security flaws (SQL injection in PostgreSQL or NoSQL injection in MongoDB).
2. Check the hybrid database logic for potential data sync issues.
3. Generate GitHub Issues for any bugs found and label them 'ai-auditor' and 'good-first-issue'.