---
name: Weekly Repo Audit
permissions:
  contents: read
on:
  schedule:
    - cron: '0 0 * * 1'
  workflow_dispatch:
safe-outputs:
  github-token: ${{ secrets.GH_AW_MAIN_REPO_TOKEN }}
  create-issue:
    title-prefix: "[AI Auditor] "
    labels: ["ai-auditor", "good-first-issue"]
    max: 5
    close-older-issues: true
---

# Weekly Repo Audit Instructions

Analyze the repository to identify potential improvements and bugs. 
Specifically for this MERN stack project:
1. Check Express controllers for missing error handling or unvalidated inputs.
2. Verify that MongoDB and PostgreSQL schemas are consistent where they overlap.
3. Look for 'TODO' or 'FIXME' comments that haven't been addressed.

If you find actionable issues, create a GitHub Issue for each one.