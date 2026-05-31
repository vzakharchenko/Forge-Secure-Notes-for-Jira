// SPDX-FileCopyrightText: 2025 Trust Logic / Vasyl Zakharchenko
// SPDX-License-Identifier: BUSL-1.1

import { ErrorResponse } from "../Types";

export interface ProjectInfo {
  issueId: string;
  issueKey: string;
  projectId: string;
  projectKey: string;
}

export interface ProjectIssue extends ErrorResponse {
  result: ProjectInfo[];
}
