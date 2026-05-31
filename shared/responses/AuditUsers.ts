// SPDX-FileCopyrightText: 2025 Trust Logic / Vasyl Zakharchenko
// SPDX-License-Identifier: BUSL-1.1

import { ErrorResponse } from "../Types";
import { UserViewInfoType } from "./ViewMySecurityNotes";

export interface AuditUsers extends ErrorResponse {
  result: UserViewInfoType[];
}
