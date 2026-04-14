# Security Policy

## Supported Versions

We actively maintain and patch security issues for the following versions of **Job Referral Network System**:

| Version | Supported |
|---------|-----------|
| `main` branch (latest) | ✅ Actively supported |
| Older releases / forks | ❌ Not officially supported |

---

## Reporting a Vulnerability

We take security vulnerabilities seriously. **Please do NOT report security issues through public GitHub Issues.**

### How to report:

1. **Open a private GitHub Security Advisory** via:
   `https://github.com/MOHD-TAHA-KHAN/Job_Referral_Network_System/security/advisories/new`

2. **OR** contact the maintainer directly through their [GitHub profile](https://github.com/MOHD-TAHA-KHAN).

Please include the following in your report:
- A clear description of the vulnerability
- Steps to reproduce the issue
- Potential impact (e.g., data exposure, privilege escalation)
- Any proof-of-concept code or screenshots (if applicable)
- Your suggested fix (optional but appreciated)

---

## Response Timeline

| Step | Timeframe |
|---|---|
| Acknowledgement of your report | Within **48 hours** |
| Initial assessment & severity rating | Within **5 business days** |
| Patch or workaround released | Depends on severity (critical: ASAP, high: within 14 days) |
| Public disclosure (coordinated) | After patch is available |

---

## Scope

The following are **in scope** for security reports:

- Authentication & authorization bypass
- Injection attacks (SQL, NoSQL, XSS, CSRF)
- Exposure of sensitive user or referral data
- Insecure JWT/session handling
- Broken access control
- Sensitive data exposure via API endpoints
- Vulnerable or outdated dependencies with exploitable CVEs

The following are **out of scope**:

- Theoretical vulnerabilities without proof of impact
- Issues in third-party services not under this project's control
- Social engineering attacks

---

## Security Best Practices for Contributors

When contributing code, please follow these guidelines:

- **Never commit secrets** — API keys, passwords, tokens must go in `.env` files (which must be listed in `.gitignore`)
- **Validate all user inputs** on both client and server side
- **Use parameterized queries** — never build raw database queries from user input
- **Follow least-privilege principles** — request only the permissions your feature needs
- **Keep dependencies updated** — run `npm audit` regularly and fix known vulnerabilities

---

## Acknowledgements

We appreciate and thank all security researchers who responsibly disclose vulnerabilities to us. Contributors who report valid security issues will be credited in our release notes (unless they prefer to remain anonymous).
