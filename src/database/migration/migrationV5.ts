import { MigrationRunner } from "@forge/sql/out/migration";

export default (migrationRunner: MigrationRunner): MigrationRunner => {
  migrationRunner.enqueue(
    "v5_MIGRATION0_NULLABLE",
    "ALTER TABLE `security_notes` ADD COLUMN IF NOT EXISTS `created_email` varchar(255) NULL ;",
  );

  migrationRunner.enqueue(
    "v5_MIGRATION0_UPDATE_EXISTS_RECORDS",
    "UPDATE `security_notes` SET `created_email` = '' WHERE `created_email` IS NULL",
  );

  migrationRunner.enqueue(
    "v5_MIGRATION0",
    "ALTER TABLE `security_notes` MODIFY COLUMN IF EXISTS `created_email` varchar(255) NOT NULL;",
  );

  migrationRunner.enqueue(
    "v5_MIGRATION1_NULLABLE",
    "ALTER TABLE `security_notes` ADD COLUMN IF NOT EXISTS `target_email` varchar(255) NULL ;",
  );

  migrationRunner.enqueue(
    "v5_MIGRATION1_UPDATE_EXISTS_RECORDS",
    "UPDATE `security_notes` SET `target_email` = '' WHERE `target_email` IS NULL",
  );

  migrationRunner.enqueue(
    "v5_MIGRATION1",
    "ALTER TABLE `security_notes` MODIFY COLUMN IF EXISTS `target_email` varchar(255) NOT NULL;",
  );
  return migrationRunner;
};
