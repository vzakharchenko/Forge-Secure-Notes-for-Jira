import {
  forgeDateTimeString,
  forgeTimeString,
  forgeDateString,
  forgeTimestampString,
} from "forge-sql-orm";

import {
  mysqlTable,
  mysqlSchema,
  AnyMySqlColumn,
  primaryKey,
  varchar,
  datetime,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const secureNotes = mysqlTable(
  "secure_notes",
  {
    id: varchar({ length: 255 }).notNull(),
    expiration: forgeDateTimeString().notNull(),
    status: varchar({ length: 255 }),
  },
  (table) => [primaryKey({ columns: [table.id], name: "secure_notes_id" })],
);
