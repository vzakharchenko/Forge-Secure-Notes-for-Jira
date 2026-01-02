import { describe, it, expect, vi, beforeEach } from "vitest";
import { KVSSchemaMigrationService } from "../../../src/services";
import { kvs } from "@forge/kvs";
import { MIGRATION_VERSION } from "../../../src/database/migration/migrationCount";

vi.mock("@forge/kvs", () => ({
  kvs: {
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("KVSSchemaMigrationService", () => {
  let service: KVSSchemaMigrationService;
  const mockKvs = vi.mocked(kvs);

  beforeEach(() => {
    service = new KVSSchemaMigrationService();
    vi.clearAllMocks();
  });

  describe("isLatestVersion", () => {
    it("should return true when current version matches MIGRATION_VERSION", async () => {
      mockKvs.get.mockResolvedValue(`${MIGRATION_VERSION}` as any);

      const result = await service.isLatestVersion();

      expect(result).toBe(true);
      expect(mockKvs.get).toHaveBeenCalledWith("CURRENT_VERSION");
    });

    it("should return false when current version does not match", async () => {
      mockKvs.get.mockResolvedValue("2" as any);

      const result = await service.isLatestVersion();

      expect(result).toBe(false);
    });

    it("should return false when version is undefined", async () => {
      mockKvs.get.mockResolvedValue(undefined);

      const result = await service.isLatestVersion();

      expect(result).toBe(false);
    });
  });

  describe("setLatestVersion", () => {
    it("should set current version to MIGRATION_VERSION", async () => {
      await service.setLatestVersion();

      expect(mockKvs.set).toHaveBeenCalledTimes(1);
      expect(mockKvs.set).toHaveBeenCalledWith("CURRENT_VERSION", `${MIGRATION_VERSION}`);
    });
  });

  describe("clearVersion", () => {
    it("should delete CURRENT_VERSION from KVS", async () => {
      await service.clearVersion();

      expect(mockKvs.delete).toHaveBeenCalledTimes(1);
      expect(mockKvs.delete).toHaveBeenCalledWith("CURRENT_VERSION");
    });
  });
});
