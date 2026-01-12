# Description

Please include a summary of the changes and the related issue.
Explain **why** this change is necessary and how it fits into the overall architecture.

Fixes # (issue)

## Type of change

- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] ♻️ Refactoring (no functional changes, no api changes)
- [ ] 🛡️ Security improvement

## 🛡️ Security & Privacy Checklist

**Critical:** This project enforces a Zero-Trust model. Please verify:

- [ ] I have **NOT** added any logic that sends the raw encryption key to the backend.
- [ ] I have **NOT** logged any sensitive data (payloads, keys) to the console or server logs.
- [ ] If I modified the frontend, I checked for potential XSS vectors (e.g., avoiding `dangerouslySetInnerHTML`).
- [ ] I have verified that ACLs/Permissions allow access only to the intended owners.

## 🏗️ Architecture & Quality

- [ ] **Separation of Concerns:** Business logic is in `services/`, not in resolvers.
- [ ] **Dependency Injection:** Services are injected via `Inversify`, not instantiated with `new`.
- [ ] **Contracts:** New DTOs have `class-validator` decorators for runtime validation.
- [ ] **Clean Code:** No "magic numbers" or hardcoded strings (used constants/enums).

## ✅ Definition of Done

**Important:** I have run the strict pre-commit checks locally.

- [ ] I have run `npm run format` (Prettier)
- [ ] I have run `npm run lint` (ESLint)
- [ ] I have run `npm run knip` (Check for unused files/dependencies)
- [ ] I have run `npm run build` (Strict type checking)
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] I have updated the documentation (README/API docs) if applicable

## 📸 Screenshots (if UI is changed)
