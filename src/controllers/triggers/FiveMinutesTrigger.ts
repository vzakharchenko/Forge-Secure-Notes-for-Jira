import {
  schedulerTrigger,
  exceptionHandlerTrigger,
  SchedulerTrigger,
  SchedulerTriggerRequest,
  SchedulerTriggerResponse,
} from "../../core";
import {
  SecurityNoteService,
  AnalyticService,
  BootstrapService,
  AppEventService,
} from "../../services";
import { clearCacheSchedulerTrigger } from "forge-sql-orm";
import { FORGE_SQL_ORM, SecurityNoteRepository } from "../../database";
import { Container } from "inversify";
import { FORGE_INJECTION_TOKENS } from "../../constants";
import { JiraUserService } from "../../jira";
import { SecurityStorage } from "../../storage";
import { useDiContainer, diContainer } from "../../core/decorators";

const FIVE_MINUTES_BINDINGS = [
  { name: FORGE_INJECTION_TOKENS.AnalyticService, bind: AnalyticService },
  { name: FORGE_INJECTION_TOKENS.SecurityNoteService, bind: SecurityNoteService },
  { name: FORGE_INJECTION_TOKENS.JiraUserService, bind: JiraUserService },
  { name: FORGE_INJECTION_TOKENS.SecurityNoteRepository, bind: SecurityNoteRepository },
  { name: FORGE_INJECTION_TOKENS.SecurityStorage, bind: SecurityStorage },
  { name: FORGE_INJECTION_TOKENS.BootstrapService, bind: BootstrapService },
  { name: FORGE_INJECTION_TOKENS.AppEventService, bind: AppEventService },
] as const;

@schedulerTrigger
class FiveMinutesTrigger implements SchedulerTrigger {
  @diContainer(...FIVE_MINUTES_BINDINGS)
  private readonly _container!: Container;

  @useDiContainer("_container")
  @exceptionHandlerTrigger("Five Minutes Trigger Error")
  async handler(request: SchedulerTriggerRequest): Promise<SchedulerTriggerResponse<string>> {
    const securityNoteService = this._container.get<SecurityNoteService>(
      FORGE_INJECTION_TOKENS.SecurityNoteService,
    );
    return FORGE_SQL_ORM.executeWithMetadata(
      async () => {
        await securityNoteService.expireSecurityNotes();
        return await clearCacheSchedulerTrigger({ cacheEntityName: "cache", logRawSqlQuery: true });
      },
      async (totalDbExecutionTime, totalResponseSize, printQueriesWithPlan) => {
        const resolverName = request.context.moduleKey;
        if (totalDbExecutionTime > 2000) {
          // eslint-disable-next-line no-console
          console.warn(
            `Resolver ${resolverName} has high database execution time: ${totalDbExecutionTime}ms`,
          );
          await printQueriesWithPlan();
        } else if (totalDbExecutionTime > 1000) {
          // eslint-disable-next-line no-console
          console.debug(
            `Resolver ${resolverName} has high database execution time: ${totalDbExecutionTime}ms`,
          );
        }
      },
    );
  }
}

export default new FiveMinutesTrigger();
