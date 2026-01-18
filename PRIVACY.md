# Privacy Policy

_Last updated: January 2026_

## Overview

Secure Notes for Jira (“the App”) is designed with **privacy-by-design** and **zero-trust principles**.  
Our primary goal is to ensure that sensitive information shared via the App is never exposed in plaintext — not to Atlassian, not to the App backend, and not to the App author.

This Privacy Policy explains what data the App processes, how it is handled, and what **it explicitly does NOT collect**.

---

## Data We Process

### 1. Encrypted Note Content
- Secret content is **encrypted client-side** in the user’s browser.
- The encryption key is **never transmitted** to the backend.
- The backend stores only encrypted blobs.
- Plaintext content is **never accessible** to the App, Atlassian infrastructure, or administrators.

### 2. Metadata (Non-Secret)
To support auditability and compliance, the App stores **limited metadata**, including:
- Note identifier
- Jira issue and project identifiers
- Sender account ID
- Recipient account IDs
- Creation timestamp
- Expiration timestamp
- Read status (viewed / expired / deleted)
- Optional user-provided description (non-secret)

This metadata **does not contain secrets** and cannot be used to reconstruct encrypted content.

---

## Data We Do NOT Collect

The App explicitly does **not**:
- Collect plaintext secrets
- Store encryption keys
- Track user behavior for analytics
- Use cookies or tracking pixels
- Send data to third-party analytics or monitoring services
- Export data outside Atlassian infrastructure

There is **no external data egress**.

---

## Data Storage & Processing

- All backend processing runs on **Atlassian Forge infrastructure**
- Encrypted data is stored using:
  - `@forge/kvs.setSecret` for encrypted payloads
  - Forge SQL for metadata and audit logs
- The App is fully **Runs on Atlassian compliant**

---

## Access Control

- Only intended recipients can decrypt and view a note.
- Administrators can access **audit metadata only**, never secret content.
- Row-Level Security (RLS) is enforced for all audit queries.
- Rovo AI integration respects the same permission boundaries.

---

## Data Retention

- Encrypted notes are automatically deleted after:
  - Being viewed (one-time access), or
  - Reaching their expiration time
- Metadata is retained for audit purposes only and can be exported by administrators if required.

---

## Third-Party Services

The App does **not** integrate with third-party services for:
- Analytics
- Logging
- Monitoring
- Telemetry

All functionality is implemented using native Forge capabilities.

---

## Open Source & Transparency

The App is **source-available** under the Business Source License 1.1.

You can audit the full implementation here:
https://github.com/vzakharchenko/Forge-Secure-Notes-for-Jira

Security researchers are encouraged to review the code and report issues responsibly.

---

## Responsible Disclosure

If you discover a security or privacy issue, please follow our Responsible Disclosure Policy:
https://github.com/vzakharchenko/Forge-Secure-Notes-for-Jira/blob/master/SECURITY.md

Valid reports will be acknowledged and credited in release notes.

---

## Changes to This Policy

This Privacy Policy may be updated as the App evolves.  
Material changes will be documented in the repository history.

---

## Contact

For privacy-related questions, contact:

**Vasyl Zakharchenko**  
Project Maintainer  
GitHub: https://github.com/vzakharchenko
