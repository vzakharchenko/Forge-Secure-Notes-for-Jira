import { SECURITY_NOTE_SERVICE } from "../../core/services/SecurityNoteService";
import { schedulerTrigger } from "../../core/decorators/SchedulerDecorator";
import { SchedulerTrigger, SchedulerTriggerResponse } from "../../core/trigger/SchedulerTrigger";
import { exceptionHandlerTrigger } from "../../core/decorators/ExceptionHandlerDecorator";
import { clearCacheSchedulerTrigger } from "forge-sql-orm";

@schedulerTrigger
class FiveMinutesTrigger implements SchedulerTrigger {
  @exceptionHandlerTrigger("Five Minutes Trigger Error")
  async handler(): Promise<SchedulerTriggerResponse<string>> {
    await SECURITY_NOTE_SERVICE.expireSecurityNotes();
    return await clearCacheSchedulerTrigger({ cacheEntityName: "cache", logRawSqlQuery: true });
  }
}

export default new FiveMinutesTrigger();
