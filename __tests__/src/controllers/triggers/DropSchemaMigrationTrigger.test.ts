import { describe, it, expect, vi, beforeEach } from "vitest";
import DropSchemaMigrationTrigger from "../../../../src/controllers/triggers/DropSchemaMigrationTrigger";
import * as forgeSqlOrm from "forge-sql-orm";
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
    dropSchemaMigrations: vi.fn(),
  };
});

describe("DropSchemaMigrationTrigger", () => {
  let trigger: typeof DropSchemaMigrationTrigger;

  beforeEach(() => {
    trigger = DropSchemaMigrationTrigger;
    vi.clearAllMocks();
  });

  describe("handler", () => {
    it("should clear version and drop migrations", async () => {
      const mockResponse = { statusCode: 200, body: "Migrations dropped" };
      vi.mocked(forgeSqlOrm.dropSchemaMigrations).mockResolvedValue(mockResponse as any);
      vi.mocked(kvs.delete).mockResolvedValue(undefined);

      const result = await trigger.handler();

      expect(result).toEqual(mockResponse);
      expect(kvs.delete).toHaveBeenCalled();
      expect(forgeSqlOrm.dropSchemaMigrations).toHaveBeenCalled();
    });
  });
});
