import { ErrorResponse } from "../Types";
import { ViewMySecurityNotes } from "./ViewMySecurityNotes";

export interface AuditUser extends ErrorResponse {
  result: ViewMySecurityNotes[];
}
