import {
  exceptionHandlerTrigger,
  schedulerTrigger,
  SchedulerTrigger,
  SchedulerTriggerResponse,
} from "../../core";
import { slowQuerySchedulerTrigger } from "forge-sql-orm";
import { FORGE_SQL_ORM } from "../../database";
import { Container } from "inversify";

@schedulerTrigger
class SlowQueryTrigger implements SchedulerTrigger {
  container(): Container {
    return new Container();
  }
  @exceptionHandlerTrigger("SlowQuery Trigger Error")
  async handler(): Promise<SchedulerTriggerResponse<string>> {
    return slowQuerySchedulerTrigger(FORGE_SQL_ORM, { hours: 1, timeout: 3000 });
  }
}

export default new SlowQueryTrigger();
