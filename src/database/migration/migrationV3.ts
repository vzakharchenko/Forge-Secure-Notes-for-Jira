import { MigrationRunner } from "@forge/sql/out/migration";

export default (migrationRunner: MigrationRunner): MigrationRunner => {
  return migrationRunner.enqueue(
    "v3_MIGRATION0",
    "ALTER TABLE `security_notes` ADD COLUMN IF NOT EXISTS `description` varchar(255) NULL;",
  );
};
