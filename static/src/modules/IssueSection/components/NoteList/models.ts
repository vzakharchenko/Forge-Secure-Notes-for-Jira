// SPDX-FileCopyrightText: 2025 Trust Logic / Vasyl Zakharchenko
// SPDX-License-Identifier: BUSL-1.1

// models
import { ViewMySecurityNotes } from "@shared/responses/ViewMySecurityNotes";

export interface NoteListProps {
  title: string;
  accountId: string;
  notes: ViewMySecurityNotes[];
  variant: "incoming" | "sent";
  onOpen?: (noteId: string) => void;
  onClick?: (noteId: string, accountId: string) => void;
  onDelete?: (noteId: string) => void;
  timezone: string;
}
