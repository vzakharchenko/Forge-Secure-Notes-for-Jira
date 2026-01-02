import { describe, it, expect, vi, beforeEach } from "vitest";
import SlowQueryTriggerTrigger from "../../../../src/controllers/triggers/SlowQueryTriggerTrigger";
import { FORGE_SQL_ORM } from "../../../../src/database";
import * as forgeSqlOrm from "forge-sql-orm";

vi.mock("forge-sql-orm", async (importOriginal) => {
  const actual = await importOriginal<typeof forgeSqlOrm>();
  return {
    ...actual,
    slowQuerySchedulerTrigger: vi.fn(),
  };
});

vi.mock("../../../../src/database/DbUtils", () => ({
  FORGE_SQL_ORM: {},
}));

describe("SlowQueryTriggerTrigger", () => {
  let trigger: typeof SlowQueryTriggerTrigger;

  beforeEach(() => {
    trigger = SlowQueryTriggerTrigger;
    vi.clearAllMocks();
  });

  describe("handler", () => {
    it("should call slowQuerySchedulerTrigger with correct parameters", async () => {
      const mockResponse = { statusCode: 200, body: "Slow queries processed" };
      vi.mocked(forgeSqlOrm.slowQuerySchedulerTrigger).mockResolvedValue(mockResponse as any);

      const result = await trigger.handler();

      expect(result).toEqual(mockResponse);
      expect(forgeSqlOrm.slowQuerySchedulerTrigger).toHaveBeenCalledWith(FORGE_SQL_ORM, {
        hours: 24,
        timeout: 3000,
      });
    });
  });
});
