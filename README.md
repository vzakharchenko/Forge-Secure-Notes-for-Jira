# Forge-Secure-Notes-for-Jira

Share sensitive information securely within Jira issues. Create one-time, expiring encrypted notes with out-of-band key exchange. Built with Atlassian Forge, Custom UI &amp; @forge/sql, @forge/kvs.

## 🧠 About the Project

### Inspiration

"Secure Notes for Jira" was inspired by a common challenge faced by many teams: the need to share sensitive information — such as access credentials, API keys, private feedback, or temporary passwords — directly within a Jira issue, without exposing it in issue fields, comments, or descriptions.

While Jira excels at task tracking and collaboration, it lacks a secure, ephemeral channel for confidential communication. This app bridges that gap by providing a secure mechanism for sharing notes that are:
- Confidential
- Time-limited
- Verifiably read by the intended recipient
- Automatically deleted after viewing

### 🔒 Security Features

* 🔐 Create encrypted notes on Jira issues
* 🕒 Choose an expiration: 1 hour, 1 day, 7 days, 10 days
* 🔑 Generate a one-time decryption key (not stored)
* 📥 View received notes (with key)
* 📤 View and delete sent notes
* 🧨 Note self-destructs after reading or upon expiry
* ⏳ Expiration is enforced automatically using a Forge `scheduledTrigger`
* 👤 Only the designated Atlassian account can decrypt the Secure Note

### 🖥 UI Features

* 📎 Open decryption links directly from the Issue Panel or via email
* 🧭 Support for routing and deep-linking to global pages
* ⏱️ 5-minute countdown timer during note viewing
* 🌓 Full dark/light mode support based on Jira theme

## 🛠 Technical Implementation

### Architecture

* **Frontend:** React + Vite (Forge Custom UI)
* **Backend:** Forge Functions using `@forge/api`, `@forge/sql`, `@forge/kvs`
* **ORM:** [forge-sql-orm](https://github.com/vassio/forge-sql-orm)
* **Storage:** 
  - Encrypted content in `@forge/kvs` (via `setSecret`)
  - Metadata in `@forge/sql`

### Security Design

* Client-side encryption using Web Crypto API
* AES-GCM with 32-byte key derived via PBKDF2
* Random IV generation for each message
* Encrypted content stored in `@forge/kvs.setSecret`
* Metadata stored in `@forge/sql`
* Out-of-band key exchange required
* Automatic content deletion after viewing

## 🚀 Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm (v7 or higher)
- Atlassian Forge CLI (`forge` command-line tool)
- A Jira Cloud instance with admin access
- Forge development environment set up

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/Forge-Secure-Notes-for-Jira.git
cd Forge-Secure-Notes-for-Jira
```

2. Install dependencies:
```bash
npm install
```

3. Register your Forge app:
```bash
forge register
```

4. Build UI:
```bash
cd static
npm install
npm run build
cd ..
```

5. Deploy to production:
```bash
forge deploy -e production
```

6. Install in your Jira instance:
```bash
forge install -e production
```

### Development


1. Deploy the app:
```bash
forge deploy
```

2. Install in your Jira instance:
```bash
forge install
```

3. Start the development server:
```bash
forge tunnel
```

## 📝 Usage Guide

### Creating a Secure Note

1. Open any Jira issue
2. Click on the "Secure Notes" panel
3. Click "Create New Secure Note"
4. Fill in the required fields:
   - Select recipient
   - Enter message content
   - Choose expiration time
5. Click "Create & Encrypt Note"
6. Share the generated link and encryption key through a secure channel

### Viewing a Secure Note

1. Open the secure note link
2. Enter the decryption key
3. View the message content
4. Use "Copy and Close" to save the content and destroy the note
5. The note will be automatically destroyed after viewing or when expired

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 💬 Support

For support, please open an issue in the GitHub repository .
