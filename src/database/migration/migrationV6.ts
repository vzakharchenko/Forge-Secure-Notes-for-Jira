import { MigrationRunner } from "@forge/sql/out/migration";

export default (migrationRunner: MigrationRunner): MigrationRunner => {
  migrationRunner.enqueue(
    "v6_MIGRATION0",
    "ALTER TABLE `security_notes` ADD COLUMN IF NOT EXISTS `custom_app_id` varchar(255) NULL ;",
  );
  return migrationRunner;
};
