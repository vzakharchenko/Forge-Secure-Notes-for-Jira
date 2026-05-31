// SPDX-FileCopyrightText: 2025 Trust Logic / Vasyl Zakharchenko
// SPDX-License-Identifier: BUSL-1.1

import { injectable } from "inversify";
import { AsyncEvent } from "@forge/events";
import { printDegradationQueriesConsumer } from "forge-sql-orm";
import { FORGE_SQL_ORM } from "../database";

@injectable()
export class AsyncService {
  async catchDegradation(event: AsyncEvent) {
    await printDegradationQueriesConsumer(FORGE_SQL_ORM, event);
  }
}
