# Contributing to Forge Secure Notes

Thank you for your interest in contributing to **Forge Secure Notes for Jira**! 🚀

This project was built with a strong focus on **security**, **architecture**, and **maintainability**. Whether you're fixing a bug, improving documentation, or proposing a new feature, your help is appreciated.

## 📜 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). We expect all contributors to maintain a respectful and inclusive environment.

## 🛠️ Technology Stack & Architecture

Before contributing, please familiarize yourself with our architectural patterns. We prioritize engineering rigor over quick hacks.

* **Platform:** Atlassian Forge (Custom UI)
* **Language:** TypeScript (Strict mode)
* **Dependency Injection:** [InversifyJS](https://github.com/inversify/InversifyJS)
* **Validation:** `class-validator` (Runtime validation for DTOs)
* **Quality Tools:** ESLint, Prettier, Knip, Snyk

### Key Architectural Principles

1.  **Strict Separation of Concerns:**
    * `resolvers/` handles Forge events.
    * `services/` contains business logic.
    * `storage/` handles database interactions.
    * **Rule:** Resolvers should never contain business logic; they should delegate to Services via DI.

2.  **Shared Contracts (DTOs):**
    * We use a shared module (`shared/`) for contracts between Frontend and Backend.
    * **Rule:** Always define request/response structures in `shared/dto/` and decorate them with `class-validator` annotations.

3.  **Dependency Injection:**
    * We use Inversify to manage dependencies.
    * **Rule:** Do not instantiate services manually using `new`. Inject them using the tokens defined in `ForgeInjectionTokens.ts`.

4.  **Security First:**
    * **Rule:** Never commit secrets.
    * **Rule:** The encryption key is **User-Side Only**. Never add logic that sends the raw encryption key to the backend/logs.

## 💻 Development Workflow

1.  **Fork and Clone** the repository.
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Create a Branch:**
    ```bash
    git checkout -b feature/my-new-feature
    # or
    git checkout -b fix/issue-description
    ```

### Code Quality Checks

We enforce strict quality gates. Before pushing, run the following:

* **Linting:**
    ```bash
    npm run lint
    ```
* **Formatting:**
    ```bash
    npm run format
    ```
* **Dependency Check (Knip):**
    ```bash
    npm run knip
    ```
    *Ensure you haven't introduced unused exports or dependencies.*

## 📥 Submitting a Pull Request

1.  **Update Documentation:** If you changed an API or added a feature, update the `README.md`.
2.  **Verify Tests:** Ensure the project builds and lints without errors.
3.  **Commit Messages:** We prefer clear, descriptive commit messages.
    * *Good:* `feat: implement async queue for SQL diagnostics`
    * *Bad:* `wip`, `fix bug`
4.  **Open a PR:**
    * Target the `main` branch.
    * Describe your changes in detail.
    * Link to any relevant Issues.

## 🐛 Reporting Bugs

If you find a bug, please create an Issue using the provided template. Include:
* Steps to reproduce.
* Expected vs. actual behavior.
* Screenshots (if applicable).
* Any relevant logs (sanitize them first!).

## 🔐 Security Vulnerabilities

If you discover a security vulnerability, please **DO NOT** open a public issue.
Instead, please contact the maintainer directly or refer to the Security Policy (if available).

---

Thank you for helping us build a more secure Jira ecosystem! 🛡️
