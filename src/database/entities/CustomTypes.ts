import { customType } from "drizzle-orm/mysql-core";
import { stringify } from "uuid";
import { sql } from "drizzle-orm";

export const uuidBinary = customType<{
  data: string;
  driverData: {
    type: "Buffer";
    data: number[];
  };
  config: [];
}>({
  dataType() {
    return "varbinary(16)";
  },
  toDriver(value) {
    if (value === null) {
      return sql`null`;
    }
    return sql<{
      type: "Buffer";
      data: number[];
    }>`UUID_TO_BIN(${value})`;
  },
  fromDriver(value) {
    if (value === null) {
      return null as unknown as string;
    }
    const arrayBufferBuffer = Buffer.from(value.data);
    const bytesArray = new Uint8Array(arrayBufferBuffer);
    if (bytesArray.length !== 16) {
      throw new Error(`Invalid UUID buffer length: ${bytesArray.length}`);
    }
    try {
      return stringify(bytesArray);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`Unable to parse UUID buffer: ${bytesArray}`, e);
      return null as unknown as string;
    }
  },
});
