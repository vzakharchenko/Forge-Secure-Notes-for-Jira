import { ErrorResponse } from "../Types";

export interface Bootstrap extends ErrorResponse {
  isAdmin: boolean;
}
