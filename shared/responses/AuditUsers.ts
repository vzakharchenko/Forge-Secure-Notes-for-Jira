import { ErrorResponse } from "../Types";
import { UserViewInfoType } from "./ViewMySecurityNotes";

export interface AuditUsers extends ErrorResponse {
  result: UserViewInfoType[];
}
