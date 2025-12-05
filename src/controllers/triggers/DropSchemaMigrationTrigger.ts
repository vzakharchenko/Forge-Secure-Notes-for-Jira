import {
  schedulerTrigger,
  exceptionHandlerTrigger,
  SchedulerTrigger,
  SchedulerTriggerResponse,
  KVSSchemaMigrationService,
} from "../../core";
import { dropSchemaMigrations } from "forge-sql-orm";
import { Container } from "inversify";
import { FORGE_INJECTION_TOKENS } from "../../constants";

@schedulerTrigger
class DropSchemaMigrationTrigger implements SchedulerTrigger {
  container(): Container {
    const container = new Container();
    container.bind(FORGE_INJECTION_TOKENS.KVSSchemaMigrationService).to(KVSSchemaMigrationService);
    return container;
  }

  @exceptionHandlerTrigger("SlowQuery Trigger Error")
  async handler(): Promise<SchedulerTriggerResponse<string>> {
    await this.container()
      .get<KVSSchemaMigrationService>(FORGE_INJECTION_TOKENS.KVSSchemaMigrationService)
      .clearVersion();
    return dropSchemaMigrations();
  }
}

export default new DropSchemaMigrationTrigger();
