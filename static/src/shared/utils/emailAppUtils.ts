// models
import { ViewMySecurityNotes } from "@shared/responses/ViewMySecurityNotes";

export interface EmailAppParams {
  note: ViewMySecurityNotes;
  decodedKey: string;
  recipientEmail?: string;
}

/**
 * Builds a formatted email body for secure note decryption key (compact version for mailto)
 */
export const buildSecureNoteEmailBody = (params: EmailAppParams): string => {
  const { note, decodedKey } = params;
  const issueKey = note.issueKey || note.issueId || "ticket";

  return `Dear ${note.targetUser.displayName},

Secure note for ${issueKey}. Decryption key:

${decodedKey}

Best regards,
${note.createdBy.displayName}`;
};

/**
 * Builds email subject for secure note
 */
export const buildSecureNoteEmailSubject = (note: ViewMySecurityNotes): string => {
  const issueKey = note.issueKey || note.issueId || "ticket";
  return `Secure Notes for ${issueKey}`;
};

/**
 * Builds mailto URL with pre-filled email
 * Note: Email address should not be encoded, only query parameters should be encoded
 */
export const buildMailtoUrl = (params: EmailAppParams): string => {
  const { note, decodedKey, recipientEmail = "test@test.com" } = params;

  const subject = buildSecureNoteEmailSubject(note);
  const body = buildSecureNoteEmailBody({ note, decodedKey, recipientEmail });

  // Email address should not be encoded in mailto URLs, only query parameters
  return `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};
