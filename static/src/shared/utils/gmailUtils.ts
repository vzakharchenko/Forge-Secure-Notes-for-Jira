// models
import { ViewMySecurityNotes } from "@shared/responses/ViewMySecurityNotes";

export interface GmailEmailParams {
  note: ViewMySecurityNotes;
  decodedKey: string;
  recipientEmail?: string;
}

/**
 * Builds a formatted email body for secure note decryption key
 */
export const buildSecureNoteEmailBody = (params: GmailEmailParams): string => {
  const { note, decodedKey } = params;
  const issueKey = note.issueKey || note.issueId || "ticket";

  return `🔐 SECURE NOTE
========================================

Dear ${note.targetUser.displayName},

A secure note has been created for you in ticket ${issueKey}.
Please use the following decryption key to access it:

----------------------------------------
DECRYPTION KEY:
----------------------------------------

${decodedKey}

----------------------------------------

⚠️  IMPORTANT: Keep this key secure and share it only through a secure channel.

========================================

Best regards,
${note.createdBy.displayName}

========================================
This is an automated message from Secure Notes for Jira`;
};

/**
 * Builds email subject for secure note
 */
export const buildSecureNoteEmailSubject = (note: ViewMySecurityNotes): string => {
  const issueKey = note.issueKey || note.issueId || "ticket";
  return `Secure Notes for ${issueKey}`;
};

/**
 * Builds Gmail compose URL with pre-filled email
 */
export const buildGmailComposeUrl = (params: GmailEmailParams): string => {
  const { note, decodedKey, recipientEmail = "test@test.com" } = params;

  const subject = buildSecureNoteEmailSubject(note);
  const body = buildSecureNoteEmailBody({ note, decodedKey, recipientEmail });

  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipientEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};
