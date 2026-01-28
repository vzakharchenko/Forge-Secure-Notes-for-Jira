import { MigrationRunner } from "@forge/sql/out/migration";

export default (migrationRunner: MigrationRunner): MigrationRunner => {
  migrationRunner.enqueue(
    "v4_MIGRATION0",
    "ALTER TABLE `security_notes` ADD COLUMN IF NOT EXISTS `sender_key_id` varbinary(16) NULL ;",
  );
  return migrationRunner;
};
