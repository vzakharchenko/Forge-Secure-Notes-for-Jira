import { SECURITY_NOTE_SERVICE } from "../../core/services/SecurityNoteService";
import { schedulerTrigger } from "../../core/decorators/SchedulerDecorator";
import {
  SchedulerTrigger,
  SchedulerTriggerRequest,
  SchedulerTriggerResponse,
} from "../../core/trigger/SchedulerTrigger";
import { exceptionHandlerTrigger } from "../../core/decorators/ExceptionHandlerDecorator";
import { clearCacheSchedulerTrigger } from "forge-sql-orm";
import { FORGE_SQL_ORM } from "../../database/DbUtils";
import { ANALYTIC_SERVICE } from "../../core/services/AnalyticService";

@schedulerTrigger
class FiveMinutesTrigger implements SchedulerTrigger {
  @exceptionHandlerTrigger("Five Minutes Trigger Error")
  async handler(request: SchedulerTriggerRequest): Promise<SchedulerTriggerResponse<string>> {
    return FORGE_SQL_ORM.executeWithMetadata(
      async () => {
        await SECURITY_NOTE_SERVICE.expireSecurityNotes();
        return await clearCacheSchedulerTrigger({ cacheEntityName: "cache", logRawSqlQuery: true });
      },
      async (totalDbExecutionTime, totalResponseSize, printQueriesWithPlan) => {
        const resolverName = request.context.moduleKey;
        await ANALYTIC_SERVICE.sendAnalytics(
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
