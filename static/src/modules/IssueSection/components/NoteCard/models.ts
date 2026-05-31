// SPDX-FileCopyrightText: 2025 Trust Logic / Vasyl Zakharchenko
// SPDX-License-Identifier: BUSL-1.1

// models
import { ViewMySecurityNotes } from "@shared/responses/ViewMySecurityNotes";

export interface NoteCardProps {
  note: ViewMySecurityNotes;
  variant: "incoming" | "sent";
  onOpen?: (noteId: string) => void;
  accountId: string;
  onClick?: (noteId: string, accountId: string) => void;
  onDelete?: (noteId: string) => void;
  timezone: string;
}
