# Privacy Policy

_Last updated: January 2026_

This Privacy Policy explains how **Secure Notes for Jira** (the “App”) handles data when used within Atlassian products such as Jira and Confluence.

We are committed to the principle of **Data Minimization** and a **Zero-Trust** security model.

---

## 1. Overview

Secure Notes for Jira is designed so that the App developer **does not have access** to your sensitive data.

- The App runs entirely on **Atlassian Forge** infrastructure.
- Sensitive content is encrypted client-side.
- The backend never receives plaintext data.

This Privacy Policy applies to all users of the App installed via the Atlassian Marketplace.

---

## 2. Data We Process

### 2.1 Encrypted Content (Zero Access)

The App processes Secure Notes exclusively in the user's browser.

- Content is encrypted **before** leaving the device.
- The App stores only the **encrypted blob**.
- Encryption keys are **never stored** on the backend, logged, transmitted to servers, or recoverable by the App.
- **Key Access**: Only the sender and recipient know the encryption key. The key is never stored on Atlassian servers or transmitted through Atlassian infrastructure.
- **Sender Key Management**: The sender copies the key or sends it via email at creation time. Copying is detected by clicking the key field or the copy button. **sessionStorage** is used only when the sender forgot to copy the key — so they can retrieve it later from the same browser. This fallback is limited to the browser session and is not available if storage is cleared or if accessed from a different browser or machine.
- **Key Sharing Restrictions**: The decryption key **must NOT** be shared through Jira (comments, descriptions, issue fields) or any Atlassian Cloud channels, as this would violate Zero Trust architecture by giving Atlassian all the data needed to decrypt the secret. Keys should be shared through separate, independent channels such as Slack, Teams, direct email (not through Jira), phone calls, or other secure communication methods outside of Atlassian infrastructure.

The Developer **cannot** decrypt, read, or restore encrypted content under any circumstances.

**Double Protection: Key + Authorization**

- **Authorization is mandatory**: Forge guarantees that only the authenticated user's account can access their notes. The backend verifies that the authenticated user's `accountId` matches the recipient's `accountId` before allowing decryption.
- **Only the authorized recipient can decrypt**: The encryption key is issued only to the recipient, and only the authenticated recipient can read secure notes. Neither the sender nor administrators can decrypt the note content — only the recipient can.
- **Key is useless without the correct account**: The encryption key hash is calculated using the recipient's `accountId` as part of the cryptographic salt. This means:
  - Even if an encryption key is compromised, it cannot be used under a different account because the hash calculation depends on the specific `accountId`.
  - The key is cryptographically bound to the recipient's account identity.
- **Key is useless without encrypted data**: Both the encryption key (shared out-of-band) and the encrypted content (stored securely) are required for decryption.
- **Purpose of the key**: The encryption key exists to ensure that **Atlassian Cloud does not have sufficient information** to decrypt secure notes. Even if Atlassian infrastructure is compromised, they cannot decrypt notes without the key, which is never transmitted to or stored on their servers.

### 2.2 Technical Metadata

To provide functionality and auditability, the App processes limited **technical metadata**, which is stored within your Atlassian instance:

- Atlassian Account IDs (to identify senders/recipients and enforce authorization)
- Context Identifiers (Issue ID, Project ID, Site ID)
- Timestamps (Creation, Access, Expiration)
- Note Status (Active, Burned, Expired)

This metadata **never includes** passwords, secrets, tokens, or decrypted payload data.

**Note**: Account IDs are used not only for identification but also as part of the cryptographic security model. The recipient's `accountId` is used as a salt component when validating encryption keys, ensuring that even if a key is compromised, it cannot be used by unauthorized accounts.

---

## 3. Data Storage & Residency (Runs on Atlassian)

The App relies strictly on **Atlassian-hosted infrastructure** (Atlassian Forge).

- **No External Servers:** No data is transmitted to or stored on servers owned or operated by the Developer.
- **Data Residency:** The App honors the Data Residency location of your Atlassian Cloud product. If your Jira instance is hosted in the EU, the App data remains in the EU.
- **Storage:** All encrypted data and metadata are stored using Atlassian Forge Storage APIs, ensuring enterprise-grade security and compliance.

---

## 4. Subprocessors

We use **no third-party subprocessors** to process your data.
The only infrastructure provider is **Atlassian Pty Ltd** (and its cloud providers, e.g., AWS), as part of the Forge platform.

---

## 5. Audit Logs & AI Analysis

### 5.1 Audit Logs

The App maintains immutable audit logs for security monitoring. These logs allow administrators to investigate usage patterns (e.g., "Who created a note?"). These logs contain **metadata only**.

### 5.2 Application Logging

The App generates technical logs for debugging and monitoring purposes. These logs are stored on **Atlassian Forge infrastructure** and are accessible to the application developer for troubleshooting.

**What is logged:**

- Function execution status
- API call results (status codes only, not full responses)
- Error messages (sanitized, without sensitive data)
- Performance metrics

**What is NOT logged:**

- Encryption keys or decrypted note content (never transmitted to backend)
- Account IDs (removed from all log messages)
- Note IDs (removed from all log messages)
- Any other sensitive user data

**Your Control:**

- You can **disable logging** if you prefer that the developer does not have access to application logs
- Logs are automatically sanitized to remove sensitive identifiers
- If you encounter issues and need support, you may be asked to share logs (which you can review and sanitize further before sharing)

**How to share logs for support:**

- **Via JSM Request:** Create a support request in our Jira Service Management portal and attach the logs
- **Via GitHub Issue:** Open an issue in the [GitHub repository](https://github.com/vzakharchenko/Forge-Secure-Notes-for-Jira/issues) and attach the logs

### 5.3 AI Features (Atlassian Rovo)

Where enabled by the customer, the App may use **Atlassian Rovo** to analyze audit metadata.

- AI operates **strictly on metadata** (e.g., detecting anomaly access times).
- AI **never accesses** encrypted payloads or keys.
- AI access respects **Row-Level Security (RLS)**, ensuring users only see relevant data.

---

## 6. Data Retention & Deletion

- **Automatic Destruction:** Encrypted content is permanently deleted from storage immediately upon "burn" (viewing) or expiration.
- **Irrecoverable:** Once deleted, data cannot be restored by anyone, including Atlassian support or the Developer.
- **Metadata Retention:** Metadata logs are retained according to the customer's Jira retention policies.

---

## 7. Your Rights (GDPR & CCPA)

Since the App runs entirely within your Atlassian instance and the Developer has no access to your data:

- **Access & Deletion Requests:** Must be directed to your organization's **Jira Administrator**.
- **The Developer's Role:** The Developer acts purely as a software provider and **cannot** execute data deletion or export requests on behalf of individual users, as we have no technical access to your environment.

---

## 8. Cookies & Tracking

The App **does not use** any third-party tracking cookies, analytics pixels, or advertising trackers.
The App relies solely on standard Atlassian session cookies required for authentication and security.

---

## 9. Changes to This Policy

This Privacy Policy may be updated to reflect product changes or legal requirements. Material changes will be documented in the project repository.

---

## 10. Contact

For privacy inquiries, security reports, or compliance questions, please contact the developer via the project repository:

- **Developer:** Vasyl Zakharchenko
- **GitHub:** https://github.com/vzakharchenko
- **Security Policy:** https://github.com/vzakharchenko/Forge-Secure-Notes-for-Jira/blob/master/SECURITY.md
