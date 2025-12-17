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
import { diContainer, useDiContainer } from "../../core/decorators";

const DROP_BINDINGS = [
  { name: FORGE_INJECTION_TOKENS.KVSSchemaMigrationService, bind: KVSSchemaMigrationService },
] as const;

@schedulerTrigger
class DropSchemaMigrationTrigger implements SchedulerTrigger {
  @diContainer(...DROP_BINDINGS)
  private _container!: Container;

  @useDiContainer("_container")
  @exceptionHandlerTrigger("SlowQuery Trigger Error")
  async handler(): Promise<SchedulerTriggerResponse<string>> {
    await this._container
      .get<KVSSchemaMigrationService>(FORGE_INJECTION_TOKENS.KVSSchemaMigrationService)
      .clearVersion();
    return dropSchemaMigrations();
  }
}

export default new DropSchemaMigrationTrigger();
