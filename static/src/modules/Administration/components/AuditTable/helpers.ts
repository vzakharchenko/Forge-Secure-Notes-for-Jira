// helpers
import { ViewMySecurityNotes } from "@shared/responses/ViewMySecurityNotes";
import { StatusHistoryItem } from "./models";
import { ViewIssueModal } from "@forge/jira-bridge";

export const getStatusHistory = (note: ViewMySecurityNotes): StatusHistoryItem[] => {
  const history: StatusHistoryItem[] = [];

  if (note.createdAt) {
    history.push({ status: "CREATED", date: new Date(note.createdAt) });
  }

  if (note.viewedAt) {
    history.push({ status: "VIEWED", date: new Date(note.viewedAt) });
  }

  if (note.deletedAt) {
    history.push({ status: "DELETED", date: new Date(note.deletedAt) });
  }

  if (note.status === "EXPIRED") {
    history.push({ status: "EXPIRED", date: new Date(note.expiration) });
  }

  return history;
};

export const getStatusDescription = (status: string): string => {
  switch (status) {
    case "CREATED":
      return "Security note was created and shared with the recipient";
    case "DELETED":
      return "Security note was deleted by the creator";
    case "VIEWED":
      return "Security note was viewed and decrypted by the recipient";
    case "EXPIRED":
      return "Security note expired and was automatically deleted";
    default:
      return "-";
  }
};

export const openIssueModal = (issueKey: string): void => {
  const viewIssueModal = new ViewIssueModal({
    context: {
      issueKey: issueKey,
    },
  });

  viewIssueModal.open();
};
