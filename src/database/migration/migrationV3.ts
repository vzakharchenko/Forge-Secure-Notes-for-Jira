import { MigrationRunner } from "@forge/sql/out/migration";

const migrationV3 = (migrationRunner: MigrationRunner): MigrationRunner => {
  return migrationRunner.enqueue(
    "v3_MIGRATION0",
    "ALTER TABLE `security_notes` ADD COLUMN IF NOT EXISTS `description` varchar(255) NOT NULL;",
  );
};

export default migrationV3;
