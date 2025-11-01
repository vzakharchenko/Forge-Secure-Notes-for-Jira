import {schedulerTrigger} from "../../core/decorators/SchedulerDecorator";
import {SchedulerTrigger, SchedulerTriggerResponse} from "../../core/trigger/SchedulerTrigger";
import {exceptionHandlerTrigger} from "../../core/decorators/ExceptionHandlerDecorator";
import {
    slowQuerySchedulerTrigger
} from "forge-sql-orm";
import {FORGE_SQL_ORM} from "../../database/DbUtils";

@schedulerTrigger
class SlowQueryTrigger implements SchedulerTrigger {

    @exceptionHandlerTrigger("SlowQuery Trigger Error")
    async handler(): Promise<SchedulerTriggerResponse<string>> {
        return slowQuerySchedulerTrigger(FORGE_SQL_ORM, { hours: 1, timeout: 3000 });
    }
}

export default new SlowQueryTrigger();