// helpers
import { calculateHashBase64, bufferToHex } from "@src/shared/utils/encode";

export const generateNewKey = async (accountId: string) => {
  // Generate 32 random bytes (256 bits of entropy) using cryptographically secure RNG
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  // Convert to hex string - preserves all entropy
  const randomHex = bufferToHex(randomBytes);
  return await calculateHashBase64(randomHex, accountId, 80000);
};
