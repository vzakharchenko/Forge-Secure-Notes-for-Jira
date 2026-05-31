// SPDX-FileCopyrightText: 2025 Trust Logic / Vasyl Zakharchenko
// SPDX-License-Identifier: BUSL-1.1

// models
import { JiraUser } from "@src/shared/models/user";
import { Lookup } from "@src/shared/models/form";

export interface SecureNoteFormFields {
  targetUsers: (JiraUser & Lookup)[];
  description: string;
  note: string;
  expiryOption: string;
  expiryDate: string;
  encryptionKey: string;
}
