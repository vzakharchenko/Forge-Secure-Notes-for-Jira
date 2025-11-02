import { MigrationRunner } from "@forge/sql/out/migration";

export default (migrationRunner: MigrationRunner): MigrationRunner => {
  return migrationRunner
    .enqueue(
      "v2_MIGRATION0",
      "ALTER TABLE `security_notes` ADD COLUMN IF NOT EXISTS `project_id` varchar(255) NULL;",
    )
    .enqueue(
      "v2_MIGRATION1",
      "ALTER TABLE `security_notes` ADD COLUMN IF NOT EXISTS `project_key` varchar(255) NULL;",
    );
};
