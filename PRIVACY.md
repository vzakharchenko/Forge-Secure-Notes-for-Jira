# Privacy Policy

_Last updated: January 2026_

This Privacy Policy explains how **Secure Notes for Jira** (the “App”) handles data when used within Atlassian products such as Jira and Confluence.

---

## 1. Overview

Secure Notes for Jira is designed with a **zero-trust security model**.  
The App ensures that sensitive content is encrypted client-side and **never accessible to the backend**, administrators, or third parties.

This Privacy Policy applies to all users of the App.

---

## 2. Data We Process

### 2.1 Encrypted Content

- Encrypted note content is created and encrypted **entirely in the user’s browser**
- The App backend **never receives plaintext**
- Encryption keys are **never stored**, logged, or recoverable

The App **cannot** decrypt, read, or restore encrypted content under any circumstances.

---

### 2.2 Metadata (Non-Sensitive)

To provide functionality, security, and auditability, the App processes limited **technical metadata**, including:

- Atlassian account IDs
- Jira issue, project, and site identifiers
- Timestamps (creation, access, expiration, deletion)
- Note status (created, viewed, expired, deleted)
- Sender and intended recipient identifiers

This metadata **never includes**:
- encrypted content
- encryption keys
- passwords, secrets, or tokens
- decrypted data of any kind

---

## 3. Audit Logs

The App maintains **audit logs** for transparency, compliance, and security monitoring.

Audit logs may be used to:
- display user activity history
- provide administrators with visibility into secure note usage
- investigate abnormal or suspicious usage patterns

Audit logs contain **metadata only** and never include encrypted content or cryptographic material.

---

## 4. AI & Automated Analysis (Rovo)

Where enabled, the App may use **Atlassian Rovo** for AI-assisted analysis of audit data.

- AI operates **exclusively on audit metadata**
- Encrypted content and encryption keys are **never accessible**
- All access is enforced using **Row-Level Security (RLS)**

Users can only access their own data.  
Administrators can access site-wide metadata, without exposure to secrets.

---

## 5. Data Storage & Infrastructure

- The App runs entirely on **Atlassian Forge**
- All data is processed within **Atlassian-controlled infrastructure**
- The App complies with **Runs on Atlassian** requirements
- No external servers or third-party analytics services are used

---

## 6. Data Retention

- Encrypted content is permanently destroyed immediately after:
  - being viewed (one-time access), or
  - reaching its expiration time
- Expired data cannot be recovered
- Metadata may be retained for audit and compliance purposes

---

## 7. No Recovery Guarantee

Due to the App’s zero-trust design:

- Encrypted content **cannot be recovered**
- Administrators **cannot decrypt secrets**
- There is **no password recovery**
- Lost access means permanent loss of content

By using the App, you acknowledge and accept these technical limitations.

---

## 8. Open Source & Self-Hosted Usage

The App source code is publicly available.

If you deploy, modify, or operate a derived version of the App outside the Atlassian Marketplace:
- You are solely responsible for your own data handling
- You are responsible for security, compliance, and legal obligations

---

## 9. Changes to This Policy

This Privacy Policy may be updated to reflect product or regulatory changes.  
Material changes will be documented in the project repository.

---

## 10. Contact

For privacy or security-related questions, please refer to the project repository:

- GitHub: https://github.com/vzakharchenko/Forge-Secure-Notes-for-Jira
- Security Policy: https://github.com/vzakharchenko/Forge-Secure-Notes-for-Jira/blob/master/SECURITY.md

---

By using Secure Notes for Jira, you agree to this Privacy Policy.
