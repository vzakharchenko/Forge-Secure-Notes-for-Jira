import { kvs } from "@forge/kvs";
import { MIGRATION_VERSION } from "../../database/migration/migrationCount";

const CURRENT_VERSION = "CURRENT_VERSION";

export interface KVSSchemaMigrationService {
  isLatestVersion(): Promise<boolean>;
  setLatestVersion(): Promise<void>;
  clearVersion(): Promise<void>;
}

class KVSSchemaMigrationServiceImpl implements KVSSchemaMigrationService {
  async clearVersion(): Promise<void> {
    await kvs.delete(CURRENT_VERSION);
  }

  async isLatestVersion(): Promise<boolean> {
    const currentVersion: string | undefined = (await kvs.get<string>(CURRENT_VERSION)) as string;
    return currentVersion === `${MIGRATION_VERSION}`;
  }

  async setLatestVersion(): Promise<void> {
    await kvs.set(CURRENT_VERSION, `${MIGRATION_VERSION}`);
  }
}

export const KVS_SCHEMA_MIGRATION_SERVICE: KVSSchemaMigrationService =
  new KVSSchemaMigrationServiceImpl();
