import { pbkdf2 } from "node:crypto";
import { promisify } from "node:util";

const pbkdf2Async = promisify(pbkdf2);

export async function calculateHash(password: string, accountId: string) {
  const salt = Buffer.from(accountId, "utf8");
  const key = await pbkdf2Async(password, salt, 1000, 32, "sha256");
  return key.toString("hex");
}

export function decodeJwtPayload(token: string) {
  const [, payloadB64Url] = token.split(".");
  if (!payloadB64Url) throw new Error("Not a JWT");

  const b64 = payloadB64Url.replaceAll("-", "+").replaceAll("_", "/");
  const padded = b64 + "===".slice((b64.length + 3) % 4); // base64 padding
  const json = Buffer.from(padded, "base64").toString("utf8");
  return JSON.parse(json);
}
