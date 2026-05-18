# Contributing

Welcome! Suggested workflow
1. Fork the repo; create a branch: feat/short-description or fix/short-description
2. Implement changes, add tests, run linters locally
3. Open a PR describing the change and link any related issues

PR checklist
- Title: type(scope): short summary (e.g., feat(client): add profile redirect)
- Include tests for critical logic
- Update README or docs if behavior or setup changed
- Add reviewers and assign related issues

Coding conventions
- TypeScript: use strict types where practical
- Logging: avoid console.log in production; use structured logger (winston/pino)
- Tests: unit for core logic + integration for critical flows

Issue triage
- Use labels: bug, enhancement, help wanted, good first issue
- Break large tasks into smaller issues/PRs

Code of Conduct
Add your organization code of conduct or link to one.
