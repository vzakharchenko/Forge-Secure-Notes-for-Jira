import {SECURITY_NOTE_SERVICE} from "../../core/services/SecurityNoteService";
import {schedulerTrigger} from "../../core/decorators/SchedulerDecorator";
import {SchedulerTrigger, SchedulerTriggerResponse} from "../../core/trigger/SchedulerTrigger";
import {exceptionHandlerTrigger} from "../../core/decorators/ExceptionHandlerDecorator";
import {applySchemaMigrations} from "forge-sql-orm";
import migration from "../../database/migration";

@schedulerTrigger
class FiveMinutesTrigger implements SchedulerTrigger {

    @exceptionHandlerTrigger("Five Minutes Trigger Error")
    async handler(): Promise<SchedulerTriggerResponse<string>> {
        const response = await applySchemaMigrations(migration);
        await SECURITY_NOTE_SERVICE.expireSecurityNotes();
        return response;
    }
}

export default new FiveMinutesTrigger();
