import { ErrorResponse } from "../Types";

export interface OpenSecurityNote extends ErrorResponse {
  valid: boolean;
  sourceAccountId?: string;
}
