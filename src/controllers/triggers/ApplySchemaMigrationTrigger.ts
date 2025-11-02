import { schedulerTrigger } from "../../core/decorators/SchedulerDecorator";
import { SchedulerTrigger, SchedulerTriggerResponse } from "../../core/trigger/SchedulerTrigger";
import { exceptionHandlerTrigger } from "../../core/decorators/ExceptionHandlerDecorator";
import { applySchemaMigrations, getHttpResponse } from "forge-sql-orm";
import migration from "../../database/migration";
import { KVS_SCHEMA_MIGRATION_SERVICE } from "../../core/services/KVSSchemaMigrationService";

@schedulerTrigger
class ApplySchemaMigrationTrigger implements SchedulerTrigger {
  @exceptionHandlerTrigger("SlowQuery Trigger Error")
  async handler(): Promise<SchedulerTriggerResponse<string>> {
    if (!(await KVS_SCHEMA_MIGRATION_SERVICE.isLatestVersion())) {
      const response = await applySchemaMigrations(migration);
      await KVS_SCHEMA_MIGRATION_SERVICE.setLatestVersion();
      return response;
    } else {
      return getHttpResponse(200, "NOT NEEDED");
    }
  }
}

export default new ApplySchemaMigrationTrigger();
