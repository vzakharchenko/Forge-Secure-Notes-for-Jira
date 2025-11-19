// helpers
import { calculateHashBase64 } from "@src/shared/utils/encode";

export const generateNewKey = async (accountId: string) => {
  return await calculateHashBase64(Math.random().toString(8).substring(7), accountId, 80000);
};
