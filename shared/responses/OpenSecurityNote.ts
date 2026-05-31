// SPDX-FileCopyrightText: 2025 Trust Logic / Vasyl Zakharchenko
// SPDX-License-Identifier: BUSL-1.1

import { ErrorResponse } from "../Types";

export interface OpenSecurityNote extends ErrorResponse {
  valid: boolean;
  sourceAccountId?: string;
}
