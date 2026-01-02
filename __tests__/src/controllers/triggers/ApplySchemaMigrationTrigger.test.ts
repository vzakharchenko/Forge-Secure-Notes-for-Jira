import { describe, it, expect, vi, beforeEach } from "vitest";
import ApplySchemaMigrationTrigger from "../../../../src/controllers/triggers/ApplySchemaMigrationTrigger";
import * as forgeSqlOrm from "forge-sql-orm";
import migration from "../../../../src/database/migration";
import { kvs } from "@forge/kvs";

vi.mock("@forge/kvs", () => ({
  kvs: {
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("forge-sql-orm", async (importOriginal) => {
  const actual = await importOriginal<typeof forgeSqlOrm>();
  return {
    ...actual,
    applySchemaMigrations: vi.fn(),
    getHttpResponse: vi.fn(),
  };
});

vi.mock("../../../../src/database/migration", () => ({
  default: vi.fn(),
}));

describe("ApplySchemaMigrationTrigger", () => {
  let trigger: typeof ApplySchemaMigrationTrigger;

  beforeEach(() => {
    trigger = ApplySchemaMigrationTrigger;
    vi.clearAllMocks();
  });

  describe("handler", () => {
    it("should apply migrations when not latest version", async () => {
      // Mock KVS to return false for isLatestVersion
      vi.mocked(kvs.get).mockResolvedValue(undefined);

      const mockResponse = { statusCode: 200, body: "Migrations applied" };
      vi.mocked(forgeSqlOrm.applySchemaMigrations).mockResolvedValue(mockResponse as any);

      const result = await trigger.handler();

      expect(result).toEqual(mockResponse);
      expect(forgeSqlOrm.applySchemaMigrations).toHaveBeenCalledWith(migration);
      expect(kvs.set).toHaveBeenCalled();
    });

    it("should return NOT NEEDED when already latest version", async () => {
      // Mock KVS to return current version (latest)
      vi.mocked(kvs.get).mockResolvedValue("3" as any);

      const mockResponse = {
        statusCode: 200,
        body: "NOT NEEDED",
        statusText: "Ok",
        headers: { "Content-Type": ["application/json"] },
      };
      vi.mocked(forgeSqlOrm.getHttpResponse).mockReturnValue(mockResponse as any);

      const result = await trigger.handler();

      expect(result).toEqual(mockResponse);
      expect(forgeSqlOrm.applySchemaMigrations).not.toHaveBeenCalled();
      expect(forgeSqlOrm.getHttpResponse).toHaveBeenCalledWith(200, "NOT NEEDED");
    });
  });
});
