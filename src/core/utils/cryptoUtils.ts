import { pbkdf2, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const pbkdf2Async = promisify(pbkdf2);

export async function calculateHash(password: string, accountId: string) {
  const salt = Buffer.from(accountId, "utf8");
  const key = await pbkdf2Async(password, salt, 1000, 32, "sha256");
  return key.toString("hex");
}

/**
 * Verifies two hex-encoded hashes using constant-time comparison to prevent timing attacks.
 * @param storedHash - The stored hash in hex format
 * @param calculatedHash - The calculated hash in hex format
 * @param errorMessage - Error message to throw if hashes don't match
 * @throws Error if hashes don't match or have different lengths
 */
export function verifyHashConstantTime(
  storedHash: string,
  calculatedHash: string,
  errorMessage: string,
): void {
  const storedHashBuffer = Buffer.from(storedHash, "hex");
  const calculatedHashBuffer = Buffer.from(calculatedHash, "hex");

  // Ensure buffers have the same length (they should, but safety check)
  if (storedHashBuffer.length !== calculatedHashBuffer.length) {
    throw new Error(errorMessage);
  }

  // Use constant-time comparison to prevent timing attacks
  if (!timingSafeEqual(storedHashBuffer, calculatedHashBuffer)) {
    throw new Error(errorMessage);
  }
}

export function decodeJwtPayload(token: string) {
  const [, payloadB64Url] = token.split(".");
  if (!payloadB64Url) throw new Error("Not a JWT");

  const b64 = payloadB64Url.replaceAll("-", "+").replaceAll("_", "/");
  const padded = b64 + "===".slice((b64.length + 3) % 4); // base64 padding
  const json = Buffer.from(padded, "base64").toString("utf8");
  return JSON.parse(json);
}
