import { describe, it, expect, vi, beforeEach } from "vitest";
import ApplySchemaMigrationTrigger from "../../../../src/controllers/triggers/ApplySchemaMigrationTrigger";
import * as forgeSqlOrm from "forge-sql-orm";

const mockKVSSchemaMigrationServiceInstance = {
  isLatestVersion: vi.fn(),
  setLatestVersion: vi.fn(),
};

// Mock KVSSchemaMigrationService as a class
vi.mock("../../../../src/services", () => {
  class MockKVSSchemaMigrationService {
    isLatestVersion = mockKVSSchemaMigrationServiceInstance.isLatestVersion;
    setLatestVersion = mockKVSSchemaMigrationServiceInstance.setLatestVersion;
  }
  return {
    KVSSchemaMigrationService: MockKVSSchemaMigrationService,
  };
});

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
      // Mock isLatestVersion to return false
      mockKVSSchemaMigrationServiceInstance.isLatestVersion.mockResolvedValue(false);

      const mockResponse = { statusCode: 200, body: "Migrations applied" };
      vi.mocked(forgeSqlOrm.applySchemaMigrations).mockResolvedValue(mockResponse as any);

      const result = await trigger.handler();

      expect(result).toEqual(mockResponse);
      expect(forgeSqlOrm.applySchemaMigrations).toHaveBeenCalledWith(expect.any(Function));
      expect(mockKVSSchemaMigrationServiceInstance.setLatestVersion).toHaveBeenCalled();
    });

    it("should return NOT NEEDED when already latest version", async () => {
      // Mock isLatestVersion to return true (already latest)
      mockKVSSchemaMigrationServiceInstance.isLatestVersion.mockResolvedValue(true);

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
