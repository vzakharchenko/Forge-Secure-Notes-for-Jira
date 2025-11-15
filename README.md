# Forge-Secure-Notes-for-Jira

[![Node.js CI](https://github.com/vzakharchenko/Forge-Secure-Notes-for-Jira/actions/workflows/node.js.yml/badge.svg)](https://github.com/vzakharchenko/Forge-Secure-Notes-for-Jira/actions/workflows/node.js.yml)
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

- 🔐 Create encrypted notes on Jira issues
- 🕒 Choose an expiration: 1 hour, 1 day, 7 days, 10 days
- 🔑 Generate a one-time decryption key (not stored)
- 📥 View received notes (with key)
- 📤 View and delete sent notes
- 🧨 Note self-destructs after reading or upon expiry
- ⏳ Expiration is enforced automatically using a Forge `scheduledTrigger`
- 👤 Only the designated Atlassian account can decrypt the Secure Note
- 📧 **Email Notifications**: Automatic email notifications are sent:
  - When a secure note is created and shared with you
  - When a secure note expires and is automatically deleted
  - When a secure note is manually deleted by the creator

### 🖥 UI Features

- 📎 Open decryption links directly from the Issue Panel or via email
- 🧭 Support for routing and deep-linking to global pages
- ⏱️ 5-minute countdown timer during note viewing
- 🌓 Full dark/light mode support based on Jira theme
- 👥 Multiple recipients support - send secure notes to multiple users at once
- 📝 Description field for better note organization and tracking
- 📊 Comprehensive audit pages with detailed history tracking:
  - **My History**: View your personal secure notes history with pagination
  - **My Issue History**: Browse notes by issue with detailed audit trails
  - **My Project History**: View notes organized by project
  - **User History**: Admin-only view of all users' secure notes
- 📈 Expandable status history showing CREATED, VIEWED, DELETED, and EXPIRED events
- 📥 CSV Export functionality on all audit pages for data analysis
- 🔄 Automatic background polling (every 10 seconds) for real-time updates
- 📋 Modern table UI using Atlassian Design System components
- 🤖 **Rovo AI Agent** - Natural language analytics for Security Notes data

## 🛠 Technical Implementation

### Architecture

- **Frontend:** React + Vite (Forge Custom UI)
- **Backend:** Forge Functions using `@forge/api`, `@forge/sql`, `@forge/kvs`
- **ORM:** [forge-sql-orm](https://github.com/vassio/forge-sql-orm)
- **AI Analytics:** Atlassian Rovo AI agent for natural language queries
- **Storage:**
  - Encrypted content in `@forge/kvs` (via `setSecret`)
  - Metadata in `@forge/sql`

### Security Design

- Client-side encryption using Web Crypto API
- AES-GCM with 32-byte key derived via PBKDF2
- Random IV generation for each message
- Encrypted content stored in `@forge/kvs.setSecret`
- Metadata stored in `@forge/sql`
- Out-of-band key exchange required
- Automatic content deletion after viewing

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
   - **Select recipients**: Choose one or multiple users who can decrypt the note
   - **Description**: Enter a description of what you're sharing (required)
   - **Your Secure Note**: Enter the secret message content (max 10KB recommended)
   - **Set Note Expiry**: Choose expiration time (1 hour, 1 day, 7 days, 10 days, or custom date)
5. Click "Generate New Key" to create an encryption key
6. Copy the encryption key and share it securely (via Slack, email, etc.)
7. Click "Create & Encrypt Note"
8. **Email Notification**: The recipient(s) will automatically receive an email notification with:
   - A direct link to access the secure note
   - The expiration date and time
   - Instructions on how to obtain the decryption key
9. The note will be automatically updated in the panel every 10 seconds via background polling

### Viewing a Secure Note

1. Open the secure note link (from email notification or issue panel)
2. Enter the decryption key
3. View the message content
4. Use "Copy and Close" to save the content and destroy the note
5. The note will be automatically destroyed after viewing or when expired

### Email Notifications

The application automatically sends email notifications for important events:

1. **When a Secure Note is Created**:
   - Recipients receive an email with subject "🔐 A security note has been shared with you"
   - The email includes a direct link to access the note
   - The expiration date and time are clearly displayed
   - Instructions on how to obtain the decryption key are provided

2. **When a Secure Note Expires**:
   - Recipients receive an email with subject "⚠️ A Secure Note has expired and was deleted"
   - The email notifies that the note has been automatically deleted
   - Instructions to contact the sender if access is still needed

3. **When a Secure Note is Deleted**:
   - Recipients receive an email with subject "🗑️ A Secure Note has been deleted"
   - The email notifies that the creator has manually deleted the note
   - Instructions to contact the sender if access is still needed

**Note**: Email notifications are sent via Jira's notification system and will appear in the recipient's email inbox associated with their Jira account.

### Audit and History Pages

The application provides comprehensive audit pages accessible from the global page:

1. **My History** (`/myHistory`):
   - View all your secure notes with pagination
   - See description, status, issue/project keys, and timestamps
   - Expand rows to view status history (CREATED, VIEWED, DELETED, EXPIRED)
   - Export all data to CSV format

2. **My Issue History** (`/myIssue`):
   - Browse all issues that contain secure notes
   - Click on an issue to view detailed audit information
   - Export issue-specific data to CSV

3. **My Project History** (`/myProject`):
   - View all projects with secure notes
   - Drill down into project-specific audit details
   - Export project data to CSV

4. **User History** (`/userHistory` - Admin only):
   - Administrators can view all users' secure notes
   - Select a user to see their complete history
   - Export user-specific audit data to CSV

All audit pages feature:

- Pagination (10 items per page)
- Expandable status history rows
- CSV export functionality
- Real-time data updates

### Rovo AI Analytics

The application includes a **Rovo AI agent** that enables natural language queries about Security Notes data. Users can ask questions in plain English, and the agent will generate and execute SQL queries to provide insights.

**Features:**

- Ask questions like:
  - "Show all users which I shared security notes with for this issue"
  - "Show my notes for this issue from last week"
  - "Prepare a report of all descriptions and who shared for this issue last month"
  - "Show top 10 users who created the most security notes"

**Security:**

- Only read-only SELECT queries are allowed
- Non-admin users can only see notes they created or received
- Admin users have full access to all notes
- Sensitive fields (encryption keys, IV, salt) are never exposed
- Row-level security is enforced automatically

**How to use:**

1. Open the Rovo AI assistant in Jira
2. Ask questions about Security Notes using natural language
3. The agent will generate SQL queries and return results
4. Results are explained in natural language with summaries and highlights

**Example queries:**

- "Can you show all users which I shared security notes with for this issue?"
- "Show all users which I shared security notes with for this project."
- "Report security notes for this issue last month."
- "Show me top 10 users who created the most security notes."

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
