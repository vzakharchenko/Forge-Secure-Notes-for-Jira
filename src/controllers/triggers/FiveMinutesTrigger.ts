import {
  SecurityNoteService,
  AnalyticService,
  schedulerTrigger,
  exceptionHandlerTrigger,
  SchedulerTrigger,
  SchedulerTriggerRequest,
  SchedulerTriggerResponse,
} from "../../core";
import { clearCacheSchedulerTrigger } from "forge-sql-orm";
import { FORGE_SQL_ORM, SecurityNoteRepository } from "../../database";
import { Container } from "inversify";
import { FORGE_INJECTION_TOKENS } from "../../constants";
import { JiraUserService } from "../../user";
import { SecurityStorage } from "../../storage";

@schedulerTrigger
class FiveMinutesTrigger implements SchedulerTrigger {
  container(): Container {
    const container = new Container();
    container.bind(FORGE_INJECTION_TOKENS.AnalyticService).to(AnalyticService);
    container.bind(FORGE_INJECTION_TOKENS.SecurityNoteService).to(SecurityNoteService);
    container.bind(FORGE_INJECTION_TOKENS.JiraUserService).to(JiraUserService);
    container.bind(FORGE_INJECTION_TOKENS.SecurityNoteRepository).to(SecurityNoteRepository);
    container.bind(FORGE_INJECTION_TOKENS.SecurityStorage).to(SecurityStorage);
    return container;
  }
  @exceptionHandlerTrigger("Five Minutes Trigger Error")
  async handler(request: SchedulerTriggerRequest): Promise<SchedulerTriggerResponse<string>> {
    const analyticService = this.container().get<AnalyticService>(
      FORGE_INJECTION_TOKENS.AnalyticService,
    );
    const securityNoteService = this.container().get<SecurityNoteService>(
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
