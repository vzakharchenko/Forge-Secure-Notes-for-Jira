export enum ForgeTypes {
  issue = "issue",
  globalJira = "globalJira",
  jiraTrigger = "jiraTrigger",
}

export type ViewTimeOutType = "1min" | "3mins" | "5mins" | "15mins" | "30mins";

export type SecurityNoteStatus = "NEW" | "VIEWED" | "DELETED" | "EXPIRED";
export type ErrorType = "NOT_LICENSING" | "GENERAL" | "NO_PERMISSION" | "INSTALLATION";

export type ValidationErrors = string[];
// export type ValidationErrors = Record<string, string[]>;

export interface ErrorResponse {
  isError?: boolean;
  errorType?: ErrorType;
  message?: string;
  validationErrors?: ValidationErrors;
}

export const SHARED_EVENT_NAME = "refreshIssuePage";
