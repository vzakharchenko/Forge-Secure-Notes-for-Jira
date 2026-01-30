import { forgeDateTimeString } from "forge-sql-orm";

import { mysqlTable, primaryKey, varchar, tinyint } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { uuidBinary } from "./CustomTypes";

export const securityNotes = mysqlTable(
  "security_notes",
  {
    id: uuidBinary()
      .default(sql`(uuid_to_bin(uuid()))`)
      .notNull(),
    targetUserId: varchar("target_user_id", { length: 255 }).notNull(),
    targetUserName: varchar("target_user_name", { length: 255 }).notNull(),
    targetEmail: varchar("target_email", { length: 255 }).notNull(),
    expiry: varchar({ length: 100 }).notNull(),
    isCustomExpiry: tinyint("is_custom_expiry").notNull(),
    encryptionKeyHash: varchar("encryption_key_hash", { length: 255 }).notNull(),
    iv: varchar({ length: 255 }).notNull(),
    salt: varchar({ length: 255 }).notNull(),
    createdAt: forgeDateTimeString("created_at")
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
    createdBy: varchar("created_by", { length: 255 }).notNull(),
    status: varchar({ length: 100 }).notNull(),
    deletedAt: forgeDateTimeString("deleted_at"),
    expiredAt: forgeDateTimeString("expired_at"),
    expiryDate: forgeDateTimeString("expiry_date").notNull(),
    viewedAt: forgeDateTimeString("viewed_at"),
    targetAvatarUrl: varchar("target_avatar_url", { length: 255 }).notNull(),
    createdUserName: varchar("created_user_name", { length: 255 }).notNull(),
    createdEmail: varchar("created_email", { length: 255 }).notNull(),
    createdAvatarUrl: varchar("created_avatar_url", { length: 255 }).notNull(),
    description: varchar({ length: 255 }).notNull(),
    issueId: varchar("issue_id", { length: 255 }),
    issueKey: varchar("issue_key", { length: 255 }),
    projectId: varchar("project_id", { length: 255 }),
    projectKey: varchar("project_key", { length: 255 }),
    customAppId: varchar("custom_app_id", { length: 255 }),
    customEnvId: varchar("custom_env_id", { length: 255 }),
    senderKeyId: uuidBinary("sender_key_id"),
  },
  (table) => [primaryKey({ columns: [table.id], name: "security_notes_id" })],
);
