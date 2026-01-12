# Security Policy

We take the security of **Forge Secure Notes** very seriously. Given the nature of this application (handling sensitive data, encryption keys, and zero-trust architecture), we welcome security research and responsible disclosure.

## Supported Versions

We actively support security updates for the latest stable release.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0.0 | :x:                |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

If you believe you have found a security vulnerability in Forge Secure Notes, please report it to us as follows:

1.  **Email:** Send the details to `vaszakharchenko@gmail.com`.
2.  **Subject:** Please use the subject line: `[SECURITY] Vulnerability Report - Forge Secure Notes`.
3.  **Content:** Please include:
    * A description of the vulnerability.
    * Steps to reproduce the issue (Proof of Concept).
    * The potential impact (e.g., ability to decrypt notes without key, XSS, broken access control).

## Security Model & Scope

Our architecture relies on **Client-Side Encryption**. The server never receives the decryption key. When testing, please keep this model in mind.

### ✅ In Scope (Vulnerabilities we want to know about)

* **Broken Client-Side Encryption:** Any mechanism that allows the backend (or a third party) to read note content without the user-supplied key.
* **XSS (Cross-Site Scripting):** Since decryption happens in the browser, XSS is a critical vulnerability that could allow an attacker to steal the key or the decrypted content from the DOM.
* **Metadata Leakage:** Unauthorized access to metadata (e.g., seeing *who* sent notes to *whom* without proper permissions).
* **Improper Expiry:** If a note remains accessible (even encrypted) after it was supposed to expire or self-destruct.
* **Broken Access Control:** If a user can delete or view metadata of notes they do not own.

### ❌ Out of Scope (Threats we do not cover)

* **Physical Access / Evil Maid:** Attacks requiring physical access to the user's unlocked device (e.g., reading a key from the screen or clipboard history).
* **Social Engineering:** Phishing attacks to trick users into revealing their keys.
* **Platform Vulnerabilities:** Issues within the underlying Atlassian Forge platform or Jira Cloud (please report these to Atlassian directly).
* **User Negligence:** The sender losing the key or forgetting to copy it (we do not store keys for recovery).

## Response Time

We are committed to addressing security issues promptly. You can expect:
* An acknowledgement of your report within 48 hours.
* A timeline for the fix once the vulnerability is verified.
* Credit in our release notes (if you wish) once the vulnerability is patched.
