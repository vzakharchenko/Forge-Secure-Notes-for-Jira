// models
import { ViewMySecurityNotes } from "@shared/responses/ViewMySecurityNotes";

export interface NoteCardProps {
  note: ViewMySecurityNotes;
  variant: "incoming" | "sent";
  onOpen?: (noteId: string) => void;
  onDelete?: (noteId: string) => void;
  timezone: string;
}
