import api, { route } from "@forge/api";
import { formatDateTime } from "./dateUtils";

type SendSecurityNoteNotificationParams = {
  issueKey: string;
  recipientAccountId: string;
  noteLink: string;
  displayName?: string;
  expiryDate: Date;
};

export async function sendIssueNotification({
  issueKey,
  recipientAccountId,
  noteLink,
  displayName,
  expiryDate,
}: SendSecurityNoteNotificationParams): Promise<void> {
  const creatorDisplayName = displayName ?? "Someone";

  const subject = "🔐 A security note has been shared with you";

  const body = `User ${creatorDisplayName} has created a security note for you.

You can access it via the following link:
${noteLink}
⚠️ Please note: this link will expire on **${formatDateTime(expiryDate)}**.
To open the note, you will need a security key, which you can request directly from ${creatorDisplayName}.
Feel free to use any convenient channel such as Slack, email, or another secure method.

Note: This link is only accessible to you.`;

  const res = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}/notify`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subject,
      htmlBody: body,
      to: {
        users: [
          {
            accountId: recipientAccountId,
          },
        ],
      },
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    // eslint-disable-next-line no-console
    console.error(`Failed to send notification: ${res.status} ${res.statusText}`, errorBody);
    throw new Error(`Jira API error: ${res.status}`);
  } else {
    // eslint-disable-next-line no-console
    console.log(await res.text());
  }
  // eslint-disable-next-line no-console
  console.log(`✅ Notification sent to ${recipientAccountId} for issue ${issueKey}`);
}
type ExpirationSecurityNoteNotificationParams = {
  issueKey: string;
  recipientAccountId: string;
  displayName?: string;
};

export async function sendExpirationNotification({
  issueKey,
  recipientAccountId,
  displayName,
}: ExpirationSecurityNoteNotificationParams): Promise<void> {
  // eslint-disable-next-line no-console
  console.log("Sending expiration notification to", recipientAccountId);

  const creatorDisplayName = displayName ?? "the sender";

  const subject = "⚠️ A Secure Note has expired and was deleted";

  const body = `The Secure Note that was previously shared with you has expired and has been deleted from the system.

If you still need access to this information, please contact ${creatorDisplayName} and ask them to create a new Secure Note for you.

This expiration is automatic and is designed to protect sensitive information.`;

  const res = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}/notify`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subject,
      textBody: body,
      to: {
        users: [
          {
            accountId: recipientAccountId,
          },
        ],
      },
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    // eslint-disable-next-line no-console
    console.error(
      `❌ Failed to send expiration notification: ${res.status} ${res.statusText}`,
      errorBody,
    );
    throw new Error(`Jira API error: ${res.status}`);
  }
  // eslint-disable-next-line no-console
  console.log(`✅ Expiration notification sent to ${recipientAccountId} for issue ${issueKey}`);
}

type DeletedNoteNotificationParams = {
  issueKey: string;
  recipientAccountId: string;
  displayName?: string;
};

export async function sendNoteDeletedNotification({
  issueKey,
  recipientAccountId,
  displayName,
}: DeletedNoteNotificationParams): Promise<void> {
  const creatorDisplayName = displayName ?? "the sender";

  const subject = "🗑️ A Secure Note has been deleted";

  const body = `User ${creatorDisplayName} has manually deleted the Secure Note that was previously shared with you.

If you still need access to this information, please contact ${creatorDisplayName} and ask them to create a new Secure Note.

Note: Once deleted, the note cannot be restored.`;

  const res = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}/notify`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subject,
      textBody: body,
      to: {
        users: [
          {
            accountId: recipientAccountId,
          },
        ],
      },
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    // eslint-disable-next-line no-console
    console.error(`❌ Failed to send deletion notification: ${res.status}`, errorBody);
    throw new Error(`Jira API error: ${res.status}`);
  }
  // eslint-disable-next-line no-console
  console.log(`✅ Deletion notification sent to ${recipientAccountId} for issue ${issueKey}`);
}
