// SPDX-FileCopyrightText: 2025 Trust Logic / Vasyl Zakharchenko
// SPDX-License-Identifier: BUSL-1.1

import {
  exceptionHandlerTrigger,
  schedulerTrigger,
  SchedulerTrigger,
  SchedulerTriggerResponse,
} from "../../core";
import { slowQuerySchedulerTrigger } from "forge-sql-orm";
import { FORGE_SQL_ORM } from "../../database";

@schedulerTrigger
class SlowQueryTrigger implements SchedulerTrigger {
  @exceptionHandlerTrigger("SlowQuery Trigger Error")
  async handler(): Promise<SchedulerTriggerResponse<string>> {
    return slowQuerySchedulerTrigger(FORGE_SQL_ORM, { hours: 24, timeout: 3000 });
  }
}

export default new SlowQueryTrigger();
