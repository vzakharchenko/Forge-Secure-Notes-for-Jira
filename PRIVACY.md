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
- Encryption keys are **never stored**, logged, transmitted, or recoverable by the App.

The Developer **cannot** decrypt, read, or restore encrypted content under any circumstances.

**Double Protection: Key + Authorization**

- **Authorization is mandatory**: Forge guarantees that only the authenticated user's account can access their notes. The backend verifies that the authenticated user's `accountId` matches the recipient's `accountId` before allowing decryption.
- **Key is useless without the correct account**: The encryption key hash is calculated using the recipient's `accountId` as part of the cryptographic salt. This means:
  - Even if an encryption key is compromised, it cannot be used under a different account because the hash calculation depends on the specific `accountId`.
  - The key is cryptographically bound to the recipient's account identity.
- **Key is useless without encrypted data**: Both the encryption key (shared out-of-band) and the encrypted content (stored securely) are required for decryption.

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

### 5.2 AI Features (Atlassian Rovo)

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
