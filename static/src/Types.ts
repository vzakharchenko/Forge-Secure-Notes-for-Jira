export type ErrorType = "NOT_LICENSING" | "GENERAL" | "NO_PERMISSION";

export type ViewTimeOutType = "1min" | "3mins" | "5mins" | "15mins" | "30mins";
export type SecurityNoteStatus = "NEW" | "VIEWED" | "DELETED" | "EXPIRED";

export type NoteDataType = {
  targetUsers: {
    accountId: string;
    userName: string;
  }[];
  expiry: string;
  isCustomExpiry: boolean;
  encryptionKeyHash: string;
  encryptedPayload: string;
  iv: string;
  salt: string;
  description: string;
};

export interface ErrorResponse {
  isError?: boolean;
  errorType?: ErrorType;
  message?: string;
  validationErrors?: string[];
}
