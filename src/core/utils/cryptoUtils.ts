import { pbkdf2 } from "crypto";
import { promisify } from "util";

const pbkdf2Async = promisify(pbkdf2);

export async function calculateHash(password: string, accountId: string) {
  const salt = Buffer.from(accountId, "utf8");
  const key = await pbkdf2Async(password, salt, 1000, 32, "sha256");
  return key.toString("hex");
}
