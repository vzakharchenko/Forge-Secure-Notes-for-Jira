import { ErrorResponse } from "../Types";

export interface SecurityNoteData extends ErrorResponse {
  id: string;
  iv: string;
  salt: string;
  encryptedData: string;
  viewTimeOut: number;
  expiry: string;
}

export const PERMISSION_ERROR_OBJECT: SecurityNoteData = {
  isError: true,
  errorType: "NO_PERMISSION",
  viewTimeOut: 300,
  id: "",
  expiry: "",
  iv: "",
  salt: "",
  encryptedData: "",
};
