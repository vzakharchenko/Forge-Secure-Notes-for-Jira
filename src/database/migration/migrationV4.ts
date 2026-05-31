// SPDX-FileCopyrightText: 2025 Trust Logic / Vasyl Zakharchenko
// SPDX-License-Identifier: BUSL-1.1

import { MigrationRunner } from "@forge/sql/out/migration";

const migrationV4 = (migrationRunner: MigrationRunner): MigrationRunner => {
  migrationRunner.enqueue(
    "v4_MIGRATION0",
    "ALTER TABLE `security_notes` ADD COLUMN IF NOT EXISTS `sender_key_id` varbinary(16) NULL ;",
  );
  return migrationRunner;
};

export default migrationV4;
