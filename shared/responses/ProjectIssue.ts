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
