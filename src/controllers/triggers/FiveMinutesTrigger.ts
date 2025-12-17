import {
  SecurityNoteService,
  AnalyticService,
  schedulerTrigger,
  exceptionHandlerTrigger,
  SchedulerTrigger,
  SchedulerTriggerRequest,
  SchedulerTriggerResponse,
  BootstrapService,
} from "../../core";
import { clearCacheSchedulerTrigger } from "forge-sql-orm";
import { FORGE_SQL_ORM, SecurityNoteRepository } from "../../database";
import { Container } from "inversify";
import { FORGE_INJECTION_TOKENS } from "../../constants";
import { JiraUserService } from "../../user";
import { SecurityStorage } from "../../storage";
import { useDiContainer, diContainer } from "../../core/decorators";

const FIVE_MINUTES_BINDINGS = [
  { name: FORGE_INJECTION_TOKENS.AnalyticService, bind: AnalyticService },
  { name: FORGE_INJECTION_TOKENS.SecurityNoteService, bind: SecurityNoteService },
  { name: FORGE_INJECTION_TOKENS.JiraUserService, bind: JiraUserService },
  { name: FORGE_INJECTION_TOKENS.SecurityNoteRepository, bind: SecurityNoteRepository },
  { name: FORGE_INJECTION_TOKENS.SecurityStorage, bind: SecurityStorage },
  { name: FORGE_INJECTION_TOKENS.BootstrapService, bind: BootstrapService },
] as const;

@schedulerTrigger
class FiveMinutesTrigger implements SchedulerTrigger {
  @diContainer(...FIVE_MINUTES_BINDINGS)
  private _container!: Container;

  @useDiContainer("_container")
  @exceptionHandlerTrigger("Five Minutes Trigger Error")
  async handler(request: SchedulerTriggerRequest): Promise<SchedulerTriggerResponse<string>> {
    const analyticService = this._container.get<AnalyticService>(
      FORGE_INJECTION_TOKENS.AnalyticService,
    );
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
        await analyticService.sendAnalytics(
          "sql_5mins_performance",
          resolverName,
          request.context.cloudId,
          { totalDbExecutionTime, totalResponseSize },
        );
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
