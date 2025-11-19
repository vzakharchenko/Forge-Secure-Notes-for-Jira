// models
import { ViewMySecurityNotes } from "@shared/responses/ViewMySecurityNotes";

export interface NoteListProps {
  title: string;
  notes: ViewMySecurityNotes[];
  variant: "incoming" | "sent";
  onOpen?: (noteId: string) => void;
  onDelete?: (noteId: string) => void;
  timezone: string;
}
