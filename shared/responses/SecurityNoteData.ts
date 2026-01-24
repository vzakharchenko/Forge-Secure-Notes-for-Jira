import { ErrorResponse } from "../Types";

export interface SecurityNoteData extends ErrorResponse {
  id: string;
  iv: string;
  salt: string;
  encryptedData: string;
  viewTimeOut: number;
  expiry: string;
}

/**
 * Generic error object returned when decryption fails.
 * Uses a consistent error message that doesn't reveal whether:
 * - The note doesn't exist
 * - The user is not authorized
 * - The decryption key is incorrect
 *
 * This prevents information disclosure attacks where an attacker could determine
 * if a note exists by observing different error messages or response times.
 */
export const PERMISSION_ERROR_OBJECT: SecurityNoteData = {
  isError: true,
  errorType: "NO_PERMISSION",
  message:
    "Invalid security note or decryption key. Please verify the link and key, or contact the note creator if you believe this is an error.",
  viewTimeOut: 300,
  id: "",
  expiry: "",
  iv: "",
  salt: "",
  encryptedData: "",
};
