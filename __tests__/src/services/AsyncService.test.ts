import { describe, it, expect, vi, beforeEach } from "vitest";
import { AsyncService } from "../../../src/services";
import { AsyncEvent } from "@forge/events";
import { FORGE_SQL_ORM } from "../../../src/database";
import * as forgeSqlOrm from "forge-sql-orm";

vi.mock("forge-sql-orm", async (importOriginal) => {
  const actual = await importOriginal<typeof forgeSqlOrm>();
  return {
    ...actual,
    printDegradationQueriesConsumer: vi.fn(),
  };
});

vi.mock("../../../src/database/DbUtils", () => ({
  FORGE_SQL_ORM: {},
}));

describe("AsyncService", () => {
  let service: AsyncService;

  beforeEach(() => {
    service = new AsyncService();
    vi.clearAllMocks();
  });

  describe("catchDegradation", () => {
    it("should call printDegradationQueriesConsumer with FORGE_SQL_ORM and event", async () => {
      const mockEvent: AsyncEvent = {
        cloudId: "test-cloud-id",
        eventType: "test-event",
        payload: {},
      } as AsyncEvent;

      await service.catchDegradation(mockEvent);

      expect(forgeSqlOrm.printDegradationQueriesConsumer).toHaveBeenCalledTimes(1);
      expect(forgeSqlOrm.printDegradationQueriesConsumer).toHaveBeenCalledWith(
        FORGE_SQL_ORM,
        mockEvent,
      );
    });
  });
});
