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

@schedulerTrigger
class ApplySchemaMigrationTrigger implements SchedulerTrigger {
  container(): Container {
    const container = new Container();
    container.bind(FORGE_INJECTION_TOKENS.KVSSchemaMigrationService).to(KVSSchemaMigrationService);
    return container;
  }

  @exceptionHandlerTrigger("SlowQuery Trigger Error")
  async handler(): Promise<SchedulerTriggerResponse<string>> {
    const kvsSchemaMigrationService = this.container().get<KVSSchemaMigrationService>(
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
