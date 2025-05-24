import {forgeDateTimeString} from "forge-sql-orm";

import {mysqlTable, primaryKey, tinyint, varbinary, varchar} from "drizzle-orm/mysql-core"
import {sql} from "drizzle-orm"

export const securityNotes = mysqlTable("security_notes", {
	id: varbinary({ length: 16 }).default(sql`(uuid_to_bin(uuid()))`).notNull(),
	targetUserId: varchar("target_user_id", { length: 255 }).notNull(),
	targetUserName: varchar("target_user_name", { length: 255 }),
	expiry: varchar({ length: 100 }).notNull(),
	isCustomExpiry: tinyint("is_custom_expiry").notNull(),
	encryptionKeyHash: varchar("encryption_key_hash", { length: 255 }).notNull(),
	iv: varchar({ length: 255 }).notNull(),
	salt: varchar({ length: 255 }).notNull(),
	createdAt: forgeDateTimeString('created_at').default(sql`(now())`).notNull(),
	createdBy: varchar("created_by", { length: 255 }).notNull(),
	status: varchar({ length: 100 }).notNull(),
	deletedAt: forgeDateTimeString('deleted_at'),
	expiredAt: forgeDateTimeString('expired_at'),
	expiryDate: forgeDateTimeString('expiry_date').notNull(),
	viewedAt: forgeDateTimeString('viewed_at'),
},
(table) => [
	primaryKey({ columns: [table.id], name: "security_notes_id"}),
]);
