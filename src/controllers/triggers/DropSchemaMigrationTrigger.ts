import {schedulerTrigger} from "../../core/decorators/SchedulerDecorator";
import {SchedulerTrigger, SchedulerTriggerResponse} from "../../core/trigger/SchedulerTrigger";
import {exceptionHandlerTrigger} from "../../core/decorators/ExceptionHandlerDecorator";
import {dropSchemaMigrations} from "forge-sql-orm";
import {KVS_SCHEMA_MIGRATION_SERVICE} from "../../core/services/KVSSchemaMigrationService";

@schedulerTrigger
class DropSchemaMigrationTrigger implements SchedulerTrigger {

    @exceptionHandlerTrigger("SlowQuery Trigger Error")
    async handler(): Promise<SchedulerTriggerResponse<string>> {
        await KVS_SCHEMA_MIGRATION_SERVICE.clearVersion();
        return dropSchemaMigrations();
    }
}

export default new DropSchemaMigrationTrigger();