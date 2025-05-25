import React from "react";

export default function SecureNotesInfoPage() {
    return (
        <div style={{ maxWidth: 800, margin: "2rem auto", fontFamily: "sans-serif", lineHeight: 1.6 }}>
            <h1>🔐 Secure Notes for Jira</h1>
            <p>
                Secure Notes allows Jira users to share encrypted messages with specific teammates,
                linked directly to Jira issues.
            </p>

            <h2>🔧 How it works</h2>
            <ul>
                <li>You select a user and write a secure note on the issue panel.</li>
                <li>The note is encrypted in the browser with a unique key.</li>
                <li>A special link is generated and shared via a Jira notification.</li>
                <li>Only the selected recipient can view the note with the decryption key.</li>
                <li>The key is not stored on the server — you must send it via Slack, email, or other secure methods.</li>
            </ul>

            <h2>⏳ Expiry & Privacy</h2>
            <p>
                Notes automatically expire after a defined period (e.g., 1 hour). Expired or viewed notes are marked accordingly.
            </p>

            <h2>✅ Why use Secure Notes?</h2>
            <ul>
                <li>Keep sensitive information (like credentials or private instructions) out of comments.</li>
                <li>Ensure that only the intended recipient can decrypt and access the note.</li>
                <li>No passwords are stored — it's a zero-trust approach.</li>
            </ul>

            <h2>🚀 Ready to use</h2>
            <p>
                You'll find Secure Notes in the issue panel of any Jira issue. Try sending a note today!
            </p>

            <h2 style={{ marginTop: "2.5rem" }}>🚧 Known limitations (not included in the hackathon scope)</h2>
            <ul>
                <li>Audit logs are collected, but not yet displayed in the UI.</li>
                <li>Logging of unsuccessful decryption attempts is not implemented.</li>
                <li>File attachments are not supported.</li>
                <li>No reporting on which users received secure notes across issues.</li>
            </ul>

            <hr />

            <p style={{ fontSize: "0.9rem", color: "#555" }}>
                <strong>Forge App</strong> | Built with <code>forge-sql-orm</code> |{" "}
                <a href="https://developer.atlassian.com" target="_blank" rel="noreferrer">
                    Learn more
                </a>
            </p>
        </div>
    );
}