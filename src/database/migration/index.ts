import { MigrationRunner } from "@forge/sql/out/migration";
import migrationV1 from "./migrationV1";
import migrationV2 from "./migrationV2";
import migrationV3 from "./migrationV3";
import migrationV4 from "./migrationV4";
import migrationV5 from "./migrationV5";
import migrationV6 from "./migrationV6";
import migrationV7 from "./migrationV7";

export type MigrationType = (migrationRunner: MigrationRunner) => MigrationRunner;

export default (migrationRunner: MigrationRunner): MigrationRunner => {
  migrationV1(migrationRunner);
  migrationV2(migrationRunner);
  migrationV3(migrationRunner);
  migrationV4(migrationRunner);
  migrationV5(migrationRunner);
  migrationV6(migrationRunner);
  migrationV7(migrationRunner);
  return migrationRunner;
};
