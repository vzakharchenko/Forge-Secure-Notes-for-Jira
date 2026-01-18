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
- Only explicitly authorized recipients can access a secure note.

---

## 2. Zero-Trust Security Model

The App implements a **strict zero-trust architecture**:

- Encrypted content **cannot be recovered** if access is lost.
- Administrators **cannot decrypt** or read secret content.
- There is **no password recovery**, key escrow, or content restoration mechanism.
- Once a note expires or is destroyed, it is **cryptographically unrecoverable**.

By using the App, you explicitly acknowledge and accept these limitations.

---

## 3. Audit & Observability

While the App does not expose secret content, it provides **audit and observability mechanisms** to support security monitoring and compliance investigations.

These mechanisms may include:
- Audit logs recording **who**, **when**, and **in which Jira context** secure notes were created, accessed, expired, or destroyed.
- Administrative views with organization-wide visibility, protected by role-based access control.
- Optional integration with a Rovo agent that can assist administrators in identifying **unusual or suspicious usage patterns** (for example, abnormal access timing or sharing behavior).

Audit data **never includes decrypted secret content**.

These features are intended to support investigation and compliance workflows and **do not guarantee detection or prevention of all security incidents**.

---

## 4. License & Usage Rights

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

Production use **requires a valid commercial license obtained via the Atlassian Marketplace**.

On the License Change Date, the App will automatically become available under the MIT License.

---

## 5. No Warranties

The App is provided **"as is"**, without warranties of any kind, express or implied, including but not limited to:
- Merchantability
- Fitness for a particular purpose
- Security guarantees
- Availability or uninterrupted operation

Use of the App is at your own risk.

---

## 6. Limitation of Liability

To the maximum extent permitted by law, the Licensor shall not be liable for:
- Loss of data or encrypted content
- Business interruption
- Security incidents or misuse
- Indirect, incidental, or consequential damages

---

## 7. Responsible Disclosure

If you believe you have discovered a security vulnerability, please follow the Responsible Disclosure Policy:

https://github.com/vzakharchenko/Forge-Secure-Notes-for-Jira/blob/master/SECURITY.md

Valid security reports may be acknowledged and credited in release notes at the Licensor’s discretion.

---

## 8. Changes to These Terms

These Terms may be updated from time to time. Continued use of the App after changes constitutes acceptance of the updated Terms.

---

## 9. Contact

For licensing, security, or legal inquiries, contact:

**Vasyl Zakharchenko**  
GitHub: https://github.com/vzakharchenko
