# Terms of Use

_Last updated: January 2026_

These Terms of Use ("Terms") govern your access to and use of **Secure Notes for Jira** (the "App"), developed and licensed by **Vasyl Zakharchenko** (the "Licensor").

By installing or using the App, you agree to be bound by these Terms. If you do not agree, do not install or use the App.

---

## 1. Scope of the App

Secure Notes for Jira provides a mechanism to share sensitive information inside Atlassian products (such as Jira and Jira Service Management) using a **zero-trust, client-side encryption model**.

The App is designed to ensure that:

- Encrypted content is never available to the backend in plaintext.
- Encryption keys are generated and used exclusively in the user’s browser.
- Only explicitly authorized recipients can access a secure note (enforced through mandatory authorization checks and cryptographic binding of keys to account identities).

---

## 2. Zero-Trust Security Model

The App implements a **strict zero-trust architecture** with **Double Protection: Key + Authorization**:

- Encrypted content **cannot be recovered** if access is lost.
- Administrators **cannot decrypt** or read secret content.
- There is **no password recovery**, key escrow, or content restoration mechanism.
- Once a note expires or is destroyed, it is **cryptographically unrecoverable**.

**Double Protection Mechanism:**

- **Authorization is mandatory**: Forge guarantees that only the authenticated user's account can access their notes. The backend verifies that the authenticated user's `accountId` matches the recipient's `accountId` before allowing decryption.
- **Key is useless without the correct account**: The encryption key hash is calculated using the recipient's `accountId` as part of the cryptographic salt. This means:
  - Even if an encryption key is compromised, it cannot be used under a different account because the hash calculation depends on the specific `accountId`.
  - The key is cryptographically bound to the recipient's account identity.
- **Key is useless without encrypted data**: Both the encryption key (shared out-of-band) and the encrypted content (stored securely) are required for decryption.

By using the App, you explicitly acknowledge and accept these limitations.

---

## 3. Privacy & Data Handling (Zero Egress)

The App operates under a strict **"Zero Egress" policy** regarding sensitive data:

- **Data Residency:** The App operates entirely within your Atlassian Cloud instance and the user's browser.
- **No Data Transmission:** No decrypted data, encryption keys, or personal information is ever transmitted to, processed by, or stored on the Licensor's servers.
- **Compliance:** Since the Licensor does not process or store your text data, the App simplifies compliance with GDPR, HIPAA, and other data protection regulations.

---

## 4. Audit & Observability

While the App does not expose secret content, it provides **audit and observability mechanisms** to support security monitoring and compliance investigations.

These mechanisms may include:

- Audit logs recording **who**, **when**, and **in which Jira context** secure notes were created, accessed, expired, or destroyed.
- Administrative views with organization-wide visibility, protected by role-based access control.
- Optional integration with a Rovo agent that can assist administrators in identifying **unusual or suspicious usage patterns** (for example, abnormal access timing or sharing behavior).

Audit data **never includes decrypted secret content**.

These features are intended to support investigation and compliance workflows and **do not guarantee detection or prevention of all security incidents**.

---

## 5. License & Usage Rights

The App is licensed under the **Business Source License 1.1 (BSL 1.1)** with the following parameters:

- **Licensed Work:** Secure Notes for Jira
- **Licensor:** Vasyl Zakharchenko
- **License Change Date:** 2030-01-01
- **Change License:** MIT License

### Permitted Use

You may:

- View, copy, and modify the source code.
- Use the App for development, testing, security auditing, and educational purposes.
- Review and audit the code for security and compliance evaluation.

### Production Use

"Production use" is defined as running the App in a live Atlassian environment (Jira / Confluence) for internal business operations or providing the App to third parties.

### Permitted Use

You may:

- View, copy, and modify the source code.
- Use the App for development, testing, security auditing, and educational purposes.
- Review and audit the code for security and compliance evaluation.

### Production Use

"Production use" is defined as running the App in a live Atlassian environment (Jira / Confluence) for internal business operations or providing the App to third parties.

Production use **requires a valid commercial license obtained via the Atlassian Marketplace**.

On the License Change Date, the App will automatically become available under the MIT License.

---

## 6. No Warranties

The App is provided **"as is"**, without warranties of any kind, express or implied, including but not limited to:

- Merchantability
- Fitness for a particular purpose
- Security guarantees
- Availability or uninterrupted operation

Use of the App is at your own risk.

**Technical support** is provided on a "best-effort" basis or according to the **Service Level Agreement (SLA)** applicable to your license tier, available at:
[https://github.com/vzakharchenko/Forge-Secure-Notes-for-Jira/blob/master/SLA.md](https://github.com/vzakharchenko/Forge-Secure-Notes-for-Jira/blob/master/SLA.md)

---

## 7. Limitation of Liability

To the maximum extent permitted by law, the Licensor shall not be liable for:

- Loss of data or encrypted content
- Business interruption
- Security incidents or misuse
- Indirect, incidental, or consequential damages

---

## 8. Responsible Disclosure

If you believe you have discovered a security vulnerability, please follow the Responsible Disclosure Policy:

https://github.com/vzakharchenko/Forge-Secure-Notes-for-Jira/blob/master/SECURITY.md

Valid security reports may be acknowledged and credited in release notes at the Licensor’s discretion.

---

## 9. Changes to These Terms

These Terms may be updated from time to time. Continued use of the App after changes constitutes acceptance of the updated Terms.

---

## 10. Contact

For licensing, security, or legal inquiries, contact:

**Vasyl Zakharchenko**  
GitHub: https://github.com/vzakharchenko
