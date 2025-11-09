import { ViewMySecurityNotes } from "../../../shared/responses/ViewMySecurityNotes";
import { formatDateTime } from "./dateUtils";

/**
 * Escapes a CSV field value
 */
function escapeCsvField(value: string | null | undefined): string {
  if (value === null || value === undefined) {
    return "";
  }
  const stringValue = String(value);
  // If the value contains comma, quote, or newline, wrap it in quotes and escape quotes
  if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

/**
 * Converts ViewMySecurityNotes array to CSV format
 */
export function convertNotesToCSV(notes: ViewMySecurityNotes[]): string {
  const headers = [
    "ID",
    "Description",
    "Created By (Display Name)",
    "Created By (Account ID)",
    "Target User (Display Name)",
    "Target User (Account ID)",
    "Status",
    "Issue Key",
    "Issue ID",
    "Project Key",
    "Project ID",
    "Created At",
    "Viewed At",
    "Deleted At",
    "Expiration",
    "Expiry",
  ];

  const rows = notes.map((note) => {
    return [
      escapeCsvField(note.id),
      escapeCsvField(note.description),
      escapeCsvField(note.createdBy?.displayName),
      escapeCsvField(note.createdBy?.accountId),
      escapeCsvField(note.targetUser?.displayName),
      escapeCsvField(note.targetUser?.accountId),
      escapeCsvField(note.status),
      escapeCsvField(note.issueKey),
      escapeCsvField(note.issueId),
      escapeCsvField(note.projectKey),
      escapeCsvField(note.projectId),
      escapeCsvField(note.createdAt ? formatDateTime(note.createdAt) : ""),
      escapeCsvField(note.viewedAt ? formatDateTime(note.viewedAt) : ""),
      escapeCsvField(note.deletedAt ? formatDateTime(note.deletedAt) : ""),
      escapeCsvField(note.expiration ? formatDateTime(note.expiration) : ""),
      escapeCsvField(note.expiry),
    ].join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}

/**
 * Downloads CSV content as a file
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
