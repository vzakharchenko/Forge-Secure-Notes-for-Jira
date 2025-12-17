import { injectable } from "inversify";
import { AsyncEvent } from "@forge/events";
import { printDegradationQueriesConsumer } from "forge-sql-orm";
import { FORGE_SQL_ORM } from "../../database";

@injectable()
export class AsyncService {
  async catchDegradation(event: AsyncEvent) {
    await printDegradationQueriesConsumer(FORGE_SQL_ORM, event);
  }
}
