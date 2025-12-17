import {
  schedulerTrigger,
  exceptionHandlerTrigger,
  SchedulerTrigger,
  SchedulerTriggerResponse,
  KVSSchemaMigrationService,
} from "../../core";
import { applySchemaMigrations, getHttpResponse } from "forge-sql-orm";
import migration from "../../database/migration";
import { Container } from "inversify";
import { FORGE_INJECTION_TOKENS } from "../../constants";
import { diContainer, useDiContainer } from "../../core/decorators";

const MIGRATION_BINDINGS = [
  { name: FORGE_INJECTION_TOKENS.KVSSchemaMigrationService, bind: KVSSchemaMigrationService },
] as const;

@schedulerTrigger
class ApplySchemaMigrationTrigger implements SchedulerTrigger {
  @diContainer(...MIGRATION_BINDINGS)
  private _container!: Container;

  @useDiContainer("_container")
  @exceptionHandlerTrigger("SlowQuery Trigger Error")
  async handler(): Promise<SchedulerTriggerResponse<string>> {
    const kvsSchemaMigrationService = this._container.get<KVSSchemaMigrationService>(
      FORGE_INJECTION_TOKENS.KVSSchemaMigrationService,
    );
    if (!(await kvsSchemaMigrationService.isLatestVersion())) {
      const response = await applySchemaMigrations(migration);
      await kvsSchemaMigrationService.setLatestVersion();
      return response;
    } else {
      return getHttpResponse(200, "NOT NEEDED");
    }
  }
}

export default new ApplySchemaMigrationTrigger();
