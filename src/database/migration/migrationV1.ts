import { MigrationRunner } from "@forge/sql/out/migration";

export default (migrationRunner: MigrationRunner): MigrationRunner => {
  return migrationRunner.enqueue(
    "v1_MIGRATION0",
    "CREATE TABLE `security_notes` ( `id` varbinary(16) NOT NULL DEFAULT (uuid_to_bin(uuid())), `target_user_id` varchar(255) NOT NULL, `target_user_name` varchar(255) NOT NULL, `expiry` varchar(100) NOT NULL, `is_custom_expiry` tinyint NOT NULL, `encryption_key_hash` varchar(255) NOT NULL, `iv` varchar(255) NOT NULL, `salt` varchar(255) NOT NULL, `created_at` datetime NOT NULL DEFAULT (now()), `created_by` varchar(255) NOT NULL, `status` varchar(100) NOT NULL, `deleted_at` datetime, `expired_at` datetime, `expiry_date` datetime NOT NULL, `viewed_at` datetime, `target_avatar_url` varchar(255) NOT NULL, `created_user_name` varchar(255) NOT NULL, `created_avatar_url` varchar(255) NOT NULL, `issue_id` varchar(255), `issue_key` varchar(255), CONSTRAINT `security_notes_id` PRIMARY KEY(`id`) )",
  );
};
