import {
  schedulerTrigger,
  exceptionHandlerTrigger,
  SchedulerTrigger,
  SchedulerTriggerResponse,
} from "../../core";
import { AppEventService, KVSSchemaMigrationService } from "../../services";
import { applySchemaMigrations, getHttpResponse } from "forge-sql-orm";
import migration from "../../database/migration";
import { Container } from "inversify";
import { FORGE_INJECTION_TOKENS } from "../../constants";
import { diContainer, useDiContainer } from "../../core/decorators";
import { MigrationRunner } from "@forge/sql/out/migration";

const MIGRATION_BINDINGS = [
  { name: FORGE_INJECTION_TOKENS.KVSSchemaMigrationService, bind: KVSSchemaMigrationService },
  { name: FORGE_INJECTION_TOKENS.AppEventService, bind: AppEventService },
] as const;

@schedulerTrigger
class ApplySchemaMigrationTrigger implements SchedulerTrigger {
  @diContainer(...MIGRATION_BINDINGS)
  private readonly _container!: Container;

  @useDiContainer("_container")
  @exceptionHandlerTrigger("Apply Schema Trigger Error")
  async handler(): Promise<SchedulerTriggerResponse<string>> {
    const kvsSchemaMigrationService = this._container.get<KVSSchemaMigrationService>(
      FORGE_INJECTION_TOKENS.KVSSchemaMigrationService,
    );
    const appEventService = this._container.get<AppEventService>(
      FORGE_INJECTION_TOKENS.AppEventService,
    );
    if (await kvsSchemaMigrationService.isLatestVersion()) {
      return getHttpResponse(200, "NOT NEEDED");
    } else {
      const response = await applySchemaMigrations(async (migrationRunner: MigrationRunner) =>
        migration(migrationRunner),
      );
      await kvsSchemaMigrationService.setLatestVersion();
      appEventService.sendPresentEvent();
      return response;
    }
  }
}

export default new ApplySchemaMigrationTrigger();
