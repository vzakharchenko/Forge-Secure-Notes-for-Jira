// SPDX-FileCopyrightText: 2025 Trust Logic / Vasyl Zakharchenko
// SPDX-License-Identifier: BUSL-1.1

import { ErrorResponse } from "../Types";
import { ViewMySecurityNotes } from "./ViewMySecurityNotes";

export interface AuditUser extends ErrorResponse {
  result: ViewMySecurityNotes[];
}
